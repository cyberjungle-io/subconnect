import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropertyTabs from "./PropertyTabs";
import ComponentPalette from "../Components/ComponentPalette";
import { FaChevronLeft } from "react-icons/fa";
import DimensionControls from "../Components/CommonControls/DimensionControls";
import { updateGlobalSettings } from "../../features/editorSlice";
import PanelNavBar from "./PanelNavBar";

const PropertiesPanel = ({
  selectedComponent,
  onUpdateComponent,
  onDeleteComponent,
  isVisible,
  onToggleVisibility,
}) => {
  const dispatch = useDispatch();
  const globalSettings = useSelector((state) => state.editor.globalSettings);
  const [activePanel, setActivePanel] = useState("properties");
  useEffect(() => {
    if (selectedComponent) {
      setActivePanel("properties");
    }
  }, [selectedComponent]);

  const handleShowComponentPalette = () => setActivePanel("componentPalette");
  const handleShowGlobalSettings = () => setActivePanel("globalSettings");

  const handlePropChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    onUpdateComponent(selectedComponent.id, {
      props: { ...selectedComponent.props, [name]: newValue },
    });
  };

  const handleGlobalSettingChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateGlobalSettings({ [name]: value }));
  };

  const renderGlobalSettings = () => (
    <div className="space-y-4">
      <PanelNavBar
        onShowComponentPalette={handleShowComponentPalette}
        onShowGlobalSettings={handleShowGlobalSettings}
        onToggleVisibility={onToggleVisibility}
        activePanel={activePanel}
      />
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
  );

  if (!isVisible) {
    return (
      <button
        onClick={onToggleVisibility}
        className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-700 p-2 rounded-l-md hover:bg-gray-300 focus:outline-none transition-colors duration-200"
        title="Show Panel"
      >
        <FaChevronLeft />
      </button>
    );
  }

  if (activePanel === "globalSettings") {
    return (
      <div className="w-64 bg-gray-200 p-4 overflow-y-auto relative">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Global Settings
        </h2>
        {renderGlobalSettings()}
      </div>
    );
  }
  if (!selectedComponent) {
    return (
      <div className="w-64 bg-gray-200 p-4 overflow-y-auto relative">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Components</h2>
        <PanelNavBar
          onShowComponentPalette={handleShowComponentPalette}
          onShowGlobalSettings={handleShowGlobalSettings}
          onToggleVisibility={onToggleVisibility}
          activePanel={activePanel}
        />
        <ComponentPalette />
      </div>
    );
  }

  const handleStyleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Style change: ${name} = ${value}`); // Debug log
    const newStyle = { ...selectedComponent.style, [name]: value };
    console.log("New style:", newStyle); // Debug log
    onUpdateComponent(selectedComponent.id, { style: newStyle });
  };


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
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gap
                </label>
                <input
                  type="text"
                  name="gap"
                  value={selectedComponent.props.gap || "0px"}
                  onChange={handlePropChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="space-y-6">
              <DimensionControls
                style={selectedComponent.style}
                onStyleChange={handleStyleChange}
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
          </PropertyTabs>
        );
    }
  };

  return (
    <div className="w-64 bg-gray-200 p-4 overflow-y-auto relative">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Properties</h2>
      <PanelNavBar
        onShowComponentPalette={handleShowComponentPalette}
        onShowGlobalSettings={handleShowGlobalSettings}
        onToggleVisibility={onToggleVisibility}
        activePanel={activePanel}
      />
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <input
            type="text"
            value={selectedComponent.type}
            disabled
            className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        {renderComponentProperties()}

        <button
          onClick={() => onDeleteComponent(selectedComponent.id)}
          className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Delete Component
        </button>
      </div>
    </div>
  );
};

export default PropertiesPanel;
