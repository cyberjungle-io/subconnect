import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ColorPicker from '../../common/ColorPicker';
import { updateWhiteboardStrokeColor } from '../../../features/editorSlice';

const WhiteboardControls = ({ componentId }) => {
  const dispatch = useDispatch();
  const strokeColor = useSelector(state => state.editor.whiteboardState.strokeColor);

  const handleChange = (color) => {
    dispatch(updateWhiteboardStrokeColor({ componentId, color }));
  };

  return (
    <div className="control-section">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Whiteboard Controls</h3>
      <div className="control-section-content">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Default Stroke Color</label>
          <ColorPicker
            color={strokeColor}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default WhiteboardControls;