import type { MetadataRoute } from "next";
import { getTexts } from "@/lib/store";
export const dynamic = "force-dynamic";
export default function robots(): MetadataRoute.Robots {
  const site = getTexts().value.site_url;
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    ...(site ? { sitemap: `${site}/sitemap.xml` } : {}),
  };
}
