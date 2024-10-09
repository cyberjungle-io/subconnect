import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import KanBanTaskModal from '../../common/KanBanTaskModal';
import { v4 as uuidv4 } from 'uuid';

const KanbanRenderer = ({ component, onUpdate, isInteractive }) => {
  const [columns, setColumns] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    // Initialize with default columns and tasks if not provided
    const initialColumns = component.props.columns || [
      { id: 'col1', title: 'To Do' },
      { id: 'col2', title: 'In Progress' },
      { id: 'col3', title: 'Done' }
    ];
    const initialTasks = component.props.tasks || [];

    // Create a new columns object with tasks
    const newColumns = initialColumns.reduce((acc, column) => {
      acc[column.id] = {
        ...column,
        tasks: initialTasks.filter(task => task.columnId === column.id)
      };
      return acc;
    }, {});

    setColumns(newColumns);

    // Update the component if it doesn't have columns or tasks
    if (!component.props.columns || !component.props.tasks) {
      onUpdate(component.id, {
        props: {
          ...component.props,
          columns: initialColumns,
          tasks: initialTasks
        }
      });
    }
  }, [component.id, component.props, onUpdate]);

  const onDragEnd = useCallback((result) => {
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
  }, [columns, isInteractive, onUpdate, component.id, component.props]);

  const handleDoubleClick = useCallback((event, columnId, task = null) => {
    if (isInteractive) {
      event.stopPropagation();
      setSelectedColumnId(columnId);
      setSelectedTask(task);
      setIsModalOpen(true);
    }
  }, [isInteractive]);

  const handleAddOrUpdateTask = useCallback((columnId, taskData) => {
    const updatedColumns = { ...columns };

    if (selectedTask) {
      // Update existing task
      updatedColumns[columnId].tasks = updatedColumns[columnId].tasks.map(task =>
        task.id === selectedTask.id ? { ...task, ...taskData } : task
      );
    } else {
      // Add new task
      const newTask = { ...taskData, id: uuidv4(), columnId, createdAt: new Date().toISOString() };
      updatedColumns[columnId].tasks.push(newTask);
    }

    setColumns(updatedColumns);

    // Flatten tasks for updating the component
    const allTasks = Object.values(updatedColumns).flatMap(column => column.tasks);
    onUpdate(component.id, { props: { ...component.props, tasks: allTasks } });
    setIsModalOpen(false);
    setSelectedTask(null);
  }, [columns, onUpdate, component.id, component.props, selectedTask]);

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

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
         onDoubleClick={(e) => handleDoubleClick(e, Object.keys(columns)[0])}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', height: '100%', overflowX: 'auto' }}>
          {Object.values(columns).map((column) => (
            <div 
              key={column.id} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                width: `${100 / Object.keys(columns).length}%`, 
                minWidth: '200px', 
                padding: '8px',
                backgroundColor: column.backgroundColor || '#f4f5f7',
                borderRadius: '4px',
                margin: '0 4px'
              }}
              onDoubleClick={(e) => handleDoubleClick(e, column.id)}
            >
              <h3 style={{ 
                marginBottom: '8px', 
                color: getContrastColor(column.backgroundColor),
                ...component.props.columnHeaderStyle // Apply the columnHeaderStyle here
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
                      borderRadius: '4px', 
                      minHeight: '100px',
                      backgroundColor: column.innerBackgroundColor || lightenColor(column.backgroundColor || '#f4f5f7', 10),
                      ...(snapshot.isDraggingOver ? { backgroundColor: '#e0e0e0' } : {})
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
                              ...provided.draggableProps.style,
                              backgroundColor: task.color || 'white',
                              padding: '8px',
                              marginBottom: '8px',
                              borderRadius: '4px',
                              boxShadow: snapshot.isDragging ? '0 5px 10px rgba(0,0,0,0.2)' : 'none',
                              color: getContrastColor(task.color || '#ffffff'),
                              position: 'relative',
                              minHeight: '80px', // Ensure enough space for content and duration
                              ...component.props.taskTextStyle, // Apply the taskTextStyle here
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

// Helper function to lighten a color
function lightenColor(color, amount) {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

export default KanbanRenderer;