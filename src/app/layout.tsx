import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Sora } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { getSiteConfig } from "@/lib/content";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return {
    metadataBase: new URL(config.url),
    title: { default: config.seo.defaultTitle, template: config.seo.titleTemplate },
    description: config.seo.defaultDescription,
    applicationName: config.brand.name,
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: config.brand.favicon, type: "image/svg+xml" },
        { url: config.brand.favicon32, sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: config.brand.appleTouchIcon, sizes: "180x180", type: "image/png" }],
    },
    formatDetection: { telephone: false },
    appleWebApp: { title: config.brand.shortName, capable: false },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const config = await getSiteConfig();
  return { width: "device-width", initialScale: 1, themeColor: config.brand.themeColor, colorScheme: "dark" };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const config = await getSiteConfig();
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} style={{ "--accent": config.brand.accentColor } as React.CSSProperties}>
      <body className="min-h-dvh flex flex-col">
        {children}
        <Analytics config={config} />
      </body>
    </html>
  );
}
