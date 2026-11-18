"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, "Title must be at least 3 characters"),
    slug: zod_1.z.string().optional(),
    excerpt: zod_1.z.string().min(5, "Excerpt must be at least 5 characters"),
    content: zod_1.z.string().min(10, "Content must be at least 10 characters"),
    featuredImage: zod_1.z.string().optional(),
    imageAlt: zod_1.z.string().optional(),
    category: zod_1.z.any(),
    tags: zod_1.z.array(zod_1.z.any()).optional(),
    author: zod_1.z.any().optional(),
    status: zod_1.z.enum(["draft", "published", "scheduled"]).default("draft"),
    isFeatured: zod_1.z.boolean().optional(),
    isTrending: zod_1.z.boolean().optional(),
    readingTime: zod_1.z.number().optional(),
    seoTitle: zod_1.z.string().optional(),
    seoDescription: zod_1.z.string().optional(),
    canonicalUrl: zod_1.z.string().optional(),
    references: zod_1.z.array(zod_1.z.object({ title: zod_1.z.string(), url: zod_1.z.string() })).optional(),
    publishedAt: zod_1.z.string().optional(),
    scheduledAt: zod_1.z.string().optional(),
});
