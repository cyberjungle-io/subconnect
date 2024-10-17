import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import ProjectModal from '../Components/Projects/ProjectModal';
import ViewerMode from '../Viewers/ViewerMode';
import { 
  setEditorMode, 
  addComponent,
  updateComponent,
  setSelectedIds,
  moveComponent,
  loadPageContent,
  setCurrentPage,
} from '../../features/editorSlice';
import { updateProject as updateW3SProject } from '../../w3s/w3sSlice';
import Toast from '../common/Toast';
import { updateProject } from '../../w3s/w3sSlice';
import { showToast } from '../../features/toastSlice';
import { useParams } from 'react-router-dom';
import { fetchProject, fetchQueries } from '../../w3s/w3sSlice';
import { v4 as uuidv4 } from 'uuid';
import FloatingMenusManager from './FloatingMenusManager';

const MainEditor = () => {
  const dispatch = useDispatch();
  const { components, selectedIds, mode, currentPage, isDragModeEnabled } = useSelector(state => state.editor);
  const { data: currentProject, status: projectStatus, error: projectError } = useSelector(state => state.w3s.currentProject);
  const { projectId } = useParams();
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const canvasSettings = useSelector(state => state.editor.canvasSettings);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const globalSettings = useSelector(state => state.editor.globalSettings);
  const currentUser = useSelector(state => state.user.currentUser);
  const toolbarSettings = useSelector(state => state.editor.toolbarSettings);
  const canvasRef = useRef(null);
  const [canvasHeight, setCanvasHeight] = useState('100%');

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProject(projectId));
    }
  }, [projectId, dispatch]);

  useEffect(() => {
    if (currentProject && currentProject.pages.length > 0) {
      const storedPageId = localStorage.getItem('currentPageId');
      const pageToLoad = storedPageId
        ? currentProject.pages.find(page => page._id === storedPageId)
        : currentProject.pages[0];

      if (pageToLoad) {
        dispatch(setCurrentPage(pageToLoad));
        dispatch(loadPageContent(pageToLoad.content));
        dispatch(setEditorMode('view'));
      }
    }
  }, [currentProject, dispatch]);

  useEffect(() => {
    if (currentPage) {
      localStorage.setItem('currentPageId', currentPage._id);
    }
  }, [currentPage]);

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

  const handleOpenProjectModal = useCallback(() => {
    console.log('Attempting to open Project Modal');
    setIsProjectModalOpen(true);
  }, []);

  const handleCloseProjectModal = useCallback(() => {
    console.log('Closing Project Modal');
    setIsProjectModalOpen(false);
  }, []);

  const handleAddComponent = (componentType, parentId = null, position = null, savedComponent = null) => {
    let newComponentData;
    if (savedComponent) {
      newComponentData = {
        ...savedComponent,
        id: uuidv4(),
        parentId,
      };
    } else {
      newComponentData = {
        type: componentType,
        style: {
          left: position ? position.x : 0,
          top: position ? position.y : 0,
        },
        parentId,
      };
    }

    dispatch(addComponent(newComponentData));
  };

  const handleUpdateComponent = (id, updates) => {
    dispatch(updateComponent({ id, updates }));
  };

  const handleMoveComponent = (componentId, newParentId, newPosition = null) => {
    dispatch(moveComponent({ componentId, newParentId, newPosition }));
  };

  const handleSelectComponent = (id, isMultiSelect) => {
    if (mode === 'edit') {
      if (isMultiSelect) {
        dispatch(setSelectedIds(selectedIds.includes(id) 
          ? selectedIds.filter(selectedId => selectedId !== id)
          : [...selectedIds, id]
        ));
      } else {
        dispatch(setSelectedIds([id]));
      }
    }
  };

  const handleClearSelection = () => {
    if (mode === 'edit') {
      dispatch(setSelectedIds([]));
    }
  };

  const handleDeselectAll = useCallback(() => {
    if (mode === 'edit') {
      dispatch(setSelectedIds([]));
    }
  }, [dispatch, mode]);

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
    localStorage.setItem('currentPageId', page._id);
  };

  const handleDeletePage = (pageIndex) => {
    if (window.confirm('Are you sure you want to delete this page?') && currentProject) {
      const updatedPages = currentProject.pages.filter((_, index) => index !== pageIndex);
      dispatch(updateW3SProject({ ...currentProject, pages: updatedPages }));
    }
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
          if (page._id === currentPage._id) {
            return {
              ...page,
              content: {
                components: components,
                globalSettings: globalSettings,
                canvasSettings: canvasSettings  // Include canvasSettings here
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

  const handleCanvasScroll = useCallback(() => {
    if (canvasRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = canvasRef.current;
      const scrollThreshold = 100; // pixels from bottom to trigger height increase

      if (scrollHeight - (scrollTop + clientHeight) < scrollThreshold) {
        setCanvasHeight(prev => `${parseInt(prev) + 200}px`);
      }
    }
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
          mode={mode}
          currentUser={currentUser}
          currentProject={currentProject}
          currentPage={currentPage}
        />
        <div className="flex flex-grow">
          <div 
            ref={canvasRef}
            className="flex-grow overflow-y-auto"
            onScroll={handleCanvasScroll}
            style={{ height: canvasHeight }}
          >
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
                isViewMode={false}
                canvasSettings={{
                  ...canvasSettings,
                  toolbarSettings,
                  canvasHeight,
                }}
                onDeselectAll={handleDeselectAll}
              />
            ) : (
              <ViewerMode
                components={components}
                globalSettings={globalSettings}
                isViewMode={true}
                onDeselectAll={handleDeselectAll}
              />
            )}
          </div>
          <FloatingMenusManager />
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
