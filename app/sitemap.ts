import type { MetadataRoute } from "next";
import { getPosts, getTexts } from "@/lib/store";
export const dynamic = "force-dynamic";
export default function sitemap(): MetadataRoute.Sitemap {
  const site = getTexts().value.site_url;
  if (!site) return [];
  return [
    { url: site, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...getPosts(true).map((p) => ({
      url: `${site}/blog/${p.slug}`,
      lastModified: p.updated_at,
      priority: 0.6,
    })),
  ];
}
