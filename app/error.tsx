"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 text-center">
      <p className="text-red-500 font-mono font-bold text-sm mb-4">Error</p>
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="text-slate-400 mb-10 max-w-sm">
        An unexpected error occurred while rendering this page.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-violet-600 hover:bg-violet-500 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border border-white/20 hover:border-white/40 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
