// Render resume.html to A4 PDFs with Playwright's Chromium.
//   resume.pdf           public copy: no phone or photo (committed)
//   dist/resume-full.pdf full copy filled from private/ (git-ignored)
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const privateDir = path.join(root, 'private');

function loadPrivate() {
  const profilePath = path.join(privateDir, 'profile.json');
  if (!fs.existsSync(profilePath)) return null;
  const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
  const photo = ['photo.jpg', 'photo.png'].map((f) => path.join(privateDir, f)).find(fs.existsSync);
  if (photo) {
    const type = photo.endsWith('.png') ? 'image/png' : 'image/jpeg';
    profile.photo = `data:${type};base64,${fs.readFileSync(photo).toString('base64')}`;
  }
  return profile;
}

async function render(browser, out, profile) {
  const page = await browser.newPage();
  await page.goto('file://' + path.join(root, 'resume.html'));
  if (profile) {
    await page.evaluate((p) => {
      document.querySelectorAll('.contacts li[data-private]').forEach((li) => {
        const value = p[li.dataset.private];
        if (value) {
          li.querySelector('span').textContent = value;
          li.classList.remove('is-empty');
        }
      });
      if (p.photo) document.querySelector('img[data-private="photo"]').src = p.photo;
    }, profile);
  }
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await page.close();
  console.log('wrote', path.relative(root, out));
}

(async () => {
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  );
  await render(browser, path.join(root, 'resume.pdf'), null);
  const profile = loadPrivate();
  if (profile) {
    fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
    await render(browser, path.join(root, 'dist', 'resume-full.pdf'), profile);
  }
  await browser.close();
})();
