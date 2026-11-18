import mongoose, { Schema, Document } from "mongoose";

export interface INewsletterSubscriber extends Document {
  email: string;
  status: "subscribed" | "unsubscribed";
  source?: string;
  ipAddress?: string;
  subscribedAt: Date;
  unsubscribedAt?: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    status: { type: String, enum: ["subscribed", "unsubscribed"], default: "subscribed", index: true },
    source: { type: String, default: "homepage" },
    ipAddress: { type: String, default: "" },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date },
  },
  { timestamps: true }
);

export const NewsletterSubscriber =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model<INewsletterSubscriber>("NewsletterSubscriber", NewsletterSubscriberSchema);
