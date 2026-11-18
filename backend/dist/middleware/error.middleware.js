"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_js_1 = require("../utils/logger.js");
function errorHandler(err, req, res, next) {
    logger_js_1.logger.error(`Unhandled Request Error [${req.method} ${req.url}]:`, err);
    const statusCode = err.statusCode || (err.name === "ValidationError" ? 400 : 500);
    const message = err.message || "Internal server error occurred";
    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
}
