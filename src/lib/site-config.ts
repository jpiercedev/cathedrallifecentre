export const siteConfig = {
  name: "Cathedral Life Centre",
  productionUrl: "https://www.cathedrallifecentre.com",
  sourceHost: "www.cathedrallifecentre.com",
  description:
    "A Christ-centered refuge in Spring, Texas, bringing hope, healing, and life to women and families in crisis.",
} as const;

const deploymentEnvironment =
  process.env.VERCEL_ENV ?? process.env.CONTEXT ?? process.env.DEPLOY_ENV;

export const isPreviewDeployment = Boolean(
  deploymentEnvironment &&
    !["production", "prod"].includes(deploymentEnvironment.toLowerCase()),
);
