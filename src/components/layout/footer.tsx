import Link from "next/link";
import type { Product, SiteConfiguration } from "@/content/types";
import { googlePlayUrl, productPath } from "@/lib/content";
import { Icon } from "@/components/ui";
import { isFileLikePath } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";

export function Footer({
  config,
  products,
}: {
  config: SiteConfiguration;
  products: Product[];
}) {
  const year = new Date().getFullYear();

  const apps = products.filter((product) => product.type === "app");
  const games = products.filter((product) => product.type === "game");

  const column = (
    title: string,
    items: { label: string; href: string; external?: boolean }[],
  ) => (
    <div>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={`${item.href}-${item.label}`}>
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
              >
                {item.label}
                <Icon name="external" className="h-3.5 w-3.5" />
              </a>
            ) : isFileLikePath(item.href) ? (
              <a
                href={item.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ) : (
              <Link
                href={item.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  const productLinks = (list: Product[]) =>
    list.flatMap((product) => {
      const play = googlePlayUrl(product);

      return [
        {
          label: product.name,
          href: productPath(product),
        },
        ...(play
          ? [
              {
                label: `${product.name} on Google Play`,
                href: play,
                external: true,
              },
            ]
          : []),
      ];
    });

  return (
    <footer className="border-t border-white/[0.06] bg-surface/50">
      <div className="container-x py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.7fr_1fr_1fr_1fr]">
          <div className="max-w-md">
            <BrandLogo brand={config.brand} />

            <p className="mt-5 text-sm leading-7 text-muted">
              {config.brand.tagline}
            </p>

            <p className="mt-3 text-sm leading-7 text-muted-2">
              Independent developer and publisher creating mobile apps and
              games for Android.
            </p>

            {config.social.length > 0 && (
              <ul
                className="mt-6 flex flex-wrap gap-2"
                aria-label="Social profiles"
              >
                {config.social.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer me"
                      className="inline-flex h-9 items-center rounded-lg border border-border bg-white/[0.02] px-3 text-xs font-medium text-muted transition-all hover:border-accent/40 hover:bg-accent-soft hover:text-foreground"
                    >
                      {link.platform}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {column("Studio", config.navigation.studio)}

          {column("Products", [
            ...(games.length
              ? productLinks(games)
              : [{ label: "Games", href: "/games/" }]),
            ...(apps.length
              ? productLinks(apps)
              : [{ label: "Apps", href: "/apps/" }]),
          ])}

          {column("Legal", config.navigation.legal)}
        </div>

        <div className="my-12 h-px section-line" />

        <div className="flex flex-col gap-3 text-xs text-muted-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {config.brand.name}. All rights reserved.
          </p>

          <p>
            Google Play and the Google Play logo are trademarks of Google LLC.
          </p>
        </div>
      </div>
    </footer>
  );
}