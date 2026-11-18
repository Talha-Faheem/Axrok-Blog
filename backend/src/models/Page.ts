import mongoose, { Schema, Document } from "mongoose";

export interface IPage extends Document {
  title: string;
  slug: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    content: { type: String, required: true },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Page = mongoose.models.Page || mongoose.model<IPage>("Page", PageSchema);
