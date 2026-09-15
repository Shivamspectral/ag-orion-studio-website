import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { NotFoundContent } from "@/components/not-found-content";
import { getProducts, getSiteConfig } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/** Root 404 for URLs that match no route at all; renders its own header and footer. */
export default async function NotFound() {
  const [config, products] = await Promise.all([getSiteConfig(), getProducts()]);
  return (
    <>
      <Header config={config} />
      <main id="main" className="flex flex-1 items-center">
        <NotFoundContent />
      </main>
      <Footer config={config} products={products} />
    </>
  );
}
