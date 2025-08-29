import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes('/login')
    ) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const eventsAPI = {
  getAll: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  create: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  update: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  getRegistrations: async (id) => {
    const response = await api.get(`/events/${id}/registrations`);
    return response.data;
  },
};

export const registrationsAPI = {
  register: async (eventId) => {
    const response = await api.post('/registrations', { eventId });
    return response.data;
  },

  unregister: async (eventId) => {
    const response = await api.delete(`/registrations/${eventId}`);
    return response.data;
  },

  myEvents: async () => {
    const response = await api.get('/registrations/my-events');
    return response.data;
  },
};

export default api;
