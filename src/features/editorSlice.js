import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import {
  alignComponentsUtil,
  distributeComponentsUtil,
} from "../utils/alignmentUtils";
import { componentConfig } from "../components/Components/componentConfig";
import {
  createComponent,
  updateComponent as updateComponentUtil,
} from "../components/Components/componentFactory";

const initialState = {
  components: [],
  selectedIds: [],
  clipboard: null,
  globalSettings: {
    backgroundColor: "#ffffff",
    componentLayout: "horizontal",
    style: {
      paddingTop: "0px",
      paddingRight: "0px",
      paddingBottom: "0px",
      paddingLeft: "0px",
      marginTop: "0px",
      marginRight: "0px",
      marginBottom: "0px",
      marginLeft: "0px",
      gap: "0px",
    },
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
          ...updates.style,
        },
        props: {
          ...component.props,
          ...updates.props,
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

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    addComponent: (state, action) => {
      const { type, parentId, ...otherProps } = action.payload;
      let defaultPosition = {};

      if (!parentId) {
        // Only apply this logic for top-level components
        const lastComponent = state.components[state.components.length - 1];
        const offset = 20; // Offset for cascading effect

        if (lastComponent) {
          if (state.globalSettings.componentLayout === "vertical") {
            defaultPosition = {
              style: {
                top: 0,
                left:
                  lastComponent.style.left + lastComponent.style.width + offset,
                width: 200, // Default width
                height: "100%", // Full height for vertical layout
              },
            };
          } else {
            // horizontal layout
            defaultPosition = {
              style: {
                top:
                  lastComponent.style.top + lastComponent.style.height + offset,
                left: 0,
                width: "100%", // Full width for horizontal layout
                height: 200, // Default height
              },
            };
          }
        } else {
          // First component
          defaultPosition = {
            style: {
              top: 0,
              left: 0,
              width:
                state.globalSettings.componentLayout === "vertical"
                  ? 200
                  : "100%",
              height:
                state.globalSettings.componentLayout === "vertical"
                  ? "100%"
                  : 200,
            },
          };
        }
      }

      const newComponent = createComponent(type, {
        ...defaultPosition,
        ...otherProps,
      });

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
      const updatedComponents = updateComponentById(
        state.components,
        id,
        updates
      );
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
        // Remove from old parent
        state.components = removeComponentFromParent(
          state.components,
          componentId
        );
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
            componentToMove.style = {
              ...componentToMove.style,
              ...newPosition,
            };
          }
          state.components.push(componentToMove);
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
  },
});

const removeComponentFromParent = (components, componentId) => {
  return components
    .map((component) => {
      if (component.children) {
        return {
          ...component,
          children: component.children.filter(
            (child) => child.id !== componentId
          ),
        };
      }
      return component;
    })
    .filter((component) => component.id !== componentId);
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
  updateComponentSpacing,
  updateGlobalSpacing,
} = editorSlice.actions;

export default editorSlice.reducer;
