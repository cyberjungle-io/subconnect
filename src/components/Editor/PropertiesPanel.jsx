import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import ReChartProperties from "../Components/ReCharts/ReChartProperties";
import ChartStyleOptions from "../Components/ReCharts/ChartStyleOptions";
import HeadingProperties from "../Components/Typography/HeadingProperties";
import PropertyTabs from "./PropertyTabs";
import ComponentPalette from "../Components/ComponentPalette";
import {
  FaThLarge,
  FaArrowAltCircleRight,
  FaChevronLeft,
  FaCog,
} from "react-icons/fa";
import HidePropertiesPanelArrow from '../common/CustomIcons/HidePropertiesPanelArrow';
import DimensionControls from "../Components/CommonControls/DimensionControls";
import { updateGlobalSettings } from '../../features/editorSlice';

const PropertiesPanel = ({
  selectedComponent,
  onUpdateComponent,
  onDeleteComponent,
  isVisible,
  onToggleVisibility,
}) => {
  const dispatch = useDispatch();
  const globalSettings = useSelector(state => state.editor.globalSettings);
  const [showComponentPalette, setShowComponentPalette] = useState(false);
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  useEffect(() => {
    if (selectedComponent) {
      setShowComponentPalette(false);
      setShowGlobalSettings(false);
    }
  }, [selectedComponent]);

const toggleButton = (
    <button
      onClick={onToggleVisibility}
      className="text-gray-700 hover:bg-gray-300 p-2 rounded-full focus:outline-none transition-colors duration-200"
      title="Hide Panel"
    >
      <HidePropertiesPanelArrow className="w-5 h-5" />
    </button>
  );

  const showComponentPaletteButton = (
    <button
      onClick={() => setShowComponentPalette(true)}
      className="text-gray-700 hover:bg-gray-300 p-2 rounded-full focus:outline-none transition-colors duration-200"
      title="Show Component Palette"
    >
      <FaThLarge />
    </button>
  );
  const showGlobalSettingsButton = (
    <button
      onClick={() => setShowGlobalSettings(true)}
      className="text-gray-700 hover:bg-gray-300 p-2 rounded-full focus:outline-none transition-colors duration-200"
      title="Show Global Settings"
    >
      <FaCog />
    </button>
  );
const handleGlobalSettingChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateGlobalSettings({ [name]: value }));
  };

  const renderGlobalSettings = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Global Settings</h3>
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
      {/* Add more global settings here as needed */}
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
  if (showGlobalSettings) {
    return (
      <div className="w-64 bg-gray-200 p-4 overflow-y-auto relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Global Settings</h2>
          <div className="flex space-x-2">
            {showComponentPaletteButton}
            {toggleButton}
          </div>
        </div>
        {renderGlobalSettings()}
      </div>
    );
  }
 if (!selectedComponent || showComponentPalette) {
    return (
      <div className="w-64 bg-gray-200 p-4 overflow-y-auto relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Components</h2>
          {toggleButton}
        </div>
        <ComponentPalette />
      </div>
    );
  }
  

 

  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdateComponent(selectedComponent.id, { [name]: value });
  };

  const handleStyleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Style change: ${name} = ${value}`); // Debug log
    const newStyle = { ...selectedComponent.style, [name]: value };
    console.log('New style:', newStyle); // Debug log
    onUpdateComponent(selectedComponent.id, { style: newStyle });
  };

  const handleChartConfigChange = (e) => {
    const { name, value } = e.target;
    onUpdateComponent(selectedComponent.id, {
      chartConfig: {
        ...selectedComponent.chartConfig,
        [name]: name === "data" ? JSON.parse(value) : value,
      },
    });
  };

  const handlePropChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    console.log(`Updating ${name} to ${newValue}`); // Debug log
    onUpdateComponent(selectedComponent.id, {
      props: { ...selectedComponent.props, [name]: newValue },
    });
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Properties</h2>
        <div className="flex space-x-2">
          {showComponentPaletteButton}
          {showGlobalSettingsButton}
          {toggleButton}
        </div>
      </div>
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
