import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn, ScaleIn } from "@/components/motion";

interface HeroFeatureProps {
  article?: any;
}

export function HeroFeature({ article }: HeroFeatureProps) {
  if (!article) return null;

  const categoryTitle =
    typeof article.category === "object"
      ? article.category?.name || article.category?.title
      : article.category?.replace(/-/g, " ").toUpperCase() || "SECURITY OPERATIONS";

  const authorName =
    typeof article.author === "object"
      ? article.author?.name
      : article.author?.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Maya Chen";

  const readingTime = article.readingTime || 9;
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "May 18, 2026";

  const imageUrl =
    article.featuredImage ||
    article.coverImage ||
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80";

  return (
    <section id="hero-story" className="py-10 sm:py-16 bg-white border-b border-[#E8E8E8]">
      <div className="xrock-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Editorial Content */}
          <FadeIn className="lg:col-span-6 flex flex-col justify-center space-y-5 sm:space-y-6">
            {/* Category Kicker */}
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#F83838]">
                {categoryTitle}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-[52px] text-[#080808] leading-[1.08] tracking-[-0.03em] hover:text-[#980000] transition-colors">
              <Link href={`/blog/${article.slug}`}>
                {article.title}
              </Link>
            </h1>

            {/* Summary / Excerpt */}
            <p className="text-base sm:text-lg text-neutral-600 font-sans leading-relaxed max-w-xl">
              {article.excerpt}
            </p>

            {/* Author and Metadata row */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 font-sans pt-1">
              <span className="font-medium text-neutral-800">{authorName}</span>
              <span>•</span>
              <time dateTime={article.publishedAt || ""}>{publishedDate}</time>
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>

            {/* Red Action CTA Button */}
            <div className="pt-2">
              <Link
                href={`/blog/${article.slug}`}
                className="bg-[#F83838] hover:bg-[#980000] text-white px-6 py-3 rounded-lg font-semibold text-sm inline-flex items-center gap-2 transition-all shadow-xs"
              >
                <span>Read the story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>

          {/* Right Image Column */}
          <ScaleIn delay={0.1} className="lg:col-span-6 flex flex-col space-y-2.5">
            <Link
              href={`/blog/${article.slug}`}
              className="block relative aspect-[4/3] w-full overflow-hidden bg-neutral-950 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={article.imageAlt || article.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </Link>

            {/* Caption Underneath Image matching Figma */}
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500 pt-1">
              <span>FIELD NOTES / 024</span>
              <span>Photo: Taylor Vick</span>
            </div>
          </ScaleIn>
        </div>
      </div>
    </section>
  );
}
