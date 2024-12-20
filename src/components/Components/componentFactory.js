import { componentTypes, componentConfig } from './componentConfig';
import { v4 as uuidv4 } from 'uuid';

export const createComponent = (type, props = {}) => {
  if (!componentTypes[type]) {
    throw new Error(`Invalid component type: ${type}`);
  }

  const config = componentConfig[type];
  const componentId = props.id || props.props?.id || uuidv4();
  
  const newComponent = {
    id: componentId,
    type,
    name: props.name || `${type}_${componentId.substr(0, 8)}`,
    acceptsChildren: config.acceptsChildren,
    children: props.children || [],
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
      ...props,
      id: componentId
    }
  };

  
  if (type === 'CHART') {
    newComponent.props = {
      ...newComponent.props,
      dataKeys: props.dataKeys || [],
      nameKey: props.nameKey || 'name',
      chartType: props.chartType || 'line',
      // Add any other necessary default props for charts
    };
  }

  if (type === 'TODO') {
    newComponent.props = {
      ...newComponent.props,
      tasks: props.tasks || [],
      title: props.title || 'Todo List',
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
