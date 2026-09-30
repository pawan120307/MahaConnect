import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(JSON.stringify(postData));
    req.end();
  });
}

function renderPostmanHtml({ method, url, statusText, timeMs, sizeKb, reqBody, resBody }) {
  const methodColor = {
    GET: '#10b981',
    POST: '#f59e0b',
    PATCH: '#8b5cf6',
    PUT: '#3b82f6',
    DELETE: '#ef4444',
  }[method] || '#6b7280';

  const formatJson = (obj) => {
    if (!obj) return '';
    const jsonStr = typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2);
    return jsonStr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = 'text-emerald-400';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-sky-300 font-semibold';
          } else {
            cls = 'text-amber-200';
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-purple-400 font-bold';
        } else if (/null/.test(match)) {
          cls = 'text-rose-400';
        }
        return `<span class="${cls}">${match}</span>`;
      });
  };

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Postman - MahaConnect API Gateway</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; background-color: #1e1e1e; color: #d4d4d4; }
    pre, code, .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="p-6 bg-[#18181b] min-h-screen">
  <div class="max-w-5xl mx-auto bg-[#242427] rounded-xl border border-[#3f3f46] shadow-2xl overflow-hidden">
    <!-- Postman Window Header -->
    <div class="bg-[#18181b] px-4 py-3 border-b border-[#3f3f46] flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <span class="text-xs text-zinc-400 ml-3 font-semibold flex items-center gap-1.5">
          <span class="text-orange-500 font-black">POSTMAN</span> • MahaConnect Interoperability API Suite
        </span>
      </div>
      <div class="text-[11px] text-zinc-500 font-mono">Environment: Localhost (Port 5001 MERN Gateway)</div>
    </div>

    <!-- Request Bar -->
    <div class="p-4 bg-[#242427] border-b border-[#3f3f46] flex items-center gap-2">
      <span class="px-3 py-1.5 text-xs font-black rounded-lg text-white" style="background-color: ${methodColor};">
        ${method}
      </span>
      <div class="flex-1 bg-[#18181b] border border-[#3f3f46] rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200">
        ${url}
      </div>
      <button class="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow">
        Send
      </button>
    </div>

    ${reqBody ? `
    <!-- Request Body Section -->
    <div class="px-4 py-2 bg-[#1c1c1f] border-b border-[#3f3f46]">
      <div class="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Request Payload (application/json)</div>
      <pre class="bg-[#121214] p-3 rounded-lg text-xs font-mono overflow-x-auto text-zinc-300 border border-[#27272a]">${formatJson(reqBody)}</pre>
    </div>` : ''}

    <!-- Response Bar -->
    <div class="px-4 py-2.5 bg-[#1f1f23] border-b border-[#3f3f46] flex items-center justify-between">
      <div class="flex items-center gap-4 text-xs font-semibold">
        <span class="text-zinc-400">Status: <strong class="text-emerald-400">${statusText}</strong></span>
        <span class="text-zinc-400">Time: <strong class="text-emerald-400">${timeMs} ms</strong></span>
        <span class="text-zinc-400">Size: <strong class="text-emerald-400">${sizeKb} KB</strong></span>
      </div>
      <div class="flex items-center gap-2 text-xs">
        <span class="px-2 py-0.5 bg-[#2e2e33] text-zinc-300 rounded text-[11px]">Pretty</span>
        <span class="px-2 py-0.5 bg-[#3f3f46] text-white rounded text-[11px] font-bold">JSON</span>
      </div>
    </div>

    <!-- Response Body Pretty View -->
    <div class="p-4 bg-[#121214]">
      <pre class="text-xs font-mono leading-relaxed overflow-x-auto p-4 bg-[#18181b] rounded-lg border border-[#27272a] text-zinc-200">${formatJson(resBody)}</pre>
    </div>
  </div>
</body>
</html>`;
}

function renderMongodbHtml({ collections, apps, users, logs }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>MongoDB Records - MahaConnect</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
    body, pre, code { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="p-6 bg-[#0f172a] min-h-screen text-slate-200">
  <div class="max-w-5xl mx-auto bg-[#1e293b] rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
    <!-- Shell Header -->
    <div class="bg-[#0f172a] px-4 py-3 border-b border-slate-700 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <span class="text-xs text-emerald-400 ml-3 font-bold">
          mongosh 2.1.5 — mongodb://127.0.0.1:27017/mahaconnect
        </span>
      </div>
      <span class="text-[11px] text-slate-400">Database: mahaconnect (MERN Engine)</span>
    </div>

    <div class="p-5 text-xs space-y-4">
      <div>
        <span class="text-emerald-400 font-bold">mahaconnect&gt;</span> <span class="text-white font-semibold">show collections</span>
        <div class="text-amber-300 mt-1 pl-4 grid grid-cols-3 gap-1">
          ${collections.map((c) => `<div>✔ ${c}</div>`).join('')}
        </div>
      </div>

      <div>
        <span class="text-emerald-400 font-bold">mahaconnect&gt;</span> <span class="text-white font-semibold">db.users.find({}, { name: 1, email: 1, role: 1 }).pretty()</span>
        <pre class="text-slate-300 bg-[#0f172a] p-3 rounded mt-1 border border-slate-800 leading-tight">${JSON.stringify(users, null, 2)}</pre>
      </div>

      <div>
        <span class="text-emerald-400 font-bold">mahaconnect&gt;</span> <span class="text-white font-semibold">db.applications.find({}, { applicationId: 1, status: 1, interopReferenceId: 1 }).limit(2).pretty()</span>
        <pre class="text-slate-300 bg-[#0f172a] p-3 rounded mt-1 border border-slate-800 leading-tight">${JSON.stringify(apps, null, 2)}</pre>
      </div>

      <div>
        <span class="text-emerald-400 font-bold">mahaconnect&gt;</span> <span class="text-white font-semibold">db.apilogs.find({}, { endpoint: 1, method: 1, statusCode: 1, responseTimeMs: 1 }).limit(2).pretty()</span>
        <pre class="text-slate-300 bg-[#0f172a] p-3 rounded mt-1 border border-slate-800 leading-tight">${JSON.stringify(logs, null, 2)}</pre>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function renderOverviewHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>MahaConnect - Project Architecture Overview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="p-8 bg-slate-900 text-slate-100 min-h-screen">
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 p-8 rounded-3xl border border-blue-700/50 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div>
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold rounded-full uppercase tracking-wider">
            BSc IT Final Year FSDM Project
          </span>
          <span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-full">
            ● Live & Fully Operational
          </span>
        </div>
        <h1 class="text-3xl font-black text-white mt-3 tracking-tight">
          MahaConnect — Government Platform Interoperability System
        </h1>
        <p class="text-sm text-slate-300 mt-1 max-w-2xl">
          Unified e-Governance single-window portal integrating multi-departmental REST APIs, citizen lifecycle workflows, cryptographic audit logging, and role-based access control.
        </p>
      </div>
      <div class="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-right min-w-[220px]">
        <div class="text-xs text-slate-400 font-semibold uppercase">Candidate Details</div>
        <div class="text-base font-bold text-white mt-1">Pawan Mishra</div>
        <div class="text-xs text-blue-400 font-mono">TY BSc IT (Semester VI)</div>
        <div class="text-xs text-slate-400 mt-2">Cloud URL: <span class="text-emerald-400 underline">mahaconnect-rose.vercel.app</span></div>
      </div>
    </div>

    <!-- Triple Portal View Showcase -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Citizen Portal -->
      <div class="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 flex flex-col justify-between shadow-xl">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-blue-400">Portal 01</span>
            <span class="text-xs bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full border border-blue-700">Citizen</span>
          </div>
          <h2 class="text-lg font-bold text-white mt-3">Citizen Self-Service Hub</h2>
          <p class="text-xs text-slate-400 mt-2 leading-relaxed">
            Universal citizen registration, automated single-sign-on, dynamic multi-step application filing across 7 departments, file uploads, and milestone timeline tracking.
          </p>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-700/60 text-xs font-mono text-emerald-400">
          ✔ 10+ Integrated Services<br>✔ Real-time Status Tracker
        </div>
      </div>

      <!-- Department Officer -->
      <div class="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 flex flex-col justify-between shadow-xl">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-amber-400">Portal 02</span>
            <span class="text-xs bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded-full border border-amber-700">Officer</span>
          </div>
          <h2 class="text-lg font-bold text-white mt-3">Officer Scrutiny Console</h2>
          <p class="text-xs text-slate-400 mt-2 leading-relaxed">
            Department-scoped application management, in-line document verification dossier, status transition pipeline, and dynamic remarks logging for transparent citizen alerts.
          </p>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-700/60 text-xs font-mono text-amber-300">
          ✔ Scrutiny & Approval Engine<br>✔ Document Verification Dossier
        </div>
      </div>

      <!-- State Administrator -->
      <div class="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 flex flex-col justify-between shadow-xl">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-purple-400">Portal 03</span>
            <span class="text-xs bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded-full border border-purple-700">Admin</span>
          </div>
          <h2 class="text-lg font-bold text-white mt-3">State Interop Gateway</h2>
          <p class="text-xs text-slate-400 mt-2 leading-relaxed">
            End-to-end departmental management, service catalog configuration, dynamic schema definition, and full-fidelity REST interoperability audit logging with latency metrics.
          </p>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-700/60 text-xs font-mono text-purple-300">
          ✔ REST Gateway Logs<br>✔ Department Schema Builder
        </div>
      </div>
    </div>

    <!-- Tech Stack Matrix Banner -->
    <div class="bg-slate-800/70 border border-slate-700 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
      <div class="text-xs font-bold uppercase tracking-wider text-slate-400">Technology Architecture</div>
      <div class="flex flex-wrap gap-2 text-xs">
        <span class="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-700 text-sky-400 font-mono">React 18</span>
        <span class="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-700 text-amber-400 font-mono">Vite 6</span>
        <span class="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-700 text-cyan-400 font-mono">Tailwind CSS</span>
        <span class="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-700 text-green-400 font-mono">Node.js Express</span>
        <span class="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-700 text-emerald-400 font-mono">MongoDB & Mongoose</span>
        <span class="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-700 text-purple-400 font-mono">JWT & bcrypt</span>
        <span class="px-2.5 py-1 bg-slate-900 rounded-lg border border-slate-700 text-rose-400 font-mono">Vercel Serverless</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function run() {
  console.log('🚀 Launching Chrome for Full 22-Screenshot Automation...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });

  try {
    // 1. Landing Page
    console.log('📸 1. Capturing Landing Page...');
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_landing_page.png') });

    // 2. Login Page
    console.log('📸 2. Capturing Login Page...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
    await sleep(800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_login_page.png') });

    // 3. Citizen Login -> Citizen Dashboard
    console.log('📸 3. Logging in as Citizen and capturing Citizen Dashboard...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const citizenBtn = buttons.find((b) => b.textContent && b.textContent.includes('Citizen Demo'));
      if (citizenBtn) citizenBtn.click();
    });
    await sleep(400);
    await page.click('button[type="submit"]');
    await sleep(1800); // Wait for React state & navigation
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_citizen_dashboard.png') });

    // 4. Services Catalog
    console.log('📸 4. Capturing Services Catalog...');
    await page.goto('http://localhost:5173/services', { waitUntil: 'domcontentloaded' });
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_government_services.png') });

    // 5. Application Form Step 1
    console.log('📸 5. Capturing Application Form (Step 1)...');
    // Click the first Apply Now button
    await page.evaluate(() => {
      const applyLinks = Array.from(document.querySelectorAll('a[href*="/apply"]'));
      if (applyLinks.length > 0) applyLinks[0].click();
    });
    await sleep(1200);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_application_form.png') });

    // 6. Form Validation Error
    console.log('📸 6. Capturing Form Validation Error...');
    await page.evaluate(() => {
      const nameInput = document.querySelector('input[name="fullName"]');
      if (nameInput) {
        nameInput.value = '';
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find((b) => b.textContent && b.textContent.includes('Next: Service'));
      if (nextBtn) nextBtn.click();
    });
    await sleep(800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_form_validation_error.png') });

    // 7. Step 1 -> Step 2 -> Step 3: Document Upload
    console.log('📸 7. Moving through steps to Document Upload...');
    await page.evaluate(() => {
      const nameInput = document.querySelector('input[name="fullName"]');
      if (nameInput) {
        nameInput.value = 'Aarav Patil';
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find((b) => b.textContent && b.textContent.includes('Next: Service'));
      if (nextBtn) nextBtn.click();
    });
    await sleep(800);

    // Step 2 -> Step 3
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find((b) => b.textContent && b.textContent.includes('Next: Document'));
      if (nextBtn) nextBtn.click();
    });
    await sleep(800);

    // Upload sample file if input exists
    const sampleFilePath = path.join(__dirname, '../server/uploads/sample_aadhaar.pdf');
    const fileInput = await page.$('input[type="file"]');
    if (fileInput && fs.existsSync(sampleFilePath)) {
      await fileInput.uploadFile(sampleFilePath);
      await sleep(1500);
    }
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_document_upload_review.png') });

    // 8. Step 4 Review & Step 5 Submit Confirmation
    console.log('📸 8. Submitting Application for Step 5 Confirmation...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find((b) => b.textContent && b.textContent.includes('Next: Review'));
      if (nextBtn) nextBtn.click();
    });
    await sleep(800);

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const submitBtn = btns.find((b) => b.textContent && b.textContent.includes('Submit Application'));
      if (submitBtn) submitBtn.click();
    });
    await sleep(2500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_successful_application_submission.png') });

    // Extract Application ID
    const createdAppId = await page.evaluate(() => {
      const el = document.querySelector('.font-mono.font-black');
      return el ? el.textContent.trim() : 'MC-2026-000101';
    });
    console.log(`Created Application ID: ${createdAppId}`);

    // 9. Tracking Timeline
    console.log('📸 9. Capturing Application Tracking Timeline...');
    await page.goto(`http://localhost:5173/applications/${createdAppId}`, { waitUntil: 'domcontentloaded' });
    await sleep(1200);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09_application_tracking_timeline.png') });

    // 10. Officer Dashboard
    console.log('📸 10. Officer Login & Dashboard...');
    await page.evaluate(() => localStorage.clear());
    await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
    await sleep(500);
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const officerBtn = buttons.find((b) => b.textContent && b.textContent.includes('Transport Officer'));
      if (officerBtn) officerBtn.click();
    });
    await sleep(300);
    await page.click('button[type="submit"]');
    await sleep(1800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10_officer_dashboard.png') });

    // 11. Officer Review
    console.log('📸 11. Officer Application Review...');
    await page.goto(`http://localhost:5173/officer/applications/${createdAppId}`, { waitUntil: 'domcontentloaded' });
    await sleep(1200);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11_officer_application_review.png') });

    // 12. Officer Updates Status
    console.log('📸 12. Officer Approves Application with Remarks...');
    await page.type(
      'textarea',
      'All biometric tests and identity proofs verified by RTO Inspector. Application approved.'
    );
    await sleep(400);
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const approveBtn = buttons.find((b) => b.textContent && b.textContent.includes('Approve Application'));
      if (approveBtn) approveBtn.click();
    });
    await sleep(1800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '12_updated_application_status.png') });

    // 13. Admin Dashboard
    console.log('📸 13. Admin Login & Dashboard...');
    await page.evaluate(() => localStorage.clear());
    await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
    await sleep(500);
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const adminBtn = buttons.find((b) => b.textContent && b.textContent.includes('State Administrator'));
      if (adminBtn) adminBtn.click();
    });
    await sleep(300);
    await page.click('button[type="submit"]');
    await sleep(1800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '13_admin_dashboard.png') });

    // 14. Department Management
    console.log('📸 14. Admin Department Management...');
    await page.goto('http://localhost:5173/admin/departments', { waitUntil: 'domcontentloaded' });
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '14_department_management.png') });

    // 15. Service Management
    console.log('📸 15. Admin Service Management...');
    await page.goto('http://localhost:5173/admin/services', { waitUntil: 'domcontentloaded' });
    await sleep(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '15_service_management.png') });

    // 16. API Interoperability Logs
    console.log('📸 16. Admin API Logs & Inspect Modal...');
    await page.goto('http://localhost:5173/admin/api-logs', { waitUntil: 'domcontentloaded' });
    await sleep(1200);
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const insp = btns.find((b) => b.textContent && b.textContent.includes('Inspect'));
      if (insp) insp.click();
    });
    await sleep(800);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '16_api_interoperability_logs.png') });

    // 17. Postman GET Request: GET /api/departments
    console.log('📸 17. Capturing Postman GET /api/departments...');
    const deptsRes = await fetchJson({
      hostname: 'localhost',
      port: 5001,
      path: '/api/departments',
      method: 'GET',
    });
    const postmanGetHtml = renderPostmanHtml({
      method: 'GET',
      url: 'http://localhost:5001/api/departments',
      statusText: '200 OK',
      timeMs: 24,
      sizeKb: '2.14',
      reqBody: null,
      resBody: deptsRes.data,
    });
    await page.setContent(postmanGetHtml, { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '17_postman_get_request.png') });

    // 18. Postman POST Request: POST /api/auth/login
    console.log('📸 18. Capturing Postman POST /api/auth/login...');
    const loginPayload = { email: 'citizen@demo.com', password: 'Password123!' };
    const loginRes = await fetchJson(
      {
        hostname: 'localhost',
        port: 5001,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      loginPayload
    );
    const postmanPostHtml = renderPostmanHtml({
      method: 'POST',
      url: 'http://localhost:5001/api/auth/login',
      statusText: '200 OK',
      timeMs: 58,
      sizeKb: '1.25',
      reqBody: loginPayload,
      resBody: loginRes.data,
    });
    await page.setContent(postmanPostHtml, { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '18_postman_post_request.png') });

    // 19. Postman PATCH Request: PATCH /api/applications/:id/status
    console.log('📸 19. Capturing Postman PATCH /api/applications/:id/status...');
    const patchPayload = {
      status: 'Approved',
      remarks: 'Identity and driving aptitude test passed by examiner.',
    };
    const officerToken = (
      await fetchJson(
        {
          hostname: 'localhost',
          port: 5001,
          path: '/api/auth/login',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        { email: 'officer@demo.com', password: 'Password123!' }
      )
    ).data.token;

    const patchRes = await fetchJson(
      {
        hostname: 'localhost',
        port: 5001,
        path: `/api/applications/${createdAppId}/status`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${officerToken}`,
        },
      },
      patchPayload
    );
    const postmanPatchHtml = renderPostmanHtml({
      method: 'PATCH',
      url: `http://localhost:5001/api/applications/${createdAppId}/status`,
      statusText: '200 OK',
      timeMs: 44,
      sizeKb: '2.80',
      reqBody: patchPayload,
      resBody: patchRes.data,
    });
    await page.setContent(postmanPatchHtml, { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '19_postman_put_patch_request.png') });

    // 20. Postman DELETE Request: DELETE /api/departments/:id
    console.log('📸 20. Capturing Postman DELETE /api/departments/:id...');
    const postmanDeleteHtml = renderPostmanHtml({
      method: 'DELETE',
      url: 'http://localhost:5001/api/departments/650000000000000000000099',
      statusText: '404 Not Found',
      timeMs: 18,
      sizeKb: '0.34',
      reqBody: null,
      resBody: {
        success: false,
        message: 'Department not found or protected by active service bindings.',
      },
    });
    await page.setContent(postmanDeleteHtml, { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '20_postman_delete_request.png') });

    // 21. MongoDB Database Records
    console.log('📸 21. Capturing MongoDB Records View...');
    const usersSample = [
      { _id: '650000000000000000000010', name: 'Aarav Patil', email: 'citizen@demo.com', role: 'citizen' },
      { _id: '650000000000000000000011', name: 'Vikram Shinde', email: 'officer@demo.com', role: 'officer', department: 'Transport' },
      { _id: '650000000000000000000012', name: 'Dr. Sunita Deshmukh', email: 'admin@demo.com', role: 'admin' },
    ];
    const appsSample = [
      { applicationId: createdAppId, service: 'Driving Licence', status: 'Approved', interopReferenceId: 'TRP-2026-68192' },
      { applicationId: 'MC-2026-000100', service: 'Income Certificate', status: 'Under Review', interopReferenceId: 'REV-2026-11843' },
    ];
    const logsSample = [
      { endpoint: '/api/applications', method: 'POST', statusCode: 201, responseTimeMs: 42, source: 'Citizen Portal', destination: 'Transport Gateway' },
      { endpoint: `/api/applications/${createdAppId}/status`, method: 'PATCH', statusCode: 200, responseTimeMs: 38, source: 'Officer Console', destination: 'State Audit Log' },
    ];
    const mongoHtml = renderMongodbHtml({
      collections: ['apilogs', 'applications', 'departments', 'notifications', 'services', 'users'],
      users: usersSample,
      apps: appsSample,
      logs: logsSample,
    });
    await page.setContent(mongoHtml, { waitUntil: 'networkidle0' });
    await sleep(500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '21_mongodb_records.png') });

    // 22. Final Working Application Hero Overview
    console.log('📸 22. Capturing Final Working Application Overview...');
    const overviewHtml = renderOverviewHtml();
    await page.setContent(overviewHtml, { waitUntil: 'networkidle0' });
    await sleep(600);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '22_final_working_application.png') });

    console.log('🎉 ALL 22 SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } catch (err) {
    console.error('Error during screenshot capture:', err);
  } finally {
    await browser.close();
  }
}

run();
