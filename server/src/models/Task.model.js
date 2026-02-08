const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  deadline: {
    type: Date,
    default: null
  },
  alarmTime: {
    type: Date,
    default: null
  },
  snoozedUntil: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['todo', 'done', 'overdue'],
    default: 'todo'
  },
  customAlarmUrl: {
    type: String,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, alarmTime: 1 });

// Virtual to check if task is overdue
taskSchema.virtual('isOverdue').get(function() {
  if (this.status === 'done') return false;
  if (!this.deadline) return false;
  return new Date() > this.deadline;
});

// Method to check if alarm should trigger
taskSchema.methods.shouldTriggerAlarm = function() {
  if (this.status !== 'todo') return false;
  if (!this.alarmTime) return false;
  
  const now = new Date();
  
  // Check if snoozed
  if (this.snoozedUntil && now < this.snoozedUntil) {
    return false;
  }
  
  return now >= this.alarmTime;
};

// Update overdue status before save
taskSchema.pre('save', function(next) {
  if (this.isOverdue && this.status === 'todo') {
    this.status = 'overdue';
  }
  next();
});

taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
