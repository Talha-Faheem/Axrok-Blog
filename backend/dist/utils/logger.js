"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logger = {
    info: (msg, ...args) => console.log(`[AXROK-BACKEND] [INFO] ${msg}`, ...args),
    warn: (msg, ...args) => console.warn(`[AXROK-BACKEND] [WARN] ${msg}`, ...args),
    error: (msg, ...args) => console.error(`[AXROK-BACKEND] [ERROR] ${msg}`, ...args),
};
