"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.isCloudinaryConfigured = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const logger_js_1 = require("../utils/logger.js");
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
exports.isCloudinaryConfigured = !!(cloudName && apiKey && apiSecret);
if (exports.isCloudinaryConfigured) {
    cloudinary_1.v2.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });
    logger_js_1.logger.info("Cloudinary service initialized successfully");
}
else {
    logger_js_1.logger.info("Cloudinary credentials not set — Using local disk upload storage fallback");
}
