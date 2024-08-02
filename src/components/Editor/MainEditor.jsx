import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import Toolbar from './Toolbar';
import DataModal from './DataModal';
import ProjectModal from '../Components/Projects/ProjectModal';
import {
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
} from '../../features/editorSlice';

const MainEditor = () => {
  const dispatch = useDispatch();
  const components = useSelector((state) => state.editor.components);
  const selectedIds = useSelector((state) => state.editor.selectedIds);
  const globalSettings = useSelector((state) => state.editor.globalSettings);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isPropertiesPanelVisible, setIsPropertiesPanelVisible] = useState(true);

  const handleOpenProjectModal = useCallback(() => {
    console.log('Attempting to open Project Modal');
    setIsProjectModalOpen(true);
  }, []);

  const handleCloseProjectModal = useCallback(() => {
    console.log('Closing Project Modal');
    setIsProjectModalOpen(false);
  }, []);

  const handleOpenDataModal = useCallback(() => {
    setIsDataModalOpen(true);
  }, []);

  const handleCloseDataModal = useCallback(() => {
    setIsDataModalOpen(false);
  }, []);

  const handleAddComponent = useCallback((type) => {
    dispatch(addComponent({ type }));
  }, [dispatch]);

  const handleUpdateComponent = useCallback((id, updates) => {
    dispatch(updateComponent({ id, updates }));
  }, [dispatch]);

  const handleDeleteComponent = useCallback((id) => {
    dispatch(deleteComponent(id));
  }, [dispatch]);

  const handleSelectComponent = useCallback((id, isMultiSelect) => {
    dispatch(setSelectedIds(id, isMultiSelect));
  }, [dispatch]);

  const handleAlignComponents = useCallback((alignment) => {
    dispatch(alignComponents(alignment));
  }, [dispatch]);

  const handleDistributeComponents = useCallback((direction) => {
    dispatch(distributeComponents(direction));
  }, [dispatch]);

  const handleCopyComponents = useCallback(() => {
    dispatch(copyComponents());
  }, [dispatch]);

  const handlePasteComponents = useCallback(() => {
    dispatch(pasteComponents());
  }, [dispatch]);

  const handleMoveComponent = useCallback((componentId, newParentId, newPosition) => {
    dispatch(moveComponent({ componentId, newParentId, newPosition }));
  }, [dispatch]);

  const handleUpdateGlobalSettings = useCallback((updates) => {
    dispatch(updateGlobalSettings(updates));
  }, [dispatch]);

  const handleUpdateComponentSpacing = useCallback((id, spacing) => {
    dispatch(updateComponentSpacing({ id, spacing }));
  }, [dispatch]);

  const handleUpdateGlobalSpacing = useCallback((spacing) => {
    dispatch(updateGlobalSpacing(spacing));
  }, [dispatch]);
  const handleClearSelection = () => {
    dispatch(setSelectedIds([]));
  };

  const togglePropertiesPanelVisibility = useCallback(() => {
    setIsPropertiesPanelVisible((prev) => !prev);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        <div className="flex-grow flex flex-col">
          <Toolbar
            onAlign={handleAlignComponents}
            onDistribute={handleDistributeComponents}
            onCopy={handleCopyComponents}
            onPaste={handlePasteComponents}
          />
          <Canvas
            components={components}
            selectedIds={selectedIds}
            onSelectComponent={handleSelectComponent}
            onClearSelection={handleClearSelection}
            onUpdateComponent={handleUpdateComponent}
            onAddComponent={handleAddComponent}
            onMoveComponent={handleMoveComponent}
          />
        </div>
        <PropertiesPanel
          isVisible={isPropertiesPanelVisible}
          onToggleVisibility={togglePropertiesPanelVisibility}
          selectedComponent={components.find((c) => selectedIds.includes(c.id))}
          onUpdateComponent={handleUpdateComponent}
          onDeleteComponent={handleDeleteComponent}
          components={components}
          onSelectComponent={handleSelectComponent}
          onOpenDataModal={handleOpenDataModal}
          onOpenProjectModal={handleOpenProjectModal}
          onUpdateGlobalSpacing={handleUpdateGlobalSpacing}
          globalSettings={globalSettings}
          onUpdateGlobalSettings={handleUpdateGlobalSettings}
        />
        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={handleCloseProjectModal}
        />
        <DataModal
          isOpen={isDataModalOpen}
          onClose={handleCloseDataModal}
        />
      </div>
    </DndProvider>
  );
};

export default MainEditor;