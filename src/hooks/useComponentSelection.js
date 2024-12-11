import { useSelector } from 'react-redux';

export const useComponentSelection = () => {
  const selectedIds = useSelector((state) => state.editor.selectedIds);
  const components = useSelector((state) => state.editor.components);

  const findSelectedComponent = (components, selectedId) => {
    let deepestMatch = null;
    let maxDepth = -1;

    const searchComponent = (component, depth = 0) => {
      if (component.id === selectedId && depth > maxDepth) {
        deepestMatch = component;
        maxDepth = depth;
      }
      
      if (component.children && component.children.length > 0) {
        component.children.forEach(child => {
          searchComponent(child, depth + 1);
        });
      }
    };

    components.forEach(component => searchComponent(component));
    
    if (deepestMatch) {
      // Find and attach immediate parent if it exists
      const findParent = (components, targetId, parent = null) => {
        for (const comp of components) {
          if (comp.id === targetId) return parent;
          if (comp.children) {
            const found = findParent(comp.children, targetId, comp);
            if (found) return found;
          }
        }
        return null;
      };
      
      const parent = findParent(components, deepestMatch.id);
      if (parent) {
        return {
          ...deepestMatch,
          parent
        };
      }
    }
    
    return deepestMatch;
  };

  const selectedComponent = selectedIds.length === 1
    ? findSelectedComponent(components, selectedIds[0])
    : null;

  return {
    selectedComponent,
    hasSelection: selectedIds.length > 0
  };
}; 