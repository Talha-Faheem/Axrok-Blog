import { Metadata } from "next";
import Link from "next/link";
import { Search, Filter, Shield, Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { getPosts, getCategories, getTags } from "@/lib/db/repository";
import { ArticleCard } from "@/components/article-card";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    tag?: string;
    sort?: string;
  }>;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search Cybersecurity Intelligence Dossiers | AXROK",
  description: "Search across all AXROK technical cybersecurity publications, CVE advisories, and threat research.",
  alternates: {
    canonical: "/search",
  },
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const selectedCategory = params.category || "";
  const selectedTag = params.tag || "";
  const sort = params.sort || "newest";

  const [categories, tags, postsRes] = await Promise.all([
    getCategories(true),
    getTags(),
    getPosts({
      search: query || undefined,
      category: selectedCategory || undefined,
      tag: selectedTag || undefined,
      status: "published",
      limit: 50,
    }),
  ]);

  let articles = postsRes.posts;

  // Client sort handling if requested
  if (sort === "oldest") {
    articles = [...articles].sort(
      (a: any, b: any) =>
        new Date(a.publishedAt || a.createdAt).getTime() -
        new Date(b.publishedAt || b.createdAt).getTime()
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-white min-h-[70vh]">
      <div className="xrock-container">
        {/* Search Header */}
        <div className="border-b border-neutral-200 pb-8 sm:pb-12 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Search className="w-3.5 h-3.5 text-[#F83838]" />
            Intelligence Search Engine
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-neutral-900 tracking-tight mb-6">
            Search Threat Database
          </h1>

          {/* Search Bar Form */}
          <form method="GET" action="/search" className="max-w-3xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Search CVEs, tactics, threat actors, or topics..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-neutral-300 text-sm sm:text-base focus:outline-none focus:border-[#F83838] focus:ring-1 focus:ring-[#F83838] shadow-xs"
                />
              </div>

              {selectedCategory && (
                <input type="hidden" name="category" value={selectedCategory} />
              )}
              {selectedTag && <input type="hidden" name="tag" value={selectedTag} />}

              <button
                type="submit"
                className="xrock-button-primary px-6 py-3.5 text-sm font-semibold rounded-xl"
              >
                Query Intel
              </button>
            </div>
          </form>

          {/* Filters and Active Queries */}
          <div className="flex flex-wrap items-center gap-2 pt-6">
            <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Category:
            </span>
            <Link
              href={`/search?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(selectedTag ? { tag: selectedTag } : {}) }).toString()}`}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                !selectedCategory
                  ? "bg-[#080808] text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              All Topics
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/search?${new URLSearchParams({ ...(query ? { q: query } : {}), category: c.slug, ...(selectedTag ? { tag: selectedTag } : {}) }).toString()}`}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === c.slug
                    ? "bg-[#F83838] text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-neutral-500 mt-6 pt-4 border-t border-neutral-100">
            <div>
              Showing <strong className="text-neutral-900">{articles.length}</strong> {articles.length === 1 ? "result" : "results"}
              {query && (
                <span> for &ldquo;<span className="text-[#F83838]">{query}</span>&rdquo;</span>
              )}
              {selectedCategory && (
                <span> in <span className="text-neutral-800 font-semibold">{selectedCategory}</span></span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span>Sort:</span>
              <Link
                href={`/search?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(selectedCategory ? { category: selectedCategory } : {}), sort: "newest" }).toString()}`}
                className={`hover:underline ${sort === "newest" ? "font-bold text-[#F83838]" : ""}`}
              >
                Newest
              </Link>
              <span>|</span>
              <Link
                href={`/search?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(selectedCategory ? { category: selectedCategory } : {}), sort: "oldest" }).toString()}`}
                className={`hover:underline ${sort === "oldest" ? "font-bold text-[#F83838]" : ""}`}
              >
                Oldest
              </Link>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {articles.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-neutral-300 rounded-2xl bg-neutral-50/50">
            <Shield className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-neutral-800">
              No intelligence reports match your search query
            </h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 mb-6">
              Try adjusting your query, clearing category filters, or searching for broader terms like &ldquo;malware&rdquo;, &ldquo;cloud&rdquo;, or &ldquo;ransomware&rdquo;.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#080808] text-white text-xs font-semibold hover:bg-[#F83838] transition-colors"
            >
              Clear All Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {articles.map((article: any) => (
              <ArticleCard key={article._id || article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
