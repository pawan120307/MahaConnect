const Department = require('../models/Department');
const Service = require('../models/Service');
const Application = require('../models/Application');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
exports.getDepartments = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    } else if (!req.user || req.user.role === 'citizen') {
      filter.status = 'active';
    }

    const departments = await Department.find(filter).sort({ name: 1 });

    // Attach service count for each department
    const departmentsWithCounts = await Promise.all(
      departments.map(async (dept) => {
        const servicesCount = await Service.countDocuments({
          department: dept._id,
          status: 'active',
        });
        const applicationsCount = await Application.countDocuments({
          department: dept._id,
        });
        return {
          ...dept.toObject(),
          servicesCount,
          applicationsCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: departmentsWithCounts.length,
      data: departmentsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single department with its services
// @route   GET /api/departments/:id
// @access  Public
exports.getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    const services = await Service.find({
      department: department._id,
      status: 'active',
    });

    res.status(200).json({
      success: true,
      data: {
        ...department.toObject(),
        services,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new department
// @route   POST /api/departments
// @access  Private (Admin)
exports.createDepartment = async (req, res, next) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin)
exports.updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Deactivate department
// @route   DELETE /api/departments/:id
// @access  Private (Admin)
exports.deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }

    // Toggle status or delete if no applications
    const appCount = await Application.countDocuments({ department: department._id });
    if (appCount > 0) {
      department.status = department.status === 'active' ? 'inactive' : 'active';
      await department.save();
      return res.status(200).json({
        success: true,
        message: `Department has ${appCount} associated applications. Status toggled to ${department.status}.`,
        data: department,
      });
    }

    await department.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Department deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
