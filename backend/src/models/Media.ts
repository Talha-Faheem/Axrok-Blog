import mongoose, { Schema, Document } from "mongoose";

export interface IMedia extends Document {
  filename: string;
  url: string;
  publicId?: string;
  size: number;
  mimeType: string;
  altText?: string;
  uploadedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    altText: { type: String, default: "" },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Media = mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema);
