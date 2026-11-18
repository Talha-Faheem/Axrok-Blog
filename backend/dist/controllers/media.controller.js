"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMedia = uploadMedia;
exports.getMedia = getMedia;
exports.deleteMedia = deleteMedia;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Media_js_1 = require("../models/Media.js");
const cloudinary_js_1 = require("../config/cloudinary.js");
const store_service_js_1 = require("../services/store.service.js");
const UPLOADS_DIR = path_1.default.join(process.cwd(), "uploads");
async function uploadMedia(req, res) {
    try {
        if (!req.file) {
            res.status(400).json({ error: "No image file provided" });
            return;
        }
        const file = req.file;
        const altText = req.body.altText || file.originalname;
        let mediaUrl = "";
        let publicId = "";
        if (cloudinary_js_1.isCloudinaryConfigured) {
            const uploadRes = await new Promise((resolve, reject) => {
                const stream = cloudinary_js_1.cloudinary.uploader.upload_stream({ folder: "axrok" }, (err, result) => {
                    if (err)
                        reject(err);
                    else
                        resolve(result);
                });
                stream.end(file.buffer);
            });
            mediaUrl = uploadRes.secure_url;
            publicId = uploadRes.public_id;
        }
        else {
            const ext = path_1.default.extname(file.originalname) || ".jpg";
            const filename = `media-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
            const filePath = path_1.default.join(UPLOADS_DIR, filename);
            fs_1.default.writeFileSync(filePath, file.buffer);
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
        if ((0, store_service_js_1.isDbConnected)()) {
            const mediaDoc = await Media_js_1.Media.create(mediaData);
            res.status(201).json({
                message: "Media uploaded successfully",
                media: mediaDoc,
                url: mediaUrl,
            });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        store.media = store.media || [];
        store.media.unshift(mediaData);
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(201).json({
            message: "Media uploaded successfully",
            media: mediaData,
            url: mediaUrl,
        });
    }
    catch (err) {
        res.status(500).json({ error: "Upload failed", details: err.message });
    }
}
async function getMedia(req, res) {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 30);
        const skip = (page - 1) * limit;
        if ((0, store_service_js_1.isDbConnected)()) {
            const [media, total] = await Promise.all([
                Media_js_1.Media.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
                Media_js_1.Media.countDocuments(),
            ]);
            res.status(200).json({ media, total, page, limit });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const media = store.media || [];
        const total = media.length;
        res.status(200).json({
            media: media.slice(skip, skip + limit),
            total,
            page,
            limit,
        });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to retrieve media library" });
    }
}
async function deleteMedia(req, res) {
    try {
        const { id } = req.params;
        if ((0, store_service_js_1.isDbConnected)()) {
            const item = await Media_js_1.Media.findById(id);
            if (!item) {
                res.status(404).json({ error: "Media item not found" });
                return;
            }
            if (item.publicId && cloudinary_js_1.isCloudinaryConfigured) {
                try {
                    await cloudinary_js_1.cloudinary.uploader.destroy(item.publicId);
                }
                catch (e) { }
            }
            else if (item.publicId && !cloudinary_js_1.isCloudinaryConfigured) {
                const localPath = path_1.default.join(UPLOADS_DIR, item.publicId);
                if (fs_1.default.existsSync(localPath))
                    fs_1.default.unlinkSync(localPath);
            }
            await Media_js_1.Media.findByIdAndDelete(id);
            res.status(200).json({ message: "Media deleted successfully" });
            return;
        }
        const store = (0, store_service_js_1.getFallbackStore)();
        const item = (store.media || []).find((m) => m.id === id || m._id === id);
        if (!item) {
            res.status(404).json({ error: "Media item not found" });
            return;
        }
        if (item.publicId && !cloudinary_js_1.isCloudinaryConfigured) {
            const localPath = path_1.default.join(UPLOADS_DIR, item.publicId);
            if (fs_1.default.existsSync(localPath))
                fs_1.default.unlinkSync(localPath);
        }
        store.media = (store.media || []).filter((m) => m.id !== id && m._id !== id);
        (0, store_service_js_1.saveFallbackStore)(store);
        res.status(200).json({ message: "Media deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete media asset" });
    }
}
