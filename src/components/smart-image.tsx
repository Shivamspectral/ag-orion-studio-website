"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SmartImageProps extends Omit<ImageProps, "src" | "alt" | "onError"> {
  src?: string;
  alt: string;
  /** Rendered when the source is missing or fails to load. */
  fallback: React.ReactNode;
  wrapperClassName?: string;
}

/**
 * next/image with a graceful fallback. SVG sources bypass the optimizer, which
 * keeps vector icons crisp and avoids the SVG optimization restriction.
 */
export function SmartImage({ src, alt, fallback, wrapperClassName, className, ...props }: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <div className={cn("flex items-center justify-center", wrapperClassName)}>{fallback}</div>;
  }
  const isSvg = src.toLowerCase().endsWith(".svg");
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      unoptimized={isSvg || props.unoptimized}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
