import { Request, Response } from "express";
import slugify from "slugify";
import { Tag } from "../models/Tag.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { isDbConnected, getFallbackStore, saveFallbackStore } from "../services/store.service.js";

export async function getTags(req: Request, res: Response): Promise<void> {
  try {
    if (isDbConnected()) {
      const tags = await Tag.find().sort({ name: 1 }).lean();
      res.status(200).json({ tags });
      return;
    }
    const store = getFallbackStore();
    res.status(200).json({ tags: store.tags || [] });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch tags" });
  }
}

export async function getTagBySlug(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    if (isDbConnected()) {
      const tag = await Tag.findOne({ slug }).lean();
      if (!tag) {
        res.status(404).json({ error: "Tag not found" });
        return;
      }
      res.status(200).json({ tag });
      return;
    }
    const store = getFallbackStore();
    const tag = (store.tags || []).find((t: any) => t.slug === slug);
    if (!tag) {
      res.status(404).json({ error: "Tag not found" });
      return;
    }
    res.status(200).json({ tag });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch tag" });
  }
}

export async function createTag(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = req.body;
    const slug = data.slug
      ? slugify(data.slug, { lower: true, strict: true })
      : slugify(data.name, { lower: true, strict: true });

    if (isDbConnected()) {
      const created = await Tag.create({ ...data, slug });
      res.status(201).json({ message: "Tag created", tag: created });
      return;
    }
    const store = getFallbackStore();
    const newTag = { ...data, slug, id: `tag-${Date.now()}` };
    store.tags.push(newTag);
    saveFallbackStore(store);
    res.status(201).json({ message: "Tag created", tag: newTag });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to create tag" });
  }
}

export async function updateTag(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const updated = await Tag.findByIdAndUpdate(id, { $set: req.body }, { new: true });
      if (!updated) {
        res.status(404).json({ error: "Tag not found" });
        return;
      }
      res.status(200).json({ message: "Tag updated", tag: updated });
      return;
    }
    const store = getFallbackStore();
    const idx = (store.tags || []).findIndex((t: any) => t.id === id || t._id === id);
    if (idx === -1) {
      res.status(404).json({ error: "Tag not found" });
      return;
    }
    store.tags[idx] = { ...store.tags[idx], ...req.body };
    saveFallbackStore(store);
    res.status(200).json({ message: "Tag updated", tag: store.tags[idx] });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to update tag" });
  }
}

export async function deleteTag(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      await Tag.findByIdAndDelete(id);
      res.status(200).json({ message: "Tag deleted" });
      return;
    }
    const store = getFallbackStore();
    store.tags = (store.tags || []).filter((t: any) => t.id !== id && t._id !== id);
    saveFallbackStore(store);
    res.status(200).json({ message: "Tag deleted" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete tag" });
  }
}
