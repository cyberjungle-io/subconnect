import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaChevronLeft, FaChevronDown, FaChevronRight } from "react-icons/fa";
import PropertyTabs from "./PropertyTabs";
import ComponentPalette from "../Components/ComponentPalette";
import DimensionControls from "../Components/CommonControls/DimensionControls";
import SpacingControls from "../Components/CommonControls/SpacingControls";
import SpacingPreview from "../Components/CommonControls/SpacingPreview";
import HeadingControls from "../Components/CommonControls/HeadingControls";
import WhiteboardControls from "../Components/CommonControls/WhiteboardControls";
import TextControls from "../Components/CommonControls/TextControls";
import VideoControls from "../Components/CommonControls/VideoControls";
import PanelNavBar from "./PanelNavBar";
import ComponentTree from "./ComponentTree";
import { updateGlobalSettings, updateComponent, setEditorMode } from "../../features/editorSlice";
import { updateProject, updateCurrentProject } from '../../w3s/w3sSlice';
import PageList from '../Components/Projects/PageList';
import HidePropertiesPanelArrow from '../common/CustomIcons/HidePropertiesPanelArrow';
import FlexContainerControls from "../Components/CommonControls/FlexContainerControls";
import { showToast, hideToast } from '../../features/toastSlice';
import Toast from '../common/Toast';
import ImageControls from "../Components/CommonControls/ImageControls";
import ReChartControls from '../Components/CommonControls/ReChartControls';
import ComponentControls from "../Components/CommonControls/ComponentControls";

// Import the CSS file
import '../../styleSheets/propertiesPanelStyles.css';

const defaultGlobalSettings = {
  generalComponentStyle: {
    fontSize: '16px',
    color: '#000000',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
  }
};

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
  currentProject,
  onSelectPage,
  onDeletePage,
  globalSettings = defaultGlobalSettings,
  onUpdateGlobalSettings,
}) => {
  const dispatch = useDispatch();
  const { mode, currentPage } = useSelector((state) => state.editor);
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

  const toggleMode = () => {
    dispatch(setEditorMode(mode === 'edit' ? 'view' : 'edit'));
  };

  const handleShowComponentPalette = () => {
    setActivePanel("componentPalette");
    onSelectComponent(null);  // Clear the selected component
  };

  const renderGlobalSettings = () => {
    const generalComponentStyle = globalSettings?.generalComponentStyle || defaultGlobalSettings.generalComponentStyle;

    return (
      <div className="global-settings">
        <h3>Global Settings</h3>
        <div className="control-container">
          <label htmlFor="globalBorderRadius">Default Border Radius</label>
          <div className="properties-input-container">
            <input
              id="globalBorderRadius"
              type="number"
              className="properties-input"
              value={(generalComponentStyle.borderRadius || '4px').replace('px', '')}
              onChange={(e) => onUpdateGlobalSettings({
                generalComponentStyle: {
                  ...generalComponentStyle,
                  borderRadius: `${e.target.value}px`
                }
              })}
            />
            <div className="properties-select-wrapper">
              <select className="properties-select" value="px" readOnly>
                <option value="px">px</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          <>
            <FlexContainerControls
              component={selectedComponent}
              onUpdate={(updates) => onUpdateComponent(selectedComponent.id, updates)}
            />
            <ComponentControls
              style={selectedComponent.style}
              onStyleChange={handleStyleChange}
              componentId={selectedComponent.id}
              dispatch={dispatch}
            />
          </>
        );
      case "HEADING":
        return (
          <HeadingControls
            component={selectedComponent}
            onUpdate={(updates) => onUpdateComponent(selectedComponent.id, updates)}
          />
        );
      case "WHITEBOARD":
        return (
          <WhiteboardControls
            component={selectedComponent}
            onUpdate={(updates) => onUpdateComponent(selectedComponent.id, updates)}
          />
        );
      case "TEXT":
        return (
          <TextControls
            component={selectedComponent}
            onUpdate={(updates) => onUpdateComponent(selectedComponent.id, updates)}
          />
        );
      case "VIDEO":
        return (
          <VideoControls
            component={selectedComponent}
            onUpdate={(updates) => onUpdateComponent(selectedComponent.id, updates)}
          />
        );
      case "IMAGE":
        return (
          <ImageControls
            component={selectedComponent}
            updateComponent={(updates) => onUpdateComponent(selectedComponent.id, updates)}
          />
        );
      case "CHART":
        return (
          <ReChartControls
            component={selectedComponent}
            onUpdate={(updates) => onUpdateComponent(selectedComponent.id, updates)}
          />
        );
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
        className="properties-panel-toggle"
        title="Show Panel"
      >
        <FaChevronLeft />
      </button>
    );
  }

  return (
    <div className="properties-panel">
      <div className="properties-panel-header">
        <div className="properties-panel-title-container">
          <h2 className="properties-panel-title ">
            {activePanel === "globalSettings" ? "Global Settings" : "Properties"}
          </h2>
        </div>
        <div className="properties-panel-buttons-container ">
          <button
            onClick={onToggleVisibility}
            className="panel-button"
            title="Hide Panel"
          >
            <HidePropertiesPanelArrow />
          </button>
        </div>
      </div>
      <PanelNavBar
        onShowComponentPalette={handleShowComponentPalette}
        onShowGlobalSettings={() => setActivePanel("globalSettings")}
        onShowComponentTree={() => setIsComponentTreeVisible(!isComponentTreeVisible)}
        onOpenDataModal={onOpenDataModal}
        onOpenProjectModal={onOpenProjectModal}
        activePanel={activePanel}
        isComponentTreeVisible={isComponentTreeVisible}
      />
      {isComponentTreeVisible && (
        <div className="component-tree-container">
          <ComponentTree
            components={components}
            onSelectComponent={onSelectComponent}
            selectedComponentId={selectedComponent?.id}
            onRenameComponent={handleRenameComponent}
          />
        </div>
      )}
      <div className="panel-content">
        {renderPanelContent()}
      </div>
      <Toast />
    </div>
  );
};

export default PropertiesPanel;