"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import type { NavItem } from "@/content/types";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui";

export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-11 w-11 items-center justify-center rounded-xl text-foreground hover:bg-surface-3"
      >
        <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
      </button>
      <div
        id={panelId}
        className={cn(
          "fixed inset-x-0 top-16 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
        )}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile" className="container-x flex flex-col py-4">
          {items.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                tabIndex={open ? 0 : -1}
                className={cn(
                  "flex min-h-12 items-center justify-between rounded-xl px-4 text-lg font-medium",
                  active ? "bg-surface-3 text-foreground" : "text-muted hover:bg-surface-3 hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
                <Icon name="chevron-right" className="h-5 w-5 text-muted-2" />
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
