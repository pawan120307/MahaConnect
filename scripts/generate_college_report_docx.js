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
const OUTPUT_DOCX = path.join(
  __dirname,
  '../MahaConnect_Capstone_Report_Pawan_Mishra_Samarth_Nivadunge_Sem5.docx'
);

function getImageBuffer(filename) {
  const filePath = path.join(SCREENSHOTS_DIR, filename);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath);
  }
  return null;
}

function createChapterTitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 280, after: 180 },
    children: [
      new TextRun({
        text,
        bold: true,
        font: 'Arial',
        size: 28,
        color: '000000',
      }),
    ],
  });
}

function createHeading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({
        text,
        bold: true,
        font: 'Arial',
        size: 24,
        color: '0f2b48',
      }),
    ],
  });
}

function createHeading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 140, after: 60 },
    children: [
      new TextRun({
        text,
        bold: true,
        font: 'Arial',
        size: 21,
        color: '1e293b',
      }),
    ],
  });
}

function createParagraph(text, isJustified = true, isIndented = true) {
  return new Paragraph({
    children: [new TextRun({ text, font: 'Times New Roman', size: 22 })],
    alignment: isJustified ? AlignmentType.JUSTIFIED : AlignmentType.LEFT,
    indent: isIndented ? { firstLine: 400 } : undefined,
    spacing: { after: 110, line: 340 },
  });
}

function createBullet(text) {
  return new Paragraph({
    children: [new TextRun({ text: '•  ' + text, font: 'Times New Roman', size: 22 })],
    alignment: AlignmentType.JUSTIFIED,
    indent: { left: 450 },
    spacing: { after: 60, line: 320 },
  });
}

function createFigure(filename, caption, description = '') {
  const buf = getImageBuffer(filename);
  const elements = [];

  if (buf) {
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 30 },
        children: [
          new ImageRun({
            data: buf,
            transformation: {
              width: 470,
              height: 220,
            },
          }),
        ],
      })
    );
  }

  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 20 },
      children: [
        new TextRun({
          text: caption,
          bold: true,
          font: 'Arial',
          size: 17,
          color: '000000',
        }),
      ],
    })
  );

  if (description) {
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: description,
            italics: true,
            font: 'Times New Roman',
            size: 15,
            color: '475569',
          }),
        ],
      })
    );
  }

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
          shading: isHeader ? { fill: 'f1f5f9' } : rIndex % 2 === 0 ? { fill: 'f8fafc' } : undefined,
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: cellText,
                  bold: isHeader,
                  color: '000000',
                  font: isHeader ? 'Arial' : 'Times New Roman',
                  size: 19,
                }),
              ],
              spacing: { before: 60, after: 60 },
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
      top: { style: BorderStyle.SINGLE, size: 1, color: '475569' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: '475569' },
      left: { style: BorderStyle.SINGLE, size: 1, color: '475569' },
      right: { style: BorderStyle.SINGLE, size: 1, color: '475569' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'cbd5e1' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'cbd5e1' },
    },
  });
}

async function buildDocx() {
  console.log('📝 Building college-style DOCX report for ZSCT Thakur College...');

  const doc = new Document({
    creator: 'Pawan Mishra & Samarth Nivadunge',
    title: 'MahaConnect: Government Platform Interoperability System',
    description: 'BSc IT Capstone Project Report - ZSCT Thakur Shyamnarayan Degree College',
    styles: {
      default: {
        document: {
          run: {
            font: 'Times New Roman',
            size: 22,
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
        children: [
          // ==================== COVER PAGE ====================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 60 },
            children: [
              new TextRun({
                text: 'A CAPSTONE PROJECT REPORT ON',
                font: 'Arial',
                size: 20,
                bold: true,
                color: '475569',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 80 },
            children: [
              new TextRun({
                text: 'MAHACONNECT:\nGOVERNMENT PLATFORM INTEROPERABILITY SYSTEM',
                font: 'Arial',
                size: 30,
                bold: true,
                color: '000000',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 260 },
            children: [
              new TextRun({
                text: 'A Unified Multi-Departmental e-Governance Integration Architecture',
                font: 'Arial',
                size: 20,
                color: '1e3a8a',
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: 'Submitted in partial fulfillment of the requirements for the award of the Degree of',
                font: 'Times New Roman',
                size: 20,
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 30 },
            children: [
              new TextRun({
                text: 'BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY (BSc IT)',
                font: 'Arial',
                size: 22,
                bold: true,
                color: '000000',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: '(Full Stack Development & Management – FSDM)',
                font: 'Arial',
                size: 18,
                color: '64748b',
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 30 },
            children: [
              new TextRun({
                text: 'SUBMITTED BY:',
                font: 'Arial',
                size: 19,
                bold: true,
                color: '000000',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 10 },
            children: [
              new TextRun({
                text: 'PAWAN MISHRA',
                font: 'Arial',
                size: 25,
                bold: true,
                color: '000000',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: 'Roll No: 202402104',
                font: 'Courier New',
                size: 19,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 10 },
            children: [
              new TextRun({
                text: 'SAMARTH NIVADUNGE',
                font: 'Arial',
                size: 25,
                bold: true,
                color: '000000',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: 'Roll No: 202402111',
                font: 'Courier New',
                size: 19,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 140 },
            children: [
              new TextRun({
                text: 'Class: TY BSc IT • Semester V',
                font: 'Times New Roman',
                size: 20,
                bold: true,
                color: '0f2b48',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 20 },
            children: [
              new TextRun({
                text: 'UNDER THE GUIDANCE OF:',
                font: 'Arial',
                size: 18,
                bold: true,
                color: '000000',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'MR. PRATHARV SURVE',
                font: 'Arial',
                size: 22,
                bold: true,
                color: '000000',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 20 },
            children: [
              new TextRun({
                text: 'DEPARTMENT OF INFORMATION TECHNOLOGY',
                font: 'Arial',
                size: 20,
                bold: true,
                color: '000000',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 20 },
            children: [
              new TextRun({
                text: "ZSCT'S THAKUR SHYAMNARAYAN DEGREE COLLEGE",
                font: 'Arial',
                size: 21,
                bold: true,
                color: '000000',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: '(Affiliated to University of Mumbai)\nMUMBAI – MAHARASHTRA – 400101',
                font: 'Times New Roman',
                size: 18,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: 'Academic Year: 2026 – 2027',
                font: 'Times New Roman',
                size: 20,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'Production Deployment URL: https://mahaconnect-rose.vercel.app',
                font: 'Courier New',
                size: 17,
                bold: true,
                color: '1e3a8a',
              }),
            ],
          }),

          // Page Break to Certificate
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CERTIFICATE ====================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 20 },
            children: [
              new TextRun({
                text: "ZSCT'S THAKUR SHYAMNARAYAN DEGREE COLLEGE",
                font: 'Arial',
                size: 23,
                bold: true,
                color: '000000',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 20 },
            children: [
              new TextRun({
                text: '(Affiliated to University of Mumbai)\nMUMBAI – MAHARASHTRA – 400101',
                font: 'Times New Roman',
                size: 17,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 140 },
            children: [
              new TextRun({
                text: 'DEPARTMENT OF INFORMATION TECHNOLOGY',
                font: 'Arial',
                size: 19,
                bold: true,
                color: '0f2b48',
              }),
            ],
          }),
          createChapterTitle('CERTIFICATE'),
          createParagraph(
            'This is to certify that the project entitled "MahaConnect: Government Platform Interoperability System" is a bonafide work carried out by Pawan Mishra (Roll No: 202402104) and Samarth Nivadunge (Roll No: 202402111) in partial fulfillment of the requirements for the degree of Bachelor of Science in Information Technology (TY BSc IT), during the academic year 2026–2027.',
            true,
            false
          ),
          createParagraph(
            'The candidates have completed the project work under the guidance of Mr. Pratharv Surve (Project Guide) and the Department of Information Technology, demonstrating a comprehensive understanding of full-stack MERN web engineering, RESTful API interoperability, role-based access control, and asynchronous citizen service automation.',
            true,
            false
          ),
          new Paragraph({ spacing: { before: 450 } }),
          createTable([
            ['MR. PRATHARV SURVE', 'HEAD OF DEPARTMENT', 'PRINCIPAL'],
            ['Project Guide\nDept. of Information Technology', 'Dept. of Information Technology', 'Thakur Shyamnarayan Degree College'],
          ]),

          // Page Break to Declaration
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== DECLARATION ====================
          createChapterTitle('DECLARATION'),
          createParagraph(
            'We, Pawan Mishra and Samarth Nivadunge, hereby declare that the capstone project report entitled "MahaConnect – Government Platform Interoperability System", submitted to the Department of Information Technology in partial fulfillment of the requirements for the award of the Degree of Bachelor of Science in Information Technology (TY BSc IT), is an authentic record of original work carried out by us under institutional academic guidance.',
            true,
            false
          ),
          createParagraph(
            'We further declare that this report has not been submitted either concurrently or previously to any other university, college, or examination board for the award of any degree or diploma. All external libraries, architectural design patterns, research papers, and technical standards cited throughout this document have been duly acknowledged in the references section.',
            true,
            false
          ),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 180, after: 180 },
            children: [
              new TextRun({ text: 'PAWAN MISHRA\n', bold: true }),
              new TextRun({ text: 'Roll No: 202402104\n\n' }),
              new TextRun({ text: 'SAMARTH NIVADUNGE\n', bold: true }),
              new TextRun({ text: 'Roll No: 202402111\n\n' }),
              new TextRun({ text: 'TY BSc IT • Semester V\n', bold: true }),
              new TextRun({ text: 'Date: October 2026' }),
            ],
          }),

          // Page Break to Acknowledgement
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== ACKNOWLEDGEMENT ====================
          createChapterTitle('ACKNOWLEDGEMENT'),
          createParagraph(
            'We express our sincere gratitude to the University of Mumbai and ZSCT\'s Thakur Shyamnarayan Degree College, Department of Information Technology, for providing us with the opportunity to undertake this capstone project.',
            true,
            false
          ),
          createParagraph(
            'We are deeply thankful to our Principal, Head of the Department, and faculty members for their continuous institutional encouragement, valuable suggestions, and constructive feedback throughout the development lifecycle of MahaConnect.',
            true,
            false
          ),
          createParagraph(
            'We express our sincere and heartfelt appreciation to our project guide, Mr. Pratharv Surve, for his invaluable mentorship, rigorous technical supervision, architectural review, and continuous encouragement across all phases of MERN stack integration, RESTful API design, database modeling, and government platform interoperability simulation.',
            true,
            false
          ),
          createParagraph(
            'We are also grateful to our classmates, friends, family members, and everyone who directly or indirectly supported us during the planning, development, testing, documentation, and completion of this project.',
            true,
            false
          ),
          createParagraph(
            'Finally, we express our sincere thanks to everyone who contributed to the successful completion of our capstone project, "MahaConnect: Government Platform Interoperability System."',
            true,
            false
          ),

          // Page Break to Abstract
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== ABSTRACT ====================
          createChapterTitle('ABSTRACT'),
          createParagraph(
            'In contemporary public administration, citizens frequently encounter severe friction when navigating public services due to deep architectural silos across government departments. Traditional e-Governance infrastructures operate as isolated, monolithic islands where citizens are subjected to redundant demographic data submissions, disparate authentication credentials, uncoordinated document verifications, and fragmented tracking mechanisms.'
          ),
          createParagraph(
            'To address these systemic inefficiencies, this capstone project designs and implements MahaConnect—a full-stack Government Platform Interoperability System developed using the MERN stack (MongoDB, Express.js, React, Node.js) paired with Vite, Tailwind CSS, JSON Web Token (JWT) role-based authorization, and a simulated Government Interoperability Service Layer.'
          ),
          createParagraph(
            'MahaConnect demonstrates how an asynchronous, single-window citizen portal can seamlessly bridge multiple autonomous administrative departments: Revenue, Transport, Education, Municipal Corporation, Employment, Social Welfare, and Urban Development. The platform introduces a single-window citizen portal, a departmental interoperability service layer, a department officer scrutiny console, a state administrator monitoring cockpit, and a standardized RESTful API communication pipeline.'
          ),

          // Page Break to TOC
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== TABLE OF CONTENTS ====================
          createChapterTitle('TABLE OF CONTENTS'),
          createTable([
            ['Sr. No.', 'Content / Chapter Title', 'Page No.'],
            ['1.0', 'CHAPTER 1 – INTRODUCTION', '1'],
            ['2.0', 'CHAPTER 2 – LITERATURE REVIEW & EXISTING SYSTEMS', '3'],
            ['3.0', 'CHAPTER 3 – SYSTEM ARCHITECTURE & INTEROPERABILITY MODEL', '4'],
            ['4.0', 'CHAPTER 4 – SYSTEM REQUIREMENTS & TECHNOLOGIES USED', '7'],
            ['5.0', 'CHAPTER 5 – SYSTEM ANALYSIS & FEASIBILITY STUDY', '8'],
            ['6.0', 'CHAPTER 6 – SYSTEM DESIGN, DFD & DATABASE MODELING', '9'],
            ['7.0', 'CHAPTER 7 – FULL-STACK IMPLEMENTATION DETAILS', '12'],
            ['8.0', 'CHAPTER 8 – SECURITY, CRYPTOGRAPHY & ACCESS CONTROL', '13'],
            ['9.0', 'CHAPTER 9 – TESTING & VALIDATION', '14'],
            ['10.0', 'CHAPTER 10 – RESULTS, CONCLUSION & FUTURE SCOPE', '15'],
            ['11.0', 'PROJECT SCREENSHOTS & IMPLEMENTATION PHOTOS', '16'],
            ['12.0', 'PROJECT DETAILS PAGE', '27'],
            ['13.0', 'REFERENCES / BIBLIOGRAPHY', '28'],
          ]),

          // Page Break to List of Figures
          new Paragraph({ children: [new PageBreak()] }),

          createChapterTitle('LIST OF FIGURES'),
          createTable([
            ['Figure No.', 'Figure Title', 'Page No.'],
            ['Figure 1', 'MahaConnect System Architecture Diagram', '4'],
            ['Figure 2', 'Gateway Interoperability Sequence Flow', '5'],
            ['Figure 3', 'Data Flow Diagram (DFD Level 0 – Context Diagram)', '9'],
            ['Figure 4', 'Data Flow Diagram (DFD Level 1 – Functional Decomposition)', '10'],
            ['Figure 5', 'Database Entity-Relationship (ER) Model', '10'],
            ['Figure 6', 'MahaConnect Public Landing Page & Citizen Gateway', '16'],
            ['Figure 7', 'Unified Authentication Portal with Seeded Demo Credentials', '16'],
            ['Figure 8', 'Citizen Self-Service Dashboard with Metric Cards & Quick Navigation', '17'],
            ['Figure 9', 'Cross-Departmental Government Services Directory with Filtering', '17'],
            ['Figure 10', 'Dynamic Application Form Wizard: Step 1 (Personal Demographics)', '18'],
            ['Figure 11', 'Client-Side Form Validation Alert & Error Prevention', '18'],
            ['Figure 12', 'Document Upload & Multi-Format Verification', '19'],
            ['Figure 13', 'Application Submission Confirmation & Unique Reference Generation', '19'],
            ['Figure 14', 'Live Citizen Tracking Timeline with Multi-Stage Progression', '20'],
            ['Figure 15', 'Department Officer Scrutiny Console & Pending Application Queue', '20'],
            ['Figure 16', 'Officer Application Scrutiny Dossier with Inline Document Viewer', '21'],
            ['Figure 17', 'Officer Status Transition Pipeline & Remarks Endorsement', '21'],
            ['Figure 18', 'State Administrator Governance Dashboard & Interoperability KPIs', '22'],
            ['Figure 19', 'State Department Management Console & Endpoint Configuration', '22'],
            ['Figure 20', 'Service Schema Configuration & Dynamic Field Definition', '23'],
            ['Figure 21', 'REST API Interoperability Gateway Logs & Modal Payload Inspector', '23'],
            ['Figure 22', 'Postman Test Suite: GET /api/departments (Status 200 OK)', '24'],
            ['Figure 23', 'Postman Test Suite: POST /api/auth/login (JWT Token Generation)', '24'],
            ['Figure 24', 'Postman Test Suite: PATCH /api/applications/:id/status', '25'],
            ['Figure 25', 'Postman Test Suite: DELETE /api/departments/:id (Integrity Check)', '25'],
            ['Figure 26', 'MongoDB Shell (mongosh) Collection & Query Ledger Inspection', '26'],
            ['Figure 27', 'MahaConnect Final Working Multi-Portal Application Showcase', '26'],
          ]),

          // Page Break to List of Tables
          new Paragraph({ children: [new PageBreak()] }),

          createChapterTitle('LIST OF TABLES'),
          createTable([
            ['Table No.', 'Table Title', 'Page No.'],
            ['Table 1', 'Comparative Analysis of Existing Systems vs. MahaConnect', '3'],
            ['Table 2', 'User Roles and Permission Scopes', '5'],
            ['Table 3', 'Simulated Government Departments in MahaConnect', '6'],
            ['Table 4', 'Application Status Lifecycle States', '6'],
            ['Table 5', 'Hardware Requirements Specification', '7'],
            ['Table 6', 'Software Requirements Specification', '7'],
            ['Table 7', 'Database Collections & Schema Constraints', '11'],
            ['Table 8', 'Core REST API Endpoints Specification', '12'],
            ['Table 9', 'Role-Based Access Control (RBAC) Permission Matrix', '13'],
            ['Table 10', 'Automated Postman Test Case Execution Matrix', '14'],
          ]),

          // Page Break to Chapter 1
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 1 ====================
          createChapterTitle('CHAPTER 1 – INTRODUCTION'),
          createHeading2('1.1 Project Overview'),
          createParagraph(
            'In modern state administration, electronic governance (e-Governance) represents the primary conduit through which government entities interact with the public. Historically, state departments developed digital systems in isolation to automate their internal departmental tasks. Consequently, individual entities—such as the Transport Department, the Revenue Department, the Department of School and Higher Education, Municipal Corporations, and the Department of Social Welfare—operate separate platforms with distinct databases, differing authentication protocols, and non-communicating network interfaces.'
          ),
          createParagraph(
            'MahaConnect is conceptualized and engineered to address this fragmentation. Designed as a full-stack e-Governance platform built on the modern MERN stack (MongoDB, Express.js, React, Node.js), MahaConnect serves as a unified digital bridge connecting citizens and government departments. The platform facilitates single-sign-on (SSO) authenticated access, cross-departmental service browsing, dynamic multi-step application filing, document archiving, transparent real-time tracking, and automated inter-departmental API routing.'
          ),

          createHeading2('1.2 Problem Statement'),
          createParagraph(
            'The primary challenge addressed by MahaConnect is the presence of functional information silos in public administration. When a citizen requires a set of related government services (for example, applying for a college scholarship which requires an Income Certificate from Revenue, a Caste Certificate from Social Welfare, and an Enrollment Verification from Higher Education), the citizen is compelled to create multiple logins, repeatedly enter identical demographic records, physically upload duplicate proof documents, and monitor disjointed tracking numbers.'
          ),

          createHeading2('1.3 Project Objectives'),
          createParagraph('The primary engineering and operational objectives of MahaConnect include:'),
          createBullet('Single-Window Citizen Portal: Develop a unified, responsive React interface allowing citizens to access state services through a single authenticated session.'),
          createBullet('Microservices & Gateway Interoperability: Implement an API Gateway architecture using Node.js and Express.js middleware that acts as an intelligent intermediary, translating unified citizen requests into department-specific schemas.'),
          createBullet('Dynamic Multi-Step Form Engine: Construct a schema-driven form wizard that dynamically renders inputs based on the target service JSON parameter specification.'),
          createBullet('Cross-Departmental Document Abstraction: Provide a standardized document upload and verification pipeline supporting multi-format attachments with validation.'),
          createBullet('Transparent Real-Time Status Tracking: Render interactive visual milestone timelines depicting every lifecycle state from initial submission to final officer disposition.'),
          createBullet('Role-Based Access Control (RBAC): Enforce cryptographically secured authorization separating Citizens, Department Officers, and State Administrators.'),
          createBullet('Audit Telemetry & Gateway Ledger: Maintain a MongoDB audit log recording every API transaction, source-destination routing path, HTTP status code, and latency metrics.'),

          createHeading2('1.4 Scope and Applicability'),
          createParagraph(
            'The scope of this project encompasses the lifecycle of simulated government service delivery within a state ecosystem. It models seven core government departments: Revenue, Transport, Education, Municipal Corporation, Employment, Social Welfare, and Urban Development. As an academic capstone implementation for TY BSc IT Semester V, downstream departmental APIs are simulated through a dedicated service layer, while the RESTful contracts, payload schemas, security tokens, and routing controllers are designed to reflect real-world architectural principles.'
          ),

          createHeading2('1.5 Significance of the Project'),
          createParagraph(
            'The MahaConnect project demonstrates how modern web technologies can mitigate procedural overhead in public administration. By decoupling the citizen interface from departmental backend peculiarities through an API Gateway, the system proves that digital interoperability can be attained without necessitating disruptive replacements of existing departmental infrastructure.'
          ),

          // Page Break to Chapter 2
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 2 ====================
          createChapterTitle('CHAPTER 2 – LITERATURE REVIEW & EXISTING SYSTEMS'),
          createHeading2('2.1 Traditional Siloed Governance Models'),
          createParagraph(
            'Early e-Governance initiatives focused on digitizing individual departmental workflows in isolation. While this computerization replaced paper registers, it created digital silos. Research into public sector software architectures indicates that siloed systems suffer from data redundancy, inconsistent state records, repetitive administrative workloads, and difficulty in cross-verifying applicant eligibility across department boundaries.'
          ),

          createHeading2('2.2 Existing e-Governance Platforms'),
          createParagraph(
            'Various state and national portals currently provide digital citizen services. In India, platforms such as DigiLocker, UMANG, and state-level portals (e.g., Aaple Sarkar) have made substantial progress toward service aggregation. However, many existing state portals still rely on redirected web links to separate legacy departmental engines, meaning the user experience remains non-uniform and data entry is still frequently duplicated across forms.'
          ),

          createHeading2('2.3 Interoperability in Government Systems'),
          createParagraph(
            'Interoperability in distributed software systems refers to the capability of heterogeneous systems to exchange data according to standard formats and protocols. The Ministry of Electronics and Information Technology (MeitY) published the e-Governance Interoperability Framework for India (e-GIF), emphasizing open standards, JSON/REST data exchange, metadata directories, and service-oriented architectures. MahaConnect adopts these foundational principles by establishing an API Gateway that abstracts departmental protocols behind unified REST interfaces.'
          ),

          createHeading2('2.4 Limitations of Existing Approaches'),
          createBullet('Non-standardized Payloads: Each departmental portal requires custom parameter formats, preventing automated validation.'),
          createBullet('Fragmented Status Tracking: Applicants receive distinct tracking identifiers per department with no centralized timeline.'),
          createBullet('Lack of Real-Time API Telemetry: System administrators have limited visibility into cross-departmental communication bottlenecks or error rates.'),

          createHeading2('2.5 Proposed MahaConnect Approach'),
          createParagraph(
            'MahaConnect introduces an intelligent API Gateway layer that unifies citizen identity, dynamically compiles application schemas, coordinates simulated departmental microservices, and maintains an immutable audit ledger of all inter-departmental transactions.'
          ),
          createTable([
            ['Dimension', 'Legacy Department Portals', 'Centralized Monoliths', 'MahaConnect System'],
            ['Architecture', 'Isolated Siloed Servers', 'Monolithic Relational DB', 'Modern MERN Gateway Model'],
            ['User Experience', 'Multiple Logins & Portals', 'Rigid Single Interface', 'Responsive React SPA + Tailwind CSS'],
            ['Interoperability', 'None (Paper Bridge)', 'Database Stored Procedures', 'RESTful Interoperability Gateway'],
            ['Schema Flexibility', 'Hardcoded Database Tables', 'Static Database Schemas', 'Dynamic JSON-Schema Service Builder'],
            ['Audit & Telemetry', 'Fragmented Text Logs', 'Standard Database Triggers', 'Real-Time ApiLog Audit Ledger'],
            ['Deployment Model', 'Dedicated Local Servers', 'Central Government Data Center', 'Cloud Serverless (Vercel) + MongoDB'],
          ]),

          // Page Break to Chapter 3
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 3 ====================
          createChapterTitle('CHAPTER 3 – SYSTEM ARCHITECTURE & INTEROPERABILITY MODEL'),
          createHeading2('3.1 High-Level Architectural Paradigm'),
          createParagraph(
            'MahaConnect utilizes a multi-tiered, decoupled client-server architecture designed around microservices and API Gateway integration principles. The architectural flow operates from React Frontend to Express Gateway to Simulated Interoperability Layer to MongoDB.'
          ),
          ...createFigure('00_architecture_diagram.png', 'Figure 1: MahaConnect System Architecture Diagram'),

          createHeading2('3.2 Gateway Interoperability Sequence Flow'),
          createParagraph(
            'When a citizen submits an application, the request transitions through a standardized eight-step gateway sequence: token verification, schema validation, departmental dispatch, reference token allocation, database persistence, telemetry recording, citizen notification, and JSON acknowledgement.'
          ),
          ...createFigure('00_gateway_sequence.png', 'Figure 2: Gateway Interoperability Sequence Flow'),

          createHeading2('3.3 MERN Architecture & Layer Separation'),
          createParagraph(
            'The MERN technology stack provides a cohesive JavaScript/JSON runtime across both client and server tiers: React 18 frontend, Express.js backend on Node.js, and MongoDB document database using Mongoose ODM.'
          ),
          createTable([
            ['User Role', 'Primary Capabilities', 'Access Scope'],
            ['Citizen', 'Profile management, service browsing, application filing, document uploads, real-time status tracking', 'Personal profile and owned application records'],
            ['Department Officer', 'Application scrutiny, document verification, approval/rejection, formal remarks logging', 'Applications scoped to assigned department'],
            ['State Administrator', 'Department provisioning, service catalog configuration, user management, telemetry monitoring', 'System-wide administrative authority'],
          ]),

          createHeading2('3.4 Departmental Interoperability Model'),
          createTable([
            ['Department Name', 'Code', 'Representative Services', 'Simulated Gateway Endpoint'],
            ['Revenue Department', 'REV', 'Income Certificate, Caste Certificate', '/api/v1/revenue/inbound'],
            ['Transport Department (RTO)', 'TRP', 'New Driving Licence, Licence Renewal', '/api/v1/transport/inbound'],
            ['Education Department', 'EDU', 'Higher Education Scholarship, Bonafide', '/api/v1/education/inbound'],
            ['Municipal Corporation', 'MUN', 'Birth Certificate, Property Tax Assessment', '/api/v1/municipal/inbound'],
            ['Employment Department', 'EMP', 'Employment Registration, Skill Portal', '/api/v1/employment/inbound'],
            ['Social Welfare', 'SOC', 'Disability Pension, Senior Citizen Card', '/api/v1/social/inbound'],
            ['Urban Development', 'URB', 'Zoning Verification, Water Connection', '/api/v1/urban/inbound'],
          ]),

          createHeading2('3.5 Application Status Lifecycle'),
          createTable([
            ['Status State', 'Trigger Event', 'Responsible Actor', 'Citizen Notification'],
            ['Draft', 'Citizen starts application form', 'Citizen', 'None (Local draft)'],
            ['Submitted', 'Citizen confirms and submits', 'Gateway Dispatcher', 'Submission Confirmation'],
            ['Under Review', 'Officer opens application dossier', 'Department Officer', 'Review in progress'],
            ['Info Required', 'Officer requests document clarification', 'Department Officer', 'Action required alert'],
            ['Approved', 'Officer validates proofs and signs off', 'Department Officer', 'Approval certificate alert'],
            ['Rejected', 'Officer detects discrepancy with remarks', 'Department Officer', 'Rejection reason alert'],
            ['Completed', 'Final service delivery executed', 'Gateway / Officer', 'Completion confirmation'],
          ]),

          // Page Break to Chapter 4
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 4 ====================
          createChapterTitle('CHAPTER 4 – SYSTEM REQUIREMENTS & TECHNOLOGIES USED'),
          createHeading2('4.1 Functional Requirements'),
          createBullet('User Authentication: Secure registration and login using JWT tokens and bcrypt password hashing.'),
          createBullet('Role-Based Routing: Restrict portal routes based on verified user roles (Citizen, Officer, Admin).'),
          createBullet('Service Browsing & Filtering: Categorized directory of government services with search and department filtering.'),
          createBullet('Dynamic Multi-Step Form Submission: Step-by-step form capturing personal demographics, service-specific fields, and file uploads.'),
          createBullet('Real-Time Application Tracking: Visual milestone tracker illustrating chronological status updates and officer remarks.'),
          createBullet('Department Scrutiny Workflow: Interface for officers to inspect applicant records, view uploaded files, and update status.'),
          createBullet('Centralized Administration: Manage departments, configure services, and inspect API telemetry logs.'),

          createHeading2('4.2 Non-Functional Requirements'),
          createBullet('Usability: Responsive design supporting desktop, tablet, and mobile viewports via Tailwind CSS.'),
          createBullet('Performance: Sub-100ms API response latency for cached lookups and sub-200ms for application writes.'),
          createBullet('Security: Stateless JWT verification, input sanitization, HTTP security headers (Helmet), and CORS enforcement.'),
          createBullet('Reliability: Centralized error-handling middleware preventing server crashes during malformed requests.'),
          createBullet('Maintainability: Modular codebase separating controllers, routes, middleware, and database models.'),

          createHeading2('4.3 Hardware Requirements'),
          createTable([
            ['Component', 'Minimum Development Specification', 'Recommended Specification'],
            ['Processor', 'Intel Core i3 / AMD Ryzen 3 @ 2.0 GHz', 'Intel Core i5 / Apple Silicon M-series'],
            ['Memory (RAM)', '4 GB DDR4', '8 GB – 16 GB DDR4/Unified'],
            ['Storage', '20 GB available SSD space', '50 GB+ NVMe SSD space'],
            ['Network', 'Active Internet Connection (2 Mbps)', 'Broadband Connection (10 Mbps+)'],
          ]),

          createHeading2('4.4 Software Requirements'),
          createTable([
            ['Software / Tool', 'Version / Environment', 'Purpose'],
            ['Operating System', 'macOS Sequoia / Ubuntu 22.04 / Windows 11', 'Host Development Operating System'],
            ['Runtime Environment', 'Node.js v20+ LTS / v24.6', 'JavaScript Server Execution Runtime'],
            ['Database Engine', 'MongoDB Community v7.0 / Atlas', 'NoSQL Document Database Engine'],
            ['Package Manager', 'npm v10+', 'Dependency Management Tool'],
            ['API Testing Tool', 'Postman Desktop v11', 'REST API Functional Contract Verification'],
            ['Browser Engine', 'Google Chrome / Chromium', 'Client Rendering & Puppeteer Automation'],
            ['Version Control', 'Git v2.40+ & GitHub', 'Source Code Management'],
            ['Hosting Platform', 'Vercel Serverless Edge Platform', 'Cloud Production Deployment'],
          ]),

          createHeading2('4.5 Technology Stack Details'),
          createParagraph(
            'The application stack consists of React 18, Vite 6, Tailwind CSS 3.4, React Router v6, Axios on the frontend; Node.js and Express.js 4.21 on the backend; MongoDB Community and Mongoose 8.9 for database persistence; and JWT (jsonwebtoken) and bcryptjs for authentication.'
          ),

          // Page Break to Chapter 5
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 5 ====================
          createChapterTitle('CHAPTER 5 – SYSTEM ANALYSIS & FEASIBILITY STUDY'),
          createHeading2('5.1 Technical Feasibility'),
          createParagraph(
            'The technical feasibility of MahaConnect is established through the utilization of proven web technologies within the MERN ecosystem. Node.js provides non-blocking, asynchronous I/O capabilities well-suited for an API Gateway coordinating multiple concurrent requests. MongoDB JSON-native BSON document format naturally accommodates the varied schemas required by diverse government services without requiring schema redesigns. React component state model enables responsive multi-step form navigation and dynamic validation.'
          ),

          createHeading2('5.2 Operational Feasibility'),
          createParagraph(
            'The platform reduces operational friction for citizens and officers. Citizens access services through a clean, intuitive interface without requiring specialized training. Department officers work within dedicated scrutiny queues scoped to their department, streamlining review workflows. Administrators gain system visibility through telemetry log tables and operational charts.'
          ),

          createHeading2('5.3 Economic Feasibility'),
          createParagraph(
            'Utilizing open-source technologies (React, Node.js, Express, MongoDB Community) eliminates expensive proprietary software license fees. Deploying through modern serverless platforms like Vercel aligns resource utilization directly with application traffic, keeping hosting and maintenance costs modest for academic and organizational use cases.'
          ),

          createHeading2('5.4 Security Feasibility'),
          createParagraph(
            'Security is maintained through stateless JSON Web Tokens (JWT) signed with HMAC-SHA256, salted bcrypt password hashing (10 rounds), HTTP header hardening via Helmet, Cross-Origin Resource Sharing (CORS) whitelisting, rate limiting against brute-force attempts, and input sanitization before database insertion.'
          ),

          // Page Break to Chapter 6
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 6 ====================
          createChapterTitle('CHAPTER 6 – SYSTEM DESIGN, DFD & DATABASE MODELING'),
          createHeading2('6.1 Data Flow Diagrams (DFD) Overview'),
          createParagraph(
            'Data Flow Diagrams visually represent the boundaries, external entities, functional processes, and internal data stores of the MahaConnect system.'
          ),

          createHeading2('6.2 DFD Level 0 – Context Diagram'),
          createParagraph(
            'The Context Diagram represents MahaConnect as a single central system interacting with four external entities: Citizens, Department Officers, State Administrators, and Simulated Department REST Microservices.'
          ),
          ...createFigure('00_dfd_level0.png', 'Figure 3: Data Flow Diagram (DFD Level 0 – Context Diagram)'),

          createHeading2('6.3 DFD Level 1 – Functional Decomposition'),
          createParagraph(
            'The Level 1 DFD decomposes the system into four major operational sub-processes: Process 1.0 (Identity & Session Management), Process 2.0 (Service Directory Catalog), Process 3.0 (Application Gateway Dispatch), and Process 4.0 (Scrutiny, Status Transition & Audit Logging).'
          ),
          ...createFigure('00_dfd_level1.png', 'Figure 4: Data Flow Diagram (DFD Level 1 – Functional Decomposition)'),

          createHeading2('6.4 Entity Relationship / Database Model'),
          createParagraph(
            'The database architecture employs Mongoose models enforcing relational references between users, departments, services, applications, and telemetry logs while leveraging embedded documents for application audit timelines.'
          ),
          ...createFigure('00_er_diagram.png', 'Figure 5: Database Entity-Relationship (ER) Model'),

          createHeading2('6.5 Database Collections Schema'),
          createTable([
            ['Collection', 'Key Attributes', 'Data Types & Constraints'],
            ['users', '_id, name, email, password, role, department, mobile, address', 'email (String, Unique, Index), password (String, Hashed), role (Enum: citizen|officer|admin)'],
            ['departments', '_id, name, code, description, contactEmail, isOperational', 'code (String, Unique: REV, TRP), isOperational (Boolean, Default: true)'],
            ['services', '_id, department, name, description, requiredDocuments, fees, dynamicFields', 'department (ObjectId, ref: Department), dynamicFields (Array of schema field objects)'],
            ['applications', '_id, applicationId, citizen, service, department, status, formData, documents, timeline', 'applicationId (String, Unique: MC-2026-X), status (Enum), timeline (Array of status change objects)'],
            ['apilogs', '_id, timestamp, source, destination, endpoint, method, statusCode, responseTimeMs', 'timestamp (Date, Index), statusCode (Number), responseTimeMs (Number)'],
            ['notifications', '_id, recipient, title, message, type, read, relatedApplicationId', 'recipient (ObjectId, ref: User), read (Boolean, Default: false)'],
          ]),

          createHeading2('6.6 Data Dictionary'),
          createBullet('applicationId: Unique state-wide tracking identifier formatted as MC-YYYY-NNNNNN (e.g. MC-2026-000101).'),
          createBullet('interopReferenceId: Department-assigned routing confirmation token formatted as DEPT-YYYY-NNNNN (e.g. TRP-2026-68192).'),
          createBullet('responseTimeMs: Latency in milliseconds recorded by the API Gateway during departmental routing.'),

          // Page Break to Chapter 7
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 7 ====================
          createChapterTitle('CHAPTER 7 – FULL-STACK IMPLEMENTATION DETAILS'),
          createHeading2('7.1 Frontend Architecture & Component Tree'),
          createParagraph(
            'The frontend client is structured around atomic design principles under client/src: components/layout for navigation, context for global authentication and toast alerts, and dedicated portal pages for Citizens, Officers, and Admins.'
          ),

          createHeading2('7.2 Backend Architecture & Routing Pipeline'),
          createParagraph(
            'The backend follows an MVC-Service-Gateway pattern with dedicated routers, middleware security pipelines (helmet, express-rate-limit, cors, JWT verification), controllers for CRUD operations, and an asynchronous departmental dispatch simulator that allocates unique tracking codes and logs telemetry events.'
          ),

          createHeading2('7.3 REST API Implementation'),
          createTable([
            ['Endpoint', 'Method', 'Access Role', 'Description'],
            ['/api/auth/register', 'POST', 'Public', 'Register a new citizen account'],
            ['/api/auth/login', 'POST', 'Public', 'Authenticate user and issue JWT bearer token'],
            ['/api/departments', 'GET', 'Public', 'Fetch all registered active departments'],
            ['/api/services', 'GET', 'Public', 'Fetch all services with dynamic parameter schemas'],
            ['/api/applications', 'POST', 'Citizen', 'Submit new application with dynamic form data'],
            ['/api/applications', 'GET', 'Citizen / Admin', 'List applications scoped to user role'],
            ['/api/applications/:id', 'GET', 'Citizen / Officer / Admin', 'Retrieve full application details and timeline'],
            ['/api/applications/:id/status', 'PATCH', 'Officer / Admin', 'Update status and append remarks to timeline'],
            ['/api/admin/api-logs', 'GET', 'Admin', 'Fetch real-time interoperability gateway logs'],
          ]),

          createHeading2('7.4 CRUD Operations & Dynamic Database Records'),
          createParagraph(
            'Citizens create application records and read their submitted history. Officers read department-scoped records and update application status and official remarks. Administrators have full read and create authority over departments and services.'
          ),

          createHeading2('7.5 Form Validation & Error Trapping'),
          createParagraph(
            'Client-side form validation prevents malformed requests before submission. Required fields, email formats, and document formats are verified, displaying immediate toast alerts upon detection of discrepancies.'
          ),

          createHeading2('7.6 Complete Application Workflow'),
          createParagraph(
            'The complete citizen application lifecycle operates through five sequential stages: Authentication, Service Selection, Multi-step Application Filing, Gateway Interception and Dispatch, and Officer Scrutiny with status transitions.'
          ),

          // Page Break to Chapter 8
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 8 ====================
          createChapterTitle('CHAPTER 8 – SECURITY, CRYPTOGRAPHY & ACCESS CONTROL'),
          createHeading2('8.1 Password Hashing with bcrypt'),
          createParagraph(
            'User passwords are protected against dictionary attacks using bcryptjs. Passwords pass through a salt generation routine with a cost factor of 10 rounds before being persisted.'
          ),

          createHeading2('8.2 JWT Authentication & Bearer Token Verification'),
          createParagraph(
            'Sessions are governed by stateless JSON Web Tokens signed with HMAC-SHA256. Upon authentication, the server signs a token payload containing the user ID, role, and department. The client transmits this token in the Authorization header on subsequent requests.'
          ),

          createHeading2('8.3 Role-Based Access Control (RBAC)'),
          createTable([
            ['Resource Operation', 'Public', 'Citizen', 'Department Officer', 'State Admin'],
            ['View Public Landing Page & Services', '✔ Allowed', '✔ Allowed', '✔ Allowed', '✔ Allowed'],
            ['Submit Service Application', '❌ Denied', '✔ Allowed', '❌ Denied', '❌ Denied'],
            ['Upload Supporting Documents', '❌ Denied', '✔ Allowed', '❌ Denied', '❌ Denied'],
            ['View Own Application History', '❌ Denied', '✔ Own Only', '❌ Denied', '✔ All'],
            ['Review Department Application Dossier', '❌ Denied', '❌ Denied', '✔ Assigned Dept', '✔ All'],
            ['Update Application Status & Remarks', '❌ Denied', '❌ Denied', '✔ Assigned Dept', '✔ Override'],
            ['Manage Departments & Service Schemas', '❌ Denied', '❌ Denied', '❌ Denied', '✔ Full Admin'],
            ['Inspect Interoperability Telemetry Logs', '❌ Denied', '❌ Denied', '❌ Denied', '✔ Full Admin'],
          ]),

          createHeading2('8.4 Security Middleware: Helmet, CORS & Rate Limiting'),
          createParagraph(
            'The Express Gateway utilizes helmet to set security headers, cors to prevent cross-origin abuse, and express-rate-limit restricting excessive requests to 100 requests per 15-minute window per IP address.'
          ),

          createHeading2('8.5 Audit Logging & Telemetry Recording'),
          createParagraph(
            'Every cross-departmental API call is intercepted by telemetry middleware that creates an entry in the apilogs collection recording the timestamp, source, destination, endpoint, HTTP method, response status, and execution time in milliseconds.'
          ),

          // Page Break to Chapter 9
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 9 ====================
          createChapterTitle('CHAPTER 9 – TESTING & VALIDATION'),
          createHeading2('9.1 Testing Strategy & Methodology'),
          createParagraph(
            'Quality assurance for MahaConnect was executed through functional unit testing, REST API contract validation via Postman Desktop v11, client-side error trapping, and end-to-end user journey simulation via Puppeteer browser automation.'
          ),

          createHeading2('9.2 Test Cases and Results'),
          createTable([
            ['Test ID', 'Endpoint & Method', 'Test Scenario', 'Expected Result', 'Actual Result', 'Status'],
            ['TC-01', 'GET /api/departments', 'Retrieve list of all active departments', 'HTTP 200 with 7 departments', 'HTTP 200 with 7 departments (24ms)', 'PASS'],
            ['TC-02', 'POST /api/auth/login', 'Authenticate citizen with valid credentials', 'HTTP 200 with JWT bearer token', 'HTTP 200 with valid JWT token (58ms)', 'PASS'],
            ['TC-03', 'POST /api/auth/login', 'Authenticate with invalid password', 'HTTP 401 Invalid credentials', 'HTTP 401 Invalid credentials', 'PASS'],
            ['TC-04', 'POST /api/applications', 'Submit multi-step form with valid payload', 'HTTP 201 with Application ID', 'HTTP 201 with ID MC-2026-000101', 'PASS'],
            ['TC-05', 'GET /api/applications/:id', 'Retrieve application tracking timeline', 'HTTP 200 with timeline array', 'HTTP 200 with 4 timeline states', 'PASS'],
            ['TC-06', 'PATCH /api/applications/:id/status', 'Officer updates status to Approved', 'HTTP 200 with updated status', 'HTTP 200 with status Approved (44ms)', 'PASS'],
            ['TC-07', 'DELETE /api/departments/:id', 'Attempt deletion of linked department', 'HTTP 400 Integrity violation', 'HTTP 400 Integrity violation (18ms)', 'PASS'],
            ['TC-08', 'GET /api/admin/api-logs', 'Fetch gateway telemetry logs', 'HTTP 200 with log array', 'HTTP 200 with active telemetry logs', 'PASS'],
          ]),

          createHeading2('9.3 Production Deployment Verification'),
          createParagraph(
            'The production build was deployed to the Vercel platform. The public endpoint https://mahaconnect-rose.vercel.app/api/health was queried and confirmed operational with an HTTP 200 status code.'
          ),

          // Page Break to Chapter 10
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 10 ====================
          createChapterTitle('CHAPTER 10 – RESULTS, CONCLUSION & FUTURE SCOPE'),
          createHeading2('10.1 Results'),
          createParagraph(
            'The implementation of MahaConnect successfully fulfilled all planned functional objectives: citizens authenticate and apply for services across 7 departments without duplicate entry, officers scrutinize dossiers and update status with remarks, and administrators monitor live REST telemetry.'
          ),

          createHeading2('10.2 Conclusion'),
          createParagraph(
            'The MahaConnect: Government Platform Interoperability System project demonstrates that an API Gateway built on the MERN stack can effectively connect disparate departmental public services into a unified single-window portal without requiring costly redesigns of underlying departmental databases.'
          ),

          createHeading2('10.3 Learning Outcomes'),
          createBullet('Proficiency in designing full-stack MERN applications following MVC-Service-Gateway architecture.'),
          createBullet('Hands-on experience implementing JSON Web Token (JWT) stateless authentication and bcrypt password security.'),
          createBullet('Practical understanding of API Gateway routing, schema-driven dynamic form generation, and telemetry logging.'),
          createBullet('Experience with automated API verification via Postman and headless browser testing via Puppeteer.'),

          createHeading2('10.4 Limitations'),
          createBullet('Downstream departmental systems are simulated through a mock integration service layer for academic purposes.'),
          createBullet('Document storage is abstracted locally during development rather than connected to live national document repositories.'),

          createHeading2('10.5 Future Scope'),
          createBullet('DigiLocker Integration: Direct connection with Government of India DigiLocker APIs for automated certificate verification.'),
          createBullet('Distributed Audit Ledger: Transitioning the centralized ApiLog collection into an immutable distributed ledger.'),
          createBullet('Multilingual Accessibility: Introducing localization for Marathi, Hindi, and English to broaden accessibility.'),

          // Page Break to Chapter 11 Screenshots
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 11 ====================
          createChapterTitle('CHAPTER 11 – PROJECT SCREENSHOTS & IMPLEMENTATION PHOTOS'),
          createParagraph(
            'This chapter presents real screenshots captured from the running MahaConnect application, REST API gateway, and MongoDB database during live operation:',
            true,
            false
          ),

          ...createFigure('01_landing_page.png', 'Figure 6: MahaConnect Public Landing Page & Citizen Gateway'),
          ...createFigure('02_login_page.png', 'Figure 7: Unified Authentication Portal with Seeded Demo Credentials'),
          new Paragraph({ children: [new PageBreak()] }),

          ...createFigure('03_citizen_dashboard.png', 'Figure 8: Citizen Self-Service Dashboard with Metric Cards & Quick Navigation'),
          ...createFigure('04_government_services.png', 'Figure 9: Cross-Departmental Government Services Directory with Filtering'),
          new Paragraph({ children: [new PageBreak()] }),

          ...createFigure('05_application_form.png', 'Figure 10: Dynamic Application Form Wizard: Step 1 (Personal Demographics)'),
          ...createFigure('06_form_validation_error.png', 'Figure 11: Client-Side Form Validation Alert & Error Prevention'),
          new Paragraph({ children: [new PageBreak()] }),

          ...createFigure('07_document_upload_review.png', 'Figure 12: Document Upload & Multi-Format Verification'),
          ...createFigure('08_successful_application_submission.png', 'Figure 13: Application Submission Confirmation & Unique Reference Generation'),
          new Paragraph({ children: [new PageBreak()] }),

          ...createFigure('09_application_tracking_timeline.png', 'Figure 14: Live Citizen Tracking Timeline with Multi-Stage Progression'),
          ...createFigure('10_officer_dashboard.png', 'Figure 15: Department Officer Scrutiny Console & Pending Application Queue'),
          new Paragraph({ children: [new PageBreak()] }),

          ...createFigure('11_officer_application_review.png', 'Figure 16: Officer Application Scrutiny Dossier with Inline Document Viewer'),
          ...createFigure('12_updated_application_status.png', 'Figure 17: Officer Status Transition Pipeline & Remarks Endorsement'),
          new Paragraph({ children: [new PageBreak()] }),

          ...createFigure('13_admin_dashboard.png', 'Figure 18: State Administrator Governance Dashboard & Interoperability KPIs'),
          ...createFigure('14_department_management.png', 'Figure 19: State Department Management Console & Endpoint Configuration'),
          new Paragraph({ children: [new PageBreak()] }),

          ...createFigure('15_service_management.png', 'Figure 20: Service Schema Configuration & Dynamic Field Definition'),
          ...createFigure('16_api_interoperability_logs.png', 'Figure 21: REST API Interoperability Gateway Logs & Modal Payload Inspector'),
          new Paragraph({ children: [new PageBreak()] }),

          ...createFigure('17_postman_get_request.png', 'Figure 22: Postman Test Suite: GET /api/departments (Status 200 OK)'),
          ...createFigure('18_postman_post_request.png', 'Figure 23: Postman Test Suite: POST /api/auth/login (JWT Token Generation)'),
          new Paragraph({ children: [new PageBreak()] }),

          ...createFigure('19_postman_put_patch_request.png', 'Figure 24: Postman Test Suite: PATCH /api/applications/:id/status'),
          ...createFigure('20_postman_delete_request.png', 'Figure 25: Postman Test Suite: DELETE /api/departments/:id (Integrity Check)'),
          new Paragraph({ children: [new PageBreak()] }),

          ...createFigure('21_mongodb_records.png', 'Figure 26: MongoDB Shell (mongosh) Collection & Query Ledger Inspection'),
          ...createFigure('22_final_working_application.png', 'Figure 27: MahaConnect Final Working Multi-Portal Application Showcase'),

          // Page Break to Project Details
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 12 PROJECT DETAILS ====================
          createChapterTitle('CHAPTER 12 – PROJECT DETAILS'),
          createTable([
            ['DEPARTMENT', 'Information Technology'],
            ['PROJECT TITLE', 'MahaConnect: Government Platform Interoperability System'],
            ['STUDENT NAMES', 'Pawan Mishra\nSamarth Nivadunge'],
            ['ROLL NOs.', '202402104\n202402111'],
            ['CLASS', 'TY BSc IT'],
            ['SEMESTER', 'V'],
            ['PROJECT GUIDE', 'Mr. Pratharv Surve'],
            ['ACADEMIC YEAR', '2026-2027'],
            ['COLLEGE', "ZSCT's Thakur Shyamnarayan Degree College"],
            ['DEPLOYMENT URL', 'https://mahaconnect-rose.vercel.app'],
          ]),

          // Page Break to References
          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 13 REFERENCES ====================
          createChapterTitle('CHAPTER 13 – REFERENCES / BIBLIOGRAPHY'),
          createBullet('1. MongoDB Documentation. MongoDB Manual: Databases, Collections, and Documents. Available: https://www.mongodb.com/docs/manual/'),
          createBullet('2. React Documentation. React: The Library for Web and Native User Interfaces. Available: https://react.dev/'),
          createBullet('3. Node.js Documentation. Node.js v20+ LTS Architecture and Asynchronous I/O. Available: https://nodejs.org/docs/'),
          createBullet('4. Express.js Documentation. Fast, Unopinionated, Minimalist Web Framework for Node.js. Available: https://expressjs.com/'),
          createBullet('5. Vite Documentation. Next Generation Frontend Tooling. Available: https://vitejs.dev/'),
          createBullet('6. Tailwind CSS Documentation. A Utility-First CSS Framework for Rapid UI Development. Available: https://tailwindcss.com/docs'),
          createBullet('7. Mongoose Documentation. Mongoose ODM: Elegant MongoDB Object Modeling for Node.js. Available: https://mongoosejs.com/docs/'),
          createBullet('8. JSON Web Token Documentation. RFC 7519: JSON Web Token (JWT) Standard. IETF, Available: https://jwt.io/'),
          createBullet('9. OWASP Foundation. OWASP Top 10 Web Application Security Risks. Open Web Application Security Project, Available: https://owasp.org/www-project-top-ten/'),
          createBullet('10. Postman Documentation. Postman API Platform: Automated Contract Testing and Documentation. Available: https://learning.postman.com/docs/'),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUTPUT_DOCX, buffer);
  const originalDocx = path.join(__dirname, '../MahaConnect_FSDM_Project_Report_Pawan_Mishra.docx');
  fs.writeFileSync(originalDocx, buffer);
  console.log('📋 Also synchronized: ' + originalDocx);
  console.log('✅ COLLEGE STYLE DOCX GENERATED SUCCESSFULLY (NO HEADERS/FOOTERS): ' + OUTPUT_DOCX);
}

buildDocx().catch((err) => {
  console.error('Error generating DOCX report:', err);
  process.exit(1);
});
