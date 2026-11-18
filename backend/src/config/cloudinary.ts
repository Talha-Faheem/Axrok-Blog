import { v2 as cloudinary } from "cloudinary";
import { logger } from "../utils/logger.js";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = !!(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
  logger.info("Cloudinary service initialized successfully");
} else {
  logger.info("Cloudinary credentials not set — Using local disk upload storage fallback");
}

export { cloudinary };
