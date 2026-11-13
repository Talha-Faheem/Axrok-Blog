import { siteMetadata, heroArticle, latestArticles } from "@/lib/data";

export function JsonLd() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Xroack",
    "alternateName": "Xroack Cybersecurity Intelligence",
    "url": siteMetadata.siteUrl,
    "description": siteMetadata.description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteMetadata.siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "Xroack",
    "url": siteMetadata.siteUrl,
    "logo": `${siteMetadata.siteUrl}/logo.png`,
    "description": siteMetadata.description,
    "publishingPrinciples": `${siteMetadata.siteUrl}/editorial-guidelines`,
    "sameAs": [
      "https://twitter.com/xroack_sec",
      "https://github.com/xroack",
    ],
  };

  const articleFeedSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "NewsArticle",
          "headline": heroArticle.title,
          "description": heroArticle.excerpt,
          "image": heroArticle.coverImage,
          "datePublished": heroArticle.publishedAt,
          "author": {
            "@type": "Person",
            "name": heroArticle.author.name,
          },
          "publisher": {
            "@type": "Organization",
            "name": "Xroack",
          },
        },
      },
      ...latestArticles.map((art, idx) => ({
        "@type": "ListItem",
        "position": idx + 2,
        "item": {
          "@type": "NewsArticle",
          "headline": art.title,
          "description": art.excerpt,
          "image": art.coverImage,
          "datePublished": art.publishedAt,
          "author": {
            "@type": "Person",
            "name": art.author.name,
          },
          "publisher": {
            "@type": "Organization",
            "name": "Xroack",
          },
        },
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleFeedSchema) }}
      />
    </>
  );
}

