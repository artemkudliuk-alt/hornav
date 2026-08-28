import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("Navigating to https://danamiratest.vercel.app...");
  await page.goto("https://danamiratest.vercel.app", { waitUntil: "domcontentloaded" });
  
  await page.screenshot({ path: "C:/Users/Jaku/.gemini/antigravity/brain/c4ea53a2-dcae-4aef-819a-50eea4dced37/live_17_preloader_lightened.png" });
  console.log("Preloader screenshot saved.");

  await page.waitForTimeout(3000);
  await page.screenshot({ path: "C:/Users/Jaku/.gemini/antigravity/brain/c4ea53a2-dcae-4aef-819a-50eea4dced37/live_18_hero_lightened.png" });
  console.log("Hero screenshot saved.");

  await page.evaluate(() => window.scrollTo(0, 1100));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "C:/Users/Jaku/.gemini/antigravity/brain/c4ea53a2-dcae-4aef-819a-50eea4dced37/live_19_company_lightened.png" });
  console.log("Company screenshot saved.");

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "C:/Users/Jaku/.gemini/antigravity/brain/c4ea53a2-dcae-4aef-819a-50eea4dced37/live_20_footer_lightened.png" });
  console.log("Footer screenshot saved.");

  await page.goto("https://danamiratest.vercel.app/fleet.html", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: "C:/Users/Jaku/.gemini/antigravity/brain/c4ea53a2-dcae-4aef-819a-50eea4dced37/live_21_fleet_page_lightened.png" });
  console.log("Fleet page screenshot saved.");

  await browser.close();
  console.log("All screenshots captured successfully!");
}

main().catch(console.error);
