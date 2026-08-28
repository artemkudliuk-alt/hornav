import { chromium } from "playwright";

async function testUser(email, password, roleName) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`Testing login for ${roleName} (${email})...`);
  await page.goto("https://danamiratest.vercel.app/login", { waitUntil: "networkidle" });
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click("button[type=submit]");
  await page.waitForTimeout(3000);

  const url = page.url();
  console.log(`${roleName} result URL:`, url);
  await browser.close();
}

async function main() {
  await testUser("admin@danamirashipping.com", "admin123", "ADMIN (admin123)");
  await testUser("admin@danamirashipping.com", "AdminPassword123!", "ADMIN (AdminPassword123!)");
  await testUser("manager@danamirashipping.com", "ManagerPassword123!", "MANAGER (ManagerPassword123!)");
  await testUser("manager@danamirashipping.com", "123456", "MANAGER (123456)");
}

main().catch(console.error);
