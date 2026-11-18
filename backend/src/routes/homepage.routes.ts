import { Router } from "express";
import { getHomepageSettings, updateHomepageSettings } from "../controllers/homepage.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getHomepageSettings);
router.put("/", requireAdmin, updateHomepageSettings);

export default router;
