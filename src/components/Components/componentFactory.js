import { componentTypes, componentConfig } from './componentConfig';

let nextId = 1;

export const createComponent = (type, props = {}) => {
  if (!componentTypes[type]) {
    throw new Error(`Invalid component type: ${type}`);
  }

  const config = componentConfig[type];
  
  return {
    id: `component-${nextId++}`,
    type,
    acceptsChildren: config.acceptsChildren,
    children: [],
    content: props.content || config.defaultContent || '',
    style: {
      width: props.width || config.defaultSize?.width || 'auto',
      height: props.height || config.defaultSize?.height || 'auto',
      ...props.style
    }
  };
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
    }
  };
};