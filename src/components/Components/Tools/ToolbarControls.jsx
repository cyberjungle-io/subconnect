import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateToolbarSettings } from '../../../features/editorSlice';
import ColorPicker from '../../common/ColorPicker';

const ToolbarControls = () => {
  const dispatch = useDispatch();
  const toolbarSettings = useSelector(state => state.editor.toolbarSettings) || {};

  const handleColorChange = (colorType, color) => {
    dispatch(updateToolbarSettings({
      [colorType]: color
    }));
  };

  return (
    <div className="toolbar-controls p-4">
      <h3 className="text-lg font-semibold mb-4">Toolbar Settings</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Background Color</label>
        <ColorPicker
          color={toolbarSettings.backgroundColor || '#e8e8e8'}
          onChange={(color) => handleColorChange('backgroundColor', color)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Text Color</label>
        <ColorPicker
          color={toolbarSettings.textColor || '#333333'}
          onChange={(color) => handleColorChange('textColor', color)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Button Hover Color</label>
        <ColorPicker
          color={toolbarSettings.buttonHoverColor || '#d0d0d0'}
          onChange={(color) => handleColorChange('buttonHoverColor', color)}
        />
      </div>
    </div>
  );
};

export default ToolbarControls;
