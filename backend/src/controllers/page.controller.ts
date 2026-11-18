import { Request, Response } from "express";
import slugify from "slugify";
import { Page } from "../models/Page.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { isDbConnected, getFallbackStore, saveFallbackStore } from "../services/store.service.js";

export async function getPages(req: Request, res: Response): Promise<void> {
  try {
    if (isDbConnected()) {
      const pages = await Page.find().sort({ title: 1 }).lean();
      res.status(200).json({ pages });
      return;
    }
    const store = getFallbackStore();
    res.status(200).json({ pages: store.pages || [] });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch static pages" });
  }
}

export async function getPageBySlug(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    if (isDbConnected()) {
      const page = await Page.findOne({ slug }).lean();
      if (!page) {
        res.status(404).json({ error: "Page not found" });
        return;
      }
      res.status(200).json({ page });
      return;
    }
    const store = getFallbackStore();
    const page = (store.pages || []).find((p: any) => p.slug === slug);
    if (!page) {
      res.status(404).json({ error: "Page not found" });
      return;
    }
    res.status(200).json({ page });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch page" });
  }
}

export async function createPage(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = req.body;
    const slug = data.slug
      ? slugify(data.slug, { lower: true, strict: true })
      : slugify(data.title, { lower: true, strict: true });

    if (isDbConnected()) {
      const created = await Page.create({ ...data, slug });
      res.status(201).json({ message: "Page created", page: created });
      return;
    }
    const store = getFallbackStore();
    const newPage = { ...data, slug, id: `page-${Date.now()}` };
    store.pages.push(newPage);
    saveFallbackStore(store);
    res.status(201).json({ message: "Page created", page: newPage });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to create page" });
  }
}

export async function updatePage(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const updated = await Page.findByIdAndUpdate(id, { $set: req.body }, { new: true });
      if (!updated) {
        res.status(404).json({ error: "Page not found" });
        return;
      }
      res.status(200).json({ message: "Page updated", page: updated });
      return;
    }
    const store = getFallbackStore();
    const idx = (store.pages || []).findIndex((p: any) => p.id === id || p._id === id);
    if (idx === -1) {
      res.status(404).json({ error: "Page not found" });
      return;
    }
    store.pages[idx] = { ...store.pages[idx], ...req.body };
    saveFallbackStore(store);
    res.status(200).json({ message: "Page updated", page: store.pages[idx] });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to update page" });
  }
}

export async function deletePage(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      await Page.findByIdAndDelete(id);
      res.status(200).json({ message: "Page deleted" });
      return;
    }
    const store = getFallbackStore();
    store.pages = (store.pages || []).filter((p: any) => p.id !== id && p._id !== id);
    saveFallbackStore(store);
    res.status(200).json({ message: "Page deleted" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete page" });
  }
}
