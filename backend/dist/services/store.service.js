"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDbConnected = isDbConnected;
exports.getFallbackStore = getFallbackStore;
exports.saveFallbackStore = saveFallbackStore;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
function resolveStorePath() {
    const localDataPath = path_1.default.resolve(process.cwd(), "data", "axrok-store.json");
    if (fs_1.default.existsSync(localDataPath))
        return localDataPath;
    const parentDataPath = path_1.default.resolve(process.cwd(), "..", "data", "axrok-store.json");
    if (fs_1.default.existsSync(parentDataPath))
        return parentDataPath;
    return localDataPath;
}
const STORE_PATH = resolveStorePath();
function isDbConnected() {
    return mongoose_1.default.connection.readyState === 1;
}
function getFallbackStore() {
    try {
        if (fs_1.default.existsSync(STORE_PATH)) {
            return JSON.parse(fs_1.default.readFileSync(STORE_PATH, "utf-8"));
        }
    }
    catch (err) {
        console.error("[Store] Error reading fallback store", err);
    }
    return {
        users: [],
        posts: [],
        categories: [],
        tags: [],
        authors: [],
        media: [],
        pages: [],
        newsletterSubscribers: [],
        homepageSettings: {},
        siteSettings: {},
    };
}
function saveFallbackStore(data) {
    try {
        const dir = path_1.default.dirname(STORE_PATH);
        if (!fs_1.default.existsSync(dir))
            fs_1.default.mkdirSync(dir, { recursive: true });
        fs_1.default.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
    }
    catch (err) {
        console.error("[Store] Error saving fallback store", err);
    }
}
