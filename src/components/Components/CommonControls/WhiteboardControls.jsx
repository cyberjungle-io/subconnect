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

  const handleGridToggle = () => {
    dispatch(updateComponent({
      id: component.id,
      updates: {
        props: {
          ...component.props,
          showGrid: !component.props.showGrid
        }
      }
    }));
  };

  const handlePropChange = (prop, value) => {
    dispatch(updateComponent({
      id: component.id,
      updates: {
        props: {
          ...component.props,
          [prop]: value
        }
      }
    }));
  };

  return (
    <div className="control-section">
      <div className="control-section-header">
        <span className="control-section-title">Whiteboard Controls</span>
      </div>
      <div className="control-section-content">
        <div className="mb-2">
          <label className="control-label">
            <input
              type="checkbox"
              checked={component.isDraggingDisabled}
              onChange={handleDragToggle}
              className="mr-2"
            />
            Disable Dragging
          </label>
        </div>

        <div className="mb-2">
          <label className="control-label">Background Color</label>
          <ColorPicker
            color={component.props.backgroundColor || '#ffffff'}
            onChange={handleBackgroundColorChange}
          />
        </div>

        <div className="mb-2">
          <label className="control-label">Width</label>
          <input
            type="text"
            value={component.style.width || '100%'}
            onChange={handleWidthChange}
            className="control-input"
          />
        </div>

        <div className="mb-2">
          <label className="control-label">Height</label>
          <input
            type="text"
            value={component.style.height || '300px'}
            onChange={handleHeightChange}
            className="control-input"
          />
        </div>

        <div className="mb-2">
          <label className="control-label">
            <input
              type="checkbox"
              checked={component.props.showGrid}
              onChange={handleGridToggle}
              className="mr-2"
            />
            Show Grid
          </label>
        </div>

        <div className="mb-2">
          <label className="control-label">Default Stroke Color</label>
          <ColorPicker
            color={component.props.strokeColor || '#000000'}
            onChange={(color) => handlePropChange('strokeColor', color)}
          />
        </div>

        <div className="mb-2">
          <label className="control-label">Default Stroke Width</label>
          <input
            type="number"
            value={component.props.strokeWidth || 2}
            onChange={(e) => handlePropChange('strokeWidth', e.target.value)}
            className="control-input"
            min="1"
            max="20"
          />
        </div>
      </div>
    </div>
  );
};

export default WhiteboardControls;