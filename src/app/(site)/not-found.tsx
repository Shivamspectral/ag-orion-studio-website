import type { Metadata } from "next";
import { NotFoundContent } from "@/components/not-found-content";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/** Handles notFound() for unknown app/game slugs inside the public site layout. */
export default function SiteNotFound() {
  return (
    <div className="flex flex-1 items-center">
      <NotFoundContent />
    </div>
  );
}
