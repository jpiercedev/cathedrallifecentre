import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { unexpectedAccessibilityViolations } from "./accessibility";

test("homepage renders the verified content sequence and public metadata", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Hope Restored\.\s*Lives Rebuilt\.\s*Futures Renewed\./,
  );

  const headings = await page
    .locator("main h2")
    .allTextContents();
  expect(headings).toEqual([
    "Bringing Hope, Healing & Life to Women in Crisis",
    expect.stringContaining("Your donation can change someone’s world"),
    "Our Ministries",
    "A Safe Haven for Women & Families",
    "Every Gift Brings Hope",
    "Volunteer Opportunities",
    "Find Out More",
  ]);

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.cathedrallifecentre.com",
  );
  await expect(page).toHaveTitle("Cathedral Life Centre");
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
});

test("homepage CTAs retain the verified destinations", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "Schedule a Tour" })).toHaveAttribute(
    "href",
    "#contact",
  );
  await expect(
    page.getByRole("link", { name: "Apply for Residency" }),
  ).toHaveAttribute("href", /docs\.google\.com\/forms/);
  await expect(
    page.locator("#volunteer").getByRole("link", { name: "Volunteer", exact: true }),
  ).toHaveAttribute("href", /gracewoodlands\.churchcenter\.com/);
  await expect(
    page
      .locator("#contact")
      .getByRole("link", { name: "\(832\) 381-2306" })
      .first(),
  ).toHaveAttribute("href", "tel:8323812306");
});

test("primary buttons retain the specified production styling", async ({ page }) => {
  await page.goto("/");
  const primaryButton = page.getByRole("link", { name: "Give Today" }).first();

  await expect(primaryButton).toHaveCSS("display", "block");
  await expect(primaryButton).toHaveCSS("color", "rgb(255, 255, 255)");
  await expect(primaryButton).toHaveCSS("background-color", "rgb(223, 123, 79)");
  await expect(primaryButton).toHaveCSS("font-family", /Montserrat/);
  await expect(primaryButton).toHaveCSS("font-size", "11px");
  await expect(primaryButton).toHaveCSS("font-weight", "700");
  await expect(primaryButton).toHaveCSS("letter-spacing", "1.54px");
  await expect(primaryButton).toHaveCSS("line-height", "16.5px");
  await expect(primaryButton).toHaveCSS("border-radius", "30px");
  await expect(primaryButton).toHaveCSS("padding", "12px 32px");
  await expect(primaryButton).toHaveCSS("text-transform", "uppercase");
  await expect(primaryButton).toHaveCSS("transition-property", "none");
  await expect(primaryButton).toHaveCSS(
    "box-shadow",
    "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px",
  );

  const volunteerButton = page
    .locator("#volunteer")
    .getByRole("link", { name: "Volunteer", exact: true });
  const volunteerBox = await volunteerButton.boundingBox();
  expect(volunteerBox).not.toBeNull();
  expect(volunteerBox!.width).toBeLessThan(180);

  await primaryButton.focus();
  await expect(primaryButton).toHaveCSS("outline-color", "rgb(255, 255, 255)");
  await expect(primaryButton).toHaveCSS(
    "box-shadow",
    /rgb\(86, 95, 76\) 0px 0px 0px 6px/,
  );
});

test("homepage serves all images locally", async ({ page }) => {
  await page.goto("/");
  const imageUrls = await page.locator("img").evaluateAll((images) =>
    images.flatMap((image) => {
      const element = image as HTMLImageElement;
      return [element.currentSrc, element.src, element.srcset].filter(Boolean);
    }),
  );
  expect(
    imageUrls.filter((url) =>
      /website-files|webflow|cathedrallifecentre\.com/i.test(url),
    ),
  ).toEqual([]);
});

test("desktop Ministries disclosure works with pointer and keyboard", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Ministries" });

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("link", { name: "Residency Programs" }).first()).toBeVisible();

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.focus();
  await trigger.press("ArrowDown");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const residencyLink = page
    .locator("#desktop-ministries-menu")
    .getByRole("link", { name: "Residency Programs" });
  await expect(residencyLink).toBeFocused();

  await residencyLink.press("End");
  await expect(
    page.locator("#desktop-ministries-menu").getByRole("link", { name: "The Market" }),
  ).toBeFocused();

  await page.keyboard.press("Home");
  await expect(residencyLink).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();

  await expect(
    page.locator("nav[aria-label='Primary navigation']").getByRole("link", {
      name: "Home",
      exact: true,
    }),
  ).toHaveAttribute("aria-current", "page");
});

test("mobile drawer and nested Ministries disclosure match the source behavior", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const toggle = page.getByRole("button", { name: "Open navigation menu" });
  await toggle.click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Partner With Us" }).first()).toBeVisible();
  await expect(page.locator("main")).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator("footer")).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator(".skip-link")).toHaveAttribute("aria-hidden", "true");
  expect(
    await page.locator(".skip-link, main, footer").evaluateAll((elements) =>
      elements.every((element) => (element as HTMLElement).inert),
    ),
  ).toBe(true);

  const ministries = page.locator("#mobile-ministries-trigger");
  await ministries.click();
  await expect(ministries).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("link", { name: "The Market" }).first()).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toHaveCount(0);
  await expect(toggle).toBeFocused();
  await expect(page.locator("main")).not.toHaveAttribute("aria-hidden", "true");
  await expect(page.locator(".skip-link")).not.toHaveAttribute(
    "aria-hidden",
    "true",
  );
  expect(
    await page
      .locator("main")
      .evaluate((element) => (element as HTMLElement).inert),
  ).toBe(false);
});

test("tablet drawer keeps Donate in the header and omits the mobile Partner row", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation menu" }).click();

  await expect(page.locator("header").getByRole("link", { name: "Donate" })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", {
      name: "Partner With Us",
    }),
  ).toBeHidden();
});

test("contact form matches the source while delivery remains safely gated", async ({
  page,
}) => {
  await page.goto("/#contact");
  await expect(page.getByText("Message", { exact: true })).toBeVisible();
  await expect(page.locator("#contact-delivery-notice")).toBeAttached();
  await expect(page.locator("#contact-delivery-notice")).toBeHidden();
  await expect(page.getByLabel("Name")).toBeDisabled();
  await expect(page.getByLabel("Email Address")).toBeDisabled();
  await expect(page.getByRole("button", { name: "Submit" })).toBeDisabled();
});

test("homepage video loads on demand and exposes failure and replay controls", async ({
  page,
}) => {
  const consoleProblems: string[] = [];
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      consoleProblems.push(`${message.type()}: ${message.text()}`);
    }
  });
  await page.route("https://player.vimeo.com/video/**", (route) =>
    route.fulfill({
      body: "<!doctype html><title>Vimeo player test frame</title>",
      contentType: "text/html",
      status: 200,
    }),
  );

  await page.goto("/");
  const play = page.getByRole("button", {
    name: "Play Cathedral Life Centre story video",
  });
  await expect(play).toBeVisible();
  await play.click();

  const frame = page.getByTitle("Cathedral Life Centre story video");
  await expect(frame).toHaveAttribute("src", /player\.vimeo\.com\/video\/1208955332/);
  await expect(frame).toHaveAttribute("data-player-connected", "true");

  await page.evaluate(() => {
    const frame = document.querySelector<HTMLIFrameElement>(
      'iframe[title="Cathedral Life Centre story video"]',
    );
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          event: "error",
          data: { method: "play", name: "Error", message: "Wrong sender" },
        },
        origin: "https://player.vimeo.com",
        source: window,
      }),
    );
    if (!frame?.contentWindow) throw new Error("Vimeo frame is unavailable.");
  });
  await expect(page.locator("[data-video-fallback]")).toHaveCount(0);

  await page.evaluate(() => {
    const frame = document.querySelector<HTMLIFrameElement>(
      'iframe[title="Cathedral Life Centre story video"]',
    );
    if (!frame?.contentWindow) throw new Error("Vimeo frame is unavailable.");
    window.dispatchEvent(
      new MessageEvent("message", {
        data: { event: "ready", data: {} },
        origin: "https://player.vimeo.com",
        source: frame.contentWindow,
      }),
    );
    window.dispatchEvent(
      new MessageEvent("message", {
        data: {
          event: "error",
          data: { method: "play", name: "Error", message: "Playback failed" },
        },
        origin: "https://player.vimeo.com",
        source: frame.contentWindow,
      }),
    );
  });
  await expect(page.locator("[data-video-fallback]")).toContainText(
    "could not be loaded",
  );
  await expect(page.getByRole("link", { name: "Watch on Vimeo" })).toHaveAttribute(
    "href",
    "https://vimeo.com/1208955332",
  );

  await page.getByRole("button", { name: "Retry" }).click();
  await expect(frame).toHaveAttribute("data-player-connected", "true");
  await page.evaluate(() => {
    const frame = document.querySelector<HTMLIFrameElement>(
      'iframe[title="Cathedral Life Centre story video"]',
    );
    if (!frame?.contentWindow) throw new Error("Vimeo frame is unavailable.");
    window.dispatchEvent(
      new MessageEvent("message", {
        data: { event: "ready", data: {} },
        origin: "https://player.vimeo.com",
        source: frame.contentWindow,
      }),
    );
    window.dispatchEvent(
      new MessageEvent("message", {
        data: { event: "ended", data: { duration: 1, percent: 1, seconds: 1 } },
        origin: "https://player.vimeo.com",
        source: frame.contentWindow,
      }),
    );
  });
  await expect(page.getByRole("button", { name: "Replay video" })).toBeVisible();
  expect(consoleProblems).toEqual([]);
});

test("homepage video times out to a useful fallback when Vimeo is unavailable", async ({
  page,
}) => {
  await page.route("https://player.vimeo.com/**", (route) => route.abort("failed"));
  await page.goto("/");
  await page.clock.install();
  await page
    .getByRole("button", { name: "Play Cathedral Life Centre story video" })
    .click();

  await expect(page.getByTitle("Cathedral Life Centre story video")).toHaveAttribute(
    "data-player-connected",
    "true",
  );
  await page.clock.fastForward(15_100);

  await expect(page.locator("[data-video-fallback]")).toContainText(
    "could not be loaded",
  );
  await expect(page.getByRole("link", { name: "Watch on Vimeo" })).toHaveAttribute(
    "href",
    "https://vimeo.com/1208955332",
  );
});

test("default and disclosed states have no unexpected accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  expect(
    unexpectedAccessibilityViolations(
      (await new AxeBuilder({ page }).analyze()).violations,
    ),
  ).toEqual([]);

  await page.getByRole("button", { name: "Ministries" }).click();
  expect(
    unexpectedAccessibilityViolations(
      (await new AxeBuilder({ page }).analyze()).violations,
    ),
  ).toEqual([]);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  // Main/footer are intentionally removed from the accessibility tree while the
  // modal drawer is open, so run drawer-scoped checks without document landmarks.
  const modalNavigationResults = await new AxeBuilder({ page })
    .include("header")
    .disableRules(["landmark-one-main", "page-has-heading-one"])
    .analyze();
  expect(
    unexpectedAccessibilityViolations(modalNavigationResults.violations),
  ).toEqual([]);
});

test("production discovery routes expose the homepage", async ({ page }) => {
  const robots = await page.request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain("Allow: /");

  const sitemap = await page.request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain("https://www.cathedrallifecentre.com");
});

test("legacy homepage redirects and unknown paths remain deterministic", async ({
  page,
}) => {
  const redirect = await page.request.get("/index.html", { maxRedirects: 0 });
  expect(redirect.status()).toBe(308);
  expect(redirect.headers().location).toBe("/");

  const response = await page.goto("/phase-2-missing-route-check");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: "Page not found." }),
  ).toBeVisible();
});

test("core homepage interactions remain free of browser errors", async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Ministries" }).click();
  await page.keyboard.press("Escape");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await page.locator("#mobile-ministries-trigger").click();
  await page.keyboard.press("Escape");

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});
