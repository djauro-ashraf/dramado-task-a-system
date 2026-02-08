const path = require('path');
const activityService = require('../services/activity.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * Upload custom alarm sound
 * POST /api/upload/alarm
 */
const uploadAlarm = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('No file uploaded');
  }

  // Generate URL for the uploaded file
  const fileUrl = `/uploads/alarms/${req.file.filename}`;

  // Log activity
  await activityService.logActivity(
    req.user.id,
    null,
    'UPLOAD_SOUND',
    `🎵 Custom alarm sound uploaded! "${req.file.originalname}" - This just got personal!`,
    {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    }
  );

  res.status(201).json({
    success: true,
    message: '🎵 Alarm sound uploaded successfully!',
    data: {
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    }
  });
});

module.exports = {
  uploadAlarm
};
