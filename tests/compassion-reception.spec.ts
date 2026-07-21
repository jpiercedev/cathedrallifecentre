import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { unexpectedAccessibilityViolations } from "./accessibility";

test("Compassion Reception matches the source content and event details", async ({
  page,
}) => {
  await page.goto("/compassion-reception");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Compassion Reception",
  );
  await expect(page.getByText("Tuesday, August 18, 2026")).toBeVisible();
  await expect(page.getByText("7:00–8:30 PM")).toBeVisible();
  await expect(page.getByRole("link", { name: "RSVP Now" })).toHaveAttribute(
    "href",
    "#rsvp",
  );
  await expect(page.getByRole("link", { name: "Get Directions" })).toHaveAttribute(
    "href",
    /google\.com\/maps\/search/,
  );
  await expect(page.getByTitle("Cathedral Life Centre mission video")).toHaveAttribute(
    "src",
    /player\.vimeo\.com\/video\/1208955332/,
  );
});

test("RSVP guest controls add, remove, and renumber accessible guest fields", async ({
  page,
}) => {
  await page.goto("/compassion-reception");

  const addGuest = page.getByRole("button", { name: "Add a Guest" });
  await addGuest.click();
  await expect(page.getByRole("group", { name: "Guest 1" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Guest 1 added.");

  await addGuest.click();
  await expect(page.getByRole("group", { name: "Guest 2" })).toBeVisible();
  await page.getByRole("button", { name: "Remove Guest 1" }).click();
  await expect(page.getByRole("group", { name: "Guest 1" })).toBeVisible();
  await expect(page.getByRole("group", { name: "Guest 2" })).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText(
    "Guest 1 removed. Guest numbering updated.",
  );
});

test("Compassion Reception is responsive and accessible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/compassion-reception");

  await expect(page.locator("main")).toHaveCSS("overflow-x", "visible");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("form", { name: "Compassion Reception RSVP" })).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(unexpectedAccessibilityViolations(results.violations)).toEqual([]);
});

test("Compassion Reception serves source imagery locally", async ({ page }) => {
  await page.goto("/compassion-reception");
  const imageUrls = await page.locator("img").evaluateAll((images) =>
    images.map((image) => (image as HTMLImageElement).currentSrc),
  );

  expect(imageUrls).not.toEqual([]);
  expect(
    imageUrls.filter((url) => /website-files|webflow/i.test(url)),
  ).toEqual([]);
});
