import Link from "next/link";
import { count, isNull } from "drizzle-orm";

import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { getAllProductRecords } from "@/lib/content";

export default async function AdminDashboardPage() {
  const records = await getAllProductRecords();

  let unread = 0;

  if (db) {
    try {
      const [row] = await db
        .select({ value: count() })
        .from(contactMessages)
        .where(isNull(contactMessages.readAt));

      unread = row?.value ?? 0;
    } catch {
      unread = 0;
    }
  }

  const publicCount = records.filter(
    (record) =>
      record.published &&
      record.product.visibility === "public"
  ).length;

  const appCount = records.filter(
    (record) => record.product.type === "app"
  ).length;

  const gameCount = records.filter(
    (record) => record.product.type === "game"
  ).length;

  const cards = [
    {
      label: "Public products",
      value: publicCount,
      sub: "Currently visible on the website",
      href: "/admin/products/",
    },
    {
      label: "Apps",
      value: appCount,
      sub: "Apps in the content catalog",
      href: "/admin/products/",
    },
    {
      label: "Games",
      value: gameCount,
      sub: "Games in the content catalog",
      href: "/admin/products/",
    },
  ];

  const checks = [
    {
      label: "Public products",
      detail:
        publicCount > 0
          ? `${publicCount} public product${
              publicCount === 1 ? "" : "s"
            } configured.`
          : "No public products configured yet.",
      ok: publicCount > 0,
    },
    {
      label: "Contact messages",
      detail:
        unread > 0
          ? `${unread} unread message${
              unread === 1 ? "" : "s"
            }.`
          : "No unread contact messages.",
      ok: unread === 0,
    },
    {
      label: "Database",
      detail: db
        ? "Database connection is available."
        : "No DATABASE_URL configured. Public static content is being used.",
      ok: Boolean(db),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Overview
        </h1>

        <p className="mt-1 text-sm text-muted">
          Everything on the public site is generated from file content plus
          optional database overrides.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="surface-card p-5 transition-colors hover:border-border-strong"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-2">
              {card.label}
            </p>

            <p className="mt-2 font-display text-2xl font-semibold text-foreground">
              {card.value}
            </p>

            <p className="text-sm text-muted">
              {card.sub}
            </p>
          </Link>
        ))}
      </div>

      <section className="surface-card p-5">
        <h2 className="text-base font-semibold text-foreground">
          Launch checklist
        </h2>

        <ul className="mt-4 divide-y divide-border">
          {checks.map((check) => (
            <li
              key={check.label}
              className="flex items-center justify-between gap-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium text-foreground">
                  {check.label}
                </p>

                <p className="text-muted">
                  {check.detail}
                </p>
              </div>

              <span
                className={
                  check.ok
                    ? "rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500"
                    : "rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-500"
                }
              >
                {check.ok ? "OK" : "Action"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/products/new/"
          className="inline-flex items-center rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          Add an app or game
        </Link>

        <Link
          href="/app-ads.txt"
          className="inline-flex items-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/10"
        >
          View live app-ads.txt
        </Link>
      </div>
    </div>
  );
}