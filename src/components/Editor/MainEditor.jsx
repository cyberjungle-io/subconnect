import React, { useState,useCallback } from 'react';
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
  updateComponentSpacing,
  updateGlobalSpacing,
  updateHeadingProperties,
  updateResponsiveProperties
} from '../../features/editorSlice';

const MainEditor = () => {
  const dispatch = useDispatch();
  const { components, selectedIds } = useSelector(state => state.editor);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const handleOpenProjectModal = useCallback(() => {
    console.log('Attempting to open Project Modal');
    setIsProjectModalOpen(true);
  }, []);

  const handleCloseProjectModal = useCallback(() => {
    console.log('Closing Project Modal');
    setIsProjectModalOpen(false);
  }, []);



  const handleTogglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };
  const handleOpenDataModal = () => {
    setIsDataModalOpen(true);
  };
  const handleCloseDataModal = () => {
    setIsDataModalOpen(false);
  };

  const handleAddComponent = (componentType, parentId = null, position = null) => {
    const newComponentData = {
      type: componentType, 
      style: { 
        width: position ? position.width : 350, 
        height: position ? position.height : 300,
        left: position ? position.x : 0,
        top: position ? position.y : 0,
      },
      parentId
    };

    dispatch(addComponent(newComponentData));
  };

  const handleUpdateGlobalSpacing = (updates) => {
    dispatch(updateGlobalSpacing(updates));
  };

  const handleUpdateComponent = (id, updates) => {
    if (updates.props) {
      const { responsiveHide, responsiveFontSize, ...otherProps } = updates.props;
      
      if (responsiveHide || responsiveFontSize) {
        dispatch(updateResponsiveProperties({ id, responsiveProps: { responsiveHide, responsiveFontSize } }));
      }

      if (Object.keys(otherProps).length > 0) {
        dispatch(updateHeadingProperties({ id, properties: otherProps }));
      }
    }

    if (updates.style) {
      dispatch(updateComponent({ id, updates: { style: updates.style } }));
    }

    if (updates.content !== undefined) {
      dispatch(updateComponent({ id, updates: { content: updates.content } }));
    }
  };

  const handleMoveComponent = (componentId, newParentId, newPosition = null) => {
    dispatch(moveComponent({ componentId, newParentId, newPosition }));
  };

  const handleDeleteComponent = (id) => {
    dispatch(deleteComponent(id));
  };

  const handleSelectComponent = (id, isMultiSelect) => {
    if (isMultiSelect) {
      dispatch(setSelectedIds(selectedIds.includes(id) 
        ? selectedIds.filter(selectedId => selectedId !== id)
        : [...selectedIds, id]
      ));
    } else {
      dispatch(setSelectedIds([id]));
    }
  };

  const handleClearSelection = () => {
    dispatch(setSelectedIds([]));
  };

  const handleAlign = (alignment) => {
    dispatch(alignComponents(alignment));
  };

  const handleDistribute = (direction) => {
    dispatch(distributeComponents(direction));
  };

  const handleCopy = () => {
    dispatch(copyComponents());
  };

  const handlePaste = () => {
    dispatch(pasteComponents());
  };

  const findComponentById = (components, id) => {
    for (let component of components) {
      if (component.id === id) {
        return component;
      }
      if (component.children) {
        const found = findComponentById(component.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        
        <div className="flex flex-col flex-grow">
          <Toolbar 
            onAlign={handleAlign}
            onDistribute={handleDistribute}
            onCopy={handleCopy}
            onPaste={handlePaste}
          />
          <div className="flex flex-grow overflow-hidden">
          <div className="flex-grow overflow-auto">
          <Canvas
            components={components}
            selectedIds={selectedIds}
            onSelectComponent={handleSelectComponent}
            onClearSelection={handleClearSelection}
            onClearSelection={handleClearSelection}
            onUpdateComponent={handleUpdateComponent}
            onAddComponent={handleAddComponent}
            onMoveComponent={handleMoveComponent}
          />
        </div>
        <PropertiesPanel
          selectedComponent={findComponentById(components, selectedIds[0])}
          onUpdateComponent={handleUpdateComponent}
          onDeleteComponent={handleDeleteComponent}
          onAddChildComponent={handleAddComponent}
          onOpenProjectModal={handleOpenProjectModal}
          onAddComponent={handleAddComponent}
          isVisible={isPanelVisible}
          onToggleVisibility={handleTogglePanel}
              components={components}
              onSelectComponent={handleSelectComponent}
              onOpenDataModal={handleOpenDataModal}
              onUpdateGlobalSpacing={handleUpdateGlobalSpacing}
        /></div></div>
      </div>
      {isProjectModalOpen && (
      <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={handleCloseProjectModal}
        />
      )}
      {isDataModalOpen && (
        <DataModal
          isOpen={isDataModalOpen}
          onClose={() => setIsDataModalOpen(false)}
        />
      )}
    </DndProvider>
  );
};

export default MainEditor;