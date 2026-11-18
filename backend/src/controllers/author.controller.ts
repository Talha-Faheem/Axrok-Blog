import { Request, Response } from "express";
import slugify from "slugify";
import { Author } from "../models/Author.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { isDbConnected, getFallbackStore, saveFallbackStore } from "../services/store.service.js";

export async function getAuthors(req: Request, res: Response): Promise<void> {
  try {
    if (isDbConnected()) {
      const authors = await Author.find().sort({ name: 1 }).lean();
      res.status(200).json({ authors });
      return;
    }
    const store = getFallbackStore();
    res.status(200).json({ authors: store.authors || [] });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch authors" });
  }
}

export async function getAuthorBySlug(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    if (isDbConnected()) {
      const author = await Author.findOne({ slug }).lean();
      if (!author) {
        res.status(404).json({ error: "Author not found" });
        return;
      }
      res.status(200).json({ author });
      return;
    }
    const store = getFallbackStore();
    const author = (store.authors || []).find((a: any) => a.slug === slug);
    if (!author) {
      res.status(404).json({ error: "Author not found" });
      return;
    }
    res.status(200).json({ author });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch author" });
  }
}

export async function createAuthor(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = req.body;
    const slug = data.slug
      ? slugify(data.slug, { lower: true, strict: true })
      : slugify(data.name, { lower: true, strict: true });

    if (isDbConnected()) {
      const created = await Author.create({ ...data, slug });
      res.status(201).json({ message: "Author created", author: created });
      return;
    }
    const store = getFallbackStore();
    const newAuthor = { ...data, slug, id: `auth-${Date.now()}` };
    store.authors.push(newAuthor);
    saveFallbackStore(store);
    res.status(201).json({ message: "Author created", author: newAuthor });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to create author" });
  }
}

export async function updateAuthor(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      const updated = await Author.findByIdAndUpdate(id, { $set: req.body }, { new: true });
      if (!updated) {
        res.status(404).json({ error: "Author not found" });
        return;
      }
      res.status(200).json({ message: "Author updated", author: updated });
      return;
    }
    const store = getFallbackStore();
    const idx = (store.authors || []).findIndex((a: any) => a.id === id || a._id === id);
    if (idx === -1) {
      res.status(404).json({ error: "Author not found" });
      return;
    }
    store.authors[idx] = { ...store.authors[idx], ...req.body };
    saveFallbackStore(store);
    res.status(200).json({ message: "Author updated", author: store.authors[idx] });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to update author" });
  }
}

export async function deleteAuthor(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      await Author.findByIdAndDelete(id);
      res.status(200).json({ message: "Author deleted" });
      return;
    }
    const store = getFallbackStore();
    store.authors = (store.authors || []).filter((a: any) => a.id !== id && a._id !== id);
    saveFallbackStore(store);
    res.status(200).json({ message: "Author deleted" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete author" });
  }
}
