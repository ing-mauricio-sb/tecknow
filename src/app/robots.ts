import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: [
      "https://www.tecknow.news/sitemap.xml",
      "https://www.tecknow.news/news-sitemap.xml",
    ],
  };
}
