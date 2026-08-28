export function formatUsdc(stroops: string): string {
  const usdc = Number(stroops) / 10_000_000;
  // USDC has 7 decimal places (1 stroop = 0.0000001 USDC). toLocaleString's
  // default of 3 max fraction digits silently rounds small amounts to 0.
  return `${usdc.toLocaleString(undefined, { maximumFractionDigits: 7 })} USDC`;
}
