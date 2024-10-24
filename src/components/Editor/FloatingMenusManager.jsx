import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaTools } from 'react-icons/fa';
import FloatingRightMenu from './FloatingRightMenu';
import ComponentTree from './ComponentTree';
import ComponentPalette from '../Components/ComponentPalette';
import FloatingGlobalSettings from './FloatingGlobalSettings';
import FloatingToolbar from '../Components/Tools/FloatingToolbar';
import { 
  setSelectedIds, 
  updateCanvasSettings, 
  setDragModeEnabled, 
  updateGlobalSettings,
  updateToolbarSettings
} from '../../features/editorSlice';
import { toggleFloatingMenu } from '../../features/editorSlice';

const FloatingMenusManager = () => {
  const dispatch = useDispatch();
  const { components, selectedIds, mode, isDragModeEnabled, globalSettings, isFloatingMenuVisible } = useSelector(state => state.editor);
  const toolbarSettings = useSelector(state => state.editor.toolbarSettings) || {};

  const canvasSettings = useSelector(state => state.editor.canvasSettings);

  const [isComponentTreeVisible, setIsComponentTreeVisible] = useState(false);
  const [componentTreePosition, setComponentTreePosition] = useState({ x: 0, y: 0 });
  const [isComponentPaletteVisible, setIsComponentPaletteVisible] = useState(false);
  const [componentPalettePosition, setComponentPalettePosition] = useState({ x: 0, y: 0 });
  const [isGlobalSettingsVisible, setIsGlobalSettingsVisible] = useState(false);
  const [globalSettingsPosition, setGlobalSettingsPosition] = useState({ x: 0, y: 0 });
  const [isCanvasSettingsVisible, setIsCanvasSettingsVisible] = useState(false);
  const [canvasToolbarPosition, setCanvasToolbarPosition] = useState({ x: 100, y: 100 });

  const floatingRightMenuRef = useRef(null);

  const [isRightMenuVisible, setIsRightMenuVisible] = useState(false);

  const handleToggleComponentTree = useCallback(() => {
    if (mode === 'edit') {
      setIsComponentTreeVisible(prev => !prev);
    }
  }, [mode]);

  const handleToggleComponentPalette = useCallback(() => {
    if (mode === 'edit') {
      setIsComponentPaletteVisible(prev => !prev);
    }
  }, [mode]);

  const handleToggleGlobalSettings = useCallback(() => {
    if (mode === 'edit') {
      setIsGlobalSettingsVisible(prev => !prev);
    }
  }, [mode]);

  const handleToggleDragMode = useCallback(() => {
    if (mode === 'edit') {
      dispatch(setDragModeEnabled(!isDragModeEnabled));
    }
  }, [mode, isDragModeEnabled, dispatch]);

  const handleShowCanvasSettings = useCallback(() => {
    if (mode === 'edit') {
      setIsCanvasSettingsVisible(true);
    }
  }, [mode]);

  const handleCloseCanvasSettings = useCallback(() => {
    setIsCanvasSettingsVisible(false);
  }, []);

  const handleUpdateCanvasSettings = useCallback((updates) => {
    dispatch(updateCanvasSettings(updates));
  }, [dispatch]);

  const handleUpdateGlobalSettings = useCallback((updates) => {
    dispatch(updateGlobalSettings(updates));
  }, [dispatch]);

  // Implement hotkeys
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (mode === 'edit' && (event.ctrlKey || event.metaKey)) {
        switch (event.key.toLowerCase()) {
          case 'q':
            event.preventDefault();
            handleToggleComponentPalette();
            break;
          case 'e':
            event.preventDefault();
            handleToggleComponentTree();
            break;
          // Add more hotkeys here if needed
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mode, handleToggleComponentPalette, handleToggleComponentTree]);

  const handleToggleFloatingMenu = () => {
    setIsRightMenuVisible(prev => !prev);
  };

  if (mode !== 'edit') {
    return null;
  }

  return (
    <>
      {isRightMenuVisible && (
        <FloatingRightMenu
          ref={floatingRightMenuRef}
          onShowComponentTree={handleToggleComponentTree}
          isComponentTreeVisible={isComponentTreeVisible}
          onShowComponentPalette={handleToggleComponentPalette}
          isComponentPaletteVisible={isComponentPaletteVisible}
          onShowGlobalSettings={handleToggleGlobalSettings}
          isGlobalSettingsVisible={isGlobalSettingsVisible}
          onToggleDragMode={handleToggleDragMode}
          isDragModeEnabled={isDragModeEnabled}
          isEditMode={mode === 'edit'}
          onShowCanvasSettings={handleShowCanvasSettings}
          isCanvasSettingsVisible={isCanvasSettingsVisible}
          onClose={handleToggleFloatingMenu}
        />
      )}
      {isComponentTreeVisible && (
        <ComponentTree
          components={components}
          onSelectComponent={(componentId) => dispatch(setSelectedIds([componentId]))}
          selectedComponentId={selectedIds?.[0]}
          isVisible={isComponentTreeVisible}
          onClose={handleToggleComponentTree}
          initialPosition={componentTreePosition}
          onPositionChange={setComponentTreePosition}
        />
      )}
      {isComponentPaletteVisible && (
        <ComponentPalette
          isVisible={isComponentPaletteVisible}
          onClose={handleToggleComponentPalette}
          initialPosition={componentPalettePosition}
          onPositionChange={setComponentPalettePosition}
        />
      )}
      {isGlobalSettingsVisible && (
        <FloatingGlobalSettings
          initialPosition={globalSettingsPosition}
          onClose={handleToggleGlobalSettings}
          globalSettings={globalSettings || {}} // Provide a default empty object
          onUpdateGlobalSettings={handleUpdateGlobalSettings}
        />
      )}
      {isCanvasSettingsVisible && (
        <FloatingToolbar
          componentId="canvas"
          componentType="CANVAS"
          initialPosition={canvasToolbarPosition}
          onClose={handleCloseCanvasSettings}
          style={canvasSettings.style}
          props={{
            ...canvasSettings,
            toolbarSettings, // Add this line to pass toolbar settings
          }}
          onStyleChange={handleUpdateCanvasSettings}
          onToolbarInteraction={() => {}}
        />
      )}
      {/* Conditionally render the floating button */}
      {!isRightMenuVisible && (
        <button
          onClick={handleToggleFloatingMenu}
          className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-[#e6f3ff] border border-[#b3d9ff] text-blue-600 p-2 rounded-l-lg shadow-lg z-[970]"
          title="Toggle Floating Menu"
        >
          <FaTools />
        </button>
      )}
    </>
  );
};

export default FloatingMenusManager;
