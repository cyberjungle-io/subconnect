// ViewerMode.jsx

import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ComponentRenderer from '../Components/Renderers/ComponentRenderer';
import { defaultGlobalSettings } from '../../utils/defaultGlobalSettings';
import { getCanvasStyle } from '../Editor/Canvas';
import { updateComponent } from '../../features/editorSlice';
import { updateTodoTasks } from '../../features/editorSlice';

const ViewerMode = ({ components }) => {
  const dispatch = useDispatch();
  const globalSettings = useSelector(state => state.editor.globalSettings);
  const canvasSettings = useSelector(state => state.editor.canvasSettings);
  const { backgroundColor = '#ffffff', componentLayout = 'vertical', style = {} } = { ...defaultGlobalSettings, ...globalSettings };

  const canvasStyle = getCanvasStyle(canvasSettings, componentLayout);

  const handleUpdateComponent = useCallback((id, updates) => {
    if (updates.props && updates.props.tasks) {
      dispatch(updateTodoTasks({ componentId: id, tasks: updates.props.tasks }));
    } else {
      dispatch(updateComponent({ id, updates }));
    }
  }, [dispatch]);

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
          onUpdate={handleUpdateComponent}
          isInteractive={false}
        />
      ))}
    </div>
  );
};

export default ViewerMode;
