const express = require('express');
const uploadController = require('../controllers/upload.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { upload, handleMulterError } = require('../middleware/upload.middleware');
const { uploadLimiter } = require('../middleware/rateLimit.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Upload alarm sound
router.post(
  '/alarm',
  uploadLimiter,
  upload.single('alarm'),
  handleMulterError,
  uploadController.uploadAlarm
);

module.exports = router;
