import { HeroFeature } from "@/components/hero-feature";
import { LatestIntelligence } from "@/components/latest-intelligence";
import { TopicGrid } from "@/components/topic-grid";
import { PracticalGuides } from "@/components/practical-guides";
import { VulnerabilitySpotlight } from "@/components/vulnerability-spotlight";
import { NewsletterSection } from "@/components/newsletter-section";

export default function HomePage() {
  return (
    <>
      {/* 6.3 Hero / Featured Story */}
      <HeroFeature />

      {/* 6.4 Latest Articles / Field Telemetry */}
      <LatestIntelligence />

      {/* 6.5 Explore Topics Grid */}
      <TopicGrid />

      {/* 6.6 Practical Guides & Defensive Labs */}
      <PracticalGuides />

      {/* 6.7 Threat / Vulnerability Spotlight (CVE-2024-38077) */}
      <VulnerabilitySpotlight />

      {/* 6.8 Newsletter Signup Panel */}
      <NewsletterSection />
    </>
  );
}

