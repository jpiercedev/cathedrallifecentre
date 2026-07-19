import type { MetadataRoute } from "next";
import { isPreviewDeployment, siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isPreviewDeployment
      ? { userAgent: "*", disallow: "/" }
      : { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.productionUrl}/sitemap.xml`,
    host: siteConfig.productionUrl,
  };
}
