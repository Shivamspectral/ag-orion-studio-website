import type { Metadata } from "next";
import { GameCard } from "@/components/product";
import { Breadcrumbs, JsonLd } from "@/components/seo";
import { Button, EmptyState, PageHero } from "@/components/ui";
import { getGames, getSiteConfig } from "@/lib/content";
import { breadcrumbSchema, buildMetadata, productListSchema } from "@/lib/seo";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Games", path: "/games/" },
];

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return buildMetadata({
    config,
    title: "Games",
    description: `Mobile games developed and published by ${config.brand.name}, including open-world driving and simulation titles for Android with official Google Play links.`,
    path: "/games/",
  });
}

export default async function GamesPage() {
  const [config, games] = await Promise.all([getSiteConfig(), getGames()]);
  return (
    <>
      <JsonLd data={[productListSchema(games, config, `Games by ${config.brand.name}`, "/games/"), breadcrumbSchema(config, crumbs)]} />
      <PageHero
        eyebrow="Games"
        title="Games"
        description={`Open-world and simulation games built for mobile by ${config.brand.name}. Every title here is developed, published and supported directly by the studio.`}
        topSlot={<Breadcrumbs items={crumbs} />}
      />
      <section className="container-x py-14 sm:py-16" aria-label="All games">
        {games.length > 0 ? (
          <div className="grid gap-6">
            <GameCard product={games[0]} large priority />
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
            title="No games published yet"
            description="Our first titles are being prepared for release. Check back soon or get in touch to hear about launches."
            action={
              <Button href="/contact/" variant="outline">
                Contact the studio
              </Button>
            }
          />
        )}
      </section>
    </>
  );
}
