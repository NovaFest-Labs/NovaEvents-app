import { describe, it, expect } from "vitest";
import { formatUsdc } from "./formatUsdc";

describe("formatUsdc", () => {
  it("converts stroops to a USDC display string", () => {
    expect(formatUsdc("10000000")).toBe("1 USDC");
  });

  it("handles zero", () => {
    expect(formatUsdc("0")).toBe("0 USDC");
  });

  it("adds thousands separators for large amounts", () => {
    expect(formatUsdc("12345000000")).toBe("1,234.5 USDC");
  });
});
