import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Canvas from "./Canvas";
import Toolbar from "./Toolbar";
import ProjectModal from "../Components/Projects/ProjectModal";
import ViewerMode from "../Viewers/ViewerMode";
import {
  setEditorMode,
  addComponent,
  updateComponent,
  setSelectedIds,
  moveComponent,
  loadPageContent,
  setCurrentPage,
  updateToolbarSettings,
} from "../../features/editorSlice";
import { updateProject, updateCurrentProject } from "../../w3s/w3sSlice";
import Toast from "../common/Toast";
import { showToast } from "../../features/toastSlice";
import { useParams } from "react-router-dom";
import { fetchProject, fetchQueries } from "../../w3s/w3sSlice";
import { v4 as uuidv4 } from "uuid";
import FloatingMenusManager from "./FloatingMenusManager";
import { fetchSavedComponents } from "../../features/savedComponentsSlice";
import { PageNavigationProvider } from "../../contexts/PageNavigationContext";

const MainEditor = () => {
  const dispatch = useDispatch();
  const { components, selectedIds, mode, currentPage, isDragModeEnabled } =
    useSelector((state) => state.editor);
  const {
    data: currentProject,
    status: projectStatus,
    error: projectError,
  } = useSelector((state) => state.w3s.currentProject);
  const { projectId } = useParams();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const canvasSettings = useSelector((state) => state.editor.canvasSettings);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const globalSettings = useSelector((state) => state.editor.globalSettings);
  const currentUser = useSelector((state) => state.user.currentUser);
  const toolbarSettings = useSelector((state) => state.editor.toolbarSettings);
  const canvasRef = useRef(null);
  const [canvasHeight, setCanvasHeight] = useState("100%");

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProject(projectId));
    }
  }, [projectId, dispatch]);

  useEffect(() => {
    if (currentProject?.data?.project?.pages?.length > 0) {
      const storedPageId = localStorage.getItem("currentPageId");
      const pageToLoad = storedPageId
        ? currentProject.data.project.pages.find(
            (page) => page._id === storedPageId
          )
        : currentProject.data.project.pages[0];

      if (pageToLoad) {
        dispatch(setCurrentPage(pageToLoad));
        dispatch(loadPageContent(pageToLoad.content));
        dispatch(setEditorMode("view"));

        if (currentProject.data.project.toolbarSettings) {
          dispatch(
            updateToolbarSettings(currentProject.data.project.toolbarSettings)
          );
        }
      }
    }
  }, [currentProject, dispatch]);

  useEffect(() => {
    if (currentPage) {
      localStorage.setItem("currentPageId", currentPage._id);
    }
  }, [currentPage]);

  useEffect(() => {
    let intervalId;
    dispatch(fetchSavedComponents()); // Add this line to fetch saved components
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
    console.log("Attempting to open Project Modal");
    setIsProjectModalOpen(true);
  }, []);

  const handleCloseProjectModal = useCallback(() => {
    console.log("Closing Project Modal");
    setIsProjectModalOpen(false);
  }, []);

  const handleAddComponent = (
    componentType,
    parentId = null,
    position = null,
    savedComponent = null
  ) => {
    let newComponentData;
    if (savedComponent) {
      newComponentData = {
        ...savedComponent,
        id: uuidv4(), // Generate new ID
        parentId,
        style: {
          ...savedComponent.style,
          left: position ? position.x : 0,
          top: position ? position.y : 0,
        },
        props: { ...savedComponent.props }, // Ensure props are applied
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

  const handleMoveComponent = (
    componentId,
    newParentId,
    newPosition = null
  ) => {
    dispatch(moveComponent({ componentId, newParentId, newPosition }));
  };

  const handleSelectComponent = (id, isMultiSelect) => {
    if (mode === "edit") {
      if (isMultiSelect) {
        dispatch(
          setSelectedIds(
            selectedIds.includes(id)
              ? selectedIds.filter((selectedId) => selectedId !== id)
              : [...selectedIds, id]
          )
        );
      } else {
        dispatch(setSelectedIds([id]));
      }
    }
  };

  const handleClearSelection = () => {
    if (mode === "edit") {
      dispatch(setSelectedIds([]));
    }
  };

  const handleDeselectAll = useCallback(() => {
    if (mode === "edit") {
      dispatch(setSelectedIds([]));
    }
  }, [dispatch, mode]);

  const handleSelectPage = (page) => {
    dispatch(setCurrentPage(page));
    if (page.content) {
      dispatch(loadPageContent(page.content));
    } else {
      dispatch(
        loadPageContent({
          components: [],
          globalSettings: {
            backgroundColor: "#ffffff",
            componentLayout: "vertical",
            style: {
              paddingTop: "0px",
              paddingRight: "0px",
              paddingBottom: "0px",
              paddingLeft: "0px",
              marginTop: "0px",
              marginRight: "0px",
              marginBottom: "0px",
              marginLeft: "0px",
              gap: "0px",
            },
          },
        })
      );
    }
    localStorage.setItem("currentPageId", page._id);
  };

  const handleDeletePage = (pageIndex) => {
    if (
      window.confirm("Are you sure you want to delete this page?") &&
      currentProject
    ) {
      const updatedPages = currentProject.pages.filter(
        (_, index) => index !== pageIndex
      );
      dispatch(updateProject({ ...currentProject, pages: updatedPages }));
    }
  };

  const handleSaveProject = () => {
    if (!currentUser) {
      dispatch(
        showToast({
          message: "Please log in to save the project",
          type: "error",
        })
      );
      return;
    }

    console.log("Saving Project - Current Project Data:", currentProject);

    if (!currentProject || !currentProject._id) {
      console.error("No project selected or invalid project data");
      dispatch(
        showToast({ message: "Error: No project selected", type: "error" })
      );
      return;
    }

    const projectToUpdate = { ...currentProject };

    console.log("Project to update:", projectToUpdate);

    if (projectToUpdate && projectToUpdate._id) {
      console.log("Saving project:", projectToUpdate._id);

      const updatedProject = {
        ...projectToUpdate,
        toolbarSettings: toolbarSettings,
        pages: projectToUpdate.pages.map((page) => {
          if (page._id === currentPage._id) {
            const updatedComponents = components.map((component) => ({
              ...component,
              style: {
                ...component.style,
                enablePageNavigation: component.style?.enablePageNavigation,
                targetPageId: component.style?.targetPageId,
              },
            }));

            return {
              ...page,
              content: {
                components: updatedComponents,
                globalSettings: globalSettings,
                canvasSettings: canvasSettings,
              },
            };
          }
          return page;
        }),
      };

      console.log("Final updatedProject structure:", updatedProject);

      // First update the current project in the store
      dispatch(updateCurrentProject(updatedProject));

      // Then save to backend
      dispatch(updateProject(updatedProject))
        .unwrap()
        .then((response) => {
          dispatch(
            showToast({
              message: "Project saved successfully!",
              type: "success",
            })
          );
          // Update any backend-modified data while preserving current state
          dispatch(
            updateCurrentProject({
              ...updatedProject,
              ...response,
              pages: response.pages || updatedProject.pages,
            })
          );
        })
        .catch((error) => {
          console.error("Error saving project:", error);
          dispatch(
            showToast({
              message: "Error saving project: " + error.message,
              type: "error",
            })
          );
        });
    } else {
      console.error(
        "Invalid project data - Project structure:",
        projectToUpdate
      );
      dispatch(
        showToast({ message: "Error: Invalid project data", type: "error" })
      );
    }
  };

  const handleCanvasScroll = useCallback(() => {
    if (canvasRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = canvasRef.current;
      const scrollThreshold = 100; // pixels from bottom to trigger height increase

      if (scrollHeight - (scrollTop + clientHeight) < scrollThreshold) {
        setCanvasHeight((prev) => `${parseInt(prev) + 200}px`);
      }
    }
  }, []);

  if (projectStatus === "loading") {
    return <div>Loading project...</div>;
  }

  if (projectStatus === "failed") {
    return <div>Error: {projectError}</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <PageNavigationProvider>
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
              {mode === "edit" && currentUser ? (
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
      </PageNavigationProvider>
    </DndProvider>
  );
};

export default MainEditor;
