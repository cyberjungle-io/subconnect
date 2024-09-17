import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { FaSquare, FaFont, FaImage, FaTable, FaChartBar, FaTimes } from 'react-icons/fa';
import { componentTypes, componentConfig } from './componentConfig';
import { useSelector } from 'react-redux';

const DraggableComponent = ({ type, icon: Icon, label, savedComponent }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'COMPONENT',
    item: { type, savedComponent }, // Include savedComponent in the item
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`flex flex-col items-center justify-center p-2 bg-[#fafcff] border border-[#d1e3ff] rounded-lg shadow hover:shadow-md hover:bg-[#f5f9ff] hover:border-[#b3d1ff] cursor-move ${
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
  const savedComponents = useSelector(state => state.savedComponents);

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
      className="fixed bg-[#f0f7ff] border border-[#cce0ff] rounded-lg shadow-xl z-[930] p-4 group select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
    >
      <div className="flex justify-between items-center mb-4 pt-2">
        <h3 className="text-lg font-semibold text-gray-700">Component Palette</h3>
        <button onClick={onClose} className="text-gray-700 hover:text-gray-900">
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
            />
          );
        })}
        {savedComponents.map((component) => (
          <DraggableComponent
            key={component.id}
            type="SAVED_COMPONENT"
            icon={componentConfig[component.type]?.icon}
            label={component.name}
            savedComponent={component}
          />
        ))}
      </div>
      <div
        className="absolute top-0 left-0 right-0 h-6 cursor-move bg-[#e1f0ff] rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onMouseDown={handleDragStart}
      />
    </div>
  );
};

export default ComponentPalette;