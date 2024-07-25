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
      className={`flex flex-col items-center justify-center p-2 bg-white rounded-lg shadow hover:shadow-md hover:bg-blue-50 cursor-move ${
        isDragging ? 'opacity-50' : ''
      } w-full aspect-square transition-all duration-200`}
    >
      <Icon className="text-2xl mb-1 text-gray-600" />
      <span className="text-xs font-medium text-center truncate w-full">{label}</span>
    </div>
  );
};

const ComponentPalette = () => {
  return (
    <div className="space-y-4">
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
      </div>
    </div>
  );
};

export default ComponentPalette;