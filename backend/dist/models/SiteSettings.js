"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteSettings = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SiteSettingsSchema = new mongoose_1.Schema({
    siteName: { type: String, default: "AXROK" },
    tagline: { type: String, default: "Understand threats. Build stronger defenses." },
    description: {
        type: String,
        default: "Credible, technically informed cybersecurity news, threat intelligence, vulnerability research, and practical defense architecture.",
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
            default: "Evidence-led technical publication covering offensive tradecraft, defensive engineering, and vulnerability analysis.",
        },
        ogImage: {
            type: String,
            default: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&h=630&q=80",
        },
        twitterHandle: { type: String, default: "@axrok_sec" },
    },
}, { timestamps: true });
exports.SiteSettings = mongoose_1.default.models.SiteSettings || mongoose_1.default.model("SiteSettings", SiteSettingsSchema);
