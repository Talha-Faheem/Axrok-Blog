import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHomepageSettings extends Document {
  heroPostSlug: string;
  featuredPostSlugs: string[];
  trendingPostSlugs: string[];
  spotlightPostSlug: string;
  visibleSections: {
    announcement: boolean;
    hero: boolean;
    latestIntelligence: boolean;
    topics: boolean;
    practicalGuides: boolean;
    vulnerabilitySpotlight: boolean;
    newsletter: boolean;
  };
  sectionOrder: string[];
  announcement: {
    enabled: boolean;
    badge: string;
    text: string;
    link: string;
  };
  updatedAt: Date;
}

const HomepageSettingsSchema = new Schema<IHomepageSettings>(
  {
    heroPostSlug: { type: String, default: "" },
    featuredPostSlugs: { type: [String], default: [] },
    trendingPostSlugs: { type: [String], default: [] },
    spotlightPostSlug: { type: String, default: "" },
    visibleSections: {
      announcement: { type: Boolean, default: true },
      hero: { type: Boolean, default: true },
      latestIntelligence: { type: Boolean, default: true },
      topics: { type: Boolean, default: true },
      practicalGuides: { type: Boolean, default: true },
      vulnerabilitySpotlight: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: true },
    },
    sectionOrder: {
      type: [String],
      default: [
        "announcement",
        "hero",
        "latestIntelligence",
        "topics",
        "practicalGuides",
        "vulnerabilitySpotlight",
        "newsletter",
      ],
    },
    announcement: {
      enabled: { type: Boolean, default: true },
      badge: { type: String, default: "CRITICAL ADVISORY" },
      text: { type: String, default: "CVE-2024-38077: Windows Remote Desktop Licensing RCE vulnerability actively analyzed." },
      link: { type: String, default: "/vulnerabilities" },
    },
  },
  { timestamps: true }
);

export const HomepageSettings: Model<IHomepageSettings> =
  mongoose.models.HomepageSettings ||
  mongoose.model<IHomepageSettings>("HomepageSettings", HomepageSettingsSchema);
