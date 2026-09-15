import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { getProduct, getProducts, getSiteConfig, productPath } from "@/lib/content";
import { productMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const items = await getProducts("app");
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const [product, config] = await Promise.all([getProduct(slug, "app"), getSiteConfig()]);
  if (!product) return { title: "App not found", robots: { index: false, follow: false } };
  return productMetadata(product, config);
}

export default async function AppPage({ params }: Params) {
  const { slug } = await params;
  const [product, config] = await Promise.all([getProduct(slug), getSiteConfig()]);
  if (!product) notFound();
  // Keep one canonical URL per product: /apps/<slug>/ for apps, /games/<slug>/ for games.
  if (product.type !== "app") permanentRedirect(productPath(product));
  return <ProductDetail product={product} config={config} />;
}
