import Link from "next/link";
import { CopyButton, DownloadButton } from "@/components/admin/forms";
import { Badge, Notice } from "@/components/ui";
import { generateAppAdsTxt, getAdsStatus, summarizeSet } from "@/lib/ads";
import { emptyAdConfiguration, getAdConfigurations, getAllProductRecords, getSiteConfig } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Advertising" };

export default async function AdminAdsPage() {
  const [config, records, adConfigurations] = await Promise.all([getSiteConfig(), getAllProductRecords(), getAdConfigurations()]);
  const names = Object.fromEntries(records.map((record) => [record.product.slug, record.product.name]));
  const contact = config.contact.channels.find((channel) => channel.email)?.email;
  const raw = generateAppAdsTxt(adConfigurations, names, { siteUrl: config.url, contactEmail: contact, studioName: config.brand.name });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Advertising authorization</h1>
        <p className="mt-1 text-sm text-muted">Per-app app-ads.txt configuration. The root file at <a href="/app-ads.txt" className="text-accent-strong underline">/app-ads.txt</a> is generated from every production set below.</p>
      </div>
      <Notice tone="warning" title="Never guess publisher IDs">
        Copy IDs exactly from your ad network console (for AdMob: Settings → Account information → Publisher ID). Records with a missing ID are ignored and flagged here.
      </Notice>
      <div className="surface-card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-2">
            <tr>
              <th className="px-4 py-3 font-medium">App</th>
              <th className="px-4 py-3 font-medium">Provider</th>
              <th className="px-4 py-3 font-medium">Production</th>
              <th className="px-4 py-3 font-medium">Draft</th>
              <th className="px-4 py-3 font-medium">Last updated</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {records.map(({ product }) => {
              const adConfig = adConfigurations.find((entry) => entry.productSlug === product.slug) ?? emptyAdConfiguration(product.slug);
              const status = getAdsStatus(adConfig);
              const prod = summarizeSet(adConfig.production);
              const draft = summarizeSet(adConfig.draft);
              return (
                <tr key={product.slug}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{product.name}</p>
                    <p className="font-mono text-xs text-muted-2">{product.packageName ?? "no package name"}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">{adConfig.provider || "—"}</td>
                  <td className="px-4 py-3 text-muted">{prod.validCount} valid{prod.invalidCount ? ` · ${prod.invalidCount} invalid` : ""}</td>
                  <td className="px-4 py-3 text-muted">{draft.validCount} valid{draft.invalidCount ? ` · ${draft.invalidCount} invalid` : ""}</td>
                  <td className="px-4 py-3 text-muted">{adConfig.production.lastUpdated ? formatDate(adConfig.production.lastUpdated) : "—"}</td>
                  <td className="px-4 py-3"><Badge tone={status === "Live" ? "success" : status === "Needs configuration" ? "warning" : "neutral"}>{status}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/ads/${product.slug}/`} className="inline-flex h-9 items-center rounded-xl border border-border-strong px-3.5 text-sm font-semibold text-foreground hover:border-accent">Manage</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <section className="surface-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-foreground">Live /app-ads.txt preview</h2>
          <div className="flex gap-2">
            <CopyButton text={raw} />
            <DownloadButton text={raw} filename="app-ads.txt" />
          </div>
        </div>
        <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-background p-4 font-mono text-xs text-muted">{raw}</pre>
      </section>
    </div>
  );
}
