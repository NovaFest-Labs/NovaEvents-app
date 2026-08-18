export function formatUsdc(stroops: string): string {
  return `${(Number(stroops) / 10_000_000).toLocaleString()} USDC`;
}
