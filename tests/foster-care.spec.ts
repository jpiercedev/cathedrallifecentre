import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { unexpectedAccessibilityViolations } from "./accessibility";

const webflowFormEndpoint =
  "https://webflow.com/api/v1/form/663792c3759f35a04eea8483";

test("Foster Care reproduces the verified metadata, copy, and program states", async ({
  page,
}) => {
  const response = await page.goto("/foster-care");

  expect(response?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe("/foster-care");
  await expect(page).toHaveTitle("Foster Care | Cathedral Life Centre");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.cathedrallifecentre.com/foster-care",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "A powerful expression of God's Love",
  );
  await expect(page.locator("main h2")).toHaveText([
    "Building a Thriving Ministry for Families & Children",
    "Well-Prepared. Well-Supported. Ready to Love.",
    "Connect With Our Foster Care Ministry",
  ]);
  await expect(page.locator("blockquote")).toContainText(
    "Let us not love with words or speech but with actions and in truth.",
  );
  await expect(page.locator("blockquote cite")).toHaveText("1 John 3:18");
  await expect(page.locator("main article h3")).toHaveText([
    "Foster Care",
    "Foster Transition",
    "Foster Support",
    "Adoption Support",
  ]);
  await expect(page.getByText("Active Program", { exact: true })).toBeVisible();
  await expect(page.getByText("Active Program · 18+", { exact: true })).toBeVisible();
  await expect(page.getByText("Coming Soon", { exact: true })).toHaveCount(2);
  await expect(page.getByRole("link", { name: "Find Out More" })).toHaveAttribute(
    "href",
    "/contact",
  );
  await expect(page.getByText("1 Hallidie Plaza, Ste 725")).toBeVisible();
  await expect(page.getByText("San Francisco, CA 94102")).toBeVisible();
  await expect(
    page
      .getByRole("region", { name: "Connect With Our Foster Care Ministry" })
      .getByRole("link", { name: "(415) 345-3735" }),
  ).toHaveAttribute("href", "tel:4153453735");
});

test("Foster Care submits the verified source form and exposes its success state", async ({
  page,
}) => {
  let submittedBody = "";
  await page.route(webflowFormEndpoint, async (route) => {
    submittedBody = route.request().postData() ?? "";
    await route.fulfill({ body: "{}", contentType: "application/json", status: 200 });
  });

  await page.goto("/foster-care");
  const form = page.getByRole("form", { name: "Contact the Foster Care ministry" });
  await form.getByLabel("Name").fill("Foster Family");
  await form.getByLabel("Email Address").fill("family@example.com");
  await form.getByRole("button", { name: "Send Message" }).click();

  await expect(page.getByTestId("foster-form-success")).toContainText(
    "We'll be in contact soon!",
  );
  const submitted = new URLSearchParams(submittedBody);
  expect(submitted.get("name")).toBe("wvkizi");
  expect(submitted.get("pageId")).toBe("66aef778716ef72443d85f70");
  expect(submitted.get("elementId")).toBe(
    "0b593cc8-6028-fa4a-63b8-8f8d5cd1a018",
  );
  expect(submitted.get("fields[Name]")).toBe("Foster Family");
  expect(submitted.get("fields[Email Address]")).toBe("family@example.com");
  expect(submitted.get("fields[Message]")).toBe("");
});

test("Foster Care serves complete local images without browser errors", async ({
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

  await page.goto("/foster-care");
  await page.waitForLoadState("networkidle");

  const images = page.locator("main img");
  await expect(images).toHaveCount(3);
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
    "Woman sitting on porch overlooking the courtyard",
    "Mom playing with baby",
  ]);
  expect(consoleProblems).toEqual([]);
  expect(failedRequests).toEqual([]);
});

test("Foster Care responds at desktop, tablet, and mobile widths", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1363, height: 936 });
  await page.goto("/foster-care");
  const heartImage = page.getByAltText(
    "Woman sitting on porch overlooking the courtyard",
  );
  const heartHeading = page.getByRole("heading", {
    name: "Building a Thriving Ministry for Families & Children",
  });
  const desktopImage = await heartImage.boundingBox();
  const desktopHeading = await heartHeading.boundingBox();
  expect(desktopImage).not.toBeNull();
  expect(desktopHeading).not.toBeNull();
  expect(desktopImage!.x).toBeLessThan(desktopHeading!.x);

  const programsHeading = page.getByRole("heading", {
    name: "Well-Prepared. Well-Supported. Ready to Love.",
  });
  const programList = page.locator("main article").first();
  const desktopProgramsHeading = await programsHeading.boundingBox();
  const desktopProgramList = await programList.boundingBox();
  expect(desktopProgramsHeading).not.toBeNull();
  expect(desktopProgramList).not.toBeNull();
  expect(desktopProgramsHeading!.x).toBeLessThan(desktopProgramList!.x);

  await page.setViewportSize({ width: 768, height: 1024 });
  const tabletProgramsHeading = await programsHeading.boundingBox();
  const tabletProgramList = await programList.boundingBox();
  expect(tabletProgramsHeading).not.toBeNull();
  expect(tabletProgramList).not.toBeNull();
  expect(tabletProgramList!.y).toBeGreaterThan(
    tabletProgramsHeading!.y + tabletProgramsHeading!.height,
  );

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileImage = await heartImage.boundingBox();
  const mobileHeading = await heartHeading.boundingBox();
  expect(mobileImage).not.toBeNull();
  expect(mobileHeading).not.toBeNull();
  expect(mobileHeading!.y).toBeGreaterThan(mobileImage!.y + mobileImage!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("Foster Care has no unexpected automated accessibility violations", async ({
  page,
}) => {
  await page.goto("/foster-care");
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
