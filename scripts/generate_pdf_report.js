import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots');
const OUTPUT_PDF_PRIMARY = path.join(__dirname, '../MahaConnect_Capstone_Report_Pawan_Mishra_Samarth_Nivadunge_Sem5.pdf');
const OUTPUT_PDF_ORIGINAL = path.join(__dirname, '../MahaConnect_FSDM_Project_Report_Pawan_Mishra.pdf');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getBase64Image(filename) {
  const filePath = path.join(SCREENSHOTS_DIR, filename);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return `data:image/png;base64,${data.toString('base64')}`;
  }
  return '';
}

function buildReportHtml() {
  const images = {
    img01: getBase64Image('01_landing_page.png'),
    img02: getBase64Image('02_login_page.png'),
    img03: getBase64Image('03_citizen_dashboard.png'),
    img04: getBase64Image('04_government_services.png'),
    img05: getBase64Image('05_application_form.png'),
    img06: getBase64Image('06_form_validation_error.png'),
    img07: getBase64Image('07_document_upload_review.png'),
    img08: getBase64Image('08_successful_application_submission.png'),
    img09: getBase64Image('09_application_tracking_timeline.png'),
    img10: getBase64Image('10_officer_dashboard.png'),
    img11: getBase64Image('11_officer_application_review.png'),
    img12: getBase64Image('12_updated_application_status.png'),
    img13: getBase64Image('13_admin_dashboard.png'),
    img14: getBase64Image('14_department_management.png'),
    img15: getBase64Image('15_service_management.png'),
    img16: getBase64Image('16_api_interoperability_logs.png'),
    img17: getBase64Image('17_postman_get_request.png'),
    img18: getBase64Image('18_postman_post_request.png'),
    img19: getBase64Image('19_postman_put_patch_request.png'),
    img20: getBase64Image('20_postman_delete_request.png'),
    img21: getBase64Image('21_mongodb_records.png'),
    img22: getBase64Image('22_final_working_application.png'),
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MahaConnect - Capstone Project Report</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #111827;
      background: #ffffff;
    }
    .page-break {
      page-break-before: always;
    }
    h1, h2, h3, h4 {
      font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif;
      color: #0f2b48;
      font-weight: bold;
    }
    h1 {
      font-size: 18pt;
      margin-bottom: 12pt;
      text-transform: uppercase;
      border-bottom: 2pt solid #0f2b48;
      padding-bottom: 4pt;
    }
    h2 {
      font-size: 13.5pt;
      margin-top: 14pt;
      margin-bottom: 8pt;
      color: #1e3a8a;
      border-bottom: 1pt solid #cbd5e1;
      padding-bottom: 2pt;
    }
    h3 {
      font-size: 11.5pt;
      margin-top: 10pt;
      margin-bottom: 4pt;
      color: #1e293b;
    }
    p {
      margin-bottom: 8pt;
      text-align: justify;
      text-justify: inter-word;
    }
    ul, ol {
      margin-left: 20pt;
      margin-bottom: 8pt;
    }
    li {
      margin-bottom: 3pt;
      text-align: justify;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10pt 0;
      font-size: 9.5pt;
    }
    th, td {
      border: 1pt solid #cbd5e1;
      padding: 6pt 8pt;
      text-align: left;
    }
    th {
      background-color: #f1f5f9;
      color: #0f2b48;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background-color: #f8fafc;
    }
    .figure-box {
      margin: 14pt 0;
      text-align: center;
      page-break-inside: avoid;
    }
    .figure-img {
      max-width: 95%;
      height: auto;
      border: 1pt solid #94a3b8;
      border-radius: 4pt;
      box-shadow: 0 2pt 4pt rgba(0,0,0,0.1);
    }
    .figure-caption {
      font-family: 'Arial', sans-serif;
      font-size: 9pt;
      font-weight: bold;
      color: #334155;
      margin-top: 5pt;
    }
    .figure-desc {
      font-size: 8.5pt;
      color: #475569;
      margin-top: 2pt;
      font-style: italic;
      text-align: center;
      padding: 0 15pt;
    }
    .code-block {
      background: #0f172a;
      color: #f8fafc;
      font-family: 'Courier New', Courier, monospace;
      font-size: 8.5pt;
      padding: 8pt 12pt;
      border-radius: 4pt;
      margin: 8pt 0;
      overflow-x: auto;
      white-space: pre-wrap;
      line-height: 1.4;
    }
    .cover-page {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      padding: 24pt 15pt 18pt 15pt;
      border: 3pt double #0f2b48;
    }
    .cover-title {
      font-size: 22pt;
      font-weight: 900;
      color: #0f2b48;
      letter-spacing: 0.5pt;
      margin-top: 14pt;
      line-height: 1.3;
    }
    .cover-subtitle {
      font-size: 13pt;
      font-weight: 600;
      color: #2563eb;
      margin-top: 8pt;
    }
    .certificate-box {
      border: 2pt solid #0f2b48;
      padding: 24pt;
      margin-top: 10pt;
    }
  </style>
</head>
<body>

  <!-- ==================== COVER PAGE ==================== -->
  <div class="cover-page">
    <div>
      <h2 style="font-size: 13pt; color: #475569; border: none; text-transform: uppercase;">A CAPSTONE PROJECT REPORT ON</h2>
      <div class="cover-title">MAHACONNECT: GOVERNMENT PLATFORM INTEROPERABILITY SYSTEM</div>
      <div class="cover-subtitle">A Unified Multi-Departmental e-Governance Integration Architecture</div>
      <p style="margin-top: 16pt; font-size: 11pt; color: #475569; font-style: italic;">
        Submitted in partial fulfillment of the requirements for the award of the Degree of
      </p>
      <h3 style="font-size: 14pt; color: #0f2b48; margin-top: 6pt;">BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY (BSc IT)</h3>
      <p style="font-size: 10.5pt; color: #64748b; font-weight: bold; margin-top: 2pt;">
        (Full Stack Development & Management – FSDM)
      </p>
    </div>

    <div style="margin: 20pt 0;">
      <div style="font-size: 12pt; font-weight: bold; color: #1e3a8a;">SUBMITTED BY:</div>
      <div style="margin-top: 10pt;">
        <div style="font-size: 16pt; font-weight: 900; color: #0f2b48;">PAWAN MISHRA</div>
        <div style="font-size: 11pt; color: #334155; font-family: monospace; font-weight: bold;">Roll No: 202402104</div>
      </div>
      <div style="margin-top: 8pt;">
        <div style="font-size: 16pt; font-weight: 900; color: #0f2b48;">SAMARTH NIVADUNGE</div>
        <div style="font-size: 11pt; color: #334155; font-family: monospace; font-weight: bold;">Roll No: 202402111</div>
      </div>
      <div style="font-size: 12pt; color: #1e3a8a; font-weight: bold; margin-top: 10pt;">
        Class: TY BSc IT • Semester V
      </div>
    </div>

    <div>
      <div style="font-size: 12pt; font-weight: bold; color: #0f2b48;">DEPARTMENT OF INFORMATION TECHNOLOGY</div>
      <div style="font-size: 11pt; color: #475569; margin-top: 2pt;">Academic Year: 2026 – 2027</div>
      <div style="margin-top: 12pt; font-size: 9.5pt; line-height: 1.6;">
        <div>Production Deployment URL: <a href="https://mahaconnect-rose.vercel.app" style="color: #059669; font-weight: bold;">https://mahaconnect-rose.vercel.app</a></div>
        <div>GitHub Repository: <a href="https://github.com/pawan120307/MahaConnect" style="color: #2563eb; font-weight: bold;">https://github.com/pawan120307/MahaConnect</a></div>
      </div>
    </div>
  </div>

  <!-- ==================== CERTIFICATE ==================== -->
  <div class="page-break"></div>
  <div class="certificate-box">
    <div style="text-align: center; margin-bottom: 22pt;">
      <h1 style="border: none; margin-bottom: 0; font-size: 20pt;">CERTIFICATE</h1>
      <p style="font-size: 11pt; color: #64748b; text-align: center; font-weight: bold;">DEPARTMENT OF INFORMATION TECHNOLOGY</p>
    </div>

    <p style="line-height: 1.9;">
      This is to certify that the project entitled <strong>"MahaConnect: Government Platform Interoperability System"</strong> is a bonafide work carried out by <strong>PAWAN MISHRA</strong> (Roll No: <strong>202402104</strong>) and <strong>SAMARTH NIVADUNGE</strong> (Roll No: <strong>202402111</strong>) in partial fulfillment of the requirements for the degree of <strong>Bachelor of Science in Information Technology (TY BSc IT), Semester V</strong> during the academic year <strong>2026–2027</strong>.
    </p>

    <p style="line-height: 1.9; margin-top: 14pt;">
      The candidates have demonstrated proficiency in full-stack architecture, MERN technology integration, RESTful API gateway orchestration, microservice interoperability modeling, and automated testing. The system has been fully implemented, validated, and successfully deployed to live cloud infrastructure.
    </p>

    <div style="margin-top: 75pt; display: flex; justify-content: space-between; text-align: center;">
      <div style="width: 30%;">
        <div style="border-top: 1pt solid #000; padding-top: 5pt; font-weight: bold;">Project Guide</div>
        <div style="font-size: 9pt; color: #64748b;">Dept. of Information Technology</div>
      </div>
      <div style="width: 30%;">
        <div style="border-top: 1pt solid #000; padding-top: 5pt; font-weight: bold;">Head of Department</div>
        <div style="font-size: 9pt; color: #64748b;">Dept. of Information Technology</div>
      </div>
      <div style="width: 30%;">
        <div style="border-top: 1pt solid #000; padding-top: 5pt; font-weight: bold;">External Examiner</div>
        <div style="font-size: 9pt; color: #64748b;">University Board of Examiners</div>
      </div>
    </div>
  </div>

  <!-- ==================== DECLARATION & ACKNOWLEDGEMENT ==================== -->
  <div class="page-break"></div>
  <h1>DECLARATION</h1>
  <p>
    We, <strong>Pawan Mishra</strong> and <strong>Samarth Nivadunge</strong>, hereby declare that the capstone project report entitled <strong>‘MahaConnect – Government Platform Interoperability System’</strong>, submitted to the Department of Information Technology in partial fulfillment of the requirements for the award of the Degree of <strong>Bachelor of Science in Information Technology (TY BSc IT)</strong>, is an authentic record of original work carried out by us under institutional academic guidance.
  </p>
  <p>
    We further declare that this report has not been submitted either concurrently or previously to any other university, college, or examination board for the award of any degree or diploma. All external libraries, architectural design patterns, research papers, and technical standards cited throughout this document have been duly acknowledged in the references section.
  </p>

  <div style="margin-top: 35pt; text-align: right; line-height: 1.7;">
    <div style="font-weight: bold; font-size: 11pt;">PAWAN MISHRA</div>
    <div style="font-family: monospace;">Roll No: 202402104</div>
    <div style="font-weight: bold; font-size: 11pt; margin-top: 8pt;">SAMARTH NIVADUNGE</div>
    <div style="font-family: monospace;">Roll No: 202402111</div>
    <div style="margin-top: 8pt; color: #1e3a8a; font-weight: bold;">TY BSc IT • Semester V</div>
    <div style="margin-top: 4pt; color: #64748b;">Date: 29 september 2026</div>
  </div>

  <h1 style="margin-top: 25pt;">ACKNOWLEDGEMENT</h1>
  <p>
    The successful design, engineering, and implementation of <strong>MahaConnect</strong> has been a profoundly enriching milestone in our academic journey. We express our deepest sense of gratitude to our respected Principal, Head of the Information Technology Department, and Faculty Members whose continuous encouragement, intellectual guidance, and constructive critiques fostered the realization of this capstone project.
  </p>
  <p>
    We would like to extend our heartfelt appreciation to our project guide for providing invaluable technical mentorship, reviewing architectural schemata, and offering rigorous recommendations on distributed systems interoperability and web application security standards.
  </p>
  <p>
    Finally, we owe our sincere thanks to our families, peers, and fellow developers whose moral support and constructive feedback contributed immensely to the refinement and success of this project.
  </p>

  <!-- ==================== ABSTRACT ==================== -->
  <div class="page-break"></div>
  <h1>ABSTRACT</h1>
  <p>
    In contemporary public administration, citizens frequently encounter friction when navigating public services due to architectural silos across government departments. Traditional e-Governance infrastructures often operate as isolated islands where citizens are subjected to redundant demographic data submissions, disparate credentials, uncoordinated document verifications, and fragmented tracking mechanisms.
  </p>
  <p>
    To address these challenges, this capstone project designs and implements <strong>MahaConnect</strong>—a full-stack Government Platform Interoperability System built on the modern <strong>MERN stack</strong> (MongoDB, Express.js, React, Node.js) paired with Vite, Tailwind CSS, JSON Web Token (JWT) role-based authorization, and a simulated Government Interoperability Service Layer.
  </p>
  <p>
    <strong>MahaConnect</strong> demonstrates how an asynchronous, single-window citizen portal can connect seven administrative departments: Revenue, Transport, Education, Municipal Corporation, Employment, Social Welfare, and Urban Development. The platform introduces:
  </p>
  <ul>
    <li><strong>Single-Window Citizen Portal:</strong> Eliminates duplicate entry through unified profile management and dynamic multi-step form wizards.</li>
    <li><strong>Department Interoperability Service Layer:</strong> Dispatches citizen filings to simulated departmental REST APIs while recording granular audit trails (HTTP methods, response latencies, source-destination routing, and payload status).</li>
    <li><strong>Department Officer Dashboard:</strong> Provides department-scoped review workflows, document verification dossiers, and status transitions.</li>
    <li><strong>State Administrator Dashboard:</strong> Offers centralized system oversight, service schema management, and real-time API telemetry analytics.</li>
    <li><strong>RESTful API Communication:</strong> Standardized JSON request and response pipeline enforcing authentication, validation, and error-handling across all departmental interactions.</li>
  </ul>
  <p>
    The system is deployed on cloud infrastructure (Vercel) backed by MongoDB, with all REST API contracts validated through automated Postman test suites and browser journey testing.
  </p>

  <!-- ==================== TABLE OF CONTENTS ==================== -->
  <div class="page-break"></div>
  <h1>TABLE OF CONTENTS</h1>
  <table style="width: 100%; border: none;">
    <tr style="border-bottom: 1pt solid #0f2b48;"><th style="border: none;">Section</th><th style="border: none;">Title</th><th style="border: none; text-align: right;">Page No.</th></tr>
    <tr><td style="border: none;">1.0</td><td style="border: none;">Introduction & Problem Definition</td><td style="border: none; text-align: right;">1</td></tr>
    <tr><td style="border: none;">2.0</td><td style="border: none;">Literature Review & Existing Systems Analysis</td><td style="border: none; text-align: right;">3</td></tr>
    <tr><td style="border: none;">3.0</td><td style="border: none;">System Architecture & Interoperability Model</td><td style="border: none; text-align: right;">5</td></tr>
    <tr><td style="border: none;">4.0</td><td style="border: none;">Hardware & Software Requirements</td><td style="border: none; text-align: right;">8</td></tr>
    <tr><td style="border: none;">5.0</td><td style="border: none;">System Analysis & Feasibility Study</td><td style="border: none; text-align: right;">10</td></tr>
    <tr><td style="border: none;">6.0</td><td style="border: none;">System Design, DFD & Database Modeling</td><td style="border: none; text-align: right;">12</td></tr>
    <tr><td style="border: none;">7.0</td><td style="border: none;">Full-Stack Implementation Details</td><td style="border: none; text-align: right;">16</td></tr>
    <tr><td style="border: none;">8.0</td><td style="border: none;">Security, Cryptography & Role-Based Access Control</td><td style="border: none; text-align: right;">19</td></tr>
    <tr><td style="border: none;">9.0</td><td style="border: none;">Interoperability Gateway & API Routing Engine</td><td style="border: none; text-align: right;">22</td></tr>
    <tr><td style="border: none;">10.0</td><td style="border: none;">Testing, Verification & Postman Suite Execution</td><td style="border: none; text-align: right;">25</td></tr>
    <tr><td style="border: none;">11.0</td><td style="border: none;">Results, Screenshots & System Walkthrough (Figures 1–22)</td><td style="border: none; text-align: right;">28</td></tr>
    <tr><td style="border: none;">12.0</td><td style="border: none;">Conclusion & Future Enhancements</td><td style="border: none; text-align: right;">42</td></tr>
    <tr><td style="border: none;">13.0</td><td style="border: none;">References & Academic Bibliography</td><td style="border: none; text-align: right;">44</td></tr>
    <tr><td style="border: none;">14.0</td><td style="border: none;">Appendix: Source Code Highlights & API Schema</td><td style="border: none; text-align: right;">46</td></tr>
  </table>

  <!-- ==================== LIST OF FIGURES ==================== -->
  <div class="page-break"></div>
  <h1>LIST OF FIGURES</h1>
  <table style="width: 100%; border: none;">
    <tr style="border-bottom: 1pt solid #0f2b48;"><th style="border: none;">Figure No.</th><th style="border: none;">Description / Title</th></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 1</td><td style="border: none;">MahaConnect Public Landing Page & Citizen Gateway</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 2</td><td style="border: none;">Unified Authentication Portal with Seeded Demo Credentials</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 3</td><td style="border: none;">Citizen Self-Service Dashboard with Metric Cards & Quick Navigation</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 4</td><td style="border: none;">Cross-Departmental Government Services Directory with Filtering</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 5</td><td style="border: none;">Dynamic Application Form Wizard: Step 1 (Personal Demographics)</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 6</td><td style="border: none;">Client-Side Form Validation Alert & Error Prevention</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 7</td><td style="border: none;">Document Upload & Multi-Format Verification</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 8</td><td style="border: none;">Application Submission Confirmation & Unique Reference Generation</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 9</td><td style="border: none;">Live Citizen Tracking Timeline with Multi-Stage Progression</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 10</td><td style="border: none;">Department Officer Scrutiny Console & Pending Application Queue</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 11</td><td style="border: none;">Officer Application Scrutiny Dossier with Inline Document Viewer</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 12</td><td style="border: none;">Officer Status Transition Pipeline & Remarks Endorsement</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 13</td><td style="border: none;">State Administrator Governance Dashboard & Interoperability KPIs</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 14</td><td style="border: none;">State Department Management Console & Endpoint Configuration</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 15</td><td style="border: none;">Service Schema Configuration & Dynamic Field Definition</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 16</td><td style="border: none;">REST API Interoperability Gateway Logs & Modal Payload Inspector</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 17</td><td style="border: none;">Postman Test Suite: GET /api/departments (Status 200 OK)</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 18</td><td style="border: none;">Postman Test Suite: POST /api/auth/login (JWT Token Generation)</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 19</td><td style="border: none;">Postman Test Suite: PATCH /api/applications/:id/status</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 20</td><td style="border: none;">Postman Test Suite: DELETE /api/departments/:id (Integrity Check)</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 21</td><td style="border: none;">MongoDB Shell (mongosh) Collection & Query Ledger Inspection</td></tr>
    <tr><td style="border: none; font-weight: bold;">Figure 22</td><td style="border: none;">MahaConnect Multi-Portal System Overview (Pawan Mishra & Samarth Nivadunge, Sem V)</td></tr>
  </table>

  <!-- ==================== SECTION 1: INTRODUCTION ==================== -->
  <div class="page-break"></div>
  <h1>1.0 INTRODUCTION</h1>
  <h2>1.1 Project Overview</h2>
  <p>
    In modern state administration, electronic governance (e-Governance) represents the primary conduit through which government entities interact with the public. However, state departments historically developed their digital applications independently. As a result, the Transport Department, the Revenue Department, the Department of School and Higher Education, Municipal Corporations, and the Department of Social Welfare operate disjointed technical stacks, disparate databases, and non-communicating interfaces.
  </p>
  <p>
    <strong>MahaConnect</strong> is conceptualized and engineered to address this fragmentation. Built as a full-stack web application adhering to modern <strong>MERN</strong> (MongoDB, Express.js, React, Node.js) design patterns, MahaConnect serves as a unified digital bridge connecting citizens and government departments. The platform facilitates single-sign-on (SSO) authenticated access, cross-departmental service browsing, dynamic multi-step application filing, document archiving, transparent real-time tracking, and automated inter-departmental API routing.
  </p>

  <h2>1.2 Problem Statement</h2>
  <p>
    The primary challenge addressed by MahaConnect is the presence of functional information silos in public administration. When a citizen requires a set of related government services (for example, applying for a college scholarship which requires an Income Certificate from Revenue, a Caste Certificate from Social Welfare, and an Enrollment Verification from Higher Education), the citizen is compelled to:
  </p>
  <ul>
    <li>Create and maintain separate login credentials across multiple departmental websites.</li>
    <li>Repeatedly fill in identical demographic data (Full Name, Date of Birth, Aadhaar number, Residential Address, Mobile Number).</li>
    <li>Physically upload identical identity documents to separate departmental servers, multiplying storage overhead and bandwidth consumption.</li>
    <li>Manually visit disjointed tracking portals with separate application numbers, leaving citizens without unified visibility over pending state matters.</li>
  </ul>

  <h2>1.3 Project Objectives</h2>
  <p>The primary engineering and operational objectives of MahaConnect include:</p>
  <ol>
    <li><strong>Single-Window Citizen Portal:</strong> Develop a unified, responsive React-based interface allowing citizens to access state services through a single authenticated session.</li>
    <li><strong>Microservices & Gateway Interoperability:</strong> Implement an API Gateway architecture using Node.js and Express.js middleware that acts as an intelligent intermediary, translating unified citizen requests into department-specific schemas.</li>
    <li><strong>Cross-Departmental Document Abstraction:</strong> Provide a standardized document upload and verification pipeline supporting multi-format attachments with validation.</li>
    <li><strong>Transparent Real-Time Status Tracking:</strong> Render interactive visual milestone timelines depicting every lifecycle state from initial submission to final officer disposition.</li>
    <li><strong>Role-Based Access Control (RBAC):</strong> Enforce cryptographically secured authorization separating Citizens, Department Officers, and State Administrators.</li>
    <li><strong>Audit Telemetry & Gateway Ledger:</strong> Maintain a MongoDB audit log recording every API transaction, source-destination routing path, HTTP status code, and latency metrics.</li>
  </ol>

  <h2>1.4 Scope and Applicability</h2>
  <p>
    The scope of this project encompasses the lifecycle of simulated government service delivery within a state ecosystem. It models seven core government departments: Revenue, Transport, Education, Municipal Corporation, Employment, Social Welfare, and Urban Development. As an academic capstone implementation for TY BSc IT Semester V, downstream departmental APIs are simulated through a dedicated service layer, while the RESTful contracts, payload schemas, security tokens, and routing controllers are designed to reflect real-world architectural principles.
  </p>

  <!-- ==================== SECTION 2: LITERATURE REVIEW ==================== -->
  <div class="page-break"></div>
  <h1>2.0 LITERATURE REVIEW & EXISTING SYSTEMS</h1>
  <h2>2.1 Traditional Siloed Governance Models</h2>
  <p>
    Early e-Governance initiatives focused on digitizing individual departmental workflows in isolation. While this computerization replaced paper registers, it created digital silos. Research into public sector software architectures indicates that siloed systems suffer from data redundancy, inconsistent state records, repetitive administrative workloads, and difficulty in cross-verifying applicant eligibility.
  </p>

  <h2>2.2 Comparative Analysis of Existing Platforms</h2>
  <table>
    <tr>
      <th>Feature / Dimension</th>
      <th>Legacy State Portals</th>
      <th>Centralized Monoliths</th>
      <th>MahaConnect System</th>
    </tr>
    <tr>
      <td><strong>Architecture</strong></td>
      <td>Departmental Silos</td>
      <td>Monolithic Relational DB</td>
      <td>Modern MERN Gateway Model</td>
    </tr>
    <tr>
      <td><strong>User Experience</strong></td>
      <td>Multiple Portals & Logins</td>
      <td>Rigid Single Interface</td>
      <td>Responsive React SPA + Tailwind CSS</td>
    </tr>
    <tr>
      <td><strong>Interoperability</strong></td>
      <td>None (Manual Paper Bridge)</td>
      <td>Internal DB Procedures</td>
      <td>RESTful Interoperability Gateway</td>
    </tr>
    <tr>
      <td><strong>Schema Adaptability</strong></td>
      <td>Static Hardcoded Tables</td>
      <td>Strict Database Schema</td>
      <td>Dynamic JSON-Schema Service Builder</td>
    </tr>
    <tr>
      <td><strong>Audit & Telemetry</strong></td>
      <td>Fragmented Text Logs</td>
      <td>Standard Database Triggers</td>
      <td>Real-Time ApiLog Audit Ledger</td>
    </tr>
    <tr>
      <td><strong>Deployment Model</strong></td>
      <td>On-Premises Dedicated Servers</td>
      <td>Central Government Data Center</td>
      <td>Cloud Serverless (Vercel) + MongoDB</td>
    </tr>
  </table>

  <!-- ==================== SECTION 3: SYSTEM ARCHITECTURE ==================== -->
  <div class="page-break"></div>
  <h1>3.0 SYSTEM ARCHITECTURE & INTEROPERABILITY MODEL</h1>
  <h2>3.1 High-Level Architectural Paradigm</h2>
  <p>
    MahaConnect utilizes a multi-tiered, decoupled client-server architecture designed around microservices and API Gateway integration principles. The architectural flow is:
  </p>
  <div class="code-block" style="text-align: center; font-weight: bold;">
React Frontend (Vite + Tailwind CSS)
            ↓
Node.js + Express API Gateway (Port 5001)
            ↓
Departmental Interoperability Service Layer (Simulated Services)
            ↓
MongoDB Document Store (Mongoose Models)
  </div>
  <p>
    The architectural stack consists of four primary tiers:
  </p>
  <ol>
    <li><strong>Presentation Tier (Client):</strong> Built using React 18, Vite 6, and Tailwind CSS. Employs a Single Page Application (SPA) structure managed via React Router v6, Axios interceptors, Lucide React iconography, and context-driven state management.</li>
    <li><strong>API Gateway & Routing Tier:</strong> Node.js and Express.js runtime acting as a central dispatcher. Enforces CORS policy, Helmet security headers, rate limiting, JWT token verification, and payload validation before routing.</li>
    <li><strong>Departmental Interoperability Service Layer:</strong> A simulated integration bridge that abstracts downstream departmental micro-APIs (Revenue, Transport, Education, etc.). Translates incoming universal citizen applications into department-specific schema records and returns standardized tracking identifiers.</li>
    <li><strong>Persistence Tier (Database):</strong> MongoDB document database operating with Mongoose ODM schemas, ensuring flexible nested schemas for service-specific fields and data consistency.</li>
  </ol>

  <h2>3.2 Gateway Interoperability Sequence Flow</h2>
  <p>
    When a citizen submits an application, the request transitions through a standardized eight-step gateway sequence:
  </p>
  <ol>
    <li><strong>POST request with JWT:</strong> Citizen submits application data along with their bearer token to <code>/api/applications</code>.</li>
    <li><strong>Authentication and RBAC verification:</strong> Gateway middleware validates the JWT signature and verifies that the user holds the required 'citizen' role.</li>
    <li><strong>Payload schema validation:</strong> Validates presence of mandatory demographic fields and dynamic service-specific requirements.</li>
    <li><strong>Departmental dispatch & interoperability reference allocation:</strong> The gateway routes the payload to the simulated departmental service layer and generates a unique department routing reference (e.g. <code>TRP-2026-XXXXX</code>).</li>
    <li><strong>MongoDB persistence:</strong> The complete application record, nested documents, and initial timeline entries are stored in the <code>applications</code> collection.</li>
    <li><strong>API telemetry & audit logging:</strong> An immutable record capturing endpoint, HTTP method, status code, latency (ms), and timestamp is written to the <code>apilogs</code> collection.</li>
    <li><strong>In-app notification:</strong> A notification record is inserted into the <code>notifications</code> collection for the applicant.</li>
    <li><strong>Standardized JSON confirmation:</strong> Returns an HTTP 201 response with the assigned Unified Application ID (e.g. <code>MC-2026-XXXXXX</code>).</li>
  </ol>

  <!-- ==================== SECTION 4: HARDWARE & SOFTWARE REQUIREMENTS ==================== -->
  <div class="page-break"></div>
  <h1>4.0 HARDWARE & SOFTWARE REQUIREMENTS</h1>
  <h2>4.1 Hardware Requirements</h2>
  <table>
    <tr><th>Component</th><th>Development Specification</th><th>Production Cloud Specification</th></tr>
    <tr><td>Processor</td><td>Multi-Core CPU @ 2.0GHz+</td><td>Serverless Container vCPU</td></tr>
    <tr><td>System Memory (RAM)</td><td>8 GB Minimum</td><td>2 GB per Container Instance</td></tr>
    <tr><td>Storage Capacity</td><td>256 GB SSD</td><td>Elastic Cloud Storage</td></tr>
    <tr><td>Network Interface</td><td>Broadband Connection (10 Mbps+)</td><td>High-Speed Cloud CDN Backhaul</td></tr>
  </table>

  <h2>4.2 Software Requirements</h2>
  <table>
    <tr><th>Software Component</th><th>Specification / Version</th><th>Functional Role</th></tr>
    <tr><td>Operating System</td><td>macOS / Linux / Windows 11</td><td>Host Development & Build Platform</td></tr>
    <tr><td>Frontend Framework</td><td>React.js (v18.3)</td><td>Component-Driven User Interface Library</td></tr>
    <tr><td>Build Tooling</td><td>Vite (v6.0)</td><td>Rapid Hot-Module Replacement (HMR) Bundler</td></tr>
    <tr><td>Styling Engine</td><td>Tailwind CSS (v3.4)</td><td>Utility-First Responsive Design System</td></tr>
    <tr><td>Server Runtime</td><td>Node.js (v20+ LTS / v24)</td><td>Event-Driven Asynchronous Backend Engine</td></tr>
    <tr><td>Backend Framework</td><td>Express.js (v4.21)</td><td>RESTful Routing & Middleware Architecture</td></tr>
    <tr><td>Database Engine</td><td>MongoDB Community / Atlas</td><td>NoSQL Document Database</td></tr>
    <tr><td>Object Data Modeling</td><td>Mongoose (v8.9)</td><td>Schema Validation & Business Logic Engine</td></tr>
    <tr><td>Authentication</td><td>jsonwebtoken (JWT) & bcryptjs</td><td>Stateless Token Exchange & Password Hashing</td></tr>
    <tr><td>Testing & Quality</td><td>Postman Desktop & Puppeteer</td><td>Automated API Validation & Browser Automation</td></tr>
    <tr><td>Cloud Deployment</td><td>Vercel Cloud Platform</td><td>Serverless Edge Hosting</td></tr>
  </table>

  <!-- ==================== SECTION 5: FEASIBILITY STUDY ==================== -->
  <div class="page-break"></div>
  <h1>5.0 SYSTEM ANALYSIS & FEASIBILITY STUDY</h1>
  <h2>5.1 Technical Feasibility</h2>
  <p>
    The technical feasibility of MahaConnect is established by leveraging mature, widely adopted web frameworks within the MERN ecosystem. Node.js provides non-blocking, asynchronous I/O capabilities well-suited for an API Gateway coordinating multiple concurrent requests. MongoDB's JSON-native document format naturally accommodates the varied schemas required by diverse government services without requiring schema redesigns. React's component state model enables responsive multi-step form navigation and dynamic validation.
  </p>

  <h2>5.2 Operational Feasibility</h2>
  <p>
    The platform reduces operational friction for citizens and officers. Citizens access services through a clean, intuitive interface without requiring specialized training. Department officers work within dedicated scrutiny queues scoped to their department, streamlining review workflows. Administrators gain system visibility through telemetry log tables and operational charts.
  </p>

  <h2>5.3 Economic Feasibility</h2>
  <p>
    Utilizing open-source technologies (React, Node.js, Express, MongoDB Community) eliminates expensive proprietary software license fees. Deploying through modern serverless platforms like Vercel aligns resource utilization directly with application traffic, keeping hosting and maintenance costs modest for academic and organizational use cases.
  </p>

  <!-- ==================== SECTION 6: SYSTEM DESIGN & DATABASE ==================== -->
  <div class="page-break"></div>
  <h1>6.0 SYSTEM DESIGN, DFD & DATABASE MODELING</h1>
  <h2>6.1 Data Flow Diagrams (DFD)</h2>
  <h3>DFD Level 0 (Context Diagram)</h3>
  <p>
    At the context level, the MahaConnect system acts as a central transaction processor interacting with three external user groups and simulated departmental microservices:
  </p>
  <ul>
    <li><strong>Citizens:</strong> Submits service applications, uploads documents, and tracks status.</li>
    <li><strong>Department Officers:</strong> Reviews department-scoped dossiers, inspects documents, and updates status.</li>
    <li><strong>State Administrators:</strong> Manages departments, configures services, and monitors API telemetry.</li>
    <li><strong>Simulated Department REST Microservices:</strong> Ingests dispatched applications and returns department-specific reference IDs.</li>
  </ul>

  <h3>DFD Level 1 (Decomposition)</h3>
  <p>
    The Level 1 DFD decomposes the system into four major operational sub-processes:
  </p>
  <ul>
    <li><strong>Process 1.0 (Identity & Session Management):</strong> Validates credentials, issues JWT bearer tokens, and authorizes role-scoped endpoints.</li>
    <li><strong>Process 2.0 (Service Directory Catalog):</strong> Serves categorized departmental offerings and dynamic parameter requirements.</li>
    <li><strong>Process 3.0 (Application Orchestration & Gateway Dispatch):</strong> Ingests multi-step citizen inputs, uploads supporting files, dispatches to departmental gateways, and registers tracking records.</li>
    <li><strong>Process 4.0 (Scrutiny, Status Transition & Audit Logging):</strong> Processes officer remarks, updates application states, and writes immutable telemetry records.</li>
  </ul>

  <h2>6.2 Database Schema Architecture (Mongoose Models)</h2>
  <table>
    <tr><th>Collection Name</th><th>Key Attributes / Fields</th><th>Relationships & Constraints</th></tr>
    <tr>
      <td><strong>users</strong></td>
      <td>name, email, passwordHash, role (citizen | officer | admin), department (ref), phone, address, isActive</td>
      <td>Unique index on email; One-to-Many with applications; Department ref for officers</td>
    </tr>
    <tr>
      <td><strong>departments</strong></td>
      <td>name, code (REV, TRP, EDU, etc.), description, icon, activeServicesCount, contactEmail, isOperational</td>
      <td>Unique index on code; One-to-Many with services and applications</td>
    </tr>
    <tr>
      <td><strong>services</strong></td>
      <td>department (ref), name, description, requiredDocuments (array), processingTimeDays, fees, dynamicFields</td>
      <td>Foreign key to departments; Dynamic JSON schema for form generator</td>
    </tr>
    <tr>
      <td><strong>applications</strong></td>
      <td>applicationId (MC-2026-XXXXXX), citizen (ref), service (ref), department (ref), status, formData, documents, timeline</td>
      <td>Unique index on applicationId; Timeline audit array</td>
    </tr>
    <tr>
      <td><strong>apilogs</strong></td>
      <td>timestamp, source, destination, endpoint, method, statusCode, responseTimeMs, isSuccess, payloadSummary</td>
      <td>Indexed on timestamp; Powers Admin Interop Monitoring</td>
    </tr>
    <tr>
      <td><strong>notifications</strong></td>
      <td>recipient (ref), title, message, type, read, relatedApplicationId</td>
      <td>Indexed on (recipient, read) for fast badge rendering</td>
    </tr>
  </table>

  <!-- ==================== SECTION 7: IMPLEMENTATION DETAILS ==================== -->
  <div class="page-break"></div>
  <h1>7.0 FULL-STACK IMPLEMENTATION DETAILS</h1>
  <h2>7.1 Frontend Architecture (React, Vite & Tailwind CSS)</h2>
  <p>
    The frontend is built using React 18, Vite 6, and Tailwind CSS. The application structure emphasizes modularity and component reusability:
  </p>
  <ul>
    <li><strong>Atomic UI Components:</strong> Reusable elements including status badges, statistical summary cards, modals, breadcrumb bars, and responsive sidebars.</li>
    <li><strong>Dynamic 5-Step Application Wizard:</strong> Multi-step form engine that dynamically renders service-specific inputs (dropdowns, textareas, file pickers) based on the target service's schema definition stored in MongoDB.</li>
    <li><strong>Client-Side Interceptors & State Management:</strong> Axios HTTP client equipped with request interceptors that automatically attach JWT bearer tokens and response interceptors that handle token expiration and network errors.</li>
    <li><strong>Tailwind Custom Design System:</strong> Clean governmental palette utilizing deep navy blues, amber accents, emerald success indicators, and slate neutral backgrounds.</li>
  </ul>

  <h2>7.2 Backend Architecture (Node.js & Express REST Gateway)</h2>
  <p>
    The backend architecture enforces clean separation of concerns across four structural layers:
  </p>
  <ul>
    <li><strong>Routing Layer:</strong> RESTful resource routes (<code>/api/auth</code>, <code>/api/departments</code>, <code>/api/services</code>, <code>/api/applications</code>, <code>/api/admin</code>).</li>
    <li><strong>Middleware Layer:</strong> Authentication guards (<code>verifyToken</code>), role filters (<code>requireRole</code>), security headers (<code>helmet</code>), rate limiters, and error-handling pipelines.</li>
    <li><strong>Service Layer:</strong> Business logic handlers executing departmental dispatch simulations, audit logging, and notification broadcasts.</li>
    <li><strong>Persistence Layer:</strong> Mongoose schemas and queries utilizing lean projections for optimized memory consumption.</li>
  </ul>

  <!-- ==================== SECTION 8: SECURITY ==================== -->
  <div class="page-break"></div>
  <h1>8.0 SECURITY, CRYPTOGRAPHY & ACCESS CONTROL</h1>
  <h2>8.1 Password Hashing & JWT Bearer Tokens</h2>
  <p>
    User passwords are protected using the industry-standard <strong>bcrypt</strong> algorithm. During registration, passwords are processed through a salt generation routine with a cost factor of 10 rounds:
  </p>
  <div class="code-block">
const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(password, salt);
  </div>
  <p>
    Session management relies on cryptographically signed JSON Web Tokens (HMAC-SHA256). Upon authentication, the server generates a signed payload containing the user's ID, role, and department binding (for officers). This token is transmitted in the <code>Authorization: Bearer &lt;token&gt;</code> header on subsequent requests.
  </p>

  <h2>8.2 Role-Based Access Control (RBAC) Matrix</h2>
  <table>
    <tr><th>Resource Endpoint / Operation</th><th>Public</th><th>Citizen</th><th>Department Officer</th><th>State Admin</th></tr>
    <tr><td>View Landing Page & Services Catalog</td><td>✔ Allowed</td><td>✔ Allowed</td><td>✔ Allowed</td><td>✔ Allowed</td></tr>
    <tr><td>Submit New Service Application</td><td>❌ Denied</td><td>✔ Allowed</td><td>❌ Denied</td><td>❌ Denied</td></tr>
    <tr><td>Upload Supporting Documents</td><td>❌ Denied</td><td>✔ Allowed</td><td>❌ Denied</td><td>❌ Denied</td></tr>
    <tr><td>View Citizen Application History</td><td>❌ Denied</td><td>✔ Own Only</td><td>❌ Denied</td><td>✔ All</td></tr>
    <tr><td>Review Department Application Scrutiny</td><td>❌ Denied</td><td>❌ Denied</td><td>✔ Dept Scoped</td><td>✔ All</td></tr>
    <tr><td>Update Application Status & Remarks</td><td>❌ Denied</td><td>❌ Denied</td><td>✔ Dept Scoped</td><td>✔ Override</td></tr>
    <tr><td>Manage Departments & Service Schemas</td><td>❌ Denied</td><td>❌ Denied</td><td>❌ Denied</td><td>✔ Full Admin</td></tr>
    <tr><td>Inspect API Interoperability Gateway Logs</td><td>❌ Denied</td><td>❌ Denied</td><td>❌ Denied</td><td>✔ Full Admin</td></tr>
  </table>

  <!-- ==================== SECTION 9: INTEROPERABILITY GATEWAY ==================== -->
  <div class="page-break"></div>
  <h1>9.0 INTEROPERABILITY GATEWAY & API ROUTING ENGINE</h1>
  <h2>9.1 Gateway Routing & Protocol Translation</h2>
  <p>
    The MahaConnect Interoperability Gateway serves as the communication hub for cross-departmental operations. When a citizen submits an application, the gateway intercepts the unified payload, assigns a unique state tracking ID (e.g. <code>MC-2026-000101</code>), and invokes the departmental routing sub-engine:
  </p>
  <div class="code-block">
// Sample Gateway Dispatch Logic (Simulated Department REST Integration)
const dispatchToDepartment = async (departmentCode, applicationData) => {
  const startTime = Date.now();
  const interopRef = departmentCode + '-2026-' + Math.floor(10000 + Math.random() * 90000);
  
  // Simulate asynchronous downstream departmental microservice integration
  const responseTime = Math.floor(20 + Math.random() * 45); // 20-65ms latency
  
  // Log transaction telemetry in ApiLog collection
  await ApiLog.create({
    source: 'MahaConnect Unified Gateway',
    destination: departmentCode + ' Departmental API',
    endpoint: '/api/v1/applications/inbound',
    method: 'POST',
    statusCode: 201,
    responseTimeMs: responseTime,
    isSuccess: true,
    payloadSummary: { applicationId: applicationData.applicationId, interopRef }
  });
  
  return { interopRef, latencyMs: responseTime };
};
  </div>

  <!-- ==================== SECTION 10: TESTING ==================== -->
  <div class="page-break"></div>
  <h1>10.0 TESTING, VERIFICATION & POSTMAN SUITE EXECUTION</h1>
  <h2>10.1 Automated Testing Methodology</h2>
  <p>
    Quality assurance for MahaConnect was conducted through a multi-phase testing strategy incorporating:
  </p>
  <ul>
    <li><strong>API Verification Suite (Postman):</strong> Validation of RESTful endpoints, header parsing, JWT security enforcement, and HTTP response codes.</li>
    <li><strong>Client-Side Validation & Error Trapping:</strong> Verification of form input restrictions (mandatory fields, formats).</li>
    <li><strong>Browser Automation & Regression Testing (Puppeteer):</strong> Autonomous end-to-end user journey simulation validating session creation, multi-step application filing, scrutiny review, and real-time status transitions.</li>
  </ul>

  <h2>10.2 Postman Test Case Execution Matrix</h2>
  <table>
    <tr><th>Test Case ID</th><th>Endpoint & HTTP Method</th><th>Request Description</th><th>Expected Status</th><th>Actual Status</th><th>Result</th></tr>
    <tr><td>TC-API-01</td><td>GET /api/departments</td><td>Fetch all registered active departments</td><td>200 OK</td><td>200 OK</td><td>PASS</td></tr>
    <tr><td>TC-API-02</td><td>POST /api/auth/login</td><td>Authenticate citizen with valid credentials</td><td>200 OK</td><td>200 OK</td><td>PASS</td></tr>
    <tr><td>TC-API-03</td><td>POST /api/auth/login</td><td>Attempt authentication with incorrect password</td><td>401 Unauthorized</td><td>401 Unauthorized</td><td>PASS</td></tr>
    <tr><td>TC-API-04</td><td>POST /api/applications</td><td>Submit valid multi-step application payload</td><td>201 Created</td><td>201 Created</td><td>PASS</td></tr>
    <tr><td>TC-API-05</td><td>GET /api/applications/:id</td><td>Retrieve application details & timeline</td><td>200 OK</td><td>200 OK</td><td>PASS</td></tr>
    <tr><td>TC-API-06</td><td>PATCH /api/applications/:id/status</td><td>Officer status update to Approved with remarks</td><td>200 OK</td><td>200 OK</td><td>PASS</td></tr>
    <tr><td>TC-API-07</td><td>DELETE /api/departments/:id</td><td>Attempt deletion of department with active services</td><td>400 Bad Request</td><td>400 Bad Request</td><td>PASS</td></tr>
    <tr><td>TC-API-08</td><td>GET /api/admin/api-logs</td><td>Fetch real-time interoperability gateway logs</td><td>200 OK</td><td>200 OK</td><td>PASS</td></tr>
  </table>

  <!-- ==================== SECTION 11: RESULTS & SCREENSHOTS ==================== -->
  <div class="page-break"></div>
  <h1>11.0 RESULTS, SCREENSHOTS & SYSTEM WALKTHROUGH</h1>
  <p>
    This section presents the working user interfaces, RESTful API transactions, database records, and operational views captured directly from the live running MahaConnect application. Each figure is accompanied by an architectural and functional walkthrough.
  </p>

  <!-- FIGURE 1 -->
  <div class="figure-box">
    <img src="${images.img01}" class="figure-img" alt="Landing Page">
    <div class="figure-caption">Figure 1: MahaConnect Public Landing Page & Citizen Gateway</div>
    <div class="figure-desc">The responsive e-Governance landing page displaying state emblems, key statistical counters, featured departmental services, and unified access links.</div>
  </div>

  <!-- FIGURE 2 -->
  <div class="figure-box">
    <img src="${images.img02}" class="figure-img" alt="Login Page">
    <div class="figure-caption">Figure 2: Unified Authentication Portal with Seeded Demo Credentials</div>
    <div class="figure-desc">Secure JWT authentication screen featuring pre-seeded demo credential triggers for Citizen, Transport Officer, and State Administrator accounts for demonstration.</div>
  </div>

  <!-- FIGURE 3 -->
  <div class="figure-box">
    <img src="${images.img03}" class="figure-img" alt="Citizen Dashboard">
    <div class="figure-caption">Figure 3: Citizen Self-Service Dashboard with Metric Cards & Quick Navigation</div>
    <div class="figure-desc">Personalized dashboard showing overall application counts, active status breakdowns (Submitted, Under Review, Approved), unread notification badges, and rapid service shortcuts.</div>
  </div>

  <!-- FIGURE 4 -->
  <div class="figure-box">
    <img src="${images.img04}" class="figure-img" alt="Services Catalog">
    <div class="figure-caption">Figure 4: Cross-Departmental Government Services Directory with Filtering</div>
    <div class="figure-desc">Comprehensive catalog displaying services across 7 departments with dynamic search, category filters, required document checklists, and estimated processing timelines.</div>
  </div>

  <!-- FIGURE 5 -->
  <div class="figure-box">
    <img src="${images.img05}" class="figure-img" alt="Application Form">
    <div class="figure-caption">Figure 5: Dynamic Application Form Wizard: Step 1 (Personal Demographics)</div>
    <div class="figure-desc">Step 1 of the multi-stage application pipeline pre-populating citizen profile data to avoid repetitive entry across government departments.</div>
  </div>

  <!-- FIGURE 6 -->
  <div class="figure-box">
    <img src="${images.img06}" class="figure-img" alt="Form Validation Error">
    <div class="figure-caption">Figure 6: Client-Side Form Validation Alert & Error Prevention</div>
    <div class="figure-desc">Visual feedback and toast alert triggered when mandatory demographic fields are omitted, preventing invalid or malformed data from reaching backend services.</div>
  </div>

  <!-- FIGURE 7 -->
  <div class="figure-box">
    <img src="${images.img07}" class="figure-img" alt="Document Upload">
    <div class="figure-caption">Figure 7: Document Upload & Multi-Format Verification</div>
    <div class="figure-desc">Step 3 file upload interface supporting PDF, PNG, and JPG attachments with upload progress, category tagging (Aadhaar, PAN, Address Proof), and file removal options.</div>
  </div>

  <!-- FIGURE 8 -->
  <div class="figure-box">
    <img src="${images.img08}" class="figure-img" alt="Submission Confirmation">
    <div class="figure-caption">Figure 8: Application Submission Confirmation & Unique Reference Generation</div>
    <div class="figure-desc">Step 5 confirmation screen displaying the newly generated Unified Application ID (MC-2026-000101) alongside the Department Gateway Routing Reference (TRP-2026-68192).</div>
  </div>

  <!-- FIGURE 9 -->
  <div class="figure-box">
    <img src="${images.img09}" class="figure-img" alt="Tracking Timeline">
    <div class="figure-caption">Figure 9: Live Citizen Tracking Timeline with Multi-Stage Progression</div>
    <div class="figure-desc">Detailed tracking view illustrating the complete chronological lifecycle (Draft → Submitted → Under Review → Approved) with exact timestamps and processing remarks.</div>
  </div>

  <!-- FIGURE 10 -->
  <div class="figure-box">
    <img src="${images.img10}" class="figure-img" alt="Officer Dashboard">
    <div class="figure-caption">Figure 10: Department Officer Scrutiny Console & Pending Application Queue</div>
    <div class="figure-desc">Role-scoped officer console filtering applications belonging to the Transport Department, displaying urgency indicators and pending scrutiny workloads.</div>
  </div>

  <!-- FIGURE 11 -->
  <div class="figure-box">
    <img src="${images.img11}" class="figure-img" alt="Officer Review">
    <div class="figure-caption">Figure 11: Officer Application Scrutiny Dossier with Inline Document Viewer</div>
    <div class="figure-desc">Scrutiny screen allowing the departmental officer to inspect submitted personal details, service-specific parameters, and preview uploaded citizen proof documents.</div>
  </div>

  <!-- FIGURE 12 -->
  <div class="figure-box">
    <img src="${images.img12}" class="figure-img" alt="Status Update">
    <div class="figure-caption">Figure 12: Officer Status Transition Pipeline & Remarks Endorsement</div>
    <div class="figure-desc">Officer action interface recording official remarks ("All biometric tests and identity proofs verified by RTO Inspector") and transitioning status to Approved with audit logging.</div>
  </div>

  <!-- FIGURE 13 -->
  <div class="figure-box">
    <img src="${images.img13}" class="figure-img" alt="Admin Dashboard">
    <div class="figure-caption">Figure 13: State Administrator Governance Dashboard & Interoperability KPIs</div>
    <div class="figure-desc">Administration cockpit showing system-wide application volume, departmental performance metrics, active user registrations, and overall gateway operational health.</div>
  </div>

  <!-- FIGURE 14 -->
  <div class="figure-box">
    <img src="${images.img14}" class="figure-img" alt="Department Management">
    <div class="figure-caption">Figure 14: State Department Management Console & Endpoint Configuration</div>
    <div class="figure-desc">Administrative table listing all 7 state departments, their departmental codes, contact emails, active service counts, and operational status toggles.</div>
  </div>

  <!-- FIGURE 15 -->
  <div class="figure-box">
    <img src="${images.img15}" class="figure-img" alt="Service Management">
    <div class="figure-caption">Figure 15: Service Schema Configuration & Dynamic Field Definition</div>
    <div class="figure-desc">Catalog management console enabling administrators to configure state public services, upload document requirements, and define dynamic JSON-schema input fields.</div>
  </div>

  <!-- FIGURE 16 -->
  <div class="figure-box">
    <img src="${images.img16}" class="figure-img" alt="API Logs">
    <div class="figure-caption">Figure 16: REST API Interoperability Gateway Logs & Modal Payload Inspector</div>
    <div class="figure-desc">Administrative telemetry ledger capturing cross-departmental API calls, with a modal inspector displaying HTTP status codes, response latencies (ms), and JSON payloads.</div>
  </div>

  <!-- FIGURE 17 -->
  <div class="figure-box">
    <img src="${images.img17}" class="figure-img" alt="Postman GET">
    <div class="figure-caption">Figure 17: Postman Test Suite: GET /api/departments (Status 200 OK)</div>
    <div class="figure-desc">Validation of the departmental directory REST endpoint returning all 7 state departments with JSON schemas and active service counts in 24 ms.</div>
  </div>

  <!-- FIGURE 18 -->
  <div class="figure-box">
    <img src="${images.img18}" class="figure-img" alt="Postman POST">
    <div class="figure-caption">Figure 18: Postman Test Suite: POST /api/auth/login (JWT Token Generation)</div>
    <div class="figure-desc">Authentication endpoint test verifying bcrypt password verification and generation of a cryptographically signed HMAC-SHA256 JWT bearer token.</div>
  </div>

  <!-- FIGURE 19 -->
  <div class="figure-box">
    <img src="${images.img19}" class="figure-img" alt="Postman PATCH">
    <div class="figure-caption">Figure 19: Postman Test Suite: PATCH /api/applications/:id/status</div>
    <div class="figure-desc">Automated status transition call demonstrating the officer approval workflow, timeline appending, and departmental gateway synchronization in 44 ms.</div>
  </div>

  <!-- FIGURE 20 -->
  <div class="figure-box">
    <img src="${images.img20}" class="figure-img" alt="Postman DELETE">
    <div class="figure-caption">Figure 20: Postman Test Suite: DELETE /api/departments/:id (Integrity Check)</div>
    <div class="figure-desc">Integrity protection validation returning 400 Bad Request to prevent deletion of departments possessing active public services and ongoing citizen applications.</div>
  </div>

  <!-- FIGURE 21 -->
  <div class="figure-box">
    <img src="${images.img21}" class="figure-img" alt="MongoDB Records">
    <div class="figure-caption">Figure 21: MongoDB Shell (mongosh) Collection & Query Ledger Inspection</div>
    <div class="figure-desc">Live database terminal view displaying the 6 core collections (apilogs, applications, departments, notifications, services, users) and formatted query records.</div>
  </div>

  <!-- FIGURE 22 -->
  <div class="figure-box">
    <img src="${images.img22}" class="figure-img" alt="Final Application Overview">
    <div class="figure-caption">Figure 22: MahaConnect Multi-Portal System Overview (Pawan Mishra & Samarth Nivadunge, Sem V)</div>
    <div class="figure-desc">Composite presentation showcase illustrating the tri-portal architecture (Citizen Hub, Officer Console, Admin Gateway) and the full MERN stack integration.</div>
  </div>

  <!-- ==================== SECTION 12: CONCLUSION ==================== -->
  <div class="page-break"></div>
  <h1>12.0 CONCLUSION & FUTURE ENHANCEMENTS</h1>
  <h2>12.1 Project Conclusion</h2>
  <p>
    The <strong>MahaConnect – Government Platform Interoperability System</strong> capstone project successfully demonstrates how modern web technologies and API Gateway architectures can bridge fragmented public service portals into a unified single-window experience. By implementing the complete application on the <strong>MERN stack</strong>, the project provides an accessible, cohesive interface without requiring invasive redesigns of backend departmental structures.
  </p>
  <p>Key accomplishments realized in this project include:</p>
  <ul>
    <li>Universal citizen single-sign-on and profile synchronization, reducing duplicate data entry.</li>
    <li>Dynamic 5-step form generation wizard accommodating varying service parameters through JSON schemas.</li>
    <li>Simulated RESTful Interoperability Gateway that records telemetry logs for cross-departmental exchanges.</li>
    <li>Role-based access control protecting Citizen, Officer, and Admin data partitions.</li>
    <li>Cloud deployment on Vercel backed by MongoDB.</li>
  </ul>

  <h2>12.2 Future Enhancements</h2>
  <p>
    Future iterations of the MahaConnect platform can introduce:
  </p>
  <ol>
    <li><strong>DigiLocker & National e-KYC Integration:</strong> Integration with national document verification APIs to automatically retrieve certified identity and educational documents.</li>
    <li><strong>Distributed Audit Ledger:</strong> Transitioning the centralized <code>ApiLog</code> collection into an immutable distributed ledger for cross-departmental auditing.</li>
    <li><strong>AI-Assisted Citizen Guidance:</strong> Embedding conversational assistance to help citizens identify eligible government schemes and navigate application requirements.</li>
    <li><strong>Multilingual Accessibility:</strong> Adding localization support for Marathi, Hindi, and English regional dialects to enhance digital accessibility.</li>
  </ol>

  <!-- ==================== SECTION 13: REFERENCES ==================== -->
  <div class="page-break"></div>
  <h1>13.0 REFERENCES & ACADEMIC BIBLIOGRAPHY</h1>
  <ol>
    <li>National e-Governance Division (NeGD), Ministry of Electronics and Information Technology (MeitY), Government of India. <em>e-Governance Interoperability Framework for India (e-GIF)</em>, 2021.</li>
    <li>Fielding, Roy Thomas. <em>Architectural Styles and the Design of Network-based Software Architectures</em>. Doctoral dissertation, University of California, Irvine, 2000.</li>
    <li>Chodorow, Kristina. <em>MongoDB: The Definitive Guide: Powerful and Scalable Data Storage</em>. 3rd Edition, O'Reilly Media, 2020.</li>
    <li>Banks, Alex and Porcello, Eve. <em>Learning React: Modern Patterns for Developing React Apps</em>. 2nd Edition, O'Reilly Media, 2020.</li>
    <li>Haverbeke, Marijn. <em>Eloquent JavaScript: A Modern Introduction to Programming</em>. 3rd Edition, No Starch Press, 2018.</li>
    <li>Rescorla, Eric. <em>The Transport Layer Security (TLS) Protocol Version 1.3</em>. RFC 8446, Internet Engineering Task Force (IETF), 2018.</li>
    <li>Jones, Michael, Bradley, John, and Sakimura, Nat. <em>JSON Web Token (JWT)</em>. RFC 7519, Internet Engineering Task Force (IETF), 2015.</li>
    <li>W3C Web Accessibility Initiative (WAI). <em>Web Content Accessibility Guidelines (WCAG) 2.1</em>, World Wide Web Consortium, 2018.</li>
  </ol>

  <!-- ==================== SECTION 14: APPENDIX ==================== -->
  <div class="page-break"></div>
  <h1>14.0 APPENDIX: SOURCE CODE HIGHLIGHTS & API SCHEMA</h1>
  <h2>14.1 Core REST Controller: Application Dispatcher</h2>
  <div class="code-block">
// File: server/controllers/applicationController.js (Excerpt)
export const createApplication = async (req, res, next) => {
  try {
    const { serviceId, formData, documents } = req.body;
    const service = await Service.findById(serviceId).populate('department');
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    // Generate Unique State Application ID: MC-2026-XXXXXX
    const count = await Application.countDocuments();
    const applicationId = 'MC-2026-' + String(count + 101).padStart(6, '0');

    // Simulate Interoperability Gateway Dispatch to Department System
    const interopRef = service.department.code + '-2026-' + Math.floor(10000 + Math.random() * 90000);

    const application = await Application.create({
      applicationId,
      citizen: req.user._id,
      service: service._id,
      department: service.department._id,
      status: 'Submitted',
      formData,
      documents,
      interopReferenceId: interopRef,
      timeline: [
        { status: 'Draft', timestamp: new Date(Date.now() - 60000), remarks: 'Application initiated' },
        { status: 'Submitted', timestamp: new Date(), remarks: 'Dispatched to ' + service.department.name }
      ]
    });

    // Record Telemetry Audit Log
    await ApiLog.create({
      source: 'MahaConnect Portal',
      destination: service.department.name + ' Gateway',
      endpoint: '/api/applications',
      method: 'POST',
      statusCode: 201,
      responseTimeMs: Math.floor(25 + Math.random() * 30),
      isSuccess: true,
      payloadSummary: { applicationId, interopRef }
    });

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};
  </div>

  <h2>14.2 Deployment & Reproduction Instructions</h2>
  <div class="code-block">
# 1. Clone & Install Dependencies
git clone https://github.com/pawan120307/MahaConnect.git
cd MahaConnect
npm run install:all

# 2. Database Initialization & Seeding
npm run seed --prefix server

# 3. Launch Development Daemons
# Terminal 1 - Backend Server (Port 5001)
npm run server

# Terminal 2 - Frontend Client (Port 5173)
npm run client

# 4. Access Live Production Deployment
Production URL: https://mahaconnect-rose.vercel.app
GitHub Repository: https://github.com/pawan120307/MahaConnect
  </div>

</body>
</html>`;
}

async function generatePdf() {
  console.log('📄 Assembling HTML template for two-student Semester V report...');
  const htmlContent = buildReportHtml();

  console.log('🚀 Launching Chrome for A4 Print PDF Generation...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
  await sleep(1500);

  const headerFooterOptions = {
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-family: Arial, sans-serif; font-size: 8pt; color: #94a3b8; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between; border-bottom: 0.5pt solid #e2e8f0; padding-bottom: 2pt;">
        <span>MahaConnect – Government Platform Interoperability System</span>
        <span>TY BSc IT Sem V • Pawan Mishra & Samarth Nivadunge</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-family: Arial, sans-serif; font-size: 8pt; color: #94a3b8; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between; border-top: 0.5pt solid #e2e8f0; padding-top: 2pt;">
        <span>Department of Information Technology</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `,
  };

  console.log('🖨️ Generating PDF: ' + OUTPUT_PDF_PRIMARY);
  await page.pdf({
    path: OUTPUT_PDF_PRIMARY,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '18mm',
      bottom: '18mm',
      left: '15mm',
      right: '15mm',
    },
    ...headerFooterOptions,
  });

  // Also write to original PDF path so both remain updated
  console.log('🖨️ Updating PDF: ' + OUTPUT_PDF_ORIGINAL);
  await page.pdf({
    path: OUTPUT_PDF_ORIGINAL,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '18mm',
      bottom: '18mm',
      left: '15mm',
      right: '15mm',
    },
    ...headerFooterOptions,
  });

  await browser.close();
  console.log('✅ PDF REPORTS GENERATED SUCCESSFULLY!');
}

generatePdf().catch((err) => {
  console.error('Error generating PDF report:', err);
  process.exit(1);
});
