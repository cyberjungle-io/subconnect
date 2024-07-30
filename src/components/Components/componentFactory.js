import { componentTypes, componentConfig } from './componentConfig';
import { v4 as uuidv4 } from 'uuid';

let nextId = 1;

export const createComponent = (type, props = {}) => {
  if (!componentTypes[type]) {
    throw new Error(`Invalid component type: ${type}`);
  }

  const config = componentConfig[type];
  
  const newComponent = {
    id: `component-${nextId++}`,
    type,
    acceptsChildren: config.acceptsChildren,
    children: [],
    content: props.content || config.defaultContent || '',
    style: {
      width: props.width || config.defaultSize?.width || 'auto',
      height: props.height || config.defaultSize?.height || 'auto',
      padding: props.padding || '0px',
      margin: props.margin || '0px',
      gap: props.gap || '0px',
      ...props.style
    },
    props: {
      ...config.defaultProps,
      ...props
    }
  };

  
  if (type === 'CHART') {
    newComponent.chartConfig = { 
      ...config.defaultChartConfig, 
      ...props.chartConfig 
    };
  }
 
  if (config.defaultContent && !newComponent.content) {
    newComponent.content = config.defaultContent;
  }

  return newComponent;
};

export const addChildToComponent = (parent, child) => {
  if (!parent.acceptsChildren) {
    throw new Error(`Component of type ${parent.type} does not accept children`);
  }
  return {
    ...parent,
    children: [...parent.children, child]
  };
};

export const updateComponent = (component, updates) => {
  return {
    ...component,
    ...updates,
    style: {
      ...component.style,
      ...updates.style
    },
    props: {
      ...component.props,
      ...updates.props
    }
  };
};