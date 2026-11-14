"use client";

import { useEffect, useRef, useState } from "react";

export type ToastType = "success" | "error";

const EXIT_ANIMATION_DELAY = 300;
const DEFAULT_DURATION = 5000;

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, message, type, duration = DEFAULT_DURATION, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const autoDismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (duration === 0) return;

    autoDismissTimerRef.current = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), EXIT_ANIMATION_DELAY);
    }, duration);

    return () => {
      if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
    };
  }, [duration, id, onClose]);

  function handleManualClose() {
    // Cancel the pending auto-dismiss timer — otherwise it fires later on
    // an already-unmounted toast and calls onClose a second time.
    if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
    setIsExiting(true);
    setTimeout(() => onClose(id), EXIT_ANIMATION_DELAY);
  }

  const baseStyles =
    "fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 max-w-sm z-50";
  const typeStyles = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
  };
  const exitStyles = isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0";

  const icons = {
    success: "✓",
    error: "✕",
  };

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`${baseStyles} ${typeStyles[type]} ${exitStyles}`}
    >
      <span className="text-lg font-bold" aria-hidden="true">{icons[type]}</span>
      <span className="flex-1 text-sm">{message}</span>
      <button
        type="button"
        onClick={handleManualClose}
        className="ml-2 hover:opacity-75 transition-opacity"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}
