import React, { useState } from 'react';

const ComponentRenderer = ({ component, onUpdate }) => {
  switch (component.type) {
    case 'CONTAINER':
      return (
        <div className="p-2 border border-gray-300">
          {component.children.map((child, index) => (
            <ComponentRenderer 
              key={index} 
              component={child} 
              onUpdate={(updatedChild) => {
                const newChildren = [...component.children];
                newChildren[index] = updatedChild;
                onUpdate({ ...component, children: newChildren });
              }}
            />
          ))}
        </div>
      );
    case 'TEXT':
      return <div className="p-2 bg-gray-100">Text Component</div>;
    case 'IMAGE':
      return <div className="p-2 bg-gray-200">Image Component</div>;
    default:
      return null;
  }
};

const NestedComponentsEditor = () => {
  const [components, setComponents] = useState([
    {
      type: 'CONTAINER',
      children: [
        { type: 'TEXT' },
        { 
          type: 'CONTAINER', 
          children: [
            { type: 'IMAGE' },
            { type: 'TEXT' }
          ]
        }
      ]
    }
  ]);

  const handleUpdate = (index, updatedComponent) => {
    const newComponents = [...components];
    newComponents[index] = updatedComponent;
    setComponents(newComponents);
  };

  return (
    <div>
      {components.map((component, index) => (
        <ComponentRenderer 
          key={index} 
          component={component} 
          onUpdate={(updatedComponent) => handleUpdate(index, updatedComponent)}
        />
      ))}
    </div>
  );
};

export default NestedComponentsEditor;