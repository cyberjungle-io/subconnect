import React, { useState, useRef } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DraggableComponent = ({ id, type, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'COMPONENT',
    item: { id, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  );
};

const DroppableArea = ({ onDrop, children }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'COMPONENT',
    drop: (item, monitor) => onDrop(item, monitor.getClientOffset()),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} style={{ minHeight: '200px', background: isOver ? '#f0f0f0' : 'white' }}>
      {children}
    </div>
  );
};

const WireframeEditor = () => {
  const [components, setComponents] = useState([]);

  const handleDrop = (item, offset) => {
    setComponents([...components, { ...item, position: offset }]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex">
        <div className="w-1/4 p-4 bg-gray-100">
          <h2 className="text-lg font-bold mb-4">Components</h2>
          <DraggableComponent id="text" type="TEXT">
            <div className="p-2 bg-white mb-2 cursor-move">Text</div>
          </DraggableComponent>
          <DraggableComponent id="image" type="IMAGE">
            <div className="p-2 bg-white mb-2 cursor-move">Image</div>
          </DraggableComponent>
          {/* Add more draggable components here */}
        </div>
        <div className="w-3/4 p-4">
          <DroppableArea onDrop={handleDrop}>
            {components.map((component, index) => (
              <div key={index} style={{ position: 'absolute', left: component.position.x, top: component.position.y }}>
                {component.type === 'TEXT' && <div className="p-2 bg-gray-200">Text Component</div>}
                {component.type === 'IMAGE' && <div className="p-2 bg-gray-200">Image Component</div>}
                {/* Render other component types */}
              </div>
            ))}
          </DroppableArea>
        </div>
      </div>
    </DndProvider>
  );
};

export default WireframeEditor;