import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {useSelector } from 'react-redux';

import {
  alignComponentsUtil,
  distributeComponentsUtil,
} from "../utils/alignmentUtils";
import { componentConfig } from "../components/Components/componentConfig";
import { createComponent } from "../components/Components/componentFactory";
import { defaultGlobalSettings } from '../utils/defaultGlobalSettings';
import { saveComponent } from './savedComponentsSlice';

const initialState = {
  components: [],
  selectedIds: [],
  clipboard: null,
  globalSettings: {
    backgroundColor: '#ffffff',
    componentLayout: 'vertical',
    style: {
      paddingTop: '0px',
      paddingRight: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      marginTop: '0px',
      marginRight: '0px',
      marginBottom: '0px',
      marginLeft: '0px',
      gap: '0px'
    }
  },
  mode: 'edit',
  currentPage: null,
  whiteboardState: {
    history: [],
    historyIndex: -1,
    strokeColor: '#000000',
  },
  isDragModeEnabled: false,
  isFloatingMenuVisible: true,
  canvasSettings: {
    style: {
      backgroundColor: '#ffffff',
      padding: '20px',
      margin: '0px',
      gap: '20px',
    },
  },
  colorTheme: [
    { value: '#FF0000', name: 'Color 1' },
    { value: '#00FF00', name: 'Color 2' },
    { value: '#0000FF', name: 'Color 3' },
    { value: '#FFFF00', name: 'Color 4' },
    { value: '#FF00FF', name: 'Color 5' },
    { value: '#00FFFF', name: 'Color 6' }
  ],
  toolbarSettings: {
    backgroundColor: '#e8e8e8',
    textColor: '#333333',
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
  return components.map((component) => {
    if (component.id === id) {
      return {
        ...component,
        ...updates,
        style: {
          ...component.style,
          ...(updates.style || {}),
        },
        props: {
          ...component.props,
          ...(updates.props || {}),
        },
      };
    }
    if (component.children) {
      return {
        ...component,
        children: updateComponentById(component.children, id, updates),
      };
    }
    return component;
  });
};

const deleteComponentById = (components, id) => {
  return components.filter((component) => {
    if (component.id === id) {
      return false;
    }
    if (component.children) {
      component.children = deleteComponentById(component.children, id);
    }
    return true;
  });
};

const deleteComponentsDeep = (components, idsToDelete) => {
  return components.filter(component => {
    if (idsToDelete.includes(component.id)) {
      return false;
    }
    if (component.children) {
      component.children = deleteComponentsDeep(component.children, idsToDelete);
    }
    return true;
  });
};

const createComponentWithDepth = (type, props, depth = 0) => {
  return createComponent(type, {
    ...props,
    depth,
  });
};

// Create the thunk
export const saveComponentThunk = createAsyncThunk(
  'editor/saveComponent',
  async (component, { dispatch }) => {
    const savedComponent = {
      ...component,
      id: `saved_${component.id}`,
      createdBy: useSelector((state) => state.user.currentUser._id),
      name: component.props.name || component.type,
      props: { ...component.props }, // Ensure props are included
    };
    dispatch(saveComponent(savedComponent));
    return savedComponent;
  }
);

export const aiAddComponent = createAsyncThunk(
  'editor/aiAddComponent',
  async (componentData, { dispatch, getState }) => {
    const { type } = componentData;
    
    // Get the base configuration from componentConfig
    const baseConfig = componentConfig[type];
    if (!baseConfig) {
      throw new Error(`Invalid component type: ${type}`);
    }

    // Generate a unique ID
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const uniqueId = `${timestamp}_${randomString}`;

    // Get the current components to determine position
    const state = getState();
    const existingComponents = state.editor.components;
    
    // Calculate position based on existing components
    let position = { x: 0, y: 0 };
    if (existingComponents.length > 0) {
      const lastComponent = existingComponents[existingComponents.length - 1];
      position = {
        x: 0, // Keep x at 0 for consistent left alignment
        y: lastComponent.style?.top ? parseInt(lastComponent.style.top) + 20 : 20
      };
    }

    // Create the component with the same defaults as ComponentPalette
    const newComponent = {
      id: uniqueId,
      type,
      name: `${type}_${uniqueId.substr(0, 8)}`,
      style: {
        ...baseConfig.defaultSize,
        ...baseConfig.style,
        position: 'relative',
        left: position.x,
        top: position.y,
      },
      props: {
        ...baseConfig.defaultProps,
        name: `${baseConfig.name}`,
      },
      children: [],
      depth: 0,
    };

    // Use the existing addComponent action
    dispatch(addComponent(newComponent));

    return newComponent;
  }
);

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    addComponent: (state, action) => {
      const { type, parentId, savedComponent, position, ...otherProps } = action.payload;
      let newComponent;
      let depth = 0;

      if (!state.globalSettings) {
        state.globalSettings = defaultGlobalSettings;
      }

      const componentLayout = state.globalSettings.componentLayout || 'vertical';

      if (parentId) {
        const parent = findComponentById(state.components, parentId);
        if (parent) {
          depth = (parent.depth || 0) + 1;
        }
      }

      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const uniqueId = `${timestamp}_${randomString}`;

      if (savedComponent) {
        const createComponentFromSaved = (saved, depth) => {
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 15);
          const uniqueId = `${timestamp}_${randomString}`;

          const newComp = {
            ...saved,
            id: uniqueId,
            name: saved.name,
            depth,
            style: {
              ...saved.style,
              left: position ? position.x : (saved.style.left || 0),
              top: position ? position.y : (saved.style.top || 0),
            },
            props: { ...saved.props },
          };

          // Recursively create children if they exist
          if (saved.children && Array.isArray(saved.children)) {
            newComp.children = saved.children.map(child => 
              createComponentFromSaved(child, depth + 1)
            );
          }

          return newComp;
        };

        newComponent = createComponentFromSaved(savedComponent, depth);
      } else {
        // Handle regular component
        let defaultStyle = {};

        if (!parentId) {
          if (type === "FLEX_CONTAINER") {
            if (componentLayout === "horizontal") {
              defaultStyle = {
                width: '100%',
                height: '200px',
              };
            } else {
              defaultStyle = {
                width: '200px',
                height: '100%',
              };
            }
          } else if (componentLayout === "vertical") {
            defaultStyle = {
              width: '200px',
              height: 'auto',
            };
          } else {
            defaultStyle = {
              width: '100%',
              height: '200px',
            };
          }
        }

        newComponent = createComponentWithDepth(type, {
          id: uniqueId,
          style: {
            ...defaultStyle,
            ...otherProps.style,
            left: position ? position.x : 0,
            top: position ? position.y : 0,
          },
          isDraggingDisabled: false,
          name: `${type}_${uniqueId.substr(0, 8)}`,
          ...otherProps,
        }, depth);
      }

      if (parentId) {
        const parent = findComponentById(state.components, parentId);
        if (parent) {
          if (!parent.children) parent.children = [];
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

      // If it's a whiteboard component, update the whiteboard state
      const updatedComponent = findComponentById(updatedComponents, id);
      if (updatedComponent && updatedComponent.type === 'WHITEBOARD') {
        if (updates.props && updates.props.imageData) {
          state.whiteboardState.history = [
            ...state.whiteboardState.history.slice(0, state.whiteboardState.historyIndex + 1),
            updates.props.imageData
          ];
          state.whiteboardState.historyIndex = state.whiteboardState.history.length - 1;
        }
      }

      console.log(`Updated component ${id}:`, updatedComponent);
    },

    renameComponent: (state, action) => {
      const { id, newName } = action.payload;
      const updatedComponents = updateComponentById(state.components, id, {
        name: newName,
      });
      state.components = updatedComponents;
    },

    toggleComponentDragging: (state, action) => {
      const { id, isDraggingDisabled } = action.payload;
      const updatedComponents = updateComponentById(state.components, id, {
        isDraggingDisabled: isDraggingDisabled,
      });
      state.components = updatedComponents;
    },

    updateComponentSpacing: (state, action) => {
      const { id, spacing } = action.payload;
      const updatedComponents = updateComponentById(state.components, id, {
        style: {
          ...spacing,
        },
      });
      state.components = updatedComponents;
    },
    updateGlobalSpacing: (state, action) => {
      state.globalSettings.style = {
        ...state.globalSettings.style,
        ...action.payload,
      };
    },
    deleteComponent: (state, action) => {
      state.components = deleteComponentById(state.components, action.payload);
      state.selectedIds = state.selectedIds.filter(
        (id) => id !== action.payload
      );
    },
    deleteComponents: (state, action) => {
      const componentIds = action.payload;
      state.components = deleteComponentsDeep(state.components, componentIds);
      state.selectedIds = state.selectedIds.filter((id) => !componentIds.includes(id));
    },
    setSelectedIds: (state, action) => {
      state.selectedIds = action.payload;
    },
    alignComponents: (state, action) => {
      state.components = alignComponentsUtil(
        state.components,
        state.selectedIds,
        action.payload
      );
    },
    distributeComponents: (state, action) => {
      state.components = distributeComponentsUtil(
        state.components,
        state.selectedIds,
        action.payload
      );
    },
    copyComponents: (state) => {
      state.clipboard = state.components.filter((c) =>
        state.selectedIds.includes(c.id)
      );
    },
    pasteComponents: (state) => {
      if (state.clipboard) {
        const newComponents = state.clipboard.map((c) => {
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
        state.selectedIds = newComponents.map((c) => c.id);
      }
    },

    moveComponent: (state, action) => {
      const { componentId, newParentId, newPosition } = action.payload;
      const componentToMove = findComponentById(state.components, componentId);
      if (componentToMove) {
        const oldParent = findParentComponent(state.components, componentId);
        const newParent = newParentId ? findComponentById(state.components, newParentId) : null;

        // Create a copy of the current state
        const originalState = JSON.parse(JSON.stringify(state.components));

        // If moving within the same container
        if (oldParent && (oldParent.id === newParentId || oldParent.children.some(child => child.id === newParentId))) {
          const siblingId = oldParent.id === newParentId ? componentId : newParentId;
          const siblingIndex = oldParent.children.findIndex(child => child.id === siblingId);
          
          // Remove the component from its current position
          oldParent.children = oldParent.children.filter(child => child.id !== componentId);
          
          // Insert it at the new position
          if (oldParent.id === newParentId) {
            // If dropped on the parent, add to the end
            oldParent.children.push(componentToMove);
          } else {
            // If dropped on a sibling, insert before that sibling
            oldParent.children.splice(siblingIndex, 0, componentToMove);
          }
        } else {
          // Remove from old parent
          if (oldParent) {
            oldParent.children = oldParent.children.filter(child => child.id !== componentId);
          } else {
            state.components = state.components.filter(component => component.id !== componentId);
          }

          // Add to new parent or root level
          if (newParent && (newParent.type === 'FLEX_CONTAINER' || newParent.type === 'GRID_CONTAINER')) {
            if (!newParent.children) newParent.children = [];
            newParent.children.push(componentToMove);
          } else {
            if (newPosition) {
              componentToMove.style = {
                ...componentToMove.style,
                top: newPosition.top,
                left: newPosition.left,
              };
            }
            state.components.push(componentToMove);
          }
        }

        // Check if the component still exists after the move
        const componentStillExists = findComponentById(state.components, componentId);
        if (!componentStillExists) {
          // If the component doesn't exist, revert to the original state
          state.components = originalState;
        }
      }
    },
    updateGlobalSettings: (state, action) => {
      state.globalSettings = {
        ...state.globalSettings,
        ...action.payload,
        style: {
          ...state.globalSettings.style,
          ...(action.payload.style || {}),
        },
      };
    },
    updateHeadingProperties: (state, action) => {
      const { id, properties } = action.payload;
      const updatedComponents = updateComponentById(state.components, id, {
        props: properties,
      });
      state.components = updatedComponents;
    },

    updateResponsiveProperties: (state, action) => {
      const { id, responsiveProps } = action.payload;
      const updatedComponents = updateComponentById(state.components, id, {
        props: {
          responsiveHide: responsiveProps.responsiveHide,
          responsiveFontSize: responsiveProps.responsiveFontSize,
        },
      });
      state.components = updatedComponents;
    },
    setEditorMode: (state, action) => {
      state.mode = action.payload;
    },
    loadPageContent: (state, action) => {
      const { components, globalSettings, canvasSettings } = action.payload;
      console.log('Loading page content:', components);
      /* const regenerateIds = (component) => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const uniqueId = `${component.type}_${timestamp}_${randomString}`;
        return {
          ...component,
          id: uniqueId,
          name: `${component.type}_${uniqueId.substr(0, 8)}`,
          children: component.children ? component.children.map(regenerateIds) : undefined,
        };
      }; */
      //state.components = components.map(regenerateIds);
      state.components = components;
      state.globalSettings = globalSettings;
      state.canvasSettings = canvasSettings || state.canvasSettings; // Use existing canvasSettings if not provided
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
      if (!state.globalSettings) {
        state.globalSettings = {
          backgroundColor: '#ffffff',
          componentLayout: 'vertical',
          style: {
            paddingTop: '0px',
            paddingRight: '0px',
            paddingBottom: '0px',
            paddingLeft: '0px',
            marginTop: '0px',
            marginRight: '0px',
            marginBottom: '0px',
            marginLeft: '0px',
            gap: '0px'
          }
        };
      }
    },
    undoWhiteboard: (state) => {
      if (state.whiteboardState.historyIndex > 0) {
        state.whiteboardState.historyIndex -= 1;
        const previousState = state.whiteboardState.history[state.whiteboardState.historyIndex];
        const whiteboardComponent = findComponentById(state.components, state.components.find(c => c.type === 'WHITEBOARD').id);
        if (whiteboardComponent) {
          whiteboardComponent.props.imageData = previousState;
        }
      }
    },

    redoWhiteboard: (state) => {
      if (state.whiteboardState.historyIndex < state.whiteboardState.history.length - 1) {
        state.whiteboardState.historyIndex += 1;
        const nextState = state.whiteboardState.history[state.whiteboardState.historyIndex];
        const whiteboardComponent = findComponentById(state.components, state.components.find(c => c.type === 'WHITEBOARD').id);
        if (whiteboardComponent) {
          whiteboardComponent.props.imageData = nextState;
        }
      }
    },
    setDragModeEnabled: (state, action) => {
      state.isDragModeEnabled = action.payload;
    },
    toggleFloatingMenu: (state) => {
      state.isFloatingMenuVisible = !state.isFloatingMenuVisible;
    },
    updateWhiteboardStrokeColor: (state, action) => {
      const { componentId, color } = action.payload;
      state.whiteboardState.strokeColor = color;
      
      // Update the component's props as well
      const component = findComponentById(state.components, componentId);
      if (component && component.type === 'WHITEBOARD') {
        component.props.strokeColor = color;
      }
    },
    resetEditorState: (state) => {
      // Reset the entire state to the initial state
      return initialState;
    },
    updateCanvasSettings: (state, action) => {
      console.log('Updating canvas settings:', action.payload);
      state.canvasSettings = {
        ...state.canvasSettings,
        ...action.payload,
      };
    },
    updateKanbanBoard: (state, action) => {
      const { id, updates } = action.payload;
      const component = findComponentById(state.components, id);
      if (component && component.type === 'KANBAN') {
        component.props = {
          ...component.props,
          ...updates,
        };
      }
    },
    updateColorTheme: (state, action) => {
      state.colorTheme = action.payload;
    },
    updateToolbarSettings: (state, action) => {
      state.toolbarSettings = {
        ...state.toolbarSettings,
        ...action.payload,
      };
    },
    updateTodoTasks: (state, action) => {
      const { componentId, tasks } = action.payload;
      const component = findComponentById(state.components, componentId);
      if (component && component.type === 'TODO') {
        component.props.tasks = tasks;
      }
    },
    updateKanbanTask: (state, action) => {
      const { componentId, taskId, updates } = action.payload;
      const component = findComponentById(state.components, componentId);
      if (component && component.type === 'KANBAN') {
        const updatedTasks = component.props.tasks.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        );
        component.props.tasks = updatedTasks;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(saveComponentThunk.fulfilled, (state, action) => {
      // You can add any additional state updates here if needed
      console.log('Component saved:', action.payload);
    });
  },
});

const findParentComponent = (components, childId) => {
  for (let component of components) {
    if (component.children && component.children.some(child => child.id === childId)) {
      return component;
    }
    if (component.children) {
      const found = findParentComponent(component.children, childId);
      if (found) return found;
    }
  }
  return null;
};

export const {
  addComponent,
  updateComponent,
  deleteComponent,
  deleteComponents,
  setSelectedIds,
  alignComponents,
  distributeComponents,
  copyComponents,
  pasteComponents,
  moveComponent,
  updateGlobalSettings,
  updateComponentSpacing,
  updateGlobalSpacing,
  updateHeadingProperties,
  updateResponsiveProperties,
  toggleComponentDragging,
  setEditorMode,
  loadPageContent,
  setCurrentPage,
  undoWhiteboard,
  redoWhiteboard,
  renameComponent,
  setDragModeEnabled,
  toggleFloatingMenu,
  updateWhiteboardStrokeColor,
  resetEditorState,
  updateCanvasSettings,
  updateKanbanBoard,
  updateColorTheme,
  updateToolbarSettings,
  updateTodoTasks,
  updateKanbanTask,
} = editorSlice.actions;

export default editorSlice.reducer;
