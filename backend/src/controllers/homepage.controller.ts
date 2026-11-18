import { Request, Response } from "express";
import { HomepageSettings } from "../models/HomepageSettings.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { isDbConnected, getFallbackStore, saveFallbackStore } from "../services/store.service.js";

const DEFAULT_HOMEPAGE_SETTINGS = {
  heroPostSlug: "inside-the-attack-surface-the-security-risks-teams-overlook",
  featuredPostSlugs: [],
  trendingPostSlugs: [],
  spotlightPostSlug: "deep-dive-windows-rce-cve-2024-38077",
  announcement: {
    enabled: true,
    badge: "SECURITY ALERT",
    message: "Critical infrastructure advisory published.",
    linkText: "View advisory →",
    linkUrl: "/vulnerabilities",
  },
  visibleSections: {
    hero: true,
    latestIntelligence: true,
    topics: true,
    practicalGuides: true,
    vulnerabilitySpotlight: true,
    newsletter: true,
  },
  sectionOrder: ["hero", "latestIntelligence", "topics", "practicalGuides", "vulnerabilitySpotlight", "newsletter"],
};

export async function getHomepageSettings(req: Request, res: Response): Promise<void> {
  try {
    if (isDbConnected()) {
      let settings = await HomepageSettings.findOne().lean();
      if (!settings) {
        settings = await HomepageSettings.create(DEFAULT_HOMEPAGE_SETTINGS);
      }
      res.status(200).json({ settings });
      return;
    }
    const store = getFallbackStore();
    res.status(200).json({ settings: store.homepageSettings || DEFAULT_HOMEPAGE_SETTINGS });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch homepage settings", settings: DEFAULT_HOMEPAGE_SETTINGS });
  }
}

export async function updateHomepageSettings(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = req.body;
    if (isDbConnected()) {
      let settings = await HomepageSettings.findOne();
      if (!settings) {
        settings = await HomepageSettings.create({ ...DEFAULT_HOMEPAGE_SETTINGS, ...data });
      } else {
        Object.assign(settings, data);
        await settings.save();
      }
      res.status(200).json({ message: "Homepage settings updated", settings });
      return;
    }
    const store = getFallbackStore();
    store.homepageSettings = { ...(store.homepageSettings || DEFAULT_HOMEPAGE_SETTINGS), ...data };
    saveFallbackStore(store);
    res.status(200).json({ message: "Homepage settings updated", settings: store.homepageSettings });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to update homepage settings" });
  }
}
