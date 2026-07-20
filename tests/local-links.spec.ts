import { expect, test } from "@playwright/test";

type LinkReference = {
  destination: string;
  fragment: string;
  label: string;
  rawHref: string;
  source: string;
};

const configuredSeeds = (process.env.LOCAL_LINK_SEEDS ?? "/")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const maxPages = Number(process.env.LOCAL_LINK_MAX_PAGES ?? 100);
const deferredPhaseRoutes = new Set([
  "/classes",
  "/contact",
  "/volunteer",
]);

test("implemented local routes have valid links and report deferred destinations", async ({
  page,
}, testInfo) => {
  test.setTimeout(120_000);

  const baseUrl = new URL(
    String(testInfo.project.use.baseURL ?? "http://127.0.0.1:3000"),
  );
  const origin = baseUrl.origin;
  const normalize = (value: string, context = baseUrl.toString()) => {
    const url = new URL(value, context);
    url.hash = "";
    return url.toString();
  };
  const seeds = configuredSeeds.map((seed) => normalize(seed));
  const queue = [...new Set(seeds)];
  const queued = new Set(queue);
  const visited = new Set<string>();
  const statuses = new Map<string, number>();
  const idsByPage = new Map<string, Set<string>>();
  const references: LinkReference[] = [];
  const problems: string[] = [];

  if (queue.length === 0) {
    throw new Error("LOCAL_LINK_SEEDS produced zero routes.");
  }
  if (!Number.isInteger(maxPages) || maxPages < 1) {
    throw new Error("LOCAL_LINK_MAX_PAGES must be a positive integer.");
  }
  for (const seed of queue) {
    if (new URL(seed).origin !== origin) {
      throw new Error(`Local link seed must use ${origin}: ${seed}`);
    }
  }

  while (queue.length > 0 && visited.size < maxPages) {
    const requestedUrl = queue.shift();
    if (!requestedUrl || visited.has(requestedUrl)) continue;
    visited.add(requestedUrl);

    let response;
    try {
      response = await page.goto(requestedUrl, {
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      });
    } catch (error) {
      problems.push(`${requestedUrl} could not be loaded: ${String(error)}`);
      continue;
    }

    const status = response?.status() ?? 0;
    statuses.set(requestedUrl, status);
    if (status < 200 || status >= 400) {
      problems.push(`${requestedUrl} returned HTTP ${status || "unknown"}.`);
      continue;
    }

    const loadedUrl = new URL(page.url());
    if (loadedUrl.origin !== origin) {
      problems.push(
        `${requestedUrl} redirected outside the local implementation to ${loadedUrl.toString()}.`,
      );
      continue;
    }

    const contentType = (await response?.headerValue("content-type")) ?? "";
    if (!contentType.includes("html")) continue;

    idsByPage.set(
      requestedUrl,
      new Set(
        await page.locator("[id],a[name]").evaluateAll((elements) =>
          elements
            .map(
              (element) =>
                element.id || element.getAttribute("name") || "",
            )
            .filter((id): id is string => Boolean(id)),
        ),
      ),
    );
    const anchors = await page.locator("a[href]").evaluateAll((elements) =>
      elements.map((element) => {
        const anchor = element as HTMLAnchorElement;
        return {
          absoluteHref: anchor.href,
          label:
            anchor.textContent?.replace(/\s+/g, " ").trim() ||
            anchor.getAttribute("aria-label") ||
            "",
          rawHref: anchor.getAttribute("href") ?? "",
        };
      }),
    );

    for (const anchor of anchors) {
      const rawHref = anchor.rawHref.trim();
      if (!rawHref) continue;
      const rawScheme = rawHref.match(/^([a-z][a-z\d+.-]*):/i)?.[1]?.toLowerCase();
      if (rawScheme && ["mailto", "tel", "sms"].includes(rawScheme)) continue;
      if (rawScheme && !["http", "https"].includes(rawScheme)) {
        problems.push(
          `${requestedUrl} has unsupported ${rawScheme}: link ${JSON.stringify(rawHref)}.`,
        );
        continue;
      }
      if (/^(?:https?)(?:\/\/|\/)/i.test(rawHref)) {
        problems.push(
          `${requestedUrl} has an HTTP-like link missing its colon: ${JSON.stringify(rawHref)}.`,
        );
        continue;
      }

      let destinationUrl;
      try {
        destinationUrl = new URL(anchor.absoluteHref, requestedUrl);
      } catch {
        problems.push(
          `${requestedUrl} has an unparseable link ${JSON.stringify(rawHref)}.`,
        );
        continue;
      }
      if (
        destinationUrl.hostname === "about" ||
        destinationUrl.hostname.endsWith(".html")
      ) {
        problems.push(
          `${requestedUrl} has a placeholder or page-like external hostname in ${JSON.stringify(rawHref)}.`,
        );
        continue;
      }
      if (destinationUrl.origin !== origin) continue;

      let fragment = "";
      if (destinationUrl.hash) {
        try {
          fragment = decodeURIComponent(destinationUrl.hash.slice(1));
        } catch {
          problems.push(
            `${requestedUrl} has an invalid percent-encoded fragment in ${JSON.stringify(rawHref)}.`,
          );
        }
      }
      destinationUrl.hash = "";
      const destination = destinationUrl.toString();
      references.push({
        source: requestedUrl,
        destination,
        fragment,
        label: anchor.label,
        rawHref,
      });
      if (deferredPhaseRoutes.has(destinationUrl.pathname)) continue;
      if (!queued.has(destination)) {
        queued.add(destination);
        queue.push(destination);
      }
    }
  }

  if (queue.length > 0) {
    problems.push(
      `Local link crawl exceeded LOCAL_LINK_MAX_PAGES=${maxPages}; ${queue.length} queued route(s) were not checked.`,
    );
  }

  const deferredDestinations = [
    ...new Set(
      references
        .filter((reference) =>
          deferredPhaseRoutes.has(new URL(reference.destination).pathname),
        )
        .map((reference) => reference.destination),
    ),
  ];
  for (const destination of deferredDestinations) {
    try {
      const response = await page.request.get(destination, {
        failOnStatusCode: false,
        maxRedirects: 0,
        timeout: 30_000,
      });
      statuses.set(destination, response.status());
      const pathname = new URL(destination).pathname;
      const expectedLocation = `https://cathedral-life-center.webflow.io${pathname}`;
      if (response.status() < 300 || response.status() >= 400) {
        problems.push(
          `${destination} should redirect to the legacy page, but returned HTTP ${response.status()}.`,
        );
      }
      if (response.headers().location !== expectedLocation) {
        problems.push(
          `${destination} redirects to ${response.headers().location ?? "nowhere"}; expected ${expectedLocation}.`,
        );
      }
    } catch (error) {
      problems.push(`${destination} could not be checked: ${String(error)}`);
    }
  }

  for (const reference of references) {
    const status = statuses.get(reference.destination);
    if (status == null) continue;
    if (status >= 400 || status < 200) {
      problems.push(
        `${reference.source} links to ${reference.destination}, which returned HTTP ${status}.`,
      );
    }
    if (
      reference.fragment &&
      status >= 200 &&
      status < 400 &&
      !idsByPage.get(reference.destination)?.has(reference.fragment)
    ) {
      problems.push(
        `${reference.source} links to missing fragment #${reference.fragment} on ${reference.destination}.`,
      );
    }
  }

  const audit = {
    base_url: baseUrl.toString(),
    seeds,
    visited_routes: [...visited],
    internal_link_occurrence_count: references.length,
    deferred_phase_routes: [...deferredPhaseRoutes].sort(),
    deferred_references: references.filter((reference) =>
      deferredPhaseRoutes.has(new URL(reference.destination).pathname),
    ),
    deferred_fallback_statuses: Object.fromEntries(
      deferredDestinations.map((destination) => [
        new URL(destination).pathname,
        statuses.get(destination) ?? null,
      ]),
    ),
    problems: [...new Set(problems)],
  };
  await testInfo.attach("local-link-audit.json", {
    body: Buffer.from(`${JSON.stringify(audit, null, 2)}\n`),
    contentType: "application/json",
  });

  expect(audit.problems, audit.problems.join("\n")).toEqual([]);
});
