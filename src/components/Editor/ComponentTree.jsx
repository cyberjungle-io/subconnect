import React, { useState, useRef, useEffect } from 'react';
import { componentConfig } from '../Components/componentConfig';

// Custom monotone SVG icons
const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);



const TreeNode = ({ component, depth, onSelectComponent, selectedComponentId, onRenameComponent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(component.name || component.type);
  const inputRef = useRef(null);
  const hasChildren = component.children && component.children.length > 0;
  const isSelected = component.id === selectedComponentId;

  const Icon = componentConfig[component.type]?.icon || (() => null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleRename = () => {
    if (editedName.trim() !== '' && editedName !== (component.name || component.type)) {
      onRenameComponent(component.id, editedName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditedName(component.name || component.type);
      setIsEditing(false);
    }
  };

  return (
    <div className={`mb-1 ${depth > 0 ? 'ml-3' : ''}`}>
      <div 
        className={`flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded text-sm
                    ${isSelected ? 'bg-gray-200' : ''}`}
        onClick={() => !isEditing && onSelectComponent(component.id)}
      >
        <div className="flex items-center flex-grow text-gray-600">
          {hasChildren && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="mr-1 hover:text-gray-800"
            >
              {isOpen ? <ChevronDown /> : <ChevronRight />}
            </button>
          )}
          {!hasChildren && <div className="w-3 mr-1" />}
          <Icon className="w-4 h-4 mr-1" />
          {isEditing ? (
            <input
              ref={inputRef}
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className="ml-1 px-1 py-0 w-full bg-white border border-gray-300 rounded"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span 
              className="ml-1 truncate flex-grow"
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              {component.name || component.type}
            </span>
          )}
        </div>
      </div>
      {isOpen && hasChildren && (
        <div className="border-l border-gray-200 ml-2 pl-2">
          {component.children.map(child => (
            <TreeNode 
              key={child.id} 
              component={child} 
              depth={depth + 1} 
              onSelectComponent={onSelectComponent}
              selectedComponentId={selectedComponentId}
              onRenameComponent={onRenameComponent}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ComponentTree = ({ components, onSelectComponent, selectedComponentId, onRenameComponent }) => {
  return (
    <div className="component-tree bg-white rounded-lg shadow p-3 max-h-64 overflow-y-auto">
      <h3 className="text-sm font-semibold mb-2 text-gray-700">Component Tree</h3>
      <div className="border-t border-gray-200 pt-2">
        {components.map(component => (
          <TreeNode 
            key={component.id} 
            component={component} 
            depth={0} 
            onSelectComponent={onSelectComponent}
            selectedComponentId={selectedComponentId}
            onRenameComponent={onRenameComponent}
          />
        ))}
      </div>
    </div>
  );
};

export default ComponentTree;