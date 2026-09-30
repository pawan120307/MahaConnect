import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots');
const OUTPUT_PDF = path.join(
  __dirname,
  '../MahaConnect_Capstone_Report_Pawan_Mishra_Samarth_Nivadunge_Sem5.pdf'
);
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

function buildCollegeReportHtml() {
  const imgArch = getBase64Image('00_architecture_diagram.png');
  const imgDfd0 = getBase64Image('00_dfd_level0.png');
  const imgDfd1 = getBase64Image('00_dfd_level1.png');
  const imgEr = getBase64Image('00_er_diagram.png');
  const imgSeq = getBase64Image('00_gateway_sequence.png');

  const img01 = getBase64Image('01_landing_page.png');
  const img02 = getBase64Image('02_login_page.png');
  const img03 = getBase64Image('03_citizen_dashboard.png');
  const img04 = getBase64Image('04_government_services.png');
  const img05 = getBase64Image('05_application_form.png');
  const img06 = getBase64Image('06_form_validation_error.png');
  const img07 = getBase64Image('07_document_upload_review.png');
  const img08 = getBase64Image('08_successful_application_submission.png');
  const img09 = getBase64Image('09_application_tracking_timeline.png');
  const img10 = getBase64Image('10_officer_dashboard.png');
  const img11 = getBase64Image('11_officer_application_review.png');
  const img12 = getBase64Image('12_updated_application_status.png');
  const img13 = getBase64Image('13_admin_dashboard.png');
  const img14 = getBase64Image('14_department_management.png');
  const img15 = getBase64Image('15_service_management.png');
  const img16 = getBase64Image('16_api_interoperability_logs.png');
  const img17 = getBase64Image('17_postman_get_request.png');
  const img18 = getBase64Image('18_postman_post_request.png');
  const img19 = getBase64Image('19_postman_put_patch_request.png');
  const img20 = getBase64Image('20_postman_delete_request.png');
  const img21 = getBase64Image('21_mongodb_records.png');
  const img22 = getBase64Image('22_final_working_application.png');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MahaConnect - Capstone Project Report</title>
  <style>
    @page {
      size: A4;
      margin: 16mm 14mm 16mm 14mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 10.5pt;
      line-height: 1.45;
      color: #111827;
      background: #ffffff;
    }
    .page-break {
      page-break-before: always;
      break-before: page;
    }
    .chapter-title {
      font-family: 'Arial', sans-serif;
      font-size: 15pt;
      font-weight: bold;
      color: #000000;
      text-align: center;
      text-transform: uppercase;
      margin-top: 6pt;
      margin-bottom: 14pt;
      letter-spacing: 0.5pt;
      border-bottom: 1.5pt solid #000000;
      padding-bottom: 5pt;
      page-break-after: avoid;
      break-after: avoid;
    }
    h2 {
      font-family: 'Arial', sans-serif;
      font-size: 12pt;
      font-weight: bold;
      color: #0f2b48;
      margin-top: 12pt;
      margin-bottom: 5pt;
      page-break-after: avoid;
      break-after: avoid;
    }
    h3 {
      font-family: 'Arial', sans-serif;
      font-size: 10.5pt;
      font-weight: bold;
      color: #1e293b;
      margin-top: 8pt;
      margin-bottom: 3pt;
      page-break-after: avoid;
      break-after: avoid;
    }
    p {
      margin-bottom: 6pt;
      text-align: justify;
      text-justify: inter-word;
      text-indent: 20pt;
    }
    p.no-indent {
      text-indent: 0;
    }
    ul, ol {
      margin-left: 24pt;
      margin-bottom: 6pt;
    }
    li {
      margin-bottom: 2pt;
      text-align: justify;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8pt 0 10pt 0;
      font-size: 8.5pt;
    }
    th, td {
      border: 1pt solid #475569;
      padding: 3.5pt 5.5pt;
      text-align: left;
      line-height: 1.35;
    }
    th {
      background-color: #f1f5f9;
      color: #000000;
      font-weight: bold;
      font-family: 'Arial', sans-serif;
    }
    tr {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    tr:nth-child(even) {
      background-color: #f8fafc;
    }
    .table-caption {
      font-family: 'Arial', sans-serif;
      font-size: 9pt;
      font-weight: bold;
      color: #000000;
      margin-bottom: 3pt;
      text-align: left;
      page-break-after: avoid;
      break-after: avoid;
    }
    .figure-box {
      margin: 6pt auto 8pt auto;
      text-align: center;
      page-break-inside: avoid;
      break-inside: avoid;
      max-width: 92%;
    }
    .figure-img {
      max-width: 80%;
      max-height: 205pt;
      width: auto;
      height: auto;
      border: 1pt solid #475569;
      border-radius: 3pt;
      display: block;
      margin: 0 auto;
      box-shadow: 0 1pt 3pt rgba(0,0,0,0.12);
      object-fit: contain;
    }
    .figure-caption {
      font-family: 'Arial', sans-serif;
      font-size: 8.5pt;
      font-weight: bold;
      color: #000000;
      margin-top: 3pt;
      text-align: center;
    }
    .figure-desc {
      font-size: 7.5pt;
      color: #475569;
      margin-top: 1pt;
      font-style: italic;
      text-align: center;
      padding: 0 15pt;
    }
    .code-block {
      background: #f8fafc;
      color: #0f172a;
      font-family: 'Courier New', Courier, monospace;
      font-size: 8pt;
      padding: 6pt 8pt;
      border: 1pt solid #cbd5e1;
      border-left: 3pt solid #0f2b48;
      border-radius: 2pt;
      margin: 6pt 0;
      overflow-x: auto;
      white-space: pre-wrap;
      line-height: 1.35;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .cover-page {
      box-sizing: border-box;
      height: 100%;
      min-height: 98%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: center;
      padding: 16pt 14pt;
      border: 1.5pt solid #000000;
    }
    .certificate-border {
      border: 1.5pt solid #000000;
      padding: 20pt;
      height: 100%;
      box-sizing: border-box;
    }
  </style>
</head>
<body>

  <!-- ==================== 1. COVER / TITLE PAGE ==================== -->
  <div class="cover-page">
    <div>
      <div style="font-size: 10.5pt; font-weight: bold; color: #475569; text-transform: uppercase; letter-spacing: 0.8pt;">
        A CAPSTONE PROJECT REPORT ON
      </div>

      <div style="font-size: 19pt; font-weight: 900; color: #000000; margin-top: 10pt; line-height: 1.22; font-family: Arial, sans-serif;">
        MAHACONNECT:<br>GOVERNMENT PLATFORM INTEROPERABILITY SYSTEM
      </div>

      <div style="font-size: 11.5pt; font-weight: bold; color: #1e3a8a; margin-top: 6pt; font-family: Arial, sans-serif;">
        A Unified Multi-Departmental e-Governance Integration Architecture
      </div>

      <div style="font-size: 9.5pt; color: #334155; margin-top: 14pt; font-style: italic;">
        Submitted in partial fulfillment of the requirements for the award of the Degree of
      </div>

      <div style="font-size: 12.5pt; font-weight: bold; color: #000000; margin-top: 3pt; font-family: Arial, sans-serif;">
        BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY (BSc IT)
      </div>

      <div style="font-size: 10pt; color: #475569; font-weight: bold; margin-top: 2pt;">
        (Full Stack Development & Management – FSDM)
      </div>
    </div>

    <div style="margin: 10pt 0;">
      <div style="font-size: 10.5pt; font-weight: bold; color: #000000; text-transform: uppercase;">
        SUBMITTED BY:
      </div>

      <div style="margin-top: 6pt;">
        <div style="font-size: 14pt; font-weight: bold; color: #000000; font-family: Arial, sans-serif;">
          PAWAN MISHRA
        </div>
        <div style="font-size: 10.5pt; font-family: 'Courier New', monospace; font-weight: bold;">
          Roll No: 202402104
        </div>
      </div>

      <div style="margin-top: 6pt;">
        <div style="font-size: 14pt; font-weight: bold; color: #000000; font-family: Arial, sans-serif;">
          SAMARTH NIVADUNGE
        </div>
        <div style="font-size: 10.5pt; font-family: 'Courier New', monospace; font-weight: bold;">
          Roll No: 202402111
        </div>
      </div>

      <div style="font-size: 11pt; font-weight: bold; color: #0f2b48; margin-top: 8pt;">
        Class: TY BSc IT • Semester V
      </div>

      <div style="margin-top: 10pt; border-top: 1pt dashed #cbd5e1; padding-top: 8pt;">
        <div style="font-size: 10pt; font-weight: bold; color: #475569; text-transform: uppercase;">
          UNDER THE GUIDANCE OF:
        </div>
        <div style="font-size: 13pt; font-weight: bold; color: #000000; font-family: Arial, sans-serif; margin-top: 2pt;">
          MR. PRATHARV SURVE
        </div>
        <div style="font-size: 9pt; color: #475569;">
          Department of Information Technology
        </div>
      </div>
    </div>

    <div>
      <div style="font-size: 10.5pt; font-weight: bold; color: #000000;">
        DEPARTMENT OF INFORMATION TECHNOLOGY
      </div>
      <div style="font-size: 11.5pt; font-weight: bold; color: #000000; margin-top: 2pt; font-family: Arial, sans-serif;">
        ZSCT'S THAKUR SHYAMNARAYAN DEGREE COLLEGE
      </div>
      <div style="font-size: 9pt; color: #334155; margin-top: 1pt;">
        (Affiliated to University of Mumbai)<br>
        MUMBAI – MAHARASHTRA – 400101
      </div>

      <div style="font-size: 10pt; font-weight: bold; color: #000000; margin-top: 6pt;">
        Academic Year: 2026 – 2027
      </div>

      <div style="font-size: 8.5pt; color: #1e3a8a; margin-top: 6pt; font-family: monospace;">
        Production Deployment URL: https://mahaconnect-rose.vercel.app
      </div>
    </div>
  </div>

  <!-- ==================== 2. CERTIFICATE ==================== -->
  <div class="page-break"></div>
  <div class="certificate-border">
    <div style="text-align: center; margin-bottom: 12pt;">
      <div style="font-size: 13.5pt; font-weight: bold; color: #000000; font-family: Arial, sans-serif;">
        ZSCT'S THAKUR SHYAMNARAYAN DEGREE COLLEGE
      </div>
      <div style="font-size: 9pt; color: #334155;">
        (Affiliated to University of Mumbai)<br>
        MUMBAI – MAHARASHTRA – 400101
      </div>
      <div style="font-size: 10.5pt; font-weight: bold; color: #0f2b48; margin-top: 4pt;">
        DEPARTMENT OF INFORMATION TECHNOLOGY
      </div>

      <div style="font-size: 16pt; font-weight: bold; color: #000000; margin-top: 12pt; font-family: Arial, sans-serif; letter-spacing: 1pt;">
        CERTIFICATE
      </div>
    </div>

    <p style="line-height: 1.7; text-indent: 0; font-size: 10.5pt; margin-top: 12pt;">
      This is to certify that the project entitled <strong>"MahaConnect: Government Platform Interoperability System"</strong> is a bonafide work carried out by <strong>Pawan Mishra</strong> (Roll No: <strong>202402104</strong>) and <strong>Samarth Nivadunge</strong> (Roll No: <strong>202402111</strong>) in partial fulfillment of the requirements for the degree of <strong>Bachelor of Science in Information Technology (TY BSc IT)</strong>, during the academic year <strong>2026–2027</strong>.
    </p>

    <p style="line-height: 1.7; text-indent: 0; font-size: 10.5pt; margin-top: 10pt;">
      The candidates have completed the project work under the guidance of <strong>Mr. Pratharv Surve</strong> (Project Guide) and the Department of Information Technology, demonstrating a comprehensive understanding of full-stack MERN web engineering, RESTful API interoperability, role-based access control, and asynchronous citizen service automation.
    </p>

    <div style="margin-top: 75pt; display: flex; justify-content: space-between; text-align: center;">
      <div style="width: 30%;">
        <div style="border-top: 1pt solid #000; padding-top: 4pt; font-weight: bold; font-size: 9.5pt;">MR. PRATHARV SURVE</div>
        <div style="font-size: 8pt; color: #334155; margin-top: 2pt;">Project Guide<br>Dept. of Information Technology</div>
      </div>
      <div style="width: 30%;">
        <div style="border-top: 1pt solid #000; padding-top: 4pt; font-weight: bold; font-size: 9.5pt;">HEAD OF DEPARTMENT</div>
        <div style="font-size: 8pt; color: #334155; margin-top: 2pt;">Dept. of Information Technology</div>
      </div>
      <div style="width: 30%;">
        <div style="border-top: 1pt solid #000; padding-top: 4pt; font-weight: bold; font-size: 9.5pt;">PRINCIPAL</div>
        <div style="font-size: 8pt; color: #334155; margin-top: 2pt;">Thakur Shyamnarayan Degree College</div>
      </div>
    </div>
  </div>

  <!-- ==================== 3. DECLARATION ==================== -->
  <div class="page-break"></div>
  <div class="chapter-title">DECLARATION</div>

  <p class="no-indent" style="line-height: 1.75;">
    We, <strong>Pawan Mishra</strong> and <strong>Samarth Nivadunge</strong>, hereby declare that the capstone project report entitled <strong>"MahaConnect – Government Platform Interoperability System"</strong>, submitted to the Department of Information Technology in partial fulfillment of the requirements for the award of the Degree of <strong>Bachelor of Science in Information Technology (TY BSc IT)</strong>, is an authentic record of original work carried out by us under institutional academic guidance.
  </p>

  <p class="no-indent" style="line-height: 1.75; margin-top: 12pt;">
    We further declare that this report has not been submitted either concurrently or previously to any other university, college, or examination board for the award of any degree or diploma. All external libraries, architectural design patterns, research papers, and technical standards cited throughout this document have been duly acknowledged in the references section.
  </p>

  <div style="margin-top: 45pt; text-align: right; line-height: 1.5;">
    <div style="font-weight: bold; font-size: 11pt;">PAWAN MISHRA</div>
    <div style="font-family: monospace; font-size: 9.5pt;">Roll No: 202402104</div>
    <div style="font-weight: bold; font-size: 11pt; margin-top: 10pt;">SAMARTH NIVADUNGE</div>
    <div style="font-family: monospace; font-size: 9.5pt;">Roll No: 202402111</div>
    <div style="margin-top: 8pt; font-weight: bold; color: #0f2b48;">TY BSc IT • Semester V</div>
    <div style="margin-top: 3pt; color: #475569;">Date: October 2026</div>
  </div>

  <!-- ==================== 4. ACKNOWLEDGEMENT ==================== -->
  <div class="page-break"></div>
  <div class="chapter-title">ACKNOWLEDGEMENT</div>

  <p class="no-indent" style="line-height: 1.7;">
    We express our sincere gratitude to the University of Mumbai and ZSCT's Thakur Shyamnarayan Degree College, Department of Information Technology, for providing us with the opportunity to undertake this capstone project.
  </p>

  <p class="no-indent" style="line-height: 1.7; margin-top: 8pt;">
    We are deeply thankful to our Principal, Head of the Department, and faculty members for their continuous institutional encouragement, valuable suggestions, and constructive feedback throughout the development lifecycle of MahaConnect.
  </p>

  <p class="no-indent" style="line-height: 1.7; margin-top: 8pt;">
    We express our sincere and heartfelt appreciation to our project guide, <strong>Mr. Pratharv Surve</strong>, for his invaluable mentorship, rigorous technical supervision, architectural review, and continuous encouragement across all phases of MERN stack integration, RESTful API design, database modeling, and government platform interoperability simulation.
  </p>

  <p class="no-indent" style="line-height: 1.7; margin-top: 8pt;">
    We are also grateful to our classmates, friends, family members, and everyone who directly or indirectly supported us during the planning, development, testing, documentation, and completion of this project.
  </p>

  <p class="no-indent" style="line-height: 1.7; margin-top: 8pt;">
    Finally, we express our sincere thanks to everyone who contributed to the successful completion of our capstone project, "MahaConnect: Government Platform Interoperability System."
  </p>

  <!-- ==================== 5. ABSTRACT ==================== -->
  <div class="page-break"></div>
  <div class="chapter-title">ABSTRACT</div>

  <p>
    In contemporary public administration, citizens frequently encounter severe friction when navigating public services due to deep architectural silos across government departments. Traditional e-Governance infrastructures operate as isolated, monolithic islands where citizens are subjected to redundant demographic data submissions, disparate authentication credentials, uncoordinated document verifications, and fragmented tracking mechanisms. When an individual requires interconnected public services—such as a student scholarship requiring income verification from Revenue, caste verification from Social Welfare, and academic verification from Higher Education—the absence of inter-departmental interoperability causes significant administrative delay.
  </p>
  <p>
    To address these systemic inefficiencies, this capstone project designs and implements <strong>MahaConnect</strong>—a full-stack Government Platform Interoperability System developed using the <strong>MERN stack</strong> (MongoDB, Express.js, React, Node.js) paired with Vite, Tailwind CSS, JSON Web Token (JWT) role-based authorization, and a simulated Government Interoperability Service Layer.
  </p>
  <p>
    <strong>MahaConnect</strong> demonstrates how an asynchronous, single-window citizen portal can seamlessly bridge multiple autonomous administrative departments: Revenue, Transport, Education, Municipal Corporation, Employment, Social Welfare, and Urban Development. The platform introduces:
  </p>
  <ul>
    <li><strong>Universal Single-Window Citizen Portal:</strong> Eliminates duplicate entry through unified master profile schemas and dynamic multi-step application wizards.</li>
    <li><strong>Departmental Interoperability Service Layer:</strong> Dispatches citizen filings to simulated departmental REST APIs while recording granular audit trails (HTTP methods, response latencies, source-destination routing, and payload status).</li>
    <li><strong>Department Officer Scrutiny Console:</strong> Provides department-scoped workflows, inline document verification dossiers, and real-time status transitions with processing remarks.</li>
    <li><strong>State Administrator Monitoring Cockpit:</strong> Offers centralized system oversight, dynamic service schema configuration, and live API telemetry analytics.</li>
    <li><strong>Secure RESTful API Communication:</strong> Enforces JSON Web Token bearer authentication, bcrypt password hashing with salt, Helmet security headers, rate limiting, and structured error-handling pipelines.</li>
  </ul>
  <p>
    The system is deployed on live cloud infrastructure (Vercel) backed by a MongoDB document store, with comprehensive REST API contracts validated through automated Postman test suites and browser journey testing.
  </p>

  <!-- ==================== 6. TABLE OF CONTENTS ==================== -->
  <div class="page-break"></div>
  <div class="chapter-title">TABLE OF CONTENTS</div>

  <table>
    <tr>
      <th style="width: 12%; text-align: center;">Sr. No.</th>
      <th style="width: 73%;">Content / Chapter Title</th>
      <th style="width: 15%; text-align: center;">Page No.</th>
    </tr>
    <tr><td style="text-align: center;">1</td><td>Title Page / Cover Page</td><td style="text-align: center;">i</td></tr>
    <tr><td style="text-align: center;">2</td><td>Certificate of Approval</td><td style="text-align: center;">ii</td></tr>
    <tr><td style="text-align: center;">3</td><td>Declaration</td><td style="text-align: center;">iii</td></tr>
    <tr><td style="text-align: center;">4</td><td>Acknowledgement</td><td style="text-align: center;">iv</td></tr>
    <tr><td style="text-align: center;">5</td><td>Abstract</td><td style="text-align: center;">v</td></tr>
    <tr><td style="text-align: center;">6</td><td>List of Figures</td><td style="text-align: center;">viii</td></tr>
    <tr><td style="text-align: center;">7</td><td>List of Tables</td><td style="text-align: center;">ix</td></tr>
    <tr><td style="text-align: center;"><strong>1.0</strong></td><td><strong>CHAPTER 1 – INTRODUCTION</strong></td><td style="text-align: center;"><strong>1</strong></td></tr>
    <tr><td style="text-align: center;">1.1</td><td>Project Overview</td><td style="text-align: center;">1</td></tr>
    <tr><td style="text-align: center;">1.2</td><td>Problem Statement</td><td style="text-align: center;">1</td></tr>
    <tr><td style="text-align: center;">1.3</td><td>Project Objectives</td><td style="text-align: center;">2</td></tr>
    <tr><td style="text-align: center;">1.4</td><td>Scope and Applicability</td><td style="text-align: center;">2</td></tr>
    <tr><td style="text-align: center;">1.5</td><td>Significance of the Project</td><td style="text-align: center;">2</td></tr>
    <tr><td style="text-align: center;"><strong>2.0</strong></td><td><strong>CHAPTER 2 – LITERATURE REVIEW & EXISTING SYSTEMS</strong></td><td style="text-align: center;"><strong>3</strong></td></tr>
    <tr><td style="text-align: center;">2.1</td><td>Traditional Siloed Governance Models</td><td style="text-align: center;">3</td></tr>
    <tr><td style="text-align: center;">2.2</td><td>Existing e-Governance Platforms</td><td style="text-align: center;">3</td></tr>
    <tr><td style="text-align: center;">2.3</td><td>Interoperability in Government Systems</td><td style="text-align: center;">3</td></tr>
    <tr><td style="text-align: center;">2.4</td><td>Limitations of Existing Approaches</td><td style="text-align: center;">3</td></tr>
    <tr><td style="text-align: center;">2.5</td><td>Proposed MahaConnect Approach</td><td style="text-align: center;">3</td></tr>
    <tr><td style="text-align: center;"><strong>3.0</strong></td><td><strong>CHAPTER 3 – SYSTEM ARCHITECTURE & INTEROPERABILITY MODEL</strong></td><td style="text-align: center;"><strong>4</strong></td></tr>
    <tr><td style="text-align: center;">3.1</td><td>High-Level Architectural Paradigm</td><td style="text-align: center;">4</td></tr>
    <tr><td style="text-align: center;">3.2</td><td>Gateway Interoperability Sequence Flow</td><td style="text-align: center;">5</td></tr>
    <tr><td style="text-align: center;">3.3</td><td>MERN Architecture & Layer Separation</td><td style="text-align: center;">5</td></tr>
    <tr><td style="text-align: center;">3.4</td><td>Departmental Interoperability Model</td><td style="text-align: center;">6</td></tr>
    <tr><td style="text-align: center;">3.5</td><td>Application Status Lifecycle</td><td style="text-align: center;">6</td></tr>
    <tr><td style="text-align: center;"><strong>4.0</strong></td><td><strong>CHAPTER 4 – SYSTEM REQUIREMENTS & TECHNOLOGIES USED</strong></td><td style="text-align: center;"><strong>7</strong></td></tr>
    <tr><td style="text-align: center;">4.1</td><td>Functional Requirements</td><td style="text-align: center;">7</td></tr>
    <tr><td style="text-align: center;">4.2</td><td>Non-Functional Requirements</td><td style="text-align: center;">7</td></tr>
    <tr><td style="text-align: center;">4.3</td><td>Hardware Requirements</td><td style="text-align: center;">7</td></tr>
    <tr><td style="text-align: center;">4.4</td><td>Software Requirements</td><td style="text-align: center;">7</td></tr>
    <tr><td style="text-align: center;">4.5</td><td>Technology Stack Details</td><td style="text-align: center;">7</td></tr>
    <tr><td style="text-align: center;"><strong>5.0</strong></td><td><strong>CHAPTER 5 – SYSTEM ANALYSIS & FEASIBILITY STUDY</strong></td><td style="text-align: center;"><strong>8</strong></td></tr>
    <tr><td style="text-align: center;">5.1</td><td>Technical Feasibility</td><td style="text-align: center;">8</td></tr>
    <tr><td style="text-align: center;">5.2</td><td>Operational Feasibility</td><td style="text-align: center;">8</td></tr>
    <tr><td style="text-align: center;">5.3</td><td>Economic Feasibility</td><td style="text-align: center;">8</td></tr>
    <tr><td style="text-align: center;">5.4</td><td>Security Feasibility</td><td style="text-align: center;">8</td></tr>
    <tr><td style="text-align: center;"><strong>6.0</strong></td><td><strong>CHAPTER 6 – SYSTEM DESIGN, DFD & DATABASE MODELING</strong></td><td style="text-align: center;"><strong>9</strong></td></tr>
    <tr><td style="text-align: center;">6.1</td><td>Data Flow Diagrams (DFD) Overview</td><td style="text-align: center;">9</td></tr>
    <tr><td style="text-align: center;">6.2</td><td>DFD Level 0 – Context Diagram</td><td style="text-align: center;">9</td></tr>
    <tr><td style="text-align: center;">6.3</td><td>DFD Level 1 – Functional Decomposition</td><td style="text-align: center;">10</td></tr>
    <tr><td style="text-align: center;">6.4</td><td>Entity Relationship / Database Model</td><td style="text-align: center;">10</td></tr>
    <tr><td style="text-align: center;">6.5</td><td>Database Collections Schema</td><td style="text-align: center;">11</td></tr>
    <tr><td style="text-align: center;">6.6</td><td>Data Dictionary</td><td style="text-align: center;">11</td></tr>
    <tr><td style="text-align: center;"><strong>7.0</strong></td><td><strong>CHAPTER 7 – FULL-STACK IMPLEMENTATION DETAILS</strong></td><td style="text-align: center;"><strong>12</strong></td></tr>
    <tr><td style="text-align: center;">7.1</td><td>Frontend Architecture & Component Tree</td><td style="text-align: center;">12</td></tr>
    <tr><td style="text-align: center;">7.2</td><td>Backend Architecture & Routing Pipeline</td><td style="text-align: center;">12</td></tr>
    <tr><td style="text-align: center;">7.3</td><td>REST API Implementation</td><td style="text-align: center;">12</td></tr>
    <tr><td style="text-align: center;">7.4</td><td>Complete Application Workflow</td><td style="text-align: center;">12</td></tr>
    <tr><td style="text-align: center;"><strong>8.0</strong></td><td><strong>CHAPTER 8 – SECURITY, CRYPTOGRAPHY & ACCESS CONTROL</strong></td><td style="text-align: center;"><strong>13</strong></td></tr>
    <tr><td style="text-align: center;">8.1</td><td>Password Hashing with bcrypt</td><td style="text-align: center;">13</td></tr>
    <tr><td style="text-align: center;">8.2</td><td>JWT Authentication & Bearer Token Verification</td><td style="text-align: center;">13</td></tr>
    <tr><td style="text-align: center;">8.3</td><td>Role-Based Access Control (RBAC)</td><td style="text-align: center;">13</td></tr>
    <tr><td style="text-align: center;">8.4</td><td>Security Middleware: Helmet, CORS & Rate Limiting</td><td style="text-align: center;">13</td></tr>
    <tr><td style="text-align: center;">8.5</td><td>Audit Logging & Telemetry Recording</td><td style="text-align: center;">13</td></tr>
    <tr><td style="text-align: center;"><strong>9.0</strong></td><td><strong>CHAPTER 9 – TESTING & VALIDATION</strong></td><td style="text-align: center;"><strong>14</strong></td></tr>
    <tr><td style="text-align: center;">9.1</td><td>Testing Strategy & Methodology</td><td style="text-align: center;">14</td></tr>
    <tr><td style="text-align: center;">9.2</td><td>Functional & Frontend Validation Testing</td><td style="text-align: center;">14</td></tr>
    <tr><td style="text-align: center;">9.3</td><td>API Testing using Postman Suite</td><td style="text-align: center;">14</td></tr>
    <tr><td style="text-align: center;">9.4</td><td>Test Cases and Results Table</td><td style="text-align: center;">14</td></tr>
    <tr><td style="text-align: center;">9.5</td><td>Production Deployment Verification</td><td style="text-align: center;">14</td></tr>
    <tr><td style="text-align: center;"><strong>10.0</strong></td><td><strong>CHAPTER 10 – RESULTS, CONCLUSION & FUTURE SCOPE</strong></td><td style="text-align: center;"><strong>15</strong></td></tr>
    <tr><td style="text-align: center;">10.1</td><td>Results</td><td style="text-align: center;">15</td></tr>
    <tr><td style="text-align: center;">10.2</td><td>Conclusion</td><td style="text-align: center;">15</td></tr>
    <tr><td style="text-align: center;">10.3</td><td>Learning Outcomes</td><td style="text-align: center;">15</td></tr>
    <tr><td style="text-align: center;">10.4</td><td>Limitations</td><td style="text-align: center;">15</td></tr>
    <tr><td style="text-align: center;">10.5</td><td>Future Scope</td><td style="text-align: center;">15</td></tr>
    <tr><td style="text-align: center;"><strong>11.0</strong></td><td><strong>PROJECT SCREENSHOTS & IMPLEMENTATION PHOTOS</strong></td><td style="text-align: center;"><strong>16</strong></td></tr>
    <tr><td style="text-align: center;"><strong>12.0</strong></td><td><strong>PROJECT DETAILS PAGE</strong></td><td style="text-align: center;"><strong>27</strong></td></tr>
    <tr><td style="text-align: center;"><strong>13.0</strong></td><td><strong>REFERENCES / BIBLIOGRAPHY</strong></td><td style="text-align: center;"><strong>28</strong></td></tr>
  </table>

  <!-- ==================== 7. LIST OF FIGURES ==================== -->
  <div class="page-break"></div>
  <div class="chapter-title">LIST OF FIGURES</div>

  <table>
    <tr>
      <th style="width: 18%; text-align: center;">Figure No.</th>
      <th style="width: 67%;">Figure Title</th>
      <th style="width: 15%; text-align: center;">Page No.</th>
    </tr>
    <tr><td style="text-align: center;">Figure 1</td><td>MahaConnect System Architecture Diagram</td><td style="text-align: center;">4</td></tr>
    <tr><td style="text-align: center;">Figure 2</td><td>Gateway Interoperability Sequence Flow</td><td style="text-align: center;">5</td></tr>
    <tr><td style="text-align: center;">Figure 3</td><td>Data Flow Diagram (DFD Level 0 – Context Diagram)</td><td style="text-align: center;">9</td></tr>
    <tr><td style="text-align: center;">Figure 4</td><td>Data Flow Diagram (DFD Level 1 – Functional Decomposition)</td><td style="text-align: center;">10</td></tr>
    <tr><td style="text-align: center;">Figure 5</td><td>Database Entity-Relationship (ER) Model</td><td style="text-align: center;">10</td></tr>
    <tr><td style="text-align: center;">Figure 6</td><td>MahaConnect Public Landing Page & Citizen Gateway</td><td style="text-align: center;">16</td></tr>
    <tr><td style="text-align: center;">Figure 7</td><td>Unified Authentication Portal with Seeded Demo Credentials</td><td style="text-align: center;">16</td></tr>
    <tr><td style="text-align: center;">Figure 8</td><td>Citizen Self-Service Dashboard with Metric Cards & Quick Navigation</td><td style="text-align: center;">17</td></tr>
    <tr><td style="text-align: center;">Figure 9</td><td>Cross-Departmental Government Services Directory with Filtering</td><td style="text-align: center;">17</td></tr>
    <tr><td style="text-align: center;">Figure 10</td><td>Dynamic Application Form Wizard: Step 1 (Personal Demographics)</td><td style="text-align: center;">18</td></tr>
    <tr><td style="text-align: center;">Figure 11</td><td>Client-Side Form Validation Alert & Error Prevention</td><td style="text-align: center;">18</td></tr>
    <tr><td style="text-align: center;">Figure 12</td><td>Document Upload & Multi-Format Verification</td><td style="text-align: center;">19</td></tr>
    <tr><td style="text-align: center;">Figure 13</td><td>Application Submission Confirmation & Unique Reference Generation</td><td style="text-align: center;">19</td></tr>
    <tr><td style="text-align: center;">Figure 14</td><td>Live Citizen Tracking Timeline with Multi-Stage Progression</td><td style="text-align: center;">20</td></tr>
    <tr><td style="text-align: center;">Figure 15</td><td>Department Officer Scrutiny Console & Pending Application Queue</td><td style="text-align: center;">20</td></tr>
    <tr><td style="text-align: center;">Figure 16</td><td>Officer Application Scrutiny Dossier with Inline Document Viewer</td><td style="text-align: center;">21</td></tr>
    <tr><td style="text-align: center;">Figure 17</td><td>Officer Status Transition Pipeline & Remarks Endorsement</td><td style="text-align: center;">21</td></tr>
    <tr><td style="text-align: center;">Figure 18</td><td>State Administrator Governance Dashboard & Interoperability KPIs</td><td style="text-align: center;">22</td></tr>
    <tr><td style="text-align: center;">Figure 19</td><td>State Department Management Console & Endpoint Configuration</td><td style="text-align: center;">22</td></tr>
    <tr><td style="text-align: center;">Figure 20</td><td>Service Schema Configuration & Dynamic Field Definition</td><td style="text-align: center;">23</td></tr>
    <tr><td style="text-align: center;">Figure 21</td><td>REST API Interoperability Gateway Logs & Modal Payload Inspector</td><td style="text-align: center;">23</td></tr>
    <tr><td style="text-align: center;">Figure 22</td><td>Postman Test Suite: GET /api/departments (Status 200 OK)</td><td style="text-align: center;">24</td></tr>
    <tr><td style="text-align: center;">Figure 23</td><td>Postman Test Suite: POST /api/auth/login (JWT Token Generation)</td><td style="text-align: center;">24</td></tr>
    <tr><td style="text-align: center;">Figure 24</td><td>Postman Test Suite: PATCH /api/applications/:id/status</td><td style="text-align: center;">25</td></tr>
    <tr><td style="text-align: center;">Figure 25</td><td>Postman Test Suite: DELETE /api/departments/:id (Integrity Check)</td><td style="text-align: center;">25</td></tr>
    <tr><td style="text-align: center;">Figure 26</td><td>MongoDB Shell (mongosh) Collection & Query Ledger Inspection</td><td style="text-align: center;">26</td></tr>
    <tr><td style="text-align: center;">Figure 27</td><td>MahaConnect Final Working Multi-Portal Application Showcase</td><td style="text-align: center;">26</td></tr>
  </table>

  <!-- ==================== 8. LIST OF TABLES ==================== -->
  <div class="page-break"></div>
  <div class="chapter-title">LIST OF TABLES</div>

  <table>
    <tr>
      <th style="width: 18%; text-align: center;">Table No.</th>
      <th style="width: 67%;">Table Title</th>
      <th style="width: 15%; text-align: center;">Page No.</th>
    </tr>
    <tr><td style="text-align: center;">Table 1</td><td>Comparative Analysis of Existing Systems vs. MahaConnect</td><td style="text-align: center;">3</td></tr>
    <tr><td style="text-align: center;">Table 2</td><td>User Roles and Permission Scopes</td><td style="text-align: center;">5</td></tr>
    <tr><td style="text-align: center;">Table 3</td><td>Simulated Government Departments in MahaConnect</td><td style="text-align: center;">6</td></tr>
    <tr><td style="text-align: center;">Table 4</td><td>Application Status Lifecycle States</td><td style="text-align: center;">6</td></tr>
    <tr><td style="text-align: center;">Table 5</td><td>Hardware Requirements Specification</td><td style="text-align: center;">7</td></tr>
    <tr><td style="text-align: center;">Table 6</td><td>Software Requirements Specification</td><td style="text-align: center;">7</td></tr>
    <tr><td style="text-align: center;">Table 7</td><td>Database Collections & Schema Constraints</td><td style="text-align: center;">11</td></tr>
    <tr><td style="text-align: center;">Table 8</td><td>Core REST API Endpoints Specification</td><td style="text-align: center;">12</td></tr>
    <tr><td style="text-align: center;">Table 9</td><td>Role-Based Access Control (RBAC) Permission Matrix</td><td style="text-align: center;">13</td></tr>
    <tr><td style="text-align: center;">Table 10</td><td>Automated Postman Test Case Execution Matrix</td><td style="text-align: center;">14</td></tr>
  </table>

  <!-- ==================== CHAPTER 1 – INTRODUCTION ==================== -->
  <div class="page-break"></div>
  <div class="chapter-title">CHAPTER 1 – INTRODUCTION</div>

  <h2>1.1 Project Overview</h2>
  <p>
    In modern state administration, electronic governance (e-Governance) represents the primary conduit through which government entities interact with the public. Historically, state departments developed digital systems in isolation to automate their internal departmental tasks. Consequently, individual entities—such as the Transport Department, the Revenue Department, the Department of School and Higher Education, Municipal Corporations, and the Department of Social Welfare—operate separate platforms with distinct databases, differing authentication protocols, and non-communicating network interfaces.
  </p>
  <p>
    <strong>MahaConnect</strong> is conceptualized and engineered to address this fragmentation. Designed as a full-stack e-Governance platform built on the modern <strong>MERN stack</strong> (MongoDB, Express.js, React, Node.js), MahaConnect serves as a unified digital bridge connecting citizens and government departments. The platform facilitates single-sign-on (SSO) authenticated access, cross-departmental service browsing, dynamic multi-step application filing, document archiving, transparent real-time tracking, and automated inter-departmental API routing.
  </p>

  <h2>1.2 Problem Statement</h2>
  <p>
    The primary challenge addressed by MahaConnect is the presence of functional information silos in public administration. When a citizen requires a set of related government services (for example, applying for a college scholarship which requires an Income Certificate from Revenue, a Caste Certificate from Social Welfare, and an Enrollment Verification from Higher Education), the citizen is compelled to:
  </p>
  <ul>
    <li>Create and maintain separate login credentials across multiple departmental websites.</li>
    <li>Repeatedly enter identical demographic data (Full Name, Date of Birth, Aadhaar number, Residential Address, Mobile Number).</li>
    <li>Physically upload identical identity documents to separate departmental servers, multiplying storage overhead and bandwidth consumption.</li>
    <li>Manually visit disjointed tracking portals with separate application numbers, leaving citizens without unified visibility over pending state matters.</li>
  </ul>

  <h2>1.3 Project Objectives</h2>
  <p>The primary engineering and operational objectives of MahaConnect include:</p>
  <ol>
    <li><strong>Single-Window Citizen Portal:</strong> Develop a unified, responsive React-based interface allowing citizens to access state services through a single authenticated session.</li>
    <li><strong>Microservices & Gateway Interoperability:</strong> Implement an API Gateway architecture using Node.js and Express.js middleware that acts as an intelligent intermediary, translating unified citizen requests into department-specific schemas.</li>
    <li><strong>Dynamic Multi-Step Form Engine:</strong> Construct a schema-driven form wizard that dynamically renders inputs based on the target service's JSON parameter specification.</li>
    <li><strong>Cross-Departmental Document Abstraction:</strong> Provide a standardized document upload and verification pipeline supporting multi-format attachments with validation.</li>
    <li><strong>Transparent Real-Time Status Tracking:</strong> Render interactive visual milestone timelines depicting every lifecycle state from initial submission to final officer disposition.</li>
    <li><strong>Role-Based Access Control (RBAC):</strong> Enforce cryptographically secured authorization separating Citizens, Department Officers, and State Administrators.</li>
    <li><strong>Audit Telemetry & Gateway Ledger:</strong> Maintain a MongoDB audit log recording every API transaction, source-destination routing path, HTTP status code, and latency metrics.</li>
  </ol>

  <h2>1.4 Scope and Applicability</h2>
  <p>
    The scope of this project encompasses the lifecycle of simulated government service delivery within a state ecosystem. It models seven core government departments: Revenue, Transport, Education, Municipal Corporation, Employment, Social Welfare, and Urban Development. As an academic capstone implementation for TY BSc IT Semester V, downstream departmental APIs are simulated through a dedicated service layer, while the RESTful contracts, payload schemas, security tokens, and routing controllers are designed to reflect real-world architectural principles.
  </p>

  <h2>1.5 Significance of the Project</h2>
  <p>
    The MahaConnect project demonstrates how modern web technologies can mitigate procedural overhead in public administration. By decoupling the citizen interface from departmental backend peculiarities through an API Gateway, the system proves that digital interoperability can be attained without necessitating disruptive replacements of existing departmental infrastructure.
  </p>

  <!-- ==================== CHAPTER 2 – LITERATURE REVIEW ==================== -->
  <div class="page-break"></div>
  <div class="chapter-title">CHAPTER 2 – LITERATURE REVIEW & EXISTING SYSTEMS</div>

  <h2>2.1 Traditional Siloed Governance Models</h2>
  <p>
    Early e-Governance initiatives focused on digitizing individual departmental workflows in isolation. While this computerization replaced paper registers, it created digital silos. Research into public sector software architectures indicates that siloed systems suffer from data redundancy, inconsistent state records, repetitive administrative workloads, and difficulty in cross-verifying applicant eligibility across department boundaries.
  </p>

  <h2>2.2 Existing e-Governance Platforms</h2>
  <p>
    Various state and national portals currently provide digital citizen services. In India, platforms such as DigiLocker, UMANG, and state-level portals (e.g., Aaple Sarkar) have made substantial progress toward service aggregation. However, many existing state portals still rely on redirected web links to separate legacy departmental engines, meaning the user experience remains non-uniform and data entry is still frequently duplicated across forms.
  </p>

  <h2>2.3 Interoperability in Government Systems</h2>
  <p>
    Interoperability in distributed software systems refers to the capability of heterogeneous systems to exchange data according to standard formats and protocols. The Ministry of Electronics and Information Technology (MeitY) published the <em>e-Governance Interoperability Framework for India (e-GIF)</em>, emphasizing open standards, JSON/REST data exchange, metadata directories, and service-oriented architectures. MahaConnect adopts these foundational principles by establishing an API Gateway that abstracts departmental protocols behind unified REST interfaces.
  </p>

  <h2>2.4 Limitations of Existing Approaches</h2>
  <p>
    A critical analysis of current implementations reveals the following limitations:
  </p>
  <ul>
    <li><strong>Non-standardized Payloads:</strong> Each departmental portal requires custom parameter formats, preventing automated validation.</li>
    <li><strong>Fragmented Status Tracking:</strong> Applicants receive distinct tracking identifiers per department with no centralized timeline.</li>
    <li><strong>Lack of Real-Time API Telemetry:</strong> System administrators have limited visibility into cross-departmental communication bottlenecks or error rates.</li>
  </ul>

  <h2>2.5 Proposed MahaConnect Approach</h2>
  <p>
    MahaConnect introduces an intelligent API Gateway layer that unifies citizen identity, dynamically compiles application schemas, coordinates simulated departmental microservices, and maintains an immutable audit ledger of all inter-departmental transactions.
  </p>

  <div class="table-caption">Table 1: Comparative Analysis of Existing Systems vs. MahaConnect</div>
  <table>
    <tr>
      <th>Dimension</th>
      <th>Legacy Department Portals</th>
      <th>Centralized Monoliths</th>
      <th>MahaConnect System</th>
    </tr>
    <tr>
      <td><strong>Architecture</strong></td>
      <td>Isolated Siloed Servers</td>
      <td>Monolithic Relational DB</td>
      <td>Modern MERN Gateway Model</td>
    </tr>
    <tr>
      <td><strong>User Experience</strong></td>
      <td>Multiple Logins & Portals</td>
      <td>Rigid Single Interface</td>
      <td>Responsive React SPA + Tailwind CSS</td>
    </tr>
    <tr>
      <td><strong>Interoperability</strong></td>
      <td>None (Paper Bridge)</td>
      <td>Database Stored Procedures</td>
      <td>RESTful Interoperability Gateway</td>
    </tr>
    <tr>
      <td><strong>Schema Flexibility</strong></td>
      <td>Hardcoded Database Tables</td>
      <td>Static Database Schemas</td>
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
      <td>Dedicated Local Servers</td>
      <td>Central Government Data Center</td>
      <td>Cloud Serverless (Vercel) + MongoDB</td>
    </tr>
  </table>

  <!-- ==================== CHAPTER 3 – SYSTEM ARCHITECTURE ==================== -->
  <div class="page-break"></div>
  <div class="chapter-title">CHAPTER 3 – SYSTEM ARCHITECTURE & INTEROPERABILITY MODEL</div>

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

  <div class="figure-box">
    <img src="${imgArch}" class="figure-img" alt="System Architecture">
    <div class="figure-caption">Figure 1: MahaConnect System Architecture Diagram</div>
    <div class="figure-desc">Multi-tier architectural diagram depicting the Presentation Tier, Express API Gateway, Simulated Interoperability Service Layer, and MongoDB Document Store.</div>
  </div>

  <h2>3.2 Gateway Interoperability Sequence Flow</h2>
  <p>
    When a citizen submits an application, the request transitions through a standardized eight-step gateway sequence:
  </p>

  <div class="figure-box">
    <img src="${imgSeq}" class="figure-img" alt="Gateway Sequence Flow">
    <div class="figure-caption">Figure 2: Gateway Interoperability Sequence Flow</div>
    <div class="figure-desc">Eight-step execution flow from initial citizen submission to payload validation, departmental dispatch, MongoDB persistence, audit telemetry logging, and response delivery.</div>
  </div>

  <h2>3.3 MERN Architecture & Layer Separation</h2>
  <p>
    The MERN technology stack provides a cohesive JavaScript/JSON runtime across both client and server tiers:
  </p>
  <ul>
    <li><strong>React.js (Frontend):</strong> Handles stateful UI components, form step wizards, route transitions, and asynchronous API calls via Axios.</li>
    <li><strong>Express.js & Node.js (Gateway & Backend):</strong> Implements REST API routes, JWT security verification, input sanitization, and departmental routing logic.</li>
    <li><strong>MongoDB & Mongoose (Persistence):</strong> Stores semi-structured citizen records, dynamic form parameters, documents, and telemetry logs in BSON format.</li>
  </ul>

  <div class="table-caption">Table 2: User Roles and Permission Scopes</div>
  <table>
    <tr>
      <th>User Role</th>
      <th>Primary Capabilities</th>
      <th>Access Scope</th>
    </tr>
    <tr>
      <td><strong>Citizen</strong></td>
      <td>Profile management, service browsing, application filing, document uploads, real-time status tracking</td>
      <td>Personal profile and owned application records</td>
    </tr>
    <tr>
      <td><strong>Department Officer</strong></td>
      <td>Application scrutiny, document verification, approval/rejection, formal remarks logging</td>
      <td>Applications scoped to assigned department</td>
    </tr>
    <tr>
      <td><strong>State Administrator</strong></td>
      <td>Department provisioning, service catalog configuration, user management, telemetry monitoring</td>
      <td>System-wide administrative authority</td>
    </tr>
  </table>

  <h2>3.4 Departmental Interoperability Model</h2>
  <p>
    To demonstrate real-world interoperability, MahaConnect models seven core state administrative departments:
  </p>

  <div class="table-caption">Table 3: Simulated Government Departments in MahaConnect</div>
  <table>
    <tr>
      <th>Department Name</th>
      <th>Code</th>
      <th>Representative Services</th>
      <th>Simulated Gateway Endpoint</th>
    </tr>
    <tr><td>Revenue Department</td><td>REV</td><td>Income Certificate, Caste Certificate</td><td>/api/v1/revenue/inbound</td></tr>
    <tr><td>Transport Department (RTO)</td><td>TRP</td><td>New Driving Licence, Licence Renewal</td><td>/api/v1/transport/inbound</td></tr>
    <tr><td>Education Department</td><td>EDU</td><td>Higher Education Scholarship, Bonafide</td><td>/api/v1/education/inbound</td></tr>
    <tr><td>Municipal Corporation</td><td>MUN</td><td>Birth Certificate, Property Tax Assessment</td><td>/api/v1/municipal/inbound</td></tr>
    <tr><td>Employment Department</td><td>EMP</td><td>Employment Registration, Skill Portal</td><td>/api/v1/employment/inbound</td></tr>
    <tr><td>Social Welfare</td><td>SOC</td><td>Disability Pension, Senior Citizen Card</td><td>/api/v1/social/inbound</td></tr>
    <tr><td>Urban Development</td><td>URB</td><td>Zoning Verification, Water Connection</td><td>/api/v1/urban/inbound</td></tr>
  </table>

  <h2>3.5 Application Status Lifecycle</h2>
  <div class="table-caption">Table 4: Application Status Lifecycle States</div>
  <table>
    <tr>
      <th>Status State</th>
      <th>Trigger Event</th>
      <th>Responsible Actor</th>
      <th>Citizen Notification</th>
    </tr>
    <tr><td><strong>Draft</strong></td><td>Citizen starts application form</td><td>Citizen</td><td>None (Local draft)</td></tr>
    <tr><td><strong>Submitted</strong></td><td>Citizen confirms and submits</td><td>Gateway Dispatcher</td><td>Submission Confirmation</td></tr>
    <tr><td><strong>Under Review</strong></td><td>Officer opens application dossier</td><td>Department Officer</td><td>Review in progress</td></tr>
    <tr><td><strong>Info Required</strong></td><td>Officer requests document clarification</td><td>Department Officer</td><td>Action required alert</td></tr>
    <tr><td><strong>Approved</strong></td><td>Officer validates proofs and signs off</td><td>Department Officer</td><td>Approval certificate alert</td></tr>
    <tr><td><strong>Rejected</strong></td><td>Officer detects discrepancy with remarks</td><td>Department Officer</td><td>Rejection reason alert</td></tr>
    <tr><td><strong>Completed</strong></td><td>Final service delivery executed</td><td>Gateway / Officer</td><td>Completion confirmation</td></tr>
  </table>

  <!-- ==================== CHAPTER 4 – SYSTEM REQUIREMENTS ==================== -->
  <div class="page-break"></div>
  <div class="chapter-title">CHAPTER 4 – SYSTEM REQUIREMENTS & TECHNOLOGIES USED</div>

  <div style="font-size: 9.8pt; line-height: 1.38;">
  <h2 style="margin-top: 6pt; margin-bottom: 3pt;">4.1 Functional Requirements</h2>
  <ol style="margin-bottom: 4pt;">
    <li><strong>User Authentication:</strong> Secure registration and login using JWT tokens and bcrypt password hashing.</li>
    <li><strong>Role-Based Routing:</strong> Restrict portal routes based on verified user roles (Citizen, Officer, Admin).</li>
    <li><strong>Service Browsing & Filtering:</strong> Categorized directory of government services with search and department filtering.</li>
    <li><strong>Dynamic Multi-Step Form Submission:</strong> Step-by-step form capturing personal demographics, service-specific fields, and file uploads.</li>
    <li><strong>Real-Time Application Tracking:</strong> Visual milestone tracker illustrating chronological status updates and officer remarks.</li>
    <li><strong>Department Scrutiny Workflow:</strong> Interface for officers to inspect applicant records, view uploaded files, and update status.</li>
    <li><strong>Centralized Administration:</strong> Manage departments, configure services, and inspect API telemetry logs.</li>
  </ol>

  <h2 style="margin-top: 6pt; margin-bottom: 3pt;">4.2 Non-Functional Requirements</h2>
  <ol style="margin-bottom: 4pt;">
    <li><strong>Usability:</strong> Responsive design supporting desktop, tablet, and mobile viewports via Tailwind CSS.</li>
    <li><strong>Performance:</strong> Sub-100ms API response latency for cached lookups and sub-200ms for application writes.</li>
    <li><strong>Security:</strong> Stateless JWT verification, input sanitization, HTTP security headers (Helmet), and CORS enforcement.</li>
    <li><strong>Reliability:</strong> Centralized error-handling middleware preventing server crashes during malformed requests.</li>
    <li><strong>Maintainability:</strong> Modular codebase separating controllers, routes, middleware, and database models.</li>
  </ol>

  <h2 style="margin-top: 6pt; margin-bottom: 2pt;">4.3 Hardware Requirements</h2>
  <div class="table-caption">Table 5: Hardware Requirements Specification</div>
  <table style="margin: 2pt 0 4pt 0; font-size: 7.8pt;">
    <tr>
      <th style="padding: 2pt 4pt;">Component</th>
      <th style="padding: 2pt 4pt;">Minimum Development Specification</th>
      <th style="padding: 2pt 4pt;">Recommended Specification</th>
    </tr>
    <tr><td style="padding: 1.5pt 4pt;">Processor</td><td style="padding: 1.5pt 4pt;">Intel Core i3 / AMD Ryzen 3 @ 2.0 GHz</td><td style="padding: 1.5pt 4pt;">Intel Core i5 / Apple Silicon M-series</td></tr>
    <tr><td style="padding: 1.5pt 4pt;">Memory (RAM)</td><td style="padding: 1.5pt 4pt;">4 GB DDR4</td><td style="padding: 1.5pt 4pt;">8 GB – 16 GB DDR4/Unified</td></tr>
    <tr><td style="padding: 1.5pt 4pt;">Storage</td><td style="padding: 1.5pt 4pt;">20 GB available SSD space</td><td style="padding: 1.5pt 4pt;">50 GB+ NVMe SSD space</td></tr>
    <tr><td style="padding: 1.5pt 4pt;">Network</td><td style="padding: 1.5pt 4pt;">Active Internet Connection (2 Mbps)</td><td style="padding: 1.5pt 4pt;">Broadband Connection (10 Mbps+)</td></tr>
    <tr><td style="padding: 1.5pt 4pt;">Display</td><td style="padding: 1.5pt 4pt;">1366 × 768 resolution</td><td style="padding: 1.5pt 4pt;">1920 × 1080 Full HD resolution</td></tr>
  </table>

  <h2 style="margin-top: 6pt; margin-bottom: 2pt;">4.4 Software Requirements</h2>
  <div class="table-caption">Table 6: Software Requirements Specification</div>
  <table style="margin: 2pt 0 4pt 0; font-size: 7.8pt;">
    <tr>
      <th style="padding: 2pt 4pt;">Software / Tool</th>
      <th style="padding: 2pt 4pt;">Version / Environment</th>
      <th style="padding: 2pt 4pt;">Purpose</th>
    </tr>
    <tr><td style="padding: 1.5pt 4pt;">Operating System</td><td style="padding: 1.5pt 4pt;">macOS Sequoia / Ubuntu 22.04 / Windows 11</td><td style="padding: 1.5pt 4pt;">Host Development Operating System</td></tr>
    <tr><td style="padding: 1.5pt 4pt;">Runtime Environment</td><td style="padding: 1.5pt 4pt;">Node.js v20+ LTS / v24.6</td><td style="padding: 1.5pt 4pt;">JavaScript Server Execution Runtime</td></tr>
    <tr><td style="padding: 1.5pt 4pt;">Database Engine</td><td style="padding: 1.5pt 4pt;">MongoDB Community v7.0 / Atlas</td><td style="padding: 1.5pt 4pt;">NoSQL Document Database Engine</td></tr>
    <tr><td style="padding: 1.5pt 4pt;">Package Manager</td><td style="padding: 1.5pt 4pt;">npm v10+</td><td style="padding: 1.5pt 4pt;">Dependency Management Tool</td></tr>
    <tr><td style="padding: 1.5pt 4pt;">API Testing Tool</td><td style="padding: 1.5pt 4pt;">Postman Desktop v11</td><td style="padding: 1.5pt 4pt;">REST API Functional Contract Verification</td></tr>
    <tr><td style="padding: 1.5pt 4pt;">Browser Engine</td><td style="padding: 1.5pt 4pt;">Google Chrome / Chromium</td><td style="padding: 1.5pt 4pt;">Client Rendering & Puppeteer Automation</td></tr>
    <tr><td style="padding: 1.5pt 4pt;">Version Control</td><td style="padding: 1.5pt 4pt;">Git v2.40+ & GitHub</td><td style="padding: 1.5pt 4pt;">Source Code Management</td></tr>
    <tr><td style="padding: 1.5pt 4pt;">Hosting Platform</td><td style="padding: 1.5pt 4pt;">Vercel Serverless Edge Platform</td><td style="padding: 1.5pt 4pt;">Cloud Production Deployment</td></tr>
  </table>

  <h2 style="margin-top: 6pt; margin-bottom: 2pt;">4.5 Technology Stack Details</h2>
  <ul style="margin-bottom: 0;">
    <li><strong>Frontend:</strong> React 18, Vite 6, Tailwind CSS 3.4, React Router v6, Axios, Lucide React icons.</li>
    <li><strong>Backend:</strong> Node.js, Express.js 4.21, Helmet, Express-Rate-Limit, CORS, Morgan logging.</li>
    <li><strong>Database:</strong> MongoDB Community, Mongoose ODM 8.9 with strict schemas.</li>
    <li><strong>Authentication:</strong> jsonwebtoken (JWT 9.0) with HMAC-SHA256 signing, bcryptjs 3.0.</li>
  </ul>
  </div>

  <!-- ==================== CHAPTER 5 – SYSTEM ANALYSIS ==================== -->
  <div class="page-break"></div>
  <div class="chapter-title">CHAPTER 5 – SYSTEM ANALYSIS & FEASIBILITY STUDY</div>

  <h2>5.1 Technical Feasibility</h2>
  <p>
    The technical feasibility of MahaConnect is established through the utilization of proven web technologies within the MERN ecosystem. Node.js provides non-blocking, asynchronous I/O capabilities well-suited for an API Gateway coordinating multiple concurrent requests. MongoDB's JSON-native BSON document format naturally accommodates the varied schemas required by diverse government services without requiring schema redesigns. React's component state model enables responsive multi-step form navigation and dynamic validation.
  </p>

  <h2>5.2 Operational Feasibility</h2>
  <p>
    The platform reduces operational friction for citizens and officers. Citizens access services through a clean, intuitive interface without requiring specialized training. Department officers work within dedicated scrutiny queues scoped to their department, streamlining review workflows. Administrators gain system visibility through telemetry log tables and operational charts.
  </p>

  <h2>5.3 Economic Feasibility</h2>
  <p>
    Utilizing open-source technologies (React, Node.js, Express, MongoDB Community) eliminates expensive proprietary software license fees. Deploying through modern serverless platforms like Vercel aligns resource utilization directly with application traffic, keeping hosting and maintenance costs modest for academic and organizational use cases.
  </p>

  <h2>5.4 Security Feasibility</h2>
  <p>
    Security is maintained through stateless JSON Web Tokens (JWT) signed with HMAC-SHA256, salted bcrypt password hashing (10 rounds), HTTP header hardening via Helmet, Cross-Origin Resource Sharing (CORS) whitelisting, rate limiting against brute-force attempts, and input sanitization before database insertion.
  </p>

  <!-- ==================== CHAPTER 6 – SYSTEM DESIGN ==================== -->
  <div class="page-break"></div>
  <div class="chapter-title">CHAPTER 6 – SYSTEM DESIGN, DFD & DATABASE MODELING</div>

  <h2>6.1 Data Flow Diagrams (DFD) Overview</h2>
  <p>
    Data Flow Diagrams visually represent the boundaries, external entities, functional processes, and internal data stores of the MahaConnect system.
  </p>

  <h2>6.2 DFD Level 0 – Context Diagram</h2>
  <p>
    The Context Diagram represents MahaConnect as a single central system interacting with four external entities: Citizens, Department Officers, State Administrators, and Simulated Department REST Microservices.
  </p>

  <div class="figure-box">
    <img src="${imgDfd0}" class="figure-img" alt="DFD Level 0">
    <div class="figure-caption">Figure 3: Data Flow Diagram (DFD Level 0 – Context Diagram)</div>
    <div class="figure-desc">Context diagram illustrating external data exchanges between Citizen, Officer, Administrator, and Simulated Department APIs with MahaConnect.</div>
  </div>

  <h2>6.3 DFD Level 1 – Functional Decomposition</h2>
  <p>
    The Level 1 DFD decomposes the system into four major operational sub-processes:
  </p>
  <ul>
    <li><strong>Process 1.0 (Identity & Session Management):</strong> Authenticates credentials and issues JWT tokens.</li>
    <li><strong>Process 2.0 (Service Directory Catalog):</strong> Serves categorized departmental offerings and dynamic parameter requirements.</li>
    <li><strong>Process 3.0 (Application Gateway Dispatch):</strong> Ingests multi-step citizen inputs, uploads supporting files, dispatches to departmental gateways, and registers tracking records.</li>
    <li><strong>Process 4.0 (Scrutiny, Status Transition & Audit Logging):</strong> Processes officer remarks, updates application states, and writes immutable telemetry records.</li>
  </ul>

  <div class="figure-box">
    <img src="${imgDfd1}" class="figure-img" alt="DFD Level 1">
    <div class="figure-caption">Figure 4: Data Flow Diagram (DFD Level 1 – Functional Decomposition)</div>
    <div class="figure-desc">Decomposition diagram showing four core processes and data stores (D1: Users, D2: Departments/Services, D3: Applications, D4: ApiLogs).</div>
  </div>

  <h2>6.4 Entity Relationship / Database Model</h2>
  <p>
    The database architecture employs Mongoose models enforcing relational references between users, departments, services, applications, and telemetry logs while leveraging embedded documents for application audit timelines.
  </p>

  <div class="figure-box">
    <img src="${imgEr}" class="figure-img" alt="Database ER Diagram">
    <div class="figure-caption">Figure 5: Database Entity-Relationship (ER) Model</div>
    <div class="figure-desc">Entity-relationship diagram illustrating the schemas for User, Department, Service, Application, ApiLog, and Notification collections.</div>
  </div>

  <h2>6.5 Database Collections Schema</h2>
  <div class="table-caption">Table 7: Database Collections & Schema Constraints</div>
  <table>
    <tr>
      <th>Collection</th>
      <th>Key Attributes</th>
      <th>Data Types & Constraints</th>
    </tr>
    <tr>
      <td><strong>users</strong></td>
      <td>_id, name, email, password, role, department, mobile, address</td>
      <td>email (String, Unique, Index), password (String, Hashed), role (Enum: 'citizen','officer','admin')</td>
    </tr>
    <tr>
      <td><strong>departments</strong></td>
      <td>_id, name, code, description, contactEmail, isOperational</td>
      <td>code (String, Unique: REV, TRP), isOperational (Boolean, Default: true)</td>
    </tr>
    <tr>
      <td><strong>services</strong></td>
      <td>_id, department, name, description, requiredDocuments, fees, dynamicFields</td>
      <td>department (ObjectId, ref: Department), dynamicFields (Array of schema field objects)</td>
    </tr>
    <tr>
      <td><strong>applications</strong></td>
      <td>_id, applicationId, citizen, service, department, status, formData, documents, timeline</td>
      <td>applicationId (String, Unique: MC-2026-X), status (Enum), timeline (Array of status change objects)</td>
    </tr>
    <tr>
      <td><strong>apilogs</strong></td>
      <td>_id, timestamp, source, destination, endpoint, method, statusCode, responseTimeMs</td>
      <td>timestamp (Date, Index), statusCode (Number), responseTimeMs (Number)</td>
    </tr>
    <tr>
      <td><strong>notifications</strong></td>
      <td>_id, recipient, title, message, type, read, relatedApplicationId</td>
      <td>recipient (ObjectId, ref: User), read (Boolean, Default: false)</td>
    </tr>
  </table>

  <h2>6.6 Data Dictionary</h2>
  <p>
    A data dictionary formalizes the semantic meaning of critical application fields:
  </p>
  <ul>
    <li><code>applicationId</code>: Unique state-wide tracking identifier formatted as <code>MC-YYYY-NNNNNN</code> (e.g. <code>MC-2026-000101</code>).</li>
    <li><code>interopReferenceId</code>: Department-assigned routing confirmation token formatted as <code>DEPT-YYYY-NNNNN</code> (e.g. <code>TRP-2026-68192</code>).</li>
    <li><code>responseTimeMs</code>: Latency in milliseconds recorded by the API Gateway during departmental routing.</li>
  </ul>

  <!-- ==================== CHAPTER 7 – IMPLEMENTATION ==================== -->
  <div class="page-break"></div>
  <div class="chapter-title">CHAPTER 7 – FULL-STACK IMPLEMENTATION DETAILS</div>

  <h2>7.1 Frontend Architecture & Component Tree</h2>
  <p>
    The frontend is organized using a feature-based folder hierarchy under <code>client/src</code>:
  </p>
  <ul>
    <li><code>components/layout/</code>: Navigation bar, sidebar drawer, and protected dashboard shell.</li>
    <li><code>context/</code>: React Context providers for global authentication state (<code>AuthContext</code>) and toast alerts (<code>ToastContext</code>).</li>
    <li><code>pages/citizen/</code>: Citizen Dashboard, Services Catalog, 5-Step Application Wizard, Application Details Timeline.</li>
    <li><code>pages/officer/</code>: Officer Scrutiny Console, Document Review Dossier.</li>
    <li><code>pages/admin/</code>: Admin Dashboard, Department Management, Service Management, API Logs Telemetry.</li>
  </ul>

  <h2 style="margin-top: 8pt;">7.2 Backend Architecture & Routing Pipeline</h2>
  <p>
    The backend runs on Node.js and Express.js, structured across four primary layers:
  </p>
  <ul>
    <li><strong>Middleware Pipeline:</strong> <code>helmet()</code> for HTTP headers, <code>cors()</code> for origin control, <code>express.json()</code> for body parsing, and <code>verifyToken</code> for JWT validation.</li>
    <li><strong>Controllers:</strong> Encapsulate CRUD logic and cross-departmental dispatch coordination.</li>
    <li><strong>Simulated Department Services:</strong> Mock adapters that simulate response latency and allocate tracking tokens.</li>
  </ul>

  <h2 style="margin-top: 8pt;">7.3 REST API Implementation</h2>
  <div class="table-caption">Table 8: Core REST API Endpoints Specification</div>
  <table style="margin: 4pt 0 6pt 0; font-size: 8pt;">
    <tr>
      <th style="padding: 2.5pt 4pt;">Endpoint</th>
      <th style="padding: 2.5pt 4pt;">Method</th>
      <th style="padding: 2.5pt 4pt;">Access Role</th>
      <th style="padding: 2.5pt 4pt;">Description</th>
    </tr>
    <tr><td style="padding: 2pt 4pt;">/api/auth/register</td><td style="padding: 2pt 4pt;">POST</td><td style="padding: 2pt 4pt;">Public</td><td style="padding: 2pt 4pt;">Register a new citizen account</td></tr>
    <tr><td style="padding: 2pt 4pt;">/api/auth/login</td><td style="padding: 2pt 4pt;">POST</td><td style="padding: 2pt 4pt;">Public</td><td style="padding: 2pt 4pt;">Authenticate user and issue JWT bearer token</td></tr>
    <tr><td style="padding: 2pt 4pt;">/api/departments</td><td style="padding: 2pt 4pt;">GET</td><td style="padding: 2pt 4pt;">Public</td><td style="padding: 2pt 4pt;">Fetch all registered active departments</td></tr>
    <tr><td style="padding: 2pt 4pt;">/api/services</td><td style="padding: 2pt 4pt;">GET</td><td style="padding: 2pt 4pt;">Public</td><td style="padding: 2pt 4pt;">Fetch all services with dynamic parameter schemas</td></tr>
    <tr><td style="padding: 2pt 4pt;">/api/applications</td><td style="padding: 2pt 4pt;">POST</td><td style="padding: 2pt 4pt;">Citizen</td><td style="padding: 2pt 4pt;">Submit new application with dynamic form data</td></tr>
    <tr><td style="padding: 2pt 4pt;">/api/applications</td><td style="padding: 2pt 4pt;">GET</td><td style="padding: 2pt 4pt;">Citizen / Admin</td><td style="padding: 2pt 4pt;">List applications scoped to user role</td></tr>
    <tr><td style="padding: 2pt 4pt;">/api/applications/:id</td><td style="padding: 2pt 4pt;">GET</td><td style="padding: 2pt 4pt;">Citizen / Officer / Admin</td><td style="padding: 2pt 4pt;">Retrieve full application details and timeline</td></tr>
    <tr><td style="padding: 2pt 4pt;">/api/applications/:id/status</td><td style="padding: 2pt 4pt;">PATCH</td><td style="padding: 2pt 4pt;">Officer / Admin</td><td style="padding: 2pt 4pt;">Update status and append remarks to timeline</td></tr>
    <tr><td style="padding: 2pt 4pt;">/api/admin/api-logs</td><td style="padding: 2pt 4pt;">GET</td><td style="padding: 2pt 4pt;">Admin</td><td style="padding: 2pt 4pt;">Fetch real-time interoperability gateway logs</td></tr>
  </table>

  <h2 style="margin-top: 8pt;">7.4 Complete Application Workflow</h2>
  <p>
    The complete citizen application lifecycle operates through five sequential stages:
  </p>
  <ol>
    <li><strong>Stage 1 (Authentication):</strong> Citizen logs into MahaConnect using single-sign-on credentials.</li>
    <li><strong>Stage 2 (Service Selection):</strong> Citizen browses the cross-departmental catalog and selects a service.</li>
    <li><strong>Stage 3 (Application Wizard):</strong> Form wizard pre-fills personal demographics, renders dynamic service fields, and accepts document attachments.</li>
    <li><strong>Stage 4 (Gateway Submission):</strong> The gateway intercepts submission, dispatches to target department, and assigns <code>MC-2026-XXXXXX</code>.</li>
    <li><strong>Stage 5 (Officer Scrutiny & Disposition):</strong> Officer reviews the dossier, verifies attachments, and approves/rejects with audit remarks.</li>
  </ol>

  <!-- ==================== CHAPTER 8 – SECURITY ==================== -->
  <div class="page-break"></div>
  <div class="chapter-title">CHAPTER 8 – SECURITY, CRYPTOGRAPHY & ACCESS CONTROL</div>

  <h2>8.1 Password Hashing with bcrypt</h2>
  <p>
    User passwords are protected against dictionary attacks using the <strong>bcryptjs</strong> library. During user registration, passwords pass through a salt generation routine with a work factor of 10 rounds:
  </p>
  <div class="code-block">
const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(password, salt);
  </div>

  <h2>8.2 JWT Authentication & Bearer Token Verification</h2>
  <p>
    Sessions are governed by stateless JSON Web Tokens signed with HMAC-SHA256. Upon successful authentication, the server signs a token payload containing the user's ID, role, and department. The client transmits this token in the <code>Authorization: Bearer &lt;token&gt;</code> header on all subsequent calls.
  </p>

  <h2>8.3 Role-Based Access Control (RBAC)</h2>
  <p>
    The backend enforces RBAC through middleware guards verifying token roles before controller execution:
  </p>

  <div class="table-caption">Table 9: Role-Based Access Control (RBAC) Permission Matrix</div>
  <table>
    <tr>
      <th>Resource Operation</th>
      <th>Public</th>
      <th>Citizen</th>
      <th>Department Officer</th>
      <th>State Admin</th>
    </tr>
    <tr><td>View Public Landing Page & Services</td><td>✔ Allowed</td><td>✔ Allowed</td><td>✔ Allowed</td><td>✔ Allowed</td></tr>
    <tr><td>Submit Service Application</td><td>❌ Denied</td><td>✔ Allowed</td><td>❌ Denied</td><td>❌ Denied</td></tr>
    <tr><td>Upload Supporting Documents</td><td>❌ Denied</td><td>✔ Allowed</td><td>❌ Denied</td><td>❌ Denied</td></tr>
    <tr><td>View Own Application History</td><td>❌ Denied</td><td>✔ Own Only</td><td>❌ Denied</td><td>✔ All</td></tr>
    <tr><td>Review Department Application Dossier</td><td>❌ Denied</td><td>❌ Denied</td><td>✔ Assigned Dept</td><td>✔ All</td></tr>
    <tr><td>Update Application Status & Remarks</td><td>❌ Denied</td><td>❌ Denied</td><td>✔ Assigned Dept</td><td>✔ Override</td></tr>
    <tr><td>Manage Departments & Service Schemas</td><td>❌ Denied</td><td>❌ Denied</td><td>❌ Denied</td><td>✔ Full Admin</td></tr>
    <tr><td>Inspect Interoperability Telemetry Logs</td><td>❌ Denied</td><td>❌ Denied</td><td>❌ Denied</td><td>✔ Full Admin</td></tr>
  </table>

  <h2>8.4 Security Middleware: Helmet, CORS & Rate Limiting</h2>
  <p>
    The Express Gateway utilizes <code>helmet</code> to set security headers (X-Frame-Options, Content-Security-Policy), <code>cors</code> to prevent cross-origin abuse, and <code>express-rate-limit</code> restricting excessive requests to 100 requests per 15-minute window per IP.
  </p>

  <h2>8.5 Audit Logging & Telemetry Recording</h2>
  <p>
    Every cross-departmental API call is intercepted by telemetry middleware that creates an entry in the <code>apilogs</code> collection recording the timestamp, source, destination, endpoint, HTTP method, response status, and execution time in milliseconds.
  </p>

  <!-- ==================== CHAPTER 9 – TESTING ==================== -->
  <div class="page-break"></div>
  <div class="chapter-title">CHAPTER 9 – TESTING & VALIDATION</div>

  <h2>9.1 Testing Strategy & Methodology</h2>
  <p>
    Quality assurance for MahaConnect was executed through functional unit testing, REST API contract validation via Postman Desktop v11, client-side error trapping, and end-to-end user journey simulation via Puppeteer browser automation.
  </p>

  <h2>9.2 Test Cases and Results</h2>
  <div class="table-caption">Table 10: Automated Postman Test Case Execution Matrix</div>
  <table>
    <tr>
      <th>Test ID</th>
      <th>Endpoint & Method</th>
      <th>Test Scenario</th>
      <th>Expected Result</th>
      <th>Actual Result</th>
      <th>Status</th>
    </tr>
    <tr>
      <td>TC-01</td>
      <td>GET /api/departments</td>
      <td>Retrieve list of all active departments</td>
      <td>HTTP 200 with 7 departments</td>
      <td>HTTP 200 with 7 departments (24ms)</td>
      <td><strong>PASS</strong></td>
    </tr>
    <tr>
      <td>TC-02</td>
      <td>POST /api/auth/login</td>
      <td>Authenticate citizen with valid credentials</td>
      <td>HTTP 200 with JWT bearer token</td>
      <td>HTTP 200 with valid JWT token (58ms)</td>
      <td><strong>PASS</strong></td>
    </tr>
    <tr>
      <td>TC-03</td>
      <td>POST /api/auth/login</td>
      <td>Authenticate with invalid password</td>
      <td>HTTP 401 Invalid credentials</td>
      <td>HTTP 401 Invalid credentials</td>
      <td><strong>PASS</strong></td>
    </tr>
    <tr>
      <td>TC-04</td>
      <td>POST /api/applications</td>
      <td>Submit multi-step form with valid payload</td>
      <td>HTTP 201 with Application ID</td>
      <td>HTTP 201 with ID MC-2026-000101</td>
      <td><strong>PASS</strong></td>
    </tr>
    <tr>
      <td>TC-05</td>
      <td>GET /api/applications/:id</td>
      <td>Retrieve application tracking timeline</td>
      <td>HTTP 200 with timeline array</td>
      <td>HTTP 200 with 4 timeline states</td>
      <td><strong>PASS</strong></td>
    </tr>
    <tr>
      <td>TC-06</td>
      <td>PATCH /api/applications/:id/status</td>
      <td>Officer updates status to Approved</td>
      <td>HTTP 200 with updated status</td>
      <td>HTTP 200 with status Approved (44ms)</td>
      <td><strong>PASS</strong></td>
    </tr>
    <tr>
      <td>TC-07</td>
      <td>DELETE /api/departments/:id</td>
      <td>Attempt deletion of linked department</td>
      <td>HTTP 400 Integrity violation</td>
      <td>HTTP 400 Integrity violation (18ms)</td>
      <td><strong>PASS</strong></td>
    </tr>
    <tr>
      <td>TC-08</td>
      <td>GET /api/admin/api-logs</td>
      <td>Fetch gateway telemetry logs</td>
      <td>HTTP 200 with log array</td>
      <td>HTTP 200 with active telemetry logs</td>
      <td><strong>PASS</strong></td>
    </tr>
  </table>

  <h2>9.3 Production Deployment Verification</h2>
  <p>
    The production build was deployed to the Vercel platform. The public endpoint <code>https://mahaconnect-rose.vercel.app/api/health</code> was queried and confirmed operational with an HTTP 200 status code.
  </p>

  <!-- ==================== CHAPTER 10 – RESULTS & CONCLUSION ==================== -->
  <div class="page-break"></div>
  <div class="chapter-title">CHAPTER 10 – RESULTS, CONCLUSION & FUTURE SCOPE</div>

  <h2>10.1 Results</h2>
  <p>
    The implementation of MahaConnect successfully fulfilled all planned functional objectives:
  </p>
  <ul>
    <li>Citizens successfully authenticate, browse services across 7 departments, and file applications without repeating demographic entries.</li>
    <li>Department officers access role-scoped scrutiny queues, verify uploaded documents, and update status with audit remarks.</li>
    <li>Administrators monitor cross-departmental REST telemetry and response latencies in real time.</li>
  </ul>

  <h2>10.2 Conclusion</h2>
  <p>
    The <strong>MahaConnect: Government Platform Interoperability System</strong> project demonstrates that an API Gateway built on the MERN stack can effectively connect disparate departmental public services into a unified single-window portal. The project proves that e-Governance interoperability can be achieved through software middleware without requiring costly redesigns of underlying departmental databases.
  </p>

  <h2>10.3 Learning Outcomes</h2>
  <ol>
    <li>Proficiency in designing full-stack MERN applications following MVC-Service-Gateway architecture.</li>
    <li>Hands-on experience implementing JSON Web Token (JWT) stateless authentication and bcrypt password security.</li>
    <li>Practical understanding of API Gateway routing, schema-driven dynamic form generation, and telemetry logging.</li>
    <li>Experience with automated API verification via Postman and headless browser testing via Puppeteer.</li>
  </ol>

  <h2>10.4 Limitations</h2>
  <ul>
    <li>Downstream departmental systems are simulated through a mock integration service layer for academic purposes.</li>
    <li>Document storage is abstracted locally during development rather than connected to live national document repositories.</li>
  </ul>

  <h2>10.5 Future Scope</h2>
  <ol>
    <li><strong>DigiLocker Integration:</strong> Direct connection with Government of India DigiLocker APIs for automated certificate verification.</li>
    <li><strong>Distributed Audit Ledger:</strong> Transitioning the centralized <code>ApiLog</code> collection into an immutable distributed ledger.</li>
    <li><strong>Multilingual Accessibility:</strong> Introducing localization for Marathi, Hindi, and English to broaden accessibility.</li>
  </ol>

  <!-- ==================== 11. PROJECT SCREENSHOTS ==================== -->
  <div class="page-break"></div>
  <div class="chapter-title">CHAPTER 11 – PROJECT SCREENSHOTS & IMPLEMENTATION PHOTOS</div>

  <p class="no-indent" style="margin-bottom: 14pt;">
    This chapter presents real screenshots captured from the running MahaConnect application, REST API gateway, and MongoDB database during live operation:
  </p>

  <div class="figure-box">
    <img src="${img01}" class="figure-img" alt="Landing Page">
    <div class="figure-caption">Figure 6: MahaConnect Public Landing Page & Citizen Gateway</div>
  </div>

  <div class="figure-box">
    <img src="${img02}" class="figure-img" alt="Login Page">
    <div class="figure-caption">Figure 7: Unified Authentication Portal with Seeded Demo Credentials</div>
  </div>

  <div class="page-break"></div>

  <div class="figure-box">
    <img src="${img03}" class="figure-img" alt="Citizen Dashboard">
    <div class="figure-caption">Figure 8: Citizen Self-Service Dashboard with Metric Cards & Quick Navigation</div>
  </div>

  <div class="figure-box">
    <img src="${img04}" class="figure-img" alt="Services Catalog">
    <div class="figure-caption">Figure 9: Cross-Departmental Government Services Directory with Filtering</div>
  </div>

  <div class="page-break"></div>

  <div class="figure-box">
    <img src="${img05}" class="figure-img" alt="Application Form">
    <div class="figure-caption">Figure 10: Dynamic Application Form Wizard: Step 1 (Personal Demographics)</div>
  </div>

  <div class="figure-box">
    <img src="${img06}" class="figure-img" alt="Form Validation Error">
    <div class="figure-caption">Figure 11: Client-Side Form Validation Alert & Error Prevention</div>
  </div>

  <div class="page-break"></div>

  <div class="figure-box">
    <img src="${img07}" class="figure-img" alt="Document Upload">
    <div class="figure-caption">Figure 12: Document Upload & Multi-Format Verification</div>
  </div>

  <div class="figure-box">
    <img src="${img08}" class="figure-img" alt="Submission Confirmation">
    <div class="figure-caption">Figure 13: Application Submission Confirmation & Unique Reference Generation</div>
  </div>

  <div class="page-break"></div>

  <div class="figure-box">
    <img src="${img09}" class="figure-img" alt="Tracking Timeline">
    <div class="figure-caption">Figure 14: Live Citizen Tracking Timeline with Multi-Stage Progression</div>
  </div>

  <div class="figure-box">
    <img src="${img10}" class="figure-img" alt="Officer Dashboard">
    <div class="figure-caption">Figure 15: Department Officer Scrutiny Console & Pending Application Queue</div>
  </div>

  <div class="page-break"></div>

  <div class="figure-box">
    <img src="${img11}" class="figure-img" alt="Officer Review">
    <div class="figure-caption">Figure 16: Officer Application Scrutiny Dossier with Inline Document Viewer</div>
  </div>

  <div class="figure-box">
    <img src="${img12}" class="figure-img" alt="Status Update">
    <div class="figure-caption">Figure 17: Officer Status Transition Pipeline & Remarks Endorsement</div>
  </div>

  <div class="page-break"></div>

  <div class="figure-box">
    <img src="${img13}" class="figure-img" alt="Admin Dashboard">
    <div class="figure-caption">Figure 18: State Administrator Governance Dashboard & Interoperability KPIs</div>
  </div>

  <div class="figure-box">
    <img src="${img14}" class="figure-img" alt="Department Management">
    <div class="figure-caption">Figure 19: State Department Management Console & Endpoint Configuration</div>
  </div>

  <div class="page-break"></div>

  <div class="figure-box">
    <img src="${img15}" class="figure-img" alt="Service Management">
    <div class="figure-caption">Figure 20: Service Schema Configuration & Dynamic Field Definition</div>
  </div>

  <div class="figure-box">
    <img src="${img16}" class="figure-img" alt="API Logs">
    <div class="figure-caption">Figure 21: REST API Interoperability Gateway Logs & Modal Payload Inspector</div>
  </div>

  <div class="page-break"></div>

  <div class="figure-box">
    <img src="${img17}" class="figure-img" alt="Postman GET">
    <div class="figure-caption">Figure 22: Postman Test Suite: GET /api/departments (Status 200 OK)</div>
  </div>

  <div class="figure-box">
    <img src="${img18}" class="figure-img" alt="Postman POST">
    <div class="figure-caption">Figure 23: Postman Test Suite: POST /api/auth/login (JWT Token Generation)</div>
  </div>

  <div class="page-break"></div>

  <div class="figure-box">
    <img src="${img19}" class="figure-img" alt="Postman PATCH">
    <div class="figure-caption">Figure 24: Postman Test Suite: PATCH /api/applications/:id/status</div>
  </div>

  <div class="figure-box">
    <img src="${img20}" class="figure-img" alt="Postman DELETE">
    <div class="figure-caption">Figure 25: Postman Test Suite: DELETE /api/departments/:id (Integrity Check)</div>
  </div>

  <div class="page-break"></div>

  <div class="figure-box">
    <img src="${img21}" class="figure-img" alt="MongoDB Records">
    <div class="figure-caption">Figure 26: MongoDB Shell (mongosh) Collection & Query Ledger Inspection</div>
  </div>

  <div class="figure-box">
    <img src="${img22}" class="figure-img" alt="Final Application Overview">
    <div class="figure-caption">Figure 27: MahaConnect Final Working Multi-Portal Application Showcase</div>
  </div>

  <!-- ==================== 12. PROJECT DETAILS PAGE ==================== -->
  <div class="page-break"></div>
  <div class="chapter-title">PROJECT DETAILS</div>

  <div style="max-width: 600px; margin: 30pt auto 0 auto; border: 1.5pt solid #000000; padding: 22pt;">
    <table style="border: none; margin: 0;">
      <tr style="background: none;"><td style="border: none; font-weight: bold; width: 40%;">DEPARTMENT:</td><td style="border: none;">Information Technology</td></tr>
      <tr style="background: none;"><td style="border: none; font-weight: bold;">PROJECT TITLE:</td><td style="border: none;">MahaConnect: Government Platform Interoperability System</td></tr>
      <tr style="background: none;"><td style="border: none; font-weight: bold;">STUDENT NAMES:</td><td style="border: none;">Pawan Mishra<br>Samarth Nivadunge</td></tr>
      <tr style="background: none;"><td style="border: none; font-weight: bold;">ROLL NOs:</td><td style="border: none;">202402104<br>202402111</td></tr>
      <tr style="background: none;"><td style="border: none; font-weight: bold;">CLASS:</td><td style="border: none;">TY BSc IT</td></tr>
      <tr style="background: none;"><td style="border: none; font-weight: bold;">SEMESTER:</td><td style="border: none;">V</td></tr>
      <tr style="background: none;"><td style="border: none; font-weight: bold;">PROJECT GUIDE:</td><td style="border: none;">Mr. Pratharv Surve</td></tr>
      <tr style="background: none;"><td style="border: none; font-weight: bold;">ACADEMIC YEAR:</td><td style="border: none;">2026-2027</td></tr>
      <tr style="background: none;"><td style="border: none; font-weight: bold;">COLLEGE:</td><td style="border: none;">ZSCT's Thakur Shyamnarayan Degree College</td></tr>
      <tr style="background: none;"><td style="border: none; font-weight: bold;">DEPLOYMENT URL:</td><td style="border: none;"><a href="https://mahaconnect-rose.vercel.app">https://mahaconnect-rose.vercel.app</a></td></tr>
    </table>
  </div>

  <!-- ==================== 13. REFERENCES / BIBLIOGRAPHY ==================== -->
  <div class="page-break"></div>
  <div class="chapter-title">REFERENCES / BIBLIOGRAPHY</div>

  <ol style="margin-left: 24pt; line-height: 1.8;">
    <li>MongoDB Documentation. <em>MongoDB Manual: Databases, Collections, and Documents</em>. Available: https://www.mongodb.com/docs/manual/</li>
    <li>React Documentation. <em>React: The Library for Web and Native User Interfaces</em>. Available: https://react.dev/</li>
    <li>Node.js Documentation. <em>Node.js v20+ LTS Architecture and Asynchronous I/O</em>. Available: https://nodejs.org/docs/</li>
    <li>Express.js Documentation. <em>Fast, Unopinionated, Minimalist Web Framework for Node.js</em>. Available: https://expressjs.com/</li>
    <li>Vite Documentation. <em>Next Generation Frontend Tooling</em>. Available: https://vitejs.dev/</li>
    <li>Tailwind CSS Documentation. <em>A Utility-First CSS Framework for Rapid UI Development</em>. Available: https://tailwindcss.com/docs</li>
    <li>Mongoose Documentation. <em>Mongoose ODM: Elegant MongoDB Object Modeling for Node.js</em>. Available: https://mongoosejs.com/docs/</li>
    <li>JSON Web Token Documentation. <em>RFC 7519: JSON Web Token (JWT) Standard</em>. IETF, Available: https://jwt.io/</li>
    <li>OWASP Foundation. <em>OWASP Top 10 Web Application Security Risks</em>. Open Web Application Security Project, Available: https://owasp.org/www-project-top-ten/</li>
    <li>Postman Documentation. <em>Postman API Platform: Automated Contract Testing and Documentation</em>. Available: https://learning.postman.com/docs/</li>
  </ol>

</body>
</html>`;
}

async function generatePdf() {
  console.log('📄 Assembling formal college-style HTML report template...');
  const htmlContent = buildCollegeReportHtml();

  console.log('🚀 Launching Chrome for A4 Print PDF Generation...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
  await sleep(1500);

  console.log('🖨️ Generating PDF: ' + OUTPUT_PDF);
  await page.pdf({
    path: OUTPUT_PDF,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '18mm',
      bottom: '18mm',
      left: '16mm',
      right: '16mm',
    },
    displayHeaderFooter: false,
  });

  const originalPdf = path.join(__dirname, '../MahaConnect_FSDM_Project_Report_Pawan_Mishra.pdf');
  fs.copyFileSync(OUTPUT_PDF, originalPdf);
  console.log('📋 Also synchronized: ' + originalPdf);

  await browser.close();
  console.log('✅ COLLEGE STYLE PDF GENERATED SUCCESSFULLY (NO HEADERS/FOOTERS): ' + OUTPUT_PDF);
}

generatePdf().catch((err) => {
  console.error('Error generating PDF report:', err);
  process.exit(1);
});
