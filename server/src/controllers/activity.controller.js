const activityService = require('../services/activity.service');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Get user's activity timeline
 * GET /api/activity
 */
const getActivities = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const skip  = parseInt(req.query.skip)  || 0;
  const type  = req.query.type || null;

  let activities = await activityService.getUserActivities(req.user.id, limit, skip);

  if (type) {
    const types = type.split(',');
    activities = activities.filter(a => types.includes(a.type));
  }

  const stats = await activityService.getActivityStats(req.user.id);

  res.json({
    success: true,
    data: {
      activities,
      stats,
      count: activities.length
    }
  });
});

module.exports = {
  getActivities
};
