import Link from "next/link";
import { notFound } from "next/navigation";
import { AdConfigForm } from "@/components/admin/forms";
import { Button, Notice } from "@/components/ui";
import { promoteDraftAction } from "@/lib/actions/admin";
import { emptyAdConfiguration, getAdConfiguration, getAllProductRecords } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const metadata = { title: "Advertising configuration" };

export default async function AdminAdConfigPage({ params }: Props) {
  const { slug } = await params;
  const record = (await getAllProductRecords()).find((entry) => entry.product.slug === slug);
  if (!record) notFound();
  const config = (await getAdConfiguration(slug)) ?? emptyAdConfiguration(slug);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{record.product.name} - app-ads.txt</h1>
          <p className="mt-1 text-sm text-muted">
            Public info page: <Link href={`/${slug}/ads-txt/`} className="text-accent-strong underline">/{slug}/ads-txt/</Link>
          </p>
        </div>
        <form action={promoteDraftAction.bind(null, slug)}>
          <Button type="submit" variant="secondary" size="sm" disabled={config.draft.records.length === 0}>
            Promote draft → production
          </Button>
        </form>
      </div>
      <Notice tone="info">Save the form first, then promote. Promotion copies the draft records into production and stamps today&apos;s date.</Notice>
      <AdConfigForm config={config} productName={record.product.name} packageName={record.product.packageName} />
    </div>
  );
}
