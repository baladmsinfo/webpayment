// src/utils/exportCsv.js
// Client-side CSV export for report tables.

function escapeCsvValue(val) {
  if (val === null || val === undefined) return "";
  const s = String(val);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function downloadCsv(filename, rows, columns) {
  if (!rows || !rows.length) return;

  const cols = columns && columns.length
    ? columns
    : Object.keys(rows[0]).map((key) => ({ key, label: key }));

  const header = cols.map((c) => escapeCsvValue(c.label)).join(",");
  const body = rows
    .map((row) => cols.map((c) => escapeCsvValue(row[c.key])).join(","))
    .join("\n");
  const csv = `${header}\n${body}`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
