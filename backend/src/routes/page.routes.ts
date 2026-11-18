import { Router } from "express";
import {
  getPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
} from "../controllers/page.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getPages);
router.get("/slug/:slug", getPageBySlug);
router.post("/", requireAdmin, createPage);
router.put("/:id", requireAdmin, updatePage);
router.delete("/:id", requireAdmin, deletePage);

export default router;
