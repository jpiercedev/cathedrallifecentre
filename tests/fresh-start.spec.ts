import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { unexpectedAccessibilityViolations } from "./accessibility";

test("Fresh Start reproduces the verified content, metadata, and destinations", async ({
  page,
}) => {
  const response = await page.goto("/fresh-start");

  expect(response?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe("/fresh-start");

  await expect(page).toHaveTitle("Fresh Start | Cathedral Life Centre");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.cathedrallifecentre.com/fresh-start",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Helping families begin again with dignity and hope.",
  );
  await expect(page.locator("main h2")).toHaveText([
    "Practical support for a true fresh start.",
    "Help Create a Fresh Start",
  ]);
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText(
    "HomeMinistriesFresh Start",
  );
  await expect(page.getByRole("link", { name: "Scroll to page content" })).toHaveAttribute(
    "href",
    "#clc-content",
  );
  await expect(page.getByText("celinap@gracewoodlands.com")).toBeVisible();
});

test("Fresh Start serves complete local images without browser errors", async ({
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

  await page.goto("/fresh-start");
  await page.waitForLoadState("networkidle");

  const images = page.locator("main img");
  await expect(images).toHaveCount(4);
  const imageState = await images.evaluateAll((elements) =>
    elements.map((element) => {
      const image = element as HTMLImageElement;
      return {
        alt: image.alt,
        complete: image.complete,
        currentSrc: image.currentSrc,
        naturalHeight: image.naturalHeight,
        naturalWidth: image.naturalWidth,
        src: image.getAttribute("src") ?? "",
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
  expect(imageState.map((image) => decodeURIComponent(image.src))).toEqual(
    expect.arrayContaining([
      expect.stringContaining(
        "/assets/pages/fresh-start/fresh-start-living-room.webp",
      ),
      expect.stringContaining(
        "/assets/pages/fresh-start/fresh-start-dining-room.webp",
      ),
      expect.stringContaining(
        "/assets/pages/fresh-start/fresh-start-bedroom-2.webp",
      ),
      expect.stringContaining(
        "/assets/pages/fresh-start/fresh-start-bedroom.webp",
      ),
    ]),
  );
  expect(imageState.map((image) => image.alt)).toEqual([
    "",
    "Families receiving compassionate support at the Cathedral Life Centre",
    "Fresh Start ministry household support",
    "Donated household essentials for Fresh Start families",
  ]);
  expect(consoleProblems).toEqual([]);
  expect(failedRequests).toEqual([]);
});

test("Fresh Start layout responds at desktop, tablet, and mobile widths", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/fresh-start");
  const introImage = page.locator("#clc-content img");
  const introHeading = page.locator("#new-beginning-title");
  const desktopImage = await introImage.boundingBox();
  const desktopHeading = await introHeading.boundingBox();
  expect(desktopImage).not.toBeNull();
  expect(desktopHeading).not.toBeNull();
  expect(desktopImage!.x).toBeLessThan(desktopHeading!.x);

  await page.setViewportSize({ width: 768, height: 1024 });
  const tabletImage = await introImage.boundingBox();
  const tabletHeading = await introHeading.boundingBox();
  expect(tabletImage).not.toBeNull();
  expect(tabletHeading).not.toBeNull();
  expect(tabletHeading!.y).toBeGreaterThan(tabletImage!.y + tabletImage!.height);
  const tabletGallery = await page.locator('[aria-label="Fresh Start homes"] img').all();
  expect(tabletGallery).toHaveLength(2);
  const tabletFirst = await tabletGallery[0].boundingBox();
  const tabletSecond = await tabletGallery[1].boundingBox();
  expect(tabletFirst).not.toBeNull();
  expect(tabletSecond).not.toBeNull();
  expect(Math.abs(tabletFirst!.y - tabletSecond!.y)).toBeLessThan(2);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileFirst = await tabletGallery[0].boundingBox();
  const mobileSecond = await tabletGallery[1].boundingBox();
  expect(mobileFirst).not.toBeNull();
  expect(mobileSecond).not.toBeNull();
  expect(mobileSecond!.y).toBeGreaterThan(mobileFirst!.y + mobileFirst!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("Fresh Start has no unexpected automated accessibility violations", async ({
  page,
}) => {
  await page.goto("/fresh-start");
  const desktopResults = await new AxeBuilder({ page }).analyze();
  expect(
    unexpectedAccessibilityViolations(desktopResults.violations),
  ).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const mobileResults = await new AxeBuilder({ page }).analyze();
  expect(unexpectedAccessibilityViolations(mobileResults.violations)).toEqual(
    [],
  );
});
