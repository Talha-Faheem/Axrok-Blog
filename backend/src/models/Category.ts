import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parentCategory?: mongoose.Types.ObjectId;
  order: number;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, default: "" },
    parentCategory: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    order: { type: Number, default: 0, index: true },
    featured: { type: Boolean, default: false, index: true },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
