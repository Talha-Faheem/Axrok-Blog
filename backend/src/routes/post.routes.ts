import { Router } from "express";
import {
  getPosts,
  getFeaturedPosts,
  getTrendingPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost,
} from "../controllers/post.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createPostSchema } from "../validators/post.validator.js";

const router = Router();

// Public routes
router.get("/", getPosts);
router.get("/featured", getFeaturedPosts);
router.get("/trending", getTrendingPosts);
router.get("/slug/:slug", getPostBySlug);
router.get("/:id", getPostById);

// Admin-protected routes
router.post("/", requireAdmin, validate(createPostSchema), createPost);
router.put("/:id", requireAdmin, updatePost);
router.delete("/:id", requireAdmin, deletePost);
router.post("/:id/publish", requireAdmin, publishPost);
router.post("/:id/unpublish", requireAdmin, unpublishPost);

export default router;
