import { Request, Response } from "express";
import slugify from "slugify";
import { Category } from "../models/Category.js";
import { Post } from "../models/Post.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { isDbConnected, getFallbackStore, saveFallbackStore } from "../services/store.service.js";

export async function getCategories(req: Request, res: Response): Promise<void> {
  try {
    const { featured } = req.query;
    if (isDbConnected()) {
      const filter: any = {};
      if (featured !== undefined) filter.featured = String(featured) === "true";
      const categories = await Category.find(filter).sort({ order: 1, name: 1 }).lean();
      res.status(200).json({ categories });
      return;
    }

    const store = getFallbackStore();
    let categories = store.categories || [];
    if (featured !== undefined) {
      categories = categories.filter((c: any) => String(c.featured) === String(featured));
    }
    res.status(200).json({ categories });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}

export async function getCategoryBySlug(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    if (isDbConnected()) {
      const category = await Category.findOne({ slug }).lean();
      if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
      }
      res.status(200).json({ category });
      return;
    }

    const store = getFallbackStore();
    const category = (store.categories || []).find((c: any) => c.slug === slug);
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.status(200).json({ category });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
}

export async function createCategory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const data = req.body;
    const slug = data.slug
      ? slugify(data.slug, { lower: true, strict: true })
      : slugify(data.name, { lower: true, strict: true });

    if (isDbConnected()) {
      const existing = await Category.findOne({ slug });
      if (existing) {
        res.status(400).json({ error: "A category with this slug already exists" });
        return;
      }
      const created = await Category.create({ ...data, slug });
      res.status(201).json({ message: "Category created", category: created });
      return;
    }

    const store = getFallbackStore();
    const newCat = { ...data, slug, id: `cat-${Date.now()}` };
    store.categories.push(newCat);
    saveFallbackStore(store);
    res.status(201).json({ message: "Category created", category: newCat });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to create category" });
  }
}

export async function updateCategory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const data = req.body;

    if (isDbConnected()) {
      const updated = await Category.findByIdAndUpdate(id, { $set: data }, { new: true });
      if (!updated) {
        res.status(404).json({ error: "Category not found" });
        return;
      }
      res.status(200).json({ message: "Category updated", category: updated });
      return;
    }

    const store = getFallbackStore();
    const idx = (store.categories || []).findIndex((c: any) => c.id === id || c._id === id);
    if (idx === -1) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    store.categories[idx] = { ...store.categories[idx], ...data };
    saveFallbackStore(store);
    res.status(200).json({ message: "Category updated", category: store.categories[idx] });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to update category" });
  }
}

export async function deleteCategory(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const cat = await Category.findById(id);
      if (!cat) {
        res.status(404).json({ error: "Category not found" });
        return;
      }
      const count = await Post.countDocuments({
        $or: [{ category: cat._id }, { "category.slug": cat.slug }],
      });
      if (count > 0) {
        res.status(400).json({
          error: `Cannot delete category: ${count} article(s) are assigned to it. Reassign articles first.`,
        });
        return;
      }
      await Category.findByIdAndDelete(id);
      res.status(200).json({ message: "Category deleted" });
      return;
    }

    const store = getFallbackStore();
    store.categories = (store.categories || []).filter((c: any) => c.id !== id && c._id !== id);
    saveFallbackStore(store);
    res.status(200).json({ message: "Category deleted" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete category" });
  }
}
