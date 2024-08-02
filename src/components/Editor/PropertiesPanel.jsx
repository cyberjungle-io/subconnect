import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaChevronLeft } from "react-icons/fa";
import PropertyTabs from "./PropertyTabs";
import ComponentPalette from "../Components/ComponentPalette";
import DimensionControls from "../Components/CommonControls/DimensionControls";
import SpacingControls from "../Components/CommonControls/SpacingControls";
import SpacingPreview from "../Components/CommonControls/SpacingPreview";
import HeadingControls from "../Components/CommonControls/HeadingControls";
import PanelNavBar from "./PanelNavBar";
import ComponentTree from "./ComponentTree";
import { updateGlobalSettings, updateComponent } from "../../features/editorSlice";

const PropertiesPanel = ({
  selectedComponent,
  onUpdateComponent,
  onDeleteComponent,
  isVisible,
  onToggleVisibility,
  components,
  onSelectComponent,
  onOpenDataModal,
  onOpenProjectModal,
  onUpdateGlobalSpacing,
}) => {
  const dispatch = useDispatch();
  const globalSettings = useSelector((state) => state.editor.globalSettings);
  const [activePanel, setActivePanel] = useState("properties");
  const [isComponentTreeVisible, setIsComponentTreeVisible] = useState(false);

  useEffect(() => {
    if (selectedComponent) {
      setActivePanel("properties");
    }
  }, [selectedComponent]);

  const handleRenameComponent = (id, newName) => {
    dispatch(updateComponent({ id, updates: { name: newName } }));
  };
  
  const handlePropChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    onUpdateComponent(selectedComponent.id, {
      props: { ...selectedComponent.props, [name]: newValue },
    });
  };

  const handleStyleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'spacingPreset' || name === 'paddingBulk' || name === 'marginBulk') {
      onUpdateComponent(selectedComponent.id, {
        style: { ...selectedComponent.style, ...value },
      });
    } else {
      onUpdateComponent(selectedComponent.id, {
        style: { ...selectedComponent.style, [name]: value },
      });
    }
  };

  const handleGlobalStyleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'spacingPreset' || name === 'paddingBulk' || name === 'marginBulk') {
      onUpdateGlobalSpacing(value);
    } else {
      dispatch(updateGlobalSettings({
        style: { ...globalSettings.style, [name]: value },
      }));
    }
  };
  const handleOpenProjectModal = () => {
    console.log("PropertiesPanel: Attempting to open Project Modal");
    onOpenProjectModal();
  };
  const handleSpacingPreviewUpdate = (property, value) => {
    if (selectedComponent) {
      onUpdateComponent(selectedComponent.id, {
        style: { ...selectedComponent.style, [property]: value },
      });
    } else {
      dispatch(updateGlobalSettings({
        style: { ...globalSettings.style, [property]: value },
      }));
    }
  };

  const handleGlobalSettingChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateGlobalSettings({ [name]: value }));
  };

  const renderGlobalSettings = () => (
    <PropertyTabs tabs={["Layout", "Canvas"]}>
      {renderLayoutTab(globalSettings.style, handleGlobalStyleChange, true)}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Background Color
          </label>
          <input
            type="color"
            name="backgroundColor"
            value={globalSettings.backgroundColor}
            onChange={handleGlobalSettingChange}
            className="block w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Component Layout
          </label>
          <select
            name="componentLayout"
            value={globalSettings.componentLayout}
            onChange={handleGlobalSettingChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="vertical">Vertical (Side by Side)</option>
            <option value="horizontal">Horizontal (One Below Another)</option>
          </select>
        </div>
      </div>
    </PropertyTabs>
  );

  const renderLayoutTab = (style, onStyleChange, isGlobal = false) => (
    <div className="space-y-6">
      <SpacingPreview
        padding={{
          paddingTop: style.paddingTop,
          paddingRight: style.paddingRight,
          paddingBottom: style.paddingBottom,
          paddingLeft: style.paddingLeft,
        }}
        margin={{
          marginTop: style.marginTop,
          marginRight: style.marginRight,
          marginBottom: style.marginBottom,
          marginLeft: style.marginLeft,
        }}
        dimensions={{
          width: style.width,
          height: style.height,
        }}
        onUpdate={handleSpacingPreviewUpdate}
      />
      <DimensionControls
        style={style}
        onStyleChange={onStyleChange}
      />
      <SpacingControls
        style={style}
        onStyleChange={onStyleChange}
        availableControls={isGlobal ? ["padding", "margin", "gap"] : ["margin", "padding"]}
      />
    </div>
  );

  const renderComponentSpecificTab = () => {
    if (!selectedComponent) return null;

    switch (selectedComponent.type) {
      case "FLEX_CONTAINER":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Direction</label>
              <select
                name="direction"
                value={selectedComponent.props.direction || "row"}
                onChange={handlePropChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="row">Row</option>
                <option value="column">Column</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Wrap</label>
              <select
                name="wrap"
                value={selectedComponent.props.wrap || "nowrap"}
                onChange={handlePropChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="nowrap">No Wrap</option>
                <option value="wrap">Wrap</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Align Items</label>
              <select
                name="alignItems"
                value={selectedComponent.props.alignItems || "stretch"}
                onChange={handlePropChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="stretch">Stretch</option>
                <option value="flex-start">Start</option>
                <option value="center">Center</option>
                <option value="flex-end">End</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Justify Content</label>
              <select
                name="justifyContent"
                value={selectedComponent.props.justifyContent || "flex-start"}
                onChange={handlePropChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="flex-start">Start</option>
                <option value="center">Center</option>
                <option value="flex-end">End</option>
                <option value="space-between">Space Between</option>
                <option value="space-around">Space Around</option>
              </select>
            </div>
          </div>
        );
      case "HEADING":
        return (
          <HeadingControls
            component={selectedComponent}
            onUpdate={(updates) => onUpdateComponent(selectedComponent.id, updates)}
          />
        );
      // Add cases for other component types as needed
      default:
        return (
          <div className="text-gray-500 italic">
            No specific properties for this component type.
          </div>
        );
    }
  };

  const renderComponentProperties = () => {
    if (!selectedComponent) return null;

    const componentName = selectedComponent.type.charAt(0).toUpperCase() + selectedComponent.type.slice(1).toLowerCase();

    return (
      <PropertyTabs tabs={["Layout", componentName]}>
        {renderLayoutTab(selectedComponent.style, handleStyleChange)}
        {renderComponentSpecificTab()}
      </PropertyTabs>
    );
  };

  const renderPanelContent = () => {
    switch (activePanel) {
      case "globalSettings":
        return renderGlobalSettings();
      case "componentPalette":
        return <ComponentPalette />;
      case "properties":
        return selectedComponent ? renderComponentProperties() : <ComponentPalette />;
      default:
        return null;
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggleVisibility}
        className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-l-md shadow-md"
        title="Show Panel"
      >
        <FaChevronLeft />
      </button>
    );
  }

  return (
    <div className="w-64 bg-gray-200 p-4 overflow-y-auto relative">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        {activePanel === "globalSettings" ? "Global Settings" : "Properties"}
      </h2>
      <PanelNavBar
        onShowComponentPalette={() => setActivePanel("componentPalette")}
        onShowGlobalSettings={() => setActivePanel("globalSettings")}
        onShowComponentTree={() => setIsComponentTreeVisible(!isComponentTreeVisible)}
        onOpenDataModal={onOpenDataModal}
        onOpenProjectModal={onOpenProjectModal}
        onToggleVisibility={onToggleVisibility}
        activePanel={activePanel}
        isComponentTreeVisible={isComponentTreeVisible}
      />
      {isComponentTreeVisible && (
        <div className="mb-4 border-b border-gray-300 pb-4">
          <ComponentTree
            components={components}
            onSelectComponent={onSelectComponent}
            selectedComponentId={selectedComponent?.id}
            onRenameComponent={handleRenameComponent}
          />
        </div>
      )}
      <div className="flex-grow overflow-y-auto">
        {renderPanelContent()}
      </div>
    </div>
  );
};

export default PropertiesPanel;