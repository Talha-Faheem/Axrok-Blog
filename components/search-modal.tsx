"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ArrowRight, Shield, FileText, Calendar, Clock } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category?: {
    name: string;
    slug: string;
    color?: string;
  };
  publishedAt?: string;
  createdAt?: string;
  readingTime?: number;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchPost[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/posts?search=${encodeURIComponent(query)}&limit=8&status=published`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.posts || []);
        }
      } catch (err) {
        console.error("Search fetch failed", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      onClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleItemClick = (slug: string) => {
    onClose();
    router.push(`/blog/${slug}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[82vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Search Input */}
        <div className="flex items-center px-4 sm:px-5 py-4 border-b border-neutral-200 gap-3 bg-white">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            id="search-modal-title"
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDownInput}
            placeholder="Search cybersecurity news, threats, CVEs, or tactics... (Press Enter)"
            className="flex-1 bg-transparent text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-[#F83838] animate-spin shrink-0" />}
          <button
            onClick={onClose}
            aria-label="Close search dialog"
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1 divide-y divide-neutral-100">
          {query.trim() === "" ? (
            <div className="py-8 text-center text-neutral-500 space-y-3">
              <Shield className="w-8 h-8 text-neutral-300 mx-auto" />
              <p className="text-sm font-medium">Type to search AXROK intelligence publication</p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                {["Ransomware", "Zero-Day", "Linux Kernel", "Active Directory", "Cloud Security", "Kubernetes"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="py-12 text-center text-neutral-500">
              <p className="text-sm font-medium">No intelligence reports matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-neutral-400 mt-1">Try searching for CVE identifiers, threat actors, or attack vectors.</p>
            </div>
          ) : (
            results.map((post) => (
              <div
                key={post._id}
                onClick={() => handleItemClick(post.slug)}
                className="pt-3 first:pt-0 pb-3 group cursor-pointer hover:bg-neutral-50 -mx-4 px-4 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  {post.category && (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-[#F83838]">
                      {post.category.name}
                    </span>
                  )}
                  {post.readingTime && (
                    <span className="text-[11px] text-neutral-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {post.readingTime}m read
                    </span>
                  )}
                </div>
                <h4 className="font-display font-bold text-sm sm:text-base text-neutral-900 group-hover:text-[#F83838] transition-colors line-clamp-1">
                  {post.title}
                </h4>
                {post.excerpt && (
                  <p className="text-xs text-neutral-600 line-clamp-2 mt-1 font-sans">
                    {post.excerpt}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {query.trim() && (
          <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-neutral-300 font-mono text-[10px]">Enter</kbd> for deep search</span>
            <button
              onClick={() => {
                onClose();
                router.push(`/search?q=${encodeURIComponent(query.trim())}`);
              }}
              className="inline-flex items-center gap-1 text-[#F83838] font-semibold hover:underline"
            >
              View all results <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
