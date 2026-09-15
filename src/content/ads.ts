import type { AdConfiguration } from "./types";

/**
 * Per-app advertising authorization (app-ads.txt) configuration.
 *
 * Indian Open World Driving uses Google AdMob.
 * The publisher ID below is the AdMob publisher ID associated with
 * this app and is published through the root /app-ads.txt endpoint.
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
          publisherId: "pub-4387421502552077",
          relationship: "DIRECT",
          certificationAuthorityId: "f08c47fec0942fa0",
          comment: "Google AdMob - primary network",
        },
      ],
      lastUpdated: "2026-09-16",
      verificationStatus: "Pending Verification",
      notes:
        "Google AdMob publisher configured for Indian Open World Driving. Awaiting AdMob verification.",
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
    production: {
      records: [],
      lastUpdated: "",
      verificationStatus: "Not Configured",
    },
    draft: {
      records: [],
      lastUpdated: "",
      verificationStatus: "Not Configured",
    },
  },
];