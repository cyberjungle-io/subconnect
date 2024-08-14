// ViewerMode.jsx

import React from 'react';
import { useSelector } from 'react-redux';
import ComponentRenderer from '../Components/Renderers/ComponentRenderer';
import { defaultGlobalSettings } from '../../utils/defaultGlobalSettings';

const ViewerMode = ({ components }) => {
  const globalSettings = useSelector(state => state.editor.globalSettings);
  const { backgroundColor, componentLayout, style, chartStyle } = { ...defaultGlobalSettings, ...globalSettings };

  const canvasStyle = {
    backgroundColor,
    padding: `${style.paddingTop || '0px'} ${style.paddingRight || '0px'} ${style.paddingBottom || '0px'} ${style.paddingLeft || '0px'}`,
    margin: `${style.marginTop || '0px'} ${style.marginRight || '0px'} ${style.marginBottom || '0px'} ${style.marginLeft || '0px'}`,
    gap: style.gap || '0px',
    display: 'flex',
    flexDirection: componentLayout === 'vertical' ? 'row' : 'column',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    alignContent: 'stretch',
    minHeight: "500px",
    width: '100%',
    height: '100%',
    position: 'relative',
  };

  return (
    <div className="viewer-mode" style={canvasStyle}>
      {components.map(component => (
        <ComponentRenderer
          key={component.id}
          component={component}
          isViewMode={true}
          globalComponentLayout={componentLayout}
          globalChartStyle={chartStyle}
        />
      ))}
    </div>
  );
};

export default ViewerMode;