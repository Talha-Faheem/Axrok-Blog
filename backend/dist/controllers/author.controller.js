"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthors = getAuthors;
exports.getAuthorBySlug = getAuthorBySlug;
exports.createAuthor = createAuthor;
exports.updateAuthor = updateAuthor;
exports.deleteAuthor = deleteAuthor;
const slugify_1 = __importDefault(require("slugify"));
const Author_js_1 = require("../models/Author.js");
const store_service_js_1 = require("../services/store.service.js");
async function getAuthors(req, res) {
    try {
        if ((0, store_service_js_1.isDbConnected)()) {
            const authors = await Author_js_1.Author.find().sort({ name: 1 }).lean();
            res.status(200).json({ authors });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        res.status(200).json({ authors: store.authors || [] });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch authors" });
    }
}
async function getAuthorBySlug(req, res) {
    try {
        const { slug } = req.params;
        if ((0, store_service_js_1.isDbConnected)()) {
            const author = await Author_js_1.Author.findOne({ slug }).lean();
            if (!author) {
                res.status(404).json({ error: "Author not found" });
                return;
            }
            res.status(200).json({ author });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const author = (store.authors || []).find((a) => a.slug === slug);
        if (!author) {
            res.status(404).json({ error: "Author not found" });
            return;
        }
        res.status(200).json({ author });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch author" });
    }
}
async function createAuthor(req, res) {
    try {
        const data = req.body;
        const slug = data.slug
            ? (0, slugify_1.default)(data.slug, { lower: true, strict: true })
            : (0, slugify_1.default)(data.name, { lower: true, strict: true });
        if ((0, store_service_js_1.isDbConnected)()) {
            const created = await Author_js_1.Author.create({ ...data, slug });
            res.status(201).json({ message: "Author created", author: created });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const newAuthor = { ...data, slug, id: `auth-${Date.now()}` };
        store.authors.push(newAuthor);
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(201).json({ message: "Author created", author: newAuthor });
    }
    catch (err) {
        res.status(400).json({ error: err.message || "Failed to create author" });
    }
}
async function updateAuthor(req, res) {
    try {
        const { id } = req.params;
        if ((0, store_service_js_1.isDbConnected)()) {
            const updated = await Author_js_1.Author.findByIdAndUpdate(id, { $set: req.body }, { new: true });
            if (!updated) {
                res.status(404).json({ error: "Author not found" });
                return;
            }
            res.status(200).json({ message: "Author updated", author: updated });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const idx = (store.authors || []).findIndex((a) => a.id === id || a._id === id);
        if (idx === -1) {
            res.status(404).json({ error: "Author not found" });
            return;
        }
        store.authors[idx] = { ...store.authors[idx], ...req.body };
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(200).json({ message: "Author updated", author: store.authors[idx] });
    }
    catch (err) {
        res.status(400).json({ error: err.message || "Failed to update author" });
    }
}
async function deleteAuthor(req, res) {
    try {
        const { id } = req.params;
        if ((0, store_service_js_1.isDbConnected)()) {
            await Author_js_1.Author.findByIdAndDelete(id);
            res.status(200).json({ message: "Author deleted" });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        store.authors = (store.authors || []).filter((a) => a.id !== id && a._id !== id);
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(200).json({ message: "Author deleted" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete author" });
    }
}
