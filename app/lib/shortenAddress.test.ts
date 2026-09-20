import { describe, it, expect } from "vitest";
import { shortenAddress } from "./shortenAddress";

const ADDRESS = "GBWMCCC3NHSKLAOJDBKKYW7SSH2PFTTNVFKWKH6BDLSZRA4ZBXVQBBK";

describe("shortenAddress", () => {
  it("defaults to 4 leading and 4 trailing characters", () => {
    expect(shortenAddress(ADDRESS)).toBe("GBWM...QBBK");
  });

  it("accepts a custom character count", () => {
    expect(shortenAddress(ADDRESS, 6)).toBe("GBWMCC...XVQBBK");
  });
});
