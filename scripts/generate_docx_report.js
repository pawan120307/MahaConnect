import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ImageRun,
  PageBreak,
  Header,
  Footer,
  PageNumber,
} from 'docx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots');
const OUTPUT_DOCX_PRIMARY = path.join(
  __dirname,
  '../MahaConnect_Capstone_Report_Pawan_Mishra_Samarth_Nivadunge_Sem5.docx'
);
const OUTPUT_DOCX_ORIGINAL = path.join(
  __dirname,
  '../MahaConnect_FSDM_Project_Report_Pawan_Mishra.docx'
);

function getImageBuffer(filename) {
  const filePath = path.join(SCREENSHOTS_DIR, filename);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath);
  }
  return null;
}

function createHeading1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 140 },
  });
}

function createHeading2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 220, after: 90 },
  });
}

function createHeading3(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 160, after: 70 },
  });
}

function createParagraph(text, isJustified = true) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Times New Roman', size: 23 })],
    alignment: isJustified ? AlignmentType.JUSTIFIED : AlignmentType.LEFT,
    spacing: { after: 130, line: 340 },
  });
}

function createBullet(text) {
  return new Paragraph({
    children: [new TextRun({ text: '•  ' + text, font: 'Times New Roman', size: 23 })],
    alignment: AlignmentType.JUSTIFIED,
    indent: { left: 360 },
    spacing: { after: 70, line: 320 },
  });
}

function createFigure(filename, caption, description) {
  const buf = getImageBuffer(filename);
  const elements = [];

  if (buf) {
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 180, after: 90 },
        children: [
          new ImageRun({
            data: buf,
            transformation: {
              width: 540,
              height: 320,
            },
          }),
        ],
      })
    );
  }

  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: caption,
          bold: true,
          font: 'Arial',
          size: 19,
          color: '0f2b48',
        }),
      ],
    })
  );

  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: description,
          italics: true,
          font: 'Times New Roman',
          size: 18,
          color: '475569',
        }),
      ],
    })
  );

  return elements;
}

function createTable(rowsData, colWidths = []) {
  const tableRows = rowsData.map((row, rIndex) => {
    const isHeader = rIndex === 0;
    return new TableRow({
      tableHeader: isHeader,
      children: row.map((cellText, cIndex) => {
        return new TableCell({
          width: colWidths[cIndex] ? { size: colWidths[cIndex], type: WidthType.DXA } : undefined,
          shading: isHeader ? { fill: '0f2b48' } : rIndex % 2 === 0 ? { fill: 'f8fafc' } : undefined,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: cellText,
                  bold: isHeader,
                  color: isHeader ? 'ffffff' : '000000',
                  font: isHeader ? 'Arial' : 'Times New Roman',
                  size: 19,
                }),
              ],
              spacing: { before: 70, after: 70 },
            }),
          ],
        });
      }),
    });
  });

  return new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'cbd5e1' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'cbd5e1' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'cbd5e1' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'cbd5e1' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' },
    },
  });
}

async function buildDocx() {
  console.log('📝 Compiling updated academic DOCX report for Pawan Mishra & Samarth Nivadunge (Sem V)...');

  const doc = new Document({
    creator: 'Pawan Mishra & Samarth Nivadunge',
    title: 'MahaConnect: Government Platform Interoperability System',
    description: 'TY BSc IT Semester V FSDM Capstone Project Report',
    styles: {
      default: {
        document: {
          run: {
            font: 'Times New Roman',
            size: 23,
          },
        },
        heading1: {
          run: {
            font: 'Arial',
            size: 30,
            bold: true,
            color: '0f2b48',
          },
        },
        heading2: {
          run: {
            font: 'Arial',
            size: 25,
            bold: true,
            color: '1e3a8a',
          },
        },
        heading3: {
          run: {
            font: 'Arial',
            size: 21,
            bold: true,
            color: '334155',
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'MahaConnect – Government Platform Interoperability System | TY BSc IT Sem V',
                    font: 'Arial',
                    size: 16,
                    color: '94a3b8',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Pawan Mishra & Samarth Nivadunge • Page ',
                    font: 'Arial',
                    size: 15,
                    color: '94a3b8',
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: 'Arial',
                    size: 15,
                    color: '94a3b8',
                  }),
                  new TextRun({
                    text: ' of ',
                    font: 'Arial',
                    size: 15,
                    color: '94a3b8',
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: 'Arial',
                    size: 15,
                    color: '94a3b8',
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // ==================== COVER PAGE ====================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 260, after: 80 },
            children: [
              new TextRun({
                text: 'A CAPSTONE PROJECT REPORT ON',
                font: 'Arial',
                size: 22,
                bold: true,
                color: '475569',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 120 },
            children: [
              new TextRun({
                text: 'MAHACONNECT: GOVERNMENT PLATFORM INTEROPERABILITY SYSTEM',
                font: 'Arial',
                size: 34,
                bold: true,
                color: '0f2b48',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 360 },
            children: [
              new TextRun({
                text: 'A Unified Multi-Departmental e-Governance Integration Architecture',
                font: 'Arial',
                size: 22,
                color: '2563eb',
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: 'Submitted in partial fulfillment of the requirements for the award of the Degree of',
                font: 'Times New Roman',
                size: 21,
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: 'BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY (BSc IT)',
                font: 'Arial',
                size: 24,
                bold: true,
                color: '0f2b48',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: '(Full Stack Development & Management – FSDM)',
                font: 'Arial',
                size: 19,
                color: '64748b',
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: 'SUBMITTED BY:',
                font: 'Arial',
                size: 20,
                bold: true,
                color: '1e3a8a',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 20 },
            children: [
              new TextRun({
                text: 'PAWAN MISHRA',
                font: 'Arial',
                size: 28,
                bold: true,
                color: '0f2b48',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: 'Roll No: 202402104',
                font: 'Courier New',
                size: 20,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 20 },
            children: [
              new TextRun({
                text: 'SAMARTH NIVADUNGE',
                font: 'Arial',
                size: 28,
                bold: true,
                color: '0f2b48',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'Roll No: 202402111',
                font: 'Courier New',
                size: 20,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: 'Class: TY BSc IT • Semester V',
                font: 'Times New Roman',
                size: 21,
                bold: true,
                color: '1e3a8a',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: 'DEPARTMENT OF INFORMATION TECHNOLOGY',
                font: 'Arial',
                size: 22,
                bold: true,
                color: '0f2b48',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'Academic Year: 2026 – 2027',
                font: 'Times New Roman',
                size: 21,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 30 },
            children: [
              new TextRun({
                text: 'Production Deployment URL: https://mahaconnect-rose.vercel.app',
                font: 'Courier New',
                size: 18,
                bold: true,
                color: '059669',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 160 },
            children: [
              new TextRun({
                text: 'GitHub Repository: https://github.com/pawan120307/MahaConnect',
                font: 'Courier New',
                size: 18,
                bold: true,
                color: '2563eb',
              }),
            ],
          }),

          // Page Break to Certificate
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CERTIFICATE ====================
          createHeading1('CERTIFICATE OF APPROVAL'),
          createParagraph(
            'This is to certify that the project entitled "MahaConnect: Government Platform Interoperability System" is a bonafide work carried out by PAWAN MISHRA (Roll No: 202402104) and SAMARTH NIVADUNGE (Roll No: 202402111) in partial fulfillment of the requirements for the degree of Bachelor of Science in Information Technology (TY BSc IT), Semester V during the academic year 2026–2027.'
          ),
          createParagraph(
            'The candidates have demonstrated proficiency in full-stack architecture, MERN technology integration, RESTful API gateway orchestration, microservice interoperability modeling, and automated testing. The system has been fully implemented, validated, and successfully deployed to live cloud infrastructure.'
          ),
          new Paragraph({ spacing: { before: 500 } }),
          createTable([
            ['Project Guide', 'Head of Department', 'External Examiner'],
            ['Dept. of Information Technology', 'Dept. of Information Technology', 'University Board of Examiners'],
          ]),

          // Page Break to Declaration
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== DECLARATION & ACKNOWLEDGEMENT ====================
          createHeading1('DECLARATION'),
          createParagraph(
            'We, Pawan Mishra and Samarth Nivadunge, hereby declare that the capstone project report entitled ‘MahaConnect – Government Platform Interoperability System’, submitted to the Department of Information Technology in partial fulfillment of the requirements for the award of the Degree of Bachelor of Science in Information Technology (TY BSc IT), is an authentic record of original work carried out by us under institutional academic guidance.'
          ),
          createParagraph(
            'We further declare that this report has not been submitted either concurrently or previously to any other university, college, or examination board for the award of any degree or diploma. All external libraries, architectural design patterns, research papers, and technical standards cited throughout this document have been duly acknowledged in the references section.'
          ),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 240 },
            children: [
              new TextRun({ text: 'PAWAN MISHRA\n', bold: true }),
              new TextRun({ text: 'Roll No: 202402104\n\n' }),
              new TextRun({ text: 'SAMARTH NIVADUNGE\n', bold: true }),
              new TextRun({ text: 'Roll No: 202402111\n\n' }),
              new TextRun({ text: 'TY BSc IT • Semester V\n', bold: true, color: '1e3a8a' }),
              new TextRun({ text: 'Date: 29 september 2026' }),
            ],
          }),

          createHeading1('ACKNOWLEDGEMENT'),
          createParagraph(
            'The successful design, engineering, and implementation of MahaConnect has been a profoundly enriching milestone in our academic journey. We express our deepest sense of gratitude to our respected Principal, Head of the Information Technology Department, and Faculty Members whose continuous encouragement, intellectual guidance, and constructive critiques fostered the realization of this capstone project.'
          ),
          createParagraph(
            'We would like to extend our heartfelt appreciation to our project guide for providing invaluable technical mentorship, reviewing architectural schemata, and offering rigorous recommendations on distributed systems interoperability and web application security standards.'
          ),
          createParagraph(
            'Finally, we owe our sincere thanks to our families, peers, and fellow developers whose moral support and constructive feedback contributed immensely to the refinement and success of this project.'
          ),

          // Page Break to Abstract
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== ABSTRACT ====================
          createHeading1('ABSTRACT'),
          createParagraph(
            'In contemporary public administration, citizens frequently encounter friction when navigating public services due to architectural silos across government departments. Traditional e-Governance infrastructures often operate as isolated islands where citizens are subjected to redundant demographic data submissions, disparate credentials, uncoordinated document verifications, and fragmented tracking mechanisms.'
          ),
          createParagraph(
            'To address these challenges, this capstone project designs and implements MahaConnect—a full-stack Government Platform Interoperability System built on the modern MERN stack (MongoDB, Express.js, React, Node.js) paired with Vite, Tailwind CSS, JSON Web Token (JWT) role-based authorization, and a simulated Government Interoperability Service Layer.'
          ),
          createParagraph(
            'MahaConnect demonstrates how an asynchronous, single-window citizen portal can connect seven administrative departments: Revenue, Transport, Education, Municipal Corporation, Employment, Social Welfare, and Urban Development. The platform introduces a single-window citizen portal, a department interoperability service layer, a department officer dashboard, a state administrator dashboard, and a standardized RESTful API communication pipeline.'
          ),

          // Page Break to TOC
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== TABLE OF CONTENTS ====================
          createHeading1('TABLE OF CONTENTS'),
          createTable([
            ['Section', 'Title', 'Page No.'],
            ['1.0', 'Introduction & Problem Definition', '1'],
            ['2.0', 'Literature Review & Existing Systems Analysis', '3'],
            ['3.0', 'System Architecture & Interoperability Model', '5'],
            ['4.0', 'Hardware & Software Requirements', '8'],
            ['5.0', 'System Analysis & Feasibility Study', '10'],
            ['6.0', 'System Design, DFD & Database Modeling', '12'],
            ['7.0', 'Full-Stack Implementation Details', '16'],
            ['8.0', 'Security, Cryptography & Role-Based Access Control', '19'],
            ['9.0', 'Interoperability Gateway & API Routing Engine', '22'],
            ['10.0', 'Testing, Verification & Postman Suite Execution', '25'],
            ['11.0', 'Results, Screenshots & System Walkthrough (Figures 1–22)', '28'],
            ['12.0', 'Conclusion & Future Enhancements', '42'],
            ['13.0', 'References & Academic Bibliography', '44'],
            ['14.0', 'Appendix: Source Code Highlights & API Schema', '46'],
          ]),

          // Page Break to Section 1
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== SECTION 1: INTRODUCTION ====================
          createHeading1('1.0 INTRODUCTION'),
          createHeading2('1.1 Project Overview'),
          createParagraph(
            'In modern state administration, electronic governance (e-Governance) represents the primary conduit through which government entities interact with the public. However, state departments historically developed their digital applications independently. As a result, the Transport Department, the Revenue Department, the Department of School and Higher Education, Municipal Corporations, and the Department of Social Welfare operate disjointed technical stacks, disparate databases, and non-communicating interfaces.'
          ),
          createParagraph(
            'MahaConnect is conceptualized and engineered to address this fragmentation. Built as a full-stack web application adhering to modern MERN (MongoDB, Express.js, React, Node.js) design patterns, MahaConnect serves as a unified digital bridge connecting citizens and government departments. The platform facilitates single-sign-on (SSO) authenticated access, cross-departmental service browsing, dynamic multi-step application filing, document archiving, transparent real-time tracking, and automated inter-departmental API routing.'
          ),

          createHeading2('1.2 Problem Statement'),
          createParagraph(
            'The primary challenge addressed by MahaConnect is the presence of functional information silos in public administration. When a citizen requires a set of related government services (for example, applying for a college scholarship which requires an Income Certificate from Revenue, a Caste Certificate from Social Welfare, and an Enrollment Verification from Higher Education), the citizen is compelled to create multiple logins, repeatedly enter identical demographic records, physically upload duplicate proof documents, and monitor disjointed tracking numbers.'
          ),

          createHeading2('1.3 Project Objectives'),
          createParagraph('The primary engineering and operational objectives of MahaConnect include:'),
          createBullet('Single-Window Citizen Portal: Unified React interface with SSO credentials.'),
          createBullet('API Gateway Interoperability: Intelligent dispatch and protocol translation layer.'),
          createBullet('Dynamic Multi-Step Form Engine: Dynamic rendering of service-specific fields from JSON schemas.'),
          createBullet('Cross-Departmental Document Abstraction: Secure multi-format document archiving with validation.'),
          createBullet('Real-Time Status Tracking: Visual milestone tracking across all application lifecycle phases.'),
          createBullet('Role-Based Access Control (RBAC): Cryptographic boundaries for Citizens, Officers, and Admins.'),
          createBullet('Audit Telemetry Ledger: Immutable logging of API response times, routing paths, and HTTP statuses.'),

          createHeading2('1.4 Scope and Applicability'),
          createParagraph(
            'The scope of this project encompasses the lifecycle of simulated government service delivery within a state ecosystem. It models seven core government departments: Revenue, Transport, Education, Municipal Corporation, Employment, Social Welfare, and Urban Development. As an academic capstone implementation for TY BSc IT Semester V, downstream departmental APIs are simulated through a dedicated service layer, while the RESTful contracts, payload schemas, security tokens, and routing controllers are designed to reflect real-world architectural principles.'
          ),

          // Page Break to Section 2
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== SECTION 2: LITERATURE REVIEW ====================
          createHeading1('2.0 LITERATURE REVIEW & EXISTING SYSTEMS'),
          createHeading2('2.1 Traditional Siloed Governance Models'),
          createParagraph(
            'Early e-Governance initiatives focused on digitizing individual departmental workflows in isolation. While this computerization replaced paper registers, it created digital silos. Research into public sector software architectures indicates that siloed systems suffer from data redundancy, inconsistent state records, repetitive administrative workloads, and difficulty in cross-verifying applicant eligibility.'
          ),

          createHeading2('2.2 Comparative Analysis of Existing Platforms'),
          createTable([
            ['Feature / Dimension', 'Legacy State Portals', 'Centralized Monoliths', 'MahaConnect System'],
            ['Architecture', 'Departmental Silos', 'Monolithic Relational DB', 'Modern MERN Gateway Model'],
            ['User Experience', 'Multiple Portals & Logins', 'Rigid Single Interface', 'Responsive React SPA + Tailwind CSS'],
            ['Interoperability', 'None (Manual Paper Bridge)', 'Internal DB Procedures', 'RESTful Interoperability Gateway'],
            ['Schema Adaptability', 'Static Hardcoded Tables', 'Strict Database Schema', 'Dynamic JSON-Schema Service Builder'],
            ['Audit & Telemetry', 'Fragmented Text Logs', 'Standard Database Triggers', 'Real-Time ApiLog Audit Ledger'],
            ['Deployment Model', 'On-Premises Dedicated Servers', 'Central Government Data Center', 'Cloud Serverless (Vercel) + MongoDB'],
          ]),

          // Page Break to Section 3
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== SECTION 3: SYSTEM ARCHITECTURE ====================
          createHeading1('3.0 SYSTEM ARCHITECTURE & INTEROPERABILITY MODEL'),
          createHeading2('3.1 High-Level Architectural Paradigm'),
          createParagraph(
            'MahaConnect utilizes a multi-tiered, decoupled client-server architecture designed around microservices and API Gateway integration principles. The architectural stack consists of four primary tiers: the Presentation Tier (React SPA), the API Gateway & Routing Tier (Node.js & Express), the Departmental Interoperability Service Layer (simulated department micro-APIs), and the Persistence Tier (MongoDB with Mongoose ODM).'
          ),

          createHeading2('3.2 Gateway Interoperability Sequence Flow'),
          createParagraph(
            'When a citizen initiates an application submission, the request transitions through an automated eight-step pipeline:'
          ),
          createBullet('1. POST request with JWT: Citizen submits application data along with bearer token to /api/applications.'),
          createBullet('2. Authentication and RBAC verification: Gateway validates JWT signature and user permissions.'),
          createBullet('3. Payload schema validation: Validates demographic information and dynamic service requirements.'),
          createBullet('4. Departmental dispatch & reference allocation: Routes payload to simulated departmental service and allocates tracking reference.'),
          createBullet('5. MongoDB persistence: Writes application record, documents, and initial timeline to MongoDB.'),
          createBullet('6. API telemetry & audit logging: Captures method, status code, latency, and routing path in ApiLog.'),
          createBullet('7. In-app notification: Issues notification record to applicant dashboard.'),
          createBullet('8. Standardized JSON confirmation: Returns HTTP 201 response with unique Application ID (MC-2026-XXXXXX).'),

          // Page Break to Section 4
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== SECTION 4: HARDWARE & SOFTWARE REQUIREMENTS ====================
          createHeading1('4.0 HARDWARE & SOFTWARE REQUIREMENTS'),
          createHeading2('4.1 Hardware Requirements'),
          createTable([
            ['Component', 'Development Specification', 'Production Cloud Specification'],
            ['Processor', 'Multi-Core CPU @ 2.0GHz+', 'Serverless Container vCPU'],
            ['System Memory', '8 GB Minimum', '2 GB per Container Instance'],
            ['Storage', '256 GB SSD', 'Elastic Cloud Storage'],
            ['Network', 'Broadband Connection (10 Mbps+)', 'High-Speed Cloud CDN Backhaul'],
          ]),

          createHeading2('4.2 Software Requirements'),
          createTable([
            ['Software Component', 'Specification / Version', 'Functional Role'],
            ['Frontend Framework', 'React.js (v18.3)', 'Component-Driven User Interface Library'],
            ['Build Tooling', 'Vite (v6.0)', 'Rapid Hot-Module Replacement (HMR) Bundler'],
            ['Styling Engine', 'Tailwind CSS (v3.4)', 'Utility-First Responsive Design System'],
            ['Server Runtime', 'Node.js (v20+ LTS / v24)', 'Event-Driven Asynchronous Backend Engine'],
            ['Backend Framework', 'Express.js (v4.21)', 'RESTful Routing & Middleware Architecture'],
            ['Database Engine', 'MongoDB Community / Atlas', 'NoSQL Document Database'],
            ['Object Data Modeling', 'Mongoose (v8.9)', 'Schema Validation & Business Logic Engine'],
            ['Authentication', 'jsonwebtoken (JWT) & bcryptjs', 'Stateless Token Exchange & Password Hashing'],
            ['Testing & Automation', 'Postman Desktop & Puppeteer', 'Automated API Validation & Browser Automation'],
            ['Cloud Deployment', 'Vercel Cloud Platform', 'Serverless Edge Hosting'],
          ]),

          // Page Break to Section 5
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== SECTION 5: FEASIBILITY STUDY ====================
          createHeading1('5.0 SYSTEM ANALYSIS & FEASIBILITY STUDY'),
          createHeading2('5.1 Technical Feasibility'),
          createParagraph(
            'The technical feasibility of MahaConnect is established by leveraging mature web engineering frameworks within the MERN stack. Node.js provides non-blocking, asynchronous I/O capabilities well-suited for an API Gateway coordinating multiple concurrent requests. MongoDB JSON-native document format naturally accommodates the varied schemas required by diverse government services without requiring schema redesigns. React component state model enables responsive multi-step form navigation and dynamic validation.'
          ),

          createHeading2('5.2 Operational Feasibility'),
          createParagraph(
            'The platform reduces operational friction for citizens and officers. Citizens access services through a clean, intuitive interface without requiring specialized training. Department officers work within dedicated scrutiny queues scoped to their department, streamlining review workflows. Administrators gain system visibility through telemetry log tables and operational charts.'
          ),

          createHeading2('5.3 Economic Feasibility'),
          createParagraph(
            'Utilizing open-source technologies (React, Node.js, Express, MongoDB Community) eliminates expensive proprietary software license fees. Deploying through modern serverless platforms like Vercel aligns resource utilization directly with application traffic, keeping hosting and maintenance costs modest for academic and organizational use cases.'
          ),

          // Page Break to Section 6
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== SECTION 6: SYSTEM DESIGN & DATABASE ====================
          createHeading1('6.0 SYSTEM DESIGN, DFD & DATABASE MODELING'),
          createHeading2('6.1 Data Flow Diagrams (DFD)'),
          createParagraph(
            'At Level 0 (Context Level), MahaConnect interfaces between Citizens, Department Officers, State Administrators, and Simulated Department REST microservices. At Level 1, the architecture decomposes into Identity & Session Management (Process 1.0), Service Directory Catalog (Process 2.0), Application Orchestration & Gateway Dispatch (Process 3.0), and Scrutiny, Status Transition & Audit Logging (Process 4.0).'
          ),

          createHeading2('6.2 Database Schema Architecture (Mongoose Models)'),
          createTable([
            ['Collection Name', 'Key Attributes / Fields', 'Relationships & Constraints'],
            ['users', 'name, email, passwordHash, role, department, phone, address, isActive', 'Unique index on email; One-to-Many with applications'],
            ['departments', 'name, code (REV, TRP, EDU), description, icon, activeServicesCount', 'Unique index on code; One-to-Many with services'],
            ['services', 'department (ref), name, description, requiredDocuments, fees, dynamicFields', 'Foreign key to departments; Dynamic JSON schema'],
            ['applications', 'applicationId, citizen, service, department, status, formData, documents, timeline', 'Unique index on applicationId; Timeline audit array'],
            ['apilogs', 'timestamp, source, destination, endpoint, method, statusCode, responseTimeMs', 'Indexed on timestamp; Real-time telemetry'],
            ['notifications', 'recipient, title, message, type, read, relatedApplicationId', 'Indexed on (recipient, read) for fast badge rendering'],
          ]),

          // Page Break to Section 7 & 8
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== SECTION 7: IMPLEMENTATION DETAILS ====================
          createHeading1('7.0 FULL-STACK IMPLEMENTATION DETAILS'),
          createHeading2('7.1 Frontend Architecture (React, Vite & Tailwind CSS)'),
          createParagraph(
            'The frontend client is architected around atomic design principles, featuring modular components, React Router v6 navigation guards, context-driven auth and toast providers, and a dynamic 5-step form generation wizard that parses service schemas from the backend and renders appropriate input controls dynamically.'
          ),

          createHeading2('7.2 Backend Architecture (Node.js & Express REST Gateway)'),
          createParagraph(
            'The backend follows an MVC-Service-Gateway pattern with dedicated routers, middleware security pipelines (helmet, express-rate-limit, cors, JWT verification), controllers for CRUD operations, and an asynchronous departmental dispatch simulator that allocates unique tracking codes and logs telemetry events.'
          ),

          // ==================== SECTION 8: SECURITY ====================
          createHeading1('8.0 SECURITY, CRYPTOGRAPHY & ACCESS CONTROL'),
          createHeading2('8.1 Password Hashing & JWT Bearer Tokens'),
          createParagraph(
            'Passwords are salted and hashed using bcrypt with a computational cost factor of 10 rounds. Authentication sessions are governed by cryptographically signed HMAC-SHA256 JWT tokens containing role and department bindings, eliminating server session storage overhead and enabling horizontal scalability.'
          ),

          createHeading2('8.2 Role-Based Access Control (RBAC) Matrix'),
          createTable([
            ['Resource Endpoint / Operation', 'Public', 'Citizen', 'Department Officer', 'State Admin'],
            ['View Landing Page & Services Catalog', '✔ Allowed', '✔ Allowed', '✔ Allowed', '✔ Allowed'],
            ['Submit New Service Application', '❌ Denied', '✔ Allowed', '❌ Denied', '❌ Denied'],
            ['Upload Supporting Documents', '❌ Denied', '✔ Allowed', '❌ Denied', '❌ Denied'],
            ['View Citizen Application History', '❌ Denied', '✔ Own Only', '❌ Denied', '✔ All'],
            ['Review Department Application Scrutiny', '❌ Denied', '❌ Denied', '✔ Dept Scoped', '✔ All'],
            ['Update Application Status & Remarks', '❌ Denied', '❌ Denied', '✔ Dept Scoped', '✔ Override'],
            ['Manage Departments & Service Schemas', '❌ Denied', '❌ Denied', '❌ Denied', '✔ Full Admin'],
            ['Inspect API Interoperability Gateway Logs', '❌ Denied', '❌ Denied', '❌ Denied', '✔ Full Admin'],
          ]),

          // Page Break to Section 9 & 10
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== SECTION 9: INTEROPERABILITY GATEWAY ====================
          createHeading1('9.0 INTEROPERABILITY GATEWAY & API ROUTING ENGINE'),
          createParagraph(
            'The MahaConnect Interoperability Gateway acts as a central communication bus. It decouples the citizen interface from departmental backend peculiarities, transforms standardized JSON application payloads into department-specific transaction envelopes, simulates realistic network latency (20-65ms), and appends every interaction to the central telemetry ledger.'
          ),

          // ==================== SECTION 10: TESTING ====================
          createHeading1('10.0 TESTING, VERIFICATION & POSTMAN SUITE EXECUTION'),
          createParagraph(
            'Quality assurance was conducted across the stack using Postman Desktop for automated REST API contract verification and Puppeteer for end-to-end browser user journey automation. All critical pathways passed with 100% compliance against functional requirements.'
          ),
          createTable([
            ['Test Case ID', 'Endpoint & HTTP Method', 'Request Description', 'Expected Status', 'Actual Status', 'Result'],
            ['TC-API-01', 'GET /api/departments', 'Fetch all registered active departments', '200 OK', '200 OK', 'PASS'],
            ['TC-API-02', 'POST /api/auth/login', 'Authenticate citizen with valid credentials', '200 OK', '200 OK', 'PASS'],
            ['TC-API-03', 'POST /api/auth/login', 'Attempt authentication with incorrect password', '401 Unauthorized', '401 Unauthorized', 'PASS'],
            ['TC-API-04', 'POST /api/applications', 'Submit valid multi-step application payload', '201 Created', '201 Created', 'PASS'],
            ['TC-API-05', 'GET /api/applications/:id', 'Retrieve application details & timeline', '200 OK', '200 OK', 'PASS'],
            ['TC-API-06', 'PATCH /api/applications/:id/status', 'Officer status update to Approved with remarks', '200 OK', '200 OK', 'PASS'],
            ['TC-API-07', 'DELETE /api/departments/:id', 'Attempt deletion of department with active services', '400 Bad Request', '400 Bad Request', 'PASS'],
            ['TC-API-08', 'GET /api/admin/api-logs', 'Fetch real-time interoperability gateway logs', '200 OK', '200 OK', 'PASS'],
          ]),

          // Page Break to Section 11: SCREENSHOTS
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== SECTION 11: RESULTS & SCREENSHOTS ====================
          createHeading1('11.0 RESULTS, SCREENSHOTS & SYSTEM WALKTHROUGH'),
          createParagraph(
            'This section presents the working user interfaces, RESTful API transactions, database records, and operational views captured directly from the live running MahaConnect application. Each figure is accompanied by an architectural and functional walkthrough.'
          ),

          // FIGURES 1 to 22
          ...createFigure(
            '01_landing_page.png',
            'Figure 1: MahaConnect Public Landing Page & Citizen Gateway',
            'The responsive e-Governance landing page displaying state emblems, key statistical counters, featured departmental services, and unified access links.'
          ),
          ...createFigure(
            '02_login_page.png',
            'Figure 2: Unified Authentication Portal with Seeded Demo Credentials',
            'Secure JWT authentication screen featuring pre-seeded demo credential triggers for Citizen, Transport Officer, and State Administrator accounts for demonstration.'
          ),
          ...createFigure(
            '03_citizen_dashboard.png',
            'Figure 3: Citizen Self-Service Dashboard with Metric Cards & Quick Navigation',
            'Personalized dashboard showing overall application counts, active status breakdowns (Submitted, Under Review, Approved), unread notification badges, and rapid service shortcuts.'
          ),
          ...createFigure(
            '04_government_services.png',
            'Figure 4: Cross-Departmental Government Services Directory with Filtering',
            'Comprehensive catalog displaying services across 7 departments with dynamic search, category filters, required document checklists, and estimated processing timelines.'
          ),
          ...createFigure(
            '05_application_form.png',
            'Figure 5: Dynamic Application Form Wizard: Step 1 (Personal Demographics)',
            'Step 1 of the multi-stage application pipeline pre-populating citizen profile data to avoid repetitive entry across government departments.'
          ),
          ...createFigure(
            '06_form_validation_error.png',
            'Figure 6: Client-Side Form Validation Alert & Error Prevention',
            'Visual feedback and toast alert triggered when mandatory demographic fields are omitted, preventing invalid or malformed data from reaching backend services.'
          ),
          ...createFigure(
            '07_document_upload_review.png',
            'Figure 7: Document Upload & Multi-Format Verification',
            'Step 3 file upload interface supporting PDF, PNG, and JPG attachments with upload progress, category tagging (Aadhaar, PAN, Address Proof), and file removal options.'
          ),
          ...createFigure(
            '08_successful_application_submission.png',
            'Figure 8: Application Submission Confirmation & Unique Reference Generation',
            'Step 5 confirmation screen displaying the newly generated Unified Application ID (MC-2026-000101) alongside the Department Gateway Routing Reference (TRP-2026-68192).'
          ),
          ...createFigure(
            '09_application_tracking_timeline.png',
            'Figure 9: Live Citizen Tracking Timeline with Multi-Stage Progression',
            'Detailed tracking view illustrating the complete chronological lifecycle (Draft → Submitted → Under Review → Approved) with exact timestamps and processing remarks.'
          ),
          ...createFigure(
            '10_officer_dashboard.png',
            'Figure 10: Department Officer Scrutiny Console & Pending Application Queue',
            'Role-scoped officer console filtering applications belonging to the Transport Department, displaying urgency indicators and pending scrutiny workloads.'
          ),
          ...createFigure(
            '11_officer_application_review.png',
            'Figure 11: Officer Application Scrutiny Dossier with Inline Document Viewer',
            'Scrutiny screen allowing the departmental officer to inspect submitted personal details, service-specific parameters, and preview uploaded citizen proof documents.'
          ),
          ...createFigure(
            '12_updated_application_status.png',
            'Figure 12: Officer Status Transition Pipeline & Remarks Endorsement',
            'Officer action interface recording official remarks ("All biometric tests and identity proofs verified by RTO Inspector") and transitioning status to Approved with audit logging.'
          ),
          ...createFigure(
            '13_admin_dashboard.png',
            'Figure 13: State Administrator Governance Dashboard & Interoperability KPIs',
            'Administration cockpit showing system-wide application volume, departmental performance metrics, active user registrations, and overall gateway operational health.'
          ),
          ...createFigure(
            '14_department_management.png',
            'Figure 14: State Department Management Console & Endpoint Configuration',
            'Administrative table listing all 7 state departments, their departmental codes, contact emails, active service counts, and operational status toggles.'
          ),
          ...createFigure(
            '15_service_management.png',
            'Figure 15: Service Schema Configuration & Dynamic Field Definition',
            'Catalog management console enabling administrators to configure state public services, upload document requirements, and define dynamic JSON-schema input fields.'
          ),
          ...createFigure(
            '16_api_interoperability_logs.png',
            'Figure 16: REST API Interoperability Gateway Logs & Modal Payload Inspector',
            'Administrative telemetry ledger capturing cross-departmental API calls, with a modal inspector displaying HTTP status codes, response latencies (ms), and JSON payloads.'
          ),
          ...createFigure(
            '17_postman_get_request.png',
            'Figure 17: Postman Test Suite: GET /api/departments (Status 200 OK)',
            'Validation of the departmental directory REST endpoint returning all 7 state departments with JSON schemas and active service counts in 24 ms.'
          ),
          ...createFigure(
            '18_postman_post_request.png',
            'Figure 18: Postman Test Suite: POST /api/auth/login (JWT Token Generation)',
            'Authentication endpoint test verifying bcrypt password verification and generation of a cryptographically signed HMAC-SHA256 JWT bearer token.'
          ),
          ...createFigure(
            '19_postman_put_patch_request.png',
            'Figure 19: Postman Test Suite: PATCH /api/applications/:id/status',
            'Automated status transition call demonstrating the officer approval workflow, timeline appending, and departmental gateway synchronization in 44 ms.'
          ),
          ...createFigure(
            '20_postman_delete_request.png',
            'Figure 20: Postman Test Suite: DELETE /api/departments/:id (Integrity Check)',
            'Integrity protection validation returning 400 Bad Request to prevent deletion of departments possessing active public services and ongoing citizen applications.'
          ),
          ...createFigure(
            '21_mongodb_records.png',
            'Figure 21: MongoDB Shell (mongosh) Collection & Query Ledger Inspection',
            'Live database terminal view displaying the 6 core collections (apilogs, applications, departments, notifications, services, users) and formatted query records.'
          ),
          ...createFigure(
            '22_final_working_application.png',
            'Figure 22: MahaConnect Multi-Portal System Overview (Pawan Mishra & Samarth Nivadunge, Sem V)',
            'Composite presentation showcase illustrating the tri-portal architecture (Citizen Hub, Officer Console, Admin Gateway) and the full MERN stack integration.'
          ),

          // Page Break to Section 12, 13, 14
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== SECTION 12: CONCLUSION ====================
          createHeading1('12.0 CONCLUSION & FUTURE ENHANCEMENTS'),
          createHeading2('12.1 Project Conclusion'),
          createParagraph(
            'The MahaConnect – Government Platform Interoperability System capstone project successfully demonstrates how modern web technologies and API Gateway architectures can bridge fragmented public service portals into a unified single-window experience. By implementing the complete application on the MERN stack, the project provides an accessible, cohesive interface without requiring invasive redesigns of backend departmental structures.'
          ),
          createParagraph('Key accomplishments realized in this project include:'),
          createBullet('Universal citizen single-sign-on and profile synchronization, reducing duplicate data entry.'),
          createBullet('Dynamic 5-step form generation wizard accommodating varying service parameters through JSON schemas.'),
          createBullet('Simulated RESTful Interoperability Gateway that records telemetry logs for cross-departmental exchanges.'),
          createBullet('Role-based access control protecting Citizen, Officer, and Admin data partitions.'),
          createBullet('Cloud deployment on Vercel backed by MongoDB.'),

          createHeading2('12.2 Future Enhancements'),
          createParagraph('Future development roadmaps for MahaConnect incorporate:'),
          createBullet('DigiLocker & National e-KYC Integration for automated document verification.'),
          createBullet('Distributed Audit Ledger for tamper-evident inter-departmental transaction tracking.'),
          createBullet('AI-Assisted Citizen Guidance to help citizens identify eligible government schemes.'),
          createBullet('Multilingual Accessibility supporting Marathi, Hindi, and English regional dialects.'),

          // ==================== SECTION 13: REFERENCES ====================
          createHeading1('13.0 REFERENCES & ACADEMIC BIBLIOGRAPHY'),
          createBullet('National e-Governance Division (NeGD), MeitY, Government of India. e-Governance Interoperability Framework for India (e-GIF), 2021.'),
          createBullet('Fielding, Roy Thomas. Architectural Styles and the Design of Network-based Software Architectures. Doctoral dissertation, UC Irvine, 2000.'),
          createBullet('Chodorow, Kristina. MongoDB: The Definitive Guide: Powerful and Scalable Data Storage. 3rd Edition, O\'Reilly Media, 2020.'),
          createBullet('Banks, Alex and Porcello, Eve. Learning React: Modern Patterns for Developing React Apps. 2nd Edition, O\'Reilly Media, 2020.'),
          createBullet('Haverbeke, Marijn. Eloquent JavaScript: A Modern Introduction to Programming. 3rd Edition, No Starch Press, 2018.'),
          createBullet('Rescorla, Eric. The Transport Layer Security (TLS) Protocol Version 1.3. RFC 8446, IETF, 2018.'),
          createBullet('Jones, Michael et al. JSON Web Token (JWT). RFC 7519, IETF, 2015.'),
          createBullet('W3C Web Accessibility Initiative (WAI). Web Content Accessibility Guidelines (WCAG) 2.1, 2018.'),

          // ==================== SECTION 14: APPENDIX ====================
          createHeading1('14.0 APPENDIX: SOURCE CODE HIGHLIGHTS & API SCHEMA'),
          createHeading2('14.1 Core REST Controller: Application Dispatcher'),
          createParagraph(
            'The core dispatch engine handles incoming applications, computes unique state identifiers, allocates department gateway references, appends audit trail events, and records API telemetry in the MongoDB database.'
          ),
          createHeading2('14.2 Deployment & Reproduction Instructions'),
          createBullet('1. Clone Repository: git clone https://github.com/pawan120307/MahaConnect.git'),
          createBullet('2. Install Dependencies: npm run install:all'),
          createBullet('3. Seed Database: npm run seed --prefix server'),
          createBullet('4. Launch Backend: npm run server (port 5001)'),
          createBullet('5. Launch Frontend: npm run client (port 5173)'),
          createBullet('6. Access Live Cloud URL: https://mahaconnect-rose.vercel.app'),
          createBullet('7. GitHub Repository: https://github.com/pawan120307/MahaConnect'),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUTPUT_DOCX_PRIMARY, buffer);
  console.log('✅ PRIMARY DOCX REPORT GENERATED: ' + OUTPUT_DOCX_PRIMARY);

  fs.writeFileSync(OUTPUT_DOCX_ORIGINAL, buffer);
  console.log('✅ ORIGINAL DOCX REPORT UPDATED: ' + OUTPUT_DOCX_ORIGINAL);
}

buildDocx().catch((err) => {
  console.error('Error generating DOCX report:', err);
  process.exit(1);
});
