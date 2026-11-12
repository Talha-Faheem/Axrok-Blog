"use client";

import { useState } from "react";
import { AlertTriangle, ArrowRight, X } from "lucide-react";

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside
      aria-label="Critical Security Advisory Alert"
      className="bg-xrock-black text-xrock-white border-b border-xrock-gray-800 text-xs sm:text-sm py-2 px-4 transition-all"
    >
      <div className="xrock-container flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-xrock-red text-xrock-white uppercase tracking-wider shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
            CRITICAL ADVISORY
          </span>
          <p className="truncate text-xrock-gray-100 font-medium">
            <strong className="text-white">CVE-2024-38077:</strong> Windows Remote Desktop Licensing RCE vulnerability actively analyzed.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <a
            href="#vulnerability-spotlight"
            className="inline-flex items-center gap-1 text-xrock-red hover:text-white font-semibold transition-colors underline-offset-4 hover:underline text-xs"
          >
            Read Technical Analysis
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss security announcement"
            className="text-xrock-gray-300 hover:text-white p-1 rounded hover:bg-xrock-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

