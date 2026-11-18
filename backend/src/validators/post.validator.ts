import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().optional(),
  excerpt: z.string().min(5, "Excerpt must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  featuredImage: z.string().optional(),
  imageAlt: z.string().optional(),
  category: z.any(),
  tags: z.array(z.any()).optional(),
  author: z.any().optional(),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  isFeatured: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  readingTime: z.number().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  references: z.array(z.object({ title: z.string(), url: z.string() })).optional(),
  publishedAt: z.string().optional(),
  scheduledAt: z.string().optional(),
});
