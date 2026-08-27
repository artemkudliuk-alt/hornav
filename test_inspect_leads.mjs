import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("Navigating to login...");
  await page.goto("https://danamiratest.vercel.app/login", { waitUntil: "networkidle" });
  await page.fill("#email", "admin@danamira.com");
  await page.fill("#password", "admin123");
  await page.click("button[type=submit]");
  await page.waitForTimeout(3000);
  console.log("Current URL:", page.url());

  console.log("Navigating to /leads...");
  await page.goto("https://danamiratest.vercel.app/leads", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "C:\\Users\\Jaku\\.gemini\\antigravity\\brain\\c4ea53a2-dcae-4aef-819a-50eea4dced37\\live_13_leads_table.png", fullPage: true });

  const text = await page.textContent("body");
  console.log("Leads table text snippet:", text?.substring(0, 300));

  await browser.close();
}

main().catch(console.error);
