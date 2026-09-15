import type { AdConfiguration, AdConfigurationSet, AdSellerRecord, SiteAdsConfiguration } from "@/content/types";

/**
 * ads.txt / app-ads.txt generation and validation.
 *
 * Only complete, valid records are ever emitted. Comments are prefixed with `#`
 * as allowed by the IAB specification; everything else is a data record or a
 * supported variable (CONTACT=).
 */

const DOMAIN_PATTERN = /^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;
const ID_PATTERN = /^[A-Za-z0-9._:-]+$/;
const CA_PATTERN = /^[A-Za-z0-9]+$/;

export interface RecordValidation {
  valid: boolean;
  errors: string[];
}

export function validateRecord(record: AdSellerRecord): RecordValidation {
  const errors: string[] = [];

  if (!record.adSystemDomain?.trim()) {
    errors.push("Ad system domain is required.");
  } else if (!DOMAIN_PATTERN.test(record.adSystemDomain.trim())) {
    errors.push("Ad system domain is not a valid hostname.");
  }

  if (!record.publisherId?.trim()) {
    errors.push("Publisher ID has not been entered.");
  } else if (!ID_PATTERN.test(record.publisherId.trim())) {
    errors.push("Publisher ID contains invalid characters.");
  }

  if (record.relationship !== "DIRECT" && record.relationship !== "RESELLER") {
    errors.push("Relationship must be DIRECT or RESELLER.");
  }

  if (record.certificationAuthorityId && !CA_PATTERN.test(record.certificationAuthorityId.trim())) {
    errors.push("Certification authority ID must be alphanumeric.");
  }

  return { valid: errors.length === 0, errors };
}

export function formatRecordLine(record: AdSellerRecord): string {
  const parts = [
    record.adSystemDomain.trim().toLowerCase(),
    record.publisherId.trim(),
    record.relationship,
  ];

  if (record.certificationAuthorityId?.trim()) {
    parts.push(record.certificationAuthorityId.trim());
  }

  return parts.join(", ");
}

function sanitizeComment(text: string): string {
  return text.replace(/[\r\n]+/g, " ").trim();
}

interface FileOptions {
  siteUrl: string;
  contactEmail?: string;
  studioName: string;
}

function header(
  kind: "ads.txt" | "app-ads.txt",
  options: FileOptions,
): string[] {
  const lines = [
    `# ${kind} for ${sanitizeComment(options.studioName)}`,
  ];

  if (options.contactEmail?.trim()) {
    lines.push(`CONTACT=${options.contactEmail.trim()}`);
  }

  return lines;
}

/**
 * Root /app-ads.txt: union of all production records across all ad-enabled apps.
 */
export function generateAppAdsTxt(
  configs: AdConfiguration[],
  productNames: Record<string, string>,
  options: FileOptions,
): string {
  const lines = header("app-ads.txt", options);
  const seen = new Set<string>();
  let total = 0;

  for (const config of configs) {
    if (!config.enabled) continue;

    const valid = config.production.records.filter(
      (record) => validateRecord(record).valid,
    );

    if (valid.length === 0) continue;

    lines.push(
      "",
      `# ${sanitizeComment(
        productNames[config.productSlug] ?? config.productSlug,
      )}`,
    );

    for (const record of valid) {
      const line = formatRecordLine(record);

      if (seen.has(line.toLowerCase())) continue;

      seen.add(line.toLowerCase());
      lines.push(line);
      total += 1;
    }
  }

  if (total === 0) {
    lines.push(
      "",
      "# No authorized sellers have been published yet.",
    );
  }

  return `${lines.join("\n")}\n`;
}

/**
 * Website /ads.txt.
 * Returns null when website advertising is disabled or has no valid records.
 */
export function generateAdsTxt(
  siteAds: SiteAdsConfiguration,
  options: FileOptions,
): string | null {
  if (!siteAds.enabled) return null;

  const valid = siteAds.records.filter(
    (record) => validateRecord(record).valid,
  );

  if (valid.length === 0) return null;

  const lines = header("ads.txt", options);

  lines.push("");

  const seen = new Set<string>();

  for (const record of valid) {
    const line = formatRecordLine(record);

    if (seen.has(line.toLowerCase())) continue;

    seen.add(line.toLowerCase());
    lines.push(line);
  }

  return `${lines.join("\n")}\n`;
}

/**
 * Preview of a single app's records
 * (used by the admin and the per-app info page).
 */
export function previewSetLines(set: AdConfigurationSet): string {
  const valid = set.records
    .filter((record) => validateRecord(record).valid)
    .map(formatRecordLine);

  return valid.length > 0 ? `${valid.join("\n")}\n` : "";
}

export type AdsStatus =
  | "Live"
  | "Needs configuration"
  | "Ads disabled";

export function getAdsStatus(
  config: AdConfiguration | null,
): AdsStatus {
  if (!config || !config.enabled) {
    return "Ads disabled";
  }

  return config.production.records.some(
    (record) => validateRecord(record).valid,
  )
    ? "Live"
    : "Needs configuration";
}

export function summarizeSet(set: AdConfigurationSet) {
  const validations = set.records.map((record) => ({
    record,
    validation: validateRecord(record),
  }));

  return {
    validations,
    validCount: validations.filter(
      (entry) => entry.validation.valid,
    ).length,
    invalidCount: validations.filter(
      (entry) => !entry.validation.valid,
    ).length,
  };
}