"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

interface AnnouncementBannerProps {
  enabled?: boolean;
  badge?: string;
  message?: string;
  linkText?: string;
  linkUrl?: string;
}

export function AnnouncementBanner({
  enabled = true,
  badge = "SECURITY ALERT",
  message = "Critical infrastructure advisory published.",
  linkText = "View advisory →",
  linkUrl = "/vulnerabilities",
}: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!enabled || dismissed) return null;

  return (
    <aside
      aria-label="Security Announcement Alert"
      className="bg-[#080808] text-white text-xs sm:text-[13px] py-2.5 px-4 transition-all border-b border-neutral-900 relative"
    >
      <div className="xrock-container flex items-center justify-center text-center gap-2 sm:gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F83838] animate-pulse shrink-0 inline-block"></span>
          <span className="font-mono font-bold tracking-widest text-[11px] sm:text-xs text-white uppercase">
            {badge}
          </span>
        </div>

        <span className="text-neutral-300 font-normal">
          {message}
        </span>

        <Link
          href={linkUrl}
          className="text-white hover:text-[#F83838] font-medium transition-colors inline-flex items-center gap-1 group ml-1"
        >
          <span>{linkText}</span>
        </Link>
      </div>

      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
}
