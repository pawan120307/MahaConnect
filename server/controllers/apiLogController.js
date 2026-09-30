const ApiLog = require('../models/ApiLog');

// @desc    Get API Logs for Interoperability Audit
// @route   GET /api/api-logs
// @access  Private (Admin)
exports.getApiLogs = async (req, res, next) => {
  try {
    const { destination, status, method, search, page = 1, limit = 25 } = req.query;
    const query = {};

    if (destination && destination !== 'all') {
      query.destination = { $regex: destination, $options: 'i' };
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (method && method !== 'all') {
      query.method = method;
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { endpoint: { $regex: search.trim(), $options: 'i' } },
        { applicationId: { $regex: search.trim(), $options: 'i' } },
        { destination: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 25;
    const skip = (parsedPage - 1) * parsedLimit;

    const total = await ApiLog.countDocuments(query);
    const logs = await ApiLog.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parsedLimit);

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Interoperability Gateway Stats
// @route   GET /api/api-logs/stats
// @access  Private (Admin)
exports.getApiLogStats = async (req, res, next) => {
  try {
    const totalCalls = await ApiLog.countDocuments();
    const successfulCalls = await ApiLog.countDocuments({ status: 'SUCCESS' });
    const failedCalls = await ApiLog.countDocuments({ status: 'FAILED' });

    const avgLatencyResult = await ApiLog.aggregate([
      {
        $group: {
          _id: null,
          avgLatency: { $avg: '$responseTime' },
          minLatency: { $min: '$responseTime' },
          maxLatency: { $max: '$responseTime' },
        },
      },
    ]);

    const destinationBreakdown = await ApiLog.aggregate([
      {
        $group: {
          _id: '$destination',
          count: { $sum: 1 },
          avgLatency: { $avg: '$responseTime' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCalls,
        successfulCalls,
        failedCalls,
        successRate: totalCalls > 0 ? Math.round((successfulCalls / totalCalls) * 100) : 100,
        latency: {
          avg: avgLatencyResult[0] ? Math.round(avgLatencyResult[0].avgLatency) : 0,
          min: avgLatencyResult[0] ? Math.round(avgLatencyResult[0].minLatency) : 0,
          max: avgLatencyResult[0] ? Math.round(avgLatencyResult[0].maxLatency) : 0,
        },
        destinationBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear API logs (maintenance)
// @route   DELETE /api/api-logs
// @access  Private (Admin)
exports.clearApiLogs = async (req, res, next) => {
  try {
    await ApiLog.deleteMany({});
    res.status(200).json({
      success: true,
      message: 'Interoperability API logs cleared successfully',
    });
  } catch (error) {
    next(error);
  }
};
