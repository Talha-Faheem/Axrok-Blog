import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMedia extends Document {
  url: string;
  publicId?: string;
  filename: string;
  format: string;
  size: number;
  altText?: string;
  uploadedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    filename: { type: String, required: true },
    format: { type: String, default: "image" },
    size: { type: Number, default: 0 },
    altText: { type: String, default: "" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema);
