import Link from "next/link";
import { GuideCard } from "@/components/guide-card";
import { practicalGuides } from "@/lib/data";
import { BookOpen, ArrowRight } from "lucide-react";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/motion";

interface PracticalGuidesProps {
  guides?: any[];
}

export function PracticalGuides({ guides }: PracticalGuidesProps) {
  const displayGuides = guides && guides.length > 0 ? guides : practicalGuides;

  return (
    <section id="guides" className="py-12 sm:py-16 bg-xrock-gray-50 border-b border-xrock-gray-100">
      <div className="xrock-container">
        {/* Section Header */}
        <FadeIn className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 pb-4 border-b border-xrock-gray-300 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-xrock-crimson tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              Evergreen Hands-on Security
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-xrock-black tracking-tight">
              Practical Guides & Defensive Labs
            </h2>
            <p className="text-sm text-xrock-gray-600 mt-1 max-w-xl font-sans">
              Reproducible configurations, offensive vulnerability labs, and step-by-step hardening manuals verified on production kernels.
            </p>
          </div>

          <Link
            href="/tutorials"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-xrock-red hover:text-xrock-red-dark transition-colors shrink-0"
          >
            <span>Explore All Labs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </FadeIn>

        {/* Guides Grid */}
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayGuides.map((guide) => (
            <StaggerItem key={guide.id || guide.slug}>
              <GuideCard guide={guide} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
