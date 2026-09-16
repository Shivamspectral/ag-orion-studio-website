import { db } from "./index";

if (!db) {
  throw new Error(
    "DATABASE_URL is required for admin/database functionality."
  );
}

export const requiredDb = db;