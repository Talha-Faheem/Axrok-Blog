import Link from "next/link";
import { Terminal, FileCheck, KeyRound, Layers, Clock, ListOrdered, ArrowRight } from "lucide-react";

interface GuideCardProps {
  guide: any;
}

const guideIcons: Record<string, React.ReactNode> = {
  Terminal: <Terminal className="w-5 h-5 text-xrock-black" />,
  FileCheck: <FileCheck className="w-5 h-5 text-xrock-black" />,
  KeyRound: <KeyRound className="w-5 h-5 text-xrock-black" />,
  Layers: <Layers className="w-5 h-5 text-xrock-black" />,
};

const levelColors: Record<string, string> = {
  Beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  Advanced: "bg-xrock-red/10 text-xrock-red-dark border-xrock-red/20",
};

export function GuideCard({ guide }: GuideCardProps) {
  const level = guide.level || "Intermediate";
  const category = guide.category || "Defensive Engineering";
  const readingTime = guide.readingTime || guide.estimatedTime || 10;
  const stepsCount = guide.stepsCount || 6;

  return (
    <article className="xrock-card p-6 flex flex-col justify-between bg-white group hover:border-xrock-gray-300">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-xrock-gray-50 flex items-center justify-center border border-xrock-gray-100 group-hover:bg-xrock-black group-hover:text-white transition-colors">
              {guideIcons[guide.iconName] || <Terminal className="w-4 h-4" />}
            </div>
            <span className="text-xs font-mono font-medium text-xrock-gray-600">
              {category}
            </span>
          </div>

          <span
            className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
              levelColors[level] || "bg-gray-100 text-gray-800"
            }`}
          >
            {level}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-display font-bold text-xrock-black leading-snug group-hover:text-xrock-red-dark transition-colors">
          <Link href={`/blog/${guide.slug}`}>{guide.title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-xrock-gray-600 mt-2 line-clamp-3 leading-relaxed font-sans">
          {guide.excerpt}
        </p>
      </div>

      {/* Meta Footer */}
      <div className="pt-4 mt-4 border-t border-xrock-gray-100 flex items-center justify-between text-xs font-mono text-xrock-gray-600">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{readingTime}m</span>
          </div>
          <div className="flex items-center gap-1">
            <ListOrdered className="w-3.5 h-3.5" />
            <span>{stepsCount} steps</span>
          </div>
        </div>

        <Link
          href={`/blog/${guide.slug}`}
          className="text-xrock-red hover:text-xrock-red-dark flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform"
        >
          <span>Start Lab</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
