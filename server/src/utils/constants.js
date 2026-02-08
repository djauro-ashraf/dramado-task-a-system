module.exports = {
  // Task priorities
  PRIORITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
  },

  // Task status
  TASK_STATUS: {
    TODO: 'todo',
    DONE: 'done',
    OVERDUE: 'overdue'
  },

  // Activity types
  ACTIVITY_TYPE: {
    CREATED_TASK: 'CREATED_TASK',
    COMPLETED: 'COMPLETED',
    SNOOZED: 'SNOOZED',
    IGNORED: 'IGNORED',
    MISSED_DEADLINE: 'MISSED_DEADLINE',
    LOGIN: 'LOGIN',
    UPLOAD_SOUND: 'UPLOAD_SOUND',
    UPDATED_TASK: 'UPDATED_TASK',
    DELETED_TASK: 'DELETED_TASK'
  },

  // Snooze durations (minutes)
  SNOOZE_DURATIONS: [5, 10, 15, 30],

  // Mood types
  MOOD: {
    HEROIC: 'heroic',
    FOCUSED: 'focused',
    CHAOTIC: 'chaotic',
    STRUGGLING: 'struggling',
    NEUTRAL: 'neutral'
  }
};
