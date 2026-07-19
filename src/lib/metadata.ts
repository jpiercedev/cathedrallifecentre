import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

type PageMetadataInput = {
  title: string;
  description?: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  absoluteTitle?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const canonical = new URL(path, siteConfig.productionUrl).toString();

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}
