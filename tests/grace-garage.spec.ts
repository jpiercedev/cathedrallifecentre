import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { unexpectedAccessibilityViolations } from "./accessibility";

const webflowFormEndpoint =
  "https://webflow.com/api/v1/form/663792c3759f35a04eea8483";

test("Grace Garage reproduces the verified copy, media, and destinations", async ({
  page,
}) => {
  const response = await page.goto("/grace-garage");

  expect(response?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe("/grace-garage");
  await expect(page).toHaveTitle("Grace Garage | Cathedral Life Centre");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.cathedrallifecentre.com/grace-garage",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "What is Grace Garage?",
  );
  await expect(page.locator("main h2")).toHaveText([
    "Complimentary oil changes and trustworthy vehicle inspections.",
    "Give the gift of hope to a single mom in need.",
    "Join the Grace Garage Team!",
    "Connect With the Life Centre",
  ]);
  await expect(page.getByText("Single moms", { exact: true })).toBeVisible();
  await expect(page.getByText("Widows", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Wives of deployed military", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Click to Donate" })).toHaveAttribute(
    "href",
    "https://deka.gives/grace-community-church-woodlands/give?purpose=294",
  );
  await expect(page.getByRole("link", { name: "Apply for Help" })).toHaveAttribute(
    "href",
    "https://gracewoodlands.churchcenter.com/people/forms/476964",
  );
  await expect(page.getByRole("link", { name: "Join the Team" })).toHaveAttribute(
    "href",
    "https://gracewoodlands.churchcenter.com/people/forms/486902",
  );
  await expect(
    page.getByRole("button", { name: "Play Donate to the Grace Garage today!" }),
  ).toBeVisible();
  await expect(page.getByText("24854 Cathedral Lakes Pkwy", { exact: true })).toBeVisible();
  await expect(page.getByText("Spring, TX 77386", { exact: true })).toBeVisible();
});

test("Grace Garage submits the verified source form", async ({ page }) => {
  let submittedBody = "";
  await page.route(webflowFormEndpoint, async (route) => {
    submittedBody = route.request().postData() ?? "";
    await route.fulfill({ body: "{}", contentType: "application/json", status: 200 });
  });

  await page.goto("/grace-garage");
  const form = page.getByRole("form", {
    name: "Contact the Grace Garage ministry",
  });
  await form.getByLabel("Name").fill("Grace Garage Neighbor");
  await form.getByLabel("Email Address").fill("neighbor@example.com");
  await form.getByRole("button", { name: "Send Message" }).click();

  await expect(page.getByTestId("grace-garage-form-success")).toContainText(
    "We'll be in contact soon!",
  );
  const submitted = new URLSearchParams(submittedBody);
  expect(submitted.get("name")).toBe("nvygko");
  expect(submitted.get("pageId")).toBe("675127f74333dcb6b0289c81");
  expect(submitted.get("elementId")).toBe(
    "cf2e2d4e-8700-3ccc-3eba-783bdfec934b",
  );
  expect(submitted.get("fields[Name]")).toBe("Grace Garage Neighbor");
  expect(submitted.get("fields[Email Address]")).toBe("neighbor@example.com");
});

test("Grace Garage serves complete local images", async ({ page }) => {
  await page.goto("/grace-garage");

  const images = page.locator("main img");
  await expect(images).toHaveCount(6);
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
    "Grace Garage service bays",
    "Grace Garage mechanics inspecting a vehicle",
    "Grace Garage team welcoming a guest",
    "",
    "Grace Garage volunteers working on a vehicle",
  ]);
});

test("Grace Garage responds at desktop, tablet, and mobile widths", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1363, height: 936 });
  await page.goto("/grace-garage");

  const overviewHeading = page.getByRole("heading", {
    name: "Complimentary oil changes and trustworthy vehicle inspections.",
  });
  const overviewImage = page.getByAltText("Grace Garage service bays");
  const desktopHeading = await overviewHeading.boundingBox();
  const desktopImage = await overviewImage.boundingBox();
  expect(desktopHeading).not.toBeNull();
  expect(desktopImage).not.toBeNull();
  expect(desktopHeading!.x).toBeLessThan(desktopImage!.x);

  const volunteerImage = page.getByAltText(
    "Grace Garage volunteers working on a vehicle",
  );
  const volunteerHeading = page.getByRole("heading", {
    name: "Join the Grace Garage Team!",
  });
  const desktopVolunteerImage = await volunteerImage.boundingBox();
  const desktopVolunteerHeading = await volunteerHeading.boundingBox();
  expect(desktopVolunteerImage!.x).toBeLessThan(desktopVolunteerHeading!.x);

  await page.setViewportSize({ width: 768, height: 1024 });
  const tabletHeading = await overviewHeading.boundingBox();
  const tabletImage = await overviewImage.boundingBox();
  expect(tabletImage!.y).toBeGreaterThan(tabletHeading!.y + tabletHeading!.height);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileVolunteerImage = await volunteerImage.boundingBox();
  const mobileVolunteerHeading = await volunteerHeading.boundingBox();
  expect(mobileVolunteerHeading!.y).toBeGreaterThan(
    mobileVolunteerImage!.y + mobileVolunteerImage!.height,
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("Grace Garage has no unexpected automated accessibility violations", async ({
  page,
}) => {
  await page.goto("/grace-garage");
  const desktopResults = await new AxeBuilder({ page }).analyze();
  expect(unexpectedAccessibilityViolations(desktopResults.violations)).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const mobileResults = await new AxeBuilder({ page }).analyze();
  expect(unexpectedAccessibilityViolations(mobileResults.violations)).toEqual([]);
});
