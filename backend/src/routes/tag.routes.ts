import { Router } from "express";
import {
  getTags,
  getTagBySlug,
  createTag,
  updateTag,
  deleteTag,
} from "../controllers/tag.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getTags);
router.get("/slug/:slug", getTagBySlug);
router.post("/", requireAdmin, createTag);
router.put("/:id", requireAdmin, updateTag);
router.delete("/:id", requireAdmin, deleteTag);

export default router;
