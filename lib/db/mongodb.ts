import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/axrok";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastFailedAttempt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
  lastFailedAttempt: 0,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

const RETRY_COOLDOWN_MS = 30000; // Do not block requests if mongod is offline

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (cached.conn) {
    return cached.conn;
  }

  // Fast-fail if recent attempt failed to prevent 2000ms request blocking
  if (Date.now() - cached.lastFailedAttempt < RETRY_COOLDOWN_MS) {
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 1000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("[MongoDB] Connected successfully to:", MONGODB_URI);
      cached.lastFailedAttempt = 0;
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.lastFailedAttempt = Date.now();
    return null;
  }

  return cached.conn;
}
