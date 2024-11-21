import { generateId } from '../../utils/idGenerator';
export const ADD_COMPONENT = 'ADD_COMPONENT';
export const UPDATE_COMPONENT = 'UPDATE_COMPONENT';
export const DELETE_COMPONENT = 'DELETE_COMPONENT';

const generateComponentId = () => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `${timestamp}_${randomString}`;
};

export const addComponent = (componentData) => ({
  type: ADD_COMPONENT,
  payload: {
    ...componentData,
    id: generateComponentId(),
  }
});

export const updateComponent = (updateData) => ({
  type: UPDATE_COMPONENT,
  payload: updateData
});

export const deleteComponent = (componentId) => ({
  type: DELETE_COMPONENT,
  payload: { id: componentId }
}); 