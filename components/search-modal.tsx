"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, X, BookOpen, ExternalLink, Shield, Bug, ArrowRight } from "lucide-react";
import { latestArticles, practicalGuides, heroArticle } from "@/lib/data";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Threat Intelligence", "Vulnerability Research", "Malware & Ransomware", "Network Security", "Web & Application Security"];

  // Aggregate searchable items
  const allItems = useMemo(() => {
    const list = [
      {
        id: heroArticle.id,
        title: heroArticle.title,
        excerpt: heroArticle.excerpt,
        category: heroArticle.category.title,
        href: `#hero-story`,
        type: "Article",
      },
      ...latestArticles.map((a) => ({
        id: a.id,
        title: a.title,
        excerpt: a.excerpt,
        category: a.category.title,
        href: `#${a.slug}`,
        type: "Article",
      })),
      ...practicalGuides.map((g) => ({
        id: g.id,
        title: g.title,
        excerpt: g.excerpt,
        category: g.category,
        href: `#guides`,
        type: "Guide",
      })),
    ];
    return list;
  }, []);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesQuery =
        !query.trim() ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [allItems, query, selectedCategory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // toggle modal
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-xrock-black/70 backdrop-blur-sm transition-all"
    >
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-xrock-gray-100 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-xrock-gray-100 gap-3">
          <Search className="w-5 h-5 text-xrock-gray-600 shrink-0" />
          <input
            id="search-modal-title"
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cybersecurity advisories, CVEs, guides..."
            className="w-full bg-transparent text-xrock-black placeholder-xrock-gray-600 focus:outline-none text-base font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-xrock-gray-600 hover:text-xrock-black px-2 py-1 bg-xrock-gray-50 rounded"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1 rounded-md text-xrock-gray-600 hover:text-xrock-black hover:bg-xrock-gray-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-xrock-gray-50 border-b border-xrock-gray-100 overflow-x-auto text-xs no-scrollbar">
          <span className="text-xrock-gray-600 font-medium mr-1 shrink-0">Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 ${
                selectedCategory === cat
                  ? "bg-xrock-black text-white"
                  : "bg-white text-xrock-gray-800 border border-xrock-gray-100 hover:border-xrock-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="group block p-3.5 rounded-lg border border-xrock-gray-100 hover:border-xrock-red/50 hover:bg-xrock-gray-50 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-xrock-crimson font-sans">
                      {item.category}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-xrock-gray-100 text-xrock-gray-600 font-mono">
                      {item.type}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-xrock-gray-600 group-hover:text-xrock-red group-hover:translate-x-0.5 transition-all" />
                </div>
                <h4 className="text-sm font-semibold text-xrock-black group-hover:text-xrock-red-dark transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-xrock-gray-600 line-clamp-2 mt-1">
                  {item.excerpt}
                </p>
              </a>
            ))
          ) : (
            <div className="text-center py-12 px-4">
              <Bug className="w-10 h-10 text-xrock-gray-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-xrock-black">No articles found.</p>
              <p className="text-xs text-xrock-gray-600 mt-1">
                Try another keyword, clear the filter, or explore a topic from the home page.
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-xrock-gray-50 border-t border-xrock-gray-100 flex items-center justify-between text-[11px] text-xrock-gray-600">
          <span>
            Showing <strong className="text-xrock-black">{filteredItems.length}</strong> results
          </span>
          <div className="flex items-center gap-3">
            <span>ESC to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}

