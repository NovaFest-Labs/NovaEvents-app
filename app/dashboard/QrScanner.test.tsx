import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import QrScanner from "./QrScanner";

vi.mock("jsqr", () => ({ default: vi.fn() }));
import jsQR from "jsqr";

const mockJsQR = vi.mocked(jsQR);

function mockCameraAvailable() {
  const track = { stop: vi.fn() };
  const stream = { getTracks: () => [track] } as unknown as MediaStream;

  Object.defineProperty(navigator, "mediaDevices", {
    value: { getUserMedia: vi.fn().mockResolvedValue(stream) },
    configurable: true,
  });

  HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);

  Object.defineProperty(HTMLVideoElement.prototype, "readyState", {
    configurable: true,
    get: () => 4, // HAVE_ENOUGH_DATA
  });
  Object.defineProperty(HTMLVideoElement.prototype, "videoWidth", {
    configurable: true,
    get: () => 10,
  });
  Object.defineProperty(HTMLVideoElement.prototype, "videoHeight", {
    configurable: true,
    get: () => 10,
  });

  const fakeCtx = {
    drawImage: vi.fn(),
    getImageData: vi.fn().mockReturnValue({
      data: new Uint8ClampedArray(4),
      width: 10,
      height: 10,
    }),
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    fakeCtx as unknown as CanvasRenderingContext2D
  );

  return { track };
}

beforeEach(() => {
  cleanup();
  mockJsQR.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("QrScanner", () => {
  it("falls back to a manual-entry prompt when the camera is unavailable", async () => {
    render(<QrScanner onDecode={vi.fn()} />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /Camera access is not available|Enter the ticket ID manually/
    );
  });

  it("calls onDecode with the decoded payload once a QR code is read", async () => {
    mockCameraAvailable();
    mockJsQR.mockReturnValue({ data: "ticket-payload" } as unknown as ReturnType<
      typeof jsQR
    >);
    const onDecode = vi.fn();

    render(<QrScanner onDecode={onDecode} />);

    await waitFor(() => expect(onDecode).toHaveBeenCalledWith("ticket-payload"));
  });

  it("does not decode while paused", async () => {
    mockCameraAvailable();
    mockJsQR.mockReturnValue({ data: "ticket-payload" } as unknown as ReturnType<
      typeof jsQR
    >);
    const onDecode = vi.fn();

    render(<QrScanner onDecode={onDecode} paused />);

    await new Promise((r) => setTimeout(r, 50));
    expect(onDecode).not.toHaveBeenCalled();
  });

  it("calls the latest onDecode passed by the parent, not a stale one from mount", async () => {
    mockCameraAvailable();
    mockJsQR.mockReturnValue({ data: "ticket-payload" } as unknown as ReturnType<
      typeof jsQR
    >);
    const staleOnDecode = vi.fn();

    const { rerender } = render(<QrScanner onDecode={staleOnDecode} />);
    await waitFor(() => expect(staleOnDecode).toHaveBeenCalled());

    const latestOnDecode = vi.fn();
    rerender(<QrScanner onDecode={latestOnDecode} />);
    staleOnDecode.mockClear();

    await waitFor(() => expect(latestOnDecode).toHaveBeenCalledWith("ticket-payload"));
    expect(staleOnDecode).not.toHaveBeenCalled();
  });
});
