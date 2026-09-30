const Application = require('../models/Application');
const Service = require('../models/Service');
const Department = require('../models/Department');
const interopService = require('../services/interopService');
const { notifyStatusChange, createNotification } = require('../services/notificationService');
const { uploadFile } = require('../services/storageService');

// Helper to generate sequential/unique application ID
const generateApplicationId = async () => {
  const year = new Date().getFullYear();
  const count = await Application.countDocuments();
  const sequence = String(count + 1).padStart(6, '0');
  return `MC-${year}-${sequence}`;
};

// @desc    Submit new application
// @route   POST /api/applications
// @access  Private (Citizen)
exports.createApplication = async (req, res, next) => {
  try {
    const { serviceId, formData, documents } = req.body;

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: 'Service ID is required',
      });
    }

    const service = await Service.findById(serviceId).populate('department');
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Selected service does not exist',
      });
    }

    const department = service.department;
    const applicationId = await generateApplicationId();

    // Prepare initial timeline entries
    const initialTimeline = [
      {
        status: 'Submitted',
        action: 'Application Submitted Online',
        department: 'MahaConnect Unified Portal',
        performedByName: req.user.name,
        remarks: 'Application submitted successfully with verified citizen profile.',
        timestamp: new Date(),
      },
    ];

    // Create the application document
    const application = new Application({
      applicationId,
      user: req.user._id,
      service: service._id,
      department: department._id,
      formData: {
        personalInfo: formData?.personalInfo || {
          fullName: req.user.name,
          email: req.user.email,
          mobile: req.user.phone || '',
          address: req.user.address?.street || '',
          city: req.user.address?.city || '',
          state: req.user.address?.state || 'Maharashtra',
          pincode: req.user.address?.pincode || '',
        },
        serviceDetails: formData?.serviceDetails || {},
      },
      documents: documents || [],
      status: 'Submitted',
      timeline: initialTimeline,
    });

    await application.save();

    // Interoperability Dispatch: Send to simulated Department REST API
    try {
      const interopResult = await interopService.dispatchApplicationSubmission(
        application,
        department,
        service
      );

      if (interopResult?.departmentReferenceId) {
        application.interopReferenceId = interopResult.departmentReferenceId;

        // Append second timeline step: Department Received
        application.timeline.push({
          status: 'Department Received',
          action: 'Dispatched to Department Gateway',
          department: department.name,
          performedByName: 'Interop API Gateway',
          remarks: `Acknowledged by ${department.name}. State Reference ID: ${interopResult.departmentReferenceId} (latency: ${interopResult.responseTime}ms)`,
          timestamp: new Date(Date.now() + 1000),
        });

        await application.save();
      }
    } catch (gatewayErr) {
      console.error('[ApplicationController] Interop dispatch error:', gatewayErr.message);
    }

    // Create confirmation notification for citizen
    await createNotification({
      userId: req.user._id,
      title: 'Application Submitted Successfully',
      message: `Your application ${application.applicationId} for ${service.name} has been received.`,
      type: 'success',
      link: `/applications/${application.applicationId}`,
    });

    const populatedApp = await Application.findById(application._id)
      .populate('service', 'name code category processingTime')
      .populate('department', 'name code icon');

    res.status(201).json({
      success: true,
      message: 'Application submitted and dispatched to department gateway successfully',
      data: populatedApp,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current citizen's applications
// @route   GET /api/applications/my
// @access  Private (Citizen)
exports.getMyApplications = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      query.applicationId = { $regex: search.trim(), $options: 'i' };
    }

    const applications = await Application.find(query)
      .populate('service', 'name code category processingTime')
      .populate('department', 'name code icon')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get department officer's applications
// @route   GET /api/applications/department
// @access  Private (Officer)
exports.getDepartmentApplications = async (req, res, next) => {
  try {
    if (!req.user.department) {
      return res.status(400).json({
        success: false,
        message: 'Officer is not assigned to any department',
      });
    }

    const { status, search } = req.query;
    const query = { department: req.user.department._id || req.user.department };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { applicationId: { $regex: search.trim(), $options: 'i' } },
        { 'formData.personalInfo.fullName': { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const applications = await Application.find(query)
      .populate('user', 'name email phone')
      .populate('service', 'name code category processingTime')
      .populate('department', 'name code icon')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications/all
// @access  Private (Admin)
exports.getAllApplications = async (req, res, next) => {
  try {
    const { status, department, search, limit = 50, page = 1 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (department && department !== 'all') {
      query.department = department;
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { applicationId: { $regex: search.trim(), $options: 'i' } },
        { 'formData.personalInfo.fullName': { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 50;
    const skip = (parsedPage - 1) * parsedLimit;

    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .populate('user', 'name email phone')
      .populate('service', 'name code category')
      .populate('department', 'name code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit);

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application by ID or ApplicationId
// @route   GET /api/applications/:id
// @access  Private
exports.getApplicationById = async (req, res, next) => {
  try {
    const query = req.params.id.startsWith('MC-')
      ? { applicationId: req.params.id }
      : { _id: req.params.id };

    const application = await Application.findOne(query)
      .populate('user', 'name email phone address')
      .populate('service')
      .populate('department');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Role check: Citizen can only view their own
    if (
      req.user.role === 'citizen' &&
      application.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this application',
      });
    }

    // Officer check: Can only view their own department's applications
    if (
      req.user.role === 'officer' &&
      req.user.department &&
      application.department._id.toString() !== (req.user.department._id || req.user.department).toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view applications of other departments',
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status / add remarks (Officer & Admin)
// @route   PATCH /api/applications/:id/status
// @access  Private (Officer, Admin)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, remarks, action } = req.body;

    const allowedStatuses = [
      'Draft',
      'Submitted',
      'Under Review',
      'Additional Information Required',
      'Approved',
      'Rejected',
      'Completed',
    ];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed statuses: ${allowedStatuses.join(', ')}`,
      });
    }

    const query = req.params.id.startsWith('MC-')
      ? { applicationId: req.params.id }
      : { _id: req.params.id };

    const application = await Application.findOne(query)
      .populate('user')
      .populate('department')
      .populate('service');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check department ownership for officers
    if (
      req.user.role === 'officer' &&
      req.user.department &&
      application.department._id.toString() !== (req.user.department._id || req.user.department).toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify applications outside your department',
      });
    }

    const oldStatus = application.status;
    const newStatus = status || oldStatus;
    const officerRemarks = remarks || '';

    // Define timeline action description
    let actionDesc = action || `Status updated to ${newStatus}`;
    if (newStatus === 'Under Review' && oldStatus !== 'Under Review') {
      actionDesc = 'Officer Began Verification';
    } else if (newStatus === 'Additional Information Required') {
      actionDesc = 'Clarification / Documents Requested';
    } else if (newStatus === 'Approved') {
      actionDesc = 'Application Approved by Officer';
    } else if (newStatus === 'Rejected') {
      actionDesc = 'Application Rejected by Officer';
    } else if (newStatus === 'Completed') {
      actionDesc = 'Certificate / Service Dispatched & Completed';
    }

    // Add entry to timeline
    application.timeline.push({
      status: newStatus,
      action: actionDesc,
      department: application.department?.name || 'Department Officer',
      performedBy: req.user._id,
      performedByName: `${req.user.name} (${req.user.role === 'admin' ? 'Administrator' : 'Department Officer'})`,
      remarks: officerRemarks,
      timestamp: new Date(),
    });

    application.status = newStatus;
    application.remarks = officerRemarks;
    await application.save();

    // Interop Dispatch: Sync status update to Department REST API
    try {
      await interopService.dispatchStatusUpdate(
        application,
        application.department,
        newStatus,
        officerRemarks,
        req.user.name
      );
    } catch (interopErr) {
      console.error('[ApplicationController] Status sync error:', interopErr.message);
    }

    // In-app notification for the citizen
    await notifyStatusChange(application, newStatus, officerRemarks);

    res.status(200).json({
      success: true,
      message: `Application status successfully updated to ${newStatus}`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload documents endpoint
// @route   POST /api/applications/upload
// @access  Private (Citizen, Officer, Admin)
exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const uploadResult = await uploadFile(req.file);

    const docData = {
      documentType: req.body.documentType || 'Supporting Document',
      originalName: req.file.originalname,
      fileUrl: uploadResult.fileUrl,
      fileKey: uploadResult.fileKey,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      uploadedAt: new Date(),
    };

    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: docData,
    });
  } catch (error) {
    next(error);
  }
};
