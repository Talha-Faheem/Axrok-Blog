import { Request, Response } from "express";
import { NewsletterSubscriber } from "../models/NewsletterSubscriber.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { isDbConnected, getFallbackStore, saveFallbackStore } from "../services/store.service.js";

export async function subscribeNewsletter(req: Request, res: Response): Promise<void> {
  try {
    const { email, website, source } = req.body;

    // Honeypot check for bots
    if (website) {
      res.status(200).json({ message: "Subscription confirmed" });
      return;
    }

    if (!email || !email.includes("@")) {
      res.status(400).json({ error: "Valid email address is required" });
      return;
    }

    if (isDbConnected()) {
      const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });
      if (existing) {
        if (existing.status === "unsubscribed") {
          existing.status = "subscribed";
          existing.subscribedAt = new Date();
          await existing.save();
        }
        res.status(200).json({ message: "Subscription active" });
        return;
      }

      await NewsletterSubscriber.create({
        email: email.toLowerCase(),
        status: "subscribed",
        source: source || "website",
        ipAddress: req.ip || "",
        subscribedAt: new Date(),
      });

      res.status(201).json({ message: "Thank you for subscribing to AXROK Intelligence" });
      return;
    }

    const store = getFallbackStore();
    const existing = (store.newsletterSubscribers || []).find(
      (s: any) => s.email?.toLowerCase() === email.toLowerCase()
    );
    if (!existing) {
      store.newsletterSubscribers.push({
        id: `sub-${Date.now()}`,
        email: email.toLowerCase(),
        status: "subscribed",
        source: source || "website",
        subscribedAt: new Date().toISOString(),
      });
      saveFallbackStore(store);
    }
    res.status(201).json({ message: "Thank you for subscribing to AXROK Intelligence" });
  } catch (err: any) {
    res.status(500).json({ error: "Subscription failed, please try again" });
  }
}

export async function getSubscribers(req: AuthRequest, res: Response): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 50);
    const skip = (page - 1) * limit;

    if (isDbConnected()) {
      const [subscribers, total] = await Promise.all([
        NewsletterSubscriber.find().sort({ subscribedAt: -1 }).skip(skip).limit(limit).lean(),
        NewsletterSubscriber.countDocuments(),
      ]);
      res.status(200).json({ subscribers, total, page, limit });
      return;
    }

    const store = getFallbackStore();
    const subscribers = store.newsletterSubscribers || [];
    const total = subscribers.length;
    res.status(200).json({
      subscribers: subscribers.slice(skip, skip + limit),
      total,
      page,
      limit,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch subscribers" });
  }
}

export async function exportSubscribersCsv(req: AuthRequest, res: Response): Promise<void> {
  try {
    let subscribers: any[] = [];
    if (isDbConnected()) {
      subscribers = await NewsletterSubscriber.find({ status: "subscribed" }).lean();
    } else {
      subscribers = (getFallbackStore().newsletterSubscribers || []).filter((s: any) => s.status === "subscribed");
    }

    let csv = "Email,Status,SubscribedAt,Source\n";
    for (const s of subscribers) {
      csv += `"${s.email}","${s.status}","${new Date(s.subscribedAt).toISOString()}","${s.source || ""}"\n`;
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=axrok-subscribers.csv");
    res.status(200).send(csv);
  } catch (err: any) {
    res.status(500).json({ error: "CSV export failed" });
  }
}

export async function deleteSubscriber(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      await NewsletterSubscriber.findByIdAndDelete(id);
      res.status(200).json({ message: "Subscriber removed" });
      return;
    }

    const store = getFallbackStore();
    store.newsletterSubscribers = (store.newsletterSubscribers || []).filter(
      (s: any) => s.id !== id && s._id !== id
    );
    saveFallbackStore(store);
    res.status(200).json({ message: "Subscriber removed" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to remove subscriber" });
  }
}
