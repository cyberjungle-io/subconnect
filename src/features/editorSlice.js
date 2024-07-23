import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { alignComponentsUtil, distributeComponentsUtil } from '../utils/alignmentUtils';
import { componentConfig } from '../components/Components/componentConfig';


const initialState = {
  components: [],
  selectedIds: [],
  clipboard: null,
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
      if (updates.chartConfig) {
        return {
          ...component,
          ...updates,
          chartConfig: {
            ...component.chartConfig,
            ...updates.chartConfig
          }
        };
      }
      return { ...component, ...updates };
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
      const config = componentConfig[type];
    
      const newComponent = {
        id: uuidv4(),
        type,
        content: config.defaultContent || '',
        props: config.defaultProps || {},
        style: { ...config.defaultSize, ...otherProps.style },
        children: [],
        ...otherProps,  // This ensures we keep any other properties passed in action.payload
      };
    
      // Add chart-specific configuration if it's a CHART component
      if (type === 'CHART') {
        newComponent.chartConfig = { ...config.defaultChartConfig, ...otherProps.chartConfig };
      }
    
      // Add content for components that have default content, if not overridden
      if (config.defaultContent && !newComponent.content) {
        newComponent.content = config.defaultContent;
      }
    
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
      console.log('Updated components:', updatedComponents); // Debug log
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
        const newComponents = state.clipboard.map(c => ({
          ...c,
          id: uuidv4(),
          style: {
            ...c.style,
            top: c.style.top + 10,
            left: c.style.left + 10,
          },
        }));
        state.components.push(...newComponents);
        state.selectedIds = newComponents.map(c => c.id);
      }
    },
    moveComponent: (state, action) => {
      const { componentId, newParentId, newPosition } = action.payload;
      const componentToMove = state.components.find(c => c.id === componentId);
      if (componentToMove) {
        // Remove from old parent
        state.components = state.components.filter(c => c.id !== componentId);
        if (newParentId) {
          // Add to new parent
          const newParent = state.components.find(c => c.id === newParentId);
          if (newParent) {
            if (!newParent.children) newParent.children = [];
            newParent.children.push(componentToMove);
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
  },
});

export const {
  addComponent,
  updateComponent,
  deleteComponent,
  setSelectedIds,
  alignComponents,
  distributeComponents,
  copyComponents,
  pasteComponents,
  moveComponent
} = editorSlice.actions;

export default editorSlice.reducer;