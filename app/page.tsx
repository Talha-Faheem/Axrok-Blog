import {
  getHomepageSettings,
  getPostBySlug,
  getPosts,
  getCategories,
} from "@/lib/db/repository";
import { HeroFeature } from "@/components/hero-feature";
import { LatestIntelligence } from "@/components/latest-intelligence";
import { TopicGrid } from "@/components/topic-grid";
import { PracticalGuides } from "@/components/practical-guides";
import { VulnerabilitySpotlight } from "@/components/vulnerability-spotlight";
import { NewsletterSection } from "@/components/newsletter-section";

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const settings = await getHomepageSettings();

  // 1. Resolve Hero Post
  let heroPost = null;
  if (settings.heroPostSlug) {
    heroPost = await getPostBySlug(settings.heroPostSlug, false);
  }
  if (!heroPost) {
    const featuredRes = await getPosts({ featured: true, limit: 1, status: "published" });
    heroPost = featuredRes.posts[0] || null;
  }
  if (!heroPost) {
    const latestRes = await getPosts({ limit: 1, status: "published" });
    heroPost = latestRes.posts[0] || null;
  }

  // 2. Resolve Latest Intelligence articles (excluding hero)
  const latestResult = await getPosts({ limit: 6, status: "published" });
  const intelligenceArticles = latestResult.posts.filter((p) => p.slug !== heroPost?.slug);

  // 3. Resolve Topics / Categories
  const categories = await getCategories(true);

  // 4. Resolve Spotlight Post
  let spotlightPost = null;
  if (settings.spotlightPostSlug) {
    spotlightPost = await getPostBySlug(settings.spotlightPostSlug, false);
  }

  const visible = settings.visibleSections || {
    hero: true,
    latestIntelligence: true,
    topics: true,
    practicalGuides: true,
    vulnerabilitySpotlight: true,
    newsletter: true,
  };

  return (
    <>
      {/* 6.3 Hero / Featured Story */}
      {visible.hero && heroPost && <HeroFeature article={heroPost} />}

      {/* 6.4 Latest Articles / Field Telemetry */}
      {visible.latestIntelligence && (
        <LatestIntelligence articles={intelligenceArticles} />
      )}

      {/* 6.5 Explore Topics Grid */}
      {visible.topics && <TopicGrid categories={categories} />}

      {/* 6.6 Practical Guides & Defensive Labs */}
      {visible.practicalGuides && <PracticalGuides />}

      {/* 6.7 Threat / Vulnerability Spotlight */}
      {visible.vulnerabilitySpotlight && (
        <VulnerabilitySpotlight article={spotlightPost} />
      )}

      {/* 6.8 Newsletter Signup Panel */}
      {visible.newsletter && <NewsletterSection />}
    </>
  );
}
