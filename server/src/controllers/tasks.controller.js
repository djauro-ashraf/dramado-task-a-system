const tasksService = require('../services/tasks.service');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Create a new task
 * POST /api/tasks
 */
const createTask = asyncHandler(async (req, res) => {
  const task = await tasksService.createTask(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: '🎭 Task created! The drama intensifies!',
    data: { task }
  });
});

/**
 * Get all user tasks
 * GET /api/tasks
 */
const getTasks = asyncHandler(async (req, res) => {
  const { status, priority } = req.query;
  const filters = {};
  
  if (status) filters.status = status;
  if (priority) filters.priority = priority;

  const tasks = await tasksService.getUserTasks(req.user.id, filters);

  // Also check for overdue tasks
  await tasksService.checkOverdueTasks(req.user.id);

  res.json({
    success: true,
    data: {
      tasks,
      count: tasks.length
    }
  });
});

/**
 * Get single task
 * GET /api/tasks/:id
 */
const getTask = asyncHandler(async (req, res) => {
  const task = await tasksService.getTaskById(req.user.id, req.params.id);

  res.json({
    success: true,
    data: { task }
  });
});

/**
 * Update task
 * PATCH /api/tasks/:id
 */
const updateTask = asyncHandler(async (req, res) => {
  const task = await tasksService.updateTask(req.user.id, req.params.id, req.body);

  res.json({
    success: true,
    message: '✏️ Task updated!',
    data: { task }
  });
});

/**
 * Delete task
 * DELETE /api/tasks/:id
 */
const deleteTask = asyncHandler(async (req, res) => {
  await tasksService.deleteTask(req.user.id, req.params.id);

  res.json({
    success: true,
    message: '🗑️ Task deleted! Poof! Gone from existence!'
  });
});

/**
 * Complete a task
 * POST /api/tasks/:id/complete
 */
const completeTask = asyncHandler(async (req, res) => {
  const { task, user } = await tasksService.completeTask(req.user.id, req.params.id);

  res.json({
    success: true,
    message: '🎉 Task completed!',
    data: {
      task,
      user: {
        disciplineScore: user.disciplineScore,
        chaosScore: user.chaosScore,
        mood: user.mood,
        isChaosLocked: user.isChaosLocked
      }
    }
  });
});

/**
 * Snooze a task alarm
 * POST /api/tasks/:id/snooze
 */
const snoozeTask = asyncHandler(async (req, res) => {
  const { minutes } = req.body;
  const { task, user } = await tasksService.snoozeTask(req.user.id, req.params.id, minutes);

  const m = Number(minutes);
  const label = m < 1 ? `${Math.round(m * 60)} seconds` : `${m} minutes`;

  res.json({
    success: true,
    message: `⏰ Snoozed for ${label}. The drama postponed!`,
    data: {
      task,
      user: {
        disciplineScore: user.disciplineScore,
        chaosScore: user.chaosScore,
        mood: user.mood,
        isChaosLocked: user.isChaosLocked
      }
    }
  });
});

/**
 * Ignore a task alarm
 * POST /api/tasks/:id/ignore
 */
const ignoreTask = asyncHandler(async (req, res) => {
  const { task, user } = await tasksService.ignoreTask(req.user.id, req.params.id);

  res.json({
    success: true,
    message: '🙈 Task alarm ignored. Chaos reigns!',
    data: {
      task,
      user: {
        disciplineScore: user.disciplineScore,
        chaosScore: user.chaosScore,
        mood: user.mood,
        isChaosLocked: user.isChaosLocked
      }
    }
  });
});

/**
 * Mark alarm as missed (period expired without action)
 * POST /api/tasks/:id/missed-alarm
 */
const missedAlarm = asyncHandler(async (req, res) => {
  const { task, user } = await tasksService.missedAlarm(req.user.id, req.params.id);

  res.json({
    success: true,
    message: '🚨 Alarm period expired — missed alarm recorded. Chaos reigns!',
    data: {
      task,
      user: {
        disciplineScore: user.disciplineScore,
        chaosScore: user.chaosScore,
        mood: user.mood,
        isChaosLocked: user.isChaosLocked
      }
    }
  });
});

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  completeTask,
  snoozeTask,
  ignoreTask,
  missedAlarm
};
