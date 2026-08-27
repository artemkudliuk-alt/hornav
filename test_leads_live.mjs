import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("1. Submitting test inquiry via Contacts page (/contacts.html)...");
  await page.goto("https://danamiratest.vercel.app/contacts.html", { waitUntil: "networkidle" });
  await page.fill("#c-name", "Live Test Client Greek Charter");
  await page.fill("#c-company", "Aegean Maritime LLC");
  await page.fill("#c-email", "charter@aegean-maritime.gr");
  await page.fill("#c-message", "Urgent request for general cargo 6000 DWT Mediterranean route.");
  await page.click("#contact-submit-btn");
  await page.waitForTimeout(2500);

  console.log("2. Logging into Admin Panel to inspect incoming leads...");
  await page.goto("https://danamiratest.vercel.app/login", { waitUntil: "networkidle" });
  await page.fill("#email", "admin@danamira.com");
  await page.fill("#password", "admin123");
  await page.click("button[type=submit]");
  await page.waitForURL("**/overview", { timeout: 15000 });

  console.log("3. Checking /leads table...");
  await page.goto("https://danamiratest.vercel.app/leads", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "C:\\Users\\Jaku\\.gemini\\antigravity\\brain\\c4ea53a2-dcae-4aef-819a-50eea4dced37\\live_13_leads_verified.png", fullPage: true });

  const bodyText = await page.textContent("body");
  console.log("Is new lead visible in Admin Leads table?", bodyText.includes("Live Test Client Greek Charter"));

  await browser.close();
}

main().catch(console.error);
