import type { AdConfiguration } from "./types";

/**
 * Per-app advertising authorization (app-ads.txt) configuration.
 *
 * IMPORTANT: publisher IDs are intentionally left EMPTY. Records with an empty
 * publisherId are never written to /app-ads.txt and are shown as
 * "needs configuration" in the admin and on /<slug>/ads-txt/.
 *
 * For Google AdMob the line format is:
 *   google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
 * where "f08c47fec0942fa0" is Google's public certification authority (TAG) ID
 * and pub-XXXXXXXXXXXXXXXX is YOUR publisher ID from the AdMob console.
 *
 * Each app has its own configuration so different apps can use different
 * networks. The root /app-ads.txt is generated from all production sets.
 */
export const adConfigurations: AdConfiguration[] = [
  {
    productSlug: "indianopenworlddriving",
    enabled: true,
    provider: "Google AdMob",
    production: {
      records: [
        {
          adSystemDomain: "google.com",
          publisherId: "", // EDIT: pub-XXXXXXXXXXXXXXXX
          relationship: "DIRECT",
          certificationAuthorityId: "f08c47fec0942fa0",
          comment: "Google AdMob - primary network",
        },
      ],
      lastUpdated: "",
      verificationStatus: "Not Configured",
      notes: "Publisher ID has not been entered yet.",
    },
    draft: {
      records: [],
      lastUpdated: "",
      verificationStatus: "Not Configured",
    },
  },
  {
    productSlug: "businesskit",
    enabled: false,
    provider: "",
    production: { records: [], lastUpdated: "", verificationStatus: "Not Configured" },
    draft: { records: [], lastUpdated: "", verificationStatus: "Not Configured" },
  },
];
