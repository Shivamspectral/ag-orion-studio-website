import type { Metadata } from "next";
import Image from "next/image";
import { ProductIcon } from "@/components/product";
import { Breadcrumbs, JsonLd } from "@/components/seo";
import { Button, Icon, PageHero, SectionHeader, StatusBadge } from "@/components/ui";
import { getProducts, getSiteConfig, productPath } from "@/lib/content";
import { breadcrumbSchema, buildMetadata, organizationId } from "@/lib/seo";
import Link from "next/link";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about/" },
];

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return buildMetadata({
    config,
    title: `About ${config.brand.name}`,
    description: `${config.brand.name} is an independent studio that develops, publishes and supports mobile apps and games. Learn how the studio works and which products it is behind.`,
    path: "/about/",
  });
}

const roles = [
  {
    icon: "code" as const,
    title: "We develop",
    description: "Design, engineering, art direction and testing happen in-house, on real devices, before anything ships.",
  },
  {
    icon: "play" as const,
    title: "We publish",
    description: "Every title is released under the studio's own Google Play developer account, so the listing you see is the official one.",
  },
  {
    icon: "users" as const,
    title: "We support",
    description: "Bug reports and feedback go directly to the people who built the product, and updates follow from there.",
  },
];

export default async function AboutPage() {
  const [config, products] = await Promise.all([getSiteConfig(), getProducts()]);
  const { about, brand } = config;

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: `About ${brand.name}`,
            url: `${config.url}/about/`,
            mainEntity: { "@id": organizationId(config) },
          },
          breadcrumbSchema(config, crumbs),
        ]}
      />
      <PageHero eyebrow="About" title={`About ${brand.name}`} description={about.intro} topSlot={<Breadcrumbs items={crumbs} />} />

      <section className="container-x py-16 sm:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-surface-3 shadow-card lg:sticky lg:top-24">
            {about.image ? <Image src={about.image} alt={about.imageAlt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" /> : <div className="grid-fade h-full w-full" />}
          </div>
          <div className="prose-studio text-base sm:text-lg">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface/40 py-16 sm:py-20" aria-labelledby="roles-heading">
        <div className="container-x">
          <SectionHeader eyebrow="What we do" title="Developer, publisher and support - under one name" />
          <h2 id="roles-heading" className="sr-only">
            What we do
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {roles.map((role) => (
              <div key={role.title} className="surface-card p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-accent-soft text-accent-strong">
                  <Icon name={role.icon} className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{role.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-16 sm:py-20" aria-labelledby="principles-heading">
        <SectionHeader eyebrow="Principles" title="How we work" />
        <h2 id="principles-heading" className="sr-only">
          Principles
        </h2>
        <ol className="grid gap-5 sm:grid-cols-2">
          {about.principles.map((principle, index) => (
            <li key={principle.title} className="surface-card flex gap-5 p-6">
              <span className="font-display text-3xl font-semibold text-accent-strong/70" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{principle.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{principle.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {products.length > 0 && (
        <section className="border-t border-border bg-surface/40 py-16 sm:py-20" aria-labelledby="official-heading">
          <div className="container-x">
            <SectionHeader eyebrow="Official products" title={`Published by ${brand.name}`} description="If a store listing names this studio as the developer, you will find the product here." />
            <h2 id="official-heading" className="sr-only">
              Official products
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <li key={product.slug}>
                  <Link href={productPath(product)} className="surface-card flex items-center gap-4 p-4 transition-colors hover:border-border-strong">
                    <ProductIcon product={product} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-foreground">{product.name}</p>
                      <p className="text-sm text-muted">
                        {product.type === "game" ? "Game" : "App"} · {product.category}
                      </p>
                    </div>
                    <StatusBadge status={product.status} />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact/">
                Contact the studio
                <Icon name="arrow-right" className="h-4 w-4" />
              </Button>
              <Button href="/games/" variant="secondary">
                Browse games
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
