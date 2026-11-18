import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Shield, Calendar, Clock, ArrowLeft } from "lucide-react";
import { getPageBySlug } from "@/lib/db/repository";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: "Page Not Found | AXROK",
    };
  }

  return {
    title: `${page.title} | AXROK Cybersecurity Intelligence`,
    description: page.metaDescription || page.title,
    alternates: {
      canonical: `/${slug}`,
    },
    openGraph: {
      title: `${page.title} — AXROK`,
      description: page.metaDescription || page.title,
      url: `https://axrok-security.com/${slug}`,
      siteName: "AXROK",
      type: "website",
    },
  };
}

export default async function DynamicStaticPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page || !page.published) {
    notFound();
  }

  const updatedDate = page.updatedAt || page.createdAt;
  const formattedDate = updatedDate
    ? new Date(updatedDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <article className="py-12 sm:py-16 bg-white min-h-[70vh]">
      <div className="xrock-article-body px-4">
        {/* Page Header */}
        <header className="border-b border-neutral-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-neutral-100 text-[#F83838] text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5" /> Official Publication Dossier
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-neutral-900 tracking-tight leading-tight mb-4">
            {page.title}
          </h1>

          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>Last reviewed: {formattedDate}</span>
            <span>•</span>
            <span>AXROK Editorial & Legal Compliance Bureau</span>
          </div>
        </header>

        {/* Page Content Body */}
        <div
          className="prose prose-neutral max-w-none font-sans text-neutral-800 leading-relaxed space-y-6 text-sm sm:text-base [&>h2]:font-display [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-neutral-900 [&>h2]:pt-6 [&>h3]:font-display [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-neutral-900 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>a]:text-[#F83838] [&>a]:underline [&>blockquote]:border-l-4 [&>blockquote]:border-[#F83838] [&>blockquote]:pl-4 [&>blockquote]:italic"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        {/* Footer Note */}
        <div className="mt-16 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <p>© {new Date().getFullYear()} AXROK Media Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-neutral-900">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-neutral-900">
              Terms
            </Link>
            <Link href="/editorial-policy" className="hover:text-neutral-900">
              Editorial Policy
            </Link>
            <Link href="/contact" className="hover:text-neutral-900">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
