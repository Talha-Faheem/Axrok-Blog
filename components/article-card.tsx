import Link from "next/link";
import { Clock, Calendar, ArrowUpRight } from "lucide-react";

interface ArticleCardProps {
  article: any;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const imageUrl =
    article.featuredImage ||
    article.coverImage ||
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80";

  const categoryTitle =
    typeof article.category === "object"
      ? article.category?.title || article.category?.name
      : article.category?.replace(/-/g, " ").toUpperCase() || "THREAT INTEL";

  const authorName =
    typeof article.author === "object"
      ? article.author?.name
      : article.author?.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()) || "AXROK Analyst";

  const dateStr = article.publishedAt || article.createdAt;
  const formattedDate = dateStr
    ? new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Recent";

  return (
    <article
      className={`xrock-card group flex flex-col justify-between h-full bg-white border border-[#E8E8E8] rounded-xl hover:border-[#F83838] transition-all ${
        featured ? "lg:col-span-2" : "col-span-1"
      }`}
    >
      <div>
        {/* Card Image Container */}
        <Link href={`/blog/${article.slug}`} className="block relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={article.imageAlt || article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-mono font-bold text-[#080808] uppercase tracking-wider shadow-xs">
            {categoryTitle}
          </div>
        </Link>

        {/* Card Content Body */}
        <div className="p-5 sm:p-6 flex flex-col space-y-3">
          {/* Headline */}
          <h3
            className={`font-display font-bold text-[#080808] leading-snug tracking-tight group-hover:text-[#F83838] transition-colors line-clamp-2 ${
              featured ? "text-xl sm:text-2xl" : "text-lg"
            }`}
          >
            <Link href={`/blog/${article.slug}`} className="focus:outline-none">
              {article.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 font-sans leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Card Footer Metadata */}
      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 flex items-center justify-between border-t border-[#E8E8E8] text-xs text-neutral-500">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-neutral-800 text-xs">{authorName}</span>
          <span className="text-neutral-300">•</span>
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <Calendar className="w-3 h-3 text-neutral-400" />
            <time>{formattedDate}</time>
          </div>
        </div>

        <Link
          href={`/blog/${article.slug}`}
          className="text-[#F83838] hover:text-[#980000] transition-colors p-1"
          aria-label={`Read ${article.title}`}
        >
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
