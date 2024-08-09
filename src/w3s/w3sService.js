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
    register: async (userData) => {
        try {
          console.log('Registering user with data:', userData);
          const response = await api.post('/users/register', userData);
          console.log('Registration response:', response.data);
          return response.data;
        } catch (error) {
          console.error('Registration error in w3sService:', error.response || error);
          throw error.response?.data || error.message || 'An unexpected error occurred';
        }
      },
  // Authentication
  login: async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      if (response.data.token) {
        localStorage.setItem('w3s_token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response || error);
      throw error.response?.data || error.message || 'An unexpected error occurred';
    }
  },
  logout: async () => {
    try {
      // If your backend requires a logout request, uncomment the next line
      // await api.post('/users/logout');
      localStorage.removeItem('w3s_token');
      return { success: true };
    } catch (error) {
      console.error('Logout error in w3sService:', error.response || error);
      throw error.response?.data || error.message || 'An unexpected error occurred';
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

  getProjects: async () => {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createProject: async (projectData) => {
    try {
      const token = localStorage.getItem('w3s_token');
      let userId = 'default-user-id';
      
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        userId = decodedToken._id || 'default-user-id';
      }

      const dataWithCreator = { ...projectData, createdBy: userId };
      console.log('Attempting to create project with data:', dataWithCreator);
      const response = await api.post('/projects', dataWithCreator);
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
      const page = response.data;

      // Update the project to include the new page
      await api.put(`/projects/${projectId}`, {
        $push: { pages: page._id }
      });

      return page;
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