const express = require('express');
const activityController = require('../controllers/activity.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get activity timeline
router.get('/', activityController.getActivities);

module.exports = router;
