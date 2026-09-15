import Link from "next/link";
import Image from "next/image";
import type { Product, StoreLink } from "@/content/types";
import { googlePlayUrl, productPath } from "@/lib/content";
import { cn, initials } from "@/lib/utils";
import { SmartImage } from "./smart-image";
import { Badge, Button, Icon, StatusBadge } from "./ui";

/* ------------------------------------------------------------------ */
/* Icon                                                                */
/* ------------------------------------------------------------------ */

const iconSizes = { sm: 40, md: 56, lg: 72, xl: 112 } as const;

export function ProductIcon({ product, size = "md", className, priority }: { product: Product; size?: keyof typeof iconSizes; className?: string; priority?: boolean }) {
  const px = iconSizes[size];
  const wrapper = cn(
    "relative shrink-0 overflow-hidden rounded-[22%] border border-white/10 bg-surface-3 shadow-card",
    className,
  );
  return (
    <div className={wrapper} style={{ width: px, height: px }}>
      <SmartImage
        src={product.icon}
        alt={`${product.name} icon`}
        width={px}
        height={px}
        sizes={`${px}px`}
        priority={priority}
        className="h-full w-full object-cover"
        wrapperClassName="h-full w-full"
        fallback={
          <span className="font-display text-lg font-semibold text-accent-strong" aria-hidden="true">
            {initials(product.name)}
          </span>
        }
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Store buttons                                                       */
/* ------------------------------------------------------------------ */

export function GooglePlayButton({ url, size = "md", className, productName }: { url: string; size?: "sm" | "md" | "lg"; className?: string; productName?: string }) {
  return (
    <Button
      href={url}
      variant="secondary"
      size={size}
      className={cn("bg-black/60 border-white/15 hover:border-white/30", className)}
      aria-label={productName ? `Get ${productName} on Google Play (opens in a new tab)` : "Get it on Google Play (opens in a new tab)"}
    >
      <Icon name="play" className={size === "lg" ? "h-6 w-6" : "h-5 w-5"} />
      <span className="flex flex-col items-start leading-none">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted">Get it on</span>
        <span className={cn("font-semibold", size === "lg" ? "text-base" : "text-sm")}>Google Play</span>
      </span>
    </Button>
  );
}

export function StoreButtons({ product, size = "md", className }: { product: Product; size?: "sm" | "md" | "lg"; className?: string }) {
  const play = googlePlayUrl(product);
  const others = product.storeLinks.filter((link: StoreLink) => link.store !== "Google Play");
  if (!play && others.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {play && <GooglePlayButton url={play} size={size} productName={product.name} />}
      {others.map((link) => (
        <Button key={link.url} href={link.url} variant="secondary" size={size}>
          {link.label ?? (link.store === "Web" ? "Open Web App" : `Get it on ${link.store}`)}
          <Icon name="external" className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

export function AppCard({ product }: { product: Product }) {
  const play = googlePlayUrl(product);
  const href = productPath(product);
  return (
    <article className="surface-card group relative flex h-full flex-col p-5 transition-colors hover:border-border-strong sm:p-6">
      <div className="flex items-start gap-4">
        <ProductIcon product={product} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-foreground">
            <Link href={href} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
              {product.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-sm text-muted">{product.category}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <StatusBadge status={product.status} />
          </div>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{product.shortDescription}</p>
      <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-2">{product.platforms.join(" · ")}</p>
      <div className="relative z-10 mt-5 flex flex-wrap gap-2.5">
        <Button href={href} variant="outline" size="sm">
          View App
          <Icon name="arrow-right" className="h-4 w-4" />
        </Button>
        {play && <GooglePlayButton url={play} size="sm" productName={product.name} />}
      </div>
    </article>
  );
}

export function GameCard({ product, priority = false, large = false }: { product: Product; priority?: boolean; large?: boolean }) {
  const play = googlePlayUrl(product);
  const href = productPath(product);
  const artwork = product.coverImage ?? product.heroImage;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-card transition-colors hover:border-border-strong">
      <div className={cn("relative w-full overflow-hidden bg-surface-3", large ? "aspect-[16/9]" : "aspect-[16/10]")}>
        {artwork ? (
          <Image
            src={artwork}
            alt={`${product.name} artwork`}
            fill
            priority={priority}
            sizes={large ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 1024px) 50vw, 100vw"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="grid-fade absolute inset-0 flex items-center justify-center">
            <ProductIcon product={product} size="xl" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" aria-hidden="true" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-1.5 sm:left-6 sm:top-6">
          <StatusBadge status={product.status} className="backdrop-blur-sm" />
        </div>
      </div>
      <div className={cn("relative -mt-12 flex flex-1 flex-col p-5 sm:p-7", large && "lg:-mt-20")}>
        <div className="flex items-end gap-4">
          <ProductIcon product={product} size={large ? "xl" : "lg"} className="border-white/15" />
          <div className="min-w-0 pb-1">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">{product.genres.length ? product.genres.join(" · ") : product.category}</p>
            <h3 className={cn("mt-1 font-semibold text-foreground", large ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl")}>
              <Link href={href} className="after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none">
                {product.name}
              </Link>
            </h3>
          </div>
        </div>
        <p className={cn("mt-4 leading-relaxed text-muted", large ? "max-w-2xl text-base" : "line-clamp-3 text-sm")}>{product.shortDescription}</p>
        <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3">
          <Button href={href} variant={play ? "outline" : "primary"} size={large ? "md" : "sm"}>
            View Game
            <Icon name="arrow-right" className="h-4 w-4" />
          </Button>
          {play && <GooglePlayButton url={play} size={large ? "md" : "sm"} productName={product.name} />}
          <span className="ml-auto text-xs font-medium uppercase tracking-wider text-muted-2">{product.platforms.join(" · ")}</span>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Detail helpers                                                      */
/* ------------------------------------------------------------------ */

export function GenreBadges({ product }: { product: Product }) {
  const items = product.genres.length > 0 ? product.genres : [product.category];
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((genre) => (
        <Badge key={genre} tone="accent">
          {genre}
        </Badge>
      ))}
    </div>
  );
}

export function DefinitionList({ items, className }: { items: { label: string; value: React.ReactNode }[]; className?: string }) {
  return (
    <dl className={cn("divide-y divide-border", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <dt className="text-sm text-muted">{item.label}</dt>
          <dd className="text-sm font-medium text-foreground sm:text-right break-words">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
