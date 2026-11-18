import mongoose, { Schema, Document, Model } from "mongoose";

export interface INewsletterSubscriber extends Document {
  email: string;
  status: "active" | "unsubscribed";
  subscribedAt: Date;
  unsubscribedAt?: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    status: { type: String, enum: ["active", "unsubscribed"], default: "active" },
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const NewsletterSubscriber: Model<INewsletterSubscriber> =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model<INewsletterSubscriber>("NewsletterSubscriber", NewsletterSubscriberSchema);
