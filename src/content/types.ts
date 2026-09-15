/**
 * Central content model for AG Orion Studio.
 *
 * Everything the website renders (apps, games, releases, ad authorization,
 * SEO, branding, contact details) is described by these types. Content lives in
 * `src/content/*` (file-based defaults) and can be overridden from the admin
 * dashboard (stored in PostgreSQL). Components never own content.
 */

export type ProductType = "app" | "game";

export const PLATFORMS = ["Android", "iOS", "Web", "Windows", "macOS", "Linux"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const RELEASE_STATUSES = [
  "Coming Soon",
  "In Development",
  "Testing",
  "Published",
  "Discontinued",
] as const;
export type ReleaseStatus = (typeof RELEASE_STATUSES)[number];

export const STORE_PROVIDERS = [
  "Google Play",
  "App Store",
  "Microsoft Store",
  "Web",
  "Direct Download",
  "Other",
] as const;
export type StoreProvider = (typeof STORE_PROVIDERS)[number];

export interface StoreLink {
  store: StoreProvider;
  url: string;
  /** Optional custom label, e.g. "Open Web App". */
  label?: string;
}

export interface Screenshot {
  src: string;
  alt: string;
  caption?: string;
}

export interface Release {
  version: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** "What's new" bullet points. */
  notes: string[];
  platforms?: Platform[];
}

export interface SEOConfiguration {
  title?: string;
  description?: string;
  /** Absolute or site-relative image path used for Open Graph / Twitter cards. */
  ogImage?: string;
  noindex?: boolean;
}

export interface RequirementSpec {
  label: string;
  value: string;
}

export interface Product {
  /** Stable lowercase URL slug, e.g. "indianopenworlddriving". Never change after publishing. */
  slug: string;
  name: string;
  type: ProductType;
  /** One-line pitch shown under the title. */
  tagline: string;
  /** Card copy, ideally under 160 characters. */
  shortDescription: string;
  /** "About" paragraphs. */
  description: string[];
  icon: string;
  heroImage?: string;
  /** Optional alternative artwork for cards; falls back to heroImage. */
  coverImage?: string;
  screenshots: Screenshot[];
  /** Primary category, e.g. "Simulation" or "Business". */
  category: string;
  /** Genres (mostly for games). */
  genres: string[];
  platforms: Platform[];
  status: ReleaseStatus;
  featured: boolean;
  /** ISO date of the first public release, if known. */
  releaseDate?: string;
  /** Current public version, if known. */
  version?: string;
  /** Android application ID / bundle identifier. */
  packageName?: string;
  storeLinks: StoreLink[];
  /** Product-specific privacy policy. Falls back to the studio policy. */
  privacyUrl?: string;
  /** Product-specific support page. Falls back to the contact page. */
  supportUrl?: string;
  features: string[];
  /** Gameplay / how-it-works paragraphs. */
  gameplay?: string[];
  requirements?: RequirementSpec[];
  releases: Release[];
  seo: SEOConfiguration;
  /** Draft products are hidden from all public pages, sitemaps and feeds. */
  visibility: "public" | "draft";
  /** Lower numbers appear first. */
  sortOrder?: number;
}

export type App = Product & { type: "app" };
export type Game = Product & { type: "game" };

/* ------------------------------------------------------------------ */
/* Advertising authorization (ads.txt / app-ads.txt)                   */
/* ------------------------------------------------------------------ */

export type AdRelationship = "DIRECT" | "RESELLER";

export interface AdSellerRecord {
  /** Advertising system domain, e.g. "google.com". */
  adSystemDomain: string;
  /** Your publisher/seller account ID with that system, e.g. "pub-0000000000000000". */
  publisherId: string;
  relationship: AdRelationship;
  /** Optional TAG-ID / certification authority ID, e.g. "f08c47fec0942fa0" for Google. */
  certificationAuthorityId?: string;
  /** Optional human-readable note (emitted as a comment, never as data). */
  comment?: string;
}

export const AD_VERIFICATION_STATUSES = [
  "Not Configured",
  "Pending Verification",
  "Verified",
  "Issue Detected",
] as const;
export type AdVerificationStatus = (typeof AD_VERIFICATION_STATUSES)[number];

export interface AdConfigurationSet {
  records: AdSellerRecord[];
  /** ISO date of the last change, or empty if never published. */
  lastUpdated: string;
  verificationStatus: AdVerificationStatus;
  notes?: string;
}

export interface AdConfiguration {
  productSlug: string;
  /** Whether this app monetizes with ads at all. */
  enabled: boolean;
  /** Advertising platform(s) used, e.g. "Google AdMob". */
  provider: string;
  /** Records published in the root /app-ads.txt file. */
  production: AdConfigurationSet;
  /** Work-in-progress records; never published until promoted. */
  draft: AdConfigurationSet;
}

/** Website (not app) inventory. Served at /ads.txt only when enabled. */
export interface SiteAdsConfiguration {
  enabled: boolean;
  records: AdSellerRecord[];
  lastUpdated: string;
}

/* ------------------------------------------------------------------ */
/* Studio / site configuration                                         */
/* ------------------------------------------------------------------ */

export interface BrandConfiguration {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  /** Optional full logo lockup (image with wordmark). When set, replaces mark + text. */
  logo?: string;
  /** Square logo mark used in the header, footer and fallbacks. */
  logoMark: string;
  /** Optional variants for dark / light backgrounds. */
  logoDark?: string;
  logoLight?: string;
  favicon: string;
  favicon32: string;
  appleTouchIcon: string;
  icon192: string;
  icon512: string;
  icon512Maskable: string;
  ogImage: string;
  themeColor: string;
  backgroundColor: string;
  /** Accent color (hex). Drives the CSS accent variables. */
  accentColor: string;
}

export interface SeoDefaults {
  defaultTitle: string;
  /** Use %s for the page title. */
  titleTemplate: string;
  defaultDescription: string;
  /** e.g. "@agorionstudio" - leave empty if there is no account. */
  twitterHandle: string;
  locale: string;
}

export interface CallToAction {
  label: string;
  href: string;
}

export interface HeroContent {
  eyebrow: string;
  heading: string;
  subheading: string;
  primaryCta: CallToAction;
  secondaryCta: CallToAction;
}

export interface ValueProposition {
  title: string;
  description: string;
  icon: "code" | "users" | "phone" | "refresh";
}

export interface AboutContent {
  intro: string;
  paragraphs: string[];
  principles: { title: string; description: string }[];
  image: string;
  imageAlt: string;
}

export type ContactChannelId = "general" | "support" | "business" | "advertising" | "developer";

export interface ContactChannel {
  id: ContactChannelId;
  title: string;
  description: string;
  /** Leave empty until the mailbox exists; the UI falls back to the contact form. */
  email: string;
}

export interface ContactInformation {
  channels: ContactChannel[];
  /** Optional public location line, e.g. "Remote-first studio". */
  location: string;
  /** Optional expectation-setting note shown on the contact page. */
  responseNote: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

/** The subset of the site configuration that can be edited from the admin. */
export interface SiteSettings {
  brand: BrandConfiguration;
  seo: SeoDefaults;
  hero: HeroContent;
  whyUs: ValueProposition[];
  about: AboutContent;
  contact: ContactInformation;
  social: SocialLink[];
  siteAds: SiteAdsConfiguration;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfiguration extends SiteSettings {
  /** Canonical origin without trailing slash. */
  url: string;
  navigation: {
    main: NavItem[];
    studio: NavItem[];
    legal: NavItem[];
  };
  analytics: {
    provider: "gtag" | "plausible";
    id: string;
  };
}
