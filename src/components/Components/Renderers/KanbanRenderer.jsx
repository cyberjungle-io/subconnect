import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import KanBanTaskModal from '../../common/KanBanTaskModal';
import { v4 as uuidv4 } from 'uuid';

const KanbanRenderer = ({ component, onUpdate, isInteractive }) => {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState(null);

  useEffect(() => {
    // Initialize with default columns and tasks if not provided
    const initialColumns = component.props.columns || [
      { id: 'col1', title: 'To Do' },
      { id: 'col2', title: 'In Progress' },
      { id: 'col3', title: 'Done' }
    ];
    const initialTasks = component.props.tasks || [];

    setColumns(initialColumns);
    setTasks(initialTasks);

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
    if (!result.destination || !isInteractive) return;

    const { source, destination } = result;
    const updatedTasks = Array.from(tasks);
    const [reorderedItem] = updatedTasks.splice(source.index, 1);
    
    // Find the correct insertion index in the destination column
    const destinationColumnTasks = updatedTasks.filter(task => task.columnId === destination.droppableId);
    const insertIndex = destinationColumnTasks.length > 0 
      ? updatedTasks.indexOf(destinationColumnTasks[destination.index]) 
      : updatedTasks.length;

    updatedTasks.splice(insertIndex, 0, {
      ...reorderedItem,
      columnId: destination.droppableId,
      movedAt: new Date().toISOString()
    });

    setTasks(updatedTasks);
    onUpdate(component.id, { props: { ...component.props, tasks: updatedTasks } });
  }, [tasks, isInteractive, onUpdate, component.id, component.props]);

  const handleDoubleClick = useCallback((columnId) => {
    if (isInteractive) {
      setSelectedColumnId(columnId);
      setIsModalOpen(true);
    }
  }, [isInteractive]);

  const handleAddTask = useCallback((newTask) => {
    const updatedTasks = [...tasks, { ...newTask, id: uuidv4() }];
    setTasks(updatedTasks);
    onUpdate(component.id, { props: { ...component.props, tasks: updatedTasks } });
    setIsModalOpen(false);
  }, [tasks, onUpdate, component.id, component.props]);

  const getTaskDuration = useCallback((task) => {
    const start = new Date(task.createdAt);
    const end = task.completedAt ? new Date(task.completedAt) : new Date();
    const duration = Math.floor((end - start) / (1000 * 60 * 60 * 24)); // in days
    return `${duration} day${duration !== 1 ? 's' : ''}`;
  }, []);

  const getColumnDuration = useCallback((task) => {
    const start = new Date(task.movedAt || task.createdAt);
    const end = new Date();
    const duration = Math.floor((end - start) / (1000 * 60 * 60 * 24)); // in days
    return `${duration} day${duration !== 1 ? 's' : ''}`;
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', height: '100%', overflowX: 'auto' }}>
          {columns.map((column) => (
            <div 
              key={column.id} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                width: `${100 / columns.length}%`, 
                minWidth: '200px', 
                padding: '8px',
                backgroundColor: column.backgroundColor || '#f4f5f7',
                borderRadius: '4px',
                margin: '0 4px'
              }}
              onDoubleClick={() => handleDoubleClick(column.id)}
            >
              <h3 style={{ marginBottom: '8px', color: getContrastColor(column.backgroundColor) }}>
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
                    {tasks
                      .filter((task) => task.columnId === column.id)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={!isInteractive}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                backgroundColor: snapshot.isDragging ? '#f0f0f0' : 'white',
                                padding: '8px',
                                marginBottom: '8px',
                                borderRadius: '4px',
                                boxShadow: snapshot.isDragging ? '0 5px 10px rgba(0,0,0,0.2)' : 'none',
                              }}
                            >
                              <h4>{task.title}</h4>
                              <p>Total Duration: {getTaskDuration(task)}</p>
                              <p>In this column: {getColumnDuration(task)}</p>
                              {task.subtasks && (
                                <button onClick={() => {/* Navigate to subtasks */}}>
                                  View Subtasks
                                </button>
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
      {isInteractive && (
        <KanBanTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTask={handleAddTask}
          columnId={selectedColumnId}
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