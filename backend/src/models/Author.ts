import mongoose, { Schema, Document } from "mongoose";

export interface IAuthor extends Document {
  name: string;
  slug: string;
  avatar?: string;
  designation?: string;
  biography?: string;
  socialLinks?: {
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
    avatar: { type: String, default: "" },
    designation: { type: String, default: "" },
    biography: { type: String, default: "" },
    socialLinks: {
      twitter: { type: String, default: "" },
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export const Author = mongoose.models.Author || mongoose.model<IAuthor>("Author", AuthorSchema);
