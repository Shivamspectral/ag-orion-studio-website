import { generateAppAdsTxt } from "@/lib/ads";
import { getAdConfigurations, getAllProductRecords, getSiteConfig } from "@/lib/content";

/**
 * Official, machine-readable app-ads.txt served as plain text at the domain root.
 * Generated from the production advertising configuration of every ad-enabled app.
 */
export const revalidate = 3600;

export async function GET() {
  const [config, adConfigurations, records] = await Promise.all([getSiteConfig(), getAdConfigurations(), getAllProductRecords()]);
  const names = Object.fromEntries(records.map((record) => [record.product.slug, record.product.name]));
  const contact = config.contact.channels.find((channel) => channel.id === "advertising" && channel.email)?.email ?? config.contact.channels.find((channel) => channel.email)?.email;
  const body = generateAppAdsTxt(adConfigurations, names, { siteUrl: config.url, contactEmail: contact, studioName: config.brand.name });
  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600, must-revalidate" },
  });
}
