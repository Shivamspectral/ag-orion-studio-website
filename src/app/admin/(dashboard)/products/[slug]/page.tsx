import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/forms";
import { Button, Notice } from "@/components/ui";
import { deleteProductOverrideAction } from "@/lib/actions/admin";
import { getAllProductRecords, productPath } from "@/lib/content";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ saved?: string }> };

export const metadata = { title: "Edit product" };

export default async function AdminProductEditPage({ params, searchParams }: Props) {
  const [{ slug }, { saved }] = await Promise.all([params, searchParams]);
  const isNew = slug === "new";
  const record = isNew ? undefined : (await getAllProductRecords()).find((entry) => entry.product.slug === slug);
  if (!isNew && !record) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{isNew ? "New app or game" : record!.product.name}</h1>
          {record && (
            <p className="mt-1 text-sm text-muted">
              Source: {record.source}. Public URL: <a href={productPath(record.product)} target="_blank" rel="noopener noreferrer" className="text-accent-strong underline">{productPath(record.product)}</a>
            </p>
          )}
        </div>
        {record?.source === "database" && (
          <form action={deleteProductOverrideAction.bind(null, record.product.slug)}>
            <Button type="submit" variant="danger" size="sm">Delete database entry</Button>
          </form>
        )}
      </div>
      {saved && <Notice tone="success">Product saved. Public pages have been refreshed.</Notice>}
      {record?.source === "file" && <Notice tone="info">Saving creates a database override for this file-based product. Delete the override later to return to the file version.</Notice>}
      <ProductForm product={record?.product} isNew={isNew} />
    </div>
  );
}
