"use server";

import { and, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { adConfigs, adminLoginAttempts, contactMessages, products, siteSettings } from "@/db/schema";
import type { AdConfiguration, AdSellerRecord, Product, SiteSettings } from "@/content/types";
import { AD_VERIFICATION_STATUSES } from "@/content/types";
import { clearSessionCookie, clientIpHash, isAdminAuthenticated, isAdminConfigured, requireAdmin, setSessionCookie, verifyPassword } from "@/lib/auth";
import { getAllProductRecords, getAdConfiguration, getSiteConfig } from "@/lib/content";
import { adConfigurationSchema, formatZodError, productSchema, siteSettingsSchema } from "@/lib/validation";

export interface ActionState {
  ok: boolean;
  message: string;
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function revalidateSite() {
  revalidatePath("/", "layout");
  for (const path of ["/app-ads.txt", "/ads.txt", "/sitemap.xml", "/robots.txt", "/manifest.webmanifest"]) revalidatePath(path);
}

/* ------------------------------------------------------------------ */
/* Form helpers                                                        */
/* ------------------------------------------------------------------ */

const str = (data: FormData, name: string) => String(data.get(name) ?? "").trim();
const bool = (data: FormData, name: string) => data.get(name) === "on" || data.get(name) === "true";
const lines = (data: FormData, name: string) =>
  str(data, name)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
const paragraphs = (data: FormData, name: string) =>
  str(data, name)
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.replace(/\s*\r?\n\s*/g, " ").trim())
    .filter(Boolean);
const csv = (data: FormData, name: string) =>
  str(data, name)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

function json<T>(data: FormData, name: string, fallback: T): T {
  const raw = str(data, name);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`"${name}" must be valid JSON.`);
  }
}

/** Parses ads.txt-style lines ("domain, publisher-id, DIRECT, tag-id # comment") into records. */
function parseAdRecordLines(raw: string): AdSellerRecord[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && !/^[A-Z]+=/.test(line))
    .map((line) => {
      const [dataPart, ...commentParts] = line.split("#");
      const [adSystemDomain = "", publisherId = "", relationship = "", certificationAuthorityId = ""] = dataPart
        .split(",")
        .map((part) => part.trim());
      const rel = relationship.toUpperCase() === "RESELLER" ? "RESELLER" : "DIRECT";
      const comment = commentParts.join("#").trim();
      return {
        adSystemDomain,
        publisherId,
        relationship: rel,
        ...(certificationAuthorityId ? { certificationAuthorityId } : {}),
        ...(comment ? { comment } : {}),
      } satisfies AdSellerRecord;
    });
}

function failure(error: unknown): ActionState {
  if (error instanceof z.ZodError) return { ok: false, message: formatZodError(error) };
  if (error instanceof Error && error.message === "Unauthorized") return { ok: false, message: "Your session has expired. Please sign in again." };
  return { ok: false, message: error instanceof Error ? error.message : "Something went wrong. Please try again." };
}

/* ------------------------------------------------------------------ */
/* Authentication                                                      */
/* ------------------------------------------------------------------ */

export async function loginAction(_prev: ActionState, data: FormData): Promise<ActionState> {
  if (!isAdminConfigured()) {
    return { ok: false, message: "The admin is disabled. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in the environment." };
  }
  const ipHash = await clientIpHash();
  const [attempt] = await db.select().from(adminLoginAttempts).where(eq(adminLoginAttempts.ipHash, ipHash)).limit(1);
  const lockedUntil = attempt ? attempt.lastAttemptAt.getTime() + LOCKOUT_MINUTES * 60_000 : 0;
  if (attempt && attempt.attempts >= MAX_LOGIN_ATTEMPTS && lockedUntil > Date.now()) {
    return { ok: false, message: `Too many failed attempts. Try again in ${Math.ceil((lockedUntil - Date.now()) / 60_000)} minutes.` };
  }

  const password = String(data.get("password") ?? "");
  if (!(await verifyPassword(password))) {
    const nextAttempts = attempt && lockedUntil > Date.now() ? attempt.attempts + 1 : 1;
    await db
      .insert(adminLoginAttempts)
      .values({ ipHash, attempts: nextAttempts, lastAttemptAt: new Date() })
      .onConflictDoUpdate({ target: adminLoginAttempts.ipHash, set: { attempts: nextAttempts, lastAttemptAt: new Date() } });
    return { ok: false, message: "Incorrect password." };
  }

  await db.delete(adminLoginAttempts).where(eq(adminLoginAttempts.ipHash, ipHash));
  await setSessionCookie();
  redirect("/admin/");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login/");
}

/* ------------------------------------------------------------------ */
/* Site settings                                                       */
/* ------------------------------------------------------------------ */

export async function saveSiteSettingsAction(_prev: ActionState, data: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
    const current = await getSiteConfig();

    const candidate: SiteSettings = {
      brand: {
        ...current.brand,
        name: str(data, "brand.name"),
        shortName: str(data, "brand.shortName"),
        tagline: str(data, "brand.tagline"),
        description: str(data, "brand.description"),
        logo: str(data, "brand.logo"),
        logoMark: str(data, "brand.logoMark"),
        logoDark: str(data, "brand.logoDark"),
        logoLight: str(data, "brand.logoLight"),
        favicon: str(data, "brand.favicon"),
        favicon32: str(data, "brand.favicon32"),
        appleTouchIcon: str(data, "brand.appleTouchIcon"),
        icon192: str(data, "brand.icon192"),
        icon512: str(data, "brand.icon512"),
        icon512Maskable: str(data, "brand.icon512Maskable"),
        ogImage: str(data, "brand.ogImage"),
        themeColor: str(data, "brand.themeColor"),
        backgroundColor: str(data, "brand.backgroundColor"),
        accentColor: str(data, "brand.accentColor"),
      },
      seo: {
        defaultTitle: str(data, "seo.defaultTitle"),
        titleTemplate: str(data, "seo.titleTemplate"),
        defaultDescription: str(data, "seo.defaultDescription"),
        twitterHandle: str(data, "seo.twitterHandle"),
        locale: str(data, "seo.locale") || "en_US",
      },
      hero: {
        eyebrow: str(data, "hero.eyebrow"),
        heading: str(data, "hero.heading"),
        subheading: str(data, "hero.subheading"),
        primaryCta: { label: str(data, "hero.primaryCta.label"), href: str(data, "hero.primaryCta.href") },
        secondaryCta: { label: str(data, "hero.secondaryCta.label"), href: str(data, "hero.secondaryCta.href") },
      },
      whyUs: json(data, "whyUs", current.whyUs),
      about: {
        intro: str(data, "about.intro"),
        paragraphs: paragraphs(data, "about.paragraphs"),
        principles: json(data, "about.principles", current.about.principles),
        image: str(data, "about.image"),
        imageAlt: str(data, "about.imageAlt"),
      },
      contact: {
        channels: current.contact.channels.map((channel) => ({
          ...channel,
          title: str(data, `contact.${channel.id}.title`) || channel.title,
          description: str(data, `contact.${channel.id}.description`),
          email: str(data, `contact.${channel.id}.email`),
        })),
        location: str(data, "contact.location"),
        responseNote: str(data, "contact.responseNote"),
      },
      social: json(data, "social", current.social),
      siteAds: {
        enabled: bool(data, "siteAds.enabled"),
        records: parseAdRecordLines(str(data, "siteAds.records")),
        lastUpdated: str(data, "siteAds.lastUpdated") || today(),
      },
    };

    const parsed = siteSettingsSchema.parse(candidate) as SiteSettings;
    await db
      .insert(siteSettings)
      .values({ id: "default", data: parsed, updatedAt: new Date() })
      .onConflictDoUpdate({ target: siteSettings.id, set: { data: parsed, updatedAt: new Date() } });
    revalidateSite();
    return { ok: true, message: "Settings saved. Public pages will reflect the change immediately." };
  } catch (error) {
    return failure(error);
  }
}

export async function resetSiteSettingsAction(): Promise<void> {
  await requireAdmin();
  await db.delete(siteSettings).where(eq(siteSettings.id, "default"));
  revalidateSite();
  redirect("/admin/settings/");
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export async function saveProductAction(_prev: ActionState, data: FormData): Promise<ActionState> {
  let savedSlug = "";
  try {
    await requireAdmin();
    const originalSlug = str(data, "originalSlug");
    const googlePlay = str(data, "googlePlayUrl");
    const extraStoreLinks = json<Product["storeLinks"]>(data, "storeLinks", []);
    const storeLinks = [
      ...(googlePlay ? [{ store: "Google Play" as const, url: googlePlay }] : []),
      ...extraStoreLinks.filter((link) => link.store !== "Google Play"),
    ];

    const candidate = {
      slug: str(data, "slug"),
      name: str(data, "name"),
      type: str(data, "type"),
      tagline: str(data, "tagline"),
      shortDescription: str(data, "shortDescription"),
      description: paragraphs(data, "description"),
      icon: str(data, "icon"),
      heroImage: str(data, "heroImage") || undefined,
      coverImage: str(data, "coverImage") || undefined,
      screenshots: json<Product["screenshots"]>(data, "screenshots", []),
      category: str(data, "category"),
      genres: csv(data, "genres"),
      platforms: data.getAll("platforms").map(String),
      status: str(data, "status"),
      featured: bool(data, "featured"),
      releaseDate: str(data, "releaseDate"),
      version: str(data, "version"),
      packageName: str(data, "packageName"),
      storeLinks,
      privacyUrl: str(data, "privacyUrl"),
      supportUrl: str(data, "supportUrl"),
      features: lines(data, "features"),
      gameplay: paragraphs(data, "gameplay"),
      requirements: json<Product["requirements"]>(data, "requirements", []),
      releases: json<Product["releases"]>(data, "releases", []),
      seo: {
        title: str(data, "seo.title"),
        description: str(data, "seo.description"),
        ogImage: str(data, "seo.ogImage") || undefined,
        noindex: bool(data, "seo.noindex"),
      },
      visibility: str(data, "visibility"),
      sortOrder: str(data, "sortOrder") || undefined,
    };

    const product = productSchema.parse(candidate) as Product;
    savedSlug = product.slug;

    if (originalSlug && originalSlug !== product.slug) {
      await db.delete(products).where(eq(products.slug, originalSlug));
    }
    await db
      .insert(products)
      .values({ slug: product.slug, type: product.type, data: product, published: true, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: products.slug,
        set: { type: product.type, data: product, published: true, updatedAt: new Date() },
      });
    revalidateSite();
  } catch (error) {
    return failure(error);
  }
  redirect(`/admin/products/${savedSlug}/?saved=1`);
}

export async function setProductPublishedAction(slug: string, published: boolean): Promise<void> {
  await requireAdmin();
  const record = (await getAllProductRecords()).find((entry) => entry.product.slug === slug);
  if (!record) return;
  await db
    .insert(products)
    .values({ slug, type: record.product.type, data: record.product, published, updatedAt: new Date() })
    .onConflictDoUpdate({ target: products.slug, set: { published, updatedAt: new Date() } });
  revalidateSite();
  revalidatePath("/admin/products/");
}

/** Removes the database copy. File-based products revert to their file content. */
export async function deleteProductOverrideAction(slug: string): Promise<void> {
  await requireAdmin();
  await db.delete(products).where(eq(products.slug, slug));
  revalidateSite();
  redirect("/admin/products/");
}

/* ------------------------------------------------------------------ */
/* Advertising configuration                                           */
/* ------------------------------------------------------------------ */

function parseSet(data: FormData, prefix: "production" | "draft", fallbackDate: string) {
  const status = str(data, `${prefix}.verificationStatus`);
  return {
    records: parseAdRecordLines(str(data, `${prefix}.records`)),
    lastUpdated: str(data, `${prefix}.lastUpdated`) || fallbackDate,
    verificationStatus: (AD_VERIFICATION_STATUSES as readonly string[]).includes(status) ? status : "Not Configured",
    notes: str(data, `${prefix}.notes`),
  };
}

export async function saveAdConfigurationAction(_prev: ActionState, data: FormData): Promise<ActionState> {
  try {
    await requireAdmin();
    const productSlug = str(data, "productSlug");
    const existing = await getAdConfiguration(productSlug);
    const candidate = {
      productSlug,
      enabled: bool(data, "enabled"),
      provider: str(data, "provider"),
      production: parseSet(data, "production", existing?.production.lastUpdated || ""),
      draft: parseSet(data, "draft", existing?.draft.lastUpdated || ""),
    };
    const config = adConfigurationSchema.parse(candidate) as AdConfiguration;
    await db
      .insert(adConfigs)
      .values({ productSlug, data: config, updatedAt: new Date() })
      .onConflictDoUpdate({ target: adConfigs.productSlug, set: { data: config, updatedAt: new Date() } });
    revalidateSite();
    return { ok: true, message: "Advertising configuration saved." };
  } catch (error) {
    return failure(error);
  }
}

/** Copies the draft record set into production and stamps today's date. */
export async function promoteDraftAction(productSlug: string): Promise<void> {
  await requireAdmin();
  const existing = await getAdConfiguration(productSlug);
  if (!existing) return;
  const config: AdConfiguration = {
    ...existing,
    production: {
      ...existing.production,
      records: existing.draft.records,
      lastUpdated: today(),
      verificationStatus: existing.draft.records.length > 0 ? "Pending Verification" : "Not Configured",
    },
  };
  await db
    .insert(adConfigs)
    .values({ productSlug, data: config, updatedAt: new Date() })
    .onConflictDoUpdate({ target: adConfigs.productSlug, set: { data: config, updatedAt: new Date() } });
  revalidateSite();
  redirect(`/admin/ads/${productSlug}/`);
}

/* ------------------------------------------------------------------ */
/* Contact inbox                                                       */
/* ------------------------------------------------------------------ */

export async function markMessageReadAction(id: number): Promise<void> {
  await requireAdmin();
  await db.update(contactMessages).set({ readAt: new Date() }).where(and(eq(contactMessages.id, id), sql`${contactMessages.readAt} is null`));
  revalidatePath("/admin/messages/");
}

export async function deleteMessageAction(id: number): Promise<void> {
  await requireAdmin();
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  revalidatePath("/admin/messages/");
}

export async function listMessages(limit = 100) {
  if (!(await isAdminAuthenticated())) return [];
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)).limit(limit);
}
