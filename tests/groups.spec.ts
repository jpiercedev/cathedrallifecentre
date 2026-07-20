import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { unexpectedAccessibilityViolations } from "./accessibility";

const webflowFormEndpoint =
  "https://webflow.com/api/v1/form/663792c3759f35a04eea8483";

function expectNear(actual: number, expected: number, tolerance = 1) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
}

test("Groups reproduces the verified metadata, copy, and program lists", async ({ page }) => {
  const response = await page.goto("/groups");

  expect(response?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe("/groups");
  await expect(page).toHaveTitle("Groups | Cathedral Life Centre");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.cathedrallifecentre.com/groups",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Support & community",
  );
  await expect(page.locator("main h2")).toHaveText([
    "No one has to face a struggle alone.",
    "Connect With the Life Centre",
  ]);
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText(
    "Coaching",
  );

  const programRegion = page.getByRole("region", {
    name: "No one has to face a struggle alone.",
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
      "Healing Hearts Grief Support",
      "Celebrate Recovery",
      "Stronger Together: Single Moms Support",
      "Safe Haven: Abused Women Support",
      "Homeschool Parents Fellowship Group",
    ],
    [
      "Divorce",
      "Postpartum",
      "Miscarriage/Infant Loss",
      "Abortion Recovery",
      "Infertility",
      "Eating Disorders",
      "Parents of Medically-Fragile Children",
      "Parents of Special Needs Children",
      "Parents of Prodigals",
    ],
  ]);
  await expect(page.getByRole("link", { name: "Volunteer form" })).toHaveAttribute(
    "href",
    "/volunteer",
  );
  await expect(page.getByText("Ecclesiastes 4:9–10", { exact: true })).toBeVisible();
});

test("Groups submits the verified source form", async ({ page }) => {
  let submittedBody = "";
  await page.route(webflowFormEndpoint, async (route) => {
    submittedBody = route.request().postData() ?? "";
    await route.fulfill({ body: "{}", contentType: "application/json", status: 200 });
  });

  await page.goto("/groups");
  const form = page.getByRole("form", { name: "Contact the Groups ministry" });
  await form.getByLabel("Name").fill("Groups Neighbor");
  await form.getByLabel("Email Address").fill("neighbor@example.com");
  await form.getByRole("button", { name: "Send Message" }).click();

  await expect(page.getByTestId("groups-form-success")).toContainText(
    "We'll be in contact soon!",
  );
  const submitted = new URLSearchParams(submittedBody);
  expect(submitted.get("name")).toBe("nvygko");
  expect(submitted.get("pageId")).toBe("66aeff485f8cf23c39fefb4e");
  expect(submitted.get("elementId")).toBe(
    "cf2e2d4e-8700-3ccc-3eba-783bdfec934b",
  );
  expect(submitted.get("fields[Name]")).toBe("Groups Neighbor");
  expect(submitted.get("fields[Email Address]")).toBe("neighbor@example.com");
});

test("Groups serves complete local source images", async ({ page }) => {
  await page.goto("/groups");

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
    "Cathedral Life Centre common room",
  ]);
});

test("Groups responds at desktop, tablet, and mobile widths", async ({ page }) => {
  const hero = page.locator("main > section").first();
  const programSection = page.getByRole("region", {
    name: "No one has to face a struggle alone.",
  });
  const programGrid = programSection.locator(":scope > div");
  const heading = page.getByRole("heading", {
    name: "No one has to face a struggle alone.",
  });
  const image = page.getByAltText("Cathedral Life Centre common room");
  const imageShell = image.locator("..");
  const note = page.getByRole("link", { name: "Volunteer form" }).locator("..");
  const programLists = programSection.locator("ul");
  const activeList = programLists.nth(0);
  const comingList = programLists.nth(1);
  const contactSection = page.getByRole("region", {
    name: "Connect With the Life Centre",
  });
  const contactInner = contactSection.locator(":scope > div");
  const contactHeading = page.getByRole("heading", {
    name: "Connect With the Life Centre",
  });
  const contactCopy = contactHeading.locator("..");
  const form = page.getByRole("form", { name: "Contact the Groups ministry" });

  await page.setViewportSize({ width: 1363, height: 936 });
  await page.goto("/groups");
  await expect(programLists).toHaveCount(2);
  const desktopHero = await hero.boundingBox();
  const desktopProgram = await programSection.boundingBox();
  const desktopGrid = await programGrid.boundingBox();
  const desktopHeading = await heading.boundingBox();
  const desktopImage = await image.boundingBox();
  const desktopImageShell = await imageShell.boundingBox();
  const desktopContact = await contactHeading.boundingBox();
  const desktopForm = await form.boundingBox();
  expectNear(desktopHero!.height, 496);
  expectNear(desktopProgram!.y, 631.5);
  expectNear(desktopProgram!.height, 980.5);
  expectNear(
    desktopGrid!.x,
    ((await page.evaluate(() => document.documentElement.clientWidth)) - desktopGrid!.width) / 2,
  );
  expectNear(desktopGrid!.width, 1152);
  expectNear(desktopImageShell!.x - desktopGrid!.x, 608);
  expectNear(desktopImageShell!.width, 504);
  expectNear(desktopImageShell!.height, 280);
  expect(desktopHeading!.x).toBeLessThan(desktopImage!.x);
  expect(desktopContact!.x).toBeLessThan(desktopForm!.x);
  const noteStyle = await note.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      backgroundColor: style.backgroundColor,
      borderColor: style.borderColor,
      borderRadius: style.borderRadius,
      lineHeight: style.lineHeight,
    };
  });
  expect(noteStyle).toEqual({
    backgroundColor: "rgba(86, 95, 76, 0.08)",
    borderColor: "rgba(86, 95, 76, 0.2)",
    borderRadius: "12px",
    lineHeight: "25.2px",
  });
  const desktopComingStyle = await comingList.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      columnGap: style.columnGap,
      gridTemplateColumns: style.gridTemplateColumns,
      rowGap: style.rowGap,
    };
  });
  expect(desktopComingStyle).toEqual({
    columnGap: "16px",
    gridTemplateColumns: "244px 244px",
    rowGap: "8px",
  });
  const desktopComingRects = await comingList.locator(":scope > li").evaluateAll(
    (items) => items.map((item) => item.getBoundingClientRect().toJSON()),
  );
  expectNear(desktopComingRects[0].y, desktopComingRects[1].y, 0.2);
  expectNear(desktopComingRects[1].x - desktopComingRects[0].x, 260, 0.2);
  await expect(activeList.locator(":scope > li").first()).toHaveCSS(
    "color",
    "rgb(86, 95, 76)",
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1363);

  await page.setViewportSize({ width: 768, height: 1024 });
  const tabletImageShell = await imageShell.boundingBox();
  const tabletContactInner = await contactInner.boundingBox();
  const tabletContactCopy = await contactCopy.boundingBox();
  const tabletForm = await form.boundingBox();
  expectNear(tabletImageShell!.height, 280);
  expectNear(tabletContactInner!.x, 32);
  expectNear(tabletContactInner!.width, 704);
  expectNear(tabletContactCopy!.x, 56);
  expectNear(tabletContactCopy!.width, 656);
  expectNear(tabletForm!.x, 56);
  expectNear(tabletForm!.width, 656);
  const tabletContactStyle = await contactSection.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      paddingBottom: style.paddingBottom,
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
      paddingTop: style.paddingTop,
    };
  });
  expect(tabletContactStyle).toEqual({
    paddingBottom: "64px",
    paddingLeft: "32px",
    paddingRight: "32px",
    paddingTop: "64px",
  });
  await expect(activeList.locator(":scope > li").first()).toHaveCSS(
    "color",
    "rgb(28, 44, 91)",
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(768);

  await page.setViewportSize({ width: 600, height: 900 });
  const compactListRects = await comingList.locator(":scope > li").evaluateAll(
    (items) => items.slice(0, 2).map((item) => item.getBoundingClientRect().toJSON()),
  );
  expectNear(compactListRects[0].x, compactListRects[1].x, 0.2);
  expect(compactListRects[1].y).toBeGreaterThan(compactListRects[0].y);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileImageShell = await imageShell.boundingBox();
  const mobileContactCopy = await contactCopy.boundingBox();
  const mobileForm = await form.boundingBox();
  expectNear(mobileImageShell!.height, 280);
  expectNear(mobileContactCopy!.x, 44);
  expectNear(mobileContactCopy!.width, 302);
  expectNear(mobileForm!.x, 44);
  expectNear(mobileForm!.width, 302);
  const mobileContactStyle = await contactSection.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      paddingBottom: style.paddingBottom,
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
      paddingTop: style.paddingTop,
    };
  });
  expect(mobileContactStyle).toEqual({
    paddingBottom: "48px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "48px",
  });
  const mobileComingStyle = await comingList.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      columnGap: style.columnGap,
      gridTemplateColumns: style.gridTemplateColumns,
      rowGap: style.rowGap,
    };
  });
  expect(mobileComingStyle.columnGap).toBe("16px");
  expect(mobileComingStyle.rowGap).toBe("10px");
  expect(mobileComingStyle.gridTemplateColumns.split(" ")).toHaveLength(2);
  const mobileComingRects = await comingList.locator(":scope > li").evaluateAll(
    (items) => items.slice(0, 2).map((item) => item.getBoundingClientRect().toJSON()),
  );
  expectNear(mobileComingRects[0].y, mobileComingRects[1].y, 0.2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("Groups scroll cue lands on the source-aligned content anchor", async ({ page }) => {
  await page.setViewportSize({ width: 1363, height: 936 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/groups");

  const programSection = page.getByRole("region", {
    name: "No one has to face a struggle alone.",
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

test("Groups has no unexpected automated accessibility violations", async ({ page }) => {
  await page.goto("/groups");
  const desktopResults = await new AxeBuilder({ page }).analyze();
  expect(unexpectedAccessibilityViolations(desktopResults.violations)).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const mobileResults = await new AxeBuilder({ page }).analyze();
  expect(unexpectedAccessibilityViolations(mobileResults.violations)).toEqual([]);
});
