import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { componentTypes, componentConfig } from './componentConfig';
import { createComponent, updateComponent } from './componentFactory';
import ComponentRenderer from './ComponentRenderer';
import AlignmentToolbar from './AlignmentToolbar';
import { alignComponents, distributeComponents } from '../utils/alignmentUtils';

const ComponentPalette = ({ onDragStart }) => (
  <div className="w-64 bg-gray-100 p-4">
    <h2 className="text-lg font-bold mb-4">Components</h2>
    {Object.entries(componentTypes).map(([type, value]) => {
      const config = componentConfig[value];
      return (
        <div
          key={type}
          className="p-2 mb-2 bg-white rounded cursor-move"
          draggable
          onDragStart={(e) => onDragStart(e, value)}
        >
          <config.icon className="inline-block mr-2" />
          {config.name}
        </div>
      );
    })}
  </div>
);

const WireframeEditor = () => {
  const [components, setComponents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('componentType', type);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('componentType');
    const newComponent = createComponent(type);
    setComponents([...components, newComponent]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpdate = (id, updates) => {
    setComponents(components.map(comp => 
      comp.id === id ? updateComponent(comp, updates) : comp
    ));
  };

  const handleSelect = (id, event) => {
    if (event.ctrlKey || event.metaKey) {
      setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    } else {
      setSelectedIds([id]);
    }
  };

  const handleAlign = (alignment) => {
    setComponents(alignComponents(components, selectedIds, alignment));
  };

  const handleDistribute = (direction) => {
    setComponents(distributeComponents(components, selectedIds, direction));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
        <AlignmentToolbar onAlign={handleAlign} onDistribute={handleDistribute} />
        <div className="flex flex-grow">
          <ComponentPalette onDragStart={handleDragStart} />
          <div 
            className="flex-grow p-4 bg-white"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {components.map(component => (
              <ComponentRenderer
                key={component.id}
                component={component}
                onUpdate={handleUpdate}
                onSelect={handleSelect}
                isSelected={selectedIds.includes(component.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default WireframeEditor;