import "server-only";
import { cache } from "react";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { adConfigs, products as productsTable, siteSettings } from "@/db/schema";
import { apps } from "@/content/apps";
import { games } from "@/content/games";
import { adConfigurations } from "@/content/ads";
import { buildSiteConfiguration, defaultSiteSettings } from "@/config/site";
import type { AdConfiguration, Product, ProductType, SiteConfiguration, SiteSettings } from "@/content/types";
import { deepMerge } from "./utils";

/**
 * Content access layer.
 *
 * Reads file-based defaults from `src/content` and `src/config`, layers admin
 * overrides stored in PostgreSQL on top, and exposes a single API to pages.
 * Database failures never break public pages - the file content is served.
 */

function logContentError(scope: string, error: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[content] ${scope}: falling back to file content.`, error instanceof Error ? error.message : error);
  }
}

export const getSiteSettingsOverrides = cache(async (): Promise<Partial<SiteSettings> | null> => {
  try {
    const rows = await db.select().from(siteSettings).where(eq(siteSettings.id, "default")).limit(1);
    return rows[0]?.data ?? null;
  } catch (error) {
    logContentError("site settings", error);
    return null;
  }
});

export const getSiteConfig = cache(async (): Promise<SiteConfiguration> => {
  const overrides = await getSiteSettingsOverrides();
  const settings = overrides ? deepMerge(defaultSiteSettings, overrides) : defaultSiteSettings;
  return buildSiteConfiguration(settings);
});

export interface ProductRecord {
  product: Product;
  source: "file" | "database";
  published: boolean;
}

const fileProducts: Product[] = [...apps, ...games];

/** Every product from both sources, including drafts and hidden ones (admin use). */
export const getAllProductRecords = cache(async (): Promise<ProductRecord[]> => {
  const records = new Map<string, ProductRecord>();
  for (const product of fileProducts) {
    records.set(product.slug, { product, source: "file", published: true });
  }
  try {
    const rows = await db.select().from(productsTable).orderBy(desc(productsTable.updatedAt));
    for (const row of rows) {
      records.set(row.slug, { product: { ...row.data, slug: row.slug }, source: "database", published: row.published });
    }
  } catch (error) {
    logContentError("products", error);
  }
  return Array.from(records.values());
});

function sortProducts(list: Product[]): Product[] {
  return [...list].sort((a, b) => {
    const order = (a.sortOrder ?? 999) - (b.sortOrder ?? 999);
    return order !== 0 ? order : a.name.localeCompare(b.name);
  });
}

/** Publicly visible products only. */
export const getProducts = cache(async (type?: ProductType): Promise<Product[]> => {
  const records = await getAllProductRecords();
  const visible = records
    .filter((record) => record.published && record.product.visibility === "public")
    .map((record) => record.product)
    .filter((product) => (type ? product.type === type : true));
  return sortProducts(visible);
});

export const getApps = () => getProducts("app");
export const getGames = () => getProducts("game");

export async function getProduct(slug: string, type?: ProductType): Promise<Product | null> {
  const list = await getProducts(type);
  return list.find((product) => product.slug === slug) ?? null;
}

export async function getFeaturedProducts(type: ProductType, limit = 3): Promise<Product[]> {
  const list = await getProducts(type);
  const featured = list.filter((product) => product.featured);
  return (featured.length > 0 ? featured : list).slice(0, limit);
}

export interface LatestRelease {
  product: Product;
  version?: string;
  date?: string;
  notes: string[];
}

/** Most recent release per product, newest first. Products without dates come last. */
export async function getLatestReleases(limit = 4): Promise<LatestRelease[]> {
  const list = await getProducts();
  const entries: LatestRelease[] = list.map((product) => {
    const latest = [...product.releases].sort((a, b) => b.date.localeCompare(a.date))[0];
    return {
      product,
      version: latest?.version ?? product.version,
      date: latest?.date ?? product.releaseDate,
      notes: latest?.notes ?? [],
    };
  });
  entries.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  return entries.slice(0, limit);
}

export function productPath(product: Pick<Product, "type" | "slug">): string {
  return `/${product.type === "game" ? "games" : "apps"}/${product.slug}/`;
}

export function googlePlayUrl(product: Pick<Product, "storeLinks">): string | undefined {
  return product.storeLinks.find((link) => link.store === "Google Play")?.url;
}

/* ------------------------------------------------------------------ */
/* Advertising configuration                                           */
/* ------------------------------------------------------------------ */

export const getAdConfigurations = cache(async (): Promise<AdConfiguration[]> => {
  const configs = new Map<string, AdConfiguration>();
  for (const config of adConfigurations) configs.set(config.productSlug, config);
  try {
    const rows = await db.select().from(adConfigs);
    for (const row of rows) configs.set(row.productSlug, { ...row.data, productSlug: row.productSlug });
  } catch (error) {
    logContentError("ad configurations", error);
  }
  return Array.from(configs.values());
});

export async function getAdConfiguration(productSlug: string): Promise<AdConfiguration | null> {
  const configs = await getAdConfigurations();
  return configs.find((config) => config.productSlug === productSlug) ?? null;
}

export function emptyAdConfiguration(productSlug: string): AdConfiguration {
  return {
    productSlug,
    enabled: false,
    provider: "",
    production: { records: [], lastUpdated: "", verificationStatus: "Not Configured" },
    draft: { records: [], lastUpdated: "", verificationStatus: "Not Configured" },
  };
}
