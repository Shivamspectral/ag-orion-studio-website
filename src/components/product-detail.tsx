import Image from "next/image";
import Link from "next/link";
import type { Product, SiteConfiguration } from "@/content/types";
import { googlePlayUrl, productPath } from "@/lib/content";
import { breadcrumbSchema, productSchema } from "@/lib/seo";
import { formatDate, normalizePath } from "@/lib/utils";
import { DefinitionList, GenreBadges, ProductIcon, StoreButtons } from "./product";
import { ScreenshotGallery } from "./screenshot-gallery";
import { Breadcrumbs, JsonLd } from "./seo";
import { Button, Icon, StatusBadge } from "./ui";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24">
      <h2 id={`${id}-heading`} className="text-2xl font-semibold text-foreground">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ProductDetail({ product, config }: { product: Product; config: SiteConfiguration }) {
  const isGame = product.type === "game";
  const noun = isGame ? "game" : "app";
  const listName = isGame ? "Games" : "Apps";
  const listPath = isGame ? "/games/" : "/apps/";
  const play = googlePlayUrl(product);
  const releases = [...product.releases].sort((a, b) => b.date.localeCompare(a.date));
  const latest = releases[0];
  const currentVersion = latest?.version ?? product.version;
  const privacyHref = normalizePath(product.privacyUrl || "/privacy/");
  const supportHref = normalizePath(product.supportUrl || "/contact/#support");
  const crumbs = [
    { name: "Home", path: "/" },
    { name: listName, path: listPath },
    { name: product.name, path: productPath(product) },
  ];

  const details: { label: string; value: React.ReactNode }[] = [
    { label: "Developer", value: config.brand.name },
    { label: "Publisher", value: config.brand.name },
    { label: "Platform", value: product.platforms.join(", ") },
    { label: isGame ? "Genre" : "Category", value: isGame && product.genres.length ? product.genres.join(", ") : product.category },
    { label: "Status", value: <StatusBadge status={product.status} /> },
    ...(currentVersion ? [{ label: "Latest version", value: currentVersion }] : []),
    ...(latest?.date || product.releaseDate ? [{ label: latest?.date ? "Last updated" : "Released", value: formatDate(latest?.date ?? product.releaseDate) }] : []),
    ...(product.packageName ? [{ label: "Package name", value: <code className="rounded bg-surface-3 px-1.5 py-0.5 text-xs">{product.packageName}</code> }] : []),
    {
      label: "Official website",
      value: (
        <Link href={productPath(product)} className="text-accent-strong hover:underline">
          {config.url.replace(/^https?:\/\//, "")}
          {productPath(product)}
        </Link>
      ),
    },
    ...(play
      ? [
          {
            label: "Store listing",
            value: (
              <a href={play} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent-strong hover:underline">
                Google Play <Icon name="external" className="h-3.5 w-3.5" />
              </a>
            ),
          },
        ]
      : []),
    {
      label: "Support",
      value: (
        <Link href={supportHref} className="text-accent-strong hover:underline">
          Contact support
        </Link>
      ),
    },
    {
      label: "Privacy policy",
      value: (
        <Link href={privacyHref} className="text-accent-strong hover:underline">
          Read the policy
        </Link>
      ),
    },
  ];

  return (
    <>
      <JsonLd data={[productSchema(product, config), breadcrumbSchema(config, crumbs)]} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        {product.heroImage && (
          <div className="absolute inset-0" aria-hidden="true">
            <Image src={product.heroImage} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
          </div>
        )}
        {!product.heroImage && <div className="grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />}
        <div className="container-x relative py-10 sm:py-14 lg:py-20">
          <Breadcrumbs items={crumbs} className="mb-8" />
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <ProductIcon product={product} size="xl" priority className="border-white/15" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={product.status} />
                <span className="text-xs font-medium uppercase tracking-wider text-muted">{product.platforms.join(" · ")}</span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">{product.name}</h1>
              <p className="mt-2 text-sm text-muted">
                {isGame ? "Game" : "App"} by{" "}
                <Link href="/about/" className="font-medium text-foreground hover:text-accent-strong">
                  {config.brand.name}
                </Link>
              </p>
              {product.tagline && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{product.tagline}</p>}
              <div className="mt-5">
                <GenreBadges product={product} />
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <StoreButtons product={product} size="lg" />
                {!play && product.status !== "Published" && (
                  <Button href="/contact/" variant="secondary" size="lg">
                    Get notified
                  </Button>
                )}
                <Button href={supportHref} variant="ghost" size="lg">
                  Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots */}
      {product.screenshots.length > 0 && (
        <section className="container-x py-12 sm:py-16" aria-labelledby="screenshots-heading">
          <h2 id="screenshots-heading" className="mb-6 text-2xl font-semibold text-foreground">
            Screenshots
          </h2>
          <ScreenshotGallery screenshots={product.screenshots} productName={product.name} />
        </section>
      )}

      {/* Body */}
      <div className="container-x grid gap-12 pb-20 pt-4 lg:grid-cols-[1fr_360px] lg:gap-16 sm:pb-24">
        <div className="space-y-14">
          <Section id="about" title={`About ${product.name}`}>
            <div className="prose-studio max-w-none text-base">
              {product.description.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </Section>

          {product.features.length > 0 && (
            <Section id="features" title="Features">
              <ul className="grid gap-3 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <li key={feature} className="surface-card flex items-start gap-3 p-4 text-sm text-muted">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {product.gameplay && product.gameplay.length > 0 && (
            <Section id="gameplay" title={isGame ? "Gameplay" : "How it works"}>
              <div className="prose-studio max-w-none text-base">
                {product.gameplay.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </Section>
          )}

          <Section id="releases" title="Latest version">
            {releases.length > 0 ? (
              <ol className="space-y-4">
                {releases.slice(0, 5).map((release, index) => (
                  <li key={`${release.version}-${release.date}`} className="surface-card p-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display text-lg font-semibold text-foreground">Version {release.version}</span>
                      {index === 0 && <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent-strong">Current</span>}
                      <time dateTime={release.date} className="text-sm text-muted">
                        {formatDate(release.date)}
                      </time>
                    </div>
                    {release.notes.length > 0 && (
                      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted marker:text-accent">
                        {release.notes.map((note) => (
                          <li key={note}>{note}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="surface-card p-5 text-sm text-muted">
                {currentVersion ? (
                  <p>
                    The current version is <span className="font-medium text-foreground">{currentVersion}</span>.
                  </p>
                ) : product.status === "Published" && play ? (
                  <p>
                    Version details and the full change log for this {noun} are published on the{" "}
                    <a href={play} target="_blank" rel="noopener noreferrer" className="text-accent-strong underline underline-offset-4">
                      Google Play listing
                    </a>
                    , which always reflects the latest release.
                  </p>
                ) : (
                  <p>Release notes will appear here once the first public version ships.</p>
                )}
              </div>
            )}
          </Section>

          {product.requirements && product.requirements.length > 0 && (
            <Section id="requirements" title="System requirements">
              <div className="surface-card px-5">
                <DefinitionList items={product.requirements} />
              </div>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="surface-card px-5 py-2">
            <h2 className="pt-3 text-sm font-semibold uppercase tracking-wider text-muted">Details</h2>
            <DefinitionList items={details} />
          </div>
          <div className="surface-card p-5">
            <h2 className="text-base font-semibold text-foreground">Developer information</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {product.name} is developed, published and supported by {config.brand.name}, an independent app and game studio. This page is the official source of information for the {noun}.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Button href={supportHref} variant="outline" size="sm">
                <Icon name="mail" className="h-4 w-4" />
                Contact support
              </Button>
              <Button href={privacyHref} variant="ghost" size="sm">
                Privacy policy
              </Button>
            </div>
          </div>
          <p className="px-1 text-xs text-muted-2">
            Advertisers and ad networks:{" "}
            <Link href={`/${product.slug}/ads-txt/`} className="text-muted underline underline-offset-4 hover:text-foreground">
              app-ads.txt information for {product.name}
            </Link>
          </p>
        </aside>
      </div>
    </>
  );
}
