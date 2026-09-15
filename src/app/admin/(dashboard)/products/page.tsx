import Link from "next/link";
import { ProductIcon } from "@/components/product";
import { Badge, Button, StatusBadge } from "@/components/ui";
import { setProductPublishedAction } from "@/lib/actions/admin";
import { getAllProductRecords, productPath } from "@/lib/content";

export const metadata = { title: "Apps & games" };

export default async function AdminProductsPage() {
  const records = await getAllProductRecords();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Apps & games</h1>
          <p className="mt-1 text-sm text-muted">File-based products come from <code>src/content</code>; database products are created here. Database entries override file entries with the same slug.</p>
        </div>
        <Button href="/admin/products/new/">New product</Button>
      </div>
      <div className="surface-card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-2">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Visibility</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {records.map(({ product, source, published }) => (
              <tr key={product.slug}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ProductIcon product={product} size="sm" />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="font-mono text-xs text-muted-2">{productPath(product)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize text-muted">{product.type}</td>
                <td className="px-4 py-3"><StatusBadge status={product.status} /></td>
                <td className="px-4 py-3">
                  <Badge tone={published && product.visibility === "public" ? "success" : "neutral"}>{!published ? "Hidden" : product.visibility === "public" ? "Public" : "Draft"}</Badge>
                </td>
                <td className="px-4 py-3 text-muted">{source}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <form action={setProductPublishedAction.bind(null, product.slug, !published)}>
                      <Button type="submit" variant="ghost" size="sm">{published ? "Hide" : "Show"}</Button>
                    </form>
                    <Link href={`/admin/products/${product.slug}/`} className="inline-flex h-9 items-center rounded-xl border border-border-strong px-3.5 text-sm font-semibold text-foreground hover:border-accent">Edit</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
