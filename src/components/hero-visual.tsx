import Image from "next/image";
import type { Product } from "@/content/types";
import { ProductIcon } from "./product";
import { Icon } from "./ui";

const stars = [
  { cx: 12, cy: 18, r: 1.6, d: "0s" },
  { cx: 28, cy: 8, r: 1, d: "1.2s" },
  { cx: 46, cy: 14, r: 1.3, d: "2.1s" },
  { cx: 64, cy: 6, r: 0.9, d: "0.6s" },
  { cx: 82, cy: 16, r: 1.5, d: "1.7s" },
  { cx: 92, cy: 34, r: 1, d: "2.6s" },
  { cx: 8, cy: 52, r: 1.1, d: "0.9s" },
  { cx: 22, cy: 74, r: 1.4, d: "1.9s" },
  { cx: 56, cy: 88, r: 1, d: "0.3s" },
  { cx: 78, cy: 78, r: 1.2, d: "2.3s" },
  { cx: 94, cy: 62, r: 0.9, d: "1.4s" },
  { cx: 40, cy: 40, r: 0.8, d: "3s" },
];

/**
 * Decorative hero composition: a subtle star field (Orion nod) with floating
 * tiles built from the featured products. Pure CSS animation, no JS.
 */
export function HeroVisual({ game, apps }: { game?: Product; apps: Product[] }) {
  const artwork = game?.heroImage ?? game?.coverImage;
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-xl select-none lg:max-w-none" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-foreground" preserveAspectRatio="none">
        {stars.map((star) => (
          <circle key={`${star.cx}-${star.cy}`} cx={star.cx} cy={star.cy} r={star.r * 0.6} fill="currentColor" className="animate-twinkle" style={{ animationDelay: star.d }} />
        ))}
        <path d="M12 18 L28 8 L46 14 M46 14 L40 40 M82 16 L92 34 L94 62" stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.25" fill="none" />
      </svg>

      <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl" />

      {/* Main game tile */}
      <div className="animate-float-slow absolute left-[6%] top-[10%] w-[66%] overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
        <div className="relative aspect-[16/10] bg-surface-3">
          {artwork ? (
            <Image src={artwork} alt="" fill priority sizes="(min-width: 1024px) 420px, 60vw" className="object-cover" />
          ) : (
            <div className="grid-fade h-full w-full" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
        </div>
        {game && (
          <div className="flex items-center gap-3 px-4 py-3">
            <ProductIcon product={game} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{game.name}</p>
              <p className="truncate text-xs text-muted">{game.genres[0] ?? game.category}</p>
            </div>
            <span className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-black/50 px-2.5 text-xs font-medium text-foreground">
              <Icon name="play" className="h-3.5 w-3.5" />
              Play
            </span>
          </div>
        )}
      </div>

      {/* App tiles */}
      <div className="animate-float absolute right-[4%] top-[6%] flex w-[36%] flex-col gap-3 rounded-2xl border border-white/10 bg-surface/90 p-3 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur" style={{ animationDelay: "1.5s" }}>
        {(apps.length > 0 ? apps.slice(0, 2) : [undefined, undefined]).map((app, index) => (
          <div key={app?.slug ?? index} className="flex items-center gap-2.5">
            {app ? <ProductIcon product={app} size="sm" /> : <div className="h-10 w-10 rounded-xl bg-surface-3" />}
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-foreground">{app?.name ?? "New app"}</div>
              <div className="mt-1 h-1.5 w-2/3 rounded-full bg-surface-3" />
            </div>
          </div>
        ))}
        <div className="h-1.5 w-full rounded-full bg-surface-3">
          <div className="h-1.5 w-1/2 rounded-full bg-accent" />
        </div>
      </div>

      {/* Status chip */}
      <div className="animate-float absolute bottom-[8%] right-[10%] flex items-center gap-2 rounded-xl border border-white/10 bg-surface/95 px-3.5 py-2.5 text-xs font-medium text-foreground shadow-[0_20px_50px_-25px_rgba(0,0,0,0.9)]" style={{ animationDelay: "3s" }}>
        <span className="h-2 w-2 rounded-full bg-success" />
        Published on Google Play
      </div>
    </div>
  );
}
