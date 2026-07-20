import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { unexpectedAccessibilityViolations } from "./accessibility";

const webflowFormEndpoint =
  "https://webflow.com/api/v1/form/663792c3759f35a04eea8483";

const facilityCopy = {
  lead:
    "The Cathedral Life Center at Grace Woodlands is a Christ-centered refuge of compassion in the Spring / North Houston region for women escaping domestic abuse, single moms choosing life for their babies, young adults aging out of foster care, and families facing crisis.",
  paragraphs: [
    "This 50,000+ square foot facility provides fully furnished transitional housing, life skills coaching, spiritual guidance, car maintenance, and compassionate care, all at no charge to families who need help rebuilding their lives with dignity and hope.",
    "From its miraculous acquisition to its development as a first-class residential ministry center, the Life Center exists to provide safety, stability, and a future for women, children, and families who need it most.",
  ],
  note:
    "* We do not accept any government funding; instead, we rely 100% on supporters like you who care about women and children desperate for hope.",
} as const;

const leadershipCopy = {
  steveAndBecky: [
    "Steve and Becky serve as the Founding Senior Pastors of Grace Woodlands Church in The Woodlands, TX, and they are the founders of the Cathedral Life Centre.",
    "Along with pastoring, Steve also serves as the President of Grace International, a fellowship of over 5,900 churches with more than 550,000+ members, various compassion ministries, and educational institutions both nationally and internationally with ministries in 131 nations of the world.",
  ],
  rachele: [
    "Rachele Riggle-Karmout brings heartfelt leadership to both the Cathedral Life Centre and the Grace Family Life ministry. Having spent many years as a single mom of two children who have faced significant physical challenges, Rachele leads with deep empathy, strength, and a passion for helping others.",
    "She is dedicated to seeing families thrive — spiritually, emotionally, and practically. Whether serving children, guiding parents, or reaching out to those in crisis, Rachele's mission is to offer real help and the living hope of Jesus.",
  ],
} as const;

test("About is a direct local route with the verified metadata and exact copy", async ({
  page,
}) => {
  const response = await page.goto("/about");

  expect(response?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe("/about");
  await expect(page).toHaveTitle("About | Cathedral Life Centre");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.cathedrallifecentre.com/about",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Learn about the Cathedral Life Centre, its Christ-centered facility, leadership, and commitment to women and families in need.",
  );

  const main = page.locator("main");
  await expect(main.getByRole("heading", { level: 1 })).toHaveText(
    "A Place of Refuge & Transformation",
  );
  await expect(main.getByText("About the Life Centre", { exact: true })).toBeVisible();
  await expect(
    main.getByText(
      "Created to bring hope, healing, and life to those in need — this 50,000+ sq. ft. facility is home to Christ-centered programs and ministries serving women and families.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(main.locator("h2")).toHaveText([
    "A Safe Haven. A Place of Hope.",
    "Our Leadership",
    "Connect With the Life Centre",
  ]);
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText(
    "HomeAbout",
  );
  await expect(page.getByRole("link", { name: "Scroll to page content" })).toHaveCount(
    0,
  );

  const facility = main.getByRole("region", {
    name: "A Safe Haven. A Place of Hope.",
  });
  await expect(
    facility.getByText("The Facility & Our Commitment", { exact: true }),
  ).toBeVisible();
  await expect(facility.locator("p")).toHaveText([
    "The Facility & Our Commitment",
    facilityCopy.lead,
    `${facilityCopy.paragraphs[0]}${facilityCopy.paragraphs[1]}`,
    facilityCopy.note,
  ]);

  const steveAndBecky = main.getByRole("article", {
    name: "Steve and Becky Riggle",
  });
  await expect(steveAndBecky.locator("p")).toHaveText([
    "Founders",
    ...leadershipCopy.steveAndBecky,
  ]);

  const rachele = main.getByRole("article", { name: "Rachele Riggle-Karmout" });
  await expect(rachele.locator("p")).toHaveText([
    "Director of the Cathedral Life CentreFamily Life Pastor at Grace Church",
    ...leadershipCopy.rachele,
  ]);

  const contact = main.getByRole("region", {
    name: "Connect With the Life Centre",
  });
  await expect(contact.getByText("Find Out More", { exact: true })).toBeVisible();
  await expect(
    contact.getByText(
      "Have questions about our ministry, our facility, or how you can get involved? Fill out the form and our team will be in touch.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(contact.getByText("24854 Cathedral Lakes Pkwy", { exact: true })).toBeVisible();
  await expect(contact.getByText("Spring, TX 77386", { exact: true })).toBeVisible();
});

test("About retains every verified destination and the source-exact form controls", async ({
  page,
}) => {
  await page.goto("/about");
  const main = page.locator("main");

  await expect(main.getByRole("link", { name: "Give", exact: true })).toHaveAttribute(
    "href",
    "/donate",
  );
  await expect(main.getByRole("link", { name: "Serve", exact: true })).toHaveAttribute(
    "href",
    "/volunteer",
  );
  await expect(main.getByRole("link", { name: "(832) 381-2306" })).toHaveAttribute(
    "href",
    "tel:8323812306",
  );
  await expect(
    main.getByRole("link", { name: "CathedralLifeCentre.com" }),
  ).toHaveAttribute("href", "/");

  const form = main.getByRole("form", {
    name: "Contact the Cathedral Life Centre",
  });
  await expect(form).toHaveAttribute("method", "post");
  await expect(form.getByLabel("Name")).toHaveAttribute("placeholder", "Your name");
  await expect(form.getByLabel("Name")).toHaveAttribute("required", "");
  await expect(form.getByLabel("Email Address")).toHaveAttribute(
    "placeholder",
    "your@email.com",
  );
  await expect(form.getByLabel("Email Address")).toHaveAttribute("required", "");
  await expect(form.getByText("Message", { exact: true })).toBeVisible();
  await expect(form.locator("textarea")).toHaveCount(0);
  await expect(form.getByRole("button", { name: "Send Message" })).toBeEnabled();
});

test("About submits to the verified Webflow endpoint and exposes the success state", async ({
  page,
}) => {
  let submission:
    | {
        method: string;
        params: URLSearchParams;
      }
    | undefined;

  await page.route(webflowFormEndpoint, async (route) => {
    const request = route.request();
    submission = {
      method: request.method(),
      params: new URLSearchParams(request.postData() ?? ""),
    };
    await route.fulfill({
      body: '{"code":200}',
      headers: {
        "access-control-allow-origin": "*",
        "content-type": "application/json",
      },
      status: 200,
    });
  });

  await page.goto("/about");
  const form = page.getByRole("form", {
    name: "Contact the Cathedral Life Centre",
  });
  await form.getByLabel("Name").fill("Grace Test");
  await form.getByLabel("Email Address").fill("grace@example.com");
  await form.getByRole("button", { name: "Send Message" }).click();

  const success = page.getByTestId("about-form-success");
  await expect(success).toHaveAttribute("role", "status");
  await expect(success).toHaveText("We'll be in contact soon!");
  expect(submission).toBeDefined();
  expect(submission!.method).toBe("POST");
  expect(Object.fromEntries(submission!.params)).toMatchObject({
    dolphin: "false",
    elementId: "61de1db3-5aec-af8a-0d9a-9a2ed7397255",
    "fields[Email Address]": "grace@example.com",
    "fields[Message]": "",
    "fields[Name]": "Grace Test",
    name: "biwtdb",
    pageId: "67511f942c232c83baf90351",
    test: "false",
  });
  expect(submission!.params.get("source")).toMatch(/\/about$/);
});

test("About serves complete local images with reserved geometry and no browser errors", async ({
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

  await page.goto("/about");
  await page.waitForLoadState("networkidle");

  const images = page.locator("main img");
  await expect(images).toHaveCount(6);
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
      expect.stringContaining("/assets/pages/about/hero-rachele-helping-woman.jpg"),
      expect.stringContaining(
        "/assets/pages/about/bedroom-suite-blue-accent-wall-with-baby-crib.jpg",
      ),
      expect.stringContaining("/assets/pages/about/mom-playing-with-baby-toy-on-bed.jpg"),
      expect.stringContaining(
        "/assets/pages/about/resident-suite-living-area-with-dining-table.jpg",
      ),
      expect.stringContaining("/assets/pages/about/steve-and-becky-riggle.jpg"),
      expect.stringContaining("/assets/pages/about/rachele-riggle-karmout.jpg"),
    ]),
  );
  expect(imageState.map((image) => image.alt)).toEqual([
    "",
    "Furnished Cathedral Life Centre bedroom suite with a blue accent wall and baby crib",
    "Mother playing with her baby on a bed",
    "Cathedral Life Centre resident suite living area and dining table",
    "Steve and Becky Riggle",
    "Rachele Riggle-Karmout",
  ]);
  expect(consoleProblems).toEqual([]);
  expect(failedRequests).toEqual([]);
});

test("About layout responds at desktop, tablet, and mobile widths without overflow", async ({
  page,
}) => {
  const heroTitle = page.getByRole("heading", { level: 1 });
  const facilityTitle = page.getByRole("heading", {
    name: "A Safe Haven. A Place of Hope.",
  });
  const galleryImages = page
    .getByLabel("Cathedral Life Centre facility")
    .locator("img");
  const steveImage = page.getByAltText("Steve and Becky Riggle");
  const steveTitle = page.getByRole("heading", { name: "Steve and Becky Riggle" });
  const racheleImage = page.getByAltText("Rachele Riggle-Karmout");
  const racheleTitle = page.getByRole("heading", { name: "Rachele Riggle-Karmout" });
  const contactTitle = page.getByRole("heading", {
    name: "Connect With the Life Centre",
  });
  const form = page.getByRole("form", { name: "Contact the Cathedral Life Centre" });

  await page.setViewportSize({ width: 1363, height: 936 });
  await page.goto("/about");
  await expect(heroTitle).toHaveCSS("font-size", "60.8px");
  await expect(facilityTitle).toHaveCSS("font-size", "41.6px");
  await expect(steveTitle).toHaveCSS("font-size", "35.2px");
  const desktopFacilityTitle = await facilityTitle.boundingBox();
  const desktopGallery = await galleryImages.first().boundingBox();
  const desktopSteveImage = await steveImage.boundingBox();
  const desktopSteveTitle = await steveTitle.boundingBox();
  const desktopRacheleImage = await racheleImage.boundingBox();
  const desktopRacheleTitle = await racheleTitle.boundingBox();
  const desktopContactTitle = await contactTitle.boundingBox();
  const desktopForm = await form.boundingBox();
  expect(desktopFacilityTitle).not.toBeNull();
  expect(desktopGallery).not.toBeNull();
  expect(desktopSteveImage).not.toBeNull();
  expect(desktopSteveTitle).not.toBeNull();
  expect(desktopRacheleImage).not.toBeNull();
  expect(desktopRacheleTitle).not.toBeNull();
  expect(desktopContactTitle).not.toBeNull();
  expect(desktopForm).not.toBeNull();
  expect(desktopFacilityTitle!.x).toBeLessThan(desktopGallery!.x);
  expect(desktopSteveImage!.x).toBeLessThan(desktopSteveTitle!.x);
  expect(desktopRacheleTitle!.x).toBeLessThan(desktopRacheleImage!.x);
  expect(desktopContactTitle!.x).toBeLessThan(desktopForm!.x);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1363);

  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(heroTitle).toHaveCSS("font-size", "49.55px");
  await expect(facilityTitle).toHaveCSS("font-size", "34.685px");
  await expect(steveTitle).toHaveCSS("font-size", "27.748px");
  const tabletFacilityTitle = await facilityTitle.boundingBox();
  const tabletGallery = await galleryImages.first().boundingBox();
  const tabletSteveImage = await steveImage.boundingBox();
  const tabletSteveTitle = await steveTitle.boundingBox();
  const tabletRacheleImage = await racheleImage.boundingBox();
  const tabletRacheleTitle = await racheleTitle.boundingBox();
  const tabletContactTitle = await contactTitle.boundingBox();
  const tabletForm = await form.boundingBox();
  const tabletGallerySecond = await galleryImages.nth(1).boundingBox();
  const tabletGalleryThird = await galleryImages.nth(2).boundingBox();
  expect(tabletFacilityTitle).not.toBeNull();
  expect(tabletGallery).not.toBeNull();
  expect(tabletSteveImage).not.toBeNull();
  expect(tabletSteveTitle).not.toBeNull();
  expect(tabletRacheleImage).not.toBeNull();
  expect(tabletRacheleTitle).not.toBeNull();
  expect(tabletContactTitle).not.toBeNull();
  expect(tabletForm).not.toBeNull();
  expect(tabletGallerySecond).not.toBeNull();
  expect(tabletGalleryThird).not.toBeNull();
  expect(tabletGallery!.y).toBeGreaterThan(
    tabletFacilityTitle!.y + tabletFacilityTitle!.height,
  );
  expect(tabletSteveTitle!.y).toBeGreaterThan(
    tabletSteveImage!.y + tabletSteveImage!.height,
  );
  expect(tabletRacheleImage!.y).toBeGreaterThan(
    tabletRacheleTitle!.y + tabletRacheleTitle!.height,
  );
  expect(tabletForm!.y).toBeGreaterThan(
    tabletContactTitle!.y + tabletContactTitle!.height,
  );
  expect(Math.abs(tabletGallerySecond!.y - tabletGalleryThird!.y)).toBeLessThan(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(768);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(heroTitle).toHaveCSS("font-size", "35.2px");
  await expect(facilityTitle).toHaveCSS("font-size", "28.8px");
  await expect(steveTitle).toHaveCSS("font-size", "25.6px");
  const mobileGallerySecond = await galleryImages.nth(1).boundingBox();
  const mobileGalleryThird = await galleryImages.nth(2).boundingBox();
  const mobileForm = await form.boundingBox();
  const mobileContactTitle = await contactTitle.boundingBox();
  expect(mobileGallerySecond).not.toBeNull();
  expect(mobileGalleryThird).not.toBeNull();
  expect(mobileForm).not.toBeNull();
  expect(mobileContactTitle).not.toBeNull();
  expect(Math.abs(mobileGallerySecond!.y - mobileGalleryThird!.y)).toBeLessThan(2);
  expect(mobileForm!.y).toBeGreaterThan(
    mobileContactTitle!.y + mobileContactTitle!.height,
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test("About has no unexpected automated accessibility violations", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1363, height: 936 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/about");
    const results = await new AxeBuilder({ page }).analyze();
    expect(unexpectedAccessibilityViolations(results.violations)).toEqual([]);
  }
});
