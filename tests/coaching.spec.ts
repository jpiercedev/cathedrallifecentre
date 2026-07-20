import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { unexpectedAccessibilityViolations } from "./accessibility";

const webflowFormEndpoint =
  "https://webflow.com/api/v1/form/663792c3759f35a04eea8483";

function expectNear(actual: number, expected: number, tolerance = 1) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
}

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
  const hero = page.locator("main > section").first();
  const heroHeading = page.getByRole("heading", { level: 1 });
  const programSection = page.getByRole("region", {
    name: "Enhancing life skills & aligning with God's purpose.",
  });
  const programGrid = programSection.locator(":scope > div");
  const heading = page.getByRole("heading", {
    name: "Enhancing life skills & aligning with God's purpose.",
  });
  const programCopy = heading.locator("..");
  const image = page.getByAltText("Cathedral Life Centre courtyard");
  const imageShell = image.locator("..");
  const contactSection = page.getByRole("region", {
    name: "Connect With the Life Centre",
  });
  const contactInner = contactSection.locator(":scope > div");
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
  const desktopQuoteLineHeights = await page
    .locator("main blockquote")
    .evaluateAll((quotes) => quotes.map((quote) => getComputedStyle(quote).lineHeight));
  expect(desktopQuoteLineHeights).toEqual(["24px", "24px"]);
  await expect(page.getByText("Finances", { exact: true }).locator("..")).toHaveCSS(
    "color",
    "rgb(28, 44, 91)",
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1363);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("link", { name: "Scroll to page content" }).click();
  await expect(page).toHaveURL(/#clc-content$/);
  expectNear(
    await page.locator("#clc-content").evaluate((element) =>
      element.getBoundingClientRect().top,
    ),
    0,
    2,
  );

  await page.setViewportSize({ width: 768, height: 1024 });
  const tabletHero = await hero.boundingBox();
  const tabletHeroHeading = await heroHeading.boundingBox();
  const tabletProgramCopy = await programCopy.boundingBox();
  const tabletProgramGrid = await programGrid.boundingBox();
  const tabletHeading = await heading.boundingBox();
  const tabletImage = await image.boundingBox();
  const tabletImageShell = await imageShell.boundingBox();
  const tabletContact = await contactHeading.boundingBox();
  const tabletForm = await form.boundingBox();
  expectNear(tabletHero!.height, 496);
  expectNear(tabletHeroHeading!.x, 24);
  expectNear(tabletProgramGrid!.x, 32);
  expectNear(tabletProgramGrid!.width, 704);
  expectNear(tabletImageShell!.height, 300);
  expectNear(
    tabletImageShell!.y - (tabletProgramCopy!.y + tabletProgramCopy!.height),
    40,
  );
  expect(tabletImage!.y).toBeGreaterThan(tabletHeading!.y + tabletHeading!.height);
  expect(tabletForm!.y).toBeGreaterThan(tabletContact!.y + tabletContact!.height);
  const tabletHeadingStyle = await heading.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      color: style.color,
      fontSize: Number.parseFloat(style.fontSize),
      lineHeight: Number.parseFloat(style.lineHeight),
    };
  });
  expect(tabletHeadingStyle.color).toBe("rgb(28, 44, 91)");
  expectNear(tabletHeadingStyle.fontSize, 34.685, 0.2);
  expectNear(tabletHeadingStyle.lineHeight, 43.35625, 0.2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(768);

  await page.setViewportSize({ width: 600, height: 900 });
  const compactTabletHeroStyle = await heroHeading.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      fontSize: style.fontSize,
      letterSpacing: style.letterSpacing,
      lineHeight: style.lineHeight,
    };
  });
  expect(compactTabletHeroStyle).toEqual({
    fontSize: "42px",
    letterSpacing: "-0.3835px",
    lineHeight: "47.04px",
  });

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileHero = await hero.boundingBox();
  const mobileHeroHeading = await heroHeading.boundingBox();
  const mobileProgramSection = await programSection.boundingBox();
  const mobileProgramGrid = await programGrid.boundingBox();
  const mobileProgramCopy = await programCopy.boundingBox();
  const mobileImageShell = await imageShell.boundingBox();
  const mobileContactSection = await contactSection.boundingBox();
  const mobileContactInner = await contactInner.boundingBox();
  const mobileForm = await form.boundingBox();
  expectNear(mobileHero!.height, 496);
  expectNear(mobileHeroHeading!.x, 24);
  expectNear(mobileProgramGrid!.x, 20);
  expectNear(mobileProgramGrid!.width, 350);
  expectNear(mobileImageShell!.height, 300);
  expectNear(
    mobileImageShell!.y - (mobileProgramCopy!.y + mobileProgramCopy!.height),
    28,
  );
  expectNear(mobileContactInner!.x, 24);
  expectNear(mobileContactInner!.width, 342);
  expectNear(mobileForm!.x, 24);
  const mobileStyles = await page.evaluate(() => {
    const read = (selector: string) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Missing responsive target: ${selector}`);
      const style = getComputedStyle(element);
      return {
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        paddingBottom: style.paddingBottom,
        paddingTop: style.paddingTop,
      };
    };
    return {
      contact: read("#coaching-contact-title"),
      contactSection: read('section[aria-labelledby="coaching-contact-title"]'),
      hero: read("#coaching-title"),
      programSection: read('section[aria-labelledby="coaching-program-title"]'),
    };
  });
  expect(mobileStyles.hero.fontSize).toBe("35.2px");
  expect(mobileStyles.hero.lineHeight).toBe("38.72px");
  await expect(heroHeading).toHaveCSS("letter-spacing", "-0.352px");
  expect(mobileStyles.contact.fontSize).toBe("28px");
  expect(mobileStyles.contact.lineHeight).toBe("35px");
  expect(mobileStyles.programSection.paddingTop).toBe("88px");
  expect(mobileStyles.programSection.paddingBottom).toBe("88px");
  expect(mobileStyles.contactSection.paddingTop).toBe("80px");
  expect(mobileStyles.contactSection.paddingBottom).toBe("80px");
  expect(mobileProgramSection!.y).toBeGreaterThan(mobileHero!.y);
  expect(mobileContactSection!.y).toBeGreaterThan(
    mobileImageShell!.y + mobileImageShell!.height,
  );
  const utilityButtonStyles = await page
    .getByRole("link", { name: "Learn More" })
    .evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        height: bounds.height,
        letterSpacing: style.letterSpacing,
        lineHeight: style.lineHeight,
        padding: style.padding,
      };
    });
  expect(utilityButtonStyles).toEqual({
    backgroundColor: "rgb(177, 97, 63)",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: "700",
    height: 21,
    letterSpacing: "0.7px",
    lineHeight: "15px",
    padding: "3px 10px",
  });
  await expect(
    page.getByText(
      "A Christ-centered refuge bringing hope, healing, and life to women and families in need.",
      { exact: true },
    ),
  ).toHaveCSS("text-align", "left");
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
