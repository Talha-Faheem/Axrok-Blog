"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPages = getPages;
exports.getPageBySlug = getPageBySlug;
exports.createPage = createPage;
exports.updatePage = updatePage;
exports.deletePage = deletePage;
const slugify_1 = __importDefault(require("slugify"));
const Page_js_1 = require("../models/Page.js");
const store_service_js_1 = require("../services/store.service.js");
async function getPages(req, res) {
    try {
        if ((0, store_service_js_1.isDbConnected)()) {
            const pages = await Page_js_1.Page.find().sort({ title: 1 }).lean();
            res.status(200).json({ pages });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        res.status(200).json({ pages: store.pages || [] });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch static pages" });
    }
}
async function getPageBySlug(req, res) {
    try {
        const { slug } = req.params;
        if ((0, store_service_js_1.isDbConnected)()) {
            const page = await Page_js_1.Page.findOne({ slug }).lean();
            if (!page) {
                res.status(404).json({ error: "Page not found" });
                return;
            }
            res.status(200).json({ page });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const page = (store.pages || []).find((p) => p.slug === slug);
        if (!page) {
            res.status(404).json({ error: "Page not found" });
            return;
        }
        res.status(200).json({ page });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch page" });
    }
}
async function createPage(req, res) {
    try {
        const data = req.body;
        const slug = data.slug
            ? (0, slugify_1.default)(data.slug, { lower: true, strict: true })
            : (0, slugify_1.default)(data.title, { lower: true, strict: true });
        if ((0, store_service_js_1.isDbConnected)()) {
            const created = await Page_js_1.Page.create({ ...data, slug });
            res.status(201).json({ message: "Page created", page: created });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const newPage = { ...data, slug, id: `page-${Date.now()}` };
        store.pages.push(newPage);
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(201).json({ message: "Page created", page: newPage });
    }
    catch (err) {
        res.status(400).json({ error: err.message || "Failed to create page" });
    }
}
async function updatePage(req, res) {
    try {
        const { id } = req.params;
        if ((0, store_service_js_1.isDbConnected)()) {
            const updated = await Page_js_1.Page.findByIdAndUpdate(id, { $set: req.body }, { new: true });
            if (!updated) {
                res.status(404).json({ error: "Page not found" });
                return;
            }
            res.status(200).json({ message: "Page updated", page: updated });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const idx = (store.pages || []).findIndex((p) => p.id === id || p._id === id);
        if (idx === -1) {
            res.status(404).json({ error: "Page not found" });
            return;
        }
        store.pages[idx] = { ...store.pages[idx], ...req.body };
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(200).json({ message: "Page updated", page: store.pages[idx] });
    }
    catch (err) {
        res.status(400).json({ error: err.message || "Failed to update page" });
    }
}
async function deletePage(req, res) {
    try {
        const { id } = req.params;
        if ((0, store_service_js_1.isDbConnected)()) {
            await Page_js_1.Page.findByIdAndDelete(id);
            res.status(200).json({ message: "Page deleted" });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        store.pages = (store.pages || []).filter((p) => p.id !== id && p._id !== id);
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(200).json({ message: "Page deleted" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete page" });
    }
}
