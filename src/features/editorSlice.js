import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { alignComponentsUtil, distributeComponentsUtil } from '../utils/alignmentUtils';
import { componentConfig } from '../components/Components/componentConfig';
import { createComponent, updateComponent as updateComponentUtil } from '../components/Components/componentFactory';


const initialState = {
  components: [],
  selectedIds: [],
  clipboard: null,
  globalSettings: {
    backgroundColor: '#ffffff',
  },
};

const findComponentById = (components, id) => {
  for (let component of components) {
    if (component.id === id) {
      return component;
    }
    if (component.children) {
      const found = findComponentById(component.children, id);
      if (found) return found;
    }
  }
  return null;
};

const updateComponentById = (components, id, updates) => {
  return components.map(component => {
    if (component.id === id) {
      return updateComponentUtil(component, updates);
    }
    if (component.children) {
      return {
        ...component,
        children: updateComponentById(component.children, id, updates)
      };
    }
    return component;
  });
};

const deleteComponentById = (components, id) => {
  return components.filter(component => {
    if (component.id === id) {
      return false;
    }
    if (component.children) {
      component.children = deleteComponentById(component.children, id);
    }
    return true;
  });
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    addComponent: (state, action) => {
      const { type, parentId, ...otherProps } = action.payload;
      let defaultPosition = {};
      if (type === 'FLEX_CONTAINER') {
        defaultPosition = {
          style: {
            top: 0,
            left: 0,
            width: '100%',  // Set to 100% width by default
            height: 'auto', // Set height to auto
          }
        };
      }
      const newComponent = createComponent(type, { ...defaultPosition, ...otherProps });
    
      if (parentId) {
        const parent = findComponentById(state.components, parentId);
        if (parent) {
          parent.children.push(newComponent);
        }
      } else {
        state.components.push(newComponent);
      }
    },

    updateComponent: (state, action) => {
      const { id, updates } = action.payload;
      const updatedComponents = updateComponentById(state.components, id, updates);
      state.components = updatedComponents;
    },

    deleteComponent: (state, action) => {
      state.components = deleteComponentById(state.components, action.payload);
      state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
    },
    setSelectedIds: (state, action) => {
      state.selectedIds = action.payload;
    },
    alignComponents: (state, action) => {
      state.components = alignComponentsUtil(state.components, state.selectedIds, action.payload);
    },
    distributeComponents: (state, action) => {
      state.components = distributeComponentsUtil(state.components, state.selectedIds, action.payload);
    },
    copyComponents: (state) => {
      state.clipboard = state.components.filter(c => state.selectedIds.includes(c.id));
    },
    pasteComponents: (state) => {
      if (state.clipboard) {
        const newComponents = state.clipboard.map(c => {
          const newComponent = createComponent(c.type, {
            ...c,
            style: {
              ...c.style,
              top: c.style.top + 10,
              left: c.style.left + 10,
            },
          });
          return newComponent;
        });
        state.components.push(...newComponents);
        state.selectedIds = newComponents.map(c => c.id);
      }
    },

    moveComponent: (state, action) => {
      const { componentId, newParentId, newPosition } = action.payload;
      const componentToMove = findComponentById(state.components, componentId);
      if (componentToMove) {
        // Remove from old parent
        state.components = removeComponentFromParent(state.components, componentId);
        if (newParentId) {
          // Add to new parent
          const newParent = findComponentById(state.components, newParentId);
          if (newParent) {
            if (!newParent.children) newParent.children = [];
            newParent.children.push(componentToMove); // Fixed typo here
          }
        } else {
          // Move to root level
          if (newPosition) {
            componentToMove.style = { ...componentToMove.style, ...newPosition };
          }
          state.components.push(componentToMove);
        }
      }
    },
    updateGlobalSettings: (state, action) => {
      state.globalSettings = {
        ...state.globalSettings,
        ...action.payload,
      };
    },
  },
});

const removeComponentFromParent = (components, componentId) => {
  return components.map(component => {
    if (component.children) {
      return {
        ...component,
        children: component.children.filter(child => child.id !== componentId)
      };
    }
    return component;
  }).filter(component => component.id !== componentId);
};

export const {
  addComponent,
  updateComponent,
  deleteComponent,
  setSelectedIds,
  alignComponents,
  distributeComponents,
  copyComponents,
  pasteComponents,
  moveComponent,
  updateGlobalSettings,
} = editorSlice.actions;

export default editorSlice.reducer;