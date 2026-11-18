import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import postRoutes from "./post.routes.js";
import categoryRoutes from "./category.routes.js";
import tagRoutes from "./tag.routes.js";
import authorRoutes from "./author.routes.js";
import mediaRoutes from "./media.routes.js";
import homepageRoutes from "./homepage.routes.js";
import newsletterRoutes from "./newsletter.routes.js";
import pageRoutes from "./page.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/categories", categoryRoutes);
router.use("/tags", tagRoutes);
router.use("/authors", authorRoutes);
router.use("/media", mediaRoutes);
router.use("/homepage", homepageRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/pages", pageRoutes);

export default router;
