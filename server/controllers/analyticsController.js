const Application = require('../models/Application');
const Department = require('../models/Department');
const Service = require('../models/Service');
const User = require('../models/User');
const ApiLog = require('../models/ApiLog');

// @desc    Citizen statistics
// @route   GET /api/analytics/citizen
// @access  Private (Citizen)
exports.getCitizenAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const total = await Application.countDocuments({ user: userId });
    const pending = await Application.countDocuments({
      user: userId,
      status: { $in: ['Submitted', 'Under Review', 'Additional Information Required'] },
    });
    const approved = await Application.countDocuments({
      user: userId,
      status: { $in: ['Approved', 'Completed'] },
    });
    const rejected = await Application.countDocuments({
      user: userId,
      status: 'Rejected',
    });

    const recentApplications = await Application.find({ user: userId })
      .populate('service', 'name code category')
      .populate('department', 'name code')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
        recentApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Department Officer statistics
// @route   GET /api/analytics/officer
// @access  Private (Officer)
exports.getOfficerAnalytics = async (req, res, next) => {
  try {
    const departmentId = req.user.department?._id || req.user.department;

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: 'No department assigned to officer',
      });
    }

    const total = await Application.countDocuments({ department: departmentId });
    const submitted = await Application.countDocuments({
      department: departmentId,
      status: 'Submitted',
    });
    const underReview = await Application.countDocuments({
      department: departmentId,
      status: 'Under Review',
    });
    const infoRequired = await Application.countDocuments({
      department: departmentId,
      status: 'Additional Information Required',
    });
    const approved = await Application.countDocuments({
      department: departmentId,
      status: { $in: ['Approved', 'Completed'] },
    });
    const rejected = await Application.countDocuments({
      department: departmentId,
      status: 'Rejected',
    });

    const recentApplications = await Application.find({ department: departmentId })
      .populate('user', 'name email phone')
      .populate('service', 'name code')
      .sort({ updatedAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: {
        total,
        pending: submitted + underReview,
        requiringAction: infoRequired,
        approved,
        rejected,
        breakdown: {
          submitted,
          underReview,
          infoRequired,
          approved,
          rejected,
        },
        recentApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin comprehensive analytics
// @route   GET /api/analytics/admin
// @access  Private (Admin)
exports.getAdminAnalytics = async (req, res, next) => {
  try {
    const totalCitizens = await User.countDocuments({ role: 'citizen' });
    const totalOfficers = await User.countDocuments({ role: 'officer' });
    const totalDepartments = await Department.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalApplications = await Application.countDocuments();

    // Applications by status
    const statusCounts = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusMap = {
      Submitted: 0,
      'Under Review': 0,
      'Additional Information Required': 0,
      Approved: 0,
      Rejected: 0,
      Completed: 0,
    };
    statusCounts.forEach((sc) => {
      if (sc._id) statusMap[sc._id] = sc.count;
    });

    // Applications by Department
    const deptCounts = await Application.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'departmentInfo',
        },
      },
      { $unwind: '$departmentInfo' },
      {
        $project: {
          departmentName: '$departmentInfo.name',
          departmentCode: '$departmentInfo.code',
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Top services by application count
    const topServices = await Application.aggregate([
      {
        $group: {
          _id: '$service',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: '_id',
          as: 'serviceInfo',
        },
      },
      { $unwind: '$serviceInfo' },
      {
        $project: {
          serviceName: '$serviceInfo.name',
          count: 1,
        },
      },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // Interoperability stats
    const totalApiLogs = await ApiLog.countDocuments();
    const successfulApiLogs = await ApiLog.countDocuments({ status: 'SUCCESS' });
    const avgLatencyResult = await ApiLog.aggregate([
      {
        $group: {
          _id: null,
          avgLatency: { $avg: '$responseTime' },
        },
      },
    ]);
    const avgLatency = avgLatencyResult.length > 0 ? Math.round(avgLatencyResult[0].avgLatency) : 48;

    // Monthly / Trend data
    const monthlyTrends = await Application.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalCitizens,
          totalOfficers,
          totalDepartments,
          totalServices,
          totalApplications,
          pendingApplications: statusMap['Submitted'] + statusMap['Under Review'] + statusMap['Additional Information Required'],
          approvedApplications: statusMap['Approved'] + statusMap['Completed'],
          rejectedApplications: statusMap['Rejected'],
        },
        statusBreakdown: statusMap,
        departmentDistribution: deptCounts,
        topServices,
        interopHealth: {
          totalCalls: totalApiLogs,
          successRate: totalApiLogs > 0 ? Math.round((successfulApiLogs / totalApiLogs) * 100) : 100,
          avgLatencyMs: avgLatency,
        },
        monthlyTrends,
      },
    });
  } catch (error) {
    next(error);
  }
};
