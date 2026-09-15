import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

const pool = databaseUrl
  ? globalForDb.__arenaNextJsPostgresqlPool ??
    new Pool({
      connectionString: databaseUrl,
    })
  : null;

if (pool && process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

const database = pool ? drizzle(pool) : null;

/**
 * The public website can run without a database because the content layer
 * falls back to the static files in src/content.
 *
 * Admin/database operations will still work normally when DATABASE_URL
 * is configured.
 *
 * The cast keeps the existing application's database imports compatible
 * with TypeScript without forcing DATABASE_URL during a public build.
 */
export const db = database as ReturnType<typeof drizzle>;

export { pool };