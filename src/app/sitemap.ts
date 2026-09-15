import type { MetadataRoute } from "next";
import { apps } from "@/content/apps";
import { games } from "@/content/games";
import { legalDocuments } from "@/content/legal";
import { staticSiteConfig } from "@/config/site";
import { productPath } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const config = staticSiteConfig;
  const url = (path: string) => `${config.url}${path}`;

  const staticEntries: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/apps/"), changeFrequency: "weekly", priority: 0.9 },
    { url: url("/games/"), changeFrequency: "weekly", priority: 0.9 },
    { url: url("/about/"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/contact/"), changeFrequency: "monthly", priority: 0.6 },
    ...legalDocuments.map((document) => ({
      url: url(`/${document.slug}/`),
      lastModified: document.lastUpdated,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
    { url: url("/sitemap/"), changeFrequency: "monthly", priority: 0.2 },
  ];

  const products = [...apps, ...games];

  const productEntries: MetadataRoute.Sitemap = products
    .filter((product) => !product.seo.noindex)
    .map((product) => {
      const latest = [...product.releases].sort((a, b) =>
        b.date.localeCompare(a.date)
      )[0];

      const lastModified = latest?.date ?? product.releaseDate;

      return {
        url: url(productPath(product)),
        ...(lastModified ? { lastModified } : {}),
        changeFrequency: "monthly" as const,
        priority: product.type === "game" ? 0.8 : 0.7,
        ...(product.heroImage || product.screenshots.length
          ? {
              images: [
                product.heroImage,
                ...product.screenshots.map((shot) => shot.src),
              ]
                .filter((src): src is string => Boolean(src))
                .map((src) => `${config.url}${src}`),
            }
          : {}),
      };
    });

  return [...staticEntries, ...productEntries];
}