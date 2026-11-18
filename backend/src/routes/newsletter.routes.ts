import { Router } from "express";
import {
  subscribeNewsletter,
  getSubscribers,
  exportSubscribersCsv,
  deleteSubscriber,
} from "../controllers/newsletter.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/subscribe", subscribeNewsletter);
router.get("/subscribers", requireAdmin, getSubscribers);
router.get("/export", requireAdmin, exportSubscribersCsv);
router.delete("/subscribers/:id", requireAdmin, deleteSubscriber);

export default router;
