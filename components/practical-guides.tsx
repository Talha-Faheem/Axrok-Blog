import { GuideCard } from "@/components/guide-card";
import { practicalGuides } from "@/lib/data";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react";

export function PracticalGuides() {
  return (
    <section id="guides" className="py-12 sm:py-16 bg-xrock-gray-50 border-b border-xrock-gray-100">
      <div className="xrock-container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 pb-4 border-b border-xrock-gray-300 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-xrock-crimson tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              Evergreen Hands-on Security
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-xrock-black tracking-tight">
              Practical Guides & Defensive Labs
            </h2>
            <p className="text-sm text-xrock-gray-600 mt-1 max-w-xl">
              Reproducible configurations, offensive vulnerability labs, and step-by-step hardening manuals verified on production kernels.
            </p>
          </div>

          <a
            href="#guides"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-xrock-red hover:text-xrock-red-dark transition-colors shrink-0"
          >
            <span>Explore All 35+ Labs</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {practicalGuides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      </div>
    </section>
  );
}

