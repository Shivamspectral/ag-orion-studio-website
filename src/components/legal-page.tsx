import type { LegalDocument } from "@/content/legal";
import type { SiteConfiguration } from "@/content/types";
import { breadcrumbSchema } from "@/lib/seo";
import { formatDate, slugify } from "@/lib/utils";
import { Breadcrumbs, JsonLd } from "./seo";
import { PageHero } from "./ui";

export function LegalPage({ document, config }: { document: LegalDocument; config: SiteConfiguration }) {
  const path = `/${document.slug}/`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: document.title, path },
  ];
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: document.title,
            url: `${config.url}${path}`,
            dateModified: document.lastUpdated,
            isPartOf: { "@id": `${config.url}/#website` },
            about: { "@id": `${config.url}/#organization` },
          },
          breadcrumbSchema(config, crumbs),
        ]}
      />
      <PageHero eyebrow="Legal" title={document.title} description={document.description} topSlot={<Breadcrumbs items={crumbs} />}>
        <p className="text-sm text-muted">
          Last updated <time dateTime={document.lastUpdated}>{formatDate(document.lastUpdated)}</time>
        </p>
      </PageHero>
      <div className="container-x grid gap-12 py-14 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16 sm:py-16">
        <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Contents</p>
          <ol className="mt-3 space-y-2 text-sm">
            {document.sections.map((section) => (
              <li key={section.heading}>
                <a href={`#${slugify(section.heading)}`} className="text-muted hover:text-foreground">
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="prose-studio max-w-3xl text-base">
          <p className="text-lg text-foreground/90">{document.intro}</p>
          {document.sections.map((section) => (
            <section key={section.heading} id={slugify(section.heading)} className="scroll-mt-24">
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph.slice(0, 50)}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet.slice(0, 50)}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
