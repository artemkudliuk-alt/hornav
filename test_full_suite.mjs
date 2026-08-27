import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("1. Submitting test inquiry from Contacts page...");
  await page.goto("https://danamiratest.vercel.app/contacts.html", { waitUntil: "networkidle" });
  await page.fill("#c-name", "Dimitrios Vassiliou");
  await page.fill("#c-company", "Aegean Sea Chartering");
  await page.fill("#c-email", "dimitrios@aegean-charter.gr");
  await page.fill("#c-message", "Looking for spot fixtures for general cargo in Eastern Med.");
  await page.click("#contact-submit-btn");
  await page.waitForTimeout(2000);

  console.log("2. Submitting test inquiry from Vessel Modal (MV Molpadia)...");
  await page.goto("https://danamiratest.vercel.app/vessel.html?id=11111111-1111-1111-1111-111111111111", { waitUntil: "networkidle" });
  await page.click("#btn-open-inquiry-modal");
  await page.waitForTimeout(500);
  await page.fill("#form-name", "Nikolaos Marine Broker");
  await page.fill("#form-phone", "+30 211 4455 667");
  await page.fill("#form-email", "broker@nikolaos-shipping.gr");
  await page.fill("#form-message", "Inquiry for MV Molpadia time charter duration 6 months.");
  await page.click("#vessel-inquiry-form button[type=submit]");
  await page.waitForTimeout(2000);

  console.log("3. Logging into Admin Panel to inspect /leads...");
  await page.goto("https://danamiratest.vercel.app/login", { waitUntil: "networkidle" });
  await page.fill("#email", "admin@danamirashipping.com");
  await page.fill("#password", "admin123");
  await page.click("button[type=submit]");
  await page.waitForTimeout(3000);

  await page.goto("https://danamiratest.vercel.app/leads", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "C:\\Users\\Jaku\\.gemini\\antigravity\\brain\\c4ea53a2-dcae-4aef-819a-50eea4dced37\\live_15_all_forms_tested.png", fullPage: true });

  const text = await page.textContent("body");
  console.log("Found Dimitrios in leads table:", text?.includes("Dimitrios Vassiliou"));
  console.log("Found Nikolaos in leads table:", text?.includes("Nikolaos Marine Broker"));

  await browser.close();
}

main().catch(console.error);
