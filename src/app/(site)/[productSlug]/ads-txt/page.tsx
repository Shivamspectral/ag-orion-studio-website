import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductIcon } from "@/components/product";
import { Breadcrumbs } from "@/components/seo";
import { Badge, Button, Icon, Notice, PageHero } from "@/components/ui";
import { getAdConfiguration, getProduct, getProducts, getSiteConfig, googlePlayUrl, productPath } from "@/lib/content";
import { getAdsStatus, summarizeSet } from "@/lib/ads";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ productSlug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ productSlug: product.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { productSlug } = await params;
  const [product, config] = await Promise.all([getProduct(productSlug), getSiteConfig()]);
  if (!product) return { title: "Not found", robots: { index: false, follow: false } };
  return buildMetadata({
    config,
    title: `${product.name} - app-ads.txt information`,
    description: `Advertising authorization (app-ads.txt) details for ${product.name} by ${config.brand.name}: advertising platform, authorized sellers and verification status.`,
    path: `/${product.slug}/ads-txt/`,
    noindex: true,
  });
}

export default async function ProductAdsInfoPage({ params }: Params) {
  const { productSlug } = await params;
  const [product, config, adConfig] = await Promise.all([getProduct(productSlug), getSiteConfig(), getAdConfiguration(productSlug)]);
  if (!product) notFound();

  const status = getAdsStatus(adConfig);
  const production = adConfig ? summarizeSet(adConfig.production) : null;
  const play = googlePlayUrl(product);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: product.name, path: productPath(product) },
    { name: "app-ads.txt", path: `/${product.slug}/ads-txt/` },
  ];
  const statusTone = status === "Live" ? "success" : status === "Needs configuration" ? "warning" : "neutral";

  return (
    <>
      <PageHero eyebrow="Advertising authorization" title={`${product.name} - app-ads.txt`} description={`Authorized digital sellers information for ${product.name}, published by ${config.brand.name}.`} topSlot={<Breadcrumbs items={crumbs} />} />
      <div className="container-x grid gap-8 py-14 lg:grid-cols-[minmax(0,1fr)_340px] sm:py-16">
        <div className="space-y-8">
          <Notice tone="info" title="Where the official file lives">
            The machine-readable authorization file for all {config.brand.name} apps is served at the root of this domain:{" "}
            <a href="/app-ads.txt">{config.url.replace(/^https?:\/\//, "")}/app-ads.txt</a>. This page is a human-readable summary and does not replace that file.
          </Notice>

          <section className="surface-card p-6" aria-labelledby="ads-app-heading">
            <div className="flex items-center gap-4">
              <ProductIcon product={product} size="md" />
              <div>
                <h2 id="ads-app-heading" className="text-lg font-semibold text-foreground">
                  {product.name}
                </h2>
                <p className="text-sm text-muted">
                  {product.type === "game" ? "Game" : "App"} · {product.platforms.join(", ")}
                </p>
              </div>
              <Badge tone={statusTone} className="ml-auto">
                {status}
              </Badge>
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-2">Package name</dt>
                <dd className="mt-1 text-sm font-medium text-foreground break-all">{product.packageName ?? "Not published"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-2">Advertising platform</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{adConfig?.enabled && adConfig.provider ? adConfig.provider : adConfig?.enabled ? "Not specified" : "No in-app advertising configured"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-2">Last updated</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{adConfig?.production.lastUpdated ? formatDate(adConfig.production.lastUpdated) : "Not yet published"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-2">Verification status</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{adConfig?.production.verificationStatus ?? "Not Configured"}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="sellers-heading">
            <h2 id="sellers-heading" className="text-xl font-semibold text-foreground">
              Authorized sellers
            </h2>
            {production && production.validCount > 0 ? (
              <div className="surface-card mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-2">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-medium">Ad system</th>
                      <th scope="col" className="px-4 py-3 font-medium">Publisher ID</th>
                      <th scope="col" className="px-4 py-3 font-medium">Relationship</th>
                      <th scope="col" className="px-4 py-3 font-medium">Certification ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {production.validations.filter((entry) => entry.validation.valid).map(({ record }) => (
                      <tr key={`${record.adSystemDomain}-${record.publisherId}`}>
                        <td className="px-4 py-3 font-medium text-foreground">{record.adSystemDomain}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted">{record.publisherId}</td>
                        <td className="px-4 py-3">
                          <Badge tone={record.relationship === "DIRECT" ? "accent" : "neutral"}>{record.relationship}</Badge>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted">{record.certificationAuthorityId ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="surface-card mt-4 p-6 text-sm text-muted">
                {adConfig?.enabled
                  ? `No authorized seller records have been published for ${product.name} yet. Records appear here, and in the root app-ads.txt file, once the studio publishes them.`
                  : `${product.name} does not currently have advertising authorization records. If this changes, they will be listed here and in the root app-ads.txt file.`}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="surface-card p-5">
            <h2 className="text-base font-semibold text-foreground">Files & links</h2>
            <div className="mt-4 flex flex-col gap-2">
              <Button href="/app-ads.txt" variant="outline" size="sm">
                <Icon name="download" className="h-4 w-4" />
                Raw app-ads.txt
              </Button>
              {play && (
                <Button href={play} variant="secondary" size="sm">
                  <Icon name="play" className="h-4 w-4" />
                  Google Play listing
                </Button>
              )}
              <Button href={productPath(product)} variant="ghost" size="sm">
                {product.name} page
              </Button>
            </div>
          </div>
          <div className="surface-card p-5 text-sm text-muted">
            <h2 className="text-base font-semibold text-foreground">About app-ads.txt</h2>
            <p className="mt-2 leading-relaxed">
              app-ads.txt is an IAB Tech Lab standard that lets advertisers verify which companies are authorized to sell a mobile app&apos;s advertising inventory. It is separate from ads.txt, which covers website inventory.
            </p>
            <p className="mt-3">
              Questions? <Link href="/contact/#advertising" className="text-accent-strong underline underline-offset-4">Contact the advertising team</Link>.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
