// app/composables/useDocumentUpload.ts
//
// Generic, registry-driven document upload/save logic shared by every
// document type in the KYC document-collection step (single image docs and
// front/back docs alike). Callers look up doc metadata via documentRegistry
// (docId/docName/docIsBack/requiresNumber) instead of switching on doc code.

import { useIsgOnboardingApi } from "~/composables/apis/Useisgonboardingapi";
import { getDocMeta } from "~/utils/documentRegistry";

export interface DocUploadState {
  files: File[];
  docNumber: string;
  imageIds: (number | string)[];
  frontFile: File | null;
  backFile: File | null;
  frontId: number | string | null;
  backId: number | string | null;
}

export interface SaveDocumentContext {
  merchantId?: string;
  businessType?: string;
  uploadedBy?: string;
}

export function useDocumentUpload() {
  const { uploadDoc, complianceInit } = useIsgOnboardingApi();

  function createUploadState(): DocUploadState {
    return {
      files: [],
      docNumber: "",
      imageIds: [],
      frontFile: null,
      backFile: null,
      frontId: null,
      backId: null,
    };
  }

  async function uploadImage(code: string, file: File, side?: "front" | "back", businessType?: string) {
    const meta = getDocMeta(code, businessType);
    // For docs where front/back are two different documents (e.g. MOA=129 vs
    // AOA=130), tag the back side with backDocId; otherwise both sides share docId.
    const docid = side === "back" ? (meta.backDocId ?? meta.docId) : meta.docId;
    const filename = `${docid}_${code}${side ? `_${side}` : ""}`;
    const res = await uploadDoc(file, { filename, docid });
    const statusCode = res?.data?.statusCode || res?.statusCode;
    if (statusCode !== "00") {
      throw new Error(res?.data?.message || res?.message || "Image upload failed");
    }
    return res?.data?.data?.id || res?.data?.id;
  }

  function buildDocumentNumber(code: string, doc: DocUploadState, businessType?: string) {
    const meta = getDocMeta(code, businessType);
    if (meta.requiresNumber) return doc.docNumber;
    return `${code}_${Date.now()}`;
  }

  async function saveDocument(code: string, doc: DocUploadState, ctx: SaveDocumentContext = {}) {
    const meta = getDocMeta(code, ctx.businessType);
    const documentNumber = buildDocumentNumber(code, doc, ctx.businessType);
    const images = meta.requiresFrontBack ? [doc.frontId, doc.backId] : doc.imageIds;

    const payload = {
      // ── shape the backend's /compliance/docUpload handler consumes ──
      doc_type: code,
      doc_number: documentNumber,
      images,

      // ── extended metadata (additive — carried for traceability/future use) ──
      merchantId: ctx.merchantId,
      businessType: ctx.businessType,
      docId: meta.docId,
      docName: meta.docName,
      docIsBack: meta.docIsBack,
      documentNumber,
      frontImage: meta.requiresFrontBack ? doc.frontId : undefined,
      backImage: meta.requiresFrontBack ? doc.backId : undefined,
      uploadedBy: ctx.uploadedBy,
    };

    const res = await complianceInit(payload, ctx.merchantId);
    const statusCode = res?.data?.statusCode || res?.statusCode;
    if (statusCode !== "00") {
      throw new Error(res?.data?.message || res?.message || "Failed to save document");
    }
    return res;
  }

  return { createUploadState, uploadImage, saveDocument };
}
