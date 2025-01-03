import React, { useState, useCallback, useEffect, useRef } from "react";
import { useDrop, useDrag } from "react-dnd";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteComponents,
  renameComponent,
  updateComponent,
} from "../../../features/editorSlice"; // Add updateComponent to imports
import { v4 as uuidv4 } from "uuid";
import ReactDOM from "react-dom";

import HeadingRenderer from "./HeadingRenderer";
import TextRenderer from "./TextRenderer";
import ImageRenderer from "./ImageRenderer";
import ButtonRenderer from "./ButtonRenderer";
import ChartRenderer from "./ChartRenderer";
import WhiteboardRenderer from "./WhiteboardRenderer";
import VideoRenderer from "./VideoRenderer";
import QueryValueRenderer from "./QueryValueRenderer"; // Add this import
import KanbanRenderer from "./KanbanRenderer";
import { getHighlightColor } from "../../../utils/highlightColors"; // We'll create this utility function
import { FaPencilAlt, FaTimes } from "react-icons/fa"; // Add FaTimes import
import FloatingToolbar from "../Tools/FloatingToolbar";
import ResizeHandle from "../../common/ResizeHandle";
import TableRenderer from "./TableRenderer";
import TodoRenderer from "./TodoRenderer";
import { usePageNavigation } from "../../../contexts/PageNavigationContext";
import { WebServiceExecutor } from "../../../services/webService";

const defaultGlobalSettings = {
  generalComponentStyle: {
    fontSize: "16px",
    color: "#000000",
    backgroundColor: "#ffffff",
    borderRadius: "4px", // Add default border radius
  },
};

const useDragDrop = (
  component,
  onMoveComponent,
  onAddChild,
  isDragModeEnabled
) => {
  const [{ isDragging }, drag] = useDrag({
    type: "COMPONENT",
    item: { id: component.id, type: component.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: () => isDragModeEnabled && !component.isDraggingDisabled,
  });

  const [{ isOver }, drop] = useDrop({
    accept: ["COMPONENT", "SAVED_COMPONENT"],
    drop: (item, monitor) => {
      if (monitor.didDrop()) return;

      if (item.type === "SAVED_COMPONENT" && item.savedComponent) {
        // Process saved component with full structure preservation
        const processComponent = (comp) => {
          const newId = uuidv4();
          const processed = {
            ...comp,
            id: newId,
            type: comp.type,
            isSavedComponent: true,
            originalSavedComponent: comp,
            children:
              comp.children?.map((child) => processComponent(child)) || [],
          };
          return processed;
        };

        const processedComponent = processComponent(item.savedComponent);
        onAddChild(component.id, processedComponent.type, {
          ...processedComponent,
          savedComponent: item.savedComponent,
        });
      } else if (item.id && isDragModeEnabled) {
        onMoveComponent(item.id, component.id);
      } else {
        onAddChild(component.id, item.type);
      }
    },
    canDrop: () => component.type === "FLEX_CONTAINER",
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  });

  return { isDragging, isOver, dragRef: drag, dropRef: drop };
};

const getComponentStyle = (
  component,
  globalSettings,
  isFlexChild,
  isTopLevel,
  parent
) => {
  const { style = {}, type, props = {} } = component;
  const generalComponentStyle =
    globalSettings?.generalComponentStyle ||
    defaultGlobalSettings.generalComponentStyle;

  const componentStyle = {
    ...generalComponentStyle,
    ...style,
    position: "relative",
    overflow: "visible",
    cursor: style.cursor || (type === "FLEX_CONTAINER" ? "pointer" : "default"),
    color: style.color || parent?.style?.color || "inherit",
    boxSizing: "border-box",
    borderRadius: style.borderRadius || props?.borderRadius || "4px",
    backgroundColor: style.backgroundColor || "transparent",
    boxShadow: style.boxShadow || "none",
    opacity: style.opacity || 1,
    transform: style.transform || "none",
    transition: style.transition || "all 200ms ease-in-out",
    minWidth: style.minWidth || "auto",
    minHeight: style.minHeight || "auto",
    width: style.width || "100%",
    height: style.height || "auto",
    padding: style.padding || "0px",
    margin: style.margin || "0px",
  };

  // Handle component-specific styles
  switch (type) {
    case "FLEX_CONTAINER":
      Object.assign(componentStyle, {
        display: "flex",
        flexDirection: props.flexDirection || "row",
        flexWrap: props.flexWrap || "nowrap",
        alignItems: props.alignItems || "center",
        justifyContent: props.justifyContent || "flex-start",
        alignContent: props.alignContent || "stretch",
        gap: props.gap || "0px",
        height: style.height || (isTopLevel ? "300px" : "auto"),
        minHeight: style.minHeight || "50px",
        width: style.width || "100%",
        boxSizing: "border-box",
        padding: style.padding || "8px",
      });

      if (style.showBorder !== false) {
        Object.assign(componentStyle, {
          borderWidth: style.borderWidth || "1px",
          borderStyle: style.borderStyle || "solid",
          borderColor: style.borderColor || "#000",
        });
      }
      break;

    case "TEXT":
      Object.assign(componentStyle, {
        display: "flex",
        flexDirection: "column",
        height: style.height || "auto",
        minHeight: style.minHeight || "24px",
      });
      break;

    case "CHART":
      Object.assign(componentStyle, {
        width: style.width || "100%",
        height: style.height || "300px",
        minHeight: style.minHeight || "150px",
      });
      break;

    default:
      Object.assign(componentStyle, {
        height: style.height || (isTopLevel ? "300px" : "auto"),
        minHeight: style.minHeight || "24px",
      });
  }

  // Handle flex child properties
  if (isFlexChild) {
    Object.assign(componentStyle, {
      flexGrow: style.flexGrow || 0,
      flexShrink: style.flexShrink || 1,
      flexBasis: style.height || style.flexBasis || "auto",
      width: style.width || "auto",
    });
  }

  // Ensure explicit dimensions take precedence
  if (style.width) componentStyle.width = style.width;
  if (style.height) componentStyle.height = style.height;
  if (style.maxWidth) componentStyle.maxWidth = style.maxWidth;
  if (style.maxHeight) componentStyle.maxHeight = style.maxHeight;

  return componentStyle;
};

const ComponentRenderer = React.memo(
  ({
    component,
    onUpdate,
    onSelect,
    isSelected,
    onAddChild,
    onMoveComponent,
    depth = 0, // Add depth prop with default value 0
    selectedIds = [],
    isFlexChild = false,
    parent = null,
    globalComponentLayout,
    isViewMode = false,
    globalSettings = defaultGlobalSettings, // Provide a default value
    isTopLevel = false, // Add this prop
    onStyleChange, // Add this prop
    onToolbarInteraction, // Add this prop
    isDragModeEnabled, // Add this prop
    onToolbarOpen,
    onToolbarClose,
    isToolbarOpen,
    onDeselect, // Add this prop
  }) => {
    const dispatch = useDispatch();
    const componentRef = useRef(null);
    const { isDragging, isOver, dragRef, dropRef } = useDragDrop(
      component,
      onMoveComponent,
      onAddChild,
      isDragModeEnabled
    );
    const [toolbarState, setToolbarState] = useState({
      show: false,
      position: { x: 0, y: 0 },
    });
    const [isEditing, setIsEditing] = useState(false);
    const editingRef = useRef(false);
    const { navigateToPage } = usePageNavigation();

    useEffect(() => {
      editingRef.current = isEditing;
    }, [isEditing]);

    const handleClick = useCallback(
      (event) => {
        if (isViewMode) {
          // Handle page navigation
          const hasParentNavigation =
            parent &&
            parent.type === "FLEX_CONTAINER" &&
            parent.style?.enablePageNavigation &&
            parent.style?.targetPageId;

          if (
            component.style?.enablePageNavigation &&
            component.style?.targetPageId
          ) {
            event.stopPropagation();
            navigateToPage(component.style.targetPageId);
            return;
          } else if (hasParentNavigation) {
            event.stopPropagation();
            navigateToPage(parent.style.targetPageId);
            return;
          }

          // Handle web service execution
          if (component.style?.serviceConfig) {
            event.stopPropagation();
            const { serviceConfig } = component.style;

            // Check for confirmation if required
            if (
              serviceConfig.type === "action" &&
              serviceConfig.actionConfig?.confirmationRequired &&
              !window.confirm("Are you sure you want to execute this action?")
            ) {
              return;
            }

            // Execute web service
            WebServiceExecutor.execute(serviceConfig)
              .then((response) => {
                if (serviceConfig.type === "action") {
                  // Show success message for action services
                  window.alert(
                    serviceConfig.actionConfig?.successMessage ||
                      "Action completed successfully"
                  );
                } else if (
                  serviceConfig.type === "data" &&
                  serviceConfig.responseMapping?.target
                ) {
                  // Update target component for data services
                  dispatch(
                    updateComponent({
                      id: serviceConfig.responseMapping.target,
                      updates: {
                        data: response,
                      },
                    })
                  );
                }
              })
              .catch((error) => {
                // Show error message
                const errorMessage =
                  serviceConfig.type === "action"
                    ? serviceConfig.actionConfig?.errorMessage ||
                      "Action failed"
                    : "Failed to fetch data";
                window.alert(errorMessage);
                console.error("Web service execution failed:", error);
              });
            return;
          }

          return;
        }

        event.stopPropagation();
        const isMultiSelect = event.ctrlKey || event.metaKey;
        onSelect(component.id, isMultiSelect);
      },
      [
        component.id,
        component.style,
        parent,
        isViewMode,
        navigateToPage,
        onSelect,
        dispatch,
      ]
    );

    // Add this effect to handle the delete key press
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (
          e.key === "Delete" &&
          !isViewMode &&
          selectedIds.includes(component.id)
        ) {
          e.preventDefault();
          dispatch(deleteComponents([component.id]));
        }
      };

      const currentRef = componentRef.current;
      if (currentRef) {
        currentRef.addEventListener("keydown", handleKeyDown);

        return () => {
          currentRef.removeEventListener("keydown", handleKeyDown);
        };
      }
    }, [dispatch, component.id, selectedIds, isViewMode]);

    const isThisComponentSelected =
      selectedIds?.includes(component.id) || false;
    const highlightColor = getHighlightColor(depth);

    const renderChildren = () => {
      if (!component.children || component.children.length === 0) {
        return null;
      }

      return component.children.map((child) => (
        <ComponentRenderer
          key={child.id}
          component={child}
          onUpdate={onUpdate}
          onSelect={onSelect}
          onAddChild={onAddChild}
          onMoveComponent={onMoveComponent}
          selectedIds={selectedIds}
          depth={depth + 1}
          isFlexChild={component.type === "FLEX_CONTAINER"}
          parent={component}
          isViewMode={isViewMode}
          globalSettings={globalSettings}
          onStyleChange={onStyleChange} // Pass onStyleChange prop
          onToolbarInteraction={onToolbarInteraction} // Pass onToolbarInteraction prop
          isDragModeEnabled={isDragModeEnabled} // Pass isDragModeEnabled prop
          onToolbarOpen={onToolbarOpen}
          onToolbarClose={onToolbarClose}
          isToolbarOpen={isToolbarOpen}
          onDeselect={onDeselect}
        />
      ));
    };

    const handleDoubleClick = useCallback(
      (e) => {
        e.stopPropagation();
        if (isViewMode) return;

        const rect = componentRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate the available space on the right and bottom
        const spaceRight = viewportWidth - e.clientX;
        const spaceBottom = viewportHeight - e.clientY;

        // Determine the position based on available space
        let x = e.clientX;
        let y = e.clientY;

        // If there's not enough space on the right, position on the left
        if (spaceRight < 300) {
          // Assuming toolbar width is 300px
          x = Math.max(0, e.clientX - 300);
        }

        // If there's not enough space at the bottom, position above
        if (spaceBottom < 400) {
          // Assuming a max toolbar height of 400px
          y = Math.max(0, e.clientY - 400);
        }

        if (component.type === "TEXT") {
          if (!toolbarState.show) {
            setToolbarState({ show: true, position: { x, y } });
            onToolbarOpen(component.id);
          }
          setIsEditing(true);
        } else {
          setToolbarState((prev) => ({ show: !prev.show, position: { x, y } }));
          if (!toolbarState.show) {
            onToolbarOpen(component.id);
          } else {
            onToolbarClose();
            onDeselect(); // Deselect when closing toolbar
          }
        }
      },
      [
        isViewMode,
        component.type,
        toolbarState,
        onToolbarOpen,
        onToolbarClose,
        onDeselect,
      ]
    );

    const handleUpdate = useCallback(
      (id, updates) => {
        console.log("ComponentRenderer handleUpdate:", { updates });

        // Create new objects to ensure mutability
        const cleanStyle = updates.style ? { ...updates.style } : {};
        const cleanProps = updates.props ? { ...updates.props } : {};
        const currentStyle = { ...component.style };
        const currentProps = { ...component.props };

        // Remove layout properties from style for FLEX_CONTAINER
        if (component.type === "FLEX_CONTAINER") {
          // Create a new style object without the layout properties
          const {
            gap,
            flexDirection,
            flexWrap,
            alignItems,
            justifyContent,
            alignContent,
            ...remainingStyle
          } = cleanStyle;

          // Move borderRadius to style if it exists in props
          if ("borderRadius" in cleanProps) {
            remainingStyle.borderRadius = cleanProps.borderRadius;
            delete cleanProps.borderRadius;
          }

          // Update cleanStyle with filtered properties
          Object.assign(cleanStyle, remainingStyle);
        }

        // Create clean props object without redundant properties
        const {
          style: _style,
          id: _id,
          name: _name,
          ...essentialProps
        } = cleanProps;

        // Create clean component update
        const updatedComponent = {
          ...component,
          style:
            Object.keys(cleanStyle).length > 0
              ? {
                  ...currentStyle,
                  ...cleanStyle,
                }
              : currentStyle,
          props:
            Object.keys(essentialProps).length > 0
              ? {
                  direction:
                    essentialProps.direction ||
                    currentProps?.direction ||
                    "horizontal",
                  wrap: essentialProps.wrap || currentProps?.wrap || "nowrap",
                  alignItems:
                    essentialProps.alignItems ||
                    currentProps?.alignItems ||
                    "center",
                  justifyContent:
                    essentialProps.justifyContent ||
                    currentProps?.justifyContent ||
                    "flex-start",
                  gap: essentialProps.gap || currentProps?.gap || "0px",
                  isDraggingDisabled:
                    essentialProps.isDraggingDisabled ??
                    currentProps?.isDraggingDisabled ??
                    false,
                  depth: essentialProps.depth ?? currentProps?.depth ?? 0,
                }
              : {
                  direction: "horizontal",
                  wrap: "nowrap",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "0px",
                  isDraggingDisabled: false,
                  depth: currentProps?.depth ?? 0,
                },
        };

        console.log("ComponentRenderer final update:", updatedComponent);
        onUpdate(id, updatedComponent);
      },
      [onUpdate, component]
    );

    const handleToolbarClose = useCallback(() => {
      setToolbarState({ show: false, position: { x: 0, y: 0 } });
      setIsEditing(false);
      onToolbarClose();
    }, [onToolbarClose]);

    const handleToolbarInteraction = useCallback((e) => {
      e.stopPropagation();
      // Prevent closing the toolbar when interacting with it
    }, []);

    const renderContent = () => {
      const sharedProps = {
        component: {
          ...component,
          style: {
            ...component.style,
            margin: "0px",
          },
          props: { ...component.props },
        },
        onUpdate: handleUpdate,
        onSelect,
        onAddChild,
        onMoveComponent,
        selectedIds,
        depth: depth + 1,
        parent,
        isViewMode,
        globalSettings: {
          ...defaultGlobalSettings,
          ...globalSettings,
          generalComponentStyle: {
            ...defaultGlobalSettings.generalComponentStyle,
            ...globalSettings.generalComponentStyle,
          },
        },
        onStyleChange,
        isSelected: isThisComponentSelected,
        onDoubleClick: handleDoubleClick,
        isEditing: isEditing,
        setIsEditing: setIsEditing,
        isDragModeEnabled,
      };

      // Wrap the content in a div with content-element class
      const renderWithContentClass = (content) => {
        if (component.type === "FLEX_CONTAINER") {
          return content;
        }

        return (
          <div className="w-full h-full relative overflow-visible hover:bg-opacity-10 hover:bg-gray-500">
            {content}
          </div>
        );
      };

      switch (component.type) {
        case "FLEX_CONTAINER":
          return renderWithContentClass(renderChildren());
        case "HEADING":
          return renderWithContentClass(<HeadingRenderer {...sharedProps} />);
        case "TEXT":
          return renderWithContentClass(<TextRenderer {...sharedProps} />);
        case "IMAGE":
          return renderWithContentClass(<ImageRenderer {...sharedProps} />);
        case "BUTTON":
          return renderWithContentClass(<ButtonRenderer {...sharedProps} />);
        case "CHART":
          return renderWithContentClass(
            <ChartRenderer
              {...sharedProps}
              globalChartStyle={globalSettings.chartStyle}
            />
          );
        case "WHITEBOARD":
          return renderWithContentClass(
            <WhiteboardRenderer {...sharedProps} isViewMode={isViewMode} />
          );
        case "VIDEO":
          return renderWithContentClass(<VideoRenderer {...sharedProps} />);
        case "QUERY_VALUE":
          return renderWithContentClass(
            <QueryValueRenderer {...sharedProps} />
          );
        case "KANBAN":
          return renderWithContentClass(
            <KanbanRenderer {...sharedProps} isInteractive={isViewMode} />
          );
        case "TABLE":
          return renderWithContentClass(<TableRenderer {...sharedProps} />);
        case "TODO":
          return renderWithContentClass(
            <TodoRenderer
              component={component}
              isViewMode={isViewMode}
              onUpdate={onUpdate}
            />
          );
        default:
          return null;
      }
    };

    const handleResize = (newSize, unit, dimension) => {
      // Ensure minimum sizes
      const minSize = dimension === "height" ? 24 : 50;
      const adjustedSize = Math.max(minSize, newSize);

      // Create a comprehensive style update
      const updates = {
        style: {
          ...component.style,
          [dimension]: `${adjustedSize}${unit}`,
          [`min${
            dimension.charAt(0).toUpperCase() + dimension.slice(1)
          }`]: `${adjustedSize}${unit}`,
          // Ensure flex-basis is updated for flex children
          ...(isFlexChild && dimension === "height"
            ? { flexBasis: `${adjustedSize}${unit}` }
            : {}),
        },
      };

      // For flex containers, ensure proper flex properties
      if (component.type === "FLEX_CONTAINER") {
        updates.style = {
          ...updates.style,
          display: "flex",
          flexDirection: component.style.flexDirection || "row",
        };
      }

      // For text components, ensure they maintain proper layout
      if (component.type === "TEXT") {
        updates.style = {
          ...updates.style,
          display: "flex",
          flexDirection: "column",
        };
      }

      onUpdate(component.id, updates);
    };

    const getSize = (dimension) => {
      const size = component.style[dimension];
      if (!size) return { size: 100, unit: "%" };

      const match = String(size).match(/^([\d.]+)(.*)$/);
      return match
        ? { size: parseFloat(match[1]), unit: match[2] || "px" }
        : { size: 100, unit: "%" };
    };

    const { size: width, unit: widthUnit } = getSize("width");
    const { size: height, unit: heightUnit } = getSize("height");

    // Add this at the component level (before the return statement)
    const originalStyleRef = useRef({
      backgroundColor: null,
      color: null,
      transform: null,
    });

    // Define the handlers as functions inside the component
    const handleMouseEnter = (e) => {
      const floatingToolbar = document.querySelector(".floating-toolbar");
      const target = e.currentTarget;

      const hasParentHover =
        parent &&
        parent.type === "FLEX_CONTAINER" &&
        (parent.style?.hoverColor ||
          parent.style?.hoverBackgroundColor ||
          parent.style?.hoverScale);

      if (
        (component.type === "FLEX_CONTAINER" && component.style) ||
        hasParentHover
      ) {
        if (!floatingToolbar || !floatingToolbar.contains(e.target)) {
          const styleToApply = hasParentHover ? parent.style : component.style;

          // Store the current background color if not already stored
          if (!target.dataset.originalBg) {
            // Use the component's style background color if set, otherwise use computed style
            const currentBg =
              component.style.backgroundColor ||
              getComputedStyle(target).backgroundColor;
            target.dataset.originalBg = currentBg;
            originalStyleRef.current.backgroundColor = currentBg;
          }

          // Apply hover effects if defined
          if (styleToApply.hoverBackgroundColor) {
            target.style.backgroundColor = styleToApply.hoverBackgroundColor;

            if (component.type === "FLEX_CONTAINER") {
              target.querySelectorAll(".component-wrapper").forEach((child) => {
                child.style.backgroundColor = "transparent";
              });
            }
          }
        }
      }
    };

    const handleMouseLeave = (e) => {
      const floatingToolbar = document.querySelector(".floating-toolbar");
      const target = e.currentTarget;

      const hasParentHover =
        parent &&
        parent.type === "FLEX_CONTAINER" &&
        (parent.style?.hoverColor ||
          parent.style?.hoverBackgroundColor ||
          parent.style?.hoverScale);

      if (
        (component.type === "FLEX_CONTAINER" && component.style) ||
        hasParentHover
      ) {
        const shouldResetStyles =
          !floatingToolbar ||
          !e.relatedTarget ||
          (e.relatedTarget instanceof Node &&
            !floatingToolbar.contains(e.relatedTarget));

        if (shouldResetStyles) {
          // Restore the original background color
          if (target.dataset.originalBg) {
            target.style.backgroundColor = target.dataset.originalBg;
          }

          // Clear stored values
          delete target.dataset.originalBg;
          originalStyleRef.current.backgroundColor = null;
        }
      }
    };

    // Add this useEffect to update stored background color when component style changes
    useEffect(() => {
      if (componentRef.current && component.style.backgroundColor) {
        componentRef.current.dataset.originalBg =
          component.style.backgroundColor;
        originalStyleRef.current.backgroundColor =
          component.style.backgroundColor;
      }
    }, [component.style.backgroundColor]);

    // Add cleanup when component unmounts
    useEffect(() => {
      return () => {
        originalStyleRef.current = {
          backgroundColor: null,
          color: null,
          transform: null,
        };
      };
    }, []);

    // Use the same rendering logic for both view and edit modes
    return (
      <>
        <div
          ref={(node) => {
            componentRef.current = node;
            if (component.type === "FLEX_CONTAINER") {
              dropRef(node);
            }
            dragRef(node);
          }}
          style={{
            ...getComponentStyle(
              component,
              globalSettings,
              isFlexChild,
              isTopLevel,
              parent
            ),
            ...(isThisComponentSelected && !isViewMode
              ? { outline: `2px solid ${highlightColor}` }
              : {}),
            position: "relative",
          }}
          className={`component-wrapper
            ${isViewMode ? "" : isThisComponentSelected ? "shadow-lg" : ""}
            ${isViewMode ? "" : isOver ? "bg-blue-100" : ""}
            ${component.type === "FLEX_CONTAINER" ? "hover-effects" : ""}
          `}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          data-id={component.id}
          tabIndex={0}
        >
          {renderContent()}
          {!isViewMode && isThisComponentSelected && (
            <div
              className="absolute top-0 right-0 text-white text-xs px-1"
              style={{
                backgroundColor: highlightColor,
                zIndex: 1,
              }}
            >
              {component.name || component.type}
            </div>
          )}
          {isThisComponentSelected && !isViewMode && (
            <>
              <ResizeHandle
                onResize={(newSize, unit) =>
                  handleResize(newSize, unit, "width")
                }
                isHorizontal={true}
                currentSize={width}
                currentUnit={widthUnit}
              />
              <ResizeHandle
                onResize={(newSize, unit) =>
                  handleResize(newSize, unit, "height")
                }
                isHorizontal={false}
                currentSize={height}
                currentUnit={heightUnit}
              />
            </>
          )}
        </div>

        {/* Replace the existing FloatingToolbar render with this */}
        {toolbarState.show &&
          ReactDOM.createPortal(
            <FloatingToolbar
              className="floating-toolbar"
              componentId={component.id}
              componentType={component.type}
              initialPosition={toolbarState.position}
              onClose={() => {
                handleToolbarClose();
                onDeselect();
              }}
              style={component.style}
              props={component.props}
              content={component.content}
              component={component}
              onStyleChange={(updates) => {
                if (updates.style) {
                  const updatedStyle = {
                    ...component.style,
                    ...updates.style,
                  };
                  if (updatedStyle.width) {
                    updatedStyle.minWidth = updatedStyle.minWidth || "auto";
                    updatedStyle.maxWidth = updatedStyle.maxWidth || "100%";
                  }
                  if (updatedStyle.height) {
                    updatedStyle.minHeight = updatedStyle.minHeight || "auto";
                    updatedStyle.maxHeight = updatedStyle.maxHeight || "100%";
                  }
                  onUpdate(component.id, { style: updatedStyle });
                }
                if (updates.props)
                  onUpdate(component.id, { props: updates.props });
                if (updates.content !== undefined)
                  onUpdate(component.id, { content: updates.content });
              }}
              onToolbarInteraction={handleToolbarInteraction}
            />,
            document.body
          )}
      </>
    );
  }
);

export default ComponentRenderer;
