import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { unexpectedAccessibilityViolations } from "./accessibility";

const givingUrl =
  "https://deka.gives/grace-community-church-woodlands/give?purpose=291";

const mainParagraphs = [
  "The Cathedral Life Centre is a refuge—where young adults aging out of foster care find a home, moms choosing life receive the support and care they need, and families in crisis are met with compassion and practical help.",
  "Every ministry within these walls is made possible through the generosity of people who believe in making a difference. Your financial support helps provide safe housing, warm meals, job training, counseling, and essential resources for those in need.",
  "When you give, you're investing in changed lives and brighter futures. Together, we can expand this work and bring hope where it's needed most.",
] as const;

const givingMethods = [
  {
    number: "01",
    title: "Monthly Partnership",
    description:
      "We are looking for committed monthly donors whose faithful support will lay a solid foundation for ongoing ministries.",
  },
  {
    number: "02",
    title: "Furnish A Room",
    description:
      "You can also make a significant difference by addressing the initial needs required to prepare our facility.",
  },
  {
    number: "03",
    title: "General Support",
    description:
      "Give a single gift to the building restoration and ongoing ministry support.",
  },
  {
    number: "04",
    title: "In-Kind Donations",
    description:
      "To make an in-kind donation, contact Bill Phillips, Grace Ministry Giving Director. You may call the church office (832-381-2306), or email legacy@gracewoodlands.com.",
  },
  {
    number: "05",
    title: "Planned Legacy Giving",
    description:
      "To make a Legacy Gift, contact Bill Phillips, Grace Ministry Giving Director. You may call the church office (832-381-2306), or email legacy@gracewoodlands.com, or visit gm.giftlegacy.com",
  },
] as const;

test("Donate is a direct local route with the verified metadata and exact copy", async ({
  page,
}) => {
  const response = await page.goto("/donate");

  expect(response?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe("/donate");
  await expect(page).toHaveTitle("Get Involved | Cathedral Life Centre");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.cathedrallifecentre.com/donate",
  );

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Your generosity makes a difference!",
  );
  await expect(page.getByText("Get Involved", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "Give today to bring hope, healing, and life to someone in need!",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.locator("main h2")).toHaveText([
    "Investing in changed lives & brighter futures.",
  ]);
  await expect(page.getByText("Give", { exact: true })).toBeVisible();
  for (const paragraph of mainParagraphs) {
    await expect(page.getByText(paragraph, { exact: true })).toBeVisible();
  }

  await expect(
    page.getByRole("heading", { name: "Give by Check or Cash" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Cash or checks may be given in person during any service at Grace Woodlands or delivered to the church office during regular office hours. Please make checks payable to Grace Woodlands and write “Life Centre” in the memo line.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByText("Checks may be mailed to:", { exact: true })).toBeVisible();
  await expect(page.getByText("Grace Woodlands", { exact: true })).toBeVisible();
  await expect(page.getByText("ATTN: Life Centre", { exact: true })).toBeVisible();
  await expect(page.getByText("24400 Interstate 45 N", { exact: true })).toBeVisible();
  await expect(page.getByText("Spring, TX 77386", { exact: true })).toBeVisible();

  await expect(page.getByText("Ways to Give", { exact: true })).toBeVisible();
  for (const method of givingMethods) {
    await expect(page.getByText(method.number, { exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", { exact: true, name: method.title }),
    ).toBeVisible();
    await expect(page.getByText(method.description, { exact: true })).toBeVisible();
  }

  await expect(
    page.getByRole("heading", { name: "Furnish a Room — $5,000" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "The Mom Room includes bed, furniture, glider rocker, crib, baby items, decor, everyday supplies, and kitchenette renovations and equipment.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Furnish an Apartment Suite — $10,000",
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "There are a few locations in our facility that we could renovate and design multi-room apartment-style suites for families, which would include multiple beds, bunk bed, furniture, vanity, table/desk, and a kitchenette.",
      { exact: true },
    ),
  ).toBeVisible();

  await expect(
    page.getByText(
      "The Cathedral Life Centre is a ministry of Grace Church. Grace is a non-profit organized under section 501(c)(3) of the Internal Revenue Code; therefore, all contributions are tax-deductible.",
      { exact: true },
    ),
  ).toBeVisible();
});

test("Donate retains the verified destinations and new-tab behavior", async ({
  page,
}) => {
  await page.goto("/donate");

  for (const label of ["Give Today", "Give Online"] as const) {
    const link = page.locator("main").getByRole("link", { name: label });
    await expect(link).toHaveAttribute("href", givingUrl);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /\bnoopener\b/);
    await expect(link).toHaveAttribute("rel", /\bnoreferrer\b/);
  }

  const graceChurch = page
    .locator("main")
    .getByRole("link", { name: "Grace Church", exact: true });
  await expect(graceChurch).toHaveAttribute("href", "https://gracewoodlands.com/");
  await expect(graceChurch).toHaveAttribute("target", "_blank");
  await expect(graceChurch).toHaveAttribute("rel", /\bnoopener\b/);
  await expect(graceChurch).toHaveAttribute("rel", /\bnoreferrer\b/);
});

test("Donate serves complete local images with reserved geometry and a working Vimeo embed", async ({
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
  await page.route("https://player.vimeo.com/video/**", (route) => {
    vimeoRequests += 1;
    return route.fulfill({
      body: "<!doctype html><title>Life Centre - Giving test frame</title>",
      contentType: "text/html",
      status: 200,
    });
  });

  await page.goto("/donate");
  await page.waitForLoadState("networkidle");

  const frame = page.getByTitle("Life Centre - Giving");
  await expect(frame).toHaveAttribute(
    "src",
    /^https:\/\/player\.vimeo\.com\/video\/1210071037(?:\?|$)/,
  );
  await expect(frame).toHaveAttribute(
    "allow",
    /autoplay; fullscreen;.*picture-in-picture/,
  );
  expect(vimeoRequests).toBeGreaterThan(0);

  const images = page.locator("main img");
  expect(await images.count()).toBeGreaterThanOrEqual(2);
  const imageState = await images.evaluateAll((elements) =>
    elements.map((element) => {
      const image = element as HTMLImageElement;
      const imageBox = image.getBoundingClientRect();
      const parent = image.parentElement;
      const parentBox = parent?.getBoundingClientRect();
      const parentStyle = parent ? getComputedStyle(parent) : null;
      const hasIntrinsicAttributes =
        Number(image.getAttribute("width")) > 0 &&
        Number(image.getAttribute("height")) > 0;
      const hasReservedWrapper = Boolean(
        parentBox &&
          parentBox.width > 0 &&
          parentBox.height > 0 &&
          parentStyle &&
          (parentStyle.position !== "static" || parentStyle.aspectRatio !== "auto"),
      );

      return {
        alt: image.alt,
        complete: image.complete,
        currentSrc: image.currentSrc,
        hasReservedGeometry: hasIntrinsicAttributes || hasReservedWrapper,
        naturalHeight: image.naturalHeight,
        naturalWidth: image.naturalWidth,
        renderedHeight: imageBox.height,
        renderedWidth: imageBox.width,
        src: image.getAttribute("src") ?? "",
      };
    }),
  );
  expect(
    imageState.every(
      (image) =>
        image.complete &&
        image.naturalHeight > 0 &&
        image.naturalWidth > 0 &&
        image.renderedHeight > 0 &&
        image.renderedWidth > 0 &&
        image.hasReservedGeometry,
    ),
  ).toBe(true);
  expect(
    imageState.filter((image) =>
      /website-files|webflow|cathedrallifecentre\.com/i.test(image.currentSrc),
    ),
  ).toEqual([]);
  const localSources = imageState.map((image) =>
    decodeURIComponent(`${image.src} ${image.currentSrc}`),
  );
  expect(localSources).toEqual(
    expect.arrayContaining([
      expect.stringContaining(
        "/assets/pages/donate/bedroom-suite-blue-accent-wall-with-baby-crib.jpg",
      ),
      expect.stringContaining(
        "/assets/pages/donate/mom-holding-baby-in-furnished-living-room.jpg",
      ),
    ]),
  );
  expect(imageState.map((image) => image.alt)).toEqual(
    expect.arrayContaining([
      "Cathedral Life Centre building exterior",
      "Mom and baby at Cathedral Life Centre",
    ]),
  );
  expect(consoleProblems).toEqual([]);
  expect(failedRequests).toEqual([]);
});

test("Donate layout responds at desktop, tablet, and mobile widths without overflow", async ({
  page,
}) => {
  await page.route("https://player.vimeo.com/video/**", (route) =>
    route.fulfill({
      body: "<!doctype html><title>Life Centre - Giving test frame</title>",
      contentType: "text/html",
      status: 200,
    }),
  );

  const title = page.getByRole("heading", { level: 1 });
  const video = page.getByTitle("Life Centre - Giving");
  const mainHeading = page.getByRole("heading", {
    name: "Investing in changed lives & brighter futures.",
  });
  const checkCardHeading = page.getByRole("heading", {
    name: "Give by Check or Cash",
  });
  const firstGivingMethod = page.getByRole("heading", {
    name: "Monthly Partnership",
  });

  await page.setViewportSize({ width: 1363, height: 936 });
  await page.goto("/donate");
  const desktopTitle = await title.boundingBox();
  const desktopVideo = await video.boundingBox();
  const desktopMainHeading = await mainHeading.boundingBox();
  const desktopFirstMethod = await firstGivingMethod.boundingBox();
  expect(desktopTitle).not.toBeNull();
  expect(desktopVideo).not.toBeNull();
  expect(desktopMainHeading).not.toBeNull();
  expect(desktopFirstMethod).not.toBeNull();
  expect(desktopTitle!.x).toBeLessThan(desktopVideo!.x);
  expect(desktopVideo!.width / desktopVideo!.height).toBeCloseTo(16 / 9, 1);
  expect(desktopMainHeading!.x).toBeLessThan(desktopFirstMethod!.x);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1363);

  await page.setViewportSize({ width: 768, height: 1024 });
  const tabletTitle = await title.boundingBox();
  const tabletVideo = await video.boundingBox();
  const tabletCheckCard = await checkCardHeading.boundingBox();
  const tabletFirstMethod = await firstGivingMethod.boundingBox();
  expect(tabletTitle).not.toBeNull();
  expect(tabletVideo).not.toBeNull();
  expect(tabletCheckCard).not.toBeNull();
  expect(tabletFirstMethod).not.toBeNull();
  expect(tabletVideo!.y).toBeGreaterThan(tabletTitle!.y + tabletTitle!.height);
  expect(tabletFirstMethod!.y).toBeGreaterThan(
    tabletCheckCard!.y + tabletCheckCard!.height,
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(768);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileTitle = await title.boundingBox();
  const mobileVideo = await video.boundingBox();
  const mobileGiveButton = await page
    .locator("main")
    .getByRole("link", { name: "Give Today" })
    .boundingBox();
  expect(mobileTitle).not.toBeNull();
  expect(mobileVideo).not.toBeNull();
  expect(mobileGiveButton).not.toBeNull();
  expect(mobileVideo!.y).toBeGreaterThan(
    mobileGiveButton!.y + mobileGiveButton!.height,
  );
  expect(mobileVideo!.width).toBeLessThanOrEqual(350);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("Donate has no unexpected automated accessibility violations", async ({
  page,
}) => {
  await page.route("https://player.vimeo.com/video/**", (route) =>
    route.fulfill({
      body: "<!doctype html><title>Life Centre - Giving test frame</title>",
      contentType: "text/html",
      status: 200,
    }),
  );

  await page.goto("/donate");
  const desktopResults = await new AxeBuilder({ page }).analyze();
  expect(
    unexpectedAccessibilityViolations(desktopResults.violations),
  ).toEqual([]);

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.reload();
  const tabletResults = await new AxeBuilder({ page }).analyze();
  expect(unexpectedAccessibilityViolations(tabletResults.violations)).toEqual(
    [],
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const mobileResults = await new AxeBuilder({ page }).analyze();
  expect(unexpectedAccessibilityViolations(mobileResults.violations)).toEqual(
    [],
  );
});
