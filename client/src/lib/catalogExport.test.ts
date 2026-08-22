import { describe, expect, it } from "vitest";
import { rowsToCsv } from "./catalogExport";

describe("catalog exports", () => {
  it("creates a spreadsheet-compatible CSV with escaped commas and quotes", () => {
    const csv = rowsToCsv([{ Name: "TOPS, Shield", Notes: 'Quote "included"' }]);
    expect(csv).toBe('Name,Notes\r\n"TOPS, Shield","Quote ""included"""');
  });

  it("returns an empty value for an empty export", () => {
    expect(rowsToCsv([])).toBe("");
  });
});
