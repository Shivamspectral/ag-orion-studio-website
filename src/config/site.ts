import type { SiteConfiguration, SiteSettings } from "@/content/types";

/**
 * Central studio configuration.
 *
 * Replace logos, icons, copy, contact addresses and social links here (or from
 * /admin, which stores overrides in the database and merges them on top of
 * these defaults). Nothing in this file should be duplicated in components.
 */

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

const generalEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";
const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || generalEmail;
const businessEmail = process.env.NEXT_PUBLIC_BUSINESS_EMAIL?.trim() || generalEmail;

export const defaultSiteSettings: SiteSettings = {
  brand: {
    name: "AG Orion Studio",
    shortName: "AG Orion",
    tagline: "Independent app & game development studio.",
    description:
      "AG Orion Studio is an independent studio that develops and publishes mobile apps and games designed to be useful, entertaining, and accessible to players and users around the world.",
    logo: "",
    logoMark: "/brand/logo-mark.svg",
    logoDark: "",
    logoLight: "",
    favicon: "/brand/favicon.svg",
    favicon32: "/brand/favicon-32.png",
    appleTouchIcon: "/brand/apple-touch-icon.png",
    icon192: "/brand/icon-192.png",
    icon512: "/brand/icon-512.png",
    icon512Maskable: "/brand/icon-512-maskable.png",
    ogImage: "/brand/og-default.png",
    themeColor: "#0A0D15",
    backgroundColor: "#0A0D15",
    accentColor: "#3B82F6",
  },
  seo: {
    defaultTitle: "AG Orion Studio - Independent App & Game Developer",
    titleTemplate: "%s | AG Orion Studio",
    defaultDescription:
      "AG Orion Studio develops and publishes mobile apps and games for Android. Discover every app and game published by the studio, with official Google Play links and support.",
    twitterHandle: "",
    locale: "en_US",
  },
  hero: {
    eyebrow: "Independent developer & publisher",
    heading: "Building Apps & Games for Everyone.",
    subheading:
      "AG Orion Studio creates and publishes mobile apps and games designed to be useful, entertaining, and accessible to players and users around the world.",
    primaryCta: { label: "Explore Our Apps", href: "/apps/" },
    secondaryCta: { label: "Explore Our Games", href: "/games/" },
  },
  whyUs: [
    {
      icon: "code",
      title: "Independent development",
      description:
        "Every product is designed, built and published in-house, so decisions are made by the people who actually write the code.",
    },
    {
      icon: "users",
      title: "Player-focused experiences",
      description:
        "Games are built around what is fun to play and comfortable to control on a phone, not around metrics dashboards.",
    },
    {
      icon: "phone",
      title: "Practical mobile applications",
      description:
        "Apps aim to solve real, everyday problems with clear interfaces and respect for your device's battery and storage.",
    },
    {
      icon: "refresh",
      title: "Continuous improvement",
      description:
        "Released products keep receiving updates, fixes and refinements based on feedback from the people using them.",
    },
  ],
  about: {
    intro:
      "AG Orion Studio is an independent studio that designs, develops and publishes mobile apps and games.",
    paragraphs: [
      "The studio started from a simple idea: small, focused teams can ship software that feels considered. Instead of chasing trends, we pick a handful of ideas we care about, build them properly, and keep improving them after launch.",
      "On the games side, our current focus is open-world driving and simulation experiences with environments inspired by everyday Indian roads and cities. On the apps side, we work on practical tools that are meant to be opened every day and get out of the way.",
      "AG Orion Studio is the official developer and publisher of every app and game listed on this website. If you have found one of our titles on Google Play, this is the place to verify it, read the privacy policy and reach the team.",
    ],
    principles: [
      {
        title: "Ship things that work",
        description: "Stability and performance on real devices come before feature lists.",
      },
      {
        title: "Be clear about data",
        description: "Plain-language privacy information for the website and for every product.",
      },
      {
        title: "Listen, then iterate",
        description: "Feedback from players and users directly shapes updates and roadmaps.",
      },
      {
        title: "Stay independent",
        description: "Creative and technical decisions remain with the people building the products.",
      },
    ],
    image: "/images/studio/workspace.jpg",
    imageAlt: "A developer workstation showing a 3D city scene in a game engine next to an Android phone",
  },
  contact: {
    channels: [
      {
        id: "general",
        title: "General inquiries",
        description: "Questions about the studio, our products or this website.",
        email: generalEmail,
      },
      {
        id: "support",
        title: "App & game support",
        description: "Bug reports, crashes, account or purchase issues for any AG Orion Studio title.",
        email: supportEmail,
      },
      {
        id: "business",
        title: "Business inquiries",
        description: "Licensing, collaboration and other commercial conversations.",
        email: businessEmail,
      },
      {
        id: "advertising",
        title: "Advertising & partnerships",
        description: "Ad network partnerships, sponsorships and app-ads.txt questions.",
        email: businessEmail,
      },
      {
        id: "developer",
        title: "Developer & publishing inquiries",
        description: "Developers interested in publishing with, or building alongside, AG Orion Studio.",
        email: businessEmail,
      },
    ],
    location: "",
    responseNote:
      "We read every message. Support requests for published apps and games are prioritized.",
  },
  // Add official profiles only once they exist, e.g. { platform: "YouTube", url: "https://..." }
  social: [],
  // Website (not app) advertising inventory. Leave disabled unless this website itself serves ads.
  siteAds: {
    enabled: false,
    records: [],
    lastUpdated: "",
  },
};

export const siteNavigation: SiteConfiguration["navigation"] = {
  main: [
    { label: "Apps", href: "/apps/" },
    { label: "Games", href: "/games/" },
    { label: "About", href: "/about/" },
    { label: "Contact", href: "/contact/" },
  ],
  studio: [
    { label: "Apps", href: "/apps/" },
    { label: "Games", href: "/games/" },
    { label: "About", href: "/about/" },
    { label: "Contact", href: "/contact/" },
    { label: "Support", href: "/contact/#support" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy/" },
    { label: "Terms of Use", href: "/terms/" },
    { label: "Sitemap", href: "/sitemap/" },
    { label: "app-ads.txt", href: "/app-ads.txt" },
  ],
};

export function buildSiteConfiguration(settings: SiteSettings): SiteConfiguration {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER === "plausible" ? "plausible" : "gtag";
  return {
    ...settings,
    url: resolveSiteUrl(),
    navigation: siteNavigation,
    analytics: {
      provider,
      id: process.env.NEXT_PUBLIC_ANALYTICS_ID?.trim() ?? "",
    },
  };
}

/** Static configuration (no database overrides). Prefer `getSiteConfig()` from `@/lib/content`. */
export const staticSiteConfig = buildSiteConfiguration(defaultSiteSettings);
