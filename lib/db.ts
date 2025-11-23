import mongoose, { Schema, type Model } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set. Define it in your .env file.");
}

const DB_URI = MONGODB_URI as string;

interface LinkDocument {
  _id: mongoose.Types.ObjectId;
  code: string;
  targetUrl: string;
  createdAt: Date;
  lastClickedAt?: Date | null;
  clicks: number;
}

const LinkSchema = new Schema<LinkDocument>({
  code: { type: String, required: true, unique: true },
  targetUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastClickedAt: { type: Date, default: null },
  clicks: { type: Number, default: 0 },
});

export const Link: Model<LinkDocument> =
  (mongoose.models.Link as Model<LinkDocument>) ||
  mongoose.model<LinkDocument>("Link", LinkSchema);

declare global {

  var mongooseConn:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached =
  global.mongooseConn ??
  (global.mongooseConn = { conn: null, promise: null });

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const isAtlas = DB_URI.includes("mongodb+srv://");

    const opts: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
      retryWrites: true,
      retryReads: true,
    };

    if (!isAtlas) {
      opts.tls = true;
    }

    cached.promise = mongoose
      .connect(DB_URI, opts)
      .then((m) => {
        console.log("✅ MongoDB connected successfully");
        return m;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error.message);
        console.error(
          "Connection string format:",
          isAtlas ? "Atlas (+srv)" : "Standard",
        );
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
