const Service = require('../models/Service');
const Application = require('../models/Application');

// @desc    Get all services with optional search and filters
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res, next) => {
  try {
    const { department, category, search, status } = req.query;

    const query = {};

    if (department && department !== 'all') {
      query.department = department;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (status) {
      query.status = status;
    } else {
      // default to active for public queries
      query.status = 'active';
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { code: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const services = await Service.find(query)
      .populate('department', 'name code icon contactEmail')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      'department',
      'name code icon contactEmail contactPhone'
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Admin)
exports.createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    const populated = await Service.findById(service._id).populate('department');

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Admin)
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('department');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Deactivate service
// @route   DELETE /api/services/:id
// @access  Private (Admin)
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    const appCount = await Application.countDocuments({ service: service._id });
    if (appCount > 0) {
      service.status = service.status === 'active' ? 'inactive' : 'active';
      await service.save();
      return res.status(200).json({
        success: true,
        message: `Service has ${appCount} applications. Status toggled to ${service.status}.`,
        data: service,
      });
    }

    await service.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
