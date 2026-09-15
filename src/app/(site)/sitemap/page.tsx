import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo";
import { Icon, PageHero } from "@/components/ui";
import { getProducts, getSiteConfig, productPath } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { isFileLikePath } from "@/lib/utils";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Sitemap", path: "/sitemap/" },
];

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return buildMetadata({ config, title: "Sitemap", description: `An overview of every page on the ${config.brand.name} website, including all app and game pages.`, path: "/sitemap/" });
}

export default async function HtmlSitemapPage() {
  const [config, products] = await Promise.all([getSiteConfig(), getProducts()]);
  const groups = [
    { title: "Studio", links: config.navigation.studio.filter((item) => !item.href.includes("#")) },
    { title: "Apps", links: products.filter((product) => product.type === "app").map((product) => ({ label: product.name, href: productPath(product) })) },
    { title: "Games", links: products.filter((product) => product.type === "game").map((product) => ({ label: product.name, href: productPath(product) })) },
    { title: "Legal & technical", links: [...config.navigation.legal.filter((item) => item.href !== "/sitemap/"), { label: "sitemap.xml", href: "/sitemap.xml" }, { label: "robots.txt", href: "/robots.txt" }] },
  ];
  return (
    <>
      <PageHero eyebrow="Sitemap" title="Sitemap" description="Every public page on this website." topSlot={<Breadcrumbs items={crumbs} />} />
      <div className="container-x grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-4 sm:py-16">
        {groups.map((group) => (
          <section key={group.title} aria-labelledby={`sitemap-${group.title}`}>
            <h2 id={`sitemap-${group.title}`} className="text-base font-semibold text-foreground">
              {group.title}
            </h2>
            {group.links.length > 0 ? (
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {isFileLikePath(link.href) ? (
                      <a href={link.href} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
                        <Icon name="chevron-right" className="h-3.5 w-3.5 text-muted-2" />
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
                        <Icon name="chevron-right" className="h-3.5 w-3.5 text-muted-2" />
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-2">Nothing published yet.</p>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
