import { generateAdsTxt } from "@/lib/ads";
import { getSiteConfig } from "@/lib/content";

/**
 * Website (not app) advertising inventory. Served only when website advertising
 * is enabled in the studio settings; otherwise a plain-text 404 is returned,
 * which correctly tells crawlers that no sellers are authorized for this site.
 */
export const revalidate = 3600;

export async function GET() {
  const config = await getSiteConfig();
  const contact = config.contact.channels.find((channel) => channel.email)?.email;
  const body = generateAdsTxt(config.siteAds, { siteUrl: config.url, contactEmail: contact, studioName: config.brand.name });
  const headers = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600, must-revalidate" };
  if (!body) {
    return new Response("# ads.txt is not enabled for this website.\n", { status: 404, headers });
  }
  return new Response(body, { status: 200, headers });
}
