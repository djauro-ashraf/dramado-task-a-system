import axios from '../app/axios';

export default {
  register: async (email, password, name) => {
    const { data } = await axios.post('/auth/register', { email, password, name });
    return data.data;
  },
  login: async (email, password) => {
    const { data } = await axios.post('/auth/login', { email, password });
    return data.data;
  },
  getCurrentUser: async () => {
    const { data } = await axios.get('/auth/me');
    return data.data.user;
  }
};