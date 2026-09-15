import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { logoutAction } from "@/lib/actions/admin";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSiteConfig } from "@/lib/content";
import { Icon } from "@/components/ui";

const links = [
  { href: "/admin/", label: "Overview" },
  { href: "/admin/products/", label: "Apps & games" },
  { href: "/admin/ads/", label: "Advertising (app-ads.txt)" },
  { href: "/admin/settings/", label: "Studio settings" },
  { href: "/admin/messages/", label: "Messages" },
];

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login/");
  const config = await getSiteConfig();

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <aside className="border-b border-border bg-surface/60 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 px-5 py-4">
          <Image src={config.brand.logoMark} alt="" width={32} height={32} unoptimized={config.brand.logoMark.endsWith(".svg")} className="rounded-lg" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{config.brand.name}</p>
            <p className="text-xs text-muted-2">Admin</p>
          </div>
        </div>
        <nav aria-label="Admin" className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-surface-3 hover:text-foreground">
              {link.label}
            </Link>
          ))}
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-surface-3 hover:text-foreground">
            View website <Icon name="external" className="h-3.5 w-3.5" />
          </a>
          <form action={logoutAction} className="lg:mt-4 lg:border-t lg:border-border lg:pt-4">
            <button type="submit" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-surface-3 hover:text-foreground">
              Sign out
            </button>
          </form>
        </nav>
      </aside>
      <main id="main" className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
