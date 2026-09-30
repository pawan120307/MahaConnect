const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log('🚀 Launching Chrome to capture real application screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: {
      width: 1280,
      height: 820,
      deviceScaleFactor: 2,
    },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  try {
    // 1. Landing Page
    console.log('📸 1. Capturing Landing Page...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await sleep(800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_landing_page.png') });

    // 2. Login Page
    console.log('📸 2. Capturing Login Page...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await sleep(600);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_login_page.png') });

    // 3. Citizen Login & Dashboard
    console.log('📸 3. Logging in as Citizen and capturing Dashboard...');
    // Click the 1-click citizen autofill
    const citizenAutofill = await page.$('button[type="button"]');
    if (citizenAutofill) {
      await citizenAutofill.click();
      await sleep(300);
    }
    // Click submit
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_citizen_dashboard.png') });

    // 4. Government Services Page
    console.log('📸 4. Capturing Services Catalog...');
    await page.goto('http://localhost:5173/services', { waitUntil: 'networkidle0' });
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_government_services.png') });

    // 5. Application Form (Step 1)
    console.log('📸 5. Capturing Application Form (Step 1)...');
    // Find the first "Apply Now" button
    const applyButtons = await page.$$('a[href*="/apply"]');
    if (applyButtons.length > 0) {
      await applyButtons[0].click();
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
    } else {
      await page.goto('http://localhost:5173/services/650000000000000000000001/apply', { waitUntil: 'networkidle0' });
    }
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_application_form.png') });

    // 6. Form Validation Error
    console.log('📸 6. Capturing Form Validation Error...');
    // Clear Full Name input to trigger validation error
    await page.evaluate(() => {
      const nameInput = document.querySelector('input[name="fullName"]');
      if (nameInput) {
        nameInput.value = '';
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    // Click Next button
    const nextBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.includes('Next'));
    });
    if (nextBtn) {
      await nextBtn.click();
    }
    await sleep(800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_form_validation_error.png') });

    // 7. Complete Step 1, 2, 3 -> Document Upload & Review
    console.log('📸 7. Capturing Document Upload & Review...');
    // Refill full name
    await page.evaluate(() => {
      const nameInput = document.querySelector('input[name="fullName"]');
      if (nameInput) {
        nameInput.value = 'Aarav Patil';
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    // Click Next: Service Information
    const nextBtn1 = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.includes('Next: Service'));
    });
    if (nextBtn1) await nextBtn1.click();
    await sleep(600);

    // Now in Step 2: Service Info -> Click Next: Document Upload
    const nextBtn2 = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.includes('Next: Document'));
    });
    if (nextBtn2) await nextBtn2.click();
    await sleep(600);

    // Now in Step 3: Document Upload
    // Let's create a temporary dummy upload file and attach it
    const tempFilePath = path.join(__dirname, '../server/uploads/sample_aadhaar.pdf');
    const fileInput = await page.$('input[type="file"]');
    if (fileInput && fs.existsSync(tempFilePath)) {
      await fileInput.uploadFile(tempFilePath);
      await sleep(1200);
    }
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_document_upload_review.png') });

    // 8. Review and Submit
    console.log('📸 8. Submitting Application and capturing Confirmation...');
    // Click Next: Review Application
    const nextBtn3 = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.includes('Next: Review'));
    });
    if (nextBtn3) await nextBtn3.click();
    await sleep(800);

    // Click Submit Application
    const submitBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.includes('Submit Application'));
    });
    if (submitBtn) await submitBtn.click();
    await sleep(2000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_successful_application_submission.png') });

    // Extract newly created Application ID from page
    const createdAppId = await page.evaluate(() => {
      const el = document.querySelector('.font-mono.font-black');
      return el ? el.textContent.trim() : 'MC-2026-000101';
    });
    console.log(`Created Application ID: ${createdAppId}`);

    // 9. Application Tracking Timeline
    console.log('📸 9. Capturing Application Tracking Timeline...');
    const trackLink = await page.$('a[href*="/applications/MC-"]');
    if (trackLink) {
      await trackLink.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
    } else {
      await page.goto(`http://localhost:5173/applications/${createdAppId}`, { waitUntil: 'networkidle0' });
    }
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_application_tracking_timeline.png') });

    // 10. Officer Dashboard
    console.log('📸 10. Logging out & logging in as Transport Officer...');
    // Logout
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await sleep(500);

    // Click Transport Officer autofill
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const officerBtn = buttons.find(b => b.textContent.includes('Transport Officer'));
      if (officerBtn) officerBtn.click();
    });
    await sleep(300);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_officer_dashboard.png') });

    // 11. Officer Application Review
    console.log('📸 11. Opening Application Scrutiny Dossier...');
    await page.goto(`http://localhost:5173/officer/applications/${createdAppId}`, { waitUntil: 'networkidle0' });
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11_officer_application_review.png') });

    // 12. Officer Updates Status -> Approved
    console.log('📸 12. Updating status to Approved with Remarks...');
    // Type remarks
    await page.type('textarea', 'All identity proofs and biometric verification completed successfully. Driving test scheduled.');
    await sleep(400);

    // Click "Approve Application"
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const approveBtn = buttons.find(b => b.textContent.includes('Approve Application'));
      if (approveBtn) approveBtn.click();
    });
    await sleep(1500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '12_updated_application_status.png') });

    // 13. Admin Dashboard
    console.log('📸 13. Logging out & logging in as Administrator...');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await sleep(500);

    // Click Administrator autofill
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const adminBtn = buttons.find(b => b.textContent.includes('State Administrator'));
      if (adminBtn) adminBtn.click();
    });
    await sleep(300);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '13_admin_dashboard.png') });

    // 14. Department Management
    console.log('📸 14. Capturing Department Management...');
    await page.goto('http://localhost:5173/admin/departments', { waitUntil: 'networkidle0' });
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '14_department_management.png') });

    // 15. Service Management
    console.log('📸 15. Capturing Service Management...');
    await page.goto('http://localhost:5173/admin/services', { waitUntil: 'networkidle0' });
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '15_service_management.png') });

    // 16. API Interoperability Logs
    console.log('📸 16. Capturing API Interoperability Logs...');
    await page.goto('http://localhost:5173/admin/api-logs', { waitUntil: 'networkidle0' });
    await sleep(1000);
    // Click the first "Inspect" button to open the JSON payload inspection modal!
    const inspectBtn = await page.$('button[title*="Inspect"], button:has-text("Inspect")');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const insp = btns.find(b => b.textContent.includes('Inspect'));
      if (insp) insp.click();
    });
    await sleep(800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '16_api_interoperability_logs.png') });

    console.log('🎉 Application UI Screenshots (1-16) captured successfully!');
  } catch (err) {
    console.error('Error during screenshot capture:', err);
  } finally {
    await browser.close();
  }
}

run();
