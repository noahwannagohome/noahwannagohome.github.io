import config from "@/config";

const { site } = config;

/** Absolute URL of the blog root, always with a trailing slash. */
export const siteRootUrl = new URL(site.url).href.replace(/\/?$/, "/");

const personId = `${siteRootUrl}#person`;
const websiteId = `${siteRootUrl}#website`;

/** The blog's author. Linked from every page by `@id`. */
export function personSchema() {
  const sameAs = [site.profile, ...(site.sameAs ?? [])].filter(
    (url): url is string => Boolean(url)
  );
  return {
    "@type": "Person",
    "@id": personId,
    name: site.author,
    url: new URL("about/", siteRootUrl).href,
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export const personRef = { "@id": personId };

/** The site itself, with Pagefind as its search action (Sitelinks search box). */
export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: siteRootUrl,
    name: site.title,
    description: site.description,
    inLanguage: site.lang,
    publisher: personRef,
    ...(config.features.search && {
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${new URL("search/", siteRootUrl).href}?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    }),
  };
}

export const websiteRef = { "@id": websiteId };

/** BreadcrumbList from ordered [name, absolute URL] pairs. */
export function breadcrumbSchema(items: [name: string, url: string][]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, item], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item,
    })),
  };
}

/** Wraps nodes in one `@graph` so a page emits a single JSON-LD block. */
export function graph(...nodes: Record<string, unknown>[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
