const express = require('express');
const router = express.Router();
const {
  getApiLogs,
  getApiLogStats,
  clearApiLogs,
} = require('../controllers/apiLogController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get('/', protect, authorize('admin'), getApiLogs);
router.get('/stats', protect, authorize('admin'), getApiLogStats);
router.delete('/', protect, authorize('admin'), clearApiLogs);

module.exports = router;
