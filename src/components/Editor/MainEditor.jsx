import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import Toolbar from './Toolbar';
import {
  addComponent,
  updateComponent,
  deleteComponent,
  setSelectedIds,
  alignComponents,
  distributeComponents,
  copyComponents,
  pasteComponents,
  moveComponent
} from '../../features/editorSlice';

const MainEditor = () => {
  const dispatch = useDispatch();
  const { components, selectedIds } = useSelector(state => state.editor);

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

  const handleUpdateComponent = (id, updates) => {
    dispatch(updateComponent({ id, updates }));
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
          <Canvas
            components={components}
            selectedIds={selectedIds}
            onSelectComponent={handleSelectComponent}
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
          onAddComponent={handleAddComponent}
        />
      </div>
    </DndProvider>
  );
};

export default MainEditor;