import { Metadata } from "next";
import Link from "next/link";
import { Users, Twitter, Github, Linkedin, Shield, ArrowRight } from "lucide-react";
import { getAuthors } from "@/lib/db/repository";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Security Researchers & Editorial Authors | AXROK",
  description:
    "Meet the researchers, reverse engineers, and defensive analysts authoring AXROK threat intelligence and cybersecurity dossiers.",
  alternates: {
    canonical: "/authors",
  },
  openGraph: {
    title: "Security Researchers & Editorial Authors | AXROK",
    description: "Meet the researchers authoring AXROK threat intelligence publications.",
    url: "https://axrok-security.com/authors",
    siteName: "AXROK",
    type: "website",
  },
};

export default async function AuthorsPage() {
  const authors = await getAuthors();

  return (
    <div className="py-8 sm:py-12 bg-white min-h-[70vh]">
      <div className="xrock-container">
        {/* Header Hero */}
        <div className="border-b border-neutral-200 pb-8 sm:pb-12 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Users className="w-3.5 h-3.5 text-[#F83838]" />
            Editorial Bureau & Threat Researchers
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-neutral-900 tracking-tight mb-4">
            AXROK Research Masthead
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 max-w-3xl font-sans leading-relaxed">
            Our editorial desk is driven by practicing security engineers, red team operators, vulnerability analysts, and threat intelligence practitioners committed to technically grounded reporting.
          </p>

          <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 mt-6">
            <span>{authors.length} Editorial Researchers</span>
            <span>•</span>
            <span>Zero Sponsor Influence</span>
            <span>•</span>
            <span>Evidence-Led Analysis</span>
          </div>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {authors.map((author: any) => {
            const avatarUrl =
              author.avatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80";

            return (
              <div
                key={author._id || author.slug}
                className="xrock-card group flex flex-col justify-between bg-white border border-neutral-200 rounded-2xl p-6 hover:border-[#F83838] transition-all"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-neutral-200 group-hover:border-[#F83838] transition-colors shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={avatarUrl}
                        alt={author.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-neutral-900 group-hover:text-[#F83838] transition-colors">
                        <Link href={`/authors/${author.slug}`}>
                          {author.name}
                        </Link>
                      </h3>
                      <p className="text-xs font-mono text-[#F83838] font-semibold mt-0.5">
                        {author.designation || "Cybersecurity Analyst"}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-600 font-sans line-clamp-3 leading-relaxed mb-6">
                    {author.biography || "Security researcher and technical contributor to AXROK Cybersecurity Intelligence."}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {author.socialLinks?.twitter && (
                      <a
                        href={author.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
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
                        className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
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
                        className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                        aria-label="LinkedIn Profile"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <Link
                    href={`/authors/${author.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#F83838] hover:underline"
                  >
                    View Dossiers <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
