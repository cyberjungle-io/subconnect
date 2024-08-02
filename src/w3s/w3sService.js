import axios from 'axios';

const API_URL = process.env.REACT_APP_W3S_API_URL || 'http://localhost:5010/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('w3s_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleApiError = (error) => {
  console.error('API Error:', error.response || error);
  throw error.response?.data || error.message || 'An unexpected error occurred';
};

const w3sService = {
  // Authentication
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('w3s_token', response.data.token);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  logout: () => {
    localStorage.removeItem('w3s_token');
  },

  // Projects
  getProjects: async () => {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getProject: async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createProject: async (projectData) => {
    try {
      const dataWithDefaultCreator = { ...projectData, createdBy: 'default-user-id' };
      console.log('Attempting to create project with data:', dataWithDefaultCreator);
      const response = await api.post('/projects', dataWithDefaultCreator);
      console.log('Project creation response:', response.data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updateProject: async (id, projectData) => {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteProject: async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      return true;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Pages
  getPages: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/pages`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createPage: async (projectId, pageData) => {
    try {
      const response = await api.post(`/projects/${projectId}/pages`, pageData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updatePage: async (projectId, pageId, pageData) => {
    try {
      const response = await api.put(`/projects/${projectId}/pages/${pageId}`, pageData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  deletePage: async (projectId, pageId) => {
    try {
      await api.delete(`/projects/${projectId}/pages/${pageId}`);
      return true;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Components
  getComponents: async (projectId, pageId) => {
    try {
      const response = await api.get(`/projects/${projectId}/pages/${pageId}/components`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createComponent: async (projectId, pageId, componentData) => {
    try {
      const response = await api.post(`/projects/${projectId}/pages/${pageId}/components`, componentData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updateComponent: async (projectId, pageId, componentId, componentData) => {
    try {
      const response = await api.put(`/projects/${projectId}/pages/${pageId}/components/${componentId}`, componentData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteComponent: async (projectId, pageId, componentId) => {
    try {
      await api.delete(`/projects/${projectId}/pages/${pageId}/components/${componentId}`);
      return true;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export { w3sService };