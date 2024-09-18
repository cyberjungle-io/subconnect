import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { FaSquare, FaFont, FaImage, FaTable, FaChartBar, FaTimes, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { componentTypes, componentConfig } from './componentConfig';
import { useSelector } from 'react-redux';

const DraggableComponent = ({ type, icon: Icon, label, savedComponent }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'COMPONENT',
    item: { type, savedComponent },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Remove 'Saved ' prefix if present
  const displayLabel = label.startsWith('Saved ') ? label.slice(6) : label;

  return (
    <div
      ref={drag}
      className={`flex flex-col items-center justify-center p-2 bg-[#fafcff] border border-[#d1e3ff] rounded-lg shadow hover:shadow-md hover:bg-[#f5f9ff] hover:border-[#b3d1ff] cursor-move ${
        isDragging ? 'opacity-50' : ''
      } w-full aspect-square transition-all duration-200`}
    >
      <Icon className="text-2xl mb-1 text-gray-600" />
      <div className="w-full h-8 overflow-hidden">
        <p className="text-xs font-medium text-center leading-4 overflow-hidden overflow-ellipsis">
          {displayLabel.length > 30 ? displayLabel.slice(0, 27) + '...' : displayLabel}
        </p>
      </div>
    </div>
  );
};

const ComponentPalette = ({ isVisible, onClose, initialPosition, onPositionChange, onAddComponent }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const savedComponents = useSelector(state => state.savedComponents);
  const [isPrimitivesExpanded, setIsPrimitivesExpanded] = useState(true);
  const [isSavedExpanded, setIsSavedExpanded] = useState(false);

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
        y: Math.max(e.clientY - startY, 10), // Ensure minimum top position of 10px
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

  const togglePrimitives = () => {
    setIsPrimitivesExpanded(!isPrimitivesExpanded);
  };

  const toggleSavedComponents = () => {
    setIsSavedExpanded(!isSavedExpanded);
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
      <div className="mb-4">
        <button
          className="flex items-center justify-between w-full text-left text-gray-500 hover:text-gray-700 mb-2 py-2 transition-colors duration-200"
          onClick={togglePrimitives}
        >
          <span className="font-medium">Primitives</span>
          {isPrimitivesExpanded ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {isPrimitivesExpanded && (
          <div className="grid grid-cols-2 gap-2 mt-2">
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
          </div>
        )}
      </div>
      <div className="border-t border-[#cce0ff] pt-4">
        <button
          className="flex items-center justify-between w-full text-left text-gray-500 hover:text-gray-700 mb-2 py-2 transition-colors duration-200"
          onClick={toggleSavedComponents}
        >
          <span className="font-medium">Saved Components</span>
          {isSavedExpanded ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {isSavedExpanded && (
          <div className="grid grid-cols-2 gap-2 mt-2">
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
        )}
      </div>
      <div
        className="absolute top-0 left-0 right-0 h-6 cursor-move bg-[#e1f0ff] rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onMouseDown={handleDragStart}
      />
    </div>
  );
};

export default ComponentPalette;