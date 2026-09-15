import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn, isExternalUrl, isFileLikePath, normalizePath } from "@/lib/utils";
import type { ReleaseStatus } from "@/content/types";

/* ------------------------------------------------------------------ */
/* Icons (inline SVG keeps the bundle free of icon libraries)          */
/* ------------------------------------------------------------------ */

export type IconName =
  | "arrow-right"
  | "external"
  | "play"
  | "menu"
  | "close"
  | "mail"
  | "check"
  | "code"
  | "users"
  | "phone"
  | "refresh"
  | "copy"
  | "download"
  | "chevron-right"
  | "shield"
  | "sparkle"
  | "alert"
  | "info";

const paths: Record<IconName, ReactNode> = {
  "arrow-right": <path d="M5 12h14m-6-6 6 6-6 6" />,
  external: <path d="M14 4h6v6m0-6L10 14M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />,
  play: (
    <path
      fill="currentColor"
      stroke="none"
      d="M4 3.6v16.8c0 .5.5.8.9.6l14.4-8.4a.7.7 0 0 0 0-1.2L4.9 3c-.4-.2-.9.1-.9.6Zm2 2.2L14.6 12 6 18.2V5.8Z"
    />
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  mail: <path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm0 1 8 6 8-6" />,
  check: <path d="m5 12 5 5L20 7" />,
  code: <path d="m8 8-4 4 4 4m8-8 4 4-4 4m-2-12-4 16" />,
  users: <path d="M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1m18 0v-1a4 4 0 0 0-3-3.9M15 3.1a4 4 0 0 1 0 7.8M13.5 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />,
  phone: <path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm3 17h2" />,
  refresh: <path d="M20 12a8 8 0 0 1-14.9 4M4 12a8 8 0 0 1 14.9-4M20 4v4h-4M4 20v-4h4" />,
  copy: <path d="M9 9h10v10H9zM5 15V5h10" />,
  download: <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  shield: <path d="M12 3 5 6v5c0 4.5 3 8.4 7 10 4-1.6 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-4" />,
  sparkle: <path d="M12 3v4m0 10v4m9-9h-4M7 12H3m14.5-6.5-3 3m-5 5-3 3m11 0-3-3m-5-5-3-3" />,
  alert: <path d="M12 9v4m0 4h.01M10.3 3.9 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />,
  info: <path d="M12 8h.01M11 12h1v4h1m8-4a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
};

export function Icon({ name, className, ...props }: { name: IconName } & ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("h-5 w-5 shrink-0", className)}
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[var(--accent-fill)] text-white shadow-[0_8px_24px_-12px_var(--accent-glow)] hover:bg-accent",
  secondary: "bg-surface-3 text-foreground border border-border-strong hover:bg-surface-2 hover:border-accent/50",
  outline: "border border-border-strong text-foreground hover:border-accent hover:text-accent-strong",
  ghost: "text-muted hover:text-foreground hover:bg-surface-3",
  danger: "bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

type ButtonProps = ButtonBaseProps &
  (
    | ({ href: string } & Omit<ComponentPropsWithoutRef<"a">, "href" | "children">)
    | ({ href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "children">)
  );

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-xl font-semibold transition-colors duration-200 select-none whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (props.href !== undefined) {
    const { href, ...anchorProps } = props;
    if (isExternalUrl(href)) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...anchorProps}>
          {children}
        </a>
      );
    }
    if (isFileLikePath(href)) {
      return (
        <a href={href} className={classes} {...anchorProps}>
          {children}
        </a>
      );
    }
    return (
      <Link href={normalizePath(href)} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = props;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Badges                                                              */
/* ------------------------------------------------------------------ */

export function Badge({ children, className, tone = "neutral" }: { children: ReactNode; className?: string; tone?: "neutral" | "accent" | "success" | "warning" | "danger" }) {
  const tones = {
    neutral: "border-border-strong bg-surface-3 text-muted",
    accent: "border-accent/40 bg-accent-soft text-accent-strong",
    success: "border-success/30 bg-success/10 text-success",
    warning: "border-warning/30 bg-warning/10 text-warning",
    danger: "border-danger/30 bg-danger/10 text-danger",
  } as const;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", tones[tone], className)}>
      {children}
    </span>
  );
}

const statusTone: Record<ReleaseStatus, "success" | "accent" | "warning" | "neutral" | "danger"> = {
  Published: "success",
  Testing: "accent",
  "In Development": "warning",
  "Coming Soon": "accent",
  Discontinued: "danger",
};

export function StatusBadge({ status, className }: { status: ReleaseStatus; className?: string }) {
  return (
    <Badge tone={statusTone[status]} className={className}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/* Layout helpers                                                      */
/* ------------------------------------------------------------------ */

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("mb-10 flex flex-col gap-4 sm:mb-12", align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between")}>
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <Heading className={cn("font-semibold text-foreground", Heading === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl")}>{title}</Heading>
        {description && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  topSlot,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  topSlot?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-x relative py-14 sm:py-18 lg:py-22">
        <div className="max-w-3xl">
          {topSlot && <div className="mb-8">{topSlot}</div>}
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="text-4xl font-semibold text-foreground sm:text-5xl lg:text-6xl">{title}</h1>
          {description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{description}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}

export function EmptyState({ title, description, action, icon = "sparkle" }: { title: string; description: string; action?: ReactNode; icon?: IconName }) {
  return (
    <div className="surface-card flex flex-col items-center px-6 py-16 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border-strong bg-surface-3 text-accent-strong">
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Notice({ tone = "info", title, children }: { tone?: "info" | "warning" | "success" | "danger"; title?: string; children: ReactNode }) {
  const tones = {
    info: "border-accent/30 bg-accent-soft text-foreground",
    warning: "border-warning/30 bg-warning/10 text-foreground",
    success: "border-success/30 bg-success/10 text-foreground",
    danger: "border-danger/30 bg-danger/10 text-foreground",
  } as const;
  const icons: Record<typeof tone, IconName> = { info: "info", warning: "alert", success: "check", danger: "alert" };
  return (
    <div role={tone === "danger" || tone === "warning" ? "alert" : "status"} className={cn("flex gap-3 rounded-xl border p-4 text-sm", tones[tone])}>
      <Icon name={icons[tone]} className="mt-0.5 h-4.5 w-4.5 shrink-0" />
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        <div className={cn(title && "mt-1", "text-muted [&_a]:text-accent-strong [&_a]:underline")}>{children}</div>
      </div>
    </div>
  );
}
