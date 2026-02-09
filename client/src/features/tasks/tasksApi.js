import axios from '../../app/axios';

export default {
  getTasks: async (filters = {}) => {
    const { data } = await axios.get('/tasks', { params: filters });
    return data.data.tasks;
  },
  createTask: async (taskData) => {
    const { data } = await axios.post('/tasks', taskData);
    return data.data.task;
  },
  updateTask: async (id, updates) => {
    const { data } = await axios.patch(`/tasks/${id}`, updates);
    return data.data.task;
  },
  deleteTask: async (id) => {
    await axios.delete(`/tasks/${id}`);
  },
  completeTask: async (id) => {
    const { data } = await axios.post(`/tasks/${id}/complete`);
    return data.data;
  },
  snoozeTask: async (id, minutes) => {
    const { data } = await axios.post(`/tasks/${id}/snooze`, { minutes });
    return data.data;
  },
  ignoreTask: async (id) => {
    const { data } = await axios.post(`/tasks/${id}/ignore`);
    return data.data;
  }
};