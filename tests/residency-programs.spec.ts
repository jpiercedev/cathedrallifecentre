import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { unexpectedAccessibilityViolations } from "./accessibility";

test("Residency Programs reproduces the verified content, metadata, and destinations", async ({
  page,
}) => {
  const response = await page.goto("/residency-programs");

  expect(response?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe("/residency-programs");
  await expect(page).toHaveTitle("Residency Programs | Cathedral Life Centre");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.cathedrallifecentre.com/residency-programs",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "A Safe Haven",
  );
  await expect(page.locator("main h2")).toHaveText([
    "Residency Programs",
    "Connect With the Life Centre",
  ]);
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText(
    "HomeMinistriesResidency Programs",
  );
  await expect(page.locator("main article")).toHaveCount(6);
  await expect(page.locator("main article h3")).toHaveText([
    "Women in Crisis",
    "Families in Crisis",
    "Disaster Relief Temporary Housing",
    "Families in Medical Crisis",
    "Foster Transition Housing 18+",
    "Crisis Pregnancy 18+",
  ]);
  await expect(
    page.getByRole("link", { name: "Apply For Residency" }),
  ).toHaveAttribute(
    "href",
    "https://docs.google.com/forms/d/e/1FAIpQLSfU-kTygPih0cx3bQ_e7oXbkpsiiQrhUp3gBv6BCFROkalRww/viewform",
  );
  await expect(
    page.getByText("Have questions about our classes or want to get involved?"),
  ).toBeVisible();
  await expect(
    page
      .getByRole("region", { name: "Connect With the Life Centre" })
      .getByRole("link", { name: "(832) 381-2306" }),
  ).toHaveAttribute("href", "tel:8323812306");
  await expect(page.getByRole("button", { name: "Send Message" })).toBeDisabled();
});

test("Residency Programs serves complete local images without browser errors", async ({
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

  await page.goto("/residency-programs");
  await page.waitForLoadState("networkidle");

  const images = page.locator("main img");
  await expect(images).toHaveCount(7);
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
    "Women in Crisis",
    "Families in Crisis",
    "Disaster Relief Temporary Housing",
    "Families in Medical Crisis",
    "Foster Transition Housing 18+",
    "Crisis Pregnancy 18+",
  ]);
  expect(consoleProblems).toEqual([]);
  expect(failedRequests).toEqual([]);
});

test("Residency Programs layout responds at desktop, tablet, and mobile widths", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1363, height: 936 });
  await page.goto("/residency-programs");
  const cards = page.locator("main article");
  const cardList = await cards.all();
  expect(cardList).toHaveLength(6);
  const desktopFirst = await cardList[0].boundingBox();
  const desktopSecond = await cardList[1].boundingBox();
  const desktopFourth = await cardList[3].boundingBox();
  expect(desktopFirst).not.toBeNull();
  expect(desktopSecond).not.toBeNull();
  expect(desktopFourth).not.toBeNull();
  expect(Math.abs(desktopFirst!.y - desktopSecond!.y)).toBeLessThan(2);
  expect(desktopFourth!.y).toBeGreaterThan(desktopFirst!.y + desktopFirst!.height);

  const contactHeading = page.getByRole("heading", {
    level: 2,
    name: "Connect With the Life Centre",
  });
  const contactForm = page.locator("main form");
  const desktopHeading = await contactHeading.boundingBox();
  const desktopForm = await contactForm.boundingBox();
  expect(desktopHeading).not.toBeNull();
  expect(desktopForm).not.toBeNull();
  expect(desktopHeading!.x).toBeLessThan(desktopForm!.x);

  await page.setViewportSize({ width: 768, height: 1024 });
  const tabletFirst = await cardList[0].boundingBox();
  const tabletSecond = await cardList[1].boundingBox();
  const tabletThird = await cardList[2].boundingBox();
  expect(tabletFirst).not.toBeNull();
  expect(tabletSecond).not.toBeNull();
  expect(tabletThird).not.toBeNull();
  expect(Math.abs(tabletFirst!.y - tabletSecond!.y)).toBeLessThan(2);
  expect(tabletThird!.y).toBeGreaterThan(tabletFirst!.y + tabletFirst!.height);
  const tabletHeading = await contactHeading.boundingBox();
  const tabletForm = await contactForm.boundingBox();
  expect(tabletHeading).not.toBeNull();
  expect(tabletForm).not.toBeNull();
  expect(tabletForm!.y).toBeGreaterThan(tabletHeading!.y + tabletHeading!.height);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileFirst = await cardList[0].boundingBox();
  const mobileSecond = await cardList[1].boundingBox();
  expect(mobileFirst).not.toBeNull();
  expect(mobileSecond).not.toBeNull();
  expect(mobileSecond!.y).toBeGreaterThan(mobileFirst!.y + mobileFirst!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("Residency Programs has no unexpected automated accessibility violations", async ({
  page,
}) => {
  await page.goto("/residency-programs");
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
