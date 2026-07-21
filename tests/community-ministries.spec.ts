import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { unexpectedAccessibilityViolations } from "./accessibility";

const webflowFormEndpoint =
  "https://webflow.com/api/v1/form/663792c3759f35a04eea8483";

function expectNear(actual: number, expected: number, tolerance = 1) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
}

test("Community Ministries reproduces the verified source content", async ({ page }) => {
  const response = await page.goto("/community-ministries");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("Community Ministries | Cathedral Life Centre");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.cathedrallifecentre.com/community-ministries",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Care for personal needs",
  );
  await expect(page.locator("main h2")).toHaveText([
    "Caring for the whole person, in every area of life.",
    "Connect With the Life Centre",
  ]);
  await expect(page.getByRole("link", { name: "Find Out More" })).toHaveAttribute(
    "href",
    "#contact",
  );
  await expect(page.getByRole("link", { name: "GraceGarage.org" })).toHaveAttribute(
    "href",
    "/grace-garage",
  );
  await expect(page.getByRole("link", { name: "Fresh Start Ministry" })).toHaveAttribute(
    "href",
    "/fresh-start",
  );
  await expect(page.getByText("Coming Soon", { exact: true })).toHaveCount(2);
});

test("Community Ministries submits the verified source form", async ({ page }) => {
  let submittedBody = "";
  await page.route(webflowFormEndpoint, async (route) => {
    submittedBody = route.request().postData() ?? "";
    await route.fulfill({ body: "{}", contentType: "application/json", status: 200 });
  });

  await page.goto("/community-ministries");
  const form = page.getByRole("form", { name: "Contact the Community Ministries" });
  await form.getByLabel("Name").fill("Community Neighbor");
  await form.getByLabel("Email Address").fill("neighbor@example.com");
  await form.getByRole("button", { name: "Send Message" }).click();

  await expect(page.getByTestId("community-ministries-form-success")).toContainText(
    "We'll be in contact soon!",
  );
  const submitted = new URLSearchParams(submittedBody);
  expect(submitted.get("name")).toBe("qwybyu");
  expect(submitted.get("pageId")).toBe("66aefe22335aaf4dfc3627be");
  expect(submitted.get("elementId")).toBe("bed8a05b-ac05-f61d-8fde-62cb78dd699d");
});

test("Community Ministries serves local source images and matches the desktop frame", async ({ page }) => {
  await page.setViewportSize({ width: 1363, height: 936 });
  await page.goto("/community-ministries");

  const images = page.locator("main img");
  await expect(images).toHaveCount(2);
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
  expect(imageState.every((image) => image.complete && image.naturalHeight > 0 && image.naturalWidth > 0)).toBe(true);
  expect(imageState.filter((image) => /website-files|webflow|cathedrallifecentre\.com/i.test(image.currentSrc))).toEqual([]);
  expect(imageState.map((image) => image.alt)).toEqual(["", "Cathedral Life Centre porch"]);

  const hero = await page.locator("main > section").first().boundingBox();
  const program = await page.getByRole("region", {
    name: "Caring for the whole person, in every area of life.",
  }).boundingBox();
  const programImage = await page.getByAltText("Cathedral Life Centre porch").boundingBox();
  const contact = await page.getByRole("region", {
    name: "Connect With the Life Centre",
  }).boundingBox();
  expectNear(hero!.height, 496);
  expectNear(program!.y, 631.5);
  expectNear(program!.height, 731);
  expectNear(programImage!.width, 504);
  expectNear(programImage!.height, 300);
  expectNear(contact!.y, 1362.5);
  expectNear(contact!.height, 569.28125);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1363);
});

test("Community Ministries remains usable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/community-ministries");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByAltText("Cathedral Life Centre porch")).toBeVisible();
  await expect(page.getByRole("form", { name: "Contact the Community Ministries" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("Community Ministries has no unexpected accessibility violations", async ({ page }) => {
  await page.goto("/community-ministries");
  const results = await new AxeBuilder({ page }).analyze();
  expect(unexpectedAccessibilityViolations(results.violations)).toEqual([]);
});
