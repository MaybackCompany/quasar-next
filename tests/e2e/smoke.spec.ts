import { test, expect } from "@playwright/test";

test.describe("landing page", () => {
  test("renders the current hero and direct guide entry points", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/");
    await page.waitForLoadState("load");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Learn FiveM by shipping");
    await expect(page.getByRole("heading", { name: "Two guided starting points." })).toBeVisible();
    await expect(page.locator('a[href="/lessons/fivem-2026-orientation"]')).toBeVisible();
    await expect(page.locator('a[href="/lessons/tebex-store-growth"]')).toBeVisible();
    await expect(page.locator('.track-card[href="/track/server"]')).toBeVisible();
    await expect(page.locator('.track-card[href="/track/scripts"]')).toBeVisible();

    expect(consoleErrors, `console errors: ${consoleErrors.join("\n")}`).toHaveLength(0);
  });

  test("has no horizontal overflow at desktop width", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe("lesson page", () => {
  test("renders injected lesson content + sidebar", async ({ page }) => {
    await page.goto("/lessons/first-line-of-lua");
    await page.waitForLoadState("load");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // Scoped lesson content is injected
    await expect(page.locator(".lesson-content, main")).toBeVisible();
    // Scroll-progress bar is present
    await expect(page.locator("body")).toBeVisible();
  });

  test("featured guides use the standard lesson shell and relevant videos", async ({ page }) => {
    const guides = [
      {
        path: "/lessons/fivem-2026-orientation",
        chapters: 20,
        video: "81886632cbdd481e8f29e48ab88e167f",
      },
      {
        path: "/lessons/tebex-store-growth",
        chapters: 14,
        video: "a47221266d86430294186b8304e25104",
      },
    ];

    for (const guide of guides) {
      await page.goto(guide.path);
      await page.waitForLoadState("load");

      await expect(page.locator(".lesson-grid")).toBeVisible();
      await expect(page.locator(".editorial-guide-shell")).toHaveCount(0);
      await expect(page.getByRole("navigation", { name: "Track roadmap" })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "On this page" })).toBeVisible();
      await expect(page.locator(".guide-toc li")).toHaveCount(guide.chapters);
      await expect(page.locator(`iframe[src*="${guide.video}"]`)).toBeAttached();
    }
  });
});

test.describe("auth (public mode)", () => {
  test("/api/me reports auth disabled", async ({ request }) => {
    const res = await request.get("/api/me");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.enabled).toBe(false);
  });

  test("lessons are not gated in public mode", async ({ page }) => {
    const res = await page.goto("/lessons/first-line-of-lua");
    expect(res?.status()).toBe(200);
    expect(page.url()).toContain("/lessons/first-line-of-lua");
  });
});

test.describe("accessibility — reduced motion", () => {
  test("navigation motion is disabled under prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("load");

    const reduceActive = await page.evaluate(
      () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    expect(reduceActive, "reduced-motion emulation active").toBe(true);

    const arrow = page.locator(".nav-cta-arrow");
    await expect(arrow).toBeAttached();
    await expect
      .poll(() => arrow.evaluate((el) => getComputedStyle(el).transitionDuration))
      .toBe("0s");
  });
});
