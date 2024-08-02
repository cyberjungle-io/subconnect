// src/w3s/index.js

// Service exports
export { w3sService } from './w3sService';

// Slice exports
export { default as w3sReducer } from './w3sSlice';

// Action creators and thunks
export {
  fetchProjects,
  fetchProject,
  createProject,
  updateProject,
  deleteProject,
} from './w3sSlice';

// You might want to export any constants or types here as well, if you have any
// For example:
// export { PROJECT_STATUS } from './constants';
// export type { Project } from './types';