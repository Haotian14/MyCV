// Render resume.html to resume.pdf (A4) with Playwright's Chromium.
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const root = path.resolve(__dirname, '..');
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  );
  const page = await browser.newPage();
  await page.goto('file://' + path.join(root, 'resume.html'));
  await page.pdf({ path: path.join(root, 'resume.pdf'), format: 'A4', printBackground: true });
  await browser.close();
})();
