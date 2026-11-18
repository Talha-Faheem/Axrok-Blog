"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeNewsletter = subscribeNewsletter;
exports.getSubscribers = getSubscribers;
exports.exportSubscribersCsv = exportSubscribersCsv;
exports.deleteSubscriber = deleteSubscriber;
const NewsletterSubscriber_js_1 = require("../models/NewsletterSubscriber.js");
const store_service_js_1 = require("../services/store.service.js");
async function subscribeNewsletter(req, res) {
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
        if ((0, store_service_js_1.isDbConnected)()) {
            const existing = await NewsletterSubscriber_js_1.NewsletterSubscriber.findOne({ email: email.toLowerCase() });
            if (existing) {
                if (existing.status === "unsubscribed") {
                    existing.status = "subscribed";
                    existing.subscribedAt = new Date();
                    await existing.save();
                }
                res.status(200).json({ message: "Subscription active" });
                return;
            }
            await NewsletterSubscriber_js_1.NewsletterSubscriber.create({
                email: email.toLowerCase(),
                status: "subscribed",
                source: source || "website",
                ipAddress: req.ip || "",
                subscribedAt: new Date(),
            });
            res.status(201).json({ message: "Thank you for subscribing to AXROK Intelligence" });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const existing = (store.newsletterSubscribers || []).find((s) => s.email?.toLowerCase() === email.toLowerCase());
        if (!existing) {
            store.newsletterSubscribers.push({
                id: `sub-${Date.now()}`,
                email: email.toLowerCase(),
                status: "subscribed",
                source: source || "website",
                subscribedAt: new Date().toISOString(),
            });
            (0, store_service_js_1.saveFallbackStore)(store);
        }
        res.status(201).json({ message: "Thank you for subscribing to AXROK Intelligence" });
    }
    catch (err) {
        res.status(500).json({ error: "Subscription failed, please try again" });
    }
}
async function getSubscribers(req, res) {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 50);
        const skip = (page - 1) * limit;
        if ((0, store_service_js_1.isDbConnected)()) {
            const [subscribers, total] = await Promise.all([
                NewsletterSubscriber_js_1.NewsletterSubscriber.find().sort({ subscribedAt: -1 }).skip(skip).limit(limit).lean(),
                NewsletterSubscriber_js_1.NewsletterSubscriber.countDocuments(),
            ]);
            res.status(200).json({ subscribers, total, page, limit });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const subscribers = store.newsletterSubscribers || [];
        const total = subscribers.length;
        res.status(200).json({
            subscribers: subscribers.slice(skip, skip + limit),
            total,
            page,
            limit,
        });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch subscribers" });
    }
}
async function exportSubscribersCsv(req, res) {
    try {
        let subscribers = [];
        if ((0, store_service_js_1.isDbConnected)()) {
            subscribers = await NewsletterSubscriber_js_1.NewsletterSubscriber.find({ status: "subscribed" }).lean();
        }
        else {
            subscribers = ((0, store_service_js_1.getFallbackStore)().newsletterSubscribers || []).filter((s) => s.status === "subscribed");
        }
        let csv = "Email,Status,SubscribedAt,Source\n";
        for (const s of subscribers) {
            csv += `"${s.email}","${s.status}","${new Date(s.subscribedAt).toISOString()}","${s.source || ""}"\n`;
        }
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=axrok-subscribers.csv");
        res.status(200).send(csv);
    }
    catch (err) {
        res.status(500).json({ error: "CSV export failed" });
    }
}
async function deleteSubscriber(req, res) {
    try {
        const { id } = req.params;
        if ((0, store_service_js_1.isDbConnected)()) {
            await NewsletterSubscriber_js_1.NewsletterSubscriber.findByIdAndDelete(id);
            res.status(200).json({ message: "Subscriber removed" });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        store.newsletterSubscribers = (store.newsletterSubscribers || []).filter((s) => s.id !== id && s._id !== id);
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(200).json({ message: "Subscriber removed" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to remove subscriber" });
    }
}
