const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  toggleUserStatus,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get('/', protect, authorize('admin'), getUsers);
router.post('/', protect, authorize('admin'), createUser);
router.patch('/:id/toggle-status', protect, authorize('admin'), toggleUserStatus);

module.exports = router;
