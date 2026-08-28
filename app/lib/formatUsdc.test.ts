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

  it("does not round the smallest nonzero amount down to 0", () => {
    // 1 stroop is the smallest possible nonzero USDC amount (0.0000001 USDC).
    expect(formatUsdc("1")).toBe("0.0000001 USDC");
  });

  it("preserves full 7-decimal precision, not just 3", () => {
    expect(formatUsdc("10000001")).toBe("1.0000001 USDC");
  });

  it("formats very large amounts without scientific notation", () => {
    expect(formatUsdc("1000000000000000")).toBe("100,000,000 USDC");
  });
});
