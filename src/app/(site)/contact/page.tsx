import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Breadcrumbs, JsonLd } from "@/components/seo";
import { Icon, Notice, PageHero } from "@/components/ui";
import { getProducts, getSiteConfig, googlePlayUrl } from "@/lib/content";
import { breadcrumbSchema, buildMetadata, organizationId } from "@/lib/seo";

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact/" },
];

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return buildMetadata({
    config,
    title: "Contact",
    description: `Contact ${config.brand.name} for app and game support, business inquiries, advertising partnerships and developer or publishing questions.`,
    path: "/contact/",
  });
}

export default async function ContactPage() {
  const [config, products] = await Promise.all([getSiteConfig(), getProducts()]);
  const { contact, brand } = config;
  const anyEmail = contact.channels.some((channel) => channel.email);
  const published = products.filter((product) => googlePlayUrl(product));

  return (
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "ContactPage", name: `Contact ${brand.name}`, url: `${config.url}/contact/`, mainEntity: { "@id": organizationId(config) } },
          breadcrumbSchema(config, crumbs),
        ]}
      />
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description={`Support for every ${brand.name} app and game, plus business, advertising and developer inquiries. ${contact.responseNote}`}
        topSlot={<Breadcrumbs items={crumbs} />}
      />

      <div className="container-x grid gap-12 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="space-y-8">
          <ul className="space-y-4" aria-label="Contact channels">
            {contact.channels.map((channel) => (
              <li key={channel.id} id={channel.id} className="surface-card scroll-mt-24 p-5">
                <h2 className="text-lg font-semibold text-foreground">{channel.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">{channel.description}</p>
                <p className="mt-3 text-sm">
                  {channel.email ? (
                    <a href={`mailto:${channel.email}`} className="inline-flex items-center gap-2 font-medium text-accent-strong hover:underline">
                      <Icon name="mail" className="h-4 w-4" />
                      {channel.email}
                    </a>
                  ) : (
                    <a href="#contact-form" className="inline-flex items-center gap-2 font-medium text-accent-strong hover:underline">
                      <Icon name="arrow-right" className="h-4 w-4" />
                      Use the contact form and choose “{channel.title}”
                    </a>
                  )}
                </p>
              </li>
            ))}
          </ul>

          <div className="surface-card p-5">
            <h2 className="text-base font-semibold text-foreground">Before you write to support</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li className="flex gap-2">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                Make sure the app is updated to the latest version on Google Play.
              </li>
              <li className="flex gap-2">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                Tell us your device model and Android version.
              </li>
              <li className="flex gap-2">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" />
                Describe what happened and what you expected instead.
              </li>
            </ul>
            {published.length > 0 && (
              <p className="mt-4 text-xs text-muted-2">
                Official listings:{" "}
                {published.map((product, index) => (
                  <span key={product.slug}>
                    {index > 0 && ", "}
                    <a href={googlePlayUrl(product)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">
                      {product.name}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </div>

          {!anyEmail && (
            <Notice tone="info" title="Contact form only">
              Direct email addresses are not published yet. Messages sent through the form reach the studio directly.
            </Notice>
          )}
          {contact.location && <p className="text-sm text-muted-2">{contact.location}</p>}
        </div>

        <div id="contact-form" className="scroll-mt-24">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">Send a message</h2>
          <ContactForm channels={contact.channels} products={products.map((product) => ({ slug: product.slug, name: product.name }))} />
        </div>
      </div>
    </>
  );
}
