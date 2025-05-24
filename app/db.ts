import mongoose, { Mongoose } from "mongoose";

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const globalCache = globalThis as typeof globalThis & {
  mongooseCache: MongooseCache;
};

if (!globalCache.mongooseCache) {
  globalCache.mongooseCache = { conn: null, promise: null };
}

export async function dbConnect(): Promise<Mongoose> {
  if (globalCache.mongooseCache.conn) return globalCache.mongooseCache.conn;

  if (!globalCache.mongooseCache.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not defined in .env");

    globalCache.mongooseCache.promise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }

  globalCache.mongooseCache.conn = await globalCache.mongooseCache.promise;
  return globalCache.mongooseCache.conn;
}
