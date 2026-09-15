import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { termsOfUse } from "@/content/legal";
import { getSiteConfig } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return buildMetadata({ config, title: termsOfUse.title, description: termsOfUse.description, path: "/terms/" });
}

export default async function TermsPage() {
  const config = await getSiteConfig();
  return <LegalPage document={termsOfUse} config={config} />;
}
