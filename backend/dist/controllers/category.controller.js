"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = getCategories;
exports.getCategoryBySlug = getCategoryBySlug;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
const slugify_1 = __importDefault(require("slugify"));
const Category_js_1 = require("../models/Category.js");
const Post_js_1 = require("../models/Post.js");
const store_service_js_1 = require("../services/store.service.js");
async function getCategories(req, res) {
    try {
        const { featured } = req.query;
        if ((0, store_service_js_1.isDbConnected)()) {
            const filter = {};
            if (featured !== undefined)
                filter.featured = String(featured) === "true";
            const categories = await Category_js_1.Category.find(filter).sort({ order: 1, name: 1 }).lean();
            res.status(200).json({ categories });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        let categories = store.categories || [];
        if (featured !== undefined) {
            categories = categories.filter((c) => String(c.featured) === String(featured));
        }
        res.status(200).json({ categories });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch categories" });
    }
}
async function getCategoryBySlug(req, res) {
    try {
        const { slug } = req.params;
        if ((0, store_service_js_1.isDbConnected)()) {
            const category = await Category_js_1.Category.findOne({ slug }).lean();
            if (!category) {
                res.status(404).json({ error: "Category not found" });
                return;
            }
            res.status(200).json({ category });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const category = (store.categories || []).find((c) => c.slug === slug);
        if (!category) {
            res.status(404).json({ error: "Category not found" });
            return;
        }
        res.status(200).json({ category });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch category" });
    }
}
async function createCategory(req, res) {
    try {
        const data = req.body;
        const slug = data.slug
            ? (0, slugify_1.default)(data.slug, { lower: true, strict: true })
            : (0, slugify_1.default)(data.name, { lower: true, strict: true });
        if ((0, store_service_js_1.isDbConnected)()) {
            const existing = await Category_js_1.Category.findOne({ slug });
            if (existing) {
                res.status(400).json({ error: "A category with this slug already exists" });
                return;
            }
            const created = await Category_js_1.Category.create({ ...data, slug });
            res.status(201).json({ message: "Category created", category: created });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const newCat = { ...data, slug, id: `cat-${Date.now()}` };
        store.categories.push(newCat);
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(201).json({ message: "Category created", category: newCat });
    }
    catch (err) {
        res.status(400).json({ error: err.message || "Failed to create category" });
    }
}
async function updateCategory(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;
        if ((0, store_service_js_1.isDbConnected)()) {
            const updated = await Category_js_1.Category.findByIdAndUpdate(id, { $set: data }, { new: true });
            if (!updated) {
                res.status(404).json({ error: "Category not found" });
                return;
            }
            res.status(200).json({ message: "Category updated", category: updated });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const idx = (store.categories || []).findIndex((c) => c.id === id || c._id === id);
        if (idx === -1) {
            res.status(404).json({ error: "Category not found" });
            return;
        }
        store.categories[idx] = { ...store.categories[idx], ...data };
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(200).json({ message: "Category updated", category: store.categories[idx] });
    }
    catch (err) {
        res.status(400).json({ error: err.message || "Failed to update category" });
    }
}
async function deleteCategory(req, res) {
    try {
        const { id } = req.params;
        if ((0, store_service_js_1.isDbConnected)()) {
            const cat = await Category_js_1.Category.findById(id);
            if (!cat) {
                res.status(404).json({ error: "Category not found" });
                return;
            }
            const count = await Post_js_1.Post.countDocuments({
                $or: [{ category: cat._id }, { "category.slug": cat.slug }],
            });
            if (count > 0) {
                res.status(400).json({
                    error: `Cannot delete category: ${count} article(s) are assigned to it. Reassign articles first.`,
                });
                return;
            }
            await Category_js_1.Category.findByIdAndDelete(id);
            res.status(200).json({ message: "Category deleted" });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        store.categories = (store.categories || []).filter((c) => c.id !== id && c._id !== id);
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(200).json({ message: "Category deleted" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete category" });
    }
}
