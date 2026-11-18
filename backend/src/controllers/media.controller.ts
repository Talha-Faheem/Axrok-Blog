import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { Media } from "../models/Media.js";
import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { isDbConnected, getFallbackStore, saveFallbackStore } from "../services/store.service.js";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

export async function uploadMedia(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No image file provided" });
      return;
    }

    const file = req.file;
    const altText = req.body.altText || file.originalname;

    let mediaUrl = "";
    let publicId = "";

    if (isCloudinaryConfigured) {
      const uploadRes: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "axrok" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });

      mediaUrl = uploadRes.secure_url;
      publicId = uploadRes.public_id;
    } else {
      const ext = path.extname(file.originalname) || ".jpg";
      const filename = `media-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filePath = path.join(UPLOADS_DIR, filename);

      fs.writeFileSync(filePath, file.buffer);
      mediaUrl = `http://localhost:${process.env.PORT || 5000}/uploads/${filename}`;
      publicId = filename;
    }

    const mediaData = {
      id: `media-${Date.now()}`,
      filename: file.originalname,
      url: mediaUrl,
      publicId,
      size: file.size,
      mimeType: file.mimetype,
      altText,
      uploadedBy: req.user?.userId,
      createdAt: new Date().toISOString(),
    };

    if (isDbConnected()) {
      const mediaDoc = await Media.create(mediaData);
      res.status(201).json({
        message: "Media uploaded successfully",
        media: mediaDoc,
        url: mediaUrl,
      });
      return;
    }

    const store = getFallbackStore();
    store.media = store.media || [];
    store.media.unshift(mediaData);
    saveFallbackStore(store);

    res.status(201).json({
      message: "Media uploaded successfully",
      media: mediaData,
      url: mediaUrl,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
}

export async function getMedia(req: Request, res: Response): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 30);
    const skip = (page - 1) * limit;

    if (isDbConnected()) {
      const [media, total] = await Promise.all([
        Media.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Media.countDocuments(),
      ]);
      res.status(200).json({ media, total, page, limit });
      return;
    }

    const store = getFallbackStore();
    const media = store.media || [];
    const total = media.length;
    res.status(200).json({
      media: media.slice(skip, skip + limit),
      total,
      page,
      limit,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to retrieve media library" });
  }
}

export async function deleteMedia(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const item = await Media.findById(id);
      if (!item) {
        res.status(404).json({ error: "Media item not found" });
        return;
      }
      if (item.publicId && isCloudinaryConfigured) {
        try {
          await cloudinary.uploader.destroy(item.publicId);
        } catch (e) {}
      } else if (item.publicId && !isCloudinaryConfigured) {
        const localPath = path.join(UPLOADS_DIR, item.publicId);
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
      }
      await Media.findByIdAndDelete(id);
      res.status(200).json({ message: "Media deleted successfully" });
      return;
    }

    const store = getFallbackStore();
    const item = (store.media || []).find((m: any) => m.id === id || m._id === id);
    if (!item) {
      res.status(404).json({ error: "Media item not found" });
      return;
    }
    if (item.publicId && !isCloudinaryConfigured) {
      const localPath = path.join(UPLOADS_DIR, item.publicId);
      if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
    }
    store.media = (store.media || []).filter((m: any) => m.id !== id && m._id !== id);
    saveFallbackStore(store);
    res.status(200).json({ message: "Media deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete media asset" });
  }
}
