import mongoose, { Schema, Document } from "mongoose";

export interface ISiteSettings extends Document {
  siteName: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  faviconUrl?: string;
  contactEmail: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    discord?: string;
  };
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    ogImage?: string;
    twitterHandle?: string;
  };
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, default: "AXROK" },
    tagline: { type: String, default: "Understand threats. Build stronger defenses." },
    description: {
      type: String,
      default:
        "Credible, technically informed cybersecurity news, threat intelligence, vulnerability research, and practical defense architecture.",
    },
    logoUrl: { type: String, default: "" },
    faviconUrl: { type: String, default: "" },
    contactEmail: { type: String, default: "contact@axrok.com" },
    socialLinks: {
      twitter: { type: String, default: "https://twitter.com/axrok_sec" },
      github: { type: String, default: "https://github.com/axrok" },
      linkedin: { type: String, default: "https://linkedin.com/company/axrok" },
      discord: { type: String, default: "" },
    },
    seo: {
      defaultTitle: { type: String, default: "AXROK — Understand Threats. Build Stronger Defenses." },
      titleTemplate: { type: String, default: "%s | AXROK Cybersecurity Intelligence" },
      defaultDescription: {
        type: String,
        default:
          "Evidence-led technical publication covering offensive tradecraft, defensive engineering, and vulnerability analysis.",
      },
      ogImage: {
        type: String,
        default: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&h=630&q=80",
      },
      twitterHandle: { type: String, default: "@axrok_sec" },
    },
  },
  { timestamps: true }
);

export const SiteSettings =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
