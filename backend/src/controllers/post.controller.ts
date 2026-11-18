import { Request, Response } from "express";
import slugify from "slugify";
import { Post } from "../models/Post.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { isDbConnected, getFallbackStore, saveFallbackStore } from "../services/store.service.js";

export async function getPosts(req: Request, res: Response): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const { status, category, tag, author, featured, trending, search } = req.query;

    if (isDbConnected()) {
      const filter: any = {};
      if (status) filter.status = status;
      else filter.status = "published";

      if (category) filter["category.slug"] = category;
      if (tag) filter["tags.slug"] = tag;
      if (author) filter["author.slug"] = author;
      if (featured !== undefined) filter.isFeatured = String(featured) === "true";
      if (trending !== undefined) filter.isTrending = String(trending) === "true";
      if (search) {
        const q = String(search).trim();
        filter.$or = [
          { title: { $regex: q, $options: "i" } },
          { excerpt: { $regex: q, $options: "i" } },
          { content: { $regex: q, $options: "i" } },
        ];
      }

      const [posts, total] = await Promise.all([
        Post.find(filter)
          .sort({ publishedAt: -1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Post.countDocuments(filter),
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
    const store = getFallbackStore();
    let posts = [...(store.posts || [])];

    if (status) posts = posts.filter((p) => p.status === status);
    else posts = posts.filter((p) => p.status === "published");

    if (category) posts = posts.filter((p) => p.category?.slug === category || p.category === category);
    if (tag) posts = posts.filter((p) => p.tags?.some((t: any) => t === tag || t.slug === tag));
    if (author) posts = posts.filter((p) => p.author?.slug === author || p.author === author);
    if (featured !== undefined) posts = posts.filter((p) => String(p.isFeatured) === String(featured));
    if (trending !== undefined) posts = posts.filter((p) => String(p.isTrending) === String(trending));
    if (search) {
      const q = String(search).toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.content?.toLowerCase().includes(q)
      );
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
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch articles", details: err.message });
  }
}

export async function getFeaturedPosts(req: Request, res: Response): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 4;
    if (isDbConnected()) {
      const posts = await Post.find({ status: "published", isFeatured: true })
        .sort({ publishedAt: -1 })
        .limit(limit)
        .lean();
      res.status(200).json({ posts });
      return;
    }
    const store = getFallbackStore();
    const posts = (store.posts || []).filter((p: any) => p.status === "published" && p.isFeatured).slice(0, limit);
    res.status(200).json({ posts });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch featured articles" });
  }
}

export async function getTrendingPosts(req: Request, res: Response): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    if (isDbConnected()) {
      const posts = await Post.find({ status: "published", isTrending: true })
        .sort({ views: -1, publishedAt: -1 })
        .limit(limit)
        .lean();
      res.status(200).json({ posts });
      return;
    }
    const store = getFallbackStore();
    const posts = (store.posts || []).filter((p: any) => p.status === "published" && p.isTrending).slice(0, limit);
    res.status(200).json({ posts });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch trending articles" });
  }
}

export async function getPostBySlug(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    if (isDbConnected()) {
      const post = await Post.findOne({ slug }).lean();
      if (!post) {
        res.status(404).json({ error: "Article not found" });
        return;
      }
      Post.updateOne({ _id: post._id }, { $inc: { views: 1 } }).exec();
      res.status(200).json({ post });
      return;
    }

    const store = getFallbackStore();
    const post = (store.posts || []).find((p: any) => p.slug === slug);
    if (!post) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    res.status(200).json({ post });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch article details" });
  }
}

export async function getPostById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const post = await Post.findById(id).lean();
      if (!post) {
        res.status(404).json({ error: "Article not found" });
        return;
      }
      res.status(200).json({ post });
      return;
    }

    const store = getFallbackStore();
    const post = (store.posts || []).find((p: any) => p.id === id || p._id === id);
    if (!post) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    res.status(200).json({ post });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to retrieve article" });
  }
}

export async function createPost(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = req.body;
    const baseSlug = data.slug || data.title;
    let slug = slugify(baseSlug, { lower: true, strict: true });

    const wordCount = (data.content || "").replace(/<[^>]+>/g, " ").split(/\s+/).length;
    const readingTime = Math.max(1, Math.round(wordCount / 200));

    const postData: any = {
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

    if (isDbConnected()) {
      const created = await Post.create(postData);
      res.status(201).json({ message: "Article created successfully", post: created });
      return;
    }

    const store = getFallbackStore();
    const newPost = { ...postData, id: `post-${Date.now()}` };
    store.posts.unshift(newPost);
    saveFallbackStore(store);

    res.status(201).json({ message: "Article created successfully", post: newPost });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to create article" });
  }
}

export async function updatePost(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.status === "published" && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    if (isDbConnected()) {
      const updated = await Post.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
      if (!updated) {
        res.status(404).json({ error: "Article not found" });
        return;
      }
      res.status(200).json({ message: "Article updated successfully", post: updated });
      return;
    }

    const store = getFallbackStore();
    const idx = (store.posts || []).findIndex((p: any) => p.id === id || p._id === id);
    if (idx === -1) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    store.posts[idx] = { ...store.posts[idx], ...data, updatedAt: new Date().toISOString() };
    saveFallbackStore(store);

    res.status(200).json({ message: "Article updated successfully", post: store.posts[idx] });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to update article" });
  }
}

export async function deletePost(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const deleted = await Post.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({ error: "Article not found" });
        return;
      }
      res.status(200).json({ message: "Article deleted successfully" });
      return;
    }

    const store = getFallbackStore();
    store.posts = (store.posts || []).filter((p: any) => p.id !== id && p._id !== id);
    saveFallbackStore(store);
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete article" });
  }
}

export async function publishPost(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const post = await Post.findById(id);
      if (!post) {
        res.status(404).json({ error: "Article not found" });
        return;
      }
      post.status = "published";
      if (!post.publishedAt) post.publishedAt = new Date();
      await post.save();
      res.status(200).json({ message: "Article published successfully", post });
      return;
    }

    const store = getFallbackStore();
    const post = (store.posts || []).find((p: any) => p.id === id || p._id === id);
    if (!post) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    post.status = "published";
    if (!post.publishedAt) post.publishedAt = new Date().toISOString();
    saveFallbackStore(store);
    res.status(200).json({ message: "Article published successfully", post });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to publish article" });
  }
}

export async function unpublishPost(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const post = await Post.findById(id);
      if (!post) {
        res.status(404).json({ error: "Article not found" });
        return;
      }
      post.status = "draft";
      await post.save();
      res.status(200).json({ message: "Article moved to draft", post });
      return;
    }

    const store = getFallbackStore();
    const post = (store.posts || []).find((p: any) => p.id === id || p._id === id);
    if (!post) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    post.status = "draft";
    saveFallbackStore(store);
    res.status(200).json({ message: "Article moved to draft", post });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to unpublish article" });
  }
}
