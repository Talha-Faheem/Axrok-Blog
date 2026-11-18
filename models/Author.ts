import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuthor extends Document {
  name: string;
  slug: string;
  biography: string;
  avatar: string;
  designation: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AuthorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    biography: { type: String, default: "" },
    avatar: { type: String, default: "" },
    designation: { type: String, default: "Security Researcher" },
    socialLinks: {
      twitter: { type: String, default: "" },
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export const Author: Model<IAuthor> =
  mongoose.models.Author || mongoose.model<IAuthor>("Author", AuthorSchema);
