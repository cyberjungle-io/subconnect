import React from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';

const TreeNode = ({ component, depth, onSelectComponent }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = component.children && component.children.length > 0;

  return (
    <div className="mb-1">
      <div 
        className={`flex items-center cursor-pointer hover:bg-gray-200 p-1 rounded ${depth > 0 ? 'ml-4' : ''}`}
        onClick={() => onSelectComponent(component.id)}
      >
        {hasChildren && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="mr-1"
          >
            {isOpen ? <FaChevronDown /> : <FaChevronRight />}
          </button>
        )}
        <span>{component.type}</span>
      </div>
      {isOpen && hasChildren && (
        <div className="ml-4">
          {component.children.map(child => (
            <TreeNode 
              key={child.id} 
              component={child} 
              depth={depth + 1} 
              onSelectComponent={onSelectComponent}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ComponentTree = ({ components, onSelectComponent }) => {
  return (
    <div className="component-tree">
      <h3 className="text-lg font-semibold mb-2">Component Tree</h3>
      {components.map(component => (
        <TreeNode 
          key={component.id} 
          component={component} 
          depth={0} 
          onSelectComponent={onSelectComponent}
        />
      ))}
    </div>
  );
};

export default ComponentTree;