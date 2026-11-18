import mongoose, { Schema, Document } from "mongoose";

export interface IHomepageSettings extends Document {
  heroPostSlug: string;
  featuredPostSlugs: string[];
  trendingPostSlugs: string[];
  spotlightPostSlug: string;
  announcement: {
    enabled: boolean;
    badge: string;
    message: string;
    linkText: string;
    linkUrl: string;
  };
  visibleSections: {
    hero: boolean;
    latestIntelligence: boolean;
    topics: boolean;
    practicalGuides: boolean;
    vulnerabilitySpotlight: boolean;
    newsletter: boolean;
  };
  sectionOrder: string[];
  updatedAt: Date;
}

const HomepageSettingsSchema = new Schema<IHomepageSettings>(
  {
    heroPostSlug: { type: String, default: "" },
    featuredPostSlugs: [{ type: String }],
    trendingPostSlugs: [{ type: String }],
    spotlightPostSlug: { type: String, default: "" },
    announcement: {
      enabled: { type: Boolean, default: true },
      badge: { type: String, default: "SECURITY ALERT" },
      message: { type: String, default: "Critical infrastructure advisory published." },
      linkText: { type: String, default: "View advisory →" },
      linkUrl: { type: String, default: "/vulnerabilities" },
    },
    visibleSections: {
      hero: { type: Boolean, default: true },
      latestIntelligence: { type: Boolean, default: true },
      topics: { type: Boolean, default: true },
      practicalGuides: { type: Boolean, default: true },
      vulnerabilitySpotlight: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: true },
    },
    sectionOrder: [{ type: String }],
  },
  { timestamps: true }
);

export const HomepageSettings =
  mongoose.models.HomepageSettings ||
  mongoose.model<IHomepageSettings>("HomepageSettings", HomepageSettingsSchema);
