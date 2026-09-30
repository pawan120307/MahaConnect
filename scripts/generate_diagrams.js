import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIAGRAMS_DIR = path.join(__dirname, '../screenshots');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const diagrams = [
  {
    name: '00_architecture_diagram.png',
    title: 'MahaConnect System Architecture',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #ffffff; text-align: center; }
  .box { border: 2px solid #0f2b48; border-radius: 6px; padding: 12px 20px; background: #f8fafc; font-size: 13px; font-weight: bold; color: #0f2b48; display: inline-block; min-width: 200px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
  .subtext { font-size: 10px; color: #475569; font-weight: normal; margin-top: 3px; }
  .arrow { font-size: 18px; color: #1e3a8a; margin: 8px 0; font-weight: bold; }
  .container { max-width: 700px; margin: 0 auto; padding: 15px; border: 1px solid #cbd5e1; border-radius: 8px; }
  .grid-2 { display: flex; justify-content: center; gap: 30px; margin-top: 5px; }
</style>
</head>
<body>
  <div class="container">
    <div style="font-size: 15px; font-weight: bold; color: #0f2b48; margin-bottom: 12px; text-transform: uppercase;">
      MahaConnect: Government Platform Interoperability Architecture
    </div>

    <div class="box" style="background: #eff6ff; border-color: #2563eb;">
      PRESENTATION TIER (CLIENT)
      <div class="subtext">React 18 • Vite 6 • Tailwind CSS • React Router • Axios</div>
      <div class="subtext">Citizen Portal | Department Officer Console | Administrator Dashboard</div>
    </div>

    <div class="arrow">▼ &nbsp; HTTP / RESTful Requests (JSON + JWT Bearer Tokens) &nbsp; ▲</div>

    <div class="box" style="background: #f0fdf4; border-color: #16a34a;">
      API GATEWAY & APPLICATION TIER (BACKEND)
      <div class="subtext">Node.js • Express.js Runtime (Port 5001)</div>
      <div class="subtext">CORS • Helmet Security • Rate Limiting • JWT Auth & RBAC Middleware</div>
    </div>

    <div class="arrow">▼ &nbsp; Internal Request Dispatch & Protocol Translation &nbsp; ▲</div>

    <div class="box" style="background: #fefce8; border-color: #ca8a04;">
      GOVERNMENT INTEROPERABILITY SERVICE LAYER
      <div class="subtext">Simulated Departmental REST Microservices & Adapter Routers</div>
      <div class="subtext">Revenue • Transport • Education • Municipal • Employment • Social Welfare</div>
    </div>

    <div class="arrow">▼ &nbsp; Mongoose ODM Schemas & Transaction Queries &nbsp; ▲</div>

    <div class="grid-2">
      <div class="box" style="background: #faf5ff; border-color: #9333ea; min-width: 260px;">
        DATA PERSISTENCE TIER
        <div class="subtext">MongoDB Document Store (v7.0)</div>
        <div class="subtext">Users • Departments • Services • Applications</div>
      </div>
      <div class="box" style="background: #fff1f2; border-color: #e11d48; min-width: 260px;">
        AUDIT & TELEMETRY LEDGER
        <div class="subtext">MongoDB ApiLog & Notification Collections</div>
        <div class="subtext">Immutable Timestamps • Latency (ms) • Status</div>
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    name: '00_dfd_level0.png',
    title: 'DFD Level 0 - Context Diagram',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 25px; font-family: Arial, sans-serif; background: #ffffff; text-align: center; }
  .entity { border: 2px solid #1e3a8a; border-radius: 4px; padding: 12px 16px; background: #f0fdf4; font-size: 12px; font-weight: bold; color: #0f2b48; width: 170px; display: inline-block; vertical-align: middle; }
  .process { border: 3px double #0f2b48; border-radius: 50%; width: 200px; height: 200px; display: inline-flex; flex-direction: column; align-items: center; justify-content: center; background: #eff6ff; font-size: 13px; font-weight: bold; color: #0f2b48; margin: 0 40px; vertical-align: middle; }
  .subtext { font-size: 10px; color: #475569; font-weight: normal; margin-top: 4px; }
  .container { max-width: 780px; margin: 0 auto; padding: 20px; border: 1px solid #cbd5e1; border-radius: 8px; }
  .flow-row { display: flex; align-items: center; justify-content: space-between; margin: 15px 0; }
  .label { font-size: 9.5pt; color: #1e293b; font-weight: bold; font-family: monospace; }
</style>
</head>
<body>
  <div class="container">
    <div style="font-size: 15px; font-weight: bold; color: #0f2b48; margin-bottom: 20px; text-transform: uppercase;">
      Data Flow Diagram (DFD Level 0) – Context Diagram
    </div>

    <div class="flow-row">
      <div style="text-align: right; width: 220px;">
        <div class="entity" style="margin-bottom: 20px;">
          CITIZEN
          <div class="subtext">Application Input & Tracking</div>
        </div>
        <div class="entity">
          DEPARTMENT OFFICER
          <div class="subtext">Scrutiny & Endorsement</div>
        </div>
      </div>

      <div class="process">
        <div>0.0</div>
        <div style="margin-top: 4px; font-size: 14px;">MAHACONNECT</div>
        <div>SYSTEM</div>
        <div class="subtext" style="padding: 0 10px;">Interoperability Engine & Gateway</div>
      </div>

      <div style="text-align: left; width: 220px;">
        <div class="entity" style="margin-bottom: 20px;">
          STATE ADMINISTRATOR
          <div class="subtext">Governance & Telemetry</div>
        </div>
        <div class="entity" style="background: #fefce8; border-color: #ca8a04;">
          SIMULATED DEPT APIs
          <div class="subtext">Transport, Revenue, Edu, etc.</div>
        </div>
      </div>
    </div>

    <div style="font-size: 10px; color: #64748b; margin-top: 15px; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
      Data Inflow: Credentials, Application Forms, Verification Remarks, Status Updates | Data Outflow: JWT Tokens, Acknowledgement IDs, Tracking Milestones, API Telemetry
    </div>
  </div>
</body>
</html>`
  },
  {
    name: '00_dfd_level1.png',
    title: 'DFD Level 1 - Detailed Functional Decomposition',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #ffffff; text-align: center; }
  .proc-box { border: 2px solid #0f2b48; border-radius: 6px; padding: 10px 14px; background: #eff6ff; font-size: 12px; font-weight: bold; color: #0f2b48; width: 280px; text-align: left; margin: 8px auto; }
  .p-num { background: #0f2b48; color: #fff; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-right: 6px; }
  .store-box { border-top: 2px solid #0f2b48; border-bottom: 2px solid #0f2b48; padding: 6px 12px; background: #f8fafc; font-family: monospace; font-size: 11px; font-weight: bold; color: #1e3a8a; width: 240px; margin: 6px auto; }
  .container { max-width: 750px; margin: 0 auto; padding: 15px; border: 1px solid #cbd5e1; border-radius: 8px; }
  .arrow { font-size: 14px; color: #2563eb; margin: 3px 0; }
  .grid { display: flex; justify-content: space-around; gap: 15px; }
</style>
</head>
<body>
  <div class="container">
    <div style="font-size: 15px; font-weight: bold; color: #0f2b48; margin-bottom: 12px; text-transform: uppercase;">
      Data Flow Diagram (DFD Level 1) – Detailed Functional Decomposition
    </div>

    <div class="grid">
      <div>
        <div class="proc-box">
          <span class="p-num">1.0</span> Identity & Access Management
          <div style="font-size: 10px; font-weight: normal; color: #475569; margin-top: 3px;">Register, Login, Password Hashing, JWT Issuance</div>
        </div>
        <div class="arrow">▼</div>
        <div class="store-box">D1: Users Collection</div>

        <div class="arrow">▼</div>
        <div class="proc-box">
          <span class="p-num">2.0</span> Service Directory & Catalog
          <div style="font-size: 10px; font-weight: normal; color: #475569; margin-top: 3px;">Dynamic Service Browsing & Field Schema Lookup</div>
        </div>
        <div class="arrow">▼</div>
        <div class="store-box">D2: Departments & Services</div>
      </div>

      <div>
        <div class="proc-box">
          <span class="p-num">3.0</span> Application Gateway Dispatch
          <div style="font-size: 10px; font-weight: normal; color: #475569; margin-top: 3px;">Form Ingestion, Doc Upload & Interop Routing</div>
        </div>
        <div class="arrow">▼</div>
        <div class="store-box">D3: Applications Collection</div>

        <div class="arrow">▼</div>
        <div class="proc-box">
          <span class="p-num">4.0</span> Scrutiny & Telemetry Ledger
          <div style="font-size: 10px; font-weight: normal; color: #475569; margin-top: 3px;">Officer Review, Status Timeline & API Telemetry</div>
        </div>
        <div class="arrow">▼</div>
        <div class="store-box">D4: ApiLogs & Notifications</div>
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    name: '00_er_diagram.png',
    title: 'Database Entity-Relationship (ER) Diagram',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #ffffff; text-align: center; }
  .entity { border: 2px solid #0f2b48; border-radius: 6px; overflow: hidden; width: 210px; font-size: 11px; text-align: left; background: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
  .entity-header { background: #0f2b48; color: #ffffff; font-weight: bold; padding: 6px 10px; font-size: 11px; text-transform: uppercase; }
  .entity-body { padding: 8px 10px; font-family: monospace; font-size: 10px; line-height: 1.5; color: #334155; }
  .pk { color: #dc2626; font-weight: bold; }
  .fk { color: #2563eb; font-weight: bold; }
  .container { max-width: 760px; margin: 0 auto; padding: 15px; border: 1px solid #cbd5e1; border-radius: 8px; }
  .row { display: flex; justify-content: space-around; margin: 10px 0; }
</style>
</head>
<body>
  <div class="container">
    <div style="font-size: 15px; font-weight: bold; color: #0f2b48; margin-bottom: 15px; text-transform: uppercase;">
      Database Entity-Relationship (ER) Model (MongoDB Schemas)
    </div>

    <div class="row">
      <div class="entity">
        <div class="entity-header">USER</div>
        <div class="entity-body">
          <span class="pk">PK</span> _id<br>
          • name<br>
          • email (unique)<br>
          • passwordHash<br>
          • role (citizen|officer|admin)<br>
          <span class="fk">FK</span> department (ref)
        </div>
      </div>

      <div class="entity">
        <div class="entity-header">DEPARTMENT</div>
        <div class="entity-body">
          <span class="pk">PK</span> _id<br>
          • name<br>
          • code (unique: REV, TRP)<br>
          • description<br>
          • contactEmail<br>
          • isOperational
        </div>
      </div>

      <div class="entity">
        <div class="entity-header">SERVICE</div>
        <div class="entity-body">
          <span class="pk">PK</span> _id<br>
          <span class="fk">FK</span> department (ref)<br>
          • name<br>
          • description<br>
          • requiredDocuments[]<br>
          • dynamicFields[]
        </div>
      </div>
    </div>

    <div class="row">
      <div class="entity">
        <div class="entity-header">APPLICATION</div>
        <div class="entity-body">
          <span class="pk">PK</span> _id<br>
          • applicationId (MC-2026-X)<br>
          <span class="fk">FK</span> citizen (User ref)<br>
          <span class="fk">FK</span> service (Service ref)<br>
          <span class="fk">FK</span> department (Dept ref)<br>
          • status, formData, timeline[]
        </div>
      </div>

      <div class="entity">
        <div class="entity-header">APILOG (TELEMETRY)</div>
        <div class="entity-body">
          <span class="pk">PK</span> _id<br>
          • timestamp<br>
          • source, destination<br>
          • endpoint, method<br>
          • statusCode, responseTimeMs<br>
          • payloadSummary
        </div>
      </div>

      <div class="entity">
        <div class="entity-header">NOTIFICATION</div>
        <div class="entity-body">
          <span class="pk">PK</span> _id<br>
          <span class="fk">FK</span> recipient (User ref)<br>
          • title, message<br>
          • type (info|success|warning)<br>
          • read (boolean)<br>
          • relatedApplicationId
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
  },
  {
    name: '00_gateway_sequence.png',
    title: 'Gateway Interoperability Sequence Flow',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #ffffff; text-align: center; }
  .step-box { border: 1.5pt solid #cbd5e1; border-radius: 6px; padding: 8px 14px; background: #f8fafc; font-size: 11px; text-align: left; margin: 5px 0; display: flex; align-items: center; justify-content: space-between; }
  .num { font-weight: bold; color: #fff; background: #1e3a8a; border-radius: 50%; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; margin-right: 10px; }
  .step-text { font-size: 11px; color: #1e293b; font-weight: 600; flex: 1; }
  .comp-tag { font-family: monospace; font-size: 9.5px; background: #e2e8f0; padding: 2px 6px; border-radius: 3px; color: #475569; }
  .container { max-width: 720px; margin: 0 auto; padding: 15px; border: 1px solid #cbd5e1; border-radius: 8px; }
</style>
</head>
<body>
  <div class="container">
    <div style="font-size: 15px; font-weight: bold; color: #0f2b48; margin-bottom: 12px; text-transform: uppercase;">
      Eight-Step Gateway Interoperability Execution Sequence
    </div>

    <div class="step-box">
      <div style="display: flex; align-items: center;">
        <span class="num">1</span>
        <span class="step-text">Citizen submits multi-step application form payload with JWT bearer token</span>
      </div>
      <span class="comp-tag">React SPA → Express</span>
    </div>

    <div class="step-box">
      <div style="display: flex; align-items: center;">
        <span class="num">2</span>
        <span class="step-text">Gateway middleware validates JWT signature, token expiration, and 'citizen' RBAC permission</span>
      </div>
      <span class="comp-tag">Auth Middleware</span>
    </div>

    <div class="step-box">
      <div style="display: flex; align-items: center;">
        <span class="num">3</span>
        <span class="step-text">Payload schema validation verifies mandatory demographic data and dynamic service fields</span>
      </div>
      <span class="comp-tag">Validation Layer</span>
    </div>

    <div class="step-box">
      <div style="display: flex; align-items: center;">
        <span class="num">4</span>
        <span class="step-text">Departmental dispatch routes to simulated service API & generates interop reference (e.g. TRP-2026-68192)</span>
      </div>
      <span class="comp-tag">Interop Service Layer</span>
    </div>

    <div class="step-box">
      <div style="display: flex; align-items: center;">
        <span class="num">5</span>
        <span class="step-text">MongoDB persistence stores application document, uploads, and initial chronological timeline</span>
      </div>
      <span class="comp-tag">MongoDB Applications</span>
    </div>

    <div class="step-box">
      <div style="display: flex; align-items: center;">
        <span class="num">6</span>
        <span class="step-text">Immutable API telemetry log captures method, endpoint, status code, latency (ms), and timestamp</span>
      </div>
      <span class="comp-tag">MongoDB ApiLogs</span>
    </div>

    <div class="step-box">
      <div style="display: flex; align-items: center;">
        <span class="num">7</span>
        <span class="step-text">In-app notification generated and routed to the applicant's notification stream</span>
      </div>
      <span class="comp-tag">MongoDB Notifications</span>
    </div>

    <div class="step-box">
      <div style="display: flex; align-items: center;">
        <span class="num">8</span>
        <span class="step-text">Standardized JSON HTTP 201 response dispatched with unique Application ID (MC-2026-XXXXXX)</span>
      </div>
      <span class="comp-tag">Express → Citizen UI</span>
    </div>
  </div>
</body>
</html>`
  }
];

async function run() {
  console.log('🚀 Launching Chrome to render academic diagrams (Architecture, DFD 0, DFD 1, ER, Sequence)...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1200,800'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 750, deviceScaleFactor: 2 });

  for (const diag of diagrams) {
    console.log('📸 Rendering diagram: ' + diag.title);
    await page.setContent(diag.html, { waitUntil: 'domcontentloaded' });
    await sleep(400);
    const outputPath = path.join(DIAGRAMS_DIR, diag.name);
    await page.screenshot({ path: outputPath });
    console.log('✔ Saved: ' + outputPath);
  }

  await browser.close();
  console.log('🎉 All 5 academic diagrams generated successfully!');
}

run().catch(err => {
  console.error('Error generating diagrams:', err);
  process.exit(1);
});
