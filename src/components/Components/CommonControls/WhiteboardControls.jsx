import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleComponentDragging, updateComponent } from '../../../features/editorSlice';
import ColorPicker from '../../common/ColorPicker';

const WhiteboardControls = ({ component, onUpdate }) => {
  const dispatch = useDispatch();

  const handleDragToggle = () => {
    dispatch(toggleComponentDragging({
      id: component.id,
      isDraggingDisabled: !component.isDraggingDisabled
    }));
  };

  const handleBackgroundColorChange = (color) => {
    dispatch(updateComponent({
      id: component.id,
      updates: {
        props: {
          ...component.props,
          backgroundColor: color
        }
      }
    }));
  };

  const handleWidthChange = (e) => {
    const width = e.target.value;
    dispatch(updateComponent({
      id: component.id,
      updates: {
        style: {
          ...component.style,
          width: width
        }
      }
    }));
  };

  const handleHeightChange = (e) => {
    const height = e.target.value;
    dispatch(updateComponent({
      id: component.id,
      updates: {
        style: {
          ...component.style,
          height: height
        }
      }
    }));
  };

  return (
    <div className="whiteboard-controls space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Whiteboard Controls</h3>
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Disable Dragging</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={component.isDraggingDisabled}
            onChange={handleDragToggle}
          />
          <span className="slider round"></span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
        <ColorPicker
          color={component.props.backgroundColor || '#ffffff'}
          onChange={handleBackgroundColorChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
        <input
          type="text"
          value={component.style.width || '100%'}
          onChange={handleWidthChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
        <input
          type="text"
          value={component.style.height || '300px'}
          onChange={handleHeightChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
};

export default WhiteboardControls;