import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Canvas from './Canvas';

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
  setCurrentPage,
  setDragModeEnabled
} from '../../features/editorSlice';
import { updateProject as updateW3SProject } from '../../w3s/w3sSlice';
import Toast from '../common/Toast';
import FloatingRightMenu from './FloatingRightMenu';
import ComponentTree from './ComponentTree';
import ComponentPalette from '../Components/ComponentPalette';
import FloatingGlobalSettings from './FloatingGlobalSettings';
import { updateProject } from '../../w3s/w3sSlice';
import { showToast } from '../../features/toastSlice';
import { useParams } from 'react-router-dom';
import { fetchProject } from '../../w3s/w3sSlice';
import { fetchQueries } from '../../w3s/w3sSlice';

const MainEditor = () => {
  const dispatch = useDispatch();
  const { components, selectedIds, mode, currentPage, isDragModeEnabled } = useSelector(state => state.editor);
  const { data: currentProject, status: projectStatus, error: projectError } = useSelector(state => state.w3s.currentProject);
  const { projectId } = useParams();
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProject(projectId));
    }
  }, [projectId, dispatch]);

  useEffect(() => {
    if (currentProject && currentProject.pages.length > 0) {
      dispatch(setCurrentPage(currentProject.pages[0]));
      dispatch(loadPageContent(currentProject.pages[0].content));
      dispatch(setEditorMode('view'));
    }
  }, [currentProject, dispatch]);

  useEffect(() => {
    let intervalId;
    if (isLoggedIn) {
      dispatch(fetchQueries());
      intervalId = setInterval(() => {
        dispatch(fetchQueries());
      }, 60000); // 60000 ms = 1 minute
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLoggedIn, dispatch]);

  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const globalSettings = useSelector(state => state.editor.globalSettings);
  const currentUser = useSelector(state => state.user.currentUser);
  const [isSpacingVisible, setIsSpacingVisible] = useState(false);
  const [isComponentTreeVisible, setIsComponentTreeVisible] = useState(false);
  const [componentTreePosition, setComponentTreePosition] = useState({ x: 0, y: 0 });
  const [isComponentPaletteVisible, setIsComponentPaletteVisible] = useState(false);
  const [componentPalettePosition, setComponentPalettePosition] = useState({ x: 0, y: 0 });
  const floatingRightMenuRef = useRef(null);
  const [isGlobalSettingsVisible, setIsGlobalSettingsVisible] = useState(false);
  const [globalSettingsPosition, setGlobalSettingsPosition] = useState({ x: 0, y: 0 });
  const isFloatingMenuVisible = useSelector(state => state.editor.isFloatingMenuVisible);

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
    dispatch(setDragModeEnabled(!isDragModeEnabled));
  };

  const handleToggleSpacingVisibility = () => {
    setIsSpacingVisible(!isSpacingVisible);
    // Implement spacing visibility logic here
  };

  const handleToggleComponentTree = useCallback(() => {
    setIsComponentTreeVisible((prev) => {
      if (!prev) {
        const floatingRightMenu = floatingRightMenuRef.current;
        if (floatingRightMenu) {
          const rect = floatingRightMenu.getBoundingClientRect();
          setComponentTreePosition({
            x: rect.left - 270, // 270 = 264 (width of ComponentTree) + 6 (gap)
            y: rect.top,
          });
        }
      }
      return !prev;
    });
  }, []);

  const handleToggleComponentPalette = useCallback(() => {
    setIsComponentPaletteVisible((prev) => {
      if (!prev) {
        const floatingRightMenu = floatingRightMenuRef.current;
        if (floatingRightMenu) {
          const rect = floatingRightMenu.getBoundingClientRect();
          setComponentPalettePosition({
            x: rect.left - 270,
            y: rect.top,
          });
        }
      }
      return !prev;
    });
  }, []);

  const handleToggleGlobalSettings = () => {
    if (!isGlobalSettingsVisible) {
      const floatingRightMenu = floatingRightMenuRef.current;
      if (floatingRightMenu) {
        const rect = floatingRightMenu.getBoundingClientRect();
        setGlobalSettingsPosition({
          x: rect.left - 270,
          y: rect.top,
        });
      }
    }
    setIsGlobalSettingsVisible(!isGlobalSettingsVisible);
  };

  const handleUpdateGlobalSettings = (updates) => {
    dispatch(updateGlobalSettings(updates));
  };

  const handleSaveProject = () => {
    if (!currentUser) {
      dispatch(showToast({ message: 'Please log in to save the project', type: 'error' }));
      return;
    }

    console.log("Saving Project");
    
    if (currentProject && currentProject._id) {
      console.log("Saving project:", currentProject._id);
      
      const updatedProject = {
        ...currentProject,
        pages: currentProject.pages.map(page => {
          if (page.name === currentPage.name) {
            return {
              ...page,
              content: {
                components: components,
                globalSettings: globalSettings,
              },
            };
          }
          return page;
        }),
      };
      
      console.log("updatedProject:", updatedProject);
      dispatch(updateProject(updatedProject));
      dispatch(showToast({ message: 'Project saved successfully!', type: 'success' }));
    } else {
      console.error('No current project selected');
      dispatch(showToast({ message: 'Error: No project selected', type: 'error' }));
    }
  };

  const handleSelectComponentFromTree = (componentId) => {
    dispatch(setSelectedIds([componentId]));
    // You might want to scroll to the selected component in the Canvas here
  };

  const handleDeselectAll = useCallback(() => {
    dispatch(setSelectedIds([]));
  }, [dispatch]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'q') {
          event.preventDefault();
          handleToggleComponentPalette();
        } else if (event.key === 'e') {
          event.preventDefault();
          handleToggleComponentTree();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (projectStatus === 'loading') {
    return <div>Loading project...</div>;
  }

  if (projectStatus === 'failed') {
    return <div>Error: {projectError}</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen relative">
        <Toolbar 
          onSelectPage={handleSelectPage} 
          onDeletePage={handleDeletePage}
          onSaveProject={handleSaveProject}
          onOpenProjectModal={handleOpenProjectModal}
          onOpenDataModal={handleOpenDataModal}
          mode={mode}
          currentUser={currentUser}
          currentProject={currentProject}
          currentPage={currentPage}
        />
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
                onStyleChange={handleUpdateComponent}
                isDragModeEnabled={isDragModeEnabled}
                isSpacingVisible={isSpacingVisible}
                onDeselectAll={handleDeselectAll}
                isViewMode={false}
              />
            ) : (
              <ViewerMode
                components={components}
                globalSettings={globalSettings}
                isViewMode={true}
              />
            )}
          </div>
          {mode === 'edit' && currentUser && isFloatingMenuVisible && (
            <FloatingRightMenu
              onShowComponentTree={handleToggleComponentTree}
              isComponentTreeVisible={isComponentTreeVisible}
              onShowComponentPalette={handleToggleComponentPalette}
              isComponentPaletteVisible={isComponentPaletteVisible}
              onShowGlobalSettings={handleToggleGlobalSettings}
              isGlobalSettingsVisible={isGlobalSettingsVisible}
              onToggleDragMode={handleToggleDragMode}
              isDragModeEnabled={isDragModeEnabled}
              onToggleSpacingVisibility={handleToggleSpacingVisibility}
            />
          )}
          <ComponentTree
            components={components}
            onSelectComponent={handleSelectComponentFromTree}
            selectedComponentId={selectedIds?.[0]}
            isVisible={isComponentTreeVisible}
            onClose={handleToggleComponentTree}
            initialPosition={componentTreePosition}
            onPositionChange={setComponentTreePosition}
            onUpdateComponent={handleUpdateComponent}
          />
          <ComponentPalette
            isVisible={isComponentPaletteVisible}
            onClose={handleToggleComponentPalette}
            initialPosition={componentPalettePosition}
            onPositionChange={setComponentPalettePosition}
            onAddComponent={handleAddComponent}
          />
          {isGlobalSettingsVisible && (
            <FloatingGlobalSettings
              initialPosition={globalSettingsPosition}
              onClose={handleToggleGlobalSettings}
              globalSettings={globalSettings}
              onUpdateGlobalSettings={handleUpdateGlobalSettings}
            />
          )}
        </div>
        
      </div>
      {isProjectModalOpen && (
      <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={handleCloseProjectModal}
        />
      )}
      <Toast />
    </DndProvider>
  );
};

export default MainEditor;