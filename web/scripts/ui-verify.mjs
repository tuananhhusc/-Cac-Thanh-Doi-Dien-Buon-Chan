import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const baseURL = "http://127.0.0.1:3000";

async function screenshotViewport(page, filePath) {
  await page.screenshot({ path: filePath, fullPage: false });
}

async function findContentPage(page) {
  const hasToc = await page.evaluate(() => {
    const text = (el) => (el?.textContent || "").trim().toLowerCase();
    const tocLike =
      Array.from(document.querySelectorAll("aside, nav, section")).find((el) => {
        const t = text(el);
        if (!t.includes("contents") && !t.includes("table of contents") && !t.includes("toc")) return false;
        const hashLinks = el.querySelectorAll('a[href^="#"]');
        return hashLinks.length >= 3;
      }) || null;
    if (tocLike) return true;
    // Fallback: any aside/nav with lots of hash links.
    const any = Array.from(document.querySelectorAll("aside, nav")).some(
      (el) => el.querySelectorAll('a[href^="#"]').length >= 6,
    );
    return any;
  });
  if (hasToc) return page.url();

  const candidates = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href^="/"]'));
    const hrefs = anchors
      .map((a) => a.getAttribute("href"))
      .filter(Boolean)
      .filter((h) => !h.startsWith("//"))
      .filter((h) => !h.includes("?"))
      .filter((h) => !h.includes("#"))
      .filter((h) => !h.match(/\.(png|jpg|jpeg|gif|svg|webp|pdf)$/i));
    const uniq = Array.from(new Set(hrefs));
    // Prefer blog-ish pages.
    const preferred = uniq.filter((h) => /post|blog|docs|read|article/i.test(h));
    return [...preferred, ...uniq].slice(0, 12);
  });

  for (const href of candidates) {
    const url = new URL(href, page.url()).toString();
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(250);
    const ok = await page.evaluate(() => {
      const toc = Array.from(document.querySelectorAll("aside, nav")).some(
        (el) => el.querySelectorAll('a[href^="#"]').length >= 6,
      );
      const main = document.querySelector("main");
      const headings = (main || document.body).querySelectorAll("h2, h3");
      return toc && headings.length >= 4;
    });
    if (ok) return page.url();
  }
  return page.url();
}

async function runDesktop({ urlPath, outDir }) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    await page.goto(`${baseURL}${urlPath}`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => {});

    const navigatedUrl = await findContentPage(page);
    if (navigatedUrl !== page.url()) {
      await page.goto(navigatedUrl, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle").catch(() => {});
    }

    // Desktop ToC should be visible (it is in the sticky aside on lg+).
    const tocNav = page.locator('aside nav[aria-label="Mục lục"]');
    await tocNav.waitFor({ timeout: 10_000 });

    // Verify ToC "sticks" while scrolling.
    // The aside becomes sticky after some scroll, so measure after it has engaged.
    await page.evaluate(() => window.scrollTo({ top: 240, behavior: "instant" }));
    await page.waitForTimeout(250);
    const tocTopEngaged = await tocNav.boundingBox().then((b) => (b ? b.y : null));

    await page.evaluate(() => window.scrollTo({ top: Math.floor((document.documentElement.scrollHeight - window.innerHeight) * 0.4), behavior: "instant" }));
    await page.waitForTimeout(250);
    const tocTopAfter = await tocNav.boundingBox().then((b) => (b ? b.y : null));

    const tocStickyOk =
      typeof tocTopEngaged === "number" &&
      typeof tocTopAfter === "number" &&
      Math.abs(tocTopAfter - tocTopEngaged) <= 10;
    if (!tocStickyOk) throw new Error(`ToC not sticky on desktop (top engaged=${tocTopEngaged}, after=${tocTopAfter})`);

    // Verify ToC highlights active section (look for the desktop active-state class).
    const activeDesktopCount = await page.locator('nav[aria-label="Mục lục"] a.border-amber-600').count();
    if (activeDesktopCount < 1) {
      throw new Error("ToC did not show an active highlighted item (expected an anchor with border-amber-600).");
    }

    await screenshotViewport(page, path.join(outDir, "desktop-toc-sticky.png"));

    // Citation click should scroll to matching #ref-N.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(200);
    const cite = page.locator('main sup a[href^="#ref-"]').first();
    await cite.waitFor({ timeout: 10_000 });
    const href = await cite.getAttribute("href");
    if (!href) throw new Error("Could not read citation href.");
    const ref = page.locator(href);
    const refExists = (await ref.count()) > 0;
    if (!refExists) throw new Error(`Citation target not found: ${href}`);

    await cite.click();
    await page.waitForFunction(
      (expected) => location.hash === expected,
      href,
      { timeout: 10_000 },
    );
    await page.waitForFunction(
      (sel) => {
        const el = document.querySelector(sel);
        if (!el) return false;
        const top = el.getBoundingClientRect().top;
        return top >= -20 && top <= 180;
      },
      href,
      { timeout: 10_000 },
    );

    await screenshotViewport(page, path.join(outDir, "desktop-citation-scroll.png"));
  } finally {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

async function runMobile({ urlPath, outDir }) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  try {
    await page.goto(`${baseURL}${urlPath}`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => {});

    const navigatedUrl = await findContentPage(page);
    if (navigatedUrl !== page.url()) {
      await page.goto(navigatedUrl, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle").catch(() => {});
    }

    // Citation click should scroll to matching #ref-N.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(200);
    const cite = page.locator('main sup a[href^="#ref-"]').first();
    await cite.waitFor({ timeout: 10_000 });
    const href = await cite.getAttribute("href");
    if (!href) throw new Error("Could not read citation href (mobile).");
    const ref = page.locator(href);
    const refExists = (await ref.count()) > 0;
    if (!refExists) throw new Error(`Citation target not found (mobile): ${href}`);

    await cite.click();
    await page.waitForFunction(
      (sel) => {
        const el = document.querySelector(sel);
        if (!el) return false;
        const top = el.getBoundingClientRect().top;
        return location.hash === sel || (top >= -40 && top <= 240);
      },
      href,
      { timeout: 12_000 },
    );

    await screenshotViewport(page, path.join(outDir, "mobile-citation-scroll.png"));
  } finally {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

async function main() {
  const fs = await import("node:fs/promises");
  const here = path.dirname(fileURLToPath(import.meta.url));
  const outDir = path.join(here, "..", "ui-screenshots");
  await fs.mkdir(outDir, { recursive: true });

  const urlPath = "/";
  await runDesktop({ urlPath, outDir });
  await runMobile({ urlPath, outDir });
  // eslint-disable-next-line no-console
  console.log(`[ui-verify] OK. Screenshots saved to: ${outDir}`);
}

await main();
