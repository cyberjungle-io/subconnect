import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  FaTimes,
  FaLayerGroup,
  FaPalette,
  FaExpand,
  FaBorderStyle,
  FaFont,
  FaImage,
  FaChartBar,
  FaPlay,
  FaArrowsAlt,
  FaMousePointer,
  FaPencilAlt,
  FaDatabase,
  FaSave,
  FaClipboardList,
  FaTable,
  FaFillDrip,
  FaBars,
  FaListUl,
  FaUserPlus,
  FaCloudSun,
} from "react-icons/fa";
import SizeControls from "./SizeControls";
import LayoutControls from "./LayoutControls";
import BorderControls from "./BorderControls";
import BackgroundControls from "./BackgroundControls";
import TextControls from "./TextControls";
import ImageControls from "./ImageControls";
import ChartControls from "./ChartControls";
import SpacingControls from "./SpacingControls";
import VideoControls from "./VideoControls";
import WhiteboardControls from "./WhiteboardControls";
import ButtonControls from "./ButtonControls";
import QueryValueControls from "./QueryValueControls";
import BasicTextControls from "./BasicTextControls";
import ChartDataControls from "./ChartDataControls";
import KanbanControls from "./KanbanControls";
import { useDispatch, useSelector } from "react-redux";
import {
  renameComponent,
  saveComponentThunk,
} from "../../../features/editorSlice";
import ColorThemeControls from "./ColorThemeControls";
import TableControls from "./TableControls";
import TableDataControls from "./TableDataControls";
import ToolbarControls from "./ToolbarControls";
import TodoControls from "./TodoControls";
import { showToast } from "../../../features/toastSlice";
import { saveSingleComponent } from "../../../features/savedComponentsSlice";
import SaveComponentModal from "../../common/SaveComponentModal";
import { usePageNavigation } from "../../../contexts/PageNavigationContext";
import KanbanAccessControls from "./KanbanAccessControls";
import ShadowControlsPanel from "./ShadowControls";

const iconMap = {
  FLEX_CONTAINER: [
    { icon: FaExpand, tooltip: "Size" },
    { icon: FaArrowsAlt, tooltip: "Spacing" },
    { icon: FaBorderStyle, tooltip: "Border" },
    { icon: FaCloudSun, tooltip: "Shadow" },
    { icon: FaPalette, tooltip: "Background" },
    { icon: FaLayerGroup, tooltip: "Layout" },
    { icon: FaMousePointer, tooltip: "Button Controls" },
  ],
  TEXT: [
    { icon: FaExpand, tooltip: "Size" },
    { icon: FaArrowsAlt, tooltip: "Spacing" },
    { icon: FaBorderStyle, tooltip: "Border" },
    { icon: FaCloudSun, tooltip: "Shadow" },
    { icon: FaPalette, tooltip: "Background" },
    { icon: FaFont, tooltip: "Text Controls" },
  ],
  IMAGE: [
    { icon: FaExpand, tooltip: "Size" },
    { icon: FaArrowsAlt, tooltip: "Spacing" },
    { icon: FaBorderStyle, tooltip: "Border" },
    { icon: FaCloudSun, tooltip: "Shadow" },
    { icon: FaPalette, tooltip: "Background" },
    { icon: FaImage, tooltip: "Image Controls" },
  ],
  CHART: [
    { icon: FaExpand, tooltip: "Size" },
    { icon: FaArrowsAlt, tooltip: "Spacing" },
    { icon: FaBorderStyle, tooltip: "Border" },
    { icon: FaCloudSun, tooltip: "Shadow" },
    { icon: FaPalette, tooltip: "Background" },
    { icon: FaChartBar, tooltip: "Chart Controls" },
    { icon: FaDatabase, tooltip: "Chart Data" },
  ],
  VIDEO: [
    { icon: FaExpand, tooltip: "Size" },
    { icon: FaArrowsAlt, tooltip: "Spacing" },
    { icon: FaBorderStyle, tooltip: "Border" },
    { icon: FaCloudSun, tooltip: "Shadow" },
    { icon: FaPalette, tooltip: "Background" },
    { icon: FaPlay, tooltip: "Video Controls" },
  ],
  WHITEBOARD: [
    { icon: FaExpand, tooltip: "Size" },
    { icon: FaArrowsAlt, tooltip: "Spacing" },
    { icon: FaBorderStyle, tooltip: "Border" },
    { icon: FaCloudSun, tooltip: "Shadow" },
    { icon: FaPalette, tooltip: "Background" },
    { icon: FaPencilAlt, tooltip: "Whiteboard Controls" },
  ],
  QUERY_VALUE: [
    { icon: FaExpand, tooltip: "Size" },
    { icon: FaArrowsAlt, tooltip: "Spacing" },
    { icon: FaBorderStyle, tooltip: "Border" },
    { icon: FaCloudSun, tooltip: "Shadow" },
    { icon: FaPalette, tooltip: "Background" },
    { icon: FaDatabase, tooltip: "Query Controls" },
    { icon: FaFont, tooltip: "Text Controls" },
  ],
  KANBAN: [
    { icon: FaExpand, tooltip: "Size" },
    { icon: FaArrowsAlt, tooltip: "Spacing" },
    { icon: FaBorderStyle, tooltip: "Border" },
    { icon: FaCloudSun, tooltip: "Shadow" },
    { icon: FaClipboardList, tooltip: "Kanban Controls" },
    { icon: FaFont, tooltip: "Text Styling" },
    { icon: FaUserPlus, tooltip: "Manage Access" },
  ],
  TABLE: [
    { icon: FaExpand, tooltip: "Size" },
    { icon: FaArrowsAlt, tooltip: "Spacing" },
    { icon: FaBorderStyle, tooltip: "Border" },
    { icon: FaCloudSun, tooltip: "Shadow" },
    { icon: FaTable, tooltip: "Table Style" },
    { icon: FaDatabase, tooltip: "Table Data" },
    { icon: FaPalette, tooltip: "Background" },
    { icon: FaFont, tooltip: "Text Styling" },
  ],
  TODO: [
    { icon: FaExpand, tooltip: "Size" },
    { icon: FaArrowsAlt, tooltip: "Spacing" },
    { icon: FaBorderStyle, tooltip: "Border" },
    { icon: FaCloudSun, tooltip: "Shadow" },
    { icon: FaPalette, tooltip: "Background" },
    { icon: FaListUl, tooltip: "Todo Controls" },
    { icon: FaFont, tooltip: "Text Controls" },
  ],
};

const FloatingToolbar = ({
  componentId,
  componentType,
  initialPosition,
  onClose,
  style,
  props,
  content,
  onStyleChange,
  onToolbarInteraction,
  component,
  className = "",
}) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.currentUser._id); // Move useSelector here
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeControl, setActiveControl] = useState("Size");
  const [toolbarHeight, setToolbarHeight] = useState("auto");
  const [isMouseDown, setIsMouseDown] = useState(false);
  const toolbarRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(props?.name || componentType);
  const inputRef = useRef(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const { pages } = usePageNavigation();
  const [showInnerShadow, setShowInnerShadow] = useState(false);
  const [showOuterShadow, setShowOuterShadow] = useState(false);

  const activeButtonClass =
    "px-3 py-1 text-sm rounded-full transition-colors duration-200 border bg-[#cce7ff] text-blue-700 border-blue-300";
  const inactiveButtonClass =
    "px-3 py-1 text-sm rounded-full transition-colors duration-200 border bg-white text-blue-600 border-blue-200 hover:bg-[#e6f3ff]";

  useEffect(() => {
    const updateToolbarSize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    updateToolbarSize();
    window.addEventListener("resize", updateToolbarSize);

    return () => window.removeEventListener("resize", updateToolbarSize);
  }, []);

  useEffect(() => {
    if (toolbarRef.current) {
      const toolbarRect = toolbarRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let { x, y } = initialPosition;

      // Ensure the toolbar stays within the viewport
      if (x + toolbarRect.width > viewportWidth) {
        x = viewportWidth - toolbarRect.width;
      }
      if (y + toolbarRect.height > viewportHeight) {
        y = viewportHeight - toolbarRect.height;
      }

      setPosition({ x: Math.max(0, x), y: Math.max(0, y) });
    }
  }, [initialPosition]);

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  useEffect(() => {
    if (activeControl === "Size") {
      setToolbarHeight("auto");
    } else {
      setToolbarHeight("60px");
    }
  }, [activeControl]);

  const handleToolbarInteraction = useCallback(
    (e) => {
      console.log("Toolbar interaction:", e.type);
      e.stopPropagation();
      onToolbarInteraction(e);
    },
    [onToolbarInteraction]
  );

  const handleDoubleClick = useCallback((e) => {
    console.log("Toolbar double click");
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const handleMouseDown = useCallback(
    (e) => {
      if (!isEditing) {
        setIsDragging(true);
        setIsMouseDown(true);
        setDragOffset({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        });
        onToolbarInteraction(e);
      }
    },
    [position, onToolbarInteraction, isEditing]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsMouseDown(false);
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = (e) => {
      if (isMouseDown) {
        handleMouseUp();
        e.stopPropagation();
      }
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isMouseDown, handleMouseUp]);

  useEffect(() => {
    const handleDoubleClickOutside = (event) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("dblclick", handleDoubleClickOutside);
    return () => {
      document.removeEventListener("dblclick", handleDoubleClickOutside);
    };
  }, [onClose]);

  const handleIconClick = (tooltip) => {
    setActiveControl(activeControl === tooltip ? null : tooltip);
  };

  const icons = iconMap[componentType] || [];

  const renderIcons = () => {
    return (
      <div className="flex flex-wrap mb-2 gap-2">
        {icons.map((iconData, index) => (
          <button
            key={index}
            className={buttonClass(activeControl === iconData.tooltip)}
            title={iconData.tooltip}
            onClick={() => handleIconClick(iconData.tooltip)}
          >
            <iconData.icon />
          </button>
        ))}
      </div>
    );
  };

  const handleToggleInnerShadow = useCallback(() => {
    setShowInnerShadow((prev) => !prev);
  }, []);

  const handleToggleOuterShadow = useCallback(() => {
    setShowOuterShadow((prev) => !prev);
  }, []);

  const handleStyleChange = useCallback(
    (updates) => {
      console.log("FloatingToolbar handleStyleChange:", updates);

      // If this is a layout update for FLEX_CONTAINER, update props directly
      if (componentType === "FLEX_CONTAINER" && updates.style) {
        const {
          flexDirection,
          flexWrap,
          alignItems,
          justifyContent,
          alignContent,
          gap,
          borderRadius,
          ...otherStyles
        } = updates.style;

        const propsUpdates = {};
        // Pass flex properties directly to props
        if (flexDirection !== undefined)
          propsUpdates.flexDirection = flexDirection;
        if (flexWrap !== undefined) propsUpdates.flexWrap = flexWrap;
        if (alignItems !== undefined) propsUpdates.alignItems = alignItems;
        if (justifyContent !== undefined)
          propsUpdates.justifyContent = justifyContent;
        if (alignContent !== undefined)
          propsUpdates.alignContent = alignContent;
        if (gap !== undefined) propsUpdates.gap = gap;

        // Move borderRadius to style updates
        if (borderRadius !== undefined) {
          otherStyles.borderRadius = borderRadius;
        }

        // Only include non-empty updates
        const finalUpdates = {};
        if (Object.keys(propsUpdates).length > 0) {
          finalUpdates.props = propsUpdates;
        }
        if (Object.keys(otherStyles).length > 0) {
          finalUpdates.style = otherStyles;
        }

        console.log("Applying flex container updates:", finalUpdates);

        // Don't send empty updates
        if (Object.keys(finalUpdates).length > 0) {
          onStyleChange(finalUpdates);
        }
        return;
      }

      // For non-FLEX_CONTAINER components or non-layout updates
      if (Object.keys(updates).length > 0) {
        onStyleChange({ style: updates });
      }
    },
    [componentType, onStyleChange]
  );

  const renderActiveControl = () => {
    const sharedProps = {
      style,
      props,
      content,
      onStyleChange: handleStyleChange,
      component,
    };

    // Add logging for Button Controls case
    if (activeControl === "Button Controls") {
      console.log("Rendering ButtonControls with props:", {
        ...sharedProps,
        style: {
          ...sharedProps.style,
          enablePageNavigation: sharedProps.style.enablePageNavigation || false,
          targetPageId: sharedProps.style.targetPageId || "",
        },
      });
    }

    switch (activeControl) {
      case "Size":
        return <SizeControls {...sharedProps} componentType={componentType} />;
      case "Spacing":
        return <SpacingControls {...sharedProps} />;
      case "Border":
        return componentType === "KANBAN" ? (
          <BorderControls
            style={props.columnBorderStyle || {}}
            onStyleChange={(updates) =>
              onStyleChange({ props: { ...props, columnBorderStyle: updates } })
            }
          />
        ) : (
          <BorderControls {...sharedProps} />
        );
      case "Background":
        return <BackgroundControls {...sharedProps} />;
      case "Text Controls":
        return componentType === "TEXT" ? (
          <TextControls {...sharedProps} />
        ) : (
          <BasicTextControls {...sharedProps} />
        );
      case "Image Controls":
        return (
          <ImageControls
            {...sharedProps}
            component={component}
            onStyleChange={(updates) => {
              onStyleChange({
                ...updates,
                style: {
                  ...style,
                  ...(updates.style || {}),
                },
                props: {
                  ...props,
                  ...(updates.props || {}),
                },
              });
            }}
          />
        );
      case "Layout":
        return (
          <LayoutControls
            style={style}
            props={props}
            onStyleChange={handleStyleChange}
          />
        );
      case "Chart Controls":
        return <ChartControls {...sharedProps} />;
      case "Chart Data":
        return <ChartDataControls {...sharedProps} />;
      case "Video Controls":
        return <VideoControls {...sharedProps} />;
      case "Whiteboard Controls":
        return <WhiteboardControls {...sharedProps} />;
      case "Button Controls":
        return (
          <ButtonControls
            {...sharedProps}
            style={{
              ...sharedProps.style,
              enablePageNavigation:
                sharedProps.style.enablePageNavigation || false,
              targetPageId: sharedProps.style.targetPageId || "",
            }}
            pages={pages}
            onStyleChange={(updates) => {
              console.log("FloatingToolbar - Style updates received:", updates);
              console.log("FloatingToolbar - Current component style:", style);

              const updatedStyle = {
                ...style,
                ...updates,
              };

              console.log(
                "FloatingToolbar - Final style to be applied:",
                updatedStyle
              );
              onStyleChange({ style: updatedStyle });
            }}
          />
        );
      case "Query Controls":
        return <QueryValueControls {...sharedProps} />;
      case "Kanban Controls":
        return <KanbanControls {...sharedProps} />;
      case "Text Styling": // Changed from 'Header Text' to 'Text Styling'
        return componentType === "KANBAN" ? (
          <div>
            <BasicTextControls
              {...sharedProps}
              style={props.columnHeaderStyle || {}}
              onStyleChange={(updates) =>
                onStyleChange({
                  props: { ...props, columnHeaderStyle: updates },
                })
              }
              label="Column Header Text"
            />
            <BasicTextControls
              {...sharedProps}
              style={props.taskTextStyle || {}}
              onStyleChange={(updates) =>
                onStyleChange({ props: { ...props, taskTextStyle: updates } })
              }
              label="Task Text"
            />
          </div>
        ) : null;
      case "Color Theme":
        return <ColorThemeControls />;
      case "Table Style":
        return <TableControls {...sharedProps} />;
      case "Table Data":
        return <TableDataControls {...sharedProps} />;
      case "Toolbar Settings":
        return <ToolbarControls {...sharedProps} />;
      case "Todo Controls":
        return <TodoControls {...sharedProps} />;
      case "Manage Access":
        return (
          <KanbanAccessControls
            props={props}
            onClose={() => setActiveControl(null)}
          />
        );
      case "Shadow":
        return (
          <div>
            <ShadowControlsPanel
              onStyleChange={onStyleChange}
              showInnerShadow={showInnerShadow}
              showOuterShadow={showOuterShadow}
              onToggleInnerShadow={handleToggleInnerShadow}
              onToggleOuterShadow={handleToggleOuterShadow}
              style={style}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const buttonClass = (isActive) => `
    p-2 rounded-full
    ${
      isActive
        ? "bg-[#cce7ff] text-blue-600 border border-blue-300"
        : "hover:bg-[#d9ecff] border border-transparent"
    }
  `;

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleRename = () => {
    if (
      editedName.trim() !== "" &&
      editedName !== (props.name || componentType)
    ) {
      dispatch(
        renameComponent({ id: componentId, newName: editedName.trim() })
      );
      onStyleChange({ props: { ...props, name: editedName.trim() } });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setEditedName(props.name || componentType);
      setIsEditing(false);
    }
    e.stopPropagation(); // Prevent dragging when typing
  };

  const handleSaveComponent = (e) => {
    e.stopPropagation();
    setIsSaveModalOpen(true);
  };

  const handleSaveConfirm = ({ name, description }) => {
    const uniqueId = `${componentType}_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const processComponent = (comp) => {
      const baseComponent = {
        id: `${comp.type}_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        type: comp.type,
        style: comp.style || {},
        props: comp.props || {},
        content: content || {},
        name: name,
        description: description,
      };

      if (comp.children && Array.isArray(comp.children)) {
        baseComponent.children = comp.children.map((child) =>
          processComponent(child)
        );
      }

      return baseComponent;
    };

    const componentToSave = processComponent({
      type: componentType,
      style: style || {},
      props: props || {},
      content: content || {},
      children: component?.children || [],
    });

    componentToSave.createdBy = userId;

    dispatch(saveSingleComponent(componentToSave))
      .unwrap()
      .then(() => {
        dispatch(
          showToast({
            message: "Component saved to palette successfully!",
            type: "success",
          })
        );
      })
      .catch((error) => {
        dispatch(
          showToast({
            message: "Failed to save component: " + error.message,
            type: "error",
          })
        );
      });
  };

  const detectExistingShadows = useCallback((boxShadow) => {
    if (!boxShadow || boxShadow === "none")
      return { inner: false, outer: false };

    const shadows = boxShadow.split(/,(?![^(]*\))/g).map((s) => s.trim());
    const result = {
      inner: shadows.some((s) => s.includes("inset")),
      outer: shadows.some((s) => !s.includes("inset")),
    };
    return result;
  }, []);

  useEffect(() => {
    if (style?.boxShadow) {
      const { inner, outer } = detectExistingShadows(style.boxShadow);
      setShowInnerShadow(inner);
      setShowOuterShadow(outer);
    }
  }, []);

  useEffect(() => {
    if (activeControl === "Shadow" && style?.boxShadow) {
      const { inner, outer } = detectExistingShadows(style.boxShadow);
      setShowInnerShadow(inner);
      setShowOuterShadow(outer);
    }
  }, [activeControl, style?.boxShadow, detectExistingShadows]);

  return (
    <>
      <div
        ref={toolbarRef}
        className={`fixed z-[940] bg-[#f0f7ff] border border-[#cce0ff] rounded-lg shadow-xl w-[280px] flex flex-col group select-none floating-toolbar ${className}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          maxHeight: "95vh",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
          transform: "scale(0.8)",
          transformOrigin: "top left", // Add this line
        }}
        onClick={handleToolbarInteraction}
        onDoubleClick={handleDoubleClick}
      >
        <div
          className={`h-6 ${
            isEditing ? "" : "cursor-move"
          } bg-[#e1f0ff] rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
          onMouseDown={handleMouseDown}
        />
        <div className="px-4 pt-1 pb-3">
          <div
            className={`flex items-center mb-3 ${
              isEditing ? "" : "cursor-move"
            }`}
            onMouseDown={handleMouseDown}
          >
            <div className="flex-grow mr-2 min-w-0">
              {componentType === "TOOLBAR" ? (
                <h3 className="text-lg font-semibold text-gray-500 truncate">
                  Toolbar Settings
                </h3>
              ) : isEditing ? (
                <input
                  ref={inputRef}
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={handleRename}
                  onKeyDown={handleKeyDown}
                  className="text-lg font-semibold text-gray-500 bg-white border border-gray-300 rounded px-1 py-0 w-full select-text"
                  style={{
                    userSelect: "text",
                    WebkitUserSelect: "text",
                    MozUserSelect: "text",
                    msUserSelect: "text",
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <h3
                  className="text-lg font-semibold text-gray-500 cursor-text truncate"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  title={props?.name || componentType}
                >
                  {props?.name || componentType}
                </h3>
              )}
            </div>
            <div className="flex-shrink-0 flex items-center">
              {componentType !== "TOOLBAR" && (
                <button
                  onClick={handleSaveComponent}
                  className="mr-2 text-gray-500 hover:text-blue-600"
                  title="Save Component"
                >
                  <FaSave />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-blue-600"
                title="Close"
              >
                <FaTimes />
              </button>
            </div>
          </div>
          {renderIcons()}
        </div>
        <div className="border-t border-[#cce0ff] flex-grow overflow-hidden flex flex-col">
          <div className="p-4 overflow-y-auto flex-grow">
            <div className="transform scale-[0.9] origin-top-left">
              {renderActiveControl()}
            </div>
          </div>
        </div>
      </div>
      <SaveComponentModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveConfirm}
        defaultName={props?.name || componentType}
      />
    </>
  );
};

export default FloatingToolbar;
