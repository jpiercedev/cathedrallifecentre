import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { unexpectedAccessibilityViolations } from "./accessibility";

const webflowFormEndpoint =
  "https://webflow.com/api/v1/form/663792c3759f35a04eea8483";

test("Coaching reproduces the verified metadata, copy, and topics", async ({
  page,
}) => {
  const response = await page.goto("/coaching");

  expect(response?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe("/coaching");
  await expect(page).toHaveTitle("Coaching | Cathedral Life Centre");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.cathedrallifecentre.com/coaching",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Coaching makes a difference",
  );
  await expect(page.locator("main h2")).toHaveText([
    "Enhancing life skills & aligning with God's purpose.",
    "Connect With the Life Centre",
  ]);

  for (const topic of [
    "Finances",
    "Credit Building",
    "Church and Faith",
    "Marriage",
    "Parenting",
  ]) {
    await expect(page.getByText(topic, { exact: true })).toBeVisible();
  }
  await expect(page.getByText("Coming Soon", { exact: true })).toHaveCount(4);
  await expect(
    page.getByText(
      '"As iron sharpens iron, so one person sharpens another."',
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByText("Proverbs 27:17", { exact: true })).toBeVisible();
  await expect(page.getByText("24854 Cathedral Lakes Pkwy", { exact: true })).toBeVisible();
  await expect(page.getByText("Spring, TX 77386", { exact: true })).toBeVisible();
});

test("Coaching submits the verified source form", async ({ page }) => {
  let submittedBody = "";
  await page.route(webflowFormEndpoint, async (route) => {
    submittedBody = route.request().postData() ?? "";
    await route.fulfill({ body: "{}", contentType: "application/json", status: 200 });
  });

  await page.goto("/coaching");
  const form = page.getByRole("form", { name: "Contact the Coaching ministry" });
  await form.getByLabel("Name").fill("Coaching Neighbor");
  await form.getByLabel("Email Address").fill("neighbor@example.com");
  await form.getByRole("button", { name: "Send Message" }).click();

  await expect(page.getByTestId("coaching-form-success")).toContainText(
    "We'll be in contact soon!",
  );
  const submitted = new URLSearchParams(submittedBody);
  expect(submitted.get("name")).toBe("nvygko");
  expect(submitted.get("pageId")).toBe("66aefedb03afe5fdd7af2dea");
  expect(submitted.get("elementId")).toBe(
    "cf2e2d4e-8700-3ccc-3eba-783bdfec934b",
  );
  expect(submitted.get("fields[Name]")).toBe("Coaching Neighbor");
  expect(submitted.get("fields[Email Address]")).toBe("neighbor@example.com");
});

test("Coaching serves complete local source images", async ({ page }) => {
  await page.goto("/coaching");

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
    "Cathedral Life Centre courtyard",
  ]);
});

test("Coaching responds at desktop, tablet, and mobile widths", async ({ page }) => {
  const heading = page.getByRole("heading", {
    name: "Enhancing life skills & aligning with God's purpose.",
  });
  const image = page.getByAltText("Cathedral Life Centre courtyard");
  const contactHeading = page.getByRole("heading", {
    name: "Connect With the Life Centre",
  });
  const form = page.getByRole("form", { name: "Contact the Coaching ministry" });

  await page.setViewportSize({ width: 1363, height: 936 });
  await page.goto("/coaching");
  const desktopHeading = await heading.boundingBox();
  const desktopImage = await image.boundingBox();
  const desktopContact = await contactHeading.boundingBox();
  const desktopForm = await form.boundingBox();
  expect(desktopHeading!.x).toBeLessThan(desktopImage!.x);
  expect(desktopContact!.x).toBeLessThan(desktopForm!.x);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1363);

  await page.setViewportSize({ width: 768, height: 1024 });
  const tabletHeading = await heading.boundingBox();
  const tabletImage = await image.boundingBox();
  const tabletContact = await contactHeading.boundingBox();
  const tabletForm = await form.boundingBox();
  expect(tabletImage!.y).toBeGreaterThan(tabletHeading!.y + tabletHeading!.height);
  expect(tabletForm!.y).toBeGreaterThan(tabletContact!.y + tabletContact!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(768);

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("Coaching has no unexpected automated accessibility violations", async ({
  page,
}) => {
  await page.goto("/coaching");
  const desktopResults = await new AxeBuilder({ page }).analyze();
  expect(unexpectedAccessibilityViolations(desktopResults.violations)).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const mobileResults = await new AxeBuilder({ page }).analyze();
  expect(unexpectedAccessibilityViolations(mobileResults.violations)).toEqual([]);
});
