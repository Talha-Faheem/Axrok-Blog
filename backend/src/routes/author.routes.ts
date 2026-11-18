import { Router } from "express";
import {
  getAuthors,
  getAuthorBySlug,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../controllers/author.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getAuthors);
router.get("/slug/:slug", getAuthorBySlug);
router.post("/", requireAdmin, createAuthor);
router.put("/:id", requireAdmin, updateAuthor);
router.delete("/:id", requireAdmin, deleteAuthor);

export default router;
