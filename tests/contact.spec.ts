import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { unexpectedAccessibilityViolations } from "./accessibility";

const webflowFormEndpoint =
  "https://webflow.com/api/v1/form/663792c3759f35a04eea8483";

test("Contact reproduces the verified source content and metadata", async ({ page }) => {
  const response = await page.goto("/contact");

  expect(response?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe("/contact");
  await expect(page).toHaveTitle("CONTACT");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.cathedrallifecentre.com/contact",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Contact");
  await expect(page.locator("main").getByRole("heading", { level: 2 })).toHaveText([
    "We’re here to help.",
    "Send us a message",
  ]);
  await expect(page.getByText("Ministry questions and information")).toBeVisible();
  await expect(page.getByText("Building tours and visits")).toBeVisible();
  await expect(page.getByRole("checkbox")).toHaveCount(6);
});

test("Contact submits every verified source form field", async ({ page }) => {
  let submittedBody = "";
  await page.route(webflowFormEndpoint, async (route) => {
    submittedBody = route.request().postData() ?? "";
    await route.fulfill({ body: "{}", contentType: "application/json", status: 200 });
  });

  await page.goto("/contact");
  const form = page.getByRole("form", { name: "Contact Form" });
  await form.getByLabel("Name").fill("Contact Neighbor");
  await form.getByLabel("Email Address").fill("neighbor@example.com");
  await form.getByLabel("Message").fill("I would like to help.");
  await form.getByLabel("Phone").fill("832-555-0100");
  await form.getByLabel("I want to volunteer").check();
  await form.getByLabel("Other").check();
  await form.getByRole("button", { name: "Submit" }).click();

  await expect(page.getByTestId("contact-form-success")).toContainText(
    "Thank you! Your submission has been received!",
  );
  const submitted = new URLSearchParams(submittedBody);
  expect(submitted.get("name")).toBe("Contact Form");
  expect(submitted.get("pageId")).toBe("66af02a344c7b688d2295317");
  expect(submitted.get("elementId")).toBe(
    "e4897baf-6f56-4d35-c7b2-e623a686a0d2",
  );
  expect(submitted.get("fields[name-2]")).toBe("Contact Neighbor");
  expect(submitted.get("fields[email-2]")).toBe("neighbor@example.com");
  expect(submitted.get("fields[Message]")).toBe("I would like to help.");
  expect(submitted.get("fields[Phone]")).toBe("832-555-0100");
  expect(submitted.get("fields[Interest]")).toBe("Volunteer, Other");
});

test("Contact responds at desktop, tablet, and mobile widths", async ({ page }) => {
  const intro = page.getByRole("complementary");
  const form = page.getByRole("form", { name: "Contact Form" });

  await page.setViewportSize({ width: 1363, height: 936 });
  await page.goto("/contact");
  expect((await intro.boundingBox())!.x).toBeLessThan((await form.boundingBox())!.x);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1363);

  await page.setViewportSize({ width: 768, height: 1024 });
  expect((await form.boundingBox())!.y).toBeGreaterThan((await intro.boundingBox())!.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(768);

  await page.setViewportSize({ width: 390, height: 844 });
  expect((await form.boundingBox())!.y).toBeGreaterThan((await intro.boundingBox())!.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("Contact has no unexpected automated accessibility violations", async ({ page }) => {
  await page.goto("/contact");
  const desktopResults = await new AxeBuilder({ page }).analyze();
  expect(unexpectedAccessibilityViolations(desktopResults.violations)).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const mobileResults = await new AxeBuilder({ page }).analyze();
  expect(unexpectedAccessibilityViolations(mobileResults.violations)).toEqual([]);
});
