import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { privacyPolicy } from "@/content/legal";
import { getSiteConfig } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return buildMetadata({ config, title: privacyPolicy.title, description: privacyPolicy.description, path: "/privacy/" });
}

export default async function PrivacyPage() {
  const config = await getSiteConfig();
  return <LegalPage document={privacyPolicy} config={config} />;
}
