require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Department = require('../models/Department');
const Service = require('../models/Service');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const ApiLog = require('../models/ApiLog');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mahaconnect';
    console.log(`[Seed] Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Department.deleteMany({});
    await Service.deleteMany({});
    await Application.deleteMany({});
    await Notification.deleteMany({});
    await ApiLog.deleteMany({});

    console.log('[Seed] Inserting Departments...');
    const departments = await Department.create([
      {
        name: 'Transport Department',
        code: 'TRANS',
        description: 'Motor vehicles, driving licenses, vehicle registrations, and road safety services across Maharashtra.',
        icon: 'Car',
        apiEndpoint: 'https://transport.maharashtra.gov.in/api/v1',
        contactEmail: 'transport.support@maharashtra.gov.in',
        contactPhone: '1800-22-0110',
        status: 'active',
      },
      {
        name: 'Revenue & Land Records Department',
        code: 'REV',
        description: 'Issuance of income certificates, caste certificates, land records (7/12 extract), and domicile verifications.',
        icon: 'Landmark',
        apiEndpoint: 'https://revenue.maharashtra.gov.in/api/v1',
        contactEmail: 'revenue.helpdesk@maharashtra.gov.in',
        contactPhone: '1800-120-8040',
        status: 'active',
      },
      {
        name: 'Higher & Technical Education Department',
        code: 'EDU',
        description: 'MahaDBT scholarship programs, tuition fee concessions, and technical education assistance.',
        icon: 'GraduationCap',
        apiEndpoint: 'https://education.maharashtra.gov.in/api/v1',
        contactEmail: 'scholarships.support@maharashtra.gov.in',
        contactPhone: '022-49150800',
        status: 'active',
      },
      {
        name: 'Municipal Corporation & Urban Development',
        code: 'MUNI',
        description: 'Civil registration of births and deaths, property tax assessments, and civic utility permits.',
        icon: 'Building2',
        apiEndpoint: 'https://urban.maharashtra.gov.in/api/v1',
        contactEmail: 'civil.services@mcgm.gov.in',
        contactPhone: '1916',
        status: 'active',
      },
      {
        name: 'Skill Development & Employment Department',
        code: 'EMP',
        description: 'Job seeker registrations, MahaSwayam employment exchange, vocational guidance and apprenticeships.',
        icon: 'Briefcase',
        apiEndpoint: 'https://rojgar.maharashtra.gov.in/api/v1',
        contactEmail: 'mahaswayam@maharashtra.gov.in',
        contactPhone: '1800-120-8041',
        status: 'active',
      },
      {
        name: 'Social Justice & Special Assistance Department',
        code: 'SOC',
        description: 'Welfare schemes for senior citizens, persons with disabilities (Divyangjan), and disadvantaged communities.',
        icon: 'HeartHandshake',
        apiEndpoint: 'https://sjsa.maharashtra.gov.in/api/v1',
        contactEmail: 'socialjustice@maharashtra.gov.in',
        contactPhone: '022-22025251',
        status: 'active',
      },
      {
        name: 'Public Health Department',
        code: 'HLTH',
        description: 'Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY), health cards, and universal healthcare assistance.',
        icon: 'Activity',
        apiEndpoint: 'https://arogya.maharashtra.gov.in/api/v1',
        contactEmail: 'health.connect@maharashtra.gov.in',
        contactPhone: '104',
        status: 'active',
      },
    ]);

    const deptMap = {};
    departments.forEach((d) => {
      deptMap[d.code] = d._id;
    });

    console.log('[Seed] Inserting Demo Users...');
    // Seed Demo Users
    const citizenUser = await User.create({
      name: 'Aarav Patil',
      email: 'citizen@demo.com',
      password: 'Password123!',
      phone: '9876543210',
      role: 'citizen',
      address: {
        street: '402, Shivajinagar, FC Road',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411005',
      },
      isActive: true,
    });

    const officerUser = await User.create({
      name: 'Ramesh Deshmukh',
      email: 'officer@demo.com',
      password: 'Password123!',
      phone: '9822012345',
      role: 'officer',
      department: deptMap['TRANS'], // Transport Officer
      address: {
        street: 'Regional Transport Office (MH-12)',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
      },
      isActive: true,
    });

    const revenueOfficer = await User.create({
      name: 'Sneha Kulkarni',
      email: 'revenue.officer@demo.com',
      password: 'Password123!',
      phone: '9822099999',
      role: 'officer',
      department: deptMap['REV'], // Revenue Officer
      address: {
        street: 'Tehsil Office, Camp',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
      },
      isActive: true,
    });

    const adminUser = await User.create({
      name: 'MahaConnect State Administrator',
      email: 'admin@demo.com',
      password: 'Password123!',
      phone: '9900011223',
      role: 'admin',
      address: {
        street: 'MahaConnect Directorate, Mantralaya',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400032',
      },
      isActive: true,
    });

    console.log('[Seed] Inserting Services with Dynamic Form Schemas...');
    const services = await Service.create([
      // Transport Department
      {
        name: 'New Driving Licence Application',
        code: 'TRANS_DL_NEW',
        department: deptMap['TRANS'],
        description: 'Apply for permanent driving licence for Two-Wheeler (MCWG) or Light Motor Vehicle (LMV) upon holding a valid learner licence.',
        category: 'Licences',
        requiredDocuments: [
          'Learner Licence Copy',
          'Aadhaar Card / Age Proof',
          'Address Proof (Electricity Bill / Passport)',
          'Recent Passport Photograph',
        ],
        processingTime: '7-10 Working Days',
        fee: 250,
        dynamicFields: [
          {
            name: 'learnerLicenceNo',
            label: 'Learner Licence Number',
            type: 'text',
            required: true,
            placeholder: 'e.g., MH12LL00291822',
            helpText: 'Enter 16-character valid Learner Licence number',
          },
          {
            name: 'vehicleClass',
            label: 'Vehicle Class Category',
            type: 'select',
            required: true,
            options: ['Motor Cycle With Gear (MCWG)', 'Light Motor Vehicle (LMV - Car)', 'Both MCWG & LMV'],
            placeholder: 'Select vehicle category',
          },
          {
            name: 'rtoOffice',
            label: 'Select Test RTO Office',
            type: 'select',
            required: true,
            options: ['MH-12 Pune Central', 'MH-14 Pimpri Chinchwad', 'MH-01 Mumbai South', 'MH-02 Mumbai West', 'MH-31 Nagpur'],
          },
        ],
      },
      {
        name: 'Driving Licence Renewal',
        code: 'TRANS_DL_RENEW',
        department: deptMap['TRANS'],
        description: 'Renew expired or expiring driving licence without physical RTO visit using digital Aadhaar verification.',
        category: 'Licences',
        requiredDocuments: [
          'Existing Driving Licence Copy',
          'Medical Certificate (Form 1A)',
          'Aadhaar Card',
          'Recent Photograph',
        ],
        processingTime: '3-5 Working Days',
        fee: 200,
        dynamicFields: [
          {
            name: 'existingDlNumber',
            label: 'Existing DL Number',
            type: 'text',
            required: true,
            placeholder: 'e.g., MH12 20180019283',
          },
          {
            name: 'expiryDate',
            label: 'Date of Expiry',
            type: 'date',
            required: true,
          },
        ],
      },

      // Revenue Department
      {
        name: 'Income Certificate (Tahsildar)',
        code: 'REV_INCOME_CERT',
        department: deptMap['REV'],
        description: 'Official revenue certificate certifying annual family income issued by the Sub-Divisional Officer / Tahsildar for subsidies and educational reservations.',
        category: 'Certificates',
        requiredDocuments: [
          'Aadhaar Card',
          'Salary Slip / Form 16 / IT Returns',
          'Ration Card Copy',
          'Affidavit of Income',
        ],
        processingTime: '5-7 Working Days',
        fee: 50,
        dynamicFields: [
          {
            name: 'annualFamilyIncome',
            label: 'Total Annual Family Income (INR)',
            type: 'number',
            required: true,
            placeholder: 'e.g., 250000',
          },
          {
            name: 'occupationType',
            label: 'Primary Source of Income',
            type: 'select',
            required: true,
            options: ['Agriculture', 'Salaried Employment', 'Business / Self-Employed', 'Daily Wage Labor', 'Other'],
          },
          {
            name: 'purposeOfCertificate',
            label: 'Purpose of Certificate',
            type: 'text',
            required: true,
            placeholder: 'e.g. Higher Education Scholarship Admission',
          },
        ],
      },
      {
        name: 'Caste Certificate Issuance',
        code: 'REV_CASTE_CERT',
        department: deptMap['REV'],
        description: 'Issuance of official caste and community certificate for SC, ST, VJNT, OBC, and SBC categories.',
        category: 'Certificates',
        requiredDocuments: [
          'Aadhaar Card of Applicant',
          'School Leaving Certificate (LC)',
          'Father / Relative Caste Certificate',
          'Proof of Residence prior to 1967 (where applicable)',
        ],
        processingTime: '15-21 Working Days',
        fee: 65,
        dynamicFields: [
          {
            name: 'casteCategory',
            label: 'Caste Category Claimed',
            type: 'select',
            required: true,
            options: ['SC (Scheduled Caste)', 'ST (Scheduled Tribe)', 'OBC (Other Backward Class)', 'VJNT', 'SBC', 'SEBC'],
          },
          {
            name: 'subCaste',
            label: 'Sub-Caste Name',
            type: 'text',
            required: true,
            placeholder: 'e.g., Kunbi, Maratha, Mahar, etc.',
          },
        ],
      },

      // Education Department
      {
        name: 'Post-Matric Scholarship (MahaDBT)',
        code: 'EDU_SCHOLARSHIP_PM',
        department: deptMap['EDU'],
        description: 'State government merit-cum-means scholarship reimbursement for technical and degree college students.',
        category: 'Education',
        requiredDocuments: [
          'Income Certificate',
          'Caste Certificate (if applicable)',
          'College Admission Fee Receipt',
          'Previous Year Marksheet',
          'Bank Passbook Linked with Aadhaar',
        ],
        processingTime: '14 Working Days',
        fee: 0,
        dynamicFields: [
          {
            name: 'collegeName',
            label: 'Current College / Institute Name',
            type: 'text',
            required: true,
            placeholder: 'e.g. COEP Technological University Pune',
          },
          {
            name: 'courseName',
            label: 'Degree & Department',
            type: 'text',
            required: true,
            placeholder: 'e.g. B.Tech Computer Engineering - Year 3',
          },
          {
            name: 'annualTuitionFee',
            label: 'Approved Annual Tuition Fee (INR)',
            type: 'number',
            required: true,
            placeholder: 'e.g., 85000',
          },
        ],
      },

      // Municipal Corporation
      {
        name: 'Birth Certificate Issuance',
        code: 'MUNI_BIRTH_CERT',
        department: deptMap['MUNI'],
        description: 'Issuance of digitally signed Official Birth Certificate registered under Registration of Births and Deaths Act.',
        category: 'Certificates',
        requiredDocuments: [
          'Hospital Discharge Card / Birth Report',
          'Parents Aadhaar Card Copy',
          'Marriage Certificate / Proof of relation',
        ],
        processingTime: '3-5 Working Days',
        fee: 25,
        dynamicFields: [
          {
            name: 'childFullName',
            label: 'Child Full Name',
            type: 'text',
            required: true,
            placeholder: 'e.g., Rohan Aarav Patil',
          },
          {
            name: 'dateOfBirth',
            label: 'Date of Birth',
            type: 'date',
            required: true,
          },
          {
            name: 'hospitalName',
            label: 'Hospital / Place of Birth',
            type: 'text',
            required: true,
            placeholder: 'e.g. Sassoon General Hospital Pune',
          },
        ],
      },
      {
        name: 'Property Tax Assessment & Name Transfer',
        code: 'MUNI_PROPERTY_TAX',
        department: deptMap['MUNI'],
        description: 'Update ownership records and property tax mutation assessment for residential and commercial premises.',
        category: 'Property',
        requiredDocuments: [
          'Registered Sale Deed / Index II',
          'Latest Property Tax Receipt',
          'No Objection Certificate (NOC)',
          'Aadhaar of New Owner',
        ],
        processingTime: '10-15 Working Days',
        fee: 500,
        dynamicFields: [
          {
            name: 'propertyIndexNo',
            label: 'Property Index / Assessment Number',
            type: 'text',
            required: true,
            placeholder: 'e.g., PMC-PROP-2024-8831',
          },
          {
            name: 'propertyType',
            label: 'Property Classification',
            type: 'select',
            required: true,
            options: ['Residential Flat/Apartment', 'Individual Bungalow', 'Commercial Shop/Office', 'Open Plot'],
          },
        ],
      },

      // Employment Department
      {
        name: 'Employment Exchange Registration (MahaSwayam)',
        code: 'EMP_EXCHANGE_REG',
        department: deptMap['EMP'],
        description: 'Register in the statewide youth employment pool to receive state job fairs notifications and government recruitment alerts.',
        category: 'Employment',
        requiredDocuments: [
          'Highest Qualification Degree / Diploma Certificate',
          'Aadhaar Card',
          'Curriculum Vitae (CV/Resume)',
        ],
        processingTime: '1-2 Working Days',
        fee: 0,
        dynamicFields: [
          {
            name: 'highestQualification',
            label: 'Highest Educational Qualification',
            type: 'select',
            required: true,
            options: ['Diploma', 'Graduation (BSc, BTech, BCom, BA)', 'Post-Graduation (MSc, MTech, MBA)', 'Doctorate (PhD)', 'ITI Certified'],
          },
          {
            name: 'skillsKeywords',
            label: 'Key Skills / Industry Domain',
            type: 'text',
            required: true,
            placeholder: 'e.g. Web Development, React, Node.js, Database Design',
          },
        ],
      },

      // Social Welfare Department
      {
        name: 'Senior Citizen Identity Card',
        code: 'SOC_SENIOR_CITIZEN',
        department: deptMap['SOC'],
        description: 'Official Senior Citizen ID card providing state transport discounts, priority health queueing, and municipal utility concessions for citizens aged 60+.',
        category: 'Welfare',
        requiredDocuments: [
          'Age Proof (Aadhaar Card / PAN / Passport)',
          'Address Proof',
          'Passport Size Photographs (2 copies)',
          'Blood Group Certificate',
        ],
        processingTime: '7 Working Days',
        fee: 0,
        dynamicFields: [
          {
            name: 'bloodGroup',
            label: 'Blood Group',
            type: 'select',
            required: true,
            options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
          },
          {
            name: 'emergencyContactPhone',
            label: 'Emergency Contact Mobile Number',
            type: 'text',
            required: true,
            placeholder: 'e.g. 9812345678',
          },
        ],
      },

      // Health Department
      {
        name: 'Ayushman Bharat - MJPJAY Health Cover Enrollment',
        code: 'HLTH_MJPJAY_CARD',
        department: deptMap['HLTH'],
        description: 'Cashless healthcare protection up to Rs. 5 Lakhs per family per year across empaneled hospitals.',
        category: 'Health',
        requiredDocuments: [
          'Aadhaar Card of all family members',
          'Ration Card (Yellow or Orange Category)',
          'Income Certificate',
        ],
        processingTime: '5 Working Days',
        fee: 0,
        dynamicFields: [
          {
            name: 'rationCardNumber',
            label: 'Ration Card Number',
            type: 'text',
            required: true,
            placeholder: 'e.g. RC-1402-998122',
          },
          {
            name: 'familyMembersCount',
            label: 'Number of Dependent Family Members',
            type: 'number',
            required: true,
            placeholder: 'e.g. 4',
          },
        ],
      },
    ]);

    const serviceMap = {};
    services.forEach((s) => {
      serviceMap[s.code] = s;
    });

    console.log('[Seed] Inserting Sample Applications with Chronological Timelines...');
    // Application 1: Driving Licence - Under Review
    const app1 = await Application.create({
      applicationId: 'MC-2026-000101',
      user: citizenUser._id,
      service: serviceMap['TRANS_DL_NEW']._id,
      department: deptMap['TRANS'],
      formData: {
        personalInfo: {
          fullName: citizenUser.name,
          dob: '1998-05-14',
          gender: 'Male',
          mobile: '9876543210',
          email: citizenUser.email,
          address: citizenUser.address.street,
          city: citizenUser.address.city,
          state: citizenUser.address.state,
          pincode: citizenUser.address.pincode,
        },
        serviceDetails: {
          learnerLicenceNo: 'MH12LL00291822',
          vehicleClass: 'Both MCWG & LMV',
          rtoOffice: 'MH-12 Pune Central',
        },
      },
      documents: [
        {
          documentType: 'Learner Licence Copy',
          originalName: 'learner_licence_MH12.pdf',
          fileUrl: '/uploads/sample_learner_licence.pdf',
          fileSize: 452000,
          mimeType: 'application/pdf',
        },
        {
          documentType: 'Aadhaar Card',
          originalName: 'aadhaar_card_masked.pdf',
          fileUrl: '/uploads/sample_aadhaar.pdf',
          fileSize: 312000,
          mimeType: 'application/pdf',
        },
      ],
      status: 'Under Review',
      remarks: 'Documents verified. Physical driving test scheduled on 5th Oct 2026 at Pune RTO track.',
      interopReferenceId: 'MH-MVD-2026-781923',
      timeline: [
        {
          status: 'Submitted',
          action: 'Application Submitted Online',
          department: 'MahaConnect Unified Portal',
          performedByName: citizenUser.name,
          remarks: 'Citizen completed digital submission and fee payment.',
          timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000),
        },
        {
          status: 'Department Received',
          action: 'Dispatched to Department Gateway',
          department: 'Transport Department',
          performedByName: 'Interop API Gateway',
          remarks: 'Successfully queued into Vahan/Sarathi state ledger. Ext Ref: MH-MVD-2026-781923',
          timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000 + 4000),
        },
        {
          status: 'Under Review',
          action: 'Officer Began Verification',
          department: 'Transport Department',
          performedByName: 'Ramesh Deshmukh (Department Officer)',
          remarks: 'Documents verified. Physical driving test scheduled on 5th Oct 2026 at Pune RTO track.',
          timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000),
        },
      ],
    });

    // Application 2: Income Certificate - Approved
    const app2 = await Application.create({
      applicationId: 'MC-2026-000102',
      user: citizenUser._id,
      service: serviceMap['REV_INCOME_CERT']._id,
      department: deptMap['REV'],
      formData: {
        personalInfo: {
          fullName: citizenUser.name,
          dob: '1998-05-14',
          gender: 'Male',
          mobile: '9876543210',
          email: citizenUser.email,
          address: citizenUser.address.street,
          city: citizenUser.address.city,
          state: citizenUser.address.state,
          pincode: citizenUser.address.pincode,
        },
        serviceDetails: {
          annualFamilyIncome: 180000,
          occupationType: 'Salaried Employment',
          purposeOfCertificate: 'Higher Education Fee Concession Application',
        },
      },
      documents: [
        {
          documentType: 'Salary Slip / Form 16',
          originalName: 'salary_statement_2026.pdf',
          fileUrl: '/uploads/sample_salary.pdf',
          fileSize: 520000,
          mimeType: 'application/pdf',
        },
      ],
      status: 'Approved',
      remarks: 'Tahsildar inspection complete. Digitally signed income certificate issued.',
      interopReferenceId: 'MH-REV-2026-339182',
      timeline: [
        {
          status: 'Submitted',
          action: 'Application Submitted Online',
          department: 'MahaConnect Unified Portal',
          performedByName: citizenUser.name,
          remarks: 'Citizen applied with income proofs.',
          timestamp: new Date(Date.now() - 7 * 24 * 3600 * 1000),
        },
        {
          status: 'Department Received',
          action: 'Dispatched to Department Gateway',
          department: 'Revenue & Land Records Department',
          performedByName: 'Interop API Gateway',
          remarks: 'Dispatched to Pune Tahsil e-District server.',
          timestamp: new Date(Date.now() - 7 * 24 * 3600 * 1000 + 3500),
        },
        {
          status: 'Under Review',
          action: 'Revenue Circle Officer Verification',
          department: 'Revenue & Land Records Department',
          performedByName: 'Sneha Kulkarni (Revenue Officer)',
          remarks: 'Talathi verified land and income records.',
          timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000),
        },
        {
          status: 'Approved',
          action: 'Certificate Digitally Signed & Approved',
          department: 'Revenue & Land Records Department',
          performedByName: 'Sneha Kulkarni (Revenue Officer)',
          remarks: 'Tahsildar inspection complete. Digitally signed income certificate issued.',
          timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        },
      ],
    });

    // Application 3: Birth Certificate - Completed
    const app3 = await Application.create({
      applicationId: 'MC-2026-000103',
      user: citizenUser._id,
      service: serviceMap['MUNI_BIRTH_CERT']._id,
      department: deptMap['MUNI'],
      formData: {
        personalInfo: {
          fullName: citizenUser.name,
          dob: '1998-05-14',
          gender: 'Male',
          mobile: '9876543210',
          email: citizenUser.email,
          address: citizenUser.address.street,
          city: citizenUser.address.city,
          state: citizenUser.address.state,
          pincode: citizenUser.address.pincode,
        },
        serviceDetails: {
          childFullName: 'Rohan Aarav Patil',
          dateOfBirth: '2024-08-12',
          hospitalName: 'Sassoon General Hospital Pune',
        },
      },
      status: 'Completed',
      remarks: 'Digital Birth Certificate issued and available in DigiLocker / MahaConnect vault.',
      interopReferenceId: 'MH-MCGM-2026-119283',
      timeline: [
        {
          status: 'Submitted',
          action: 'Application Submitted Online',
          department: 'MahaConnect Unified Portal',
          performedByName: citizenUser.name,
          remarks: 'Registration request received.',
          timestamp: new Date(Date.now() - 10 * 24 * 3600 * 1000),
        },
        {
          status: 'Under Review',
          action: 'Registrar Hospital Cross-Verification',
          department: 'Municipal Corporation',
          performedByName: 'Municipal Medical Registrar',
          remarks: 'Matched hospital birth registry record #8812-B.',
          timestamp: new Date(Date.now() - 8 * 24 * 3600 * 1000),
        },
        {
          status: 'Approved',
          action: 'Birth Record Registered',
          department: 'Municipal Corporation',
          performedByName: 'Municipal Medical Registrar',
          remarks: 'Record entered into Civil Registry database.',
          timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000),
        },
        {
          status: 'Completed',
          action: 'Certificate Dispatched',
          department: 'Municipal Corporation',
          performedByName: 'System Gateway',
          remarks: 'Digital Birth Certificate issued and available in DigiLocker / MahaConnect vault.',
          timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000),
        },
      ],
    });

    // Application 4: Scholarship - Additional Info Required
    const app4 = await Application.create({
      applicationId: 'MC-2026-000104',
      user: citizenUser._id,
      service: serviceMap['EDU_SCHOLARSHIP_PM']._id,
      department: deptMap['EDU'],
      formData: {
        personalInfo: {
          fullName: citizenUser.name,
          dob: '1998-05-14',
          gender: 'Male',
          mobile: '9876543210',
          email: citizenUser.email,
          address: citizenUser.address.street,
          city: citizenUser.address.city,
          state: citizenUser.address.state,
          pincode: citizenUser.address.pincode,
        },
        serviceDetails: {
          collegeName: 'COEP Technological University Pune',
          courseName: 'B.Tech Information Technology',
          annualTuitionFee: 95000,
        },
      },
      status: 'Additional Information Required',
      remarks: 'Please upload semester 4 marksheet showing CGPA and signed fee receipt from university accounts office.',
      interopReferenceId: 'MH-EDU-2026-991204',
      timeline: [
        {
          status: 'Submitted',
          action: 'Application Submitted Online',
          department: 'MahaConnect Unified Portal',
          performedByName: citizenUser.name,
          remarks: 'Citizen submitted scholarship form.',
          timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000),
        },
        {
          status: 'Additional Information Required',
          action: 'Clarification / Documents Requested',
          department: 'Higher & Technical Education Department',
          performedByName: 'Dr. S. K. Joshi (Scrutiny Officer)',
          remarks: 'Please upload semester 4 marksheet showing CGPA and signed fee receipt from university accounts office.',
          timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        },
      ],
    });

    console.log('[Seed] Inserting Sample Notifications...');
    await Notification.create([
      {
        user: citizenUser._id,
        title: 'Application Approved! 🎉',
        message: 'Your Income Certificate application MC-2026-000102 has been officially approved.',
        type: 'success',
        link: '/applications/MC-2026-000102',
        read: false,
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      },
      {
        user: citizenUser._id,
        title: 'Action Required: Additional Info Needed',
        message: 'The Higher Education Department requested additional marksheet documents for MC-2026-000104.',
        type: 'warning',
        link: '/applications/MC-2026-000104',
        read: false,
        createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      },
      {
        user: citizenUser._id,
        title: 'Application Update: Under Review',
        message: 'Your Driving Licence application MC-2026-000101 is now under scrutiny by Officer Ramesh Deshmukh.',
        type: 'info',
        link: '/applications/MC-2026-000101',
        read: true,
        createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
      },
    ]);

    console.log('[Seed] Inserting Simulated Interoperability API Logs...');
    await ApiLog.create([
      {
        source: 'MahaConnect Gateway',
        destination: 'Transport Department (Vahan/Sarathi API)',
        endpoint: '/v1/transport/applications',
        method: 'POST',
        statusCode: 201,
        responseTime: 52,
        status: 'SUCCESS',
        applicationId: 'MC-2026-000101',
        requestPayload: { appId: 'MC-2026-000101', serviceCode: 'TRANS_DL_NEW', citizen: 'Aarav Patil' },
        responsePayload: { status: 'ACKNOWLEDGED', departmentReferenceId: 'MH-MVD-2026-781923' },
        timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000),
      },
      {
        source: 'MahaConnect Gateway',
        destination: 'UIDAI Aadhaar e-KYC Verification API',
        endpoint: '/v2.5/identity/verify',
        method: 'POST',
        statusCode: 200,
        responseTime: 84,
        status: 'SUCCESS',
        requestPayload: { maskedAadhaar: 'XXXX-XXXX-4912', citizenName: 'Aarav Patil' },
        responsePayload: { verified: true, authCode: 'AUTH-992182' },
        timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000 + 500),
      },
      {
        source: 'MahaConnect Gateway',
        destination: 'Revenue & Land Records API (e-District)',
        endpoint: '/v1/revenue/certificates',
        method: 'POST',
        statusCode: 201,
        responseTime: 46,
        status: 'SUCCESS',
        applicationId: 'MC-2026-000102',
        requestPayload: { appId: 'MC-2026-000102', serviceCode: 'REV_INCOME_CERT', citizen: 'Aarav Patil' },
        responsePayload: { status: 'ACKNOWLEDGED', departmentReferenceId: 'MH-REV-2026-339182' },
        timestamp: new Date(Date.now() - 7 * 24 * 3600 * 1000),
      },
      {
        source: 'MahaConnect Gateway',
        destination: 'Urban Local Bodies Civil Registry API',
        endpoint: '/v1/municipal/registry',
        method: 'POST',
        statusCode: 201,
        responseTime: 61,
        status: 'SUCCESS',
        applicationId: 'MC-2026-000103',
        requestPayload: { appId: 'MC-2026-000103', serviceCode: 'MUNI_BIRTH_CERT' },
        responsePayload: { status: 'ACKNOWLEDGED', departmentReferenceId: 'MH-MCGM-2026-119283' },
        timestamp: new Date(Date.now() - 10 * 24 * 3600 * 1000),
      },
      {
        source: 'MahaConnect Gateway',
        destination: 'Higher & Technical Education API (MahaDBT)',
        endpoint: '/v1/education/scholarships',
        method: 'POST',
        statusCode: 201,
        responseTime: 73,
        status: 'SUCCESS',
        applicationId: 'MC-2026-000104',
        requestPayload: { appId: 'MC-2026-000104', serviceCode: 'EDU_SCHOLARSHIP_PM' },
        responsePayload: { status: 'ACKNOWLEDGED', departmentReferenceId: 'MH-EDU-2026-991204' },
        timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000),
      },
      {
        source: 'MahaConnect Gateway',
        destination: 'Transport Department (Vahan/Sarathi API)',
        endpoint: '/v1/transport/applications/MC-2026-000101/status',
        method: 'PATCH',
        statusCode: 200,
        responseTime: 38,
        status: 'SUCCESS',
        applicationId: 'MC-2026-000101',
        requestPayload: { status: 'Under Review', updatedBy: 'Ramesh Deshmukh' },
        responsePayload: { synced: true, departmentAuditId: 'AUD-882910' },
        timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000),
      },
      {
        source: 'MahaConnect Gateway',
        destination: 'Skill Development & Employment API (MahaSwayam)',
        endpoint: '/v1/employment/candidate/ping',
        method: 'GET',
        statusCode: 200,
        responseTime: 29,
        status: 'SUCCESS',
        requestPayload: {},
        responsePayload: { service: 'HEALTHY', activeJobsCount: 14209 },
        timestamp: new Date(Date.now() - 12 * 3600 * 1000),
      },
    ]);

    console.log('----------------------------------------------------');
    console.log('✅ MahaConnect Database seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('Demo Credentials:');
    console.log('👤 Citizen: citizen@demo.com | Password123!');
    console.log('👮 Transport Officer: officer@demo.com | Password123!');
    console.log('👮 Revenue Officer: revenue.officer@demo.com | Password123!');
    console.log('🛡️ Admin: admin@demo.com | Password123!');
    console.log('----------------------------------------------------');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
};

seedData();
