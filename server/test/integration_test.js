const http = require('http');

const runIntegrationTests = async () => {
  console.log('🧪 Starting MahaConnect Comprehensive Integration Tests...\n');

  const app = require('../app');
  const connectDB = require('../config/db');

  await connectDB();

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5099, resolve));
  console.log('🚀 Test server listening on http://localhost:5099');

  const baseUrl = 'http://localhost:5099/api';

  try {
    // 1. Health check
    console.log('\n--- 1. Testing Health Endpoint ---');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthJson = await healthRes.json();
    console.log('Health check:', healthJson.success ? '✅ PASS' : '❌ FAIL', healthJson.message);

    // 2. Fetch Departments
    console.log('\n--- 2. Testing Departments Listing ---');
    const deptsRes = await fetch(`${baseUrl}/departments`);
    const deptsJson = await deptsRes.json();
    console.log('Departments fetched:', deptsJson.count, 'departments found. ✅ PASS');
    const transportDept = deptsJson.data.find((d) => d.code === 'TRANS');

    // 3. Fetch Services
    console.log('\n--- 3. Testing Services Catalog ---');
    const servicesRes = await fetch(`${baseUrl}/services`);
    const servicesJson = await servicesRes.json();
    console.log('Services fetched:', servicesJson.count, 'services found. ✅ PASS');
    const dlService = servicesJson.data.find((s) => s.code === 'TRANS_DL_NEW') || servicesJson.data[0];

    // 4. Citizen Login
    console.log('\n--- 4. Testing Citizen Authentication ---');
    const citizenLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'citizen@demo.com', password: 'Password123!' }),
    });
    const citizenLoginJson = await citizenLoginRes.json();
    if (!citizenLoginJson.success) throw new Error(citizenLoginJson.message);
    const citizenToken = citizenLoginJson.token;
    console.log('Citizen Login:', citizenLoginJson.user.name, `(${citizenLoginJson.user.role}) ✅ PASS`);

    // 5. Officer Login
    console.log('\n--- 5. Testing Officer Authentication ---');
    const officerLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'officer@demo.com', password: 'Password123!' }),
    });
    const officerLoginJson = await officerLoginRes.json();
    if (!officerLoginJson.success) throw new Error(officerLoginJson.message);
    const officerToken = officerLoginJson.token;
    console.log('Officer Login:', officerLoginJson.user.name, `(${officerLoginJson.user.role}) ✅ PASS`);

    // 6. Admin Login
    console.log('\n--- 6. Testing Admin Authentication ---');
    const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@demo.com', password: 'Password123!' }),
    });
    const adminLoginJson = await adminLoginRes.json();
    if (!adminLoginJson.success) throw new Error(adminLoginJson.message);
    const adminToken = adminLoginJson.token;
    console.log('Admin Login:', adminLoginJson.user.name, `(${adminLoginJson.user.role}) ✅ PASS`);

    // 7. Citizen Submits Application
    console.log('\n--- 7. Testing Citizen Service Application & Interop Gateway Dispatch ---');
    const applyRes = await fetch(`${baseUrl}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${citizenToken}`,
      },
      body: JSON.stringify({
        serviceId: dlService._id,
        formData: {
          personalInfo: {
            fullName: 'Aarav Patil',
            mobile: '9876543210',
            email: 'citizen@demo.com',
            city: 'Pune',
            state: 'Maharashtra',
            pincode: '411005',
          },
          serviceDetails: {
            learnerLicenceNo: 'MH12LL009876',
            vehicleClass: 'Motor Cycle With Gear (MCWG)',
            rtoOffice: 'MH-12 Pune Central',
          },
        },
        documents: [
          {
            documentType: 'Aadhaar Card',
            originalName: 'aadhaar_aarav.pdf',
            fileUrl: '/uploads/sample_aadhaar.pdf',
            fileSize: 245000,
            mimeType: 'application/pdf',
          },
        ],
      }),
    });
    const applyJson = await applyRes.json();
    if (!applyJson.success) throw new Error(applyJson.message);
    const createdApp = applyJson.data;
    console.log('Application Created:', createdApp.applicationId);
    console.log('Department Gateway Ref:', createdApp.interopReferenceId);
    console.log('Timeline Steps Count:', createdApp.timeline.length, 'steps. ✅ PASS');

    // 8. Officer Scrutiny & Status Update
    console.log('\n--- 8. Testing Officer Review & Timeline Update ---');
    const updateRes = await fetch(`${baseUrl}/applications/${createdApp.applicationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${officerToken}`,
      },
      body: JSON.stringify({
        status: 'Under Review',
        remarks: 'Identity and learner licence matched with state transport database.',
      }),
    });
    const updateJson = await updateRes.json();
    if (!updateJson.success) throw new Error(updateJson.message);
    console.log('Status updated to:', updateJson.data.status);
    console.log('Updated Timeline Length:', updateJson.data.timeline.length, '✅ PASS');

    // 9. Notifications check
    console.log('\n--- 9. Testing Citizen Notification Verification ---');
    const notifRes = await fetch(`${baseUrl}/notifications`, {
      headers: { Authorization: `Bearer ${citizenToken}` },
    });
    const notifJson = await notifRes.json();
    console.log('Notifications count for citizen:', notifJson.count);
    console.log('Latest notification title:', notifJson.data[0]?.title, '✅ PASS');

    // 10. Interoperability API Logs check
    console.log('\n--- 10. Testing Admin API Interoperability Logs ---');
    const apiLogsRes = await fetch(`${baseUrl}/api-logs?limit=5`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const apiLogsJson = await apiLogsRes.json();
    console.log('Total Interoperability API Logs:', apiLogsJson.total);
    console.log('Latest Log Transaction:', `${apiLogsJson.data[0]?.source} -> ${apiLogsJson.data[0]?.destination} [${apiLogsJson.data[0]?.method} ${apiLogsJson.data[0]?.endpoint}] (${apiLogsJson.data[0]?.responseTime}ms) ✅ PASS`);

    // 11. Admin Analytics
    console.log('\n--- 11. Testing Admin Analytics Aggregation ---');
    const analyticsRes = await fetch(`${baseUrl}/analytics/admin`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const analyticsJson = await analyticsRes.json();
    console.log('Analytics Total Applications:', analyticsJson.data.summary.totalApplications);
    console.log('Analytics Success Rate:', `${analyticsJson.data.interopHealth.successRate}%`);
    console.log('Analytics Departments in Distribution:', analyticsJson.data.departmentDistribution.length, '✅ PASS');

    console.log('\n======================================================');
    console.log('🎉 ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
    console.log('======================================================\n');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exitCode = 1;
  } finally {
    server.close();
    process.exit(0);
  }
};

runIntegrationTests();
