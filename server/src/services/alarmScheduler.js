/**
 * alarmScheduler.js
 *
 * Runs on the server every 30 seconds.
 * Finds tasks whose alarmTime has passed (and aren't snoozed),
 * sends Web Push notifications to the user.
 *
 * Snooze support: when a task is snoozed, its taskId is cleared from
 * pushedAlarms so the scheduler will fire again once snoozedUntil expires.
 */

const Task = require('../models/Task.model');
const { sendPushToUser } = require('./push.service');

/**
 * pushedAlarms tracks taskIds we've already pushed so we don't spam.
 * Maps taskId → the setTimeout handle that will clear it.
 * When a task is snoozed we clear its entry immediately so it re-fires
 * once the snooze expires.
 */
const pushedAlarms = new Map(); // taskId → timeoutHandle

/** Remove a task from the pushed set so it can be re-fired (used on snooze). */
const clearPushedAlarm = (taskId) => {
  const handle = pushedAlarms.get(taskId);
  if (handle !== undefined) {
    clearTimeout(handle);
    pushedAlarms.delete(taskId);
  }
};

const checkAndFireAlarms = async () => {
  const now = new Date();

  try {
    // ── 1. Find tasks that are snoozed but whose snooze has now expired ──────
    // These were previously in pushedAlarms. We need to clear them so the
    // main query below can pick them up and re-fire the push notification.
    const expiredSnoozes = await Task.find({
      status: 'todo',
      alarmTime: { $lte: now },
      snoozedUntil: { $gt: new Date(0), $lte: now } // snoozedUntil is set AND has passed
    }).lean();

    for (const task of expiredSnoozes) {
      clearPushedAlarm(task._id.toString());
    }

    // ── 2. Find all tasks due now (alarm passed, not snoozed, not done) ──────
    const dueTasks = await Task.find({
      status: 'todo',
      alarmTime: { $lte: now },
      $or: [
        { snoozedUntil: null },
        { snoozedUntil: { $lte: now } }
      ]
    }).lean();

    for (const task of dueTasks) {
      const taskId = task._id.toString();

      // Skip if we already pushed this alarm and it hasn't been cleared
      if (pushedAlarms.has(taskId)) continue;

      // Schedule auto-clear after the alarm window so it won't re-fire
      // endlessly if the user never acts. The snooze path clears this early.
      const windowMs = (task.alarmDurationMinutes || 5) * 60 * 1000;
      const handle = setTimeout(() => pushedAlarms.delete(taskId), windowMs);
      pushedAlarms.set(taskId, handle);

      // Build notification payload
      const priorityEmoji = task.priority === 'high' ? '🔥' : task.priority === 'medium' ? '⚡' : '📌';
      const payload = {
        type: 'ALARM',
        taskId,
        title: `${priorityEmoji} DramaDo Alarm`,
        body: `"${task.title}" demands your attention!`,
        priority: task.priority,
        alarmDurationMinutes: task.alarmDurationMinutes || 5,
        tag: `alarm-${taskId}` // replaces duplicate notification for same task
      };

      sendPushToUser(task.userId.toString(), payload).catch(err =>
        console.error(`[AlarmScheduler] Push failed for task ${taskId}:`, err.message)
      );
    }
  } catch (err) {
    console.error('[AlarmScheduler] Error checking alarms:', err.message);
  }
};

/**
 * Call this from the snooze endpoint (or tasks service) right after a task
 * is snoozed, so the scheduler will re-fire when the snooze expires.
 * Exported so tasks.service.js can call it.
 */
const onTaskSnoozed = (taskId) => {
  clearPushedAlarm(taskId.toString());
};

const startAlarmScheduler = () => {
  console.log('⏰ [AlarmScheduler] Started — checking alarms every 30s');
  checkAndFireAlarms();
  setInterval(checkAndFireAlarms, 30 * 1000);
};

module.exports = { startAlarmScheduler, onTaskSnoozed };
