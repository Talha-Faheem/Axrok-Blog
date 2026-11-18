import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Tag as TagIcon, Shield, ArrowRight } from "lucide-react";
import { getTagBySlug, getPosts, getTags } from "@/lib/db/repository";
import { ArticleCard } from "@/components/article-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return {
      title: "Tag Not Found | AXROK",
    };
  }

  return {
    title: `#${tag.name} | Cybersecurity Intelligence & Research | AXROK`,
    description: tag.description || `Browse in-depth cybersecurity articles, CVE advisories, and tactics tagged #${tag.name} on AXROK.`,
    alternates: {
      canonical: `/tag/${slug}`,
    },
    openGraph: {
      title: `#${tag.name} — AXROK Intelligence`,
      description: tag.description || `Cybersecurity research tagged with #${tag.name}.`,
      url: `https://axrok-security.com/tag/${slug}`,
      siteName: "AXROK",
      type: "website",
    },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const [tag, allTags] = await Promise.all([
    getTagBySlug(slug),
    getTags(),
  ]);

  if (!tag) {
    notFound();
  }

  const postsRes = await getPosts({
    tag: slug,
    status: "published",
    limit: 50,
  });

  const posts = postsRes.posts;

  return (
    <div className="py-8 sm:py-12 bg-white min-h-[70vh]">
      <div className="xrock-container">
        {/* Tag Header Hero */}
        <div className="border-b border-neutral-200 pb-8 sm:pb-12 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <TagIcon className="w-3.5 h-3.5 text-[#F83838]" />
            Tag Archive
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-neutral-900 tracking-tight mb-4 flex items-center gap-2">
            <span className="text-[#F83838]">#</span>{tag.name}
          </h1>

          {tag.description && (
            <p className="text-base sm:text-lg text-neutral-600 max-w-3xl font-sans leading-relaxed">
              {tag.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 mt-6">
            <span>{posts.length} {posts.length === 1 ? "article" : "articles"} indexed</span>
            <span>•</span>
            <span>AXROK Cybersecurity Intelligence Taxonomies</span>
          </div>

          {/* Sibling Tag Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-6">
            <span className="text-xs font-mono text-neutral-400 mr-2">Related Tags:</span>
            {allTags
              .filter((t) => t.slug !== slug)
              .slice(0, 10)
              .map((t) => (
                <Link
                  key={t.slug}
                  href={`/tag/${t.slug}`}
                  className="px-2.5 py-1 rounded-md border border-neutral-200 text-xs font-mono text-neutral-700 hover:border-[#F83838] hover:text-[#F83838] transition-all bg-neutral-50 hover:bg-white"
                >
                  #{t.name}
                </Link>
              ))}
          </div>
        </div>

        {/* Articles Grid */}
        {posts.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-neutral-300 rounded-2xl bg-neutral-50/50">
            <Shield className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-neutral-800">
              No reports indexed with #{tag.name}
            </h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 mb-6">
              Our researchers are actively assembling research on this topic. Browse all news or explore other technical tags.
            </p>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#080808] text-white text-xs font-semibold hover:bg-[#F83838] transition-colors"
            >
              Browse All News <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((article: any, index: number) => (
              <ArticleCard
                key={article._id || article.slug}
                article={article}
                featured={index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
