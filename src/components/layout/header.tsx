import Link from "next/link";
import type { SiteConfiguration } from "@/content/types";
import { Button, Icon } from "@/components/ui";
import { BrandLogo } from "./brand-logo";
import { MobileMenu } from "./mobile-menu";

export function Header({ config }: { config: SiteConfiguration }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <div className="container-x flex h-[4.5rem] items-center justify-between gap-5">
        <BrandLogo brand={config.brand} priority />

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {config.navigation.main.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted transition-all hover:bg-white/[0.045] hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            href="/contact/#support"
            variant="outline"
            size="sm"
            className="hidden border-white/10 bg-white/[0.02] md:inline-flex"
          >
            Support
            <Icon name="arrow-right" className="h-4 w-4" />
          </Button>

          <MobileMenu
            items={[
              ...config.navigation.main,
              { label: "Support", href: "/contact/#support" },
            ]}
          />
        </div>
      </div>
    </header>
  );
}