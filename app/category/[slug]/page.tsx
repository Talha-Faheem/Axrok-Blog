import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Rss, Shield, ArrowRight, BookOpen, Layers } from "lucide-react";
import { getCategoryBySlug, getPosts, getCategories } from "@/lib/db/repository";
import { ArticleCard } from "@/components/article-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found | AXROK",
    };
  }

  return {
    title: `${category.name} | Cybersecurity Intelligence | AXROK`,
    description: category.description || `Read the latest cybersecurity research and dispatches in ${category.name} on AXROK.`,
    alternates: {
      canonical: `/category/${slug}`,
    },
    openGraph: {
      title: `${category.name} — AXROK`,
      description: category.description || `In-depth articles covering ${category.name}.`,
      url: `https://axrok-security.com/category/${slug}`,
      siteName: "AXROK",
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [category, allCategories] = await Promise.all([
    getCategoryBySlug(slug),
    getCategories(true),
  ]);

  if (!category) {
    notFound();
  }

  const postsRes = await getPosts({
    category: slug,
    status: "published",
    limit: 50,
  });

  const posts = postsRes.posts;

  return (
    <div className="py-8 sm:py-12 bg-white min-h-[70vh]">
      <div className="xrock-container">
        {/* Category Header Hero */}
        <div className="border-b border-neutral-200 pb-8 sm:pb-12 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono font-semibold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-[#F83838]" />
              Topic Dossier
            </div>
            <a
              href={`/rss.xml?category=${slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-600 hover:text-[#F83838] transition-colors"
            >
              <Rss className="w-3.5 h-3.5" />
              Category RSS Feed
            </a>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-neutral-900 tracking-tight mb-4">
            {category.name}
          </h1>

          {category.description && (
            <p className="text-base sm:text-lg text-neutral-600 max-w-3xl font-sans leading-relaxed">
              {category.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 mt-6">
            <span>{posts.length} {posts.length === 1 ? "article" : "articles"} published</span>
            <span>•</span>
            <span>Continuously monitored by AXROK Intelligence</span>
          </div>

          {/* Sibling Categories Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-6">
            <span className="text-xs font-mono text-neutral-400 mr-2">Other Topics:</span>
            {allCategories
              .filter((c) => c.slug !== slug)
              .slice(0, 6)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="px-3 py-1 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 hover:border-[#F83838] hover:text-[#F83838] transition-all bg-neutral-50 hover:bg-white"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </div>

        {/* Articles Grid */}
        {posts.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-neutral-300 rounded-2xl bg-neutral-50/50">
            <Shield className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-neutral-800">
              No reports published yet in {category.name}
            </h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 mb-6">
              Our researchers are actively assembling dossiers on this category. Check back shortly or browse other cybersecurity topics.
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
