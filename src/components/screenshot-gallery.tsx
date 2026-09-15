import Image from "next/image";
import type { Screenshot } from "@/content/types";

/** Horizontal scroll-snap gallery. No JavaScript, keyboard scrollable, lazy images. */
export function ScreenshotGallery({ screenshots, productName }: { screenshots: Screenshot[]; productName: string }) {
  if (screenshots.length === 0) return null;
  return (
    <div className="-mx-4 sm:-mx-6 lg:mx-0">
      <ul
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6 lg:px-0"
        aria-label={`${productName} screenshots`}
        tabIndex={0}
      >
        {screenshots.map((shot, index) => (
          <li key={shot.src} className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-[48%]">
            <figure className="overflow-hidden rounded-2xl border border-border bg-surface-3 shadow-card">
              <div className="relative aspect-[16/9]">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, (min-width: 640px) 60vw, 85vw"
                  loading={index === 0 ? "eager" : "lazy"}
                  className="object-cover"
                />
              </div>
              {shot.caption && <figcaption className="px-4 py-3 text-sm text-muted">{shot.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
