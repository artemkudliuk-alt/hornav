import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("1. Submitting test inquiry from Homepage (/index.html)...");
  await page.goto("https://danamiratest.vercel.app/", { waitUntil: "networkidle" });
  await page.fill("#input-name", "Homepage Charter Client");
  await page.fill("#input-company", "Baltic Bulk Lines");
  await page.fill("#input-email", "baltic@bulk-shipping.com");
  await page.fill("#input-message", "Need vessel availability for Grain loading in Constantza next month.");
  await page.click("#contact-btn-submit");
  await page.waitForTimeout(2000);

  console.log("2. Submitting test inquiry from Vessel Modal (/vessel.html)...");
  await page.goto("https://danamiratest.vercel.app/vessel.html?id=11111111-1111-1111-1111-111111111111", { waitUntil: "networkidle" });
  // Open inquiry modal
  await page.click("a[href='#inquiry-modal'], button:has-text('GET IN TOUCH')");
  await page.waitForTimeout(1000);
  await page.fill("#form-name", "Vessel Modal Charterer");
  await page.fill("#form-phone", "+30 210 999 8888");
  await page.fill("#form-email", "charter-desk@athens-marine.com");
  await page.fill("#form-message", "Requesting Q88 and rate for MV Molpadia.");
  await page.click("#vessel-inquiry-form button[type=submit]");
  await page.waitForTimeout(2500);

  console.log("3. Logging in to inspect both incoming leads...");
  await page.goto("https://danamiratest.vercel.app/login", { waitUntil: "networkidle" });
  await page.fill("#email", "admin@danamirashipping.com");
  await page.fill("#password", "admin123");
  await page.click("button[type=submit]");
  await page.waitForTimeout(3000);

  await page.goto("https://danamiratest.vercel.app/leads", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "C:\\Users\\Jaku\\.gemini\\antigravity\\brain\\c4ea53a2-dcae-4aef-819a-50eea4dced37\\live_15_both_forms_leads.png", fullPage: true });

  const text = await page.textContent("body");
  console.log("Contains Homepage lead:", text?.includes("Homepage Charter Client"));
  console.log("Contains Vessel modal lead:", text?.includes("Vessel Modal Charterer"));

  await browser.close();
}

main().catch(console.error);
