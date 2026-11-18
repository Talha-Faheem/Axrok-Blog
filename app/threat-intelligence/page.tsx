import { Metadata } from "next";
import Link from "next/link";
import { getPosts, getCategoryBySlug } from "@/lib/db/repository";
import { ArticleCard } from "@/components/article-card";
import { ShieldAlert, ArrowLeft, Radio, Flame } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Threat Intelligence & Adversary Tracking | AXROK",
  description: "Verified telemetry, advanced threat actor analysis, and active cyber campaign investigations.",
};

export default async function ThreatIntelligencePage() {
  const result = await getPosts({
    category: "threat-intelligence",
    limit: 20,
    status: "published",
  });

  return (
    <div className="py-10 sm:py-16 bg-white min-h-screen">
      <div className="xrock-container space-y-10">
        {/* Header */}
        <div className="border-b border-xrock-gray-100 pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-xrock-red/10 text-xrock-red text-xs font-mono font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse text-xrock-red" />
            <span>Active Adversary Tracking</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-xrock-black tracking-tight">
            Threat Intelligence
          </h1>

          <p className="text-base sm:text-lg text-xrock-gray-600 font-sans max-w-3xl leading-relaxed">
            Technical dissections of nation-state threat vectors, C2 infrastructure tracking, and emerging intrusion tradecraft verified by our researchers.
          </p>
        </div>

        {/* Grid */}
        {result.posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.posts.map((post, idx) => (
              <ArticleCard key={post.id || post.slug} article={post} featured={idx === 0} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-xs font-mono text-xrock-gray-600 bg-xrock-gray-50 rounded-xl border border-xrock-gray-100">
            No threat intelligence reports currently published.
          </div>
        )}
      </div>
    </div>
  );
}
