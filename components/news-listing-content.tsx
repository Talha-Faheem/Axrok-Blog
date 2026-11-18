"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  TrendingUp,
  AlertTriangle,
  Clock,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Flame,
  Bug,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { formatDate } from "@/lib/utils";

interface NewsListingProps {
  initialArticles?: any[];
  initialFeatured?: any;
  categoriesList?: any[];
  trendingList?: any[];
}

export function NewsListingContent({
  initialArticles = [],
  initialFeatured = null,
  categoriesList = [],
  trendingList = [],
}: NewsListingProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Dispatches");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = useMemo(() => {
    const list = ["All Dispatches"];
    if (categoriesList.length > 0) {
      categoriesList.forEach((c) => list.push(c.name || c.title));
    } else {
      list.push(
        "Threat Intelligence",
        "Vulnerability Research",
        "Malware & Ransomware",
        "Network Security",
        "Web & Application Security",
        "Cloud Security",
        "AI Security"
      );
    }
    return list;
  }, [categoriesList]);

  // Featured article (first item or initialFeatured)
  const featuredStory = initialFeatured || initialArticles[0];
  const listArticles = initialFeatured ? initialArticles : initialArticles.slice(1);

  // Filter articles based on category and query
  const filteredArticles = useMemo(() => {
    return listArticles.filter((article) => {
      const catTitle =
        typeof article.category === "object"
          ? article.category?.title || article.category?.name
          : article.category?.replace(/-/g, " ");

      const matchesCategory =
        selectedCategory === "All Dispatches" ||
        (catTitle && catTitle.toLowerCase().includes(selectedCategory.toLowerCase()));

      const matchesSearch =
        !searchQuery.trim() ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (article.tags && article.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    });
  }, [listArticles, selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage) || 1;
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredArticles.slice(start, start + itemsPerPage);
  }, [filteredArticles, currentPage, itemsPerPage]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-12">
      {/* 1. Category Header & Description */}
      <div className="border-b border-xrock-gray-100 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-xrock-red/10 text-xrock-red text-xs font-mono font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-xrock-red animate-pulse" />
              Live Newsroom Desk
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-xrock-black tracking-tight">
              Cybersecurity News
            </h1>

            <p className="text-base sm:text-lg text-xrock-gray-600 font-sans leading-relaxed">
              Timely dispatches, emerging threat investigations, zero-day disclosures, and regulatory movements vetted by the AXROK security desk.
            </p>
          </div>

          {/* Quick stats badge */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono bg-xrock-gray-50 border border-xrock-gray-100 p-3 rounded-lg shrink-0">
            <div>
              <span className="text-xrock-gray-600 block text-[10px] uppercase font-bold">Total Dispatches</span>
              <span className="text-sm font-bold text-xrock-black">{initialArticles.length} Reports</span>
            </div>
            <div className="w-px h-8 bg-xrock-gray-300" />
            <div>
              <span className="text-xrock-gray-600 block text-[10px] uppercase font-bold">Status</span>
              <span className="text-sm font-bold text-emerald-600">Active Monitoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Optional Featured Story */}
      {featuredStory && selectedCategory === "All Dispatches" && !searchQuery && (
        <section aria-label="Featured Story" className="relative">
          <div className="xrock-card group bg-white border border-xrock-gray-100 overflow-hidden shadow-card hover:border-xrock-gray-300 transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
              {/* Image Side */}
              <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[400px] bg-xrock-gray-950 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    featuredStory.featuredImage ||
                    featuredStory.coverImage ||
                    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={featuredStory.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden" />
                <div className="absolute top-4 left-4 bg-xrock-black/90 backdrop-blur-md px-3 py-1 rounded text-white font-mono text-xs font-bold border border-xrock-gray-800 flex items-center gap-1.5 shadow-sm">
                  <Flame className="w-3.5 h-3.5 text-xrock-red" />
                  <span>FEATURED INVESTIGATION</span>
                </div>
              </div>

              {/* Text Content */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="xrock-category">
                      {typeof featuredStory.category === "object"
                        ? featuredStory.category?.title || featuredStory.category?.name
                        : featuredStory.category?.replace(/-/g, " ")}
                    </span>
                    <span className="text-[11px] font-mono text-xrock-gray-600">
                      • {featuredStory.readingTime || 7} min read
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-xrock-black tracking-tight leading-snug group-hover:text-xrock-red-dark transition-colors">
                    <Link href={`/blog/${featuredStory.slug}`}>
                      {featuredStory.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-xrock-gray-600 font-sans leading-relaxed line-clamp-3">
                    {featuredStory.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-xrock-gray-100 flex items-center justify-between text-xs text-xrock-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xrock-black">
                      {typeof featuredStory.author === "object"
                        ? featuredStory.author?.name
                        : featuredStory.author}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${featuredStory.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-xrock-red hover:text-xrock-red-dark transition-colors group-hover:translate-x-1 duration-150"
                  >
                    <span>Read Report</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Category Filter Pills & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-xrock-red text-white shadow-xs"
                      : "bg-xrock-gray-100 text-xrock-gray-600 hover:bg-xrock-gray-200 hover:text-xrock-black"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Inline Filter Search Input */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-xrock-gray-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter dispatches..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-xrock-gray-100 bg-xrock-gray-50 text-xs text-xrock-black placeholder-xrock-gray-600 focus:outline-none focus:border-xrock-red transition-all"
            />
          </div>
        </div>
      </div>

      {/* 4. Main Two-Column Layout (Article Grid + Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Main Article Stream (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-8">
          {paginatedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedArticles.map((article) => (
                <ArticleCard key={article.id || article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-dashed border-xrock-gray-300 bg-xrock-gray-50/50 space-y-3">
              <AlertTriangle className="w-8 h-8 text-xrock-gray-600 mx-auto" />
              <h3 className="font-display font-bold text-lg text-xrock-black">No dispatches match your filter</h3>
              <p className="text-xs text-xrock-gray-600 max-w-sm mx-auto font-sans">
                Try clearing your search query or selecting "All Dispatches" to view all intelligence briefs.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All Dispatches");
                  setSearchQuery("");
                }}
                className="mt-2 px-4 py-2 rounded-lg bg-xrock-red text-white text-xs font-semibold hover:bg-xrock-red-dark transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* 5. Pagination Controls */}
          {totalPages > 1 && (
            <div className="pt-8 border-t border-xrock-gray-100 flex items-center justify-between text-xs font-mono">
              <span className="text-xrock-gray-600">
                Page <strong className="text-xrock-black">{currentPage}</strong> of {totalPages}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded border border-xrock-gray-100 bg-white hover:bg-xrock-gray-50 text-xrock-black font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded border border-xrock-gray-100 bg-white hover:bg-xrock-gray-50 text-xrock-black font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Widgets (4 cols on lg) */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Trending News Widget */}
          <div className="xrock-card p-6 bg-white border border-xrock-gray-100 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-xrock-gray-100">
              <TrendingUp className="w-4 h-4 text-xrock-red" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-xrock-black">
                Trending Intel
              </h3>
            </div>

            <ol className="space-y-4">
              {(trendingList.length > 0 ? trendingList : listArticles.slice(0, 4)).map((story: any, idx: number) => (
                <li key={story.id || story.slug} className="flex items-start gap-3 group">
                  <span className="font-display font-black text-lg text-xrock-red leading-none w-5">
                    {idx + 1}
                  </span>
                  <div className="space-y-1">
                    <Link
                      href={`/blog/${story.slug}`}
                      className="font-display font-bold text-xs text-xrock-black group-hover:text-xrock-red transition-colors line-clamp-2 leading-snug"
                    >
                      {story.title}
                    </Link>
                    <span className="text-[10px] font-mono text-xrock-gray-600 block">
                      {story.readingTime || 5} min read
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Live CVE Telemetry Widget */}
          <div className="xrock-card p-6 bg-xrock-black text-white border border-xrock-gray-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-xrock-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-xrock-red animate-ping" />
                <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-white">
                  Live CVE Telemetry
                </h3>
              </div>
              <span className="text-[10px] font-mono text-xrock-red">CRITICAL</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-xrock-gray-950 border border-xrock-gray-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-white font-bold">CVE-2024-38077</span>
                  <span className="px-1.5 py-0.2 rounded bg-xrock-red text-white text-[9px] font-bold">CVSS 9.8</span>
                </div>
                <p className="text-[11px] text-xrock-gray-300 font-sans line-clamp-2">
                  Windows Remote Desktop Licensing heap overflow RCE.
                </p>
                <Link href="/vulnerabilities" className="text-[10px] font-mono text-xrock-red hover:underline block pt-1">
                  View Advisory Analysis →
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
