// ViewerMode.jsx

import React from 'react';
import ComponentRenderer from '../Components/Renderers/ComponentRenderer';

const ViewerMode = ({ components }) => {
  return (
    <div className="viewer-mode" style={{ height: '100%', width: '100%', position: 'relative' }}>
      {components.map(component => (
        <ComponentRenderer
          key={component.id}
          component={component}
          isViewMode={true}
        />
      ))}
    </div>
  );
};

export default ViewerMode;