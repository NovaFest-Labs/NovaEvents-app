"use client";

import { useState } from "react";

interface CopyableAddressProps {
  address: string;
  className?: string;
}

export default function CopyableAddress({
  address,
  className,
}: CopyableAddressProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail (denied permission, insecure context, etc.)
      // — silently no-op rather than throwing in the UI.
    }
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <span className="font-mono break-all">{address}</span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy wallet address"
        className="text-slate-500 hover:text-white transition-colors"
      >
        {copied ? "✓" : "⧉"}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </span>
  );
}
