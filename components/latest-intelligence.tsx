import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { ArrowRight } from "lucide-react";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/motion";

interface LatestIntelligenceProps {
  articles?: any[];
}

export function LatestIntelligence({ articles = [] }: LatestIntelligenceProps) {
  if (articles.length === 0) return null;

  return (
    <section id="latest-news" className="py-12 sm:py-16 bg-white border-b border-[#E8E8E8]">
      <div className="xrock-container">
        {/* Section Header matching Figma: THE BRIEF / Latest Intelligence */}
        <FadeIn className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 pb-4 border-b border-[#E8E8E8] gap-4">
          <div>
            <div className="text-xs font-mono font-bold uppercase text-[#F83838] tracking-[0.18em] mb-1.5">
              THE BRIEF
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-[#080808] tracking-tight">
              Latest Intelligence
            </h2>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F83838] hover:text-[#980000] transition-colors group"
          >
            <span>View All Research Dispatches</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </FadeIn>

        {/* Article Grid with subtle scroll stagger */}
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((article, idx) => (
            <StaggerItem key={article.id || article.slug}>
              <ArticleCard
                article={article}
                featured={idx === 0}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
