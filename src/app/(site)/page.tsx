import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { HeroVisual } from "@/components/hero-visual";
import {
  AppCard,
  GameCard,
  ProductIcon,
} from "@/components/product";
import {
  Button,
  EmptyState,
  Icon,
  SectionHeader,
  StatusBadge,
} from "@/components/ui";

import {
  getFeaturedProducts,
  getLatestReleases,
  getSiteConfig,
  googlePlayUrl,
  productPath,
} from "@/lib/content";

import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();

  return buildMetadata({
    config,
    path: "/",
    absoluteTitle: true,
  });
}

export default async function HomePage() {
  const [config, apps, games, releases] = await Promise.all([
    getSiteConfig(),
    getFeaturedProducts("app", 3),
    getFeaturedProducts("game", 3),
    getLatestReleases(4),
  ]);

  const { hero, whyUs, about, brand } = config;

  const featuredGame = games[0];

  return (
    <>
      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div
          className="hero-grid pointer-events-none absolute inset-0"
          aria-hidden="true"
        />

        <div
          className="hero-glow pointer-events-none absolute -right-40 -top-40 h-[700px] w-[700px] rounded-full"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute bottom-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/30 to-transparent"
          aria-hidden="true"
        />

        <div className="container-x relative grid items-center gap-14 py-16 sm:py-20 lg:min-h-[680px] lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 lg:py-24">
          <div className="animate-fade-up max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3.5 py-2 text-xs font-semibold text-accent-strong">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-accent" />
              Independent Android app &amp; game studio
            </div>

            <p className="eyebrow mb-5">{hero.eyebrow}</p>

            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
              {hero.heading}
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              {hero.subheading}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href={hero.primaryCta.href} size="lg">
                {hero.primaryCta.label}
                <Icon name="arrow-right" className="h-5 w-5" />
              </Button>

              <Button
                href={hero.secondaryCta.href}
                size="lg"
                variant="secondary"
              >
                {hero.secondaryCta.label}
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/[0.07] pt-6 text-sm text-muted">
              <span className="flex items-center gap-2">
                <Icon
                  name="shield"
                  className="h-4 w-4 text-accent-strong"
                />
                Official developer &amp; publisher
              </span>

              <span className="flex items-center gap-2">
                <Icon
                  name="play"
                  className="h-4 w-4 text-accent-strong"
                />
                Android &amp; Google Play
              </span>
            </div>
          </div>

          <div
            className="animate-fade-up lg:pl-4"
            style={{ animationDelay: "120ms" }}
          >
            <HeroVisual game={featuredGame} apps={apps} />
          </div>
        </div>
      </section>

      {/* =========================================================
          PRODUCT INTRO
      ========================================================= */}

      <section className="container-x py-16 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">What we make</p>

            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Apps and games built for real people.
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-muted">
              From practical mobile tools to immersive driving experiences,
              AG Orion Studio focuses on useful products, enjoyable gameplay,
              and a better Android experience.
            </p>
          </div>

          <Link
            href="/apps/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-accent-strong"
          >
            Explore everything
            <Icon
              name="arrow-right"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {/* =========================================================
          APPS
      ========================================================= */}

      <section
        className="container-x pb-20 sm:pb-24"
        aria-labelledby="featured-apps"
      >
        <SectionHeader
          eyebrow="Mobile apps"
          title="Tools made to be useful."
          description="Practical Android applications designed around everyday tasks and real-world needs."
          action={
            <Button href="/apps/" variant="ghost" size="sm">
              View all apps
              <Icon name="arrow-right" className="h-4 w-4" />
            </Button>
          }
        />

        <h2 id="featured-apps" className="sr-only">
          Featured Android apps from AG Orion Studio
        </h2>

        {apps.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <AppCard key={app.slug} product={app} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="phone"
            title="Apps are on the way"
            description="New Android applications from the studio will appear here when they are published."
          />
        )}
      </section>

      {/* =========================================================
          GAMES
      ========================================================= */}

      <section
        className="relative overflow-hidden border-y border-white/[0.06] bg-surface/45 py-20 sm:py-24"
        aria-labelledby="featured-games"
      >
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-64 w-[700px] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-3xl"
          aria-hidden="true"
        />

        <div className="container-x relative">
          <SectionHeader
            eyebrow="Mobile games"
            title="Worlds worth exploring."
            description="Driving and simulation experiences built to put you behind the wheel and let you explore."
            action={
              <Button href="/games/" variant="ghost" size="sm">
                View all games
                <Icon name="arrow-right" className="h-4 w-4" />
              </Button>
            }
          />

          <h2 id="featured-games" className="sr-only">
            Featured Android games from AG Orion Studio
          </h2>

          {games.length > 0 ? (
            <div className="grid gap-6">
              <GameCard product={games[0]} priority large />

              {games.length > 1 && (
                <div className="grid gap-6 lg:grid-cols-2">
                  {games.slice(1).map((game) => (
                    <GameCard key={game.slug} product={game} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              title="Games are in the works"
              description="New mobile games from AG Orion Studio will appear here as they become available."
            />
          )}
        </div>
      </section>

      {/* =========================================================
          WHY AG ORION
      ========================================================= */}

      <section
        className="container-x py-20 sm:py-24"
        aria-labelledby="why-heading"
      >
        <SectionHeader
          eyebrow="Our approach"
          title={`Why ${brand.name}`}
          description="A focused independent studio with a simple goal: build products worth coming back to."
        />

        <h2 id="why-heading" className="sr-only">
          Why choose {brand.name}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map((item) => (
            <div
              key={item.title}
              className="surface-card surface-card-hover p-6"
            >
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent-soft text-accent-strong">
                <Icon name={item.icon} className="h-5 w-5" />
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          RELEASES
      ========================================================= */}

      <section
        className="border-y border-white/[0.06] bg-surface/45 py-20 sm:py-24"
        aria-labelledby="releases-heading"
      >
        <div className="container-x">
          <SectionHeader
            eyebrow="Updates"
            title="Latest releases"
            description="Recent versions and updates from our published apps and games."
          />

          <h2 id="releases-heading" className="sr-only">
            Latest app and game releases
          </h2>

          {releases.length > 0 ? (
            <ol className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
              {releases.map(({ product, version, date, notes }) => {
                const play = googlePlayUrl(product);

                return (
                  <li
                    key={product.slug}
                    className="flex flex-col gap-4 border-b border-border p-5 last:border-b-0 sm:flex-row sm:items-center sm:gap-6 sm:p-6"
                  >
                    <ProductIcon product={product} size="md" />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={productPath(product)}
                          className="font-semibold text-foreground transition-colors hover:text-accent-strong"
                        >
                          {product.name}
                        </Link>

                        <StatusBadge status={product.status} />

                        {version && (
                          <span className="text-xs font-medium text-muted">
                            v{version}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm leading-6 text-muted">
                        {notes[0] ??
                          (product.status === "Published"
                            ? `${product.type === "game" ? "Game" : "App"} available now${
                                play ? " on Google Play" : ""
                              }.`
                            : `${product.status} - ${product.category}`)}

                        {date && (
                          <span className="text-muted-2">
                            {" "}
                            · {formatDate(date)}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        href={productPath(product)}
                        variant="outline"
                        size="sm"
                      >
                        Details
                      </Button>

                      {play && (
                        <Button
                          href={play}
                          variant="secondary"
                          size="sm"
                        >
                          <Icon name="play" className="h-4 w-4" />
                          Google Play
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <EmptyState
              icon="refresh"
              title="No releases yet"
              description="Release information will appear here as products are published and updated."
            />
          )}
        </div>
      </section>

      {/* =========================================================
          STUDIO
      ========================================================= */}

      <section
        className="container-x py-20 sm:py-28"
        aria-labelledby="studio-heading"
      >
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-surface-3 shadow-card">
            {about.image ? (
              <>
                <Image
                  src={about.image}
                  alt={about.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent" />
              </>
            ) : (
              <div className="grid-fade h-full w-full" />
            )}

            <div className="absolute bottom-5 left-5 rounded-xl border border-white/10 bg-background/75 px-4 py-3 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">
                AG Orion Studio
              </p>

              <p className="mt-1 text-sm text-foreground">
                Independent Android developer
              </p>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-4">The studio</p>

            <h2
              id="studio-heading"
              className="text-3xl font-semibold sm:text-4xl lg:text-5xl"
            >
              Independent by design.
            </h2>

            <p className="mt-6 text-lg leading-8 text-muted">
              {about.intro}
            </p>

            <p className="mt-4 leading-7 text-muted">
              {about.paragraphs[0]}
            </p>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {about.principles.slice(0, 4).map((principle) => (
                <li
                  key={principle.title}
                  className="flex items-start gap-3 text-sm"
                >
                  <Icon
                    name="check"
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong"
                  />

                  <span>
                    <span className="font-medium text-foreground">
                      {principle.title}.
                    </span>{" "}
                    <span className="text-muted">
                      {principle.description}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <Button href="/about/" variant="outline" className="mt-8">
              About {brand.name}
              <Icon name="arrow-right" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT CTA
      ========================================================= */}

      <section className="container-x pb-20 sm:pb-28">
        <div className="relative overflow-hidden rounded-[2rem] border border-accent/25 bg-surface-2 p-8 shadow-glow sm:p-12 lg:p-14">
          <div
            className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent"
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">Get in touch</p>

              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Have an idea, question or partnership opportunity?
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-muted">
                Contact AG Orion Studio for app support, game feedback,
                business inquiries, advertising questions, or developer
                conversations.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button href="/contact/" size="lg">
                Contact the studio
                <Icon name="arrow-right" className="h-5 w-5" />
              </Button>

              <Button
                href="/contact/#support"
                size="lg"
                variant="secondary"
              >
                Get support
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}