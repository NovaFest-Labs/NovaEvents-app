/**
 * Truncates a Stellar address for display, keeping `chars` characters at
 * each end (e.g. "GBWM...VBBK" with the default of 4).
 */
export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
