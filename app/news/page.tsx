import { Metadata } from "next";
import { NewsListingContent } from "@/components/news-listing-content";
import { getPosts, getCategories } from "@/lib/db/repository";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Cybersecurity News & Threat Dispatches | AXROK",
  description:
    "Timely dispatches, emerging threat investigations, zero-day disclosures, and regulatory movements vetted by the AXROK security desk.",
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: "Cybersecurity News | AXROK Intelligence",
    description: "Timely dispatches, emerging threat investigations, and zero-day disclosures.",
    url: "https://axrok-security.com/news",
    siteName: "AXROK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cybersecurity News | AXROK Intelligence",
    description: "Timely dispatches and zero-day threat investigations.",
    creator: "@axrok_sec",
  },
};

export default async function NewsPage() {
  const [postsRes, categories, trendingRes] = await Promise.all([
    getPosts({ limit: 50, status: "published" }),
    getCategories(true),
    getPosts({ trending: true, limit: 4, status: "published" }),
  ]);

  return (
    <div className="py-8 sm:py-12 bg-white">
      <div className="xrock-container">
        <NewsListingContent
          initialArticles={postsRes.posts}
          initialFeatured={postsRes.posts[0] || null}
          categoriesList={categories}
          trendingList={trendingRes.posts}
        />
      </div>
    </div>
  );
}
