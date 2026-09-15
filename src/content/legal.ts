export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalDocument {
  slug: "privacy" | "terms";
  title: string;
  description: string;
  /** ISO date shown as "Last updated". */
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

/**
 * Editable legal content. These documents are written as a careful, general
 * baseline for an independent mobile studio. Review them (ideally with a
 * professional) and adjust anything that does not match how your products
 * actually work before relying on them.
 */
export const privacyPolicy: LegalDocument = {
  slug: "privacy",
  title: "Privacy Policy",
  description:
    "How AG Orion Studio handles information on this website and in the apps and games it publishes.",
  lastUpdated: "2026-01-01",
  intro:
    "This Privacy Policy explains what information AG Orion Studio (\"we\", \"us\") handles when you use this website and the mobile apps and games we publish, and the choices you have. We aim to collect as little as possible and to be clear about the rest.",
  sections: [
    {
      heading: "Who we are",
      paragraphs: [
        "AG Orion Studio is an independent developer and publisher of mobile apps and games. We are the data controller for information handled through this website and our products, unless a specific product states otherwise in its own store listing or in-app policy.",
      ],
    },
    {
      heading: "Information handled on this website",
      paragraphs: [
        "This website is a static, informational site. It does not require an account.",
      ],
      bullets: [
        "Contact form: if you send us a message, we store the name, email address, topic and message you provide so that we can reply. We also store a hashed (non-reversible) form of your IP address for a short period to prevent abuse.",
        "Server logs: our hosting provider may keep standard technical logs (such as IP address, browser type and requested pages) for security and reliability purposes.",
        "Analytics: if analytics are enabled, we use a privacy-conscious configuration to understand aggregate site traffic. Analytics data is not used to identify you personally.",
      ],
    },
    {
      heading: "Information handled in our apps and games",
      paragraphs: [
        "Our products are distributed through official app stores such as Google Play. The store listing of each product includes a Data safety section describing the data that product may collect or share; that section is kept up to date with each release.",
        "In general, our apps and games may rely on third-party services such as advertising networks, analytics providers and crash reporting tools. These services may process device information (for example device model, operating system version, advertising identifier, coarse location derived from IP address and app usage events) under their own privacy policies.",
        "You can reset or delete your advertising identifier and limit ad personalization in your device settings at any time.",
      ],
    },
    {
      heading: "How we use information",
      bullets: [
        "To respond to your messages and provide support.",
        "To operate, secure and improve this website and our products.",
        "To show and measure advertising in products that are supported by ads.",
        "To comply with legal obligations and store policies.",
      ],
    },
    {
      heading: "Sharing",
      paragraphs: [
        "We do not sell personal information. Information is shared only with service providers that help us operate our products and this website (such as hosting, analytics, advertising and crash-reporting providers), when required by law, or to protect our rights and users.",
      ],
    },
    {
      heading: "Children",
      paragraphs: [
        "Our products are intended for a general audience. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, contact us and we will delete it.",
      ],
    },
    {
      heading: "Retention and security",
      paragraphs: [
        "Contact messages are kept only as long as needed to handle your request and for a reasonable period afterwards. We use appropriate technical measures, including encrypted connections, to protect information in our care, but no method of transmission or storage is completely secure.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "Depending on where you live, you may have rights to access, correct, delete or restrict the use of your personal information, and to object to certain processing. To exercise these rights, use the contact page. We will respond within the time required by applicable law.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "We may update this policy as our products and the law evolve. The \"Last updated\" date at the top of this page reflects the most recent revision. Significant changes will be highlighted on this page.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [
        "Privacy questions and requests can be sent through the contact page. Please mention the app or game your request relates to so we can help faster.",
      ],
    },
  ],
};

export const termsOfUse: LegalDocument = {
  slug: "terms",
  title: "Terms of Use",
  description: "The terms that apply to this website and to the apps and games published by AG Orion Studio.",
  lastUpdated: "2026-01-01",
  intro:
    "These Terms of Use (\"Terms\") apply to your use of the AG Orion Studio website and, unless a product provides its own terms, to the apps and games we publish (together, the \"Services\"). By using the Services you agree to these Terms.",
  sections: [
    {
      heading: "Use of the website",
      paragraphs: [
        "You may browse this website for personal and business information purposes. You agree not to misuse the website, interfere with its operation, attempt to gain unauthorized access to any part of it, or use automated tools in a way that degrades the service for others.",
      ],
    },
    {
      heading: "Apps and games",
      paragraphs: [
        "Our apps and games are distributed through third-party stores such as Google Play. Your download and use of a product is also subject to the terms of the store it was obtained from. Subject to these Terms, we grant you a personal, non-exclusive, non-transferable, revocable licence to install and use our products on devices you own or control.",
      ],
      bullets: [
        "Do not copy, modify, reverse engineer, decompile or create derivative works of our products except where the law expressly permits it.",
        "Do not use cheats, exploits, automation or unauthorized third-party software that interferes with a product.",
        "Do not use our products in any way that is unlawful or that harms other users.",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        "The Services, including software, artwork, names, logos, text and audio, are owned by AG Orion Studio or its licensors and are protected by copyright, trademark and other laws. Nothing in these Terms transfers any ownership to you. Third-party trademarks, including Google Play and the Google Play logo, belong to their respective owners.",
      ],
    },
    {
      heading: "Advertising and third-party services",
      paragraphs: [
        "Some products are supported by advertising or integrate third-party services. Those services are provided by independent companies under their own terms and privacy policies, and we are not responsible for their content or practices.",
      ],
    },
    {
      heading: "Updates and availability",
      paragraphs: [
        "We may update, change or discontinue any product or feature at any time. Updates may be required to continue using a product. We do not guarantee that any product will be available on every device or in every region.",
      ],
    },
    {
      heading: "Disclaimer of warranties",
      paragraphs: [
        "The Services are provided \"as is\" and \"as available\" without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose and non-infringement, to the fullest extent permitted by law.",
      ],
    },
    {
      heading: "Limitation of liability",
      paragraphs: [
        "To the fullest extent permitted by law, AG Orion Studio will not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of data, profits or goodwill, arising from or related to your use of the Services. Nothing in these Terms limits liability that cannot be limited under applicable law.",
      ],
    },
    {
      heading: "Changes to these Terms",
      paragraphs: [
        "We may revise these Terms from time to time. The \"Last updated\" date reflects the latest version. Continued use of the Services after changes take effect means you accept the revised Terms.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: [
        "These Terms are governed by the laws applicable where AG Orion Studio is established, without regard to conflict-of-law principles, except where mandatory consumer protection law in your country of residence provides otherwise.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: ["Questions about these Terms can be sent through the contact page."],
    },
  ],
};

export const legalDocuments: LegalDocument[] = [privacyPolicy, termsOfUse];
