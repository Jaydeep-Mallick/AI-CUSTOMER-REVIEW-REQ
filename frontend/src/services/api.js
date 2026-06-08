import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateTestimonial = async (data) => {
  const response = await api.post('/generate', data);
  return response.data;
};

export const submitFeedback = async (data) => {
  const response = await api.post('/feedback', data);
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/history');
  return response.data;
};

export const deleteGeneration = async (id) => {
  const response = await api.delete(`/history/${id}`);
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

export default api;
