import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { unexpectedAccessibilityViolations } from "./accessibility";

const webflowFormEndpoint =
  "https://webflow.com/api/v1/form/663792c3759f35a04eea8483";

test("Classes reproduces the verified metadata, copy, and class lists", async ({ page }) => {
  const response = await page.goto("/classes");

  expect(response?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe("/classes");
  await expect(page).toHaveTitle("Classes | Cathedral Life Centre");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.cathedrallifecentre.com/classes",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Essential life skills & Biblical study",
  );
  await expect(page.locator("main h2")).toHaveText([
    "Equipping you with essential life skills & Biblical study.",
    "Connect With the Life Centre",
  ]);
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText(
    "Coaching",
  );

  for (const className of [
    "Bible Study and Theology Classes",
    "CPR and First Aid Certification Course",
    "Car Care 101",
    "Parenting",
    "Personal Finance",
    "Job Preparation Class — Interview Skills, Resume Writing, Helpful Tips",
    "Small Business and Entrepreneurship",
    "Affordable Meal Planning and Cooking",
  ]) {
    await expect(page.getByText(className, { exact: true })).toBeVisible();
  }
  await expect(page.getByText("Proverbs 1:5", { exact: true })).toBeVisible();
});

test("Classes submits the verified source form", async ({ page }) => {
  let submittedBody = "";
  await page.route(webflowFormEndpoint, async (route) => {
    submittedBody = route.request().postData() ?? "";
    await route.fulfill({ body: "{}", contentType: "application/json", status: 200 });
  });

  await page.goto("/classes");
  const form = page.getByRole("form", { name: "Contact the Classes ministry" });
  await form.getByLabel("Name").fill("Classes Neighbor");
  await form.getByLabel("Email Address").fill("neighbor@example.com");
  await form.getByRole("button", { name: "Send Message" }).click();

  await expect(page.getByTestId("classes-form-success")).toContainText(
    "We'll be in contact soon!",
  );
  const submitted = new URLSearchParams(submittedBody);
  expect(submitted.get("name")).toBe("nvygko");
  expect(submitted.get("pageId")).toBe("66af01098ec7726a71c462a6");
  expect(submitted.get("elementId")).toBe(
    "cf2e2d4e-8700-3ccc-3eba-783bdfec934b",
  );
  expect(submitted.get("fields[Name]")).toBe("Classes Neighbor");
  expect(submitted.get("fields[Email Address]")).toBe("neighbor@example.com");
});

test("Classes serves complete local source images", async ({ page }) => {
  await page.goto("/classes");

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
  expect(imageState.map((image) => image.alt)).toEqual([
    "",
    "Cathedral Life Centre courtyard",
  ]);
});

test("Classes responds at desktop, tablet, and mobile widths", async ({ page }) => {
  const heading = page.getByRole("heading", {
    name: "Equipping you with essential life skills & Biblical study.",
  });
  const image = page.getByAltText("Cathedral Life Centre courtyard");
  const contactHeading = page.getByRole("heading", {
    name: "Connect With the Life Centre",
  });
  const form = page.getByRole("form", { name: "Contact the Classes ministry" });

  await page.setViewportSize({ width: 1363, height: 936 });
  await page.goto("/classes");
  const desktopHeading = await heading.boundingBox();
  const desktopImage = await image.boundingBox();
  const desktopContact = await contactHeading.boundingBox();
  const desktopForm = await form.boundingBox();
  expect(desktopHeading!.x).toBeLessThan(desktopImage!.x);
  expect(desktopContact!.x).toBeLessThan(desktopForm!.x);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1363);

  await page.setViewportSize({ width: 768, height: 1024 });
  expect((await image.boundingBox())!.y).toBeGreaterThan((await heading.boundingBox())!.y);
  expect((await form.boundingBox())!.y).toBeGreaterThan((await contactHeading.boundingBox())!.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(768);

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("Classes has no unexpected automated accessibility violations", async ({ page }) => {
  await page.goto("/classes");
  const desktopResults = await new AxeBuilder({ page }).analyze();
  expect(unexpectedAccessibilityViolations(desktopResults.violations)).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const mobileResults = await new AxeBuilder({ page }).analyze();
  expect(unexpectedAccessibilityViolations(mobileResults.violations)).toEqual([]);
});
