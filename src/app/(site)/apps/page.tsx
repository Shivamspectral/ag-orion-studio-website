import type { Metadata } from "next";
import { AppCard } from "@/components/product";
import { Breadcrumbs, JsonLd } from "@/components/seo";
import { Button, EmptyState, PageHero } from "@/components/ui";
import { getApps, getSiteConfig } from "@/lib/content";
import { breadcrumbSchema, buildMetadata, productListSchema } from "@/lib/seo";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Apps", path: "/apps/" },
];

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return buildMetadata({
    config,
    title: "Apps",
    description: `Every mobile app developed and published by ${config.brand.name}, with official Google Play links, release status and support information.`,
    path: "/apps/",
  });
}

export default async function AppsPage() {
  const [config, apps] = await Promise.all([getSiteConfig(), getApps()]);
  return (
    <>
      <JsonLd data={[productListSchema(apps, config, `Apps by ${config.brand.name}`, "/apps/"), breadcrumbSchema(config, crumbs)]} />
      <PageHero
        eyebrow="Apps"
        title="Apps"
        description={`Practical mobile applications developed and published by ${config.brand.name}. Each app page lists the official store link, current status and how to get support.`}
        topSlot={<Breadcrumbs items={crumbs} />}
      />
      <section className="container-x py-14 sm:py-16" aria-label="All apps">
        {apps.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <AppCard key={app.slug} product={app} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="phone"
            title="No apps published yet"
            description="Applications will be listed here as soon as they are released. In the meantime, take a look at our games."
            action={
              <Button href="/games/" variant="outline">
                Explore games
              </Button>
            }
          />
        )}
      </section>
    </>
  );
}
