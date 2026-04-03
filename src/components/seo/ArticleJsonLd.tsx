import type { Article } from "@/types";
import { CATEGORY_CONFIG } from "@/lib/constants";

interface ArticleJsonLdProps {
  article: Article;
}

export function ArticleJsonLd({ article }: ArticleJsonLdProps) {
  const categoryLabel = CATEGORY_CONFIG[article.categoria]?.label || article.categoria;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.titulo,
    description: article.subtitulo,
    image: article.imagenUrl || "https://www.tecknow.news/og-default.svg",
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Organization",
      name: "TECKNOW",
      url: "https://www.tecknow.news",
    },
    publisher: {
      "@type": "Organization",
      name: "TECKNOW",
      logo: {
        "@type": "ImageObject",
        url: "https://www.tecknow.news/icon-512.svg",
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.tecknow.news/${article.slug}`,
    },
    articleSection: categoryLabel,
    keywords: article.tags.join(", "),
    wordCount: article.cuerpo.split(/\s+/).length,
    inLanguage: "es",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "TECKNOW",
    url: "https://www.tecknow.news",
    logo: {
      "@type": "ImageObject",
      url: "https://www.tecknow.news/icon-512.svg",
      width: 512,
      height: 512,
    },
    description:
      "Noticias de tecnologia, finanzas y negocios para ingenieros y profesionales de Latinoamerica.",
    sameAs: [
      "https://x.com/tecknow",
      "https://linkedin.com/company/tecknow",
      "https://github.com/tecknow",
    ],
    foundingDate: "2026",
    actionableFeedbackPolicy: "https://www.tecknow.news",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
