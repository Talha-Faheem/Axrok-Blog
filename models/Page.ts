import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPage extends Document {
  title: string;
  slug: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    content: { type: String, default: "" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "published" },
  },
  { timestamps: true }
);

export const Page: Model<IPage> =
  mongoose.models.Page || mongoose.model<IPage>("Page", PageSchema);
