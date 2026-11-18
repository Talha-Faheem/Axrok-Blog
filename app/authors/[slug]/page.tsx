import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Users, Twitter, Github, Linkedin, Shield, ArrowRight, BookOpen } from "lucide-react";
import { getAuthorBySlug, getPosts } from "@/lib/db/repository";
import { ArticleCard } from "@/components/article-card";

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return {
      title: "Author Not Found | AXROK",
    };
  }

  return {
    title: `${author.name} — ${author.designation || "Cybersecurity Researcher"} | AXROK`,
    description: author.biography || `Read cybersecurity research and investigations authored by ${author.name} on AXROK.`,
    alternates: {
      canonical: `/authors/${slug}`,
    },
    openGraph: {
      title: `${author.name} | AXROK Editorial Bureau`,
      description: author.biography || `Cybersecurity research authored by ${author.name}.`,
      url: `https://axrok-security.com/authors/${slug}`,
      siteName: "AXROK",
      type: "profile",
    },
  };
}

export default async function AuthorProfilePage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const postsRes = await getPosts({
    author: slug,
    status: "published",
    limit: 50,
  });

  const posts = postsRes.posts;
  const avatarUrl =
    author.avatar ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";

  return (
    <div className="py-8 sm:py-12 bg-white min-h-[70vh]">
      <div className="xrock-container">
        {/* Author Profile Header */}
        <div className="border-b border-neutral-200 pb-8 sm:pb-12 mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-neutral-200 shadow-md shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt={author.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded font-mono text-[11px] font-bold uppercase tracking-wider bg-neutral-100 text-[#F83838]">
                Editorial Masthead
              </div>

              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-neutral-900 tracking-tight">
                {author.name}
              </h1>

              <p className="text-sm font-mono text-neutral-600 font-semibold">
                {author.designation || "Cybersecurity Researcher"}
              </p>

              {author.biography && (
                <p className="text-sm text-neutral-700 font-sans max-w-2xl leading-relaxed pt-1">
                  {author.biography}
                </p>
              )}

              {/* Social Links */}
              <div className="flex items-center gap-3 pt-3">
                {author.socialLinks?.twitter && (
                  <a
                    href={author.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-neutral-100 hover:bg-[#F83838] hover:text-white text-neutral-700 transition-colors"
                    aria-label="Twitter Profile"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {author.socialLinks?.github && (
                  <a
                    href={author.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-neutral-100 hover:bg-[#080808] hover:text-white text-neutral-700 transition-colors"
                    aria-label="GitHub Profile"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {author.socialLinks?.linkedin && (
                  <a
                    href={author.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-neutral-100 hover:bg-[#0A66C2] hover:text-white text-neutral-700 transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 mt-8 pt-6 border-t border-neutral-100">
            <span>{posts.length} Published {posts.length === 1 ? "Dossier" : "Dossiers"}</span>
            <span>•</span>
            <Link href="/authors" className="text-[#F83838] hover:underline">
              ← View All Masthead Researchers
            </Link>
          </div>
        </div>

        {/* Authored Articles */}
        <div>
          <h2 className="font-display font-bold text-2xl text-neutral-900 tracking-tight mb-6">
            Published Intelligence & Investigations
          </h2>

          {posts.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-neutral-300 rounded-2xl bg-neutral-50">
              <Shield className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-neutral-700">
                No articles published by {author.name} yet.
              </p>
              <p className="text-xs text-neutral-500 mt-1">Check back shortly for new investigations.</p>
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
    </div>
  );
}
