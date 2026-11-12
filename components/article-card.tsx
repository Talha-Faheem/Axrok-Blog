import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, ArrowUpRight } from "lucide-react";
import { Article } from "@/types";
import { formatDate } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <article
      className={`xrock-card group flex flex-col justify-between h-full bg-white transition-all ${
        featured ? "lg:col-span-2" : "col-span-1"
      }`}
    >
      <div>
        {/* Card Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-xrock-gray-950">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes={
              featured
                ? "(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
            }
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-bold text-xrock-black uppercase tracking-wider shadow-xs">
            {article.category.title}
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-5 sm:p-6 flex flex-col space-y-3">
          {/* Headline */}
          <h3
            className={`font-display font-bold text-xrock-black leading-snug tracking-tight group-hover:text-xrock-red-dark transition-colors line-clamp-2 ${
              featured ? "text-xl sm:text-2xl" : "text-lg"
            }`}
          >
            <a href={`#${article.slug}`} className="focus:outline-none">
              {article.title}
            </a>
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-xrock-gray-600 line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Card Footer / Metadata */}
      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 mt-auto border-t border-xrock-gray-100 flex items-center justify-between text-xs text-xrock-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full overflow-hidden relative border border-xrock-gray-300">
            <Image
              src={article.author.avatar}
              alt={article.author.name}
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <span className="font-medium text-xrock-black truncate max-w-[120px]">
            {article.author.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline font-mono text-[11px]">
            {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Clock className="w-3 h-3 text-xrock-gray-600" />
            {article.readingTime}
          </span>
        </div>
      </div>
    </article>
  );
}

