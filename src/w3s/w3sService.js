import axios from 'axios';
import { store } from '../store/store'; // Import the Redux store

const API_URL = process.env.REACT_APP_W3S_API_URL || 'https://w3s.cyberjungle.io/api';

console.log('W3S API URL:', API_URL);

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
    const state = store.getState();
    const token = state.user.currentUser?.token;
    const isGuestMode = state.user.isGuestMode;

    // If in guest mode, add a special header or parameter
    if (isGuestMode) {
      config.headers['X-Guest-Mode'] = 'true';
    } else if (token) {
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
  verifyToken: async (token) => {
    try {
      const response = await api.get('/users/verify-token', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Token verification error:', error.response || error);
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid or expired token');
      }
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
      const state = store.getState();
      const isGuestMode = state.user.isGuestMode;
      
      // If in guest mode, only fetch public projects
      const endpoint = isGuestMode ? '/projects/public' : '/projects';
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createProject: async (projectData) => {
    try {
      const state = store.getState();
      const isGuestMode = state.user.isGuestMode;
      
      // Prevent project creation in guest mode
      if (isGuestMode) {
        throw new Error('Cannot create projects in guest mode');
      }

      const token = localStorage.getItem('w3s_token');
      let userId = 'default-user-id';
      
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        userId = decodedToken._id || 'default-user-id';
      }

      const defaultPages = [{
        name: 'Main',
        content: {
          components: [],
          layout: {}
        }
      }];

      const dataWithCreator = { 
        ...projectData, 
        createdBy: userId, 
        pages: defaultPages,
        isPublic: false // Add this to ensure new projects are private by default
      };

      const response = await api.post('/projects', dataWithCreator);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updateProject: async (id, projectData) => {
    try {
      console.log("Project data being sent to server:", JSON.stringify(projectData, null, 2));
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

  // New methods for GraphQL queries
  getQueries: async () => {
    try {
      console.log('w3sService: Fetching queries'); // Log 10
      const response = await api.get('/queries');
      console.log('w3sService: Queries fetched', response.data); // Log 11
      return response.data;
    } catch (error) {
      console.error('w3sService: Error fetching queries', error); // Log 12
      throw error;
    }
  },

  getQuery: async (id) => {
    try {
      const response = await api.get(`/queries/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createQuery: async (queryData) => {
    try {
      console.log('Sending create query request:', queryData); // Debug log
      const response = await api.post('/queries', queryData);
      console.log('Create query response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error in createQuery:', error); // Debug log
      handleApiError(error);
    }
  },

  updateQuery: async (id, queryData) => {
    try {
      console.log('Sending update query request:', id, queryData); // Debug log
      const response = await api.put(`/queries/${id}`, queryData);
      console.log('Update query response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error in updateQuery:', error); // Debug log
      handleApiError(error);
    }
  },

  deleteQuery: async (id) => {
    try {
      await api.delete(`/queries/${id}`);
      return true;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Component Data methods
  getComponentData: async () => {
    try {
      const response = await api.get('/componentData');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createComponentData: async (componentData) => {
    try {
      // Generate a unique ID for the component
      const uniqueId = `${componentData.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const dataWithUniqueId = {
        ...componentData,
        id: uniqueId
      };
      
      console.log('Creating component data:', dataWithUniqueId);
      const response = await api.post('/componentData', dataWithUniqueId);
      console.log('Create component data response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating component data:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      handleApiError(error);
    }
  },

  updateComponentData: async ({ componentId, data }) => {
    /* try {
      console.log('Updating component data:', { componentId, data });
      const response = await api.put(`/componentData/by-component-id/${componentId}`, data);
      console.log('Update component data response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating component data:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      handleApiError(error);
    } */
  },


  deleteComponentData: async (id) => {
    try {
      await api.delete(`/api/componentData/${id}`);
      return true;
    } catch (error) {
      handleApiError(error);
    }
  },

  getComponentDataById: async (componentId) => {
    try {
      console.log('w3sService - Fetching component data:', {
        component_id: componentId,
        endpoint: `/componentData/by-component-id/${componentId}`,
        headers: api.defaults.headers
      });
      
      const response = await api.get(`/componentData/by-component-id/${componentId}`);
      console.log('w3sService - Component data response:', response.data);
      return response.data;
    } catch (error) {
      console.error('w3sService - Error fetching component data:', {
        error_message: error.message,
        error_response: error.response?.data,
        error_status: error.response?.status,
        component_id: componentId
      });
      handleApiError(error);
    }
  },

  // Add a new user access association
  addUserAccess: async (accessData) => {
    try {
      const response = await api.post('/users/access', accessData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Grant user access with the new endpoint
  grantUserAccess: async (accessData) => {
    try {
      const response = await api.post('/users/access/grant', accessData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get user access associations by user_id
  getUserAccesses: async () => {
    try {
      const response = await api.get('/users/access/user');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get access associations by link_id
  getAccessesByLinkId: async (linkId) => {
    try {
      const response = await api.get(`/users/access/link/${linkId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Add a new user access association by email
  addUserAccessByEmail: async (accessData) => {
    try {
      const response = await api.post('/users/access/email', accessData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Add this new method
  getSharedProjects: async () => {
    try {
      const response = await api.get('/projects/shared');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Saved Components
  getSavedComponents: async () => {
    try {
      console.log('w3sService: Fetching saved components');
      const response = await api.get('/savedComponents');
      //console.log('Raw data from getSavedComponents:', response.data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getSavedComponent: async (id) => {
    try {
      const response = await api.get(`/savedComponents/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  createOrUpdateSavedComponent: async (componentData) => {
    try {
      //console.log('createOrUpdateSavedComponent: Creating or updating saved component', componentData);
      const response = await api.post('/savedComponents', componentData);
      console.log('Create or update saved component response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in createOrUpdateSavedComponent:', error);
      handleApiError(error);
    }
  },

  deleteSavedComponent: async (id) => {
    try {
      console.log('deleteSavedComponent: Deleting saved component', id);
      await api.delete(`/savedComponents/${id}`);
      return true;
    } catch (error) {
      handleApiError(error);
    }
  },

  async requestPasswordReset(email) {
    try {
      const response = await api.post('/users/forgot-password', { email });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  async resetPassword(token, password) {
    try {
      const response = await api.post(`/users/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Check access for a specific link and user
  checkAccess: async (linkId, userId) => {
    try {
      const response = await api.get(`/users/access/${linkId}/${userId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Add this method inside the w3sService object, alongside other methods
  acceptUserAccess: async (linkId, userId) => {
    try {
      const response = await api.put(`/access/${linkId}/${userId}/accept`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // User Access methods
  getUserAccess: async (linkId, userId) => {
    try {
      const response = await api.get(`/users/access/${linkId}/${userId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export { w3sService };
