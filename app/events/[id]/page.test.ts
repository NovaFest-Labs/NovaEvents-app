import { describe, it, expect, vi, afterEach } from "vitest";
import { generateMetadata } from "./page";

// GenerateMetadata does not render the page component; mock EventDetail so the
// test never pulls the stellar-wallets-kit dependency chain (CJS interop fails
// under vitest transform).
vi.mock("./EventDetail", () => ({ default: () => null }));

// generateMetadata calls fetchEvent(), which uses global fetch against
// NEXT_PUBLIC_API_URL ("" in tests = same-origin).
function mockFetchOnce(body: unknown, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      json: async () => body,
    } as Response)
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("generateMetadata (app/events/[id]/page.tsx)", () => {
  it("includes OG/Twitter image metadata when the API returns an image_url", async () => {
    mockFetchOnce({
      id: "evt-1",
      name: "StellarFest 2026",
      description: "A festival for Stellar builders.",
      image_url: "https://cdn.example.com/covers/stellarfest.png",
    });

    const meta = await generateMetadata({ params: Promise.resolve({ id: "evt-1" }) });

    expect(meta.title).toBe("StellarFest 2026 — NovaEvents");
    expect(meta.openGraph?.images).toEqual([
      { url: "https://cdn.example.com/covers/stellarfest.png" },
    ]);
    const twitter1 = meta.twitter as
      | { card?: string; images?: Array<{ url: string }> }
      | undefined;
    expect(twitter1?.card).toBe("summary_large_image");
    expect(twitter1?.images).toEqual([
      { url: "https://cdn.example.com/covers/stellarfest.png" },
    ]);
  });

  it("sets no metadata image when image_url is absent (and does not crash)", async () => {
    mockFetchOnce({
      id: "evt-2",
      name: "No Cover Event",
      description: "This event has no uploaded cover.",
      // no image_url field at all — matches the API shape when none is set
    });

    const meta = await generateMetadata({ params: Promise.resolve({ id: "evt-2" }) });

    expect(meta.openGraph?.images).toBeUndefined();
    const twitter2 = meta.twitter as { card?: string } | undefined;
    expect(twitter2?.card).toBe("summary");
    expect(meta.twitter?.images).toBeUndefined();
  });

  it("reads image_url, not the legacy cover_image_url name", async () => {
    // Regression guard: the API returns image_url; if a caller passes
    // cover_image_url only, no metadata image should appear.
    mockFetchOnce({
      id: "evt-3",
      name: "Legacy Cover",
      description: "desc",
      cover_image_url: "https://cdn.example.com/covers/legacy.png",
    });

    const meta = await generateMetadata({ params: Promise.resolve({ id: "evt-3" }) });

    expect(meta.openGraph?.images).toBeUndefined();
    const twitter3 = meta.twitter as { card?: string } | undefined;
    expect(twitter3?.card).toBe("summary");
  });

  it("falls back to generic metadata when the event cannot be fetched", async () => {
    mockFetchOnce(null, false);

    const meta = await generateMetadata({ params: Promise.resolve({ id: "missing" }) });

    expect(meta.title).toBe("Event — NovaEvents");
    expect(meta.openGraph).toBeUndefined();
  });
});
