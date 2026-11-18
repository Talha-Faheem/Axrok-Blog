import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  getPostBySlug,
  getAuthorBySlug,
  getCategoryBySlug,
  getPosts,
} from "@/lib/db/repository";
import {
  Clock,
  Calendar,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { ArticleCard } from "@/components/article-card";
import { NewsletterSection } from "@/components/newsletter-section";
import { ArticleShareBar } from "@/components/article-interactions";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug, false);

  if (!post) {
    return {
      title: "Article Not Found | AXROK",
      description: "The requested security intelligence report does not exist or has been unpublished.",
    };
  }

  const title = post.seoTitle || `${post.title} | AXROK Intelligence`;
  const description = post.seoDescription || post.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://axrok-security.com/blog/${post.slug}`,
      siteName: "AXROK",
      type: "article",
      publishedTime: post.publishedAt || post.createdAt,
      images: [
        {
          url: post.featuredImage || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&h=630&q=80",
          width: 1200,
          height: 630,
          alt: post.imageAlt || post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@axrok_sec",
      images: [
        post.featuredImage || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&h=630&q=80",
      ],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug, false);

  if (!post) {
    notFound();
  }

  const [author, category, relatedRes] = await Promise.all([
    getAuthorBySlug(post.author),
    getCategoryBySlug(post.category),
    getPosts({ category: post.category, limit: 4, status: "published" }),
  ]);

  const relatedArticles = relatedRes.posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  // Extract H2 headings for Table of Contents
  const headingMatches: any[] = Array.from(
    post.content?.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi) || []
  );
  const headings = headingMatches.map((m: any) => (m[1] ? m[1].replace(/<[^>]+>/g, "") : ""));

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently Published";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    image: [post.featuredImage],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: author?.name || "AXROK Analyst",
      url: `https://axrok-security.com/authors/${author?.slug || ""}`,
    },
    publisher: {
      "@type": "Organization",
      name: "AXROK",
      logo: {
        "@type": "ImageObject",
        url: "https://axrok-security.com/logo.png",
      },
    },
  };

  return (
    <article className="py-8 sm:py-12 bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="xrock-container">
        {/* Article Header Container (max 800px) */}
        <header className="max-w-3xl mx-auto space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href={`/category/${category?.slug || post.category}`}
              className="xrock-category"
            >
              {category?.name || post.category}
            </Link>
            <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-xrock-gray-100 text-xrock-black">
              Verified Technical Report
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-display font-extrabold text-xrock-black tracking-tight leading-[1.14]">
            {post.title}
          </h1>

          <p className="text-lg sm:text-xl text-xrock-gray-600 font-sans leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author & Meta Strip */}
          <div className="pt-4 border-t border-xrock-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
            <div className="flex items-center gap-3">
              <Link
                href={`/authors/${author?.slug || post.author}`}
                className="w-10 h-10 rounded-full overflow-hidden border border-xrock-gray-300 bg-xrock-gray-100 shrink-0 block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    author?.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
                  }
                  alt={author?.name || "Author"}
                  className="w-full h-full object-cover"
                />
              </Link>

              <div>
                <Link
                  href={`/authors/${author?.slug || post.author}`}
                  className="font-bold text-xrock-black hover:text-xrock-red transition-colors block text-sm"
                >
                  {author?.name || "AXROK Research Desk"}
                </Link>
                <span className="text-xs text-xrock-gray-600">
                  {author?.designation || "Security Researcher"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs text-xrock-gray-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-xrock-gray-600" />
                <time dateTime={post.publishedAt || post.createdAt}>{publishedDate}</time>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-xrock-gray-600" />
                <span>{post.readingTime} min read</span>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Artwork Banner */}
        <div className="max-w-4xl mx-auto mb-10 rounded-2xl overflow-hidden aspect-[16/9] border border-xrock-gray-100 shadow-md relative bg-xrock-gray-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              post.featuredImage ||
              "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80"
            }
            alt={post.imageAlt || post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Content Layout with Reading Column & Sticky Sidebar */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Article Body (8 cols on lg ~ 740px reading width) */}
          <div className="lg:col-span-8">
            {/* Table of Contents (if 2 or more H2 headings) */}
            {headings.length > 1 && (
              <div className="mb-8 p-5 rounded-xl border border-xrock-gray-100 bg-xrock-gray-50/70 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-xrock-black">
                  <BookOpen className="w-4 h-4 text-xrock-red" />
                  <span>Table of Contents</span>
                </div>
                <ul className="space-y-1.5 text-xs text-xrock-gray-600 font-sans pl-6 list-disc">
                  {headings.map((h, i) => (
                    <li key={i} className="hover:text-xrock-red transition-colors">
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* HTML Body */}
            <div
              className="prose prose-neutral max-w-none xrock-article-body text-base leading-relaxed text-xrock-black font-sans space-y-4"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags Strip */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-xrock-gray-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-xrock-gray-600 font-bold uppercase mr-1">
                  Indexed Tags:
                </span>
                {post.tags.map((t: string) => (
                  <Link
                    key={t}
                    href={`/tag/${t}`}
                    className="px-2.5 py-1 rounded bg-xrock-gray-50 border border-xrock-gray-100 text-xs font-mono text-xrock-black hover:border-xrock-red hover:text-xrock-red transition-colors"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}

            {/* Social Sharing Bar */}
            <ArticleShareBar
              title={post.title}
              url={`https://axrok-security.com/blog/${post.slug}`}
            />

            {/* Source References (Section 4.10) */}
            {post.sources && post.sources.length > 0 && (
              <div className="mt-8 p-6 rounded-xl border border-xrock-gray-100 bg-xrock-gray-50 space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-xrock-black flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Research Citations & CVE Bulletins</span>
                </h3>
                <ul className="space-y-2 text-xs font-mono divide-y divide-xrock-gray-200">
                  {post.sources.map((s: any, idx: number) => (
                    <li key={idx} className="pt-2 first:pt-0 flex items-center justify-between gap-3">
                      <span className="text-xrock-black font-medium truncate">{s.title}</span>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xrock-red hover:underline flex items-center gap-1 shrink-0"
                      >
                        <span>View Bulletin</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Author Profile Bio Box */}
            {author && (
              <div className="mt-10 p-6 rounded-2xl border border-xrock-gray-100 bg-white shadow-xs flex flex-col sm:flex-row items-start gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-xrock-gray-300 bg-xrock-gray-100 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-xrock-black">{author.name}</h3>
                    <Link
                      href={`/authors/${author.slug}`}
                      className="text-xs font-mono text-xrock-red hover:underline"
                    >
                      All Articles →
                    </Link>
                  </div>
                  <p className="text-xs font-mono text-xrock-red font-semibold">
                    {author.designation}
                  </p>
                  <p className="text-xs text-xrock-gray-600 font-sans leading-relaxed pt-1">
                    {author.biography}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (4 cols on lg) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Newsletter CTA widget */}
            <div className="p-5 rounded-xl border border-xrock-gray-100 bg-xrock-gray-50 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-xrock-red block">
                Direct Intel Feed
              </span>
              <h3 className="text-base font-display font-bold text-xrock-black">
                Stay Ahead of Zero-Day Disclosures
              </h3>
              <p className="text-xs text-xrock-gray-600 font-sans leading-relaxed">
                Receive peer-reviewed technical analyses and defensive mitigations in your inbox weekly.
              </p>
              <Link
                href="/#newsletter"
                className="w-full block text-center py-2 px-3 rounded-lg bg-xrock-red text-white text-xs font-semibold hover:bg-xrock-red-dark transition-colors"
              >
                Join Publication Newsletter
              </Link>
            </div>

            {/* Related Research in this Domain */}
            {relatedArticles.length > 0 && (
              <div className="p-5 rounded-xl border border-xrock-gray-100 bg-white space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-xrock-black pb-2 border-b border-xrock-gray-100">
                  Related Investigations
                </h3>
                <div className="space-y-3 divide-y divide-xrock-gray-100">
                  {relatedArticles.map((rel) => (
                    <div key={rel.slug} className="pt-3 first:pt-0">
                      <Link
                        href={`/blog/${rel.slug}`}
                        className="text-xs font-bold text-xrock-black hover:text-xrock-red transition-colors line-clamp-2 leading-snug"
                      >
                        {rel.title}
                      </Link>
                      <span className="text-[11px] font-mono text-xrock-gray-600 block mt-1">
                        {rel.readingTime} min read
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Newsletter Full Strip */}
      <div className="mt-16">
        <NewsletterSection />
      </div>
    </article>
  );
}
