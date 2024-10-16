import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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

const FloatingMenusManager = () => {
  const dispatch = useDispatch();
  const { components, selectedIds, mode, isDragModeEnabled, globalSettings, isFloatingMenuVisible } = useSelector(state => state.editor);
  const toolbarSettings = useSelector(state => state.editor.toolbarSettings) || {};

  // Add this console.log to check the globalSettings
  console.log('Global Settings:', globalSettings);

  const canvasSettings = useSelector(state => state.editor.canvasSettings);

  const [isComponentTreeVisible, setIsComponentTreeVisible] = useState(false);
  const [componentTreePosition, setComponentTreePosition] = useState({ x: 0, y: 0 });
  const [isComponentPaletteVisible, setIsComponentPaletteVisible] = useState(false);
  const [componentPalettePosition, setComponentPalettePosition] = useState({ x: 0, y: 0 });
  const [isGlobalSettingsVisible, setIsGlobalSettingsVisible] = useState(false);
  const [globalSettingsPosition, setGlobalSettingsPosition] = useState({ x: 0, y: 0 });
  const [isCanvasSettingsVisible, setIsCanvasSettingsVisible] = useState(false);
  const [canvasToolbarPosition, setCanvasToolbarPosition] = useState({ x: 100, y: 100 });
  const [isToolbarSettingsVisible, setIsToolbarSettingsVisible] = useState(false);
  const [toolbarSettingsPosition, setToolbarSettingsPosition] = useState({ x: 100, y: 100 });

  const floatingRightMenuRef = useRef(null);

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

  const handleToggleToolbarSettings = useCallback(() => {
    if (mode === 'edit') {
      setIsToolbarSettingsVisible(prev => !prev);
    }
  }, [mode]);

  const handleUpdateToolbarSettings = useCallback((updates) => {
    dispatch(updateToolbarSettings(updates));
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

  if (!isFloatingMenuVisible || mode !== 'edit') {
    return null;
  }

  return (
    <>
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
        onShowToolbarSettings={handleToggleToolbarSettings}
        isToolbarSettingsVisible={isToolbarSettingsVisible}
      />
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
          props={canvasSettings}
          onStyleChange={handleUpdateCanvasSettings}
          onToolbarInteraction={() => {}}
        />
      )}
      {isToolbarSettingsVisible && (
        <FloatingToolbar
          componentId="toolbar"
          componentType="TOOLBAR"
          initialPosition={toolbarSettingsPosition}
          onClose={() => setIsToolbarSettingsVisible(false)}
          style={toolbarSettings}
          props={{}} // Pass an empty object as props
          content={null}
          onStyleChange={handleUpdateToolbarSettings}
          onToolbarInteraction={() => {}}
        />
      )}
    </>
  );
};

export default FloatingMenusManager;
