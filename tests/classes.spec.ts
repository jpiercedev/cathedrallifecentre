import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { unexpectedAccessibilityViolations } from "./accessibility";

const webflowFormEndpoint =
  "https://webflow.com/api/v1/form/663792c3759f35a04eea8483";

function expectNear(actual: number, expected: number, tolerance = 1) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
}

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

  const programRegion = page.getByRole("region", {
    name: "Equipping you with essential life skills & Biblical study.",
  });
  const listText = await programRegion.locator("ul").evaluateAll((lists) =>
    lists.map((list) =>
      Array.from(list.querySelectorAll(":scope > li")).map(
        (item) => item.textContent?.trim() ?? "",
      ),
    ),
  );
  expect(listText).toEqual([
    [
      "Bible Study and Theology Classes",
      "CPR and First Aid Certification Course",
      "Car Care 101",
      "Parenting",
      "Personal Finance",
    ],
    [
      "Job Preparation Class — Interview Skills, Resume Writing, Helpful Tips",
      "Small Business and Entrepreneurship",
      "College/Higher Education Guidance",
      "Disaster Preparedness and Emergency Planning",
      "English Language Courses",
      "Health and Nutrition Classes",
      "Affordable Meal Planning and Cooking",
    ],
  ]);
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
  const hero = page.locator("main > section").first();
  const programSection = page.getByRole("region", {
    name: "Equipping you with essential life skills & Biblical study.",
  });
  const programGrid = programSection.locator(":scope > div");
  const heading = page.getByRole("heading", {
    name: "Equipping you with essential life skills & Biblical study.",
  });
  const image = page.getByAltText("Cathedral Life Centre courtyard");
  const imageShell = image.locator("..");
  const programLists = programSection.locator("ul");
  const currentList = programLists.nth(0);
  const comingList = programLists.nth(1);
  const contactSection = page.getByRole("region", {
    name: "Connect With the Life Centre",
  });
  const contactHeading = page.getByRole("heading", {
    name: "Connect With the Life Centre",
  });
  const form = page.getByRole("form", { name: "Contact the Classes ministry" });

  await page.setViewportSize({ width: 1363, height: 936 });
  await page.goto("/classes");
  await expect(programLists).toHaveCount(2);
  const desktopHero = await hero.boundingBox();
  const desktopProgram = await programSection.boundingBox();
  const desktopGrid = await programGrid.boundingBox();
  const desktopHeading = await heading.boundingBox();
  const desktopImage = await image.boundingBox();
  const desktopImageShell = await imageShell.boundingBox();
  const desktopCurrentList = await currentList.boundingBox();
  const desktopComingList = await comingList.boundingBox();
  const desktopContact = await contactHeading.boundingBox();
  const desktopForm = await form.boundingBox();
  expectNear(desktopHero!.height, 496);
  expectNear(desktopProgram!.y, 631.5);
  expectNear(desktopProgram!.height, 1011);
  expectNear(desktopGrid!.x, 98);
  expectNear(desktopGrid!.width, 1152);
  expectNear(desktopHeading!.x, 138);
  expectNear(desktopHeading!.y, 761);
  expectNear(desktopHeading!.width, 504);
  expectNear(desktopHeading!.height, 156, 1.5);
  expectNear(desktopImageShell!.x, 706);
  expectNear(desktopImageShell!.y, 720.5);
  expectNear(desktopImageShell!.width, 504);
  expectNear(desktopImageShell!.height, 300);
  expectNear(desktopCurrentList!.y, 1091.5);
  expectNear(desktopCurrentList!.height, 156);
  expectNear(desktopComingList!.y, 1310.5);
  expectNear(desktopComingList!.height, 244);
  expect(desktopHeading!.x).toBeLessThan(desktopImage!.x);
  expect(desktopContact!.x).toBeLessThan(desktopForm!.x);
  const firstUpcoming = comingList.locator(":scope > li").first();
  const firstUpcomingStyle = await firstUpcoming.evaluate((element) => {
    const style = getComputedStyle(element);
    const bullet = getComputedStyle(element, "::before");
    return {
      alignItems: style.alignItems,
      columnGap: style.columnGap,
      fontSize: style.fontSize,
      lineHeight: style.lineHeight,
      paddingLeft: style.paddingLeft,
      bulletBackground: bullet.backgroundColor,
      bulletHeight: bullet.height,
      bulletMarginTop: bullet.marginTop,
      bulletWidth: bullet.width,
    };
  });
  expect(firstUpcomingStyle).toEqual({
    alignItems: "flex-start",
    columnGap: "12px",
    fontSize: "14px",
    lineHeight: "20px",
    paddingLeft: "8px",
    bulletBackground: "rgba(177, 144, 79, 0.45)",
    bulletHeight: "6px",
    bulletMarginTop: "5px",
    bulletWidth: "6px",
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1363);

  await page.setViewportSize({ width: 768, height: 1024 });
  expectNear((await imageShell.boundingBox())!.height, 300);
  expect((await image.boundingBox())!.y).toBeGreaterThan((await heading.boundingBox())!.y);
  expect((await form.boundingBox())!.y).toBeGreaterThan((await contactHeading.boundingBox())!.y);
  await expect(currentList.locator(":scope > li").first()).toHaveCSS(
    "color",
    "rgb(28, 44, 91)",
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(768);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileProgram = await programSection.boundingBox();
  const mobileContact = await contactSection.boundingBox();
  const mobileImageShell = await imageShell.boundingBox();
  expectNear(mobileProgram!.y, 625, 2);
  expectNear(mobileProgram!.height, 1587.3125, 3);
  expectNear(mobileContact!.y, 2212.3125, 3);
  expectNear(mobileImageShell!.height, 300);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("Classes scroll cue lands on the source-aligned content anchor", async ({ page }) => {
  await page.setViewportSize({ width: 1363, height: 936 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/classes");

  const programSection = page.getByRole("region", {
    name: "Equipping you with essential life skills & Biblical study.",
  });
  const anchor = page.locator("#clc-content");
  const sectionBounds = await programSection.boundingBox();
  const anchorBounds = await anchor.boundingBox();
  expectNear(anchorBounds!.y - sectionBounds!.y, 87, 0.2);

  await page.getByRole("link", { name: "Scroll to page content" }).click();
  await expect(page).toHaveURL(/#clc-content$/);
  expectNear(
    await anchor.evaluate((element) => element.getBoundingClientRect().top),
    0,
    2,
  );
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
