import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { FaSquare, FaFont, FaImage, FaTable, FaChartBar, FaTimes } from 'react-icons/fa';
import { componentTypes, componentConfig } from './componentConfig';

const DraggableComponent = ({ type, icon: Icon, label, onAddComponent }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'COMPONENT',
    item: { type },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onAddComponent(item.type, null, dropResult);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`flex flex-col items-center justify-center p-2 bg-white rounded-lg shadow hover:shadow-md hover:bg-blue-50 cursor-move ${
        isDragging ? 'opacity-50' : ''
      } w-full aspect-square transition-all duration-200`}
    >
      <Icon className="text-2xl mb-1 text-gray-600" />
      <span className="text-xs font-medium text-center truncate w-full">{label}</span>
    </div>
  );
};

const ComponentPalette = ({ isVisible, onClose, initialPosition, onPositionChange, onAddComponent }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setPosition(initialPosition);
    }
  }, [initialPosition, isDragging]);

  const handleDragStart = (e) => {
    setIsDragging(true);
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e) => {
      const newPosition = {
        x: e.clientX - startX,
        y: e.clientY - startY,
      };
      setPosition(newPosition);
      onPositionChange(newPosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Component Palette</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(componentTypes).map(([key, type]) => {
          const config = componentConfig[type];
          return (
            <DraggableComponent
              key={key}
              type={type}
              icon={config.icon}
              label={config.name}
              onAddComponent={onAddComponent}
            />
          );
        })}
      </div>
      <div
        className="absolute top-0 left-0 right-0 h-6 cursor-move bg-gray-100 rounded-t-lg"
        onMouseDown={handleDragStart}
      />
    </div>
  );
};

export default ComponentPalette;