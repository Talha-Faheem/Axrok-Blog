"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_controller_js_1 = require("../controllers/post.controller.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const validate_middleware_js_1 = require("../middleware/validate.middleware.js");
const post_validator_js_1 = require("../validators/post.validator.js");
const router = (0, express_1.Router)();
// Public routes
router.get("/", post_controller_js_1.getPosts);
router.get("/featured", post_controller_js_1.getFeaturedPosts);
router.get("/trending", post_controller_js_1.getTrendingPosts);
router.get("/slug/:slug", post_controller_js_1.getPostBySlug);
router.get("/:id", post_controller_js_1.getPostById);
// Admin-protected routes
router.post("/", auth_middleware_js_1.requireAdmin, (0, validate_middleware_js_1.validate)(post_validator_js_1.createPostSchema), post_controller_js_1.createPost);
router.put("/:id", auth_middleware_js_1.requireAdmin, post_controller_js_1.updatePost);
router.delete("/:id", auth_middleware_js_1.requireAdmin, post_controller_js_1.deletePost);
router.post("/:id/publish", auth_middleware_js_1.requireAdmin, post_controller_js_1.publishPost);
router.post("/:id/unpublish", auth_middleware_js_1.requireAdmin, post_controller_js_1.unpublishPost);
exports.default = router;
