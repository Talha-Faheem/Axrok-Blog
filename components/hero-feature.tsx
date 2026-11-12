import Image from "next/image";
import { ArrowRight, Clock, Calendar, ShieldCheck } from "lucide-react";
import { heroArticle } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export function HeroFeature() {
  return (
    <section id="hero-story" className="py-8 sm:py-12 border-b border-xrock-gray-100 bg-white">
      <div className="xrock-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content Column (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-6 order-2 lg:order-1">
            {/* Category and Tag */}
            <div className="flex items-center gap-3">
              <span className="xrock-category">
                {heroArticle.category.title}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-xrock-gray-100 text-xrock-gray-800 font-medium border border-xrock-gray-300">
                Lead Investigation
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-display font-extrabold text-xrock-black leading-[1.12] tracking-tight hover:text-xrock-red-dark transition-colors">
              <a href="#hero-story">
                {heroArticle.title}
              </a>
            </h1>

            {/* Dek / Summary */}
            <p className="text-base sm:text-lg text-xrock-gray-600 leading-relaxed font-sans max-w-2xl">
              {heroArticle.excerpt}
            </p>

            {/* Metadata: Author & Time */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs sm:text-sm text-xrock-gray-600 border-t border-xrock-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-xrock-gray-300 relative bg-xrock-gray-100 shrink-0">
                  <Image
                    src={heroArticle.author.avatar}
                    alt={heroArticle.author.name}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-xrock-black leading-tight">
                    {heroArticle.author.name}
                  </span>
                  <span className="text-[11px] text-xrock-gray-600 font-normal">
                    {heroArticle.author.role}
                  </span>
                </div>
              </div>

              <span className="text-xrock-gray-300 hidden sm:inline">•</span>

              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-xrock-gray-600" />
                <time dateTime={heroArticle.publishedAt}>
                  {formatDate(heroArticle.publishedAt)}
                </time>
              </div>

              <span className="text-xrock-gray-300 hidden sm:inline">•</span>

              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-xrock-gray-600" />
                <span>{heroArticle.readingTime}</span>
              </div>
            </div>

            {/* Read CTA */}
            <div className="pt-2">
              <a
                href="#hero-story"
                className="xrock-button-primary inline-flex items-center gap-2 group text-sm"
              >
                <span>Read Full Investigation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Featured Image Column (5 cols on lg) */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden border border-xrock-gray-100 shadow-card group">
              <div className="aspect-[16/10] sm:aspect-[4/3] w-full relative bg-xrock-gray-950 overflow-hidden">
                <Image
                  src={heroArticle.coverImage}
                  alt={heroArticle.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 550px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-xrock-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-4 right-4 bg-xrock-black/80 backdrop-blur-md text-white text-[11px] font-mono font-semibold px-2.5 py-1 rounded border border-white/20 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-xrock-red" />
                  VERIFIED RESEARCH
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

