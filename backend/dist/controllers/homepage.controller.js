"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHomepageSettings = getHomepageSettings;
exports.updateHomepageSettings = updateHomepageSettings;
const HomepageSettings_js_1 = require("../models/HomepageSettings.js");
const store_service_js_1 = require("../services/store.service.js");
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
async function getHomepageSettings(req, res) {
    try {
        if ((0, store_service_js_1.isDbConnected)()) {
            let settings = await HomepageSettings_js_1.HomepageSettings.findOne().lean();
            if (!settings) {
                settings = await HomepageSettings_js_1.HomepageSettings.create(DEFAULT_HOMEPAGE_SETTINGS);
            }
            res.status(200).json({ settings });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        res.status(200).json({ settings: store.homepageSettings || DEFAULT_HOMEPAGE_SETTINGS });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch homepage settings", settings: DEFAULT_HOMEPAGE_SETTINGS });
    }
}
async function updateHomepageSettings(req, res) {
    try {
        const data = req.body;
        if ((0, store_service_js_1.isDbConnected)()) {
            let settings = await HomepageSettings_js_1.HomepageSettings.findOne();
            if (!settings) {
                settings = await HomepageSettings_js_1.HomepageSettings.create({ ...DEFAULT_HOMEPAGE_SETTINGS, ...data });
            }
            else {
                Object.assign(settings, data);
                await settings.save();
            }
            res.status(200).json({ message: "Homepage settings updated", settings });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        store.homepageSettings = { ...(store.homepageSettings || DEFAULT_HOMEPAGE_SETTINGS), ...data };
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(200).json({ message: "Homepage settings updated", settings: store.homepageSettings });
    }
    catch (err) {
        res.status(400).json({ error: err.message || "Failed to update homepage settings" });
    }
}
