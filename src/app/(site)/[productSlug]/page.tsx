import { notFound, permanentRedirect } from "next/navigation";
import { getProduct, getProducts, productPath } from "@/lib/content";

type Params = { params: Promise<{ productSlug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ productSlug: product.slug }));
}

/** Short product URLs (/indianopenworlddriving/) permanently redirect to the canonical detail page. */
export default async function ProductShortlinkPage({ params }: Params) {
  const { productSlug } = await params;
  const product = await getProduct(productSlug);
  if (!product) notFound();
  permanentRedirect(productPath(product));
}
