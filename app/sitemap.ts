import { MetadataRoute } from "next";
import { latestArticles, practicalGuides, exploreTopics, heroArticle } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://xroack-security.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
  ];

  const articleRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/articles/${heroArticle.slug}`,
      lastModified: new Date(heroArticle.publishedAt),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...latestArticles.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  const guideRoutes: MetadataRoute.Sitemap = practicalGuides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const topicRoutes: MetadataRoute.Sitemap = exploreTopics.map((topic) => ({
    url: `${baseUrl}/topics/${topic.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes, ...guideRoutes, ...topicRoutes];
}

