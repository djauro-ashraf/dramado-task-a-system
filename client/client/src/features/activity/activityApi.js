import axios from '../../app/axios';

export default {
  getActivities: async (limit = 50) => {
    const { data } = await axios.get('/activity', { params: { limit } });
    return data.data;
  }
};