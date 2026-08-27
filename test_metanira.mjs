import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("Navigating to Metanira...");
  await page.goto("https://danamiratest.vercel.app/vessel.html?id=22222222-2222-2222-2222-222222222222", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const title = await page.textContent("#vessel-name-title");
  console.log("Rendered title on page:", title?.trim());
  await page.screenshot({ path: "C:\\Users\\Jaku\\.gemini\\antigravity\\brain\\c4ea53a2-dcae-4aef-819a-50eea4dced37\\live_12_vessel_metanira.png", fullPage: true });

  await browser.close();
}

main().catch(console.error);
