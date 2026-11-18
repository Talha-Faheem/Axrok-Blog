import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  imageAlt?: string;
  category: mongoose.Types.ObjectId | string;
  tags: (mongoose.Types.ObjectId | string)[];
  author: mongoose.Types.ObjectId | string;
  status: "draft" | "published" | "scheduled";
  isFeatured: boolean;
  isTrending: boolean;
  readingTime?: number;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  references?: { title: string; url: string }[];
  views: number;
  publishedAt?: Date;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    featuredImage: { type: String, default: "" },
    imageAlt: { type: String, default: "" },
    category: { type: Schema.Types.Mixed, required: true, index: true },
    tags: [{ type: Schema.Types.Mixed, index: true }],
    author: { type: Schema.Types.Mixed, required: true, index: true },
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
  },
  { timestamps: true }
);

// Performance compound indexes for lightning-fast queries
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ status: 1, category: 1, publishedAt: -1 });
PostSchema.index({ status: 1, isFeatured: 1 });
PostSchema.index({ status: 1, isTrending: 1 });

export const Post = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
