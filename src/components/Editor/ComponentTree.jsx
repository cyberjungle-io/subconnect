import React, { useState, useRef, useEffect } from 'react';
import { componentConfig } from '../Components/componentConfig';
import { useDispatch } from 'react-redux';
import { FaTimes } from 'react-icons/fa';

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



const TreeNode = ({ component, depth, onSelectComponent, selectedComponentId }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = component.children && component.children.length > 0;
  const isSelected = component.id === selectedComponentId;
  const nodeRef = useRef(null);

  const Icon = componentConfig[component.type]?.icon || (() => null);

  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSelectComponent(component.id, component, true);
  };

  return (
    <div 
      ref={nodeRef}
      className={`mb-1 ${depth > 0 ? 'ml-3' : ''}`}
    >
      <div 
        className={`flex items-center cursor-pointer p-1 rounded text-sm
                    ${isSelected 
                      ? 'bg-[#cce7ff] text-blue-600 border border-blue-300' 
                      : 'hover:bg-[#d9ecff] border border-transparent'
                    }`}
        onClick={(e) => {
          e.stopPropagation();
          onSelectComponent(component.id, component, false);
        }}
        onDoubleClick={handleDoubleClick}
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
          <span className="ml-1 truncate flex-grow">
            {component.name || component.type}
          </span>
        </div>
      </div>
      {isOpen && hasChildren && (
        <div className="border-l border-[#cce0ff] ml-2 pl-2">
          {component.children.map(child => (
            <TreeNode 
              key={child.id} 
              component={child} 
              depth={depth + 1} 
              onSelectComponent={onSelectComponent}
              selectedComponentId={selectedComponentId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ComponentTree = ({ components, onSelectComponent, selectedComponentId, isVisible, onClose, initialPosition }) => {
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight / 2 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleComponentSelect = (componentId, component, openToolbar = false) => {
    onSelectComponent(componentId, component, openToolbar);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const updateTreeSize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateTreeSize();
    window.addEventListener('resize', updateTreeSize);

    return () => window.removeEventListener('resize', updateTreeSize);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-[940] bg-[#f0f7ff] border border-[#cce0ff] rounded-lg shadow-xl p-4 group select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxWidth: '280px',
        width: '90%',
        maxHeight: 'calc(var(--vh, 1vh) * 70)',
        overflow: 'auto',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        transform: 'scale(0.8)', // Slightly reduce the size
      }}
    >
      <div
        className="flex justify-between items-center mb-4 pt-2"
        onMouseDown={handleMouseDown}
      >
        <h3 className="text-lg font-semibold text-gray-700">Component Tree</h3>
        <button onClick={onClose} className="text-gray-700 hover:text-gray-900">
          <FaTimes />
        </button>
      </div>
      <div className="border-t border-[#cce0ff] pt-2">
        {components.map(component => (
          <TreeNode 
            key={component.id} 
            component={component} 
            depth={0} 
            onSelectComponent={handleComponentSelect}
            selectedComponentId={selectedComponentId}
          />
        ))}
      </div>
      <div
        className="absolute top-0 left-0 right-0 h-6 cursor-move bg-[#e1f0ff] rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default ComponentTree;
