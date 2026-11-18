"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const homepage_controller_js_1 = require("../controllers/homepage.controller.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const router = (0, express_1.Router)();
router.get("/", homepage_controller_js_1.getHomepageSettings);
router.put("/", auth_middleware_js_1.requireAdmin, homepage_controller_js_1.updateHomepageSettings);
exports.default = router;
