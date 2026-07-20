import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { unexpectedAccessibilityViolations } from "./accessibility";

const webflowFormEndpoint =
  "https://webflow.com/api/v1/form/663792c3759f35a04eea8483";

function expectNear(actual: number, expected: number, tolerance = 1) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
}

test("Adoption reproduces the verified metadata, copy, resources, and destinations", async ({
  page,
}) => {
  const response = await page.goto("/adoption");

  expect(response?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe("/adoption");
  await expect(page).toHaveTitle("Adoption | Cathedral Life Centre");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.cathedrallifecentre.com/adoption",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "A journey that reflects God's love",
  );
  await expect(page.locator("main h2")).toHaveText([
    "A profound act of faith and compassion.",
    "We offer resources to prepare you on your path to adoption.",
    "Connect With the Life Centre",
  ]);
  await expect(page.locator("main article h3")).toHaveText([
    "Cathedral Life Adoption Resources and Next Steps",
    "Adoption Support Group",
    "Adoption Classes",
    "Adoption Coaching Program",
  ]);
  await expect(page.getByText("Coming Soon", { exact: true })).toHaveCount(3);
  await expect(
    page.getByText(
      "Financial/Emotional Responsibilities of Adoption, How to Make a Bio Book, Types of Adoption, etc.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Find Out More" })).toHaveAttribute(
    "href",
    "/contact",
  );
  await expect(
    page.getByText("24854 Cathedral Lakes Pkwy", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Spring, TX 77386", { exact: true })).toBeVisible();
  await expect(
    page
      .getByRole("region", { name: "Connect With the Life Centre" })
      .getByRole("link", { name: "(832) 381-2306" }),
  ).toHaveAttribute("href", "tel:8323812306");
});

test("Adoption submits the verified source form and exposes its success state", async ({
  page,
}) => {
  let submittedBody = "";
  await page.route(webflowFormEndpoint, async (route) => {
    submittedBody = route.request().postData() ?? "";
    await route.fulfill({ body: "{}", contentType: "application/json", status: 200 });
  });

  await page.goto("/adoption");
  const form = page.getByRole("form", { name: "Contact the Adoption ministry" });
  await form.getByLabel("Name").fill("Adoptive Family");
  await form.getByLabel("Email Address").fill("family@example.com");
  await form.getByRole("button", { name: "Send Message" }).click();

  await expect(page.getByTestId("adoption-form-success")).toContainText(
    "We'll be in contact soon!",
  );
  const submitted = new URLSearchParams(submittedBody);
  expect(submitted.get("name")).toBe("nvygko");
  expect(submitted.get("pageId")).toBe("66aef87c31e32786ed16f719");
  expect(submitted.get("elementId")).toBe(
    "cf2e2d4e-8700-3ccc-3eba-783bdfec934b",
  );
  expect(submitted.get("fields[Name]")).toBe("Adoptive Family");
  expect(submitted.get("fields[Email Address]")).toBe("family@example.com");
  expect(submitted.get("fields[Message]")).toBe("");
});

test("Adoption serves complete local images without browser errors", async ({
  page,
}) => {
  const consoleProblems: string[] = [];
  const failedRequests: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleProblems.push(message.text());
  });
  page.on("requestfailed", (request) => {
    failedRequests.push(`${request.method()} ${request.url()}`);
  });

  await page.goto("/adoption");
  await page.waitForLoadState("networkidle");

  const images = page.locator("main img");
  await expect(images).toHaveCount(5);
  const imageState = await images.evaluateAll((elements) =>
    elements.map((element) => {
      const image = element as HTMLImageElement;
      return {
        alt: image.alt,
        complete: image.complete,
        currentSrc: image.currentSrc,
        naturalHeight: image.naturalHeight,
        naturalWidth: image.naturalWidth,
      };
    }),
  );
  expect(
    imageState.every(
      (image) =>
        image.complete && image.naturalHeight > 0 && image.naturalWidth > 0,
    ),
  ).toBe(true);
  expect(
    imageState.filter((image) =>
      /website-files|webflow|cathedrallifecentre\.com/i.test(image.currentSrc),
    ),
  ).toEqual([]);
  expect(imageState.map((image) => image.alt)).toEqual([
    "",
    "Mom lifting laughing baby",
    "Bedroom suite with baby crib",
    "Mom playing with baby on bed",
    "Two women with baby in lounge",
  ]);
  expect(consoleProblems).toEqual([]);
  expect(failedRequests).toEqual([]);
});

test("Adoption responds at desktop, tablet, and mobile widths", async ({ page }) => {
  await page.setViewportSize({ width: 1363, height: 936 });
  await page.goto("/adoption");

  const overviewHeading = page.getByRole("heading", {
    name: "A profound act of faith and compassion.",
  });
  const overviewImage = page.getByAltText("Mom lifting laughing baby");
  const desktopHeading = await overviewHeading.boundingBox();
  const desktopImage = await overviewImage.boundingBox();
  expect(desktopHeading).not.toBeNull();
  expect(desktopImage).not.toBeNull();
  expect(desktopHeading!.x).toBeLessThan(desktopImage!.x);

  const resourcesImage = page.getByAltText("Two women with baby in lounge");
  const resourcesHeading = page.getByRole("heading", {
    name: "We offer resources to prepare you on your path to adoption.",
  });
  const desktopResourcesImage = await resourcesImage.boundingBox();
  const desktopResourcesHeading = await resourcesHeading.boundingBox();
  expect(desktopResourcesImage).not.toBeNull();
  expect(desktopResourcesHeading).not.toBeNull();
  expect(desktopResourcesImage!.x).toBeLessThan(desktopResourcesHeading!.x);

  await page.setViewportSize({ width: 768, height: 1024 });
  const tabletHeading = await overviewHeading.boundingBox();
  const tabletImage = await overviewImage.boundingBox();
  expect(tabletHeading).not.toBeNull();
  expect(tabletImage).not.toBeNull();
  expect(tabletImage!.y).toBeGreaterThan(tabletHeading!.y + tabletHeading!.height);

  await page.setViewportSize({ width: 390, height: 844 });
  const hero = page.locator("main > section").first();
  const heroHeading = page.getByRole("heading", { level: 1 });
  const gallery = page.getByLabel("Adoption family gallery");
  const galleryMain = overviewImage.locator("..");
  const gallerySmall = page
    .getByAltText("Bedroom suite with baby crib")
    .locator("..");
  const primaryAction = page.getByRole("link", { name: "Find Out More" });
  const primaryActionWrap = primaryAction.locator("..");
  const mobileResourcesImage = await resourcesImage.boundingBox();
  const mobileResourcesHeading = await resourcesHeading.boundingBox();
  const mobileHero = await hero.boundingBox();
  const mobileHeroHeading = await heroHeading.boundingBox();
  const mobileGallery = await gallery.boundingBox();
  const mobileGalleryMain = await galleryMain.boundingBox();
  const mobileGallerySmall = await gallerySmall.boundingBox();
  const mobilePrimaryAction = await primaryAction.boundingBox();
  const mobilePrimaryActionWrap = await primaryActionWrap.boundingBox();
  expect(mobileResourcesImage).not.toBeNull();
  expect(mobileResourcesHeading).not.toBeNull();
  expect(mobileHero).not.toBeNull();
  expect(mobileHeroHeading).not.toBeNull();
  expect(mobileGallery).not.toBeNull();
  expect(mobileGalleryMain).not.toBeNull();
  expect(mobileGallerySmall).not.toBeNull();
  expect(mobilePrimaryAction).not.toBeNull();
  expect(mobilePrimaryActionWrap).not.toBeNull();
  expect(mobileResourcesHeading!.y).toBeGreaterThan(
    mobileResourcesImage!.y + mobileResourcesImage!.height,
  );
  expectNear(mobileHero!.height, 496);
  expectNear(mobileHeroHeading!.x, 24);
  expectNear(mobileGallery!.height, 496);
  expectNear(mobileGalleryMain!.height, 300);
  expectNear(mobileGallerySmall!.height, 180);
  expectNear(mobileResourcesImage!.height, 520);
  expectNear(mobilePrimaryAction!.width, mobilePrimaryActionWrap!.width);

  const mobileTypography = await page.evaluate(() => {
    const read = (element: Element | null) => {
      if (!element) throw new Error("Expected typography target was not found");
      const style = getComputedStyle(element);
      return {
        color: style.color,
        fontSize: Number.parseFloat(style.fontSize),
        lineHeight: Number.parseFloat(style.lineHeight),
      };
    };
    return {
      contact: read(document.querySelector("#adoption-contact-title")),
      hero: read(document.querySelector("#adoption-title")),
      overview: read(document.querySelector("#adoption-overview-title")),
      resources: read(document.querySelector("#adoption-resources-title")),
    };
  });
  expectNear(mobileTypography.hero.fontSize, 35.2, 0.1);
  expectNear(mobileTypography.hero.lineHeight, 38.72, 0.2);
  expectNear(mobileTypography.overview.fontSize, 28.8, 0.1);
  expectNear(mobileTypography.overview.lineHeight, 36, 0.2);
  expect(mobileTypography.overview.color).toBe("rgb(28, 44, 91)");
  expectNear(mobileTypography.resources.fontSize, 28.8, 0.1);
  expectNear(mobileTypography.resources.lineHeight, 36, 0.2);
  expectNear(mobileTypography.contact.fontSize, 28, 0.1);
  expectNear(mobileTypography.contact.lineHeight, 35, 0.2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("Adoption has no unexpected automated accessibility violations", async ({
  page,
}) => {
  await page.goto("/adoption");
  const desktopResults = await new AxeBuilder({ page }).analyze();
  expect(unexpectedAccessibilityViolations(desktopResults.violations)).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const mobileResults = await new AxeBuilder({ page }).analyze();
  expect(unexpectedAccessibilityViolations(mobileResults.violations)).toEqual([]);
});
