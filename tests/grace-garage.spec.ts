import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { unexpectedAccessibilityViolations } from "./accessibility";

const webflowFormEndpoint =
  "https://webflow.com/api/v1/form/663792c3759f35a04eea8483";

function expectNear(actual: number, expected: number, tolerance = 1) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
}

const primaryButtonShadow =
  "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px";

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

test("Grace Garage external actions preserve same-tab source behavior", async ({
  page,
}) => {
  await page.goto("/grace-garage");

  for (const label of [
    "Click to Donate",
    "Apply for Help",
    "Join the Team",
  ] as const) {
    const action = page.getByRole("link", { name: label });
    await expect(action).toHaveAttribute("href", /^https:\/\//);
    await expect(action).not.toHaveAttribute("target", "_blank");
  }
});

test("Grace Garage primary actions retain the specified production styling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1363, height: 936 });
  await page.goto("/grace-garage");

  const primaryActions = [
    page.getByRole("link", { name: "Click to Donate" }),
    page.getByRole("link", { name: "Apply for Help" }),
  ];

  for (const [index, action] of primaryActions.entries()) {
    const style = await action.evaluate((element) => {
      const computed = getComputedStyle(element);
      return {
        alignSelf: computed.alignSelf,
        aspectRatio: computed.aspectRatio,
        backgroundColor: computed.backgroundColor,
        border: computed.border,
        borderRadius: computed.borderRadius,
        boxShadow: computed.boxShadow,
        boxSizing: computed.boxSizing,
        color: computed.color,
        display: computed.display,
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        letterSpacing: computed.letterSpacing,
        lineHeight: computed.lineHeight,
        margin: computed.margin,
        outlineColor: computed.outlineColor,
        padding: computed.padding,
        textDecorationLine: computed.textDecorationLine,
        textTransform: computed.textTransform,
        transitionProperty: computed.transitionProperty,
        visibility: computed.visibility,
      };
    });

    expect(style).toEqual({
      alignSelf: "center",
      aspectRatio: "auto",
      backgroundColor: "rgb(223, 123, 79)",
      border: "3px solid rgba(255, 255, 255, 0.25)",
      borderRadius: "30px",
      boxShadow: primaryButtonShadow,
      boxSizing: "border-box",
      color: "rgb(255, 255, 255)",
      display: "block",
      fontFamily: "Montserrat, sans-serif",
      fontSize: "11px",
      fontWeight: "700",
      letterSpacing: "1.54px",
      lineHeight: "16.5px",
      margin: "0px",
      outlineColor: "rgb(255, 255, 255)",
      padding: "12px 32px",
      textDecorationLine: "none",
      textTransform: "uppercase",
      transitionProperty: "none",
      visibility: "visible",
    });

    const actionBox = await action.boundingBox();
    const layoutParent = index === 0 ? action.locator("../..") : action.locator("..");
    const wrapperBox = await layoutParent.boundingBox();
    expect(actionBox).not.toBeNull();
    expect(wrapperBox).not.toBeNull();
    expect(actionBox!.width).toBeLessThan(wrapperBox!.width);
  }
});

test("Grace Garage video loads on demand without browser or network errors", async ({
  page,
}) => {
  const consoleProblems: string[] = [];
  const failedRequests: string[] = [];
  let vimeoRequests = 0;

  page.on("console", (message) => {
    if (message.type() === "error") consoleProblems.push(message.text());
  });
  page.on("requestfailed", (request) => {
    failedRequests.push(`${request.method()} ${request.url()}`);
  });
  await page.route("https://player.vimeo.com/video/**", async (route) => {
    vimeoRequests += 1;
    await route.fulfill({
      body: "<!doctype html><title>Grace Garage Vimeo test frame</title>",
      contentType: "text/html",
      status: 200,
    });
  });

  await page.goto("/grace-garage");
  const playButton = page.getByRole("button", {
    name: "Play Donate to the Grace Garage today!",
  });
  await expect(playButton).toBeVisible();
  await expect(page.getByTitle("Donate to the Grace Garage today!")).toHaveCount(0);
  await playButton.click();

  const frame = page.getByTitle("Donate to the Grace Garage today!");
  await expect(frame).toBeVisible();
  await expect(frame).toHaveAttribute(
    "src",
    /^https:\/\/player\.vimeo\.com\/video\/1039280625\?(?=.*\bautoplay=1\b)(?=.*\bdnt=1\b)/,
  );
  await expect(frame).toHaveAttribute(
    "allow",
    /autoplay; fullscreen; encrypted-media; picture-in-picture/,
  );
  await expect(playButton).toHaveCount(0);
  await page.waitForLoadState("networkidle");

  expect(vimeoRequests).toBe(1);
  expect(consoleProblems).toEqual([]);
  expect(failedRequests).toEqual([]);
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
  await page.evaluate(() => document.fonts.ready);

  const hero = page.locator("main > section").first();
  const heroHeading = page.getByRole("heading", { level: 1 });
  const overviewSection = page.getByRole("region", {
    name: "Complimentary oil changes and trustworthy vehicle inspections.",
  });
  const overviewHeading = page.getByRole("heading", {
    name: "Complimentary oil changes and trustworthy vehicle inspections.",
  });
  const overviewCopy = overviewHeading.locator("..");
  const gallery = page.getByLabel("Grace Garage gallery");
  const overviewImage = page.getByAltText("Grace Garage service bays");
  const galleryMain = overviewImage.locator("..");
  const gallerySmall = page
    .getByAltText("Grace Garage mechanics inspecting a vehicle")
    .locator("..");
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
  const volunteerCopy = volunteerHeading.locator("..");
  const contactSection = page.getByRole("region", {
    name: "Connect With the Life Centre",
  });
  const contactInner = contactSection.locator(":scope > div");
  const contactForm = page.getByRole("form", {
    name: "Contact the Grace Garage ministry",
  });
  const desktopVolunteerImage = await volunteerImage.boundingBox();
  const desktopVolunteerHeading = await volunteerHeading.boundingBox();
  expect(desktopVolunteerImage!.x).toBeLessThan(desktopVolunteerHeading!.x);

  await page.setViewportSize({ width: 768, height: 1024 });
  const tabletHero = await hero.boundingBox();
  const tabletHeroHeading = await heroHeading.boundingBox();
  const tabletOverviewCopy = await overviewCopy.boundingBox();
  const tabletHeading = await overviewHeading.boundingBox();
  const tabletImage = await overviewImage.boundingBox();
  const tabletGallery = await gallery.boundingBox();
  const tabletVolunteerImage = await volunteerImage.boundingBox();
  const tabletVolunteerCopy = await volunteerCopy.boundingBox();
  expect(tabletHero).not.toBeNull();
  expect(tabletHeroHeading).not.toBeNull();
  expect(tabletOverviewCopy).not.toBeNull();
  expect(tabletImage!.y).toBeGreaterThan(tabletHeading!.y + tabletHeading!.height);
  expect(tabletGallery).not.toBeNull();
  expect(tabletVolunteerImage).not.toBeNull();
  expect(tabletVolunteerCopy).not.toBeNull();
  expectNear(tabletHero!.height, 496);
  expectNear(tabletHeroHeading!.x, 24);
  expectNear(tabletGallery!.x, 32);
  expectNear(tabletGallery!.width, 704);
  expectNear(tabletGallery!.height, 496);
  expectNear(
    tabletGallery!.y - (tabletOverviewCopy!.y + tabletOverviewCopy!.height),
    40,
  );
  expectNear(tabletVolunteerImage!.x, 32);
  expectNear(tabletVolunteerImage!.width, 704);
  expectNear(tabletVolunteerImage!.height, 500);
  expectNear(
    tabletVolunteerCopy!.y -
      (tabletVolunteerImage!.y + tabletVolunteerImage!.height),
    40,
  );

  const tabletHeadingStyles = await Promise.all(
    [overviewHeading, volunteerHeading].map((heading) =>
      heading.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          color: style.color,
          fontSize: Number.parseFloat(style.fontSize),
        };
      }),
    ),
  );
  for (const style of tabletHeadingStyles) {
    expectNear(style.fontSize, 34.685, 0.2);
    expect(style.color).toBe("rgb(28, 44, 91)");
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(768);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileHero = await hero.boundingBox();
  const mobileHeroHeading = await heroHeading.boundingBox();
  const mobileOverviewSection = await overviewSection.boundingBox();
  const mobileOverviewCopy = await overviewCopy.boundingBox();
  const mobileGallery = await gallery.boundingBox();
  const mobileGalleryMain = await galleryMain.boundingBox();
  const mobileGallerySmall = await gallerySmall.boundingBox();
  const mobileVolunteerImage = await volunteerImage.boundingBox();
  const mobileVolunteerHeading = await volunteerHeading.boundingBox();
  const mobileVolunteerCopy = await volunteerCopy.boundingBox();
  const mobileContactInner = await contactInner.boundingBox();
  const mobileContactForm = await contactForm.boundingBox();
  expect(mobileHero).not.toBeNull();
  expect(mobileHeroHeading).not.toBeNull();
  expect(mobileOverviewSection).not.toBeNull();
  expect(mobileOverviewCopy).not.toBeNull();
  expect(mobileGallery).not.toBeNull();
  expect(mobileGalleryMain).not.toBeNull();
  expect(mobileGallerySmall).not.toBeNull();
  expect(mobileVolunteerImage).not.toBeNull();
  expect(mobileVolunteerHeading).not.toBeNull();
  expect(mobileVolunteerCopy).not.toBeNull();
  expect(mobileContactInner).not.toBeNull();
  expect(mobileContactForm).not.toBeNull();
  expect(mobileVolunteerHeading!.y).toBeGreaterThan(
    mobileVolunteerImage!.y + mobileVolunteerImage!.height,
  );
  expectNear(mobileHero!.height, 496);
  expectNear(mobileHeroHeading!.x, 24);
  expectNear(mobileOverviewCopy!.x, 20);
  expectNear(mobileGallery!.x, 20);
  expectNear(mobileGallery!.width, 350);
  expectNear(mobileGallery!.height, 496);
  expectNear(mobileGalleryMain!.height, 300);
  expectNear(mobileGallerySmall!.height, 180);
  expectNear(mobileVolunteerImage!.x, 20);
  expectNear(mobileVolunteerImage!.width, 350);
  expectNear(mobileVolunteerImage!.height, 500);
  expectNear(mobileContactInner!.x, 0);
  expectNear(mobileContactForm!.x, 24);

  const mobileActions = [
    [page.getByRole("link", { name: "Apply for Help" }), 190.671875],
    [page.getByRole("link", { name: "Join the Team" }), 176.34375],
  ] as const;
  for (const [action, expectedWidth] of mobileActions) {
    const actionBox = await action.boundingBox();
    expect(actionBox).not.toBeNull();
    expectNear(actionBox!.x, 20);
    expectNear(actionBox!.width, expectedWidth);
  }

  const mobileGeometryStyles = await page.evaluate(() => {
    const readTypography = (selector: string) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Missing typography target: ${selector}`);
      const style = getComputedStyle(element);
      return {
        color: style.color,
        fontSize: Number.parseFloat(style.fontSize),
        lineHeight: Number.parseFloat(style.lineHeight),
      };
    };
    const impact = document.querySelector(
      'section[aria-labelledby="grace-garage-impact-title"]',
    );
    const form = document.querySelector(
      'form[aria-label="Contact the Grace Garage ministry"]',
    );
    if (!impact || !form) throw new Error("Missing responsive geometry target");
    const impactStyle = getComputedStyle(impact);
    const formStyle = getComputedStyle(form);

    return {
      contact: readTypography("#grace-garage-contact-title"),
      formPadding: formStyle.padding,
      hero: readTypography("#grace-garage-title"),
      impactPaddingBottom: Number.parseFloat(impactStyle.paddingBottom),
      impactPaddingTop: Number.parseFloat(impactStyle.paddingTop),
      overview: readTypography("#grace-garage-overview-title"),
      volunteer: readTypography("#grace-garage-volunteer-title"),
    };
  });
  expectNear(mobileGeometryStyles.hero.fontSize, 36, 0.1);
  expectNear(mobileGeometryStyles.hero.lineHeight, 39.6, 0.2);
  expectNear(mobileGeometryStyles.overview.fontSize, 28.8, 0.1);
  expectNear(mobileGeometryStyles.overview.lineHeight, 36, 0.2);
  expect(mobileGeometryStyles.overview.color).toBe("rgb(28, 44, 91)");
  expectNear(mobileGeometryStyles.volunteer.fontSize, 28.8, 0.1);
  expectNear(mobileGeometryStyles.volunteer.lineHeight, 36, 0.2);
  expect(mobileGeometryStyles.volunteer.color).toBe("rgb(28, 44, 91)");
  expectNear(mobileGeometryStyles.contact.fontSize, 28, 0.1);
  expectNear(mobileGeometryStyles.contact.lineHeight, 35, 0.2);
  expectNear(mobileGeometryStyles.impactPaddingTop, 64);
  expectNear(mobileGeometryStyles.impactPaddingBottom, 64);
  expect(mobileGeometryStyles.formPadding).toBe("32px");
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
