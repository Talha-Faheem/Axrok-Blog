"use client";

import { useState } from "react";
import { Share2, Check, Copy, Twitter, Linkedin, Facebook } from "lucide-react";

export function ArticleShareBar({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&via=axrok_sec`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-2 py-4 border-y border-xrock-gray-100 my-8">
      <span className="text-xs font-mono font-bold uppercase tracking-wider text-xrock-gray-600 mr-2 flex items-center gap-1.5">
        <Share2 className="w-3.5 h-3.5 text-xrock-red" />
        Share Intelligence:
      </span>

      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg border border-xrock-gray-100 hover:border-xrock-red hover:text-xrock-red text-xrock-gray-800 transition-colors"
        title="Share on Twitter / X"
      >
        <Twitter className="w-4 h-4" />
      </a>

      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg border border-xrock-gray-100 hover:border-xrock-red hover:text-xrock-red text-xrock-gray-800 transition-colors"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </a>

      <button
        onClick={handleCopy}
        className="p-2 rounded-lg border border-xrock-gray-100 hover:border-xrock-red hover:text-xrock-red text-xrock-gray-800 transition-colors flex items-center gap-1 text-xs"
        title="Copy Link"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        {copied && <span className="text-[11px] text-emerald-600 font-mono">Copied</span>}
      </button>
    </div>
  );
}
