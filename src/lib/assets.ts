const SOURCE_HOSTS = new Set([
  "www.cathedrallifecentre.com",
  "cathedrallifecentre.com",
  "cdn.prod.website-files.com",
  "uploads-ssl.webflow.com",
]);

export function isSourceHostedAsset(value: string): boolean {
  try {
    return SOURCE_HOSTS.has(new URL(value).hostname);
  } catch {
    return false;
  }
}

export function assetPath(relativePath: string): string {
  const normalized = relativePath.replace(/^\/+/, "");
  return `/assets/${normalized}`;
}
