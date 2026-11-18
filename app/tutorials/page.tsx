import { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/db/repository";
import { GuideCard } from "@/components/guide-card";
import { practicalGuides } from "@/lib/data";
import { BookOpen, Terminal, Sparkles, Filter } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Defensive Engineering & Practical Security Labs | AXROK",
  description: "Reproducible hardening manuals, malware analysis environments, and offensive security labs.",
};

export default async function TutorialsPage() {
  const postsRes = await getPosts({ limit: 20, status: "published" });
  const labPosts = postsRes.posts.filter(
    (p) =>
      p.tags?.some((t: string) => ["appsec", "reverse-engineering", "kernel-exploit", "kubernetes"].includes(t)) ||
      p.category === "web-app-security"
  );

  return (
    <div className="py-10 sm:py-16 bg-white min-h-screen">
      <div className="xrock-container space-y-12">
        {/* Header */}
        <div className="border-b border-xrock-gray-100 pb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-xrock-red/10 text-xrock-red text-xs font-mono font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Hands-on Engineering</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-xrock-black tracking-tight">
            Tutorials & Defensive Labs
          </h1>

          <p className="text-base sm:text-lg text-xrock-gray-600 font-sans max-w-3xl leading-relaxed">
            Step-by-step technical blueprints, reproducible attack simulations, and production kernel hardening manuals verified in air-gapped testbeds.
          </p>
        </div>

        {/* Evergreen Labs Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-xrock-black">
              Featured Security Laboratories
            </h2>
            <span className="text-xs font-mono text-xrock-gray-600">
              Verified Configurations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {practicalGuides.map((guide) => (
              <GuideCard key={guide.id || guide.slug} guide={guide} />
            ))}
          </div>
        </div>

        {/* Database Lab Dispatches */}
        {labPosts.length > 0 && (
          <div className="pt-8 border-t border-xrock-gray-100">
            <h2 className="text-xl font-display font-bold text-xrock-black mb-6">
              Published Technical Guides & Case Studies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {labPosts.map((post) => (
                <div
                  key={post.id || post.slug}
                  className="xrock-card p-6 bg-white border border-xrock-gray-100 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="xrock-category">{post.category}</span>
                    <h3 className="font-display font-bold text-base text-xrock-black hover:text-xrock-red transition-colors line-clamp-2">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-xs text-xrock-gray-600 font-sans line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-xrock-gray-100 flex items-center justify-between text-xs font-mono text-xrock-gray-600">
                    <span>{post.readingTime} min read</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xrock-red hover:underline font-semibold"
                    >
                      Read Guide →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
