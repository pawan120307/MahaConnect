const User = require('../models/User');

// @desc    Get all users with filtering (Admin)
// @route   GET /api/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { role, search, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status !== undefined && status !== 'all') {
      query.isActive = status === 'active';
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 20;
    const skip = (parsedPage - 1) * parsedLimit;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('department', 'name code')
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new user / officer (Admin)
// @route   POST /api/users
// @access  Private (Admin)
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, department, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      password: password || 'Default@12345',
      phone: phone || '',
      role: role || 'citizen',
      department: role === 'officer' ? department : null,
      address: address || {},
    });

    const populatedUser = await User.findById(user._id)
      .populate('department', 'name code')
      .select('-password');

    res.status(201).json({
      success: true,
      message: `${role.toUpperCase()} account created successfully`,
      data: populatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (Active / Inactive)
// @route   PATCH /api/users/:id/toggle-status
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deactivating own admin account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own administrative account.',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User marked as ${user.isActive ? 'Active' : 'Inactive'}`,
      data: {
        id: user._id,
        name: user.name,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};
