const express = require('express');
const router = express.Router();
const {
  getCitizenAnalytics,
  getOfficerAnalytics,
  getAdminAnalytics,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get('/citizen', protect, authorize('citizen'), getCitizenAnalytics);
router.get('/officer', protect, authorize('officer', 'admin'), getOfficerAnalytics);
router.get('/admin', protect, authorize('admin'), getAdminAnalytics);

module.exports = router;
