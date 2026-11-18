import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteSettings extends Document {
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    youtube?: string;
    rss?: string;
  };
  contactEmail: string;
  footerText: string;
  seoDefaults: {
    title: string;
    description: string;
    keywords: string[];
  };
  announcement: {
    enabled: boolean;
    badge: string;
    message: string;
    linkText: string;
    linkUrl: string;
  };
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, default: "AXROK" },
    tagline: { type: String, default: "Understand threats. Build stronger defenses." },
    logo: { type: String, default: "" },
    favicon: { type: String, default: "/favicon.ico" },
    socialLinks: {
      twitter: { type: String, default: "https://twitter.com/axrok_sec" },
      github: { type: String, default: "https://github.com/axrok" },
      linkedin: { type: String, default: "https://linkedin.com/company/axrok" },
      youtube: { type: String, default: "" },
      rss: { type: String, default: "/rss.xml" },
    },
    contactEmail: { type: String, default: "contact@axrok-security.com" },
    footerText: { type: String, default: "AXROK. All rights reserved. Built with Next.js, MongoDB & Tailwind CSS." },
    seoDefaults: {
      title: { type: String, default: "AXROK — Understand Threats. Build Stronger Defenses." },
      description: {
        type: String,
        default: "Credible, technically informed cybersecurity news, threat intelligence, vulnerability analyses, and practical defense guides.",
      },
      keywords: {
        type: [String],
        default: ["Cybersecurity", "Threat Intelligence", "Vulnerability Research", "CVE Advisories", "AppSec", "Zero Trust"],
      },
    },
    announcement: {
      enabled: { type: Boolean, default: true },
      badge: { type: String, default: "CRITICAL ADVISORY" },
      message: { type: String, default: "CVE-2024-38077: Windows Remote Desktop Licensing RCE vulnerability actively analyzed." },
      linkText: { type: String, default: "Technical Analysis →" },
      linkUrl: { type: String, default: "/vulnerabilities" },
    },
  },
  { timestamps: true }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
