import type { App } from "./types";

/**
 * Apps published by AG Orion Studio.
 *
 * Add a new app by appending an object here (or from /admin). The Apps page,
 * detail page, sitemap entry, metadata and structured data are generated
 * automatically.
 *
 * The entry below is an example "in development" app so the Apps section has
 * a working reference. Edit it to match a real product, or remove it.
 */
export const apps: App[] = [
  {
    slug: "businesskit",
    name: "Business Kit",
    type: "app",
    tagline: "Everyday tools for running a small business from your phone.",
    shortDescription:
      "A practical toolkit app for small businesses and independent professionals. Currently in development at AG Orion Studio.",
    description: [
      "Business Kit is an upcoming productivity app from AG Orion Studio. It is currently in development, and this page will be updated with features, screenshots and the official store listing as the app gets closer to release.",
      "Like every AG Orion Studio product, Business Kit is developed, published and supported directly by the studio.",
    ],
    icon: "/images/apps/businesskit/icon.svg",
    screenshots: [],
    category: "Business",
    genres: [],
    platforms: ["Android"],
    status: "In Development",
    featured: true,
    storeLinks: [],
    privacyUrl: "/privacy/",
    supportUrl: "/contact/#support",
    features: [],
    releases: [],
    seo: {
      title: "Business Kit",
      description:
        "Business Kit is an upcoming productivity app from AG Orion Studio, built to give small businesses practical everyday tools on Android.",
    },
    visibility: "public",
    sortOrder: 1,
  },
];
