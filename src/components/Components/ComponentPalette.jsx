import React from 'react';
import { useDrag } from 'react-dnd';
import { FaSquare, FaFont, FaImage, FaTable, FaChartBar } from 'react-icons/fa';
import { componentTypes, componentConfig } from './componentConfig';

const DraggableComponent = ({ type, icon: Icon, label }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'COMPONENT',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`flex items-center p-2 bg-white rounded hover:bg-gray-100 cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <Icon className="mr-2" />
      <span>{label}</span>
    </div>
  );
};

const ComponentPalette = () => {
  return (
    <div className="w-64 bg-gray-200 p-4">
      <h2 className="text-lg font-bold mb-4">Components</h2>
      <div className="space-y-2">
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
    </div>
  );
};

export default ComponentPalette;