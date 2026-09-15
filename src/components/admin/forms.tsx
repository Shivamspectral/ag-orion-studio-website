"use client";

import { useActionState, useMemo, useState, type ReactNode } from "react";
import type { AdConfiguration, AdConfigurationSet, AdSellerRecord, Product, SiteSettings } from "@/content/types";
import { AD_VERIFICATION_STATUSES, PLATFORMS, RELEASE_STATUSES } from "@/content/types";
import { formatRecordLine, validateRecord } from "@/lib/ads";
import { loginAction, saveAdConfigurationAction, saveProductAction, saveSiteSettingsAction, type ActionState } from "@/lib/actions/admin";
import { Button, Icon, Notice } from "@/components/ui";

const idle: ActionState = { ok: false, message: "" };

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={className}>
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint block">{hint}</span>}
    </label>
  );
}

export function Fieldset({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <fieldset className="surface-card p-5 sm:p-6">
      <legend className="sr-only">{title}</legend>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Feedback({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return <Notice tone={state.ok ? "success" : "danger"}>{state.message}</Notice>;
}

function Checkbox({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-foreground">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 rounded border-border-strong bg-surface-2 accent-[var(--accent)]" />
      {label}
    </label>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
    >
      <Icon name={copied ? "check" : "copy"} className="h-4 w-4" />
      {copied ? "Copied" : label}
    </Button>
  );
}

export function DownloadButton({ text, filename }: { text: string; filename: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      }}
    >
      <Icon name="download" className="h-4 w-4" />
      Download
    </Button>
  );
}

const pretty = (value: unknown) => JSON.stringify(value ?? [], null, 2);

/* ------------------------------------------------------------------ */
/* Login                                                               */
/* ------------------------------------------------------------------ */

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, idle);
  return (
    <form action={action} className="space-y-4">
      <Feedback state={state} />
      <Field label="Administrator password">
        <input name="password" type="password" autoComplete="current-password" required className="field" />
      </Field>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Site settings                                                       */
/* ------------------------------------------------------------------ */

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState(saveSiteSettingsAction, idle);
  const { brand, seo, hero, about, contact } = settings;
  const text = (name: string, value: string | undefined, extra?: { type?: string; hint?: string; label?: string }) => (
    <Field key={name} label={extra?.label ?? name.split(".").pop()!.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())} hint={extra?.hint}>
      <input name={name} type={extra?.type ?? "text"} defaultValue={value ?? ""} className="field" />
    </Field>
  );

  return (
    <form action={action} className="space-y-6">
      <Feedback state={state} />

      <Fieldset title="Brand" description="Replace logo, icons and Open Graph image by uploading files to /public and updating the paths here.">
        {text("brand.name", brand.name, { label: "Studio name" })}
        {text("brand.shortName", brand.shortName, { label: "Short name (manifest)" })}
        {text("brand.tagline", brand.tagline, { label: "Tagline" })}
        <Field label="Description" className="sm:col-span-2">
          <textarea name="brand.description" rows={3} defaultValue={brand.description} className="field" />
        </Field>
        {text("brand.logo", brand.logo, { label: "Full logo (optional)", hint: "Image with wordmark. Leave empty to use mark + text." })}
        {text("brand.logoMark", brand.logoMark, { label: "Logo mark (square)" })}
        {text("brand.logoDark", brand.logoDark, { label: "Logo for dark backgrounds (optional)" })}
        {text("brand.logoLight", brand.logoLight, { label: "Logo for light backgrounds (optional)" })}
        {text("brand.favicon", brand.favicon, { label: "Favicon (SVG)" })}
        {text("brand.favicon32", brand.favicon32, { label: "Favicon 32×32 (PNG)" })}
        {text("brand.appleTouchIcon", brand.appleTouchIcon, { label: "Apple touch icon 180×180" })}
        {text("brand.icon192", brand.icon192, { label: "Manifest icon 192×192" })}
        {text("brand.icon512", brand.icon512, { label: "Manifest icon 512×512" })}
        {text("brand.icon512Maskable", brand.icon512Maskable, { label: "Maskable icon 512×512" })}
        {text("brand.ogImage", brand.ogImage, { label: "Default social preview image (1200×630)" })}
        <div className="grid grid-cols-3 gap-3 sm:col-span-2">
          {(["accentColor", "themeColor", "backgroundColor"] as const).map((key) => (
            <Field key={key} label={key === "accentColor" ? "Accent" : key === "themeColor" ? "Theme color" : "Background"}>
              <div className="flex items-center gap-2">
                <input type="color" defaultValue={brand[key]} onChange={(event) => ((event.currentTarget.nextElementSibling as HTMLInputElement).value = event.currentTarget.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-border bg-surface-2" aria-label={`${key} picker`} />
                <input name={`brand.${key}`} defaultValue={brand[key]} pattern="^#[0-9a-fA-F]{6}$" className="field font-mono" />
              </div>
            </Field>
          ))}
        </div>
      </Fieldset>

      <Fieldset title="SEO defaults">
        {text("seo.defaultTitle", seo.defaultTitle, { label: "Default title" })}
        {text("seo.titleTemplate", seo.titleTemplate, { label: "Title template", hint: "%s is replaced with the page title." })}
        <Field label="Default description" className="sm:col-span-2">
          <textarea name="seo.defaultDescription" rows={3} defaultValue={seo.defaultDescription} className="field" />
        </Field>
        {text("seo.twitterHandle", seo.twitterHandle, { label: "X / Twitter handle (optional)", hint: "Only if an official account exists." })}
        {text("seo.locale", seo.locale, { label: "Open Graph locale" })}
      </Fieldset>

      <Fieldset title="Homepage hero">
        {text("hero.eyebrow", hero.eyebrow, { label: "Eyebrow" })}
        {text("hero.heading", hero.heading, { label: "Heading" })}
        <Field label="Supporting text" className="sm:col-span-2">
          <textarea name="hero.subheading" rows={3} defaultValue={hero.subheading} className="field" />
        </Field>
        {text("hero.primaryCta.label", hero.primaryCta.label, { label: "Primary button label" })}
        {text("hero.primaryCta.href", hero.primaryCta.href, { label: "Primary button link" })}
        {text("hero.secondaryCta.label", hero.secondaryCta.label, { label: "Secondary button label" })}
        {text("hero.secondaryCta.href", hero.secondaryCta.href, { label: "Secondary button link" })}
        <Field label="Why us (JSON)" hint='Array of { "title", "description", "icon": "code" | "users" | "phone" | "refresh" }' className="sm:col-span-2">
          <textarea name="whyUs" rows={10} defaultValue={pretty(settings.whyUs)} className="field font-mono text-xs" />
        </Field>
      </Fieldset>

      <Fieldset title="About">
        <Field label="Intro" className="sm:col-span-2">
          <textarea name="about.intro" rows={2} defaultValue={about.intro} className="field" />
        </Field>
        <Field label="Paragraphs" hint="Separate paragraphs with a blank line." className="sm:col-span-2">
          <textarea name="about.paragraphs" rows={8} defaultValue={about.paragraphs.join("\n\n")} className="field" />
        </Field>
        <Field label="Principles (JSON)" hint='Array of { "title", "description" }' className="sm:col-span-2">
          <textarea name="about.principles" rows={8} defaultValue={pretty(about.principles)} className="field font-mono text-xs" />
        </Field>
        {text("about.image", about.image, { label: "Studio image" })}
        {text("about.imageAlt", about.imageAlt, { label: "Studio image alt text" })}
      </Fieldset>

      <Fieldset title="Contact" description="Leave an email empty to route that topic through the contact form only.">
        {contact.channels.map((channel) => (
          <div key={channel.id} className="grid gap-3 rounded-xl border border-border p-4 sm:col-span-2 sm:grid-cols-3">
            {text(`contact.${channel.id}.title`, channel.title, { label: `${channel.id} - title` })}
            {text(`contact.${channel.id}.email`, channel.email, { label: "Email", type: "email" })}
            {text(`contact.${channel.id}.description`, channel.description, { label: "Description" })}
          </div>
        ))}
        {text("contact.location", contact.location, { label: "Location line (optional)" })}
        {text("contact.responseNote", contact.responseNote, { label: "Response note" })}
        <Field label="Social links (JSON)" hint='Array of { "platform", "url" }. Only add profiles that exist.' className="sm:col-span-2">
          <textarea name="social" rows={5} defaultValue={pretty(settings.social)} className="field font-mono text-xs" />
        </Field>
      </Fieldset>

      <Fieldset title="Website advertising (ads.txt)" description="Only for ads shown on this website. App inventory is managed under Advertising.">
        <div className="sm:col-span-2">
          <Checkbox name="siteAds.enabled" label="Serve /ads.txt for this website" defaultChecked={settings.siteAds.enabled} />
        </div>
        <Field label="Records" hint="One per line: domain, publisher-id, DIRECT|RESELLER, certification-id" className="sm:col-span-2">
          <textarea name="siteAds.records" rows={4} defaultValue={settings.siteAds.records.map(formatRecordLine).join("\n")} className="field font-mono text-xs" />
        </Field>
        {text("siteAds.lastUpdated", settings.siteAds.lastUpdated, { label: "Last updated", type: "date" })}
      </Fieldset>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save settings"}
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Product editor                                                      */
/* ------------------------------------------------------------------ */

export function ProductForm({ product, isNew }: { product?: Product; isNew: boolean }) {
  const [state, action, pending] = useActionState(saveProductAction, idle);
  const [type, setType] = useState<Product["type"]>(product?.type ?? "app");
  const play = product?.storeLinks.find((link) => link.store === "Google Play")?.url ?? "";
  const otherLinks = product?.storeLinks.filter((link) => link.store !== "Google Play") ?? [];
  const input = (name: string, value: string | number | undefined, label: string, extra?: { hint?: string; type?: string; required?: boolean; span?: boolean }) => (
    <Field label={label} hint={extra?.hint} className={extra?.span ? "sm:col-span-2" : undefined}>
      <input name={name} type={extra?.type ?? "text"} defaultValue={value ?? ""} required={extra?.required} className="field" />
    </Field>
  );

  return (
    <form action={action} className="space-y-6">
      <Feedback state={state} />
      <input type="hidden" name="originalSlug" value={product?.slug ?? ""} />

      <Fieldset title="Identity">
        {input("name", product?.name, "Name", { required: true })}
        {input("slug", product?.slug, "Slug", { required: true, hint: "Lowercase, stable URL segment. Do not change after publishing." })}
        <Field label="Type">
          <select name="type" value={type} onChange={(event) => setType(event.target.value as Product["type"])} className="field">
            <option value="app">App</option>
            <option value="game">Game</option>
          </select>
        </Field>
        {input("category", product?.category, type === "game" ? "Primary genre / category" : "Category", { required: true })}
        {input("genres", product?.genres.join(", "), "Genres (comma separated)", { hint: "Mostly for games, e.g. Open World, Driving, Simulation" })}
        <Field label="Status">
          <select name="status" defaultValue={product?.status ?? "In Development"} className="field">
            {RELEASE_STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </Field>
        <div className="flex flex-wrap gap-4 sm:col-span-2">
          {PLATFORMS.map((platform) => (
            <label key={platform} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="platforms" value={platform} defaultChecked={product ? product.platforms.includes(platform) : platform === "Android"} className="h-4 w-4 accent-[var(--accent)]" />
              {platform}
            </label>
          ))}
        </div>
        <div className="flex flex-wrap gap-6 sm:col-span-2">
          <Checkbox name="featured" label="Featured on homepage" defaultChecked={product?.featured ?? true} />
          <Field label="Visibility">
            <select name="visibility" defaultValue={product?.visibility ?? "draft"} className="field">
              <option value="public">Public</option>
              <option value="draft">Draft (hidden)</option>
            </select>
          </Field>
          {input("sortOrder", product?.sortOrder, "Sort order", { type: "number" })}
        </div>
      </Fieldset>

      <Fieldset title="Copy">
        {input("tagline", product?.tagline, "Tagline", { span: true })}
        <Field label="Short description (cards, meta fallback)" className="sm:col-span-2">
          <textarea name="shortDescription" rows={2} defaultValue={product?.shortDescription} required className="field" />
        </Field>
        <Field label="About paragraphs" hint="Separate paragraphs with a blank line." className="sm:col-span-2">
          <textarea name="description" rows={7} defaultValue={product?.description.join("\n\n")} className="field" />
        </Field>
        <Field label="Features" hint="One per line." className="sm:col-span-2">
          <textarea name="features" rows={6} defaultValue={product?.features.join("\n")} className="field" />
        </Field>
        <Field label={type === "game" ? "Gameplay paragraphs" : "How it works paragraphs"} hint="Separate paragraphs with a blank line." className="sm:col-span-2">
          <textarea name="gameplay" rows={5} defaultValue={product?.gameplay?.join("\n\n")} className="field" />
        </Field>
      </Fieldset>

      <Fieldset title="Artwork" description="Upload files to /public/images/... and reference them here.">
        {input("icon", product?.icon, "Icon (square)", { required: true })}
        {input("heroImage", product?.heroImage, "Hero image (16:9)")}
        {input("coverImage", product?.coverImage, "Cover image (optional)")}
        <Field label="Screenshots (JSON)" hint='Array of { "src", "alt", "caption" }' className="sm:col-span-2">
          <textarea name="screenshots" rows={8} defaultValue={pretty(product?.screenshots)} className="field font-mono text-xs" />
        </Field>
      </Fieldset>

      <Fieldset title="Distribution & releases">
        {input("googlePlayUrl", play, "Google Play URL", { type: "url", span: true })}
        <Field label="Other store links (JSON)" hint='Array of { "store", "url", "label" }' className="sm:col-span-2">
          <textarea name="storeLinks" rows={4} defaultValue={pretty(otherLinks)} className="field font-mono text-xs" />
        </Field>
        {input("packageName", product?.packageName, "Package name")}
        {input("version", product?.version, "Current version (if no release list)")}
        {input("releaseDate", product?.releaseDate, "First release date", { type: "date" })}
        <Field label="Releases (JSON)" hint='Array of { "version", "date": "YYYY-MM-DD", "notes": [] } - newest is shown as current.' className="sm:col-span-2">
          <textarea name="releases" rows={8} defaultValue={pretty(product?.releases)} className="field font-mono text-xs" />
        </Field>
        <Field label="System requirements (JSON)" hint='Array of { "label", "value" }' className="sm:col-span-2">
          <textarea name="requirements" rows={5} defaultValue={pretty(product?.requirements)} className="field font-mono text-xs" />
        </Field>
        {input("privacyUrl", product?.privacyUrl, "Privacy policy URL", { hint: "Defaults to /privacy/" })}
        {input("supportUrl", product?.supportUrl, "Support URL", { hint: "Defaults to /contact/#support" })}
      </Fieldset>

      <Fieldset title="SEO & social">
        {input("seo.title", product?.seo.title, "Title", { hint: "Without the studio suffix; it is added automatically." })}
        {input("seo.ogImage", product?.seo.ogImage, "Social preview image", { hint: "Defaults to the hero image." })}
        <Field label="Meta description" className="sm:col-span-2">
          <textarea name="seo.description" rows={3} defaultValue={product?.seo.description} className="field" />
        </Field>
        <div className="sm:col-span-2">
          <Checkbox name="seo.noindex" label="Hide from search engines (noindex)" defaultChecked={product?.seo.noindex} />
        </div>
      </Fieldset>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : isNew ? "Create product" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Advertising editor                                                  */
/* ------------------------------------------------------------------ */

function setToLines(set: AdConfigurationSet): string {
  return set.records
    .map((record) => {
      const parts = [record.adSystemDomain, record.publisherId, record.relationship, record.certificationAuthorityId ?? ""].map((part) => part ?? "");
      while (parts.length > 3 && !parts[parts.length - 1]) parts.pop();
      return `${parts.join(", ")}${record.comment ? ` # ${record.comment}` : ""}`;
    })
    .join("\n");
}

function parseLines(raw: string): AdSellerRecord[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [dataPart, ...rest] = line.split("#");
      const [adSystemDomain = "", publisherId = "", relationship = "", certificationAuthorityId = ""] = dataPart.split(",").map((part) => part.trim());
      return { adSystemDomain, publisherId, relationship: relationship.toUpperCase() === "RESELLER" ? "RESELLER" : "DIRECT", certificationAuthorityId: certificationAuthorityId || undefined, comment: rest.join("#").trim() || undefined } as AdSellerRecord;
    });
}

function RecordSetEditor({ prefix, title, description, set }: { prefix: "production" | "draft"; title: string; description: string; set: AdConfigurationSet }) {
  const [raw, setRaw] = useState(setToLines(set));
  const parsed = useMemo(() => parseLines(raw).map((record) => ({ record, validation: validateRecord(record) })), [raw]);
  const valid = parsed.filter((entry) => entry.validation.valid).map((entry) => formatRecordLine(entry.record));
  const preview = valid.length ? `${valid.join("\n")}\n` : "";

  return (
    <fieldset className={`surface-card p-5 sm:p-6 ${prefix === "production" ? "border-success/30" : "border-warning/30"}`}>
      <legend className="sr-only">{title}</legend>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${prefix === "production" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>{prefix === "production" ? "PRODUCTION - published" : "DRAFT - not published"}</span>
      </div>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Field label="Seller records" hint="One per line: domain, publisher-id, DIRECT|RESELLER, certification-id  # optional comment">
          <textarea name={`${prefix}.records`} rows={6} value={raw} onChange={(event) => setRaw(event.target.value)} spellCheck={false} className="field font-mono text-xs" />
        </Field>
        <div>
          <p className="field-label">Validation</p>
          {parsed.length === 0 ? (
            <p className="text-sm text-muted-2">No records.</p>
          ) : (
            <ul className="space-y-1.5 text-xs">
              {parsed.map(({ record, validation }, index) => (
                <li key={`${index}-${record.adSystemDomain}`} className={`flex items-start gap-2 rounded-lg border px-2.5 py-2 ${validation.valid ? "border-success/30 text-success" : "border-danger/30 text-danger"}`}>
                  <Icon name={validation.valid ? "check" : "alert"} className="mt-0.5 h-3.5 w-3.5" />
                  <span className="font-mono break-all">
                    {record.adSystemDomain || "?"}, {record.publisherId || "(missing id)"}, {record.relationship}
                    {validation.errors.length > 0 && <span className="block font-sans text-[11px] opacity-90">{validation.errors.join(" ")}</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex items-center justify-between gap-2">
            <p className="field-label mb-0">Raw preview ({valid.length} valid)</p>
            <div className="flex gap-2">
              <CopyButton text={preview} />
              <DownloadButton text={preview} filename={`${prefix}-app-ads.txt`} />
            </div>
          </div>
          <pre className="mt-2 min-h-16 overflow-x-auto rounded-lg border border-border bg-background p-3 font-mono text-xs text-muted">{preview || "# no valid records"}</pre>
        </div>
        <Field label="Last updated">
          <input type="date" name={`${prefix}.lastUpdated`} defaultValue={set.lastUpdated} className="field" />
        </Field>
        <Field label="Verification status">
          <select name={`${prefix}.verificationStatus`} defaultValue={set.verificationStatus} className="field">
            {AD_VERIFICATION_STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </Field>
        <Field label="Internal notes" className="lg:col-span-2">
          <input name={`${prefix}.notes`} defaultValue={set.notes ?? ""} className="field" />
        </Field>
      </div>
    </fieldset>
  );
}

export function AdConfigForm({ config, productName, packageName }: { config: AdConfiguration; productName: string; packageName?: string }) {
  const [state, action, pending] = useActionState(saveAdConfigurationAction, idle);
  return (
    <form action={action} className="space-y-6">
      <Feedback state={state} />
      <input type="hidden" name="productSlug" value={config.productSlug} />
      <Fieldset title="App" description="Which product this configuration belongs to and which network(s) it uses.">
        <Field label="App name">
          <input value={productName} readOnly className="field opacity-70" />
        </Field>
        <Field label="Package name">
          <input value={packageName ?? "Not set on the product"} readOnly className="field font-mono opacity-70" />
        </Field>
        <Field label="Advertising provider" hint="e.g. Google AdMob, Unity Ads, AppLovin MAX">
          <input name="provider" defaultValue={config.provider} className="field" />
        </Field>
        <div className="flex items-end pb-2">
          <Checkbox name="enabled" label="This app serves ads (include in /app-ads.txt)" defaultChecked={config.enabled} />
        </div>
      </Fieldset>
      <RecordSetEditor prefix="production" title="Production configuration" description="Exactly what is served in the root /app-ads.txt file. Only valid records are ever written." set={config.production} />
      <RecordSetEditor prefix="draft" title="Draft configuration" description="Work in progress. Never served publicly until promoted to production." set={config.draft} />
      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save configuration"}
        </Button>
      </div>
    </form>
  );
}
