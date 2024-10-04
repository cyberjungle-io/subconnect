import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import KanBanTaskModal from '../../common/KanBanTaskModal';

const KanbanRenderer = ({ component, onUpdate, isInteractive }) => {
  const [columns, setColumns] = useState(component.props.columns || []);
  const [tasks, setTasks] = useState(component.props.tasks || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState(null);

  useEffect(() => {
    setColumns(component.props.columns || []);
    setTasks(component.props.tasks || []);
  }, [component.props]);

  const onDragEnd = (result) => {
    if (!result.destination || !isInteractive) return;

    const { source, destination } = result;
    const updatedTasks = Array.from(tasks);
    const [reorderedItem] = updatedTasks.splice(source.index, 1);
    updatedTasks.splice(destination.index, 0, {
      ...reorderedItem,
      columnId: destination.droppableId,
      movedAt: new Date().toISOString()
    });

    setTasks(updatedTasks);
    updateComponentProps(updatedTasks);
  };

  const handleDoubleClick = (columnId) => {
    if (isInteractive) {
      setSelectedColumnId(columnId);
      setIsModalOpen(true);
    }
  };

  const handleAddTask = (newTask) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    updateComponentProps(updatedTasks);
    setIsModalOpen(false);
  };

  const updateComponentProps = (updatedTasks) => {
    onUpdate(component.id, { props: { ...component.props, tasks: updatedTasks } });
  };

  const getTaskDuration = (task) => {
    const start = new Date(task.createdAt);
    const end = task.completedAt ? new Date(task.completedAt) : new Date();
    const duration = Math.floor((end - start) / (1000 * 60 * 60 * 24)); // in days
    return `${duration} day${duration !== 1 ? 's' : ''}`;
  };

  const getColumnDuration = (task) => {
    const start = new Date(task.movedAt || task.createdAt);
    const end = new Date();
    const duration = Math.floor((end - start) / (1000 * 60 * 60 * 24)); // in days
    return `${duration} day${duration !== 1 ? 's' : ''}`;
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', height: '100%', overflowX: 'auto' }}>
          {columns.map((column) => (
            <div 
              key={column.id} 
              style={{ display: 'flex', flexDirection: 'column', width: `${100 / columns.length}%`, minWidth: '200px', padding: '8px' }}
              onDoubleClick={() => handleDoubleClick(column.id)}
            >
              <h3>{column.title}</h3>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ flex: 1, backgroundColor: '#f4f5f7', padding: '8px', borderRadius: '4px', minHeight: '100px' }}
                  >
                    {tasks
                      .filter((task) => task.columnId === column.id)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={!isInteractive}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                backgroundColor: 'white',
                                padding: '8px',
                                marginBottom: '8px',
                                borderRadius: '4px',
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
      <KanBanTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
        columnId={selectedColumnId}
      />
    </div>
  );
};

export default KanbanRenderer;
