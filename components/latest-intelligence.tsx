import { ArticleCard } from "@/components/article-card";
import { latestArticles } from "@/lib/data";
import { ArrowRight, Shield } from "lucide-react";

export function LatestIntelligence() {
  const [firstItem, ...restItems] = latestArticles;

  return (
    <section id="latest-news" className="py-12 sm:py-16 bg-xrock-gray-50 border-b border-xrock-gray-100">
      <div className="xrock-container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 pb-4 border-b border-xrock-gray-300 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-xrock-red tracking-wider mb-1">
              <Shield className="w-4 h-4" />
              Real-time Field Telemetry
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-xrock-black tracking-tight">
              Latest Intelligence
            </h2>
          </div>

          <a
            href="#topics"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-xrock-red hover:text-xrock-red-dark transition-colors group"
          >
            <span>View All Research Dispatches</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Article Grid: 1 prominent + 3 supporting */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArticles.map((article, idx) => (
            <ArticleCard
              key={article.id}
              article={article}
              featured={idx === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

