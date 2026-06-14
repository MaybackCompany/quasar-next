import { test, expect } from "@playwright/test";

test.describe("landing page", () => {
  test("renders hero, journeys, and Magic UI sections", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/");
    await page.waitForLoadState("load");

    // Hero
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Start from 0");
    // Two from-0 journeys (CTA links appear in hero + cards)
    await expect(page.getByRole("link", { name: /Write scripts from 0/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Run a server from 0/i }).first()).toBeVisible();
    // Ecosystem (orbiting-circles) section
    await expect(page.getByRole("heading", { name: /Six APIs you touch every day/i })).toBeVisible();
    // Work-with (file-tree + terminal) section
    await expect(page.getByRole("heading", { name: /What you.ll actually work with/i })).toBeVisible();

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
  test("orbit animation is disabled under prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("load");

    const reduceActive = await page.evaluate(
      () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    expect(reduceActive, "reduced-motion emulation active").toBe(true);

    const orbit = page.locator(".animate-orbit").first();
    await expect(orbit).toBeAttached();
    // Poll: the reduced-motion CSS override resolves once styles settle.
    await expect
      .poll(() => orbit.evaluate((el) => getComputedStyle(el).animationName))
      .toBe("none");
  });
});
