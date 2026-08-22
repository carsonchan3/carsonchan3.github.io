import * as XLSX from "xlsx";

type ExportValue = string | number | boolean | null | undefined;
export type CatalogExportRow = Record<string, ExportValue>;

const escapeCsv = (value: ExportValue) => {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export function rowsToCsv(rows: CatalogExportRow[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  return [headers.join(","), ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(","))].join("\r\n");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadCsv(rows: CatalogExportRow[], filename: string) {
  const csv = `\uFEFF${rowsToCsv(rows)}`;
  triggerDownload(new Blob([csv], { type: "text/csv;charset=utf-8" }), filename);
}

export function downloadExcel(rows: CatalogExportRow[], filename: string, sheetName: string) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
  XLSX.writeFile(workbook, filename, { compression: true });
}
