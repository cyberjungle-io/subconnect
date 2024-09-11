import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import {
  alignComponentsUtil,
  distributeComponentsUtil,
} from "../utils/alignmentUtils";
import { componentConfig } from "../components/Components/componentConfig";
import { createComponent, updateComponent as updateComponentUtil } from "../components/Components/componentFactory";
import { defaultGlobalSettings } from '../utils/defaultGlobalSettings';

const initialState = {
  components: [],
  selectedIds: [],
  clipboard: null,
  globalSettings: defaultGlobalSettings,
  mode: 'edit',
  currentPage: null,
  whiteboardState: {
    history: [],
    historyIndex: -1,
    strokeColor: '#000000',
  },
  isDragModeEnabled: false,
  isFloatingMenuVisible: false,
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

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    addComponent: (state, action) => {
      const { type, parentId, ...otherProps } = action.payload;
      let defaultStyle = {};
      let depth = 0;

      // Add this check
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

      const newComponent = createComponentWithDepth(type, {
        style: {
          ...defaultStyle,
          ...otherProps.style,
        },
        isDraggingDisabled: false,
        name: `${type} ${uuidv4().substr(0, 4)}`, // Add a default name
        ...otherProps,
      }, depth);

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
      const { components, globalSettings } = action.payload;
      state.components = components;
      state.globalSettings = globalSettings;
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
} = editorSlice.actions;

export default editorSlice.reducer;