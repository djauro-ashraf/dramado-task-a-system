const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');
const config = require('../config/env');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads', 'alarms'));
  },
  filename: (req, file, cb) => {
    // Generate unique filename: userId-timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `alarm-${req.user.id}-${uniqueSuffix}${ext}`);
  }
});

// File filter - only allow audio files
const fileFilter = (req, file, cb) => {
  const allowedTypes = config.ALLOWED_AUDIO_TYPES;
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest('Only audio files are allowed (MP3, WAV, OGG)'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.MAX_FILE_SIZE
  },
  fileFilter: fileFilter
});

// Error handler for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(ApiError.badRequest('File too large. Maximum size is 5MB'));
    }
    return next(ApiError.badRequest(err.message));
  }
  next(err);
};

module.exports = {
  upload,
  handleMulterError
};
