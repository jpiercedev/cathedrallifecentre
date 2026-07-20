import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { unexpectedAccessibilityViolations } from "./accessibility";

const applicationUrl =
  "https://gracewoodlands.churchcenter.com/people/forms/1013129";
const webflowFormEndpoint =
  "https://webflow.com/api/v1/form/663792c3759f35a04eea8483";

test("Volunteer reproduces the verified metadata, copy, and ministries", async ({ page }) => {
  const response = await page.goto("/volunteer");

  expect(response?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe("/volunteer");
  await expect(page).toHaveTitle("Volunteer Ministries | Cathedral Life Centre");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.cathedrallifecentre.com/volunteer",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Volunteer Ministries",
  );
  await expect(page.getByRole("heading", { level: 3 })).toHaveText([
    "Foster Care",
    "Coaching",
    "Adoption",
    "Grace Garage",
    "Groups",
    "Facility Care",
    "Office Admin",
  ]);
  await expect(page.getByRole("heading", {
    level: 2,
    name: "Ready to make a lasting impact in your community?",
  })).toBeVisible();
  await expect(page.getByRole("heading", {
    level: 2,
    name: "Connect With the Life Centre",
  })).toBeVisible();
  await expect(page.getByRole("link", { name: "Apply To Volunteer" })).toHaveCount(2);
  for (const link of await page.getByRole("link", { name: "Apply To Volunteer" }).all()) {
    await expect(link).toHaveAttribute("href", applicationUrl);
  }
  await expect(page.getByRole("link", { name: "Learn more about Grace Garage" })).toHaveAttribute(
    "href",
    "https://gracegarage.org",
  );
});

test("Volunteer submits the verified source form", async ({ page }) => {
  let submittedBody = "";
  await page.route(webflowFormEndpoint, async (route) => {
    submittedBody = route.request().postData() ?? "";
    await route.fulfill({ body: "{}", contentType: "application/json", status: 200 });
  });

  await page.goto("/volunteer");
  const form = page.getByRole("form", { name: "Contact the Volunteer ministry" });
  await form.getByLabel("Name").fill("Volunteer Neighbor");
  await form.getByLabel("Email Address").fill("neighbor@example.com");
  await form.getByRole("button", { name: "Send Message" }).click();

  await expect(page.getByTestId("volunteer-form-success")).toContainText(
    "We'll be in contact soon!",
  );
  const submitted = new URLSearchParams(submittedBody);
  expect(submitted.get("name")).toBe("nvygko");
  expect(submitted.get("pageId")).toBe("67f3ff9f44358d26d5ea4376");
  expect(submitted.get("elementId")).toBe(
    "cf2e2d4e-8700-3ccc-3eba-783bdfec934b",
  );
  expect(submitted.get("fields[Name]")).toBe("Volunteer Neighbor");
  expect(submitted.get("fields[Email Address]")).toBe("neighbor@example.com");
});

test("Volunteer serves complete local source images", async ({ page }) => {
  await page.goto("/volunteer");

  const images = page.locator("main img");
  await expect(images).toHaveCount(6);
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
      (image) => image.complete && image.naturalHeight > 0 && image.naturalWidth > 0,
    ),
  ).toBe(true);
  expect(
    imageState.filter((image) =>
      /website-files|webflow|cathedrallifecentre\.com/i.test(image.currentSrc),
    ),
  ).toEqual([]);
});

test("Volunteer responds at desktop, tablet, and mobile widths", async ({ page }) => {
  const cards = page.locator("main article, main a[aria-label^='Learn more about']");
  const cta = page.getByRole("heading", {
    name: "Ready to make a lasting impact in your community?",
  });
  const contactHeading = page.getByRole("heading", {
    name: "Connect With the Life Centre",
  });
  const form = page.getByRole("form", { name: "Contact the Volunteer ministry" });

  await page.setViewportSize({ width: 1363, height: 936 });
  await page.goto("/volunteer");
  expect(await cards.count()).toBe(7);
  const desktopBoxes = await cards.evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().toJSON()),
  );
  expect(desktopBoxes[0].y).toBe(desktopBoxes[2].y);
  expect(desktopBoxes[3].y).toBeGreaterThan(desktopBoxes[0].y);
  expect((await cta.boundingBox())!.y).toBeGreaterThan(desktopBoxes[6].y);
  expect((await contactHeading.boundingBox())!.x).toBeLessThan((await form.boundingBox())!.x);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1363);

  await page.setViewportSize({ width: 768, height: 1024 });
  const tabletBoxes = await cards.evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().toJSON()),
  );
  expect(tabletBoxes[0].y).toBe(tabletBoxes[1].y);
  expect(tabletBoxes[2].y).toBeGreaterThan(tabletBoxes[0].y);
  expect((await form.boundingBox())!.y).toBeGreaterThan((await contactHeading.boundingBox())!.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(768);

  await page.setViewportSize({ width: 390, height: 844 });
  expect((await cards.nth(1).boundingBox())!.y).toBeGreaterThan((await cards.nth(0).boundingBox())!.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("Volunteer has no unexpected automated accessibility violations", async ({ page }) => {
  await page.goto("/volunteer");
  const desktopResults = await new AxeBuilder({ page }).analyze();
  expect(unexpectedAccessibilityViolations(desktopResults.violations)).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const mobileResults = await new AxeBuilder({ page }).analyze();
  expect(unexpectedAccessibilityViolations(mobileResults.violations)).toEqual([]);
});
