// ViewerMode.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import ComponentRenderer from '../Components/Renderers/ComponentRenderer';
import { defaultGlobalSettings } from '../../utils/defaultGlobalSettings';
import { getCanvasStyle } from '../Editor/Canvas';

const ViewerMode = ({ components }) => {
  const globalSettings = useSelector(state => state.editor.globalSettings);
  const canvasSettings = useSelector(state => state.editor.canvasSettings);
  const { backgroundColor = '#ffffff', componentLayout = 'vertical', style = {} } = { ...defaultGlobalSettings, ...globalSettings };

  const canvasStyle = getCanvasStyle(canvasSettings, componentLayout);

  return (
    <div className="viewer-mode canvas-area w-full h-full bg-gray-100 overflow-auto" style={canvasStyle}>
      {components.map(component => (
        <ComponentRenderer
          key={component.id}
          component={component}
          isViewMode={true}
          globalComponentLayout={componentLayout}
          globalSettings={globalSettings}
          isTopLevel={true}
        />
      ))}
    </div>
  );
};

export default ViewerMode;