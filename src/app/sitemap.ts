import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.productionUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: new URL("/the-market", siteConfig.productionUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: new URL("/about", siteConfig.productionUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: new URL("/fresh-start", siteConfig.productionUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: new URL("/donate", siteConfig.productionUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: new URL("/residency-programs", siteConfig.productionUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: new URL("/foster-care", siteConfig.productionUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: new URL("/adoption", siteConfig.productionUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: new URL("/grace-garage", siteConfig.productionUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
