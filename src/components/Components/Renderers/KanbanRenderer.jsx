import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import KanBanTaskModal from '../../common/KanBanTaskModal';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { createComponentData } from '../../../w3s/w3sSlice';
import { w3sService } from '../../../w3s/w3sService'; // Import w3sService

// Add this helper function at the top of the file, outside the component
const findTodoListById = (components, id) => {
  for (let component of components) {
    if (component.id === id && component.type === 'TODO') {
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
  const [columnBorderStyle, setColumnBorderStyle] = useState(component.props.columnBorderStyle || {});
  const [columnPadding, setColumnPadding] = useState('16px 8px 12px 8px');
  const [taskCardBorderRadius, setTaskCardBorderRadius] = useState('4px');

  const boardRef = useRef(null);

  const dispatch = useDispatch();
  const dataFetchedRef = useRef(false);

  const allComponents = useSelector(state => state.editor.components);
  const todoLists = findTodoLists(allComponents);

  const onDragStart = useCallback(() => {
    if (boardRef.current) {
      const { parentElement } = boardRef.current;
      parentElement.style.userSelect = 'none';
    }
  }, []);

  useEffect(() => {
    // console.log('KanbanRenderer component rendered');
    // console.log('Component props:', component.props);

    const fetchComponentData = async () => {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;

      try {
        const response = await w3sService.getComponentDataById(component.props.id);
        // console.log('Fetched component data:', response);
        
        if (response && response.data && response.data.tasks) {
          // console.log('Fetched tasks:', response.data.tasks);
          const fetchedTasks = response.data.tasks;
          // console.log('Fetched tasks:', fetchedTasks);
          initializeColumns(fetchedTasks);
        } else {
          initializeColumns(component.props.tasks || []);
        }
      } catch (error) {
        console.error('Error fetching component data:', error);
        initializeColumns(component.props.tasks || []);
      }
    };

    const initializeColumns = (tasks) => {
      const initialColumns = component.props.columns || [
        { id: 'col1', title: 'To Do' },
        { id: 'col2', title: 'In Progress' },
        { id: 'col3', title: 'Done' }
      ];

      const newColumns = initialColumns.reduce((acc, column) => {
        acc[column.id] = {
          ...column,
          tasks: tasks.filter(task => task.columnId === column.id)
        };
        return acc;
      }, {});

      setColumns(newColumns);
    };

    fetchComponentData();

  }, [component.props.id]); // Only re-run if the component ID changes

  useEffect(() => {
    // Update columnBorderStyle and calculate inner border radius when component props change
    const newColumnBorderStyle = component.props.columnBorderStyle || {};
    setColumnBorderStyle(newColumnBorderStyle);

    // Get the padding from props or use a default value
    const newColumnPadding = component.props.columnPadding || '16px 8px 12px 8px';
    setColumnPadding(newColumnPadding);

    // Calculate task card border radius based on column border radius
    const columnRadius = parseInt(newColumnBorderStyle.borderRadius || '0px');
    // Make task cards slightly less rounded than the column
    const taskRadius = Math.max(0, columnRadius - 2);
    setTaskCardBorderRadius(`${taskRadius}px`);
  }, [component.props.columnBorderStyle, component.props.columnPadding]);

  // Add this new useEffect hook
  useEffect(() => {
    // Update columns when component props change
    if (component.props.columns) {
      const updatedColumns = component.props.columns.reduce((acc, column) => {
        acc[column.id] = {
          ...column,
          tasks: columns[column.id]?.tasks || []
        };
        return acc;
      }, {});
      setColumns(updatedColumns);
    }
  }, [component.props.columns]);

  const onDragEnd = useCallback((result) => {
    if (boardRef.current) {
      const { parentElement } = boardRef.current;
      parentElement.style.userSelect = '';
    }

    const { source, destination } = result;

    if (!destination || !isInteractive) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceTasks = [...sourceColumn.tasks];
    const destTasks = source.droppableId === destination.droppableId ? sourceTasks : [...destColumn.tasks];

    const [removed] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, { ...removed, columnId: destination.droppableId, movedAt: new Date().toISOString() });

    const newColumns = {
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        tasks: sourceTasks
      },
      [destination.droppableId]: {
        ...destColumn,
        tasks: destTasks
      }
    };

    setColumns(newColumns);

    // Flatten tasks for updating the component
    const allTasks = Object.values(newColumns).flatMap(column => column.tasks);
    onUpdate(component.id, { props: { ...component.props, tasks: allTasks } });
    const kanbanData = {
      componentId: component.props.id,
      name: component.props.name,
      type: component.type,
      tasks: allTasks
    };
    
    // Store the kanbanData in w3s
    dispatch(createComponentData(kanbanData))
      .unwrap()
      .then(() => {
        // console.log('Kanban data stored successfully');
      })
      .catch((error) => {
        console.error('Failed to store kanban data:', error);
        if (error.name === 'TypeError' && error.message.includes('Cannot read properties of undefined (reading \'list\')')) {
          console.error('Error: The componentData state might not be initialized properly.');
        } else {
          console.error('Error details:', error.stack);
        }
      });

  }, [columns, isInteractive, onUpdate, component.id, component.props, dispatch]);

  const handleDoubleClick = useCallback((event, columnId, task = null) => {
    if (isInteractive) {
      event.stopPropagation();
      setSelectedColumnId(columnId);
      setSelectedTask(task);
      setIsModalOpen(true);
    }
  }, [isInteractive]);

  const handleAddOrUpdateTask = useCallback((columnId, taskData) => {
    const isNewTask = !taskData.id;
    
    // For new tasks
    if (isNewTask) {
      const newTask = {
        id: uuidv4(),
        columnId,
        createdAt: new Date().toISOString(),
        ...taskData
      };
      
      const updatedColumns = {
        ...columns,
        [columnId]: {
          ...columns[columnId],
          tasks: [...columns[columnId].tasks, newTask]
        }
      };
      
      setColumns(updatedColumns);
      const allTasks = Object.values(updatedColumns).flatMap(column => column.tasks);
      onUpdate(component.id, { props: { ...component.props, tasks: allTasks } });
      setIsModalOpen(false); // Only close for new tasks
      setSelectedTask(null); // Only clear for new tasks
    } 
    // For existing tasks (updates)
    else {
      const updatedColumns = {
        ...columns,
        [columnId]: {
          ...columns[columnId],
          tasks: columns[columnId].tasks.map(task =>
            task.id === taskData.id ? { ...task, ...taskData } : task
          )
        }
      };
      
      setColumns(updatedColumns);
      const allTasks = Object.values(updatedColumns).flatMap(column => column.tasks);
      onUpdate(component.id, { props: { ...component.props, tasks: allTasks } });
      // Don't close modal or clear selected task for updates
    }
  }, [columns, component.id, component.props, onUpdate]);

  const getFormattedDuration = useCallback((start, end) => {
    const durationInMinutes = Math.floor((end - start) / (1000 * 60));
    
    if (durationInMinutes < 60) {
      return `${durationInMinutes} min${durationInMinutes !== 1 ? 's' : ''}`;
    } else if (durationInMinutes < 1440) { // Less than 24 hours
      const hours = Math.floor(durationInMinutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(durationInMinutes / 1440);
      return `${days} day${days !== 1 ? 's' : ''}`;
    }
  }, []);

  const getTaskDuration = useCallback((task) => {
    const start = new Date(task.createdAt);
    const end = task.completedAt ? new Date(task.completedAt) : new Date();
    return getFormattedDuration(start, end);
  }, [getFormattedDuration]);

  const getColumnDuration = useCallback((task) => {
    const start = new Date(task.movedAt || task.createdAt);
    const end = new Date();
    return getFormattedDuration(start, end);
  }, [getFormattedDuration]);

  const getLinkedTodoListInfo = useCallback((task) => {
    if (!task.linkedTodoList) return null;
    const linkedTodoList = findTodoListById(todoLists, task.linkedTodoList);
    if (!linkedTodoList) return null;

    const completedTasks = linkedTodoList.props.tasks.filter(t => t.completed).length;
    const totalTasks = linkedTodoList.props.tasks.length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return `${completedTasks}/${totalTasks} (${completionPercentage}%)`;
  }, [todoLists]);

  return (
    <div 
      ref={boardRef}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      onDoubleClick={(e) => handleDoubleClick(e, Object.keys(columns)[0])}
    >
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', height: '100%', overflowX: 'auto' }}>
          {Object.values(columns).map((column) => (
            <div 
              key={column.id} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                width: `${100 / Object.keys(columns).length}%`, 
                minWidth: '200px', 
                padding: columnPadding,
                backgroundColor: column.backgroundColor || '#f4f5f7', // Use column-specific background color
                margin: '0 4px',
                height: '100%',
                // Apply column border styles here
                ...columnBorderStyle
              }}
              onDoubleClick={(e) => handleDoubleClick(e, column.id)}
            >
              <h3 style={{ 
                marginBottom: '8px', 
                color: getContrastColor(column.backgroundColor),
                ...component.props.columnHeaderStyle
              }}>
                {column.title}
              </h3>
              <Droppable droppableId={column.id} key={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ 
                      flex: 1, 
                      padding: '8px', 
                      minHeight: '100px',
                      overflowY: 'auto',
                      maxHeight: 'calc(100% - 40px)',
                    }}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={!isInteractive}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              userSelect: 'none',
                              backgroundColor: task.color || 'white',
                              padding: '8px',
                              marginBottom: '8px',
                              borderRadius: taskCardBorderRadius,
                              boxShadow: snapshot.isDragging 
                                ? '0 5px 10px rgba(0,0,0,0.3)' 
                                : '0 3px 5px rgba(0,0,0,0.2)', // Added default shadow
                              color: getContrastColor(task.color || '#ffffff'),
                              position: 'relative',
                              minHeight: '80px',
                              ...component.props.taskTextStyle,
                              ...provided.draggableProps.style,
                            }}
                            onDoubleClick={(e) => handleDoubleClick(e, column.id, task)}
                          >
                            <h4 style={{ marginBottom: '4px', fontSize: '14px', fontWeight: 'bold' }}>{task.title}</h4>
                            {task.subtasks && (
                              <button 
                                onClick={() => {/* Navigate to subtasks */}}
                                style={{ fontSize: '12px', marginTop: '4px' }}
                              >
                                View Subtasks
                              </button>
                            )}
                            <div style={{
                              position: 'absolute',
                              bottom: '4px',
                              right: '4px',
                              fontSize: '10px',
                              opacity: 0.7,
                            }}>
                              {getLinkedTodoListInfo(task) && (
                                <span style={{ marginRight: '8px' }}>{getLinkedTodoListInfo(task)}</span>
                              )}
                              {getTaskDuration(task)} | {getColumnDuration(task)}
                            </div>
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
      {isInteractive && (
        <KanBanTaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
          onAddTask={handleAddOrUpdateTask}
          columnId={selectedColumnId}
          task={selectedTask}
          isViewMode={!!selectedTask}
        />
      )}
    </div>
  );
};

// Helper function to determine text color based on background color
function getContrastColor(hexColor) {
  // If no color is set, default to black text
  if (!hexColor) return '#000000';

  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
}



// Make sure to add the findTodoLists function here as well
const findTodoLists = (components) => {
  let todoLists = [];
  components.forEach(component => {
    if (component.type === 'TODO') {
      todoLists.push(component);
    }
    if (component.children && component.children.length > 0) {
      todoLists = todoLists.concat(findTodoLists(component.children));
    }
  });
  return todoLists;
};

export default KanbanRenderer;
