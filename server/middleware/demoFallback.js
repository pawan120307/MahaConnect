const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const initialData = require('../seed/demoData');

// Clone in-memory store so changes (creates, status changes, new logs) persist across requests in the serverless instance
let departments = JSON.parse(JSON.stringify(initialData.departments));
let users = JSON.parse(JSON.stringify(initialData.users));
let services = JSON.parse(JSON.stringify(initialData.services));
let applications = JSON.parse(JSON.stringify(initialData.applications));
let notifications = JSON.parse(JSON.stringify(initialData.notifications));
let apiLogs = JSON.parse(JSON.stringify(initialData.apiLogs));

const JWT_SECRET = process.env.JWT_SECRET || 'mahaconnect_super_secret_jwt_key_2026_academics';

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const getAuthenticatedUser = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = users.find((u) => u._id === decoded.id || u.email.toLowerCase() === decoded.email?.toLowerCase());
      if (user) return user;
    } catch (e) {
      // invalid token, fallback below
    }
  }
  return users[0]; // fallback to Aarav Patil (citizen)
};

const demoFallbackMiddleware = (req, res, next) => {
  // If MongoDB is connected and ready, pass through to normal database routes!
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  const { method, url } = req;
  const path = url.split('?')[0];

  // Helper safe responses
  const send = (data, status = 200) => res.status(status).json(data);

  // 1. HEALTH CHECK
  if (path === '/api/health') {
    return send({
      success: true,
      message: 'MahaConnect API Gateway is running smoothly (Demo/Fallback Mode)',
      timestamp: new Date().toISOString(),
      interoperabilityEngine: 'ACTIVE',
      database: 'In-Memory State Store',
    });
  }

  // 2. AUTHENTICATION
  if (path === '/api/auth/login' && method === 'POST') {
    const { email, password } = req.body;
    if (!email || !password) {
      return send({ success: false, message: 'Please provide email and password.' }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    // If not found in default list, create/match seamlessly for academic presentation
    if (!user) {
      // Auto-detect role by email prefix if possible
      let role = 'citizen';
      let dept = null;
      if (cleanEmail.includes('officer') || cleanEmail.includes('admin')) {
        role = cleanEmail.includes('admin') ? 'admin' : 'officer';
        dept = departments[0];
      }
      user = {
        _id: '6abd' + Math.random().toString(16).substring(2, 22),
        name: cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        email: cleanEmail,
        password: password,
        phone: '9876543210',
        role,
        department: dept,
        address: { street: 'Main Road', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
        isActive: true,
        avatar: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(user);
    }

    const token = createToken(user);
    const userSafe = { ...user };
    delete userSafe.password;

    return send({
      success: true,
      token,
      user: userSafe,
    });
  }

  if (path === '/api/auth/register' && method === 'POST') {
    const { name, email, password, phone, address } = req.body;
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return send({ success: false, message: 'A user with this email address already exists.' }, 400);
    }

    const newUser = {
      _id: '6abd' + Math.random().toString(16).substring(2, 22),
      name: name || 'Citizen User',
      email: cleanEmail,
      password: password || 'Password123!',
      phone: phone || '9876543210',
      role: 'citizen',
      department: null,
      address: address || { street: 'Pune Central', city: 'Pune', state: 'Maharashtra', pincode: '411005' },
      isActive: true,
      avatar: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(newUser);

    const token = createToken(newUser);
    const userSafe = { ...newUser };
    delete userSafe.password;

    return send({ success: true, token, user: userSafe }, 201);
  }

  if (path === '/api/auth/me' && method === 'GET') {
    const user = getAuthenticatedUser(req);
    const userSafe = { ...user };
    delete userSafe.password;
    return send({ success: true, data: userSafe });
  }

  if (path === '/api/auth/profile' && method === 'PUT') {
    const user = getAuthenticatedUser(req);
    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.address) user.address = { ...user.address, ...req.body.address };
    const userSafe = { ...user };
    delete userSafe.password;
    return send({ success: true, data: userSafe });
  }

  if (path === '/api/auth/change-password' && method === 'PUT') {
    return send({ success: true, message: 'Password updated successfully' });
  }

  if (path === '/api/auth/forgot-password' && method === 'POST') {
    return send({ success: true, message: 'Password reset link sent to registered email' });
  }

  if (path.startsWith('/api/auth/reset-password/') && method === 'PUT') {
    return send({ success: true, message: 'Password reset successfully' });
  }

  // 3. DEPARTMENTS
  if (path === '/api/departments' && method === 'GET') {
    return send({ success: true, count: departments.length, data: departments });
  }

  if (path.startsWith('/api/departments/') && method === 'GET') {
    const id = path.split('/')[3];
    const dept = departments.find((d) => d._id === id || d.code === id);
    if (!dept) return send({ success: false, message: 'Department not found' }, 404);
    return send({ success: true, data: dept });
  }

  if (path === '/api/departments' && method === 'POST') {
    const newDept = {
      _id: '6abd' + Math.random().toString(16).substring(2, 22),
      ...req.body,
      status: req.body.status || 'active',
      createdAt: new Date(),
    };
    departments.push(newDept);
    return send({ success: true, data: newDept }, 201);
  }

  if (path.startsWith('/api/departments/') && method === 'PUT') {
    const id = path.split('/')[3];
    const dept = departments.find((d) => d._id === id);
    if (dept) Object.assign(dept, req.body);
    return send({ success: true, data: dept });
  }

  if (path.startsWith('/api/departments/') && method === 'DELETE') {
    const id = path.split('/')[3];
    departments = departments.filter((d) => d._id !== id);
    return send({ success: true, message: 'Department deleted successfully' });
  }

  // 4. SERVICES
  if (path === '/api/services' && method === 'GET') {
    const urlParams = new URLSearchParams(url.includes('?') ? url.split('?')[1] : '');
    const limit = parseInt(urlParams.get('limit')) || 0;
    const search = urlParams.get('search') ? urlParams.get('search').toLowerCase() : '';
    const deptId = urlParams.get('department');
    const category = urlParams.get('category');

    let result = services;
    if (search) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.description.toLowerCase().includes(search) ||
          s.category.toLowerCase().includes(search)
      );
    }
    if (deptId && deptId !== 'all') {
      result = result.filter((s) => s.department?._id === deptId || s.department === deptId);
    }
    if (category && category !== 'all') {
      result = result.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }
    if (limit > 0) {
      result = result.slice(0, limit);
    }
    return send({ success: true, count: result.length, data: result });
  }

  if (path.startsWith('/api/services/') && method === 'GET') {
    const id = path.split('/')[3];
    const svc = services.find((s) => s._id === id || s.code === id);
    if (!svc) return send({ success: false, message: 'Service not found' }, 404);
    return send({ success: true, data: svc });
  }

  if (path === '/api/services' && method === 'POST') {
    const dept = departments.find((d) => d._id === req.body.department) || departments[0];
    const newSvc = {
      _id: '6abd' + Math.random().toString(16).substring(2, 22),
      ...req.body,
      department: dept,
      status: req.body.status || 'active',
      createdAt: new Date(),
    };
    services.push(newSvc);
    return send({ success: true, data: newSvc }, 201);
  }

  if (path.startsWith('/api/services/') && method === 'PUT') {
    const id = path.split('/')[3];
    const svc = services.find((s) => s._id === id);
    if (svc) Object.assign(svc, req.body);
    return send({ success: true, data: svc });
  }

  if (path.startsWith('/api/services/') && method === 'DELETE') {
    const id = path.split('/')[3];
    services = services.filter((s) => s._id !== id);
    return send({ success: true, message: 'Service deleted successfully' });
  }

  // 5. APPLICATIONS
  if (path === '/api/applications/my' && method === 'GET') {
    return send({ success: true, count: applications.length, data: applications });
  }

  if (path === '/api/applications/department' && method === 'GET') {
    const currentUser = getAuthenticatedUser(req);
    let deptApps = applications;
    if (currentUser?.department?._id) {
      deptApps = applications.filter((a) => a.department?._id === currentUser.department._id);
    }
    return send({ success: true, count: deptApps.length, data: deptApps });
  }

  if (path === '/api/applications/all' && method === 'GET') {
    return send({
      success: true,
      total: applications.length,
      pages: 1,
      page: 1,
      count: applications.length,
      data: applications,
    });
  }

  if (path.startsWith('/api/applications/') && method === 'GET' && !path.includes('/upload')) {
    const id = path.split('/')[3];
    const app = applications.find((a) => a.applicationId === id || a._id === id);
    if (!app) return send({ success: false, message: 'Application not found' }, 404);
    return send({ success: true, data: app });
  }

  if (path === '/api/applications/upload' && method === 'POST') {
    return send({
      success: true,
      file: {
        url: '/uploads/sample_document.pdf',
        originalName: 'document_proof.pdf',
        mimeType: 'application/pdf',
        fileSize: 420000,
      },
    });
  }

  if (path === '/api/applications' && method === 'POST') {
    const currentUser = getAuthenticatedUser(req);
    const serviceId = req.body.service;
    const svc = services.find((s) => s._id === serviceId || s.code === serviceId) || services[0];
    const dept = svc.department || departments[0];

    const appId = `MC-2026-${String(applications.length + 105).padStart(6, '0')}`;
    const extRef = `MH-${dept.code || 'GOV'}-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const newApp = {
      _id: '6abd' + Math.random().toString(16).substring(2, 22),
      applicationId: appId,
      user: currentUser,
      service: svc,
      department: dept,
      formData: req.body.formData || {},
      documents: req.body.documents || [
        {
          documentType: 'Aadhaar Identity Proof',
          originalName: 'aadhaar_card.pdf',
          fileUrl: '/uploads/sample_aadhaar.pdf',
          fileSize: 350000,
          mimeType: 'application/pdf',
        },
      ],
      status: 'Submitted',
      remarks: 'Application received and registered in MahaConnect Interoperability Network.',
      interopReferenceId: extRef,
      createdAt: new Date(),
      updatedAt: new Date(),
      timeline: [
        {
          status: 'Submitted',
          action: 'Application Submitted Online',
          department: 'MahaConnect Unified Portal',
          performedByName: currentUser.name,
          remarks: 'Citizen completed digital submission and fee payment.',
          timestamp: new Date(),
        },
        {
          status: 'Department Received',
          action: 'Dispatched to Department Gateway',
          department: dept.name,
          performedByName: 'Interop API Gateway',
          remarks: `Successfully routed to ${dept.name} backend gateway. Ref: ${extRef}`,
          timestamp: new Date(Date.now() + 2000),
        },
      ],
    };

    applications.unshift(newApp);

    // Add simulated API Log for Interoperability
    apiLogs.unshift({
      _id: '6abd' + Math.random().toString(16).substring(2, 22),
      source: 'MahaConnect Gateway',
      destination: `${dept.name} (${dept.code} API)`,
      endpoint: `/v1/${dept.code.toLowerCase()}/applications`,
      method: 'POST',
      statusCode: 201,
      responseTime: Math.floor(35 + Math.random() * 40),
      status: 'SUCCESS',
      applicationId: appId,
      requestPayload: { appId, serviceCode: svc.code, citizen: currentUser.name },
      responsePayload: { status: 'ACKNOWLEDGED', departmentReferenceId: extRef },
      timestamp: new Date(),
    });

    // Add Notification
    notifications.unshift({
      _id: '6abd' + Math.random().toString(16).substring(2, 22),
      user: currentUser._id,
      title: 'Application Submitted Successfully',
      message: `Your application ${appId} for ${svc.name} has been routed to ${dept.name}.`,
      type: 'info',
      link: `/applications/${appId}`,
      read: false,
      createdAt: new Date(),
    });

    return send(
      {
        success: true,
        message: 'Application submitted successfully to MahaConnect Interoperability Gateway',
        data: newApp,
      },
      201
    );
  }

  if (path.match(/\/api\/applications\/[^/]+\/status/) && method === 'PATCH') {
    const id = path.split('/')[3];
    const { status, remarks } = req.body;
    const currentUser = getAuthenticatedUser(req);
    const app = applications.find((a) => a.applicationId === id || a._id === id);

    if (!app) {
      return send({ success: false, message: 'Application not found' }, 404);
    }

    app.status = status || app.status;
    if (remarks) app.remarks = remarks;
    app.updatedAt = new Date();

    app.timeline.push({
      status: app.status,
      action: `Status Updated to ${app.status}`,
      department: app.department?.name || 'Department Gateway',
      performedByName: `${currentUser.name} (${currentUser.role.toUpperCase()})`,
      remarks: remarks || `Application moved to ${app.status}`,
      timestamp: new Date(),
    });

    // Add Notification for citizen
    notifications.unshift({
      _id: '6abd' + Math.random().toString(16).substring(2, 22),
      user: app.user?._id || users[0]._id,
      title: `Application ${app.status}`,
      message: `Your application ${app.applicationId} status has been updated to "${app.status}".`,
      type: app.status === 'Approved' || app.status === 'Completed' ? 'success' : app.status === 'Rejected' ? 'error' : 'info',
      link: `/applications/${app.applicationId}`,
      read: false,
      createdAt: new Date(),
    });

    // Add Interop Log
    apiLogs.unshift({
      _id: '6abd' + Math.random().toString(16).substring(2, 22),
      source: 'MahaConnect Gateway',
      destination: `${app.department?.name || 'Department'} Gateway`,
      endpoint: `/v1/${app.department?.code?.toLowerCase() || 'dept'}/applications/${app.applicationId}/status`,
      method: 'PATCH',
      statusCode: 200,
      responseTime: Math.floor(25 + Math.random() * 30),
      status: 'SUCCESS',
      applicationId: app.applicationId,
      requestPayload: { status: app.status, updatedBy: currentUser.name },
      responsePayload: { synced: true, timestamp: new Date() },
      timestamp: new Date(),
    });

    return send({
      success: true,
      message: `Application status updated to ${app.status}`,
      data: app,
    });
  }

  // 6. NOTIFICATIONS
  if (path === '/api/notifications' && method === 'GET') {
    return send({ success: true, count: notifications.length, data: notifications });
  }

  if (path === '/api/notifications/read-all' && method === 'PATCH') {
    notifications.forEach((n) => (n.read = true));
    return send({ success: true, message: 'All notifications marked as read' });
  }

  if (path.match(/\/api\/notifications\/[^/]+\/read/) && method === 'PATCH') {
    const id = path.split('/')[3];
    const notif = notifications.find((n) => n._id === id);
    if (notif) notif.read = true;
    return send({ success: true, data: notif });
  }

  // 7. ANALYTICS
  if (path === '/api/analytics/citizen' && method === 'GET') {
    const underReview = applications.filter((a) => a.status === 'Under Review').length;
    const approved = applications.filter((a) => a.status === 'Approved').length;
    const completed = applications.filter((a) => a.status === 'Completed').length;
    const actionRequired = applications.filter((a) => a.status === 'Additional Information Required').length;
    const rejected = applications.filter((a) => a.status === 'Rejected').length;

    return send({
      success: true,
      data: {
        totalApplications: applications.length,
        underReview,
        approved,
        completed,
        actionRequired,
        rejected,
        recentApplications: applications.slice(0, 4),
        statusBreakdown: {
          'Under Review': underReview,
          Approved: approved,
          Completed: completed,
          'Additional Information Required': actionRequired,
          Rejected: rejected,
        },
      },
    });
  }

  if (path === '/api/analytics/officer' && method === 'GET') {
    const pending = applications.filter((a) => a.status === 'Under Review' || a.status === 'Submitted').length;
    const approved = applications.filter((a) => a.status === 'Approved').length;
    const actionReq = applications.filter((a) => a.status === 'Additional Information Required').length;

    return send({
      success: true,
      data: {
        departmentName: 'Transport Department',
        totalAssigned: applications.length,
        pendingReview: pending,
        approvedToday: approved,
        additionalInfoRequested: actionReq,
        avgProcessingDays: 3.2,
        recentApplications: applications.slice(0, 5),
      },
    });
  }

  if (path === '/api/analytics/admin' && method === 'GET') {
    return send({
      success: true,
      data: {
        totalUsers: users.length,
        totalApplications: applications.length,
        departmentsCount: departments.length,
        servicesCount: services.length,
        systemUptime: '99.98%',
        interoperabilityCalls: apiLogs.length + 328,
        activeSyncs: departments.length,
        statusBreakdown: {
          'Under Review': 1,
          Approved: 1,
          Completed: 1,
          'Additional Info': 1,
        },
        recentApplications: applications.slice(0, 5),
      },
    });
  }

  // 8. API LOGS
  if (path === '/api/api-logs' && method === 'GET') {
    return send({
      success: true,
      total: apiLogs.length,
      pages: 1,
      page: 1,
      count: apiLogs.length,
      data: apiLogs,
    });
  }

  if (path === '/api/api-logs/stats' && method === 'GET') {
    return send({
      success: true,
      data: {
        totalCalls: apiLogs.length + 328,
        successRate: 99.4,
        avgResponseTime: 44.8,
        activeEndpoints: 7,
      },
    });
  }

  if (path === '/api/api-logs' && method === 'DELETE') {
    apiLogs = [];
    return send({ success: true, message: 'API logs cleared successfully' });
  }

  // 9. USERS (ADMIN)
  if (path === '/api/users' && method === 'GET') {
    const safeUsers = users.map((u) => {
      const copy = { ...u };
      delete copy.password;
      return copy;
    });
    return send({ success: true, count: safeUsers.length, data: safeUsers });
  }

  if (path.match(/\/api\/users\/[^/]+\/toggle-status/) && method === 'PATCH') {
    const id = path.split('/')[3];
    const user = users.find((u) => u._id === id);
    if (user) user.isActive = !user.isActive;
    return send({ success: true, message: `User status changed to ${user?.isActive ? 'active' : 'inactive'}` });
  }

  if (path === '/api/users' && method === 'POST') {
    const newUser = {
      _id: '6abd' + Math.random().toString(16).substring(2, 22),
      ...req.body,
      isActive: true,
      createdAt: new Date(),
    };
    users.push(newUser);
    return send({ success: true, data: newUser }, 201);
  }

  // Default fallback if path not recognized
  return next();
};

module.exports = demoFallbackMiddleware;
