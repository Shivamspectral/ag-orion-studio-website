import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/seo";
import { getProducts, getSiteConfig } from "@/lib/content";
import { organizationSchema, websiteSchema } from "@/lib/seo";

/** Public pages are statically rendered and refreshed in the background. */
export const revalidate = 300;

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [config, products] = await Promise.all([getSiteConfig(), getProducts()]);
  return (
    <>
      <JsonLd data={[organizationSchema(config), websiteSchema(config)]} />
      <Header config={config} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer config={config} products={products} />
    </>
  );
}
