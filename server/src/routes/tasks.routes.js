const express = require('express');
const tasksController = require('../controllers/tasks.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createTaskSchema, updateTaskSchema, snoozeSchema } = require('../validators/task.validator');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Task CRUD
router.post('/', validate(createTaskSchema), tasksController.createTask);
router.get('/', tasksController.getTasks);
router.get('/:id', tasksController.getTask);
router.patch('/:id', validate(updateTaskSchema), tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

// Alarm actions
router.post('/:id/complete', tasksController.completeTask);
router.post('/:id/snooze', validate(snoozeSchema), tasksController.snoozeTask);
router.post('/:id/ignore', tasksController.ignoreTask);

module.exports = router;
