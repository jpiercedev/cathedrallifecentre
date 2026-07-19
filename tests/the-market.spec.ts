import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("The Market reproduces the verified content, metadata, and destinations", async ({
  page,
}) => {
  await page.goto("/the-market");

  await expect(page).toHaveTitle("The Market | Cathedral Life Centre");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.cathedrallifecentre.com/the-market",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "A place where families are seen and valued.",
  );
  await expect(page.locator("main h2")).toHaveText([
    "A place where people know they are not alone.",
    "Donations Are Appreciated",
  ]);
  await expect(
    page.getByRole("link", { name: "Register For The Market" }),
  ).toHaveAttribute("href", "/contact");
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText(
    "HomeMinistriesThe Market",
  );
  await expect(page.getByText("celinap@gracewoodlands.com")).toBeVisible();
  await expect(page.getByText("Meeting Practical Needs", { exact: true })).toHaveCSS(
    "color",
    "rgb(150, 65, 41)",
  );
});

test("The Market serves complete, local images without browser errors", async ({
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

  await page.goto("/the-market");
  await page.waitForLoadState("networkidle");

  const images = page.locator("img");
  await expect(images).toHaveCount(4);
  const imageState = await images.evaluateAll((elements) =>
    elements.map((element) => {
      const image = element as HTMLImageElement;
      return {
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
  expect(consoleProblems).toEqual([]);
  expect(failedRequests).toEqual([]);
});

test("The Market layout responds at desktop, tablet, and mobile widths", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1363, height: 936 });
  await page.goto("/the-market");
  const image = page.locator("#clc-content img");
  const copy = page.locator("#clc-content h2");
  const desktopImage = await image.boundingBox();
  const desktopCopy = await copy.boundingBox();
  expect(desktopImage).not.toBeNull();
  expect(desktopCopy).not.toBeNull();
  expect(desktopImage!.x).toBeLessThan(desktopCopy!.x);

  await page.setViewportSize({ width: 768, height: 1024 });
  const tabletImage = await image.boundingBox();
  const tabletCopy = await copy.boundingBox();
  expect(tabletImage).not.toBeNull();
  expect(tabletCopy).not.toBeNull();
  expect(tabletCopy!.y).toBeGreaterThan(tabletImage!.y + tabletImage!.height);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Register For The Market" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("The Market passes automated accessibility checks", async ({ page }) => {
  await page.goto("/the-market");
  const desktopResults = await new AxeBuilder({ page }).analyze();
  expect(desktopResults.violations).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const mobileResults = await new AxeBuilder({ page }).analyze();
  expect(mobileResults.violations).toEqual([]);
});
