const Joi = require('joi');

const createTaskSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.min': 'Title cannot be empty',
      'string.max': 'Title cannot exceed 200 characters',
      'any.required': 'Title is required'
    }),
  description: Joi.string()
    .max(1000)
    .allow('')
    .optional(),
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .default('medium'),
  deadline: Joi.date()
    .iso()
    .allow(null)
    .optional(),
  alarmTime: Joi.date()
    .iso()
    .allow(null)
    .optional(),
  customAlarmUrl: Joi.string()
    .uri()
    .allow(null)
    .optional()
});

const updateTaskSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .optional(),
  description: Joi.string()
    .max(1000)
    .allow('')
    .optional(),
  priority: Joi.string()
    .valid('low', 'medium', 'high')
    .optional(),
  deadline: Joi.date()
    .iso()
    .allow(null)
    .optional(),
  alarmTime: Joi.date()
    .iso()
    .allow(null)
    .optional(),
  customAlarmUrl: Joi.string()
    .uri()
    .allow(null)
    .optional(),
  status: Joi.string()
    .valid('todo', 'done', 'overdue')
    .optional()
}).min(1);

const snoozeSchema = Joi.object({
  minutes: Joi.number()
    .valid(5, 10, 15, 30)
    .required()
    .messages({
      'any.required': 'Snooze duration is required',
      'any.only': 'Snooze duration must be 5, 10, 15, or 30 minutes'
    })
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  snoozeSchema
};
