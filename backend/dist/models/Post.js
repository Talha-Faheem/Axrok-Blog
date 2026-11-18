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
exports.Post = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PostSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    featuredImage: { type: String, default: "" },
    imageAlt: { type: String, default: "" },
    category: { type: mongoose_1.Schema.Types.Mixed, required: true, index: true },
    tags: [{ type: mongoose_1.Schema.Types.Mixed, index: true }],
    author: { type: mongoose_1.Schema.Types.Mixed, required: true, index: true },
    status: { type: String, enum: ["draft", "published", "scheduled"], default: "draft", index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isTrending: { type: Boolean, default: false, index: true },
    readingTime: { type: Number, default: 5 },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
    references: [{ title: { type: String }, url: { type: String } }],
    views: { type: Number, default: 0 },
    publishedAt: { type: Date, index: true },
    scheduledAt: { type: Date },
}, { timestamps: true });
// Performance compound indexes for lightning-fast queries
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ status: 1, category: 1, publishedAt: -1 });
PostSchema.index({ status: 1, isFeatured: 1 });
PostSchema.index({ status: 1, isTrending: 1 });
exports.Post = mongoose_1.default.models.Post || mongoose_1.default.model("Post", PostSchema);
