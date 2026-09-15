import { z } from "zod";
import { AD_VERIFICATION_STATUSES, PLATFORMS, RELEASE_STATUSES, STORE_PROVIDERS } from "@/content/types";

const trimmed = z.string().trim();
const optionalText = trimmed.max(500).optional().or(z.literal("").transform(() => undefined));
const slug = trimmed.min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only.");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use the format YYYY-MM-DD.");
const optionalIsoDate = isoDate.optional().or(z.literal("").transform(() => undefined));
const assetPath = trimmed.max(500).refine((value) => value === "" || value.startsWith("/") || /^https?:\/\//.test(value), {
  message: "Use a site-relative path (/images/...) or an https URL.",
});
const httpUrl = z.url({ protocol: /^https?$/ }).max(2000);

export const contactSchema = z.object({
  name: trimmed.min(2, "Please enter your name.").max(120),
  email: z.email("Please enter a valid email address.").max(200),
  topic: z.enum(["general", "support", "business", "advertising", "developer"]),
  product: trimmed.max(120).optional(),
  message: trimmed.min(20, "Please add a little more detail (at least 20 characters).").max(4000),
  // Honeypot: must stay empty. Real users never see this field.
  website: z.literal("").or(z.undefined()),
  // Time the form was rendered; submissions faster than a few seconds are treated as bots.
  startedAt: z.coerce.number().optional(),
});

export const storeLinkSchema = z.object({
  store: z.enum(STORE_PROVIDERS),
  url: httpUrl,
  label: optionalText,
});

export const screenshotSchema = z.object({
  src: assetPath.min(1),
  alt: trimmed.min(3).max(300),
  caption: optionalText,
});

export const releaseSchema = z.object({
  version: trimmed.min(1).max(40),
  date: isoDate,
  notes: z.array(trimmed.min(1).max(500)).max(50),
  platforms: z.array(z.enum(PLATFORMS)).optional(),
});

export const productSchema = z.object({
  slug,
  name: trimmed.min(2).max(120),
  type: z.enum(["app", "game"]),
  tagline: trimmed.max(200),
  shortDescription: trimmed.min(10).max(300),
  description: z.array(trimmed.min(1).max(2000)).max(20),
  icon: assetPath,
  heroImage: assetPath.optional(),
  coverImage: assetPath.optional(),
  screenshots: z.array(screenshotSchema).max(30),
  category: trimmed.min(2).max(60),
  genres: z.array(trimmed.min(1).max(40)).max(10),
  platforms: z.array(z.enum(PLATFORMS)).min(1, "Select at least one platform."),
  status: z.enum(RELEASE_STATUSES),
  featured: z.boolean(),
  releaseDate: optionalIsoDate,
  version: optionalText,
  packageName: trimmed.max(200).regex(/^[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z][A-Za-z0-9_]*)*$|^$/, "Not a valid package name.").optional(),
  storeLinks: z.array(storeLinkSchema).max(10),
  privacyUrl: optionalText,
  supportUrl: optionalText,
  features: z.array(trimmed.min(1).max(300)).max(30),
  gameplay: z.array(trimmed.min(1).max(2000)).max(20).optional(),
  requirements: z.array(z.object({ label: trimmed.min(1).max(60), value: trimmed.min(1).max(200) })).max(20).optional(),
  releases: z.array(releaseSchema).max(100),
  seo: z.object({
    title: optionalText,
    description: optionalText,
    ogImage: assetPath.optional(),
    noindex: z.boolean().optional(),
  }),
  visibility: z.enum(["public", "draft"]),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

export const adSellerRecordSchema = z.object({
  adSystemDomain: trimmed.max(253),
  publisherId: trimmed.max(200),
  relationship: z.enum(["DIRECT", "RESELLER"]),
  certificationAuthorityId: optionalText,
  comment: optionalText,
});

const adSetSchema = z.object({
  records: z.array(adSellerRecordSchema).max(200),
  lastUpdated: z.string().max(40),
  verificationStatus: z.enum(AD_VERIFICATION_STATUSES),
  notes: optionalText,
});

export const adConfigurationSchema = z.object({
  productSlug: slug,
  enabled: z.boolean(),
  provider: trimmed.max(120),
  production: adSetSchema,
  draft: adSetSchema,
});

export const siteSettingsSchema = z.object({
  brand: z.object({
    name: trimmed.min(2).max(80),
    shortName: trimmed.min(1).max(30),
    tagline: trimmed.max(160),
    description: trimmed.max(600),
    logo: assetPath,
    logoMark: assetPath.min(1),
    logoDark: assetPath,
    logoLight: assetPath,
    favicon: assetPath.min(1),
    favicon32: assetPath.min(1),
    appleTouchIcon: assetPath.min(1),
    icon192: assetPath.min(1),
    icon512: assetPath.min(1),
    icon512Maskable: assetPath.min(1),
    ogImage: assetPath.min(1),
    themeColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  }),
  seo: z.object({
    defaultTitle: trimmed.min(5).max(120),
    titleTemplate: trimmed.min(2).max(80).refine((value) => value.includes("%s"), "Template must include %s."),
    defaultDescription: trimmed.min(20).max(320),
    twitterHandle: trimmed.max(40).regex(/^$|^@[A-Za-z0-9_]{1,15}$/, "Use the @handle format."),
    locale: trimmed.min(2).max(10),
  }),
  hero: z.object({
    eyebrow: trimmed.max(80),
    heading: trimmed.min(5).max(120),
    subheading: trimmed.min(10).max(400),
    primaryCta: z.object({ label: trimmed.min(1).max(40), href: trimmed.min(1).max(300) }),
    secondaryCta: z.object({ label: trimmed.min(1).max(40), href: trimmed.min(1).max(300) }),
  }),
  whyUs: z
    .array(z.object({ title: trimmed.min(2).max(80), description: trimmed.min(5).max(400), icon: z.enum(["code", "users", "phone", "refresh"]) }))
    .min(1)
    .max(6),
  about: z.object({
    intro: trimmed.min(10).max(400),
    paragraphs: z.array(trimmed.min(1).max(2000)).max(20),
    principles: z.array(z.object({ title: trimmed.min(2).max(80), description: trimmed.min(5).max(400) })).max(8),
    image: assetPath,
    imageAlt: trimmed.max(300),
  }),
  contact: z.object({
    channels: z.array(
      z.object({
        id: z.enum(["general", "support", "business", "advertising", "developer"]),
        title: trimmed.min(2).max(80),
        description: trimmed.max(300),
        email: z.email().max(200).or(z.literal("")),
      }),
    ),
    location: trimmed.max(120),
    responseNote: trimmed.max(300),
  }),
  social: z.array(z.object({ platform: trimmed.min(1).max(40), url: httpUrl })).max(20),
  siteAds: z.object({
    enabled: z.boolean(),
    records: z.array(adSellerRecordSchema).max(200),
    lastUpdated: z.string().max(40),
  }),
});

export function formatZodError(error: z.ZodError): string {
  return error.issues
    .slice(0, 6)
    .map((issue) => `${issue.path.join(".") || "form"}: ${issue.message}`)
    .join(" · ");
}
