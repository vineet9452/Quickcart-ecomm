

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI; // ✅ Backend-Only Variable

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in environment variables");
}

// ✅ Global Caching (Next.js Serverless के लिए)
let cached = globalThis.mongoose || { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) {
    console.log("📌 Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("⏳ Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // ✅ Serverless में Performance बेहतर होगी
      autoIndex: false, // ✅ Auto Indexing से Performance Issue बचाने के लिए
      serverSelectionTimeoutMS: 10000, // ✅ 10 सेकंड तक Wait करेगा
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB Connected Successfully");
    return cached.conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    throw new Error("Database connection failed");
  }
};

// ✅ Global Caching (Development Mode में)
if (process.env.NODE_ENV !== "production") {
  globalThis.mongoose = cached;
}

export default connectDB;
