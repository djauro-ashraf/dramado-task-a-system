const Task = require('../models/Task.model');
const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const activityService = require('./activity.service');
const dramaService = require('./drama.service');

/**
 * Create a new task
 */
const createTask = async (userId, taskData) => {
  const task = await Task.create({
    userId,
    ...taskData
  });

  // Log activity
  const message = dramaService.generateTaskCreatedMessage(
    task.priority,
    !!task.alarmTime
  );
  
  await activityService.logActivity(
    userId,
    task._id,
    'CREATED_TASK',
    message,
    { priority: task.priority, hasAlarm: !!task.alarmTime }
  );

  return task;
};

/**
 * Get all tasks for user
 */
const getUserTasks = async (userId, filters = {}) => {
  const query = { userId };

  // Apply filters
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.priority) {
    query.priority = filters.priority;
  }

  const tasks = await Task.find(query)
    .sort({ createdAt: -1 })
    .lean();

  return tasks;
};

/**
 * Get single task
 */
const getTaskById = async (userId, taskId) => {
  const task = await Task.findOne({ _id: taskId, userId });
  
  if (!task) {
    throw ApiError.notFound('Task not found');
  }

  return task;
};

/**
 * Update task
 */
const updateTask = async (userId, taskId, updates) => {
  const task = await Task.findOne({ _id: taskId, userId });
  
  if (!task) {
    throw ApiError.notFound('Task not found');
  }

  Object.assign(task, updates);
  await task.save();

  // Log activity
  await activityService.logActivity(
    userId,
    task._id,
    'UPDATED_TASK',
    `📝 Task "${task.title}" updated. The plot evolves!`,
    { updates: Object.keys(updates) }
  );

  return task;
};

/**
 * Delete task
 */
const deleteTask = async (userId, taskId) => {
  const task = await Task.findOne({ _id: taskId, userId });
  
  if (!task) {
    throw ApiError.notFound('Task not found');
  }

  await task.deleteOne();

  // Log activity
  await activityService.logActivity(
    userId,
    null,
    'DELETED_TASK',
    `🗑️ Task "${task.title}" deleted. Erased from history!`,
    { taskTitle: task.title, priority: task.priority }
  );

  // Clean up task activities
  await activityService.deleteTaskActivities(taskId);

  return task;
};

/**
 * Complete a task
 */
const completeTask = async (userId, taskId) => {
  const task = await Task.findOne({ _id: taskId, userId });
  
  if (!task) {
    throw ApiError.notFound('Task not found');
  }

  if (task.status === 'done') {
    throw ApiError.badRequest('Task already completed');
  }

  const now = new Date();
  const wasOnTime = !task.deadline || now <= task.deadline;

  // Update task
  task.status = 'done';
  task.completedAt = now;
  await task.save();

  // Update user scores
  const user = await User.findById(userId);
  if (wasOnTime) {
    user.disciplineScore += 2;
  } else {
    user.disciplineScore += 1;
  }
  await user.save();

  // Log activity with dramatic message
  const message = dramaService.generateCompletionMessage(
    wasOnTime,
    task.priority,
    user.mood
  );

  await activityService.logActivity(
    userId,
    task._id,
    'COMPLETED',
    message,
    { 
      wasOnTime,
      priority: task.priority,
      disciplineGained: wasOnTime ? 2 : 1
    }
  );

  return { task, user };
};

/**
 * Snooze a task
 */
const snoozeTask = async (userId, taskId, minutes) => {
  const task = await Task.findOne({ _id: taskId, userId });
  
  if (!task) {
    throw ApiError.notFound('Task not found');
  }

  if (task.status === 'done') {
    throw ApiError.badRequest('Cannot snooze completed task');
  }

  const mins = Number(minutes);
  if (!Number.isFinite(mins) || mins <= 0) {
    throw ApiError.badRequest('Invalid snooze duration');
  }

  // Calculate snooze time (supports fractional minutes)
  const snoozedUntil = new Date(Date.now() + mins * 60 * 1000);
  task.snoozedUntil = snoozedUntil;
  await task.save();

  // Update user chaos score
  const user = await User.findById(userId);
  user.chaosScore += 1;
  await user.save();

  // Count previous snoozes for this task
  const snoozeCount = await activityService.getUserActivities(userId, 100)
    .then(activities => 
      activities.filter(a => a.taskId?.toString() === taskId && a.type === 'SNOOZED').length
    );

  // Log activity
  const message = dramaService.generateSnoozeMessage(snoozeCount, task.priority);
  
  await activityService.logActivity(
    userId,
    task._id,
    'SNOOZED',
    message,
    { minutes: mins, snoozeCount: snoozeCount + 1 }
  );

  return { task, user };
};

/**
 * Ignore a task alarm
 */
const ignoreTask = async (userId, taskId) => {
  const task = await Task.findOne({ _id: taskId, userId });
  
  if (!task) {
    throw ApiError.notFound('Task not found');
  }

  if (task.status === 'done') {
    throw ApiError.badRequest('Cannot ignore completed task');
  }

  // Clear alarm but keep task
  task.alarmTime = null;
  task.snoozedUntil = null;
  await task.save();

  // Update user chaos score
  const user = await User.findById(userId);
  user.chaosScore += 2;
  await user.save();

  // Log activity
  const message = dramaService.generateIgnoreMessage(task.priority);
  
  await activityService.logActivity(
    userId,
    task._id,
    'IGNORED',
    message,
    { priority: task.priority, chaosGained: 2 }
  );

  return { task, user };
};

/**
 * Check and mark overdue tasks
 */
const checkOverdueTasks = async (userId) => {
  const now = new Date();
  
  const overdueTasks = await Task.find({
    userId,
    status: 'todo',
    deadline: { $lt: now }
  });

  const user = await User.findById(userId);

  for (const task of overdueTasks) {
    task.status = 'overdue';
    await task.save();

    // Add chaos score
    user.chaosScore += 3;

    // Calculate hours overdue
    const hoursOverdue = Math.floor((now - task.deadline) / (1000 * 60 * 60));

    // Log missed deadline
    const message = dramaService.generateMissedDeadlineMessage(
      task.priority,
      hoursOverdue
    );

    await activityService.logActivity(
      userId,
      task._id,
      'MISSED_DEADLINE',
      message,
      { priority: task.priority, hoursOverdue }
    );
  }

  if (overdueTasks.length > 0) {
    await user.save();
  }

  return overdueTasks.length;
};

module.exports = {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  deleteTask,
  completeTask,
  snoozeTask,
  ignoreTask,
  checkOverdueTasks
};
