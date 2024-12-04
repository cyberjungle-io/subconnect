import React, { useState, useCallback, useEffect, useRef } from "react";
import TodoModal from "../../common/TodoModal";
import DeleteConfirmModal from "../../common/DeleteConfirmModal";
import { useDispatch, useSelector } from "react-redux";
import { createComponentData } from "../../../w3s/w3sSlice";
import { w3sService } from "../../../w3s/w3sService";

const TodoRenderer = ({ component, isViewMode, onUpdate }) => {
  const { props, style } = component;
  const [tasks, setTasks] = useState(props.tasks || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [lastTap, setLastTap] = useState({ id: null, time: 0 });
  const dispatch = useDispatch();
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    const fetchComponentData = async () => {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;

      try {
        const response = await w3sService.getComponentDataById(component.id);

        if (response && response.data && response.data.tasks) {
          setTasks(response.data.tasks);
        }
      } catch (error) {
        console.error("Error fetching component data:", error);
      }
    };

    if (isViewMode) {
      fetchComponentData();
    }
  }, [component.props.id, isViewMode]);

  const getDisplayTasks = () => {
    if (!isViewMode && tasks.length === 0) {
      return [
        {
          id: "dummy",
          name: "Example task",
          completed: false,
        },
      ];
    }
    return tasks;
  };

  const handleAddTask = (newTask) => {
    const taskId = `${component.id}_${Date.now()}`;

    const updatedTasks = [
      ...tasks,
      {
        ...newTask,
        id: taskId,
        completed: false,
        componentId: component.id,
      },
    ];
    console.log("handleAddTask  updatedTasks", updatedTasks);
    setTasks(updatedTasks);
    onUpdate(component.id, { props: { ...props, tasks: updatedTasks } });

    const todoData = {
      componentId: component.id,
      name: component.props.name,
      type: component.type,
      tasks: updatedTasks,
    };

    dispatch(createComponentData(todoData))
      .unwrap()
      .then(() => {
        // console.log('Todo data stored successfully');
      })
      .catch((error) => {
        console.error("Failed to store todo data:", error);
      });
  };

  const handleEditTask = (editedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === editedTask.id
        ? {
            ...task,
            ...editedTask,
            componentId: component.id,
          }
        : task
    );

    setTasks(updatedTasks);
    onUpdate(component.id, { props: { ...props, tasks: updatedTasks } });

    const todoData = {
      componentId: component.id,
      name: component.name,
      type: component.type,
      tasks: updatedTasks,
    };

    dispatch(createComponentData(todoData))
      .unwrap()
      .then(() => {
        // console.log('Todo data stored successfully');
      })
      .catch((error) => {
        console.error("Failed to store todo data:", error);
      });
  };

  const handleToggleTask = (taskId) => {
    console.log("handleToggleTask  Task", tasks);
    console.log("handleToggleTask  TaskId", taskId);
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    onUpdate(component.id, { props: { ...props, tasks: updatedTasks } });
    const todoData = {
      componentId: component.id,
      name: component.name,
      type: component.type,
      tasks: updatedTasks,
    };

    dispatch(createComponentData(todoData))
      .unwrap()
      .then(() => {
        // console.log('Todo data stored successfully');
      })
      .catch((error) => {
        console.error("Failed to store todo data:", error);
      });
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    onUpdate(component.id, { props: { ...props, tasks: updatedTasks } });

    const todoData = {
      componentId: component.props.id,
      name: component.props.name,
      type: component.type,
      tasks: updatedTasks,
    };

    dispatch(createComponentData(todoData))
      .unwrap()
      .then(() => {
        // console.log('Todo data deleted successfully');
      })
      .catch((error) => {
        console.error("Failed to update todo data:", error);
      });
  };

  const openModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleTaskClick = useCallback(
    (task) => {
      const now = Date.now();
      if (lastTap.id === task.id && now - lastTap.time < 300) {
        // Double tap detected
        openModal(task);
      }
      setLastTap({ id: task.id, time: now });
    },
    [lastTap]
  );

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        zIndex: 10,
      }}
      className="todo-list"
    >
      <div
        style={{
          padding: style.padding || "20px",
          backgroundColor: style.backgroundColor || "#f9f9f9",
          boxShadow: style.boxShadow || "0 2px 4px rgba(0,0,0,0.1)",
          borderRadius: style.borderRadius || "4px",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            paddingTop: "10px",
          }}
        >
          <h3
            style={{
              margin: 0,
              padding: "0 10px",
              color: style.titleColor || style.color || "#333",
              borderBottom: `2px solid ${style.accentColor || "#4a90e2"}`,
              paddingBottom: "10px",
              fontSize: style.titleFontSize,
              fontFamily: style.titleFontFamily,
              fontWeight: style.titleFontWeight,
              fontStyle: style.titleFontStyle,
              textDecoration: style.titleTextDecoration,
              textAlign: style.titleTextAlign,
            }}
          >
            {props.title || "Todo List"}
          </h3>
          <button
            onClick={() => isViewMode && openModal()}
            style={{
              backgroundColor: style.accentColor || "#4a90e2",
              color: style.buttonTextColor || "white",
              border: "none",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "10px",
            }}
          >
            +
          </button>
        </div>
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            minHeight: tasks.length === 0 ? "100px" : "auto",
            flexGrow: 1,
            overflowY: "auto",
            maxHeight: "calc(100% - 100px)",
          }}
        >
          {getDisplayTasks().map((task) => (
            <li
              key={task.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: style.taskBackgroundColor || "white",
                borderRadius: "4px",
                transition: "background-color 0.2s",
                cursor: "pointer",
              }}
              onClick={() => isViewMode && handleTaskClick(task)}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => {
                  e.stopPropagation();
                  if (task.id !== "dummy") {
                    handleToggleTask(task.id);
                  }
                }}
                disabled={!isViewMode || task.id === "dummy"}
                style={{ marginRight: "10px" }}
              />
              <span
                style={{
                  textDecoration: task.completed
                    ? "line-through"
                    : style.taskTextDecoration || "none",
                  color: task.completed
                    ? "#888"
                    : style.taskTextColor || "#333",
                  fontSize: style.taskFontSize,
                  fontFamily: style.taskFontFamily,
                  fontWeight: style.taskFontWeight,
                  fontStyle: style.taskFontStyle,
                  flexGrow: 1,
                }}
              >
                {task.name}
              </span>
            </li>
          ))}
        </ul>

        <div
          style={{
            fontSize: "12px",
            color: "#888",
            textAlign: "right",
            paddingTop: "10px",
          }}
        >
          {completedTasks}/{totalTasks} ({completionPercentage}%)
        </div>
      </div>

      {isModalOpen && (
        <TodoModal
          task={editingTask}
          onSave={editingTask ? handleEditTask : handleAddTask}
          onClose={closeModal}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default TodoRenderer;
