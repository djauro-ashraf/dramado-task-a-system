import axios from '../../app/axios';

export default {
  getTasks: async (filters = {}) => {
    const { data } = await axios.get('/tasks', { params: filters });
    return data.data.tasks;
  },
  createTask: async (taskData) => {
    const { data } = await axios.post('/tasks', taskData);
    return { task: data.data.task, message: data.message };
  },
  updateTask: async (id, updates) => {
    const { data } = await axios.patch(`/tasks/${id}`, updates);
    return { task: data.data.task, message: data.message };
  },
  deleteTask: async (id) => {
    const { data } = await axios.delete(`/tasks/${id}`);
    return { message: data.message };
  },
  completeTask: async (id) => {
    const { data } = await axios.post(`/tasks/${id}/complete`);
    return { ...data.data, message: data.message };
  },
  snoozeTask: async (id, minutes) => {
    const { data } = await axios.post(`/tasks/${id}/snooze`, { minutes });
    return { ...data.data, message: data.message };
  },
  ignoreTask: async (id) => {
    const { data } = await axios.post(`/tasks/${id}/ignore`);
    return { ...data.data, message: data.message };
  }
};