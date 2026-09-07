"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error";

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, message, type, duration = 5000, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration === 0) return;

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

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
    <div className={`${baseStyles} ${typeStyles[type]} ${exitStyles}`}>
      <span className="text-lg font-bold">{icons[type]}</span>
      <span className="flex-1 text-sm">{message}</span>
      <button
        type="button"
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onClose(id), 300);
        }}
        className="ml-2 hover:opacity-75 transition-opacity"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}
