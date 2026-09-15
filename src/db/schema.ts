import { boolean, index, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import type { AdConfiguration, Product, SiteSettings } from "@/content/types";

/**
 * The database stores admin overrides on top of the file-based content in
 * `src/content`. Public pages merge both sources through `@/lib/content`.
 */

/** Single-row table (id = "default") holding admin-edited studio settings. */
export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey(),
  data: jsonb("data").$type<Partial<SiteSettings>>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Apps and games created or edited from the admin. Overrides file content by slug. */
export const products = pgTable(
  "products",
  {
    slug: text("slug").primaryKey(),
    type: text("type").$type<Product["type"]>().notNull(),
    data: jsonb("data").$type<Product>().notNull(),
    /** When false the product is hidden even if a file-based entry exists. */
    published: boolean("published").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("products_type_idx").on(table.type)],
);

/** Per-app advertising authorization configuration (production + draft). */
export const adConfigs = pgTable("ad_configs", {
  productSlug: text("product_slug").primaryKey(),
  data: jsonb("data").$type<AdConfiguration>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Messages submitted through the public contact form. */
export const contactMessages = pgTable(
  "contact_messages",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    topic: text("topic").notNull(),
    product: text("product"),
    message: text("message").notNull(),
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    readAt: timestamp("read_at", { withTimezone: true }),
  },
  (table) => [index("contact_messages_ip_idx").on(table.ipHash, table.createdAt)],
);

/** Failed admin login attempts, used for rate limiting. */
export const adminLoginAttempts = pgTable("admin_login_attempts", {
  ipHash: text("ip_hash").primaryKey(),
  attempts: integer("attempts").default(0).notNull(),
  lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true }).defaultNow().notNull(),
});
