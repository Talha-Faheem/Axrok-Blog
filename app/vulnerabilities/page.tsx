import { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/db/repository";
import { ArticleCard } from "@/components/article-card";
import { AlertOctagon, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Vulnerability Research & CVE Bulletins | AXROK",
  description: "Peer-reviewed zero-day disclosures, CVSS severity assessments, and verified mitigation manuals.",
};

export default async function VulnerabilitiesPage() {
  const result = await getPosts({
    category: "vulnerability-research",
    limit: 20,
    status: "published",
  });

  return (
    <div className="py-10 sm:py-16 bg-white min-h-screen">
      <div className="xrock-container space-y-12">
        {/* Header */}
        <div className="border-b border-xrock-gray-100 pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-xrock-red/10 text-xrock-red text-xs font-mono font-bold uppercase tracking-wider">
            <AlertOctagon className="w-3.5 h-3.5 text-xrock-red" />
            <span>CVE Advisories & Disclosures</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-xrock-black tracking-tight">
            Vulnerability Research
          </h1>

          <p className="text-base sm:text-lg text-xrock-gray-600 font-sans max-w-3xl leading-relaxed">
            Root-cause memory corruption analyses, protocol flaw teardowns, and actionable patch verifications. We strictly verify CVEs and severity classifications.
          </p>
        </div>

        {/* Featured Advisory Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-xrock-black text-white border border-xrock-gray-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="px-2.5 py-1 rounded bg-xrock-red text-white text-xs font-mono font-bold">
              CVSS 9.8 CRITICAL
            </span>
            <span className="text-xs font-mono text-xrock-gray-300">
              Coordinated Disclosure Status: Patched
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            <Link
              href="/blog/deep-dive-windows-rce-cve-2024-38077"
              className="hover:text-xrock-red transition-colors"
            >
              CVE-2024-38077: Windows Remote Desktop Licensing RCE Vulnerability
            </Link>
          </h2>

          <p className="text-sm text-xrock-gray-300 font-sans max-w-2xl leading-relaxed">
            Unauthenticated remote attackers can execute arbitrary code with SYSTEM privileges via malformed RPC packets sent to the licensing service.
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs font-mono">
            <Link
              href="/blog/deep-dive-windows-rce-cve-2024-38077"
              className="xrock-button-primary text-xs font-semibold"
            >
              Read Vulnerability Breakdown →
            </Link>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-display font-bold text-xrock-black">
            Published Advisory Reports
          </h2>

          {result.posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.posts.map((post) => (
                <ArticleCard key={post.id || post.slug} article={post} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-xs font-mono text-xrock-gray-600 bg-xrock-gray-50 rounded-xl border border-xrock-gray-100">
              No additional vulnerability reports published at this time.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
