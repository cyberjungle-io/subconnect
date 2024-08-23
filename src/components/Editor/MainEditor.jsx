import React, { useState,useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import Toolbar from './Toolbar';
import DataModal from './DataModal';
import ProjectModal from '../Components/Projects/ProjectModal';
import ViewerMode from '../Viewers/ViewerMode';
import { FaEdit } from 'react-icons/fa';
import { 
  setEditorMode, 
  updateGlobalSettings,
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
  updateResponsiveProperties,
  loadPageContent,
  setCurrentPage
} from '../../features/editorSlice';
import { updateProject as updateW3SProject } from '../../w3s/w3sSlice';
import Toast from '../common/Toast';
import FloatingRightMenu from './FloatingRightMenu';

const MainEditor = () => {
  const dispatch = useDispatch();
  const { components, selectedIds, mode, currentPage } = useSelector(state => state.editor);
  const currentProject = useSelector(state => state.w3s.currentProject.data); // Fetch current project from Redux
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const globalSettings = useSelector(state => state.editor.globalSettings); // Get globalSettings from Redux
  const currentUser = useSelector(state => state.user.currentUser); // Get current user from Redux
  const [isDragMode, setIsDragMode] = useState(false);
  const [isSpacingVisible, setIsSpacingVisible] = useState(false);

  useEffect(() => {
    if (currentProject && currentProject.pages.length > 0) {
      dispatch(setCurrentPage(currentProject.pages[0]));
    }
  }, [currentProject, dispatch]);

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
  // eslint-disable-next-line no-unused-vars
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
        dispatch(updateComponent({ id, updates: { props: otherProps } }));
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

  const handleEnterEditMode = () => {
    dispatch(setEditorMode('edit'));
  };

  const handleSelectPage = (page) => {
    dispatch(setCurrentPage(page));
    if (page.content) {
      dispatch(loadPageContent(page.content));
    } else {
      dispatch(loadPageContent({
        components: [],
        globalSettings: {
          backgroundColor: '#ffffff',
          componentLayout: 'vertical',
          style: {
            paddingTop: '0px',
            paddingRight: '0px',
            paddingBottom: '0px',
            paddingLeft: '0px',
            marginTop: '0px',
            marginRight: '0px',
            marginBottom: '0px',
            marginLeft: '0px',
            gap: '0px'
          }
        }
      }));
    }
  };

  const handleDeletePage = (pageIndex) => {
    if (window.confirm('Are you sure you want to delete this page?') && currentProject) {
      const updatedPages = currentProject.pages.filter((_, index) => index !== pageIndex);
      dispatch(updateW3SProject({ ...currentProject, pages: updatedPages }));
    }
  };

  const handleLoadPageContent = (pageContent) => {
    dispatch(loadPageContent(pageContent));
  };

  const handleToggleDragMode = () => {
    setIsDragMode(!isDragMode);
    // Implement drag mode logic here
  };

  const handleToggleSpacingVisibility = () => {
    setIsSpacingVisible(!isSpacingVisible);
    // Implement spacing visibility logic here
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen relative">
        <Toolbar onSelectPage={handleSelectPage} onDeletePage={handleDeletePage} />
        <div className="flex flex-grow overflow-hidden">
          <div className="flex-grow overflow-auto">
            {mode === 'edit' && currentUser ? (
              <Canvas
                components={components}
                selectedIds={selectedIds || []}
                onSelectComponent={handleSelectComponent}
                onClearSelection={handleClearSelection}
                onUpdateComponent={handleUpdateComponent}
                onAddComponent={handleAddComponent}
                onMoveComponent={handleMoveComponent}
                globalSettings={globalSettings}
                onStyleChange={handleUpdateComponent} // Added this line
                isDragMode={isDragMode}
                isSpacingVisible={isSpacingVisible}
              />
            ) : (
              <ViewerMode components={components} globalSettings={globalSettings} />
            )}
          </div>
          {mode === 'edit' && currentUser && (
            <>
              <FloatingRightMenu
                onShowComponentTree={() => {/* Implement this */}}
                onShowComponentPalette={() => {/* Implement this */}}
                onShowGlobalSettings={() => {/* Implement this */}}
                onOpenDataModal={handleOpenDataModal}
                onToggleDragMode={handleToggleDragMode}
                onToggleSpacingVisibility={handleToggleSpacingVisibility}
                onToggleVisibility={handleTogglePanel}
              />
              <PropertiesPanel
                selectedComponent={findComponentById(components, selectedIds?.[0])}
                onUpdateComponent={handleUpdateComponent}
                onDeleteComponent={handleDeleteComponent}
                onAddChildComponent={handleAddComponent}
                onOpenProjectModal={handleOpenProjectModal}
                onAddComponent={handleAddComponent}
                isVisible={isPanelVisible}
                onToggleVisibility={handleTogglePanel}
                components={components}
                globalSettings={globalSettings}
                onSelectComponent={handleSelectComponent}
                onOpenDataModal={handleOpenDataModal}
                onUpdateGlobalSpacing={handleUpdateGlobalSpacing}
                currentProject={currentProject}
                onSelectPage={handleSelectPage}
                onDeletePage={handleDeletePage}
                onLoadPageContent={handleLoadPageContent}
                onUpdateGlobalSettings={(updates) => dispatch(updateGlobalSettings(updates))}
              />
            </>
          )}
        </div>
        
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
      <Toast />
    </DndProvider>
  );
};

export default MainEditor;