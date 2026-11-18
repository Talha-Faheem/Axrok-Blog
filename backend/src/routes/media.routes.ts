import { Router } from "express";
import { uploadMedia, getMedia, deleteMedia } from "../controllers/media.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

router.get("/", requireAdmin, getMedia);
router.post("/upload", requireAdmin, upload.single("file"), uploadMedia);
router.delete("/:id", requireAdmin, deleteMedia);

export default router;
