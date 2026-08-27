import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // 1. Admin login & fleet
  console.log("Navigating to login...");
  await page.goto("https://danamiratest.vercel.app/login", { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', "admin@danamirashipping.com");
  await page.fill('input[type="password"]', "AdminPassword123!");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/overview", { timeout: 15000 });

  await page.goto("https://danamiratest.vercel.app/fleet", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "C:\\Users\\Jaku\\.gemini\\antigravity\\brain\\c4ea53a2-dcae-4aef-819a-50eea4dced37\\live_09_fleet_cms_restored.png", fullPage: true });
  console.log("Captured live_09_fleet_cms_restored.png");

  // 2. Public fleet page
  await page.goto("https://danamiratest.vercel.app/fleet.html", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "C:\\Users\\Jaku\\.gemini\\antigravity\\brain\\c4ea53a2-dcae-4aef-819a-50eea4dced37\\live_10_fleet_public_all.png", fullPage: true });
  console.log("Captured live_10_fleet_public_all.png");

  // 3. Public Vessel Molpadia
  await page.goto("https://danamiratest.vercel.app/vessel.html?imo=9613616", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "C:\\Users\\Jaku\\.gemini\\antigravity\\brain\\c4ea53a2-dcae-4aef-819a-50eea4dced37\\live_11_vessel_molpadia.png", fullPage: true });
  console.log("Captured live_11_vessel_molpadia.png");

  // 4. Public Vessel Metanira
  await page.goto("https://danamiratest.vercel.app/vessel.html?imo=9584724", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "C:\\Users\\Jaku\\.gemini\\antigravity\\brain\\c4ea53a2-dcae-4aef-819a-50eea4dced37\\live_12_vessel_metanira.png", fullPage: true });
  console.log("Captured live_12_vessel_metanira.png");

  await browser.close();
  console.log("All screenshots captured successfully!");
}

main().catch(console.error);
