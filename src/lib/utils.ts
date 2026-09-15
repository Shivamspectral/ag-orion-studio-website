export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Ensures internal paths end with a trailing slash (matches `trailingSlash: true`). */
export function normalizePath(path: string): string {
  if (!path.startsWith("/")) return path;
  const [pathname, hash] = path.split("#");
  if (/\.[a-z0-9]+$/i.test(pathname) || pathname.endsWith("/")) {
    return hash ? `${pathname}#${hash}` : pathname;
  }
  return hash ? `${pathname}/#${hash}` : `${pathname}/`;
}

export function absoluteUrl(siteUrl: string, path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl.replace(/\/+$/, "")}${normalizePath(path)}`;
}

/** True for same-origin non-page resources such as /app-ads.txt or /sitemap.xml. */
export function isFileLikePath(href: string): boolean {
  return /\.[a-z0-9]+$/i.test(href.split(/[?#]/)[0]);
}

export function isExternalUrl(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith("mailto:");
}

export function formatDate(iso: string | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!iso) return "";
  const date = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
    ...options,
  }).format(date);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type PlainObject = Record<string, unknown>;

function isPlainObject(value: unknown): value is PlainObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Recursively merges `override` into `base`. Arrays and primitives are replaced, not concatenated. */
export function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override === undefined ? base : override) as T;
  }
  const result: PlainObject = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    const current = result[key];
    result[key] = isPlainObject(current) && isPlainObject(value) ? deepMerge(current, value) : value;
  }
  return result as T;
}

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
