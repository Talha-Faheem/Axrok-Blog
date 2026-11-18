import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPostSource {
  title: string;
  url: string;
}

export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  imageAlt: string;
  category: string; // Category slug or ID
  tags: string[]; // Tag slugs or IDs
  author: string; // Author slug or ID
  status: "draft" | "published" | "scheduled" | "archived";
  isFeatured: boolean;
  isTrending: boolean;
  readingTime: number;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  sources?: IPostSource[];
  publishedAt?: Date;
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    featuredImage: { type: String, default: "" },
    imageAlt: { type: String, default: "" },
    category: { type: String, required: true, index: true },
    tags: { type: [String], default: [], index: true },
    author: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["draft", "published", "scheduled", "archived"],
      default: "draft",
      index: true,
    },
    isFeatured: { type: Boolean, default: false, index: true },
    isTrending: { type: Boolean, default: false, index: true },
    readingTime: { type: Number, default: 5 },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
    sources: [
      {
        title: { type: String, default: "" },
        url: { type: String, default: "" },
      },
    ],
    publishedAt: { type: Date, default: null, index: true },
    scheduledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

PostSchema.index({ title: "text", excerpt: "text", content: "text" });

export const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
