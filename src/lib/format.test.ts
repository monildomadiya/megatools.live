import { describe, expect, it } from "vitest";
import { formatDate, formatNumber, formatPercent, formatUSD } from "./format";
describe("en-US formatting", () => {
  it("formats integer cents including negative and zero amounts", () => {
    expect(formatUSD(123456)).toBe("$1,234.56");
    expect(formatUSD(-125)).toBe("-$1.25");
    expect(formatUSD(0)).toBe("$0.00");
  });
  it("formats numbers, ratios and date-only strings consistently", () => {
    expect(formatNumber(12345)).toBe("12,345");
    expect(formatPercent(0.125)).toBe("12.5%");
    expect(formatDate("2027-01-01")).toBe("Jan 1, 2027");
  });
});
