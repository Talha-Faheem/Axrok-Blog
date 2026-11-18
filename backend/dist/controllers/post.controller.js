"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = getPosts;
exports.getFeaturedPosts = getFeaturedPosts;
exports.getTrendingPosts = getTrendingPosts;
exports.getPostBySlug = getPostBySlug;
exports.getPostById = getPostById;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.publishPost = publishPost;
exports.unpublishPost = unpublishPost;
const slugify_1 = __importDefault(require("slugify"));
const Post_js_1 = require("../models/Post.js");
const store_service_js_1 = require("../services/store.service.js");
async function getPosts(req, res) {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;
        const { status, category, tag, author, featured, trending, search } = req.query;
        if ((0, store_service_js_1.isDbConnected)()) {
            const filter = {};
            if (status)
                filter.status = status;
            else
                filter.status = "published";
            if (category)
                filter["category.slug"] = category;
            if (tag)
                filter["tags.slug"] = tag;
            if (author)
                filter["author.slug"] = author;
            if (featured !== undefined)
                filter.isFeatured = String(featured) === "true";
            if (trending !== undefined)
                filter.isTrending = String(trending) === "true";
            if (search) {
                const q = String(search).trim();
                filter.$or = [
                    { title: { $regex: q, $options: "i" } },
                    { excerpt: { $regex: q, $options: "i" } },
                    { content: { $regex: q, $options: "i" } },
                ];
            }
            const [posts, total] = await Promise.all([
                Post_js_1.Post.find(filter)
                    .sort({ publishedAt: -1, createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Post_js_1.Post.countDocuments(filter),
            ]);
            res.status(200).json({
                posts,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit) || 1,
            });
            return;
        }
        // Fallback store
        const store = (0, store_service_js_1.getFallbackStore)();
        let posts = [...(store.posts || [])];
        if (status)
            posts = posts.filter((p) => p.status === status);
        else
            posts = posts.filter((p) => p.status === "published");
        if (category)
            posts = posts.filter((p) => p.category?.slug === category || p.category === category);
        if (tag)
            posts = posts.filter((p) => p.tags?.some((t) => t === tag || t.slug === tag));
        if (author)
            posts = posts.filter((p) => p.author?.slug === author || p.author === author);
        if (featured !== undefined)
            posts = posts.filter((p) => String(p.isFeatured) === String(featured));
        if (trending !== undefined)
            posts = posts.filter((p) => String(p.isTrending) === String(trending));
        if (search) {
            const q = String(search).toLowerCase();
            posts = posts.filter((p) => p.title?.toLowerCase().includes(q) ||
                p.excerpt?.toLowerCase().includes(q) ||
                p.content?.toLowerCase().includes(q));
        }
        const total = posts.length;
        const paginated = posts.slice(skip, skip + limit);
        res.status(200).json({
            posts: paginated,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch articles", details: err.message });
    }
}
async function getFeaturedPosts(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 4;
        if ((0, store_service_js_1.isDbConnected)()) {
            const posts = await Post_js_1.Post.find({ status: "published", isFeatured: true })
                .sort({ publishedAt: -1 })
                .limit(limit)
                .lean();
            res.status(200).json({ posts });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const posts = (store.posts || []).filter((p) => p.status === "published" && p.isFeatured).slice(0, limit);
        res.status(200).json({ posts });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch featured articles" });
    }
}
async function getTrendingPosts(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 5;
        if ((0, store_service_js_1.isDbConnected)()) {
            const posts = await Post_js_1.Post.find({ status: "published", isTrending: true })
                .sort({ views: -1, publishedAt: -1 })
                .limit(limit)
                .lean();
            res.status(200).json({ posts });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const posts = (store.posts || []).filter((p) => p.status === "published" && p.isTrending).slice(0, limit);
        res.status(200).json({ posts });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch trending articles" });
    }
}
async function getPostBySlug(req, res) {
    try {
        const { slug } = req.params;
        if ((0, store_service_js_1.isDbConnected)()) {
            const post = await Post_js_1.Post.findOne({ slug }).lean();
            if (!post) {
                res.status(404).json({ error: "Article not found" });
                return;
            }
            Post_js_1.Post.updateOne({ _id: post._id }, { $inc: { views: 1 } }).exec();
            res.status(200).json({ post });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const post = (store.posts || []).find((p) => p.slug === slug);
        if (!post) {
            res.status(404).json({ error: "Article not found" });
            return;
        }
        res.status(200).json({ post });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch article details" });
    }
}
async function getPostById(req, res) {
    try {
        const { id } = req.params;
        if ((0, store_service_js_1.isDbConnected)()) {
            const post = await Post_js_1.Post.findById(id).lean();
            if (!post) {
                res.status(404).json({ error: "Article not found" });
                return;
            }
            res.status(200).json({ post });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const post = (store.posts || []).find((p) => p.id === id || p._id === id);
        if (!post) {
            res.status(404).json({ error: "Article not found" });
            return;
        }
        res.status(200).json({ post });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to retrieve article" });
    }
}
async function createPost(req, res) {
    try {
        const data = req.body;
        const baseSlug = data.slug || data.title;
        let slug = (0, slugify_1.default)(baseSlug, { lower: true, strict: true });
        const wordCount = (data.content || "").replace(/<[^>]+>/g, " ").split(/\s+/).length;
        const readingTime = Math.max(1, Math.round(wordCount / 200));
        const postData = {
            ...data,
            slug,
            readingTime,
            views: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        if (data.status === "published" && !data.publishedAt) {
            postData.publishedAt = new Date().toISOString();
        }
        if ((0, store_service_js_1.isDbConnected)()) {
            const created = await Post_js_1.Post.create(postData);
            res.status(201).json({ message: "Article created successfully", post: created });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const newPost = { ...postData, id: `post-${Date.now()}` };
        store.posts.unshift(newPost);
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(201).json({ message: "Article created successfully", post: newPost });
    }
    catch (err) {
        res.status(400).json({ error: err.message || "Failed to create article" });
    }
}
async function updatePost(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;
        if (data.status === "published" && !data.publishedAt) {
            data.publishedAt = new Date();
        }
        if ((0, store_service_js_1.isDbConnected)()) {
            const updated = await Post_js_1.Post.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
            if (!updated) {
                res.status(404).json({ error: "Article not found" });
                return;
            }
            res.status(200).json({ message: "Article updated successfully", post: updated });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const idx = (store.posts || []).findIndex((p) => p.id === id || p._id === id);
        if (idx === -1) {
            res.status(404).json({ error: "Article not found" });
            return;
        }
        store.posts[idx] = { ...store.posts[idx], ...data, updatedAt: new Date().toISOString() };
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(200).json({ message: "Article updated successfully", post: store.posts[idx] });
    }
    catch (err) {
        res.status(400).json({ error: err.message || "Failed to update article" });
    }
}
async function deletePost(req, res) {
    try {
        const { id } = req.params;
        if ((0, store_service_js_1.isDbConnected)()) {
            const deleted = await Post_js_1.Post.findByIdAndDelete(id);
            if (!deleted) {
                res.status(404).json({ error: "Article not found" });
                return;
            }
            res.status(200).json({ message: "Article deleted successfully" });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        store.posts = (store.posts || []).filter((p) => p.id !== id && p._id !== id);
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(200).json({ message: "Article deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete article" });
    }
}
async function publishPost(req, res) {
    try {
        const { id } = req.params;
        if ((0, store_service_js_1.isDbConnected)()) {
            const post = await Post_js_1.Post.findById(id);
            if (!post) {
                res.status(404).json({ error: "Article not found" });
                return;
            }
            post.status = "published";
            if (!post.publishedAt)
                post.publishedAt = new Date();
            await post.save();
            res.status(200).json({ message: "Article published successfully", post });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const post = (store.posts || []).find((p) => p.id === id || p._id === id);
        if (!post) {
            res.status(404).json({ error: "Article not found" });
            return;
        }
        post.status = "published";
        if (!post.publishedAt)
            post.publishedAt = new Date().toISOString();
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(200).json({ message: "Article published successfully", post });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to publish article" });
    }
}
async function unpublishPost(req, res) {
    try {
        const { id } = req.params;
        if ((0, store_service_js_1.isDbConnected)()) {
            const post = await Post_js_1.Post.findById(id);
            if (!post) {
                res.status(404).json({ error: "Article not found" });
                return;
            }
            post.status = "draft";
            await post.save();
            res.status(200).json({ message: "Article moved to draft", post });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const post = (store.posts || []).find((p) => p.id === id || p._id === id);
        if (!post) {
            res.status(404).json({ error: "Article not found" });
            return;
        }
        post.status = "draft";
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(200).json({ message: "Article moved to draft", post });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to unpublish article" });
    }
}
