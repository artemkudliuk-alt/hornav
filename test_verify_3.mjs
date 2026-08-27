import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("Navigating to https://danamiratest.vercel.app/fleet.html...");
  await page.goto("https://danamiratest.vercel.app/fleet.html", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const activeStat = await page.textContent("#stat-active-vessels");
  const filterAll = await page.textContent("#filter-btn-all");
  const filterGc = await page.textContent("#filter-btn-gc");
  const filterBc = await page.textContent("#filter-btn-bc");
  const countIndicator = await page.textContent("#fleet-count-indicator");

  console.log("--- Verified Dynamic Counts on Frontend ---");
  console.log("Active Managed Fleet Stat:", activeStat?.trim());
  console.log("All Fleet Filter:", filterAll?.trim());
  console.log("General Cargo Filter:", filterGc?.trim());
  console.log("Bulk Carrier Filter:", filterBc?.trim());
  console.log("Count Indicator:", countIndicator?.trim());

  await page.screenshot({ path: "C:\\Users\\Jaku\\.gemini\\antigravity\\brain\\c4ea53a2-dcae-4aef-819a-50eea4dced37\\live_16_fleet_counts_3.png", fullPage: false });

  await browser.close();
}

main().catch(console.error);
