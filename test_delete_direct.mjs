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

  console.log("3. Fetching leads from internal API to get current IDs...");
  const leadsRes = await page.evaluate(async () => {
    const res = await fetch("/api/leads");
    return res.json();
  });
  console.log("Current leads in DB:", leadsRes.length);

  if (leadsRes.length > 0) {
    const firstId = leadsRes[0].lead?.id || leadsRes[0].id;
    console.log("Deleting lead ID:", firstId);
    const deleteResult = await page.evaluate(async (id) => {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      return res.json();
    }, firstId);
    console.log("Delete result:", deleteResult);
  }

  console.log("4. Reloading /leads to verify persistent deletion...");
  await page.goto("https://danamiratest.vercel.app/leads", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "C:\\Users\\Jaku\\.gemini\\antigravity\\brain\\c4ea53a2-dcae-4aef-819a-50eea4dced37\\live_14_leads_empty_verified.png", fullPage: true });

  const text = await page.textContent("body");
  console.log("Header text:", text?.includes("Inbound Leads & Freight Inquiries (0)"));

  await browser.close();
}

main().catch(console.error);
