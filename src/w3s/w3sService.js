import axios from 'axios';

const W3S_API_URL = process.env.REACT_APP_W3S_API_URL || 'https://default-w3s-endpoint.com/api';

const w3sApi = axios.create({
  baseURL: W3S_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const w3sService = {
  getData: async () => {
    try {
      const response = await w3sApi.get('/some-endpoint');
      return response.data;
    } catch (error) {
      console.error('Error fetching W3S data:', error);
      throw error;
    }
  },

  postData: async (data) => {
    try {
      const response = await w3sApi.post('/some-endpoint', data);
      return response.data;
    } catch (error) {
      console.error('Error posting W3S data:', error);
      throw error;
    }
  },

  // Add other W3S-related API calls here
};