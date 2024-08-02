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
      const updatedComponent = {
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

      console.log(`Updating component ${id}:`, updatedComponent);
      return updatedComponent;
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
      let defaultStyle = {};

      if (!parentId) {
        if (type === "FLEX_CONTAINER") {
          if (state.globalSettings.componentLayout === "horizontal") {
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
        } else if (state.globalSettings.componentLayout === "vertical") {
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

      const newComponent = createComponent(type, {
        style: {
          ...defaultStyle,
          ...otherProps.style,
        },
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
      const updatedComponents = updateComponentById(state.components, id, updates);
      state.components = updatedComponents;
      console.log(`Updated component ${id}:`, findComponentById(updatedComponents, id));
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
        state.components = removeComponentFromParent(state.components, componentId);
        if (newParentId) {
          // Add to new parent
          const newParent = findComponentById(state.components, newParentId);
          if (newParent) {
            if (!newParent.children) newParent.children = [];
            newParent.children.push(componentToMove);
          }
        } else {
          // Move to root level
          if (newPosition) {
            // For flex layout, we don't need to set top and left
            componentToMove.style = {
              ...componentToMove.style,
              order: state.components.length, // Use order to control positioning
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
  updateHeadingProperties,
  updateResponsiveProperties,
} = editorSlice.actions;

export default editorSlice.reducer;
