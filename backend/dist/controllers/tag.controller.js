"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTags = getTags;
exports.getTagBySlug = getTagBySlug;
exports.createTag = createTag;
exports.updateTag = updateTag;
exports.deleteTag = deleteTag;
const slugify_1 = __importDefault(require("slugify"));
const Tag_js_1 = require("../models/Tag.js");
const store_service_js_1 = require("../services/store.service.js");
async function getTags(req, res) {
    try {
        if ((0, store_service_js_1.isDbConnected)()) {
            const tags = await Tag_js_1.Tag.find().sort({ name: 1 }).lean();
            res.status(200).json({ tags });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        res.status(200).json({ tags: store.tags || [] });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch tags" });
    }
}
async function getTagBySlug(req, res) {
    try {
        const { slug } = req.params;
        if ((0, store_service_js_1.isDbConnected)()) {
            const tag = await Tag_js_1.Tag.findOne({ slug }).lean();
            if (!tag) {
                res.status(404).json({ error: "Tag not found" });
                return;
            }
            res.status(200).json({ tag });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const tag = (store.tags || []).find((t) => t.slug === slug);
        if (!tag) {
            res.status(404).json({ error: "Tag not found" });
            return;
        }
        res.status(200).json({ tag });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch tag" });
    }
}
async function createTag(req, res) {
    try {
        const data = req.body;
        const slug = data.slug
            ? (0, slugify_1.default)(data.slug, { lower: true, strict: true })
            : (0, slugify_1.default)(data.name, { lower: true, strict: true });
        if ((0, store_service_js_1.isDbConnected)()) {
            const created = await Tag_js_1.Tag.create({ ...data, slug });
            res.status(201).json({ message: "Tag created", tag: created });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const newTag = { ...data, slug, id: `tag-${Date.now()}` };
        store.tags.push(newTag);
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(201).json({ message: "Tag created", tag: newTag });
    }
    catch (err) {
        res.status(400).json({ error: err.message || "Failed to create tag" });
    }
}
async function updateTag(req, res) {
    try {
        const { id } = req.params;
        if ((0, store_service_js_1.isDbConnected)()) {
            const updated = await Tag_js_1.Tag.findByIdAndUpdate(id, { $set: req.body }, { new: true });
            if (!updated) {
                res.status(404).json({ error: "Tag not found" });
                return;
            }
            res.status(200).json({ message: "Tag updated", tag: updated });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const idx = (store.tags || []).findIndex((t) => t.id === id || t._id === id);
        if (idx === -1) {
            res.status(404).json({ error: "Tag not found" });
            return;
        }
        store.tags[idx] = { ...store.tags[idx], ...req.body };
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(200).json({ message: "Tag updated", tag: store.tags[idx] });
    }
    catch (err) {
        res.status(400).json({ error: err.message || "Failed to update tag" });
    }
}
async function deleteTag(req, res) {
    try {
        const { id } = req.params;
        if ((0, store_service_js_1.isDbConnected)()) {
            await Tag_js_1.Tag.findByIdAndDelete(id);
            res.status(200).json({ message: "Tag deleted" });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        store.tags = (store.tags || []).filter((t) => t.id !== id && t._id !== id);
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(200).json({ message: "Tag deleted" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete tag" });
    }
}
