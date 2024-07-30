import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropertyTabs from "./PropertyTabs";
import ComponentPalette from "../Components/ComponentPalette";
import { FaChevronLeft } from "react-icons/fa";
import DimensionControls from "../Components/CommonControls/DimensionControls";
import { updateGlobalSettings, updateComponent } from "../../features/editorSlice";
import PanelNavBar from "./PanelNavBar";
import ComponentTree from "./ComponentTree";
import SpacingControls from "../Components/CommonControls/SpacingControls";

const PropertiesPanel = ({
  selectedComponent,
  onUpdateComponent,
  onDeleteComponent,
  isVisible,
  onToggleVisibility,
  components,
  onSelectComponent,
  onOpenDataModal,
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
      // Apply all spacing updates at once
      onUpdateComponent(selectedComponent.id, {
        style: { ...selectedComponent.style, ...value },
      });
    } else {
      // Handle individual style property changes
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

  const handleGlobalSettingChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateGlobalSettings({ [name]: value }));
  };

  const renderGlobalSettings = () => (
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
      <SpacingControls
  style={globalSettings.style || {}}
  onStyleChange={handleGlobalStyleChange}
  availableControls={["padding", "margin", "gap"]}
/>
    </div>
  );

  const renderComponentProperties = () => {
    switch (selectedComponent.type) {
      case "FLEX_CONTAINER":
        return (
          <PropertyTabs tabs={["Layout", "Styles"]}>
            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Direction
                </label>
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
                <label className="block text-sm font-medium text-gray-700">
                  Wrap
                </label>
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
                <label className="block text-sm font-medium text-gray-700">
                  Align Items
                </label>
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
                <label className="block text-sm font-medium text-gray-700">
                  Justify Content
                </label>
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
            <div className="space-y-6">
              <DimensionControls
                style={selectedComponent.style}
                onStyleChange={handleStyleChange}
              />
              <SpacingControls
                style={selectedComponent.style}
                onStyleChange={handleStyleChange}
                availableControls={["padding", "margin", "gap"]}
              />
            </div>
          </PropertyTabs>
        );
      case "HEADING":
      case "TEXT":
        return (
          <PropertyTabs tabs={["Styles"]}>
            <div className="space-y-6">
              <DimensionControls
                style={selectedComponent.style}
                onStyleChange={handleStyleChange}
              />
              <SpacingControls
                style={selectedComponent.style}
                onStyleChange={handleStyleChange}
                availableControls={["margin"]}
              />
            </div>
          </PropertyTabs>
        );
      case "IMAGE":
      case "BUTTON":
        return (
          <PropertyTabs tabs={["Styles"]}>
            <div className="space-y-6">
              <DimensionControls
                style={selectedComponent.style}
                onStyleChange={handleStyleChange}
              />
              <SpacingControls
                style={selectedComponent.style}
                onStyleChange={handleStyleChange}
                availableControls={["margin", "padding"]}
              />
            </div>
          </PropertyTabs>
        );
      case "CHART":
        return (
          <PropertyTabs tabs={["Chart Settings", "Styles", "Spacing"]}>
            <div>{/* Add chart-specific settings controls here */}</div>
            <div className="space-y-6">
              <DimensionControls
                style={selectedComponent.style}
                onStyleChange={handleStyleChange}
              />
            </div>
            <div className="space-y-6">
              <SpacingControls
                style={selectedComponent.style}
                onStyleChange={handleStyleChange}
                availableControls={["margin", "padding"]}
              />
            </div>
          </PropertyTabs>
        );
      default:
        return (
          <PropertyTabs tabs={["Styles"]}>
            <DimensionControls
              style={selectedComponent.style}
              onStyleChange={handleStyleChange}
            />
            <SpacingControls
              style={selectedComponent.style}
              onStyleChange={handleStyleChange}
              availableControls={["margin", "padding"]}
            />
          </PropertyTabs>
        );
    }
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
