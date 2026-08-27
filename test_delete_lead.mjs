import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log("1. Logging in...");
  await page.goto("https://danamiratest.vercel.app/login", { waitUntil: "networkidle" });
  await page.fill("#email", "admin@danamirashipping.com");
  await page.fill("#password", "admin123");
  await page.click("button[type=submit]");
  await page.waitForTimeout(3000);

  console.log("2. Opening /leads...");
  await page.goto("https://danamiratest.vercel.app/leads", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Click on the three dots menu
  console.log("3. Clicking three-dots actions menu on the lead row...");
  const menuBtn = page.locator("button:has(svg.lucide-more-horizontal)").first();
  await menuBtn.click();
  await page.waitForTimeout(500);

  // Accept dialog
  page.on('dialog', async dialog => {
    console.log('Dialog prompt:', dialog.message());
    await dialog.accept();
  });

  console.log("4. Clicking Delete Inquiry...");
  const deleteBtn = page.locator("div[role=menuitem]:has-text('Delete')");
  await deleteBtn.click();
  await page.waitForTimeout(2000);

  console.log("5. Reloading page to verify deleted lead does NOT come back...");
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "C:\\Users\\Jaku\\.gemini\\antigravity\\brain\\c4ea53a2-dcae-4aef-819a-50eea4dced37\\live_14_leads_empty_verified.png", fullPage: true });

  const text = await page.textContent("body");
  console.log("Leads count in header after reload:", text?.includes("Inbound Leads & Freight Inquiries (0)"));

  await browser.close();
}

main().catch(console.error);
