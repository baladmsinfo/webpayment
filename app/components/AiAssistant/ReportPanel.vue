<template>
  <div>
    <div class="d-flex flex-wrap align-center mb-4" style="gap: 16px;">
      <v-select
        v-model="type"
        :items="reportTypes"
        label="Report Type"
        density="compact"
        variant="outlined"
        hide-details
        style="min-width: 200px;"
      />
      <v-text-field v-model="from" type="date" label="From" density="compact" variant="outlined" hide-details style="min-width: 170px;" />
      <v-text-field v-model="to" type="date" label="To" density="compact" variant="outlined" hide-details style="min-width: 170px;" />
      <v-btn color="primary" :loading="generating" :disabled="!from || !to" @click="generate">
        <v-icon start>mdi-file-chart-outline</v-icon>
        Generate
      </v-btn>
    </div>

    <v-alert v-if="errorMessage" type="error" variant="tonal" density="compact" class="mb-4">
      {{ errorMessage }}
    </v-alert>

    <v-alert v-if="pending" type="info" variant="tonal" density="compact" class="mb-4">
      <div class="d-flex align-center">
        <v-progress-circular indeterminate size="18" width="2" class="mr-2" />
        This range is large — generating the report in the background ({{ jobState }})…
      </div>
    </v-alert>

    <template v-if="report">
      <v-card variant="outlined" class="mb-4">
        <v-card-title class="text-subtitle-1 font-weight-bold">Summary</v-card-title>
        <v-card-text>{{ report.summary }}</v-card-text>
      </v-card>

      <v-row>
        <v-col cols="12" md="6" v-if="report.highlights?.length">
          <v-card variant="outlined" class="fill-height">
            <v-card-title class="text-subtitle-2 d-flex align-center">
              <v-icon color="success" class="mr-2">mdi-trending-up</v-icon>Highlights
            </v-card-title>
            <v-list density="compact">
              <v-list-item v-for="(h, i) in report.highlights" :key="i">
                <v-list-item-title class="text-body-2">{{ h }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" v-if="report.risks?.length">
          <v-card variant="outlined" class="fill-height">
            <v-card-title class="text-subtitle-2 d-flex align-center">
              <v-icon color="warning" class="mr-2">mdi-alert-outline</v-icon>Risks
            </v-card-title>
            <v-list density="compact">
              <v-list-item v-for="(r, i) in report.risks" :key="i">
                <v-list-item-title class="text-body-2">{{ r }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" v-if="report.anomalies?.length">
          <v-card variant="outlined" class="fill-height">
            <v-card-title class="text-subtitle-2 d-flex align-center">
              <v-icon color="error" class="mr-2">mdi-alert-circle-outline</v-icon>Anomalies
            </v-card-title>
            <v-list density="compact">
              <v-list-item v-for="(a, i) in report.anomalies" :key="i">
                <v-list-item-title class="text-body-2">{{ a }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" v-if="report.recommendations?.length">
          <v-card variant="outlined" class="fill-height">
            <v-card-title class="text-subtitle-2 d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-lightbulb-on-outline</v-icon>Recommendations
            </v-card-title>
            <v-list density="compact">
              <v-list-item v-for="(r, i) in report.recommendations" :key="i">
                <v-list-item-title class="text-body-2">{{ r }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <v-expansion-panels class="mt-4" variant="accordion">
        <v-expansion-panel title="Raw metrics (exact backend-computed figures)">
          <v-expansion-panel-text>
            <pre class="metrics-json">{{ JSON.stringify(report.metrics, null, 2) }}</pre>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useAiApi, type AiReportResult } from "~/composables/apis/useAiApi";

const REPORT_TYPES = [
  "TRANSACTION", "AEPS", "DMT", "UPI", "CARD",
  "COMMISSION", "SETTLEMENT", "RECONCILIATION",
  "MERCHANT", "DISTRIBUTOR", "AGGREGATOR",
];

const { generateReport, getReportJob } = useAiApi();

const reportTypes = REPORT_TYPES;
const type = ref("TRANSACTION");

const today = new Date().toISOString().slice(0, 10);
const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const from = ref(monthAgo);
const to = ref(today);

const generating = ref(false);
const pending = ref(false);
const jobState = ref("");
const errorMessage = ref("");
const report = ref<AiReportResult | null>(null);

let pollTimer: ReturnType<typeof setInterval> | null = null;

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

async function pollJob(jobId: string) {
  pending.value = true;
  stopPolling();
  pollTimer = setInterval(async () => {
    try {
      const job = await getReportJob(jobId);
      if (!job?.found) {
        stopPolling();
        pending.value = false;
        errorMessage.value = "Report job not found";
        return;
      }
      jobState.value = job.state;
      if (job.state === "completed") {
        stopPolling();
        pending.value = false;
        report.value = job.result;
      } else if (job.state === "failed") {
        stopPolling();
        pending.value = false;
        errorMessage.value = job.failedReason || "Report generation failed";
      }
    } catch (e) {
      stopPolling();
      pending.value = false;
      errorMessage.value = "Lost connection while checking report status";
    }
  }, 3000);
}

async function generate() {
  errorMessage.value = "";
  report.value = null;
  generating.value = true;
  try {
    const result = await generateReport({ type: type.value, from: from.value, to: to.value });
    if (result.async) {
      jobState.value = "queued";
      await pollJob(result.jobId!);
    } else {
      report.value = result;
    }
  } catch (e: any) {
    errorMessage.value = e?.response?.data?.message || "Unable to generate report";
  } finally {
    generating.value = false;
  }
}

onBeforeUnmount(stopPolling);
</script>

<style scoped>
.metrics-json {
  font-size: 0.8rem;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 400px;
  overflow-y: auto;
}
</style>
