import axios from '../../app/axios';

export default {
  getActivities: async (limit = 50, type = null) => {
    const params = { limit };
    if (type) params.type = type;
    const { data } = await axios.get('/activity', { params });
    return data.data;
  }
};
