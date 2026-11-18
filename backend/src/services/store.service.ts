import fs from "fs";
import path from "path";
import mongoose from "mongoose";

function resolveStorePath(): string {
  const localDataPath = path.resolve(process.cwd(), "data", "axrok-store.json");
  if (fs.existsSync(localDataPath)) return localDataPath;
  const parentDataPath = path.resolve(process.cwd(), "..", "data", "axrok-store.json");
  if (fs.existsSync(parentDataPath)) return parentDataPath;
  return localDataPath;
}

const STORE_PATH = resolveStorePath();

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export function getFallbackStore(): any {
  try {
    if (fs.existsSync(STORE_PATH)) {
      return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
    }
  } catch (err) {
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

export function saveFallbackStore(data: any): void {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("[Store] Error saving fallback store", err);
  }
}
