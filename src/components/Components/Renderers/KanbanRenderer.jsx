import React, { useState, useEffect, useCallback, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import KanBanTaskModal from "../../common/KanBanTaskModal";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { createComponentData } from "../../../w3s/w3sSlice";
import { w3sService } from "../../../w3s/w3sService";

// Define UI permissions for Kanban
const KANBAN_UI_PERMISSIONS = {
  ADD: "add", // Can add new tasks
  MODIFY: "modify", // Can modify task details
  MOVE: "move", // Can move tasks between columns
  ASSIGN_TASKS: "assign_tasks", // Can assign tasks to others
};

// Helper function to find todo lists
const findTodoLists = (components) => {
  let todoLists = [];
  components.forEach((component) => {
    if (component.type === "TODO") {
      todoLists.push(component);
    }
    if (component.children && component.children.length > 0) {
      todoLists = todoLists.concat(findTodoLists(component.children));
    }
  });
  return todoLists;
};

// Helper function to find todo lists by ID
const findTodoListById = (components, id) => {
  for (let component of components) {
    if (component.id === id && component.type === "TODO") {
      return component;
    }
    if (component.children) {
      const found = findTodoListById(component.children, id);
      if (found) return found;
    }
  }
  return null;
};

const KanbanRenderer = ({ component, onUpdate, isInteractive }) => {
  const [columns, setColumns] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [columnBorderStyle, setColumnBorderStyle] = useState(
    component.props.columnBorderStyle || {}
  );
  const [columnPadding, setColumnPadding] = useState("16px 8px 12px 8px");
  const [taskCardBorderRadius, setTaskCardBorderRadius] = useState("4px");
  const [accessRecord, setAccessRecord] = useState(null);

  const boardRef = useRef(null);
  const dispatch = useDispatch();
  const dataFetchedRef = useRef(false);

  const currentUser = useSelector((state) => state.user.currentUser);
  const currentProject = useSelector((state) => state.w3s.currentProject.data);

  // Add useEffect for checking access first
  useEffect(() => {
    const checkUserAccess = async () => {
      if (!component.props.id || !currentUser?._id) {
        console.log("Missing component ID or user ID:", {
          componentId: component.props.id,
          userId: currentUser?._id,
        });
        return;
      }

      try {
        // Get the current user's access
        const userAccess = await w3sService.getUserAccess(
          component.props.id,
          currentUser._id
        );
        console.log("Kanban user access loaded:", {
          userAccess,
          permissions: userAccess?.ui_permissions,
          backend_permissions: userAccess?.backend_permissions
        });

        // Get all access records for this component
        const allAccesses = await w3sService.getAccessesByLinkId(component.props.id);
        console.log("All access records loaded:", allAccesses);

        // Combine user access with all access records
        const accessInfo = {
          ...userAccess,
          access_records: allAccesses || []
        };
        
        console.log("Combined access record:", {
          accessInfo,
          userAccess,
          allAccesses
        });
        setAccessRecord(accessInfo);
      } catch (error) {
        console.error("Error checking access:", error);
        setAccessRecord(null);
      }
    };

    checkUserAccess();
  }, [component.props.id, currentUser?._id]);

  // Add this effect to log when access records change
  useEffect(() => {
    console.log("Access record updated:", {
      hasAccessRecords: Boolean(accessRecord?.access_records),
      accessRecordsCount: accessRecord?.access_records?.length,
      records: accessRecord?.access_records
    });
  }, [accessRecord]);

  // Helper function to check if user has admin privileges
  const isAdminOrOwner = useCallback(() => {
    if (currentProject?.createdBy === currentUser?._id) {
      console.log("User is project creator/owner");
      return true;
    }

    if (accessRecord?.backend_permissions) {
      const isAdmin = accessRecord.backend_permissions.includes("admin");
      console.log("User admin status:", isAdmin);
      return isAdmin;
    }

    console.log("User is not admin or owner");
    return false;
  }, [accessRecord, currentProject?.createdBy, currentUser?._id]);

  // Helper function to check if user has a specific UI permission
  const hasPermission = useCallback(
    (permission) => {
      // Admins and owners have all permissions
      if (isAdminOrOwner()) {
        return true;
      }

      // Otherwise check specific UI permissions
      if (!accessRecord || !accessRecord.ui_permissions) {
        return false;
      }

      return accessRecord.ui_permissions.includes(permission);
    },
    [accessRecord, isAdminOrOwner]
  );

  const onDragStart = useCallback(() => {
    if (boardRef.current) {
      const { parentElement } = boardRef.current;
      parentElement.style.userSelect = "none";
    }
  }, []);

  useEffect(() => {
    const fetchComponentData = async () => {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;

      console.log("KanbanRenderer - Starting to fetch component data:", {
        component_id: component.props.id,
        current_user: currentUser,
        access_records: currentProject?.access_records,
      });

      try {
        const response = await w3sService.getComponentDataById(
          component.props.id
        );
        console.log("KanbanRenderer - Component data response:", response);

        if (response && response.data && response.data.tasks) {
          const fetchedTasks = response.data.tasks;
          console.log(
            "KanbanRenderer - Initializing columns with fetched tasks:",
            fetchedTasks
          );
          initializeColumns(fetchedTasks);
        } else {
          console.log(
            "KanbanRenderer - No tasks in response, using default tasks:",
            component.props.tasks
          );
          initializeColumns(component.props.tasks || []);
        }
      } catch (error) {
        console.error("KanbanRenderer - Error fetching component data:", {
          error_message: error.message,
          error_response: error.response?.data,
          component_id: component.props.id,
        });
        initializeColumns(component.props.tasks || []);
      }
    };

    const initializeColumns = (tasks) => {
      console.log("KanbanRenderer - Initializing columns:", {
        tasks,
        default_columns: component.props.columns,
      });

      const initialColumns = component.props.columns || [
        { id: "col1", title: "To Do" },
        { id: "col2", title: "In Progress" },
        { id: "col3", title: "Done" },
      ];

      const newColumns = initialColumns.reduce((acc, column) => {
        acc[column.id] = {
          ...column,
          tasks: tasks.filter((task) => task.columnId === column.id),
        };
        return acc;
      }, {});

      console.log("KanbanRenderer - Final columns structure:", newColumns);
      setColumns(newColumns);
    };

    dataFetchedRef.current = false;
    fetchComponentData();
  }, [component.props.id, component.props.tasks, component.props.columns]);

  useEffect(() => {
    const newColumnBorderStyle = component.props.columnBorderStyle || {};
    setColumnBorderStyle(newColumnBorderStyle);
    const newColumnPadding =
      component.props.columnPadding || "16px 8px 12px 8px";
    setColumnPadding(newColumnPadding);
    const columnRadius = parseInt(newColumnBorderStyle.borderRadius || "0px");
    const taskRadius = Math.max(0, columnRadius - 2);
    setTaskCardBorderRadius(`${taskRadius}px`);
  }, [component.props.columnBorderStyle, component.props.columnPadding]);

  const onDragEnd = useCallback(
    (result) => {
      if (!hasPermission(KANBAN_UI_PERMISSIONS.MOVE)) {
        console.log("User does not have permission to move tasks");
        return;
      }

      if (boardRef.current) {
        const { parentElement } = boardRef.current;
        parentElement.style.userSelect = "";
      }

      const { source, destination } = result;
      if (!destination || !isInteractive) return;

      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceTasks = [...sourceColumn.tasks];
      const destTasks =
        source.droppableId === destination.droppableId
          ? sourceTasks
          : [...destColumn.tasks];

      const [removed] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, {
        ...removed,
        columnId: destination.droppableId,
      });

      const newColumns = {
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceTasks,
        },
        [destination.droppableId]: {
          ...destColumn,
          tasks: destTasks,
        },
      };

      setColumns(newColumns);

      // Update component with new task positions
      const allTasks = Object.values(newColumns).flatMap(
        (column) => column.tasks
      );
      onUpdate(component.id, {
        props: { ...component.props, tasks: allTasks },
      });

      const kanbanData = {
        componentId: component.props.id,
        name: component.props.name,
        type: component.type,
        tasks: allTasks,
      };

      dispatch(createComponentData(kanbanData))
        .unwrap()
        .catch((error) => {
          console.error("Failed to store kanban data:", error);
        });
    },
    [
      columns,
      isInteractive,
      onUpdate,
      component.id,
      component.props,
      component.type,
      dispatch,
      hasPermission,
    ]
  );

  const handleDoubleClick = useCallback(
    (event, columnId, task = null) => {
      event.stopPropagation();

      console.log("Opening modal with access record:", {
        accessRecord,
        users: accessRecord?.users,
        currentUser
      });

      // Always allow if user is admin or owner
      if (isAdminOrOwner()) {
        console.log("Allowing action due to admin/owner status");
        setSelectedColumnId(columnId);
        setSelectedTask(task);
        setIsModalOpen(true);
        return;
      }

      // For regular users, check permissions
      if (!isInteractive) return;

      // For existing tasks, check MODIFY permission
      if (task && !hasPermission(KANBAN_UI_PERMISSIONS.MODIFY)) {
        console.log("User does not have permission to modify tasks");
        return;
      }

      // For new tasks, check ADD permission
      if (!task && !hasPermission(KANBAN_UI_PERMISSIONS.ADD)) {
        console.log("User does not have permission to add tasks");
        return;
      }

      setSelectedColumnId(columnId);
      setSelectedTask(task);
      setIsModalOpen(true);
    },
    [accessRecord, currentUser, isInteractive, hasPermission, isAdminOrOwner]
  );

  const handleAddOrUpdateTask = useCallback(
    (taskData) => {
      const isNewTask = !taskData.id;

      // Skip permission check for admin/owner
      if (!isAdminOrOwner()) {
        // Check permissions for regular users
        if (isNewTask && !hasPermission(KANBAN_UI_PERMISSIONS.ADD)) {
          console.log("User does not have permission to add tasks");
          return;
        }

        if (!isNewTask && !hasPermission(KANBAN_UI_PERMISSIONS.MODIFY)) {
          console.log("User does not have permission to modify tasks");
          return;
        }
      }

      const newTask = isNewTask
        ? {
            id: uuidv4(),
            columnId: selectedColumnId,
            createdAt: new Date().toISOString(),
            ...taskData,
          }
        : taskData;

      const updatedColumns = {
        ...columns,
        [selectedColumnId]: {
          ...columns[selectedColumnId],
          tasks: isNewTask
            ? [...columns[selectedColumnId].tasks, newTask]
            : columns[selectedColumnId].tasks.map((task) =>
                task.id === newTask.id ? newTask : task
              ),
        },
      };

      setColumns(updatedColumns);

      // Update component with new tasks
      const allTasks = Object.values(updatedColumns).flatMap(
        (column) => column.tasks
      );
      onUpdate(component.id, {
        props: { ...component.props, tasks: allTasks },
      });

      const kanbanData = {
        componentId: component.props.id,
        name: component.props.name,
        type: component.type,
        tasks: allTasks,
      };

      dispatch(createComponentData(kanbanData))
        .unwrap()
        .catch((error) => {
          console.error("Failed to store kanban data:", error);
        });

      setIsModalOpen(false);
    },
    [
      columns,
      selectedColumnId,
      onUpdate,
      component.id,
      component.props,
      component.type,
      dispatch,
      hasPermission,
      isAdminOrOwner,
    ]
  );

  const handleDeleteTask = useCallback(
    (taskToDelete) => {
      // Skip permission check for admin/owner
      if (!isAdminOrOwner()) {
        // Check permissions for regular users
        if (!hasPermission(KANBAN_UI_PERMISSIONS.MODIFY)) {
          console.log("User does not have permission to delete tasks");
          return;
        }
      }

      const columnId = taskToDelete.columnId;
      const updatedColumns = {
        ...columns,
        [columnId]: {
          ...columns[columnId],
          tasks: columns[columnId].tasks.filter(
            (task) => task.id !== taskToDelete.id
          ),
        },
      };

      setColumns(updatedColumns);

      // Update component with new tasks
      const allTasks = Object.values(updatedColumns).flatMap(
        (column) => column.tasks
      );
      onUpdate(component.id, {
        props: { ...component.props, tasks: allTasks },
      });

      const kanbanData = {
        componentId: component.props.id,
        name: component.props.name,
        type: component.type,
        tasks: allTasks,
      };

      dispatch(createComponentData(kanbanData))
        .unwrap()
        .catch((error) => {
          console.error("Failed to store kanban data:", error);
        });

      setIsModalOpen(false);
    },
    [
      columns,
      onUpdate,
      component.id,
      component.props,
      component.type,
      dispatch,
      hasPermission,
      isAdminOrOwner,
    ]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="kanban-board flex-1 overflow-hidden">
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="flex h-full p-4 w-full">
            {Object.values(columns).map((column) => (
              <div
                key={column.id}
                className="flex-1 mx-2 first:ml-0 last:mr-0 rounded-lg flex flex-col min-w-[200px] max-w-[300px]"
                style={{
                  ...columnBorderStyle,
                  padding: "12px",
                  flex: "1 1 0%",
                  width: "0",
                  height: "100%",
                  overflow: "hidden",
                  position: 'relative',
                  backgroundColor: column.backgroundColor || '#f3f4f6'
                }}
                onDoubleClick={(e) => handleDoubleClick(e, column.id)}
              >
                <div
                  className="sticky top-0"
                  style={{
                    padding: columnPadding,
                    margin: "-12px -12px 0",
                    borderTopLeftRadius: columnBorderStyle.borderRadius || "4px",
                    borderTopRightRadius: columnBorderStyle.borderRadius || "4px",
                    backgroundColor: 'transparent'
                  }}
                >
                  <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 overflow-y-auto"
                      style={{
                        height: "100%",
                        minHeight: "100px",
                        maxHeight: "calc(100% - 60px)",
                        marginTop: "12px",
                        borderBottomLeftRadius:
                          columnBorderStyle.borderRadius || "4px",
                        borderBottomRightRadius:
                          columnBorderStyle.borderRadius || "4px",
                        padding: "0 12px 12px 12px",
                      }}
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                          isDragDisabled={
                            !hasPermission(KANBAN_UI_PERMISSIONS.MOVE)
                          }
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-3 rounded shadow mb-2 cursor-pointer hover:shadow-md transition-shadow"
                              style={{
                                ...provided.draggableProps.style,
                                borderRadius: taskCardBorderRadius,
                                zIndex: snapshot.isDragging ? 9999 : 'auto'
                              }}
                              onDoubleClick={(e) =>
                                handleDoubleClick(e, column.id, task)
                              }
                            >
                              <h3 className="font-medium">{task.title}</h3>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {task.description}
                                </p>
                              )}
                              {task.assignedTo && (
                                <div className="mt-2 text-xs text-gray-500 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                  </svg>
                                  {task.assignedTo.user_name}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {isModalOpen && (
        <KanBanTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddOrUpdateTask}
          onDelete={handleDeleteTask}
          task={selectedTask}
          isReadOnly={
            !isAdminOrOwner() && (
              selectedTask
                ? !hasPermission(KANBAN_UI_PERMISSIONS.MODIFY)
                : !hasPermission(KANBAN_UI_PERMISSIONS.ADD)
            )
          }
          accessRecord={accessRecord}
          currentUser={currentUser}
          currentProject={currentProject}
        />
      )}
    </div>
  );
};

export default KanbanRenderer;
