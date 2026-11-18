import Link from "next/link";
import { FolderGit2, ArrowRight } from "lucide-react";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/motion";

interface TopicGridProps {
  categories?: any[];
}

export function TopicGrid({ categories = [] }: TopicGridProps) {
  if (categories.length === 0) return null;

  return (
    <section id="topics" className="py-12 sm:py-16 bg-[#F7F7F7] border-b border-[#E8E8E8]">
      <div className="xrock-container">
        {/* Section Header */}
        <FadeIn className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#F83838] mb-1.5">
            KNOWLEDGE TAXONOMY
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-[#080808] tracking-tight">
            Explore Publication Topics
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-2 font-sans">
            Curated indexes of verified exploit primitives, defensive architectures, and incident debriefs.
          </p>
        </FadeIn>

        {/* 4-column Grid */}
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <StaggerItem key={cat.id || cat.slug}>
              <Link
                href={`/category/${cat.slug}`}
                className="p-5 rounded-xl border border-[#E8E8E8] bg-white hover:border-[#F83838] shadow-xs hover:shadow-md transition-all group flex flex-col justify-between h-full"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-neutral-50 border border-[#E8E8E8] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <FolderGit2 className="w-5 h-5 text-[#F83838]" />
                  </div>
                  <h3 className="font-display font-bold text-base text-[#080808] group-hover:text-[#F83838] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 line-clamp-2 font-sans leading-relaxed">
                    {cat.description || "Research and analyses in this domain."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-[#F83838] group-hover:text-[#980000]">
                  <span>Browse Domain</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
