import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { FaTimes, FaPencilAlt, FaFolderOpen, FaListUl } from 'react-icons/fa';
import FourSquaresIcon from '../common/CustomIcons/FourSquareIcon';
import { componentTypes, componentConfig } from './componentConfig';
import { useSelector, useDispatch } from 'react-redux';
import { renameSavedComponent, deleteSavedComponent, saveSingleComponent } from '../../features/savedComponentsSlice';

const DraggableComponent = ({ type, icon: Icon, label, savedComponent }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'COMPONENT',
    item: { 
      type: savedComponent ? 'SAVED_COMPONENT' : type,
      savedComponent: savedComponent ? {
        ...savedComponent,
        id: undefined, // Remove the original ID so a new one will be generated
      } : null,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(label);

  const handleRename = () => {
    if (newName.trim() !== '') {
      const updatedComponent = {
        ...savedComponent,
        name: newName.trim()
      };
      dispatch(renameSavedComponent({ id: savedComponent.id, newName: newName.trim() }));
      dispatch(saveSingleComponent(updatedComponent));
      setIsEditing(false);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    dispatch(deleteSavedComponent(savedComponent.id));
  };

  // Remove 'Saved ' prefix if present
  const displayLabel = label.startsWith('Saved ') ? label.slice(6) : label;

  return (
    <div
      ref={drag}
      className={`relative flex flex-col items-center justify-center p-2 bg-[#fafcff] border border-[#d1e3ff] rounded-lg shadow hover:shadow-md hover:bg-[#f5f9ff] hover:border-[#b3d1ff] cursor-move ${
        isDragging ? 'opacity-50' : ''
      } w-20 h-20 transition-all duration-200`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon className="text-xl mb-1 text-gray-600" />
      <div className="w-full h-6 overflow-hidden">
        {isEditing ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyPress={(e) => e.key === 'Enter' && handleRename()}
            className="w-full text-xs font-medium text-center"
            autoFocus
          />
        ) : (
          <p className="text-xs font-medium text-center leading-3 overflow-hidden">
            {displayLabel}
          </p>
        )}
      </div>
      {isHovered && savedComponent && !isEditing && (
        <>
          <button
            className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
            onClick={() => setIsEditing(true)}
          >
            <FaPencilAlt size={12} />
          </button>
          <button
            className="absolute top-1 left-1 text-gray-500 hover:text-red-600"
            onClick={handleDelete}
          >
            <FaTimes size={12} />
          </button>
        </>
      )}
    </div>
  );
};

const ComponentPalette = ({ isVisible, onClose, initialPosition, onPositionChange, onAddComponent }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const savedComponents = useSelector(state => state.savedComponents.items);
  const [currentView, setCurrentView] = useState('Primitives');

  useEffect(() => {
    if (!isDragging) {
      setPosition(initialPosition);
    }
  }, [initialPosition, isDragging]);

  useEffect(() => {
    const updatePaletteSize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updatePaletteSize();
    window.addEventListener('resize', updatePaletteSize);

    return () => window.removeEventListener('resize', updatePaletteSize);
  }, []);

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

  if (!isVisible) return null;

  return (
    <div
      className="fixed bg-[#f0f7ff] border border-[#cce0ff] rounded-lg shadow-xl z-[930] p-4 group select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxWidth: '280px',
        width: '90%',
        height: 'auto', // Changed from maxHeight
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        transform: 'scale(0.8)', // Changed to 0.8
      }}
    >
      <div className="flex justify-between items-center mb-4 pt-2">
        <h3 className="text-md font-semibold text-gray-700">Component Palette</h3>
        <div className="flex items-center">
          {currentView === 'Primitives' ? (
            <button
              onClick={() => setCurrentView('SavedComponents')}
              className="text-gray-700 hover:text-gray-900 p-1"
              title="Saved Components"
            >
              <FaFolderOpen />
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('Primitives')}
              className="text-gray-700 hover:text-gray-900 p-1"
              title="Primitives"
            >
              <FourSquaresIcon />
            </button>
          )}
          <button onClick={onClose} className="text-gray-700 hover:text-gray-900 p-1 ">
            <FaTimes />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        {currentView === 'Primitives' ? (
          Object.entries(componentTypes).map(([key, type]) => {
            const config = componentConfig[type];
            return (
              <DraggableComponent
                key={key}
                type={type}
                icon={config.icon}
                label={config.name}
              />
            );
          })
        ) : (
          savedComponents.map((component) => (
            <DraggableComponent
              key={component.id}
              type="SAVED_COMPONENT"
              icon={componentConfig[component.type]?.icon}
              label={component.name}
              savedComponent={component}
            />
          ))
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
