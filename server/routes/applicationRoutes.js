const express = require('express');
const router = express.Router();
const {
  createApplication,
  getMyApplications,
  getDepartmentApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  uploadDocument,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const upload = require('../middleware/upload');

// Document upload route
router.post('/upload', protect, upload.single('file'), uploadDocument);

// Role-specific lists
router.get('/my', protect, authorize('citizen'), getMyApplications);
router.get('/department', protect, authorize('officer', 'admin'), getDepartmentApplications);
router.get('/all', protect, authorize('admin'), getAllApplications);

// General application routes
router.post('/', protect, authorize('citizen'), createApplication);
router.get('/:id', protect, getApplicationById);
router.patch('/:id/status', protect, authorize('officer', 'admin'), updateApplicationStatus);

module.exports = router;
