import Link from "next/link";
import Image from "next/image";
import type { BrandConfiguration } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Renders the studio logo from the brand configuration. If `brand.logo` (a full
 * lockup image) is set it is used as-is; otherwise the square mark is paired
 * with a typographic wordmark so the name always stays crisp.
 */
export function BrandLogo({ brand, className, markSize = 36, priority = false }: { brand: BrandConfiguration; className?: string; markSize?: number; priority?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5 rounded-lg", className)} aria-label={`${brand.name} - home`}>
      {brand.logo ? (
        <Image src={brand.logo} alt={brand.name} width={markSize * 4} height={markSize} priority={priority} unoptimized={brand.logo.endsWith(".svg")} className="h-9 w-auto" />
      ) : (
        <>
          <Image src={brand.logoMark} alt="" width={markSize} height={markSize} priority={priority} unoptimized={brand.logoMark.endsWith(".svg")} className="rounded-[22%]" style={{ width: markSize, height: markSize }} />
          <span className="font-display text-[1.05rem] font-semibold tracking-tight text-foreground">{brand.name}</span>
        </>
      )}
    </Link>
  );
}
