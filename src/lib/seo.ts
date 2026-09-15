import type { Metadata } from "next";
import type { Product, SiteConfiguration } from "@/content/types";
import { absoluteUrl } from "./utils";
import { googlePlayUrl, productPath } from "./content";

interface PageMetadataInput {
  config: SiteConfiguration;
  title?: string;
  description?: string;
  /** Site-relative path, e.g. "/apps/". */
  path: string;
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
  type?: "website" | "article";
  /** Use the raw title without the "| Studio" template (home page). */
  absoluteTitle?: boolean;
}

export function buildMetadata({
  config,
  title,
  description,
  path,
  image,
  imageAlt,
  noindex,
  type = "website",
  absoluteTitle,
}: PageMetadataInput): Metadata {
  const resolvedTitle = title ?? config.seo.defaultTitle;
  const resolvedDescription = description ?? config.seo.defaultDescription;
  const canonical = absoluteUrl(config.url, path);
  const ogImage = absoluteUrl(config.url, image ?? config.brand.ogImage);
  const fullTitle = absoluteTitle || !title ? resolvedTitle : config.seo.titleTemplate.replace("%s", title);

  return {
    title: absoluteTitle || !title ? { absolute: resolvedTitle } : title,
    description: resolvedDescription,
    alternates: { canonical },
    robots: noindex
      ? { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: {
      type,
      url: canonical,
      siteName: config.brand.name,
      title: fullTitle,
      description: resolvedDescription,
      locale: config.seo.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: imageAlt ?? `${resolvedTitle} - ${config.brand.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: resolvedDescription,
      images: [ogImage],
      ...(config.seo.twitterHandle ? { site: config.seo.twitterHandle, creator: config.seo.twitterHandle } : {}),
    },
  };
}

export function productMetadata(product: Product, config: SiteConfiguration): Metadata {
  const noun = product.type === "game" ? "game" : "app";
  return buildMetadata({
    config,
    title: product.seo.title ?? product.name,
    description:
      product.seo.description ??
      `${product.name} is a ${product.category.toLowerCase()} ${noun} developed and published by ${config.brand.name}. ${product.shortDescription}`,
    path: productPath(product),
    image: product.seo.ogImage ?? product.heroImage ?? product.icon,
    imageAlt: `${product.name} artwork`,
    noindex: product.seo.noindex,
  });
}

/* ------------------------------------------------------------------ */
/* schema.org                                                          */
/* ------------------------------------------------------------------ */

type JsonLd = Record<string, unknown>;

export function organizationId(config: SiteConfiguration): string {
  return `${config.url}/#organization`;
}

export function organizationSchema(config: SiteConfiguration): JsonLd {
  const sameAs = config.social.map((link) => link.url).filter(Boolean);
  const contactEmail = config.contact.channels.find((channel) => channel.email)?.email;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(config),
    name: config.brand.name,
    url: `${config.url}/`,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(config.url, config.brand.icon512),
      width: 512,
      height: 512,
    },
    description: config.brand.description,
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(contactEmail
      ? { contactPoint: [{ "@type": "ContactPoint", contactType: "customer support", email: contactEmail }] }
      : {}),
  };
}

export function websiteSchema(config: SiteConfiguration): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${config.url}/#website`,
    url: `${config.url}/`,
    name: config.brand.name,
    description: config.seo.defaultDescription,
    publisher: { "@id": organizationId(config) },
    inLanguage: "en",
  };
}

export function breadcrumbSchema(config: SiteConfiguration, items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(config.url, item.path),
    })),
  };
}

export function productSchema(product: Product, config: SiteConfiguration): JsonLd {
  const url = absoluteUrl(config.url, productPath(product));
  const playUrl = googlePlayUrl(product);
  const organization = { "@id": organizationId(config) };
  const latest = [...product.releases].sort((a, b) => b.date.localeCompare(a.date))[0];
  const isGame = product.type === "game";

  return {
    "@context": "https://schema.org",
    "@type": isGame ? ["VideoGame", "SoftwareApplication"] : "SoftwareApplication",
    "@id": `${url}#${isGame ? "game" : "app"}`,
    name: product.name,
    url,
    description: product.shortDescription,
    image: absoluteUrl(config.url, product.heroImage ?? product.icon),
    applicationCategory: isGame ? "GameApplication" : `${product.category}Application`.replace(/\s+/g, ""),
    operatingSystem: product.platforms.join(", "),
    ...(isGame ? { gamePlatform: product.platforms, genre: product.genres.length > 0 ? product.genres : product.category } : {}),
    author: organization,
    publisher: organization,
    creator: organization,
    ...(product.packageName ? { identifier: product.packageName } : {}),
    ...(latest?.version ?? product.version ? { softwareVersion: latest?.version ?? product.version } : {}),
    ...(product.releaseDate ? { datePublished: product.releaseDate } : {}),
    ...(latest?.date ? { dateModified: latest.date } : {}),
    ...(product.screenshots.length > 0
      ? { screenshot: product.screenshots.map((shot) => absoluteUrl(config.url, shot.src)) }
      : {}),
    ...(playUrl ? { installUrl: playUrl, downloadUrl: playUrl, sameAs: [playUrl] } : {}),
  };
}

export function productListSchema(products: Product[], config: SiteConfiguration, name: string, path: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: absoluteUrl(config.url, path),
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: absoluteUrl(config.url, productPath(product)),
    })),
  };
}
