"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

interface QrScannerProps {
  onDecode: (payload: string) => void;
  /** Pause the decode loop, e.g. while a scanned payload is being verified. */
  paused?: boolean;
}

/**
 * Reads QR codes from the device camera by sampling video frames onto a
 * hidden canvas and decoding them with jsQR. Calls onCameraUnavailable-style
 * behavior is left to the parent: this component reports its own permission
 * state so the parent can fall back to manual ticket ID entry.
 */
export default function QrScanner({ onDecode, paused = false }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let frameId: number;
    let cancelled = false;

    async function start() {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setCameraError("Camera access is not available on this device.");
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        tick();
      } catch {
        setCameraError("Camera access was denied or is unavailable.");
      }
    }

    function tick() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      if (!paused) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const result = jsQR(imageData.data, imageData.width, imageData.height);
          if (result?.data) {
            onDecode(result.data);
          }
        }
      }

      frameId = requestAnimationFrame(tick);
    }

    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      stream?.getTracks().forEach((track) => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  if (cameraError) {
    return (
      <p role="alert" className="text-sm text-amber-400">
        {cameraError} Enter the ticket ID manually below.
      </p>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden bg-black">
      <video
        ref={videoRef}
        muted
        playsInline
        aria-label="Camera preview for scanning a ticket QR code"
        className="w-full max-w-xs mx-auto"
      />
      <canvas ref={canvasRef} hidden />
    </div>
  );
}
