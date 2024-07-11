// src/utils/alignmentUtils.js

export const alignComponentsUtil = (components, selectedIds, alignment) => {
  if (selectedIds.length < 2) return components;

  const selectedComponents = components.filter(c => selectedIds.includes(c.id));
  
  let targetValue;
  switch (alignment) {
    case 'left':
      targetValue = Math.min(...selectedComponents.map(c => c.style.left));
      return components.map(c => 
        selectedIds.includes(c.id) ? { ...c, style: { ...c.style, left: targetValue } } : c
      );
    case 'center':
      const centerX = selectedComponents.reduce((sum, c) => sum + c.style.left + c.style.width / 2, 0) / selectedComponents.length;
      return components.map(c => 
        selectedIds.includes(c.id) ? { ...c, style: { ...c.style, left: centerX - c.style.width / 2 } } : c
      );
    case 'right':
      targetValue = Math.max(...selectedComponents.map(c => c.style.left + c.style.width));
      return components.map(c => 
        selectedIds.includes(c.id) ? { ...c, style: { ...c.style, left: targetValue - c.style.width } } : c
      );
    case 'top':
      targetValue = Math.min(...selectedComponents.map(c => c.style.top));
      return components.map(c => 
        selectedIds.includes(c.id) ? { ...c, style: { ...c.style, top: targetValue } } : c
      );
    case 'middle':
      const centerY = selectedComponents.reduce((sum, c) => sum + c.style.top + c.style.height / 2, 0) / selectedComponents.length;
      return components.map(c => 
        selectedIds.includes(c.id) ? { ...c, style: { ...c.style, top: centerY - c.style.height / 2 } } : c
      );
    case 'bottom':
      targetValue = Math.max(...selectedComponents.map(c => c.style.top + c.style.height));
      return components.map(c => 
        selectedIds.includes(c.id) ? { ...c, style: { ...c.style, top: targetValue - c.style.height } } : c
      );
    default:
      return components;
  }
};

export const distributeComponentsUtil = (components, selectedIds, direction) => {
  if (selectedIds.length < 3) return components;

  const selectedComponents = components.filter(c => selectedIds.includes(c.id));
  
  if (direction === 'horizontal') {
    const sortedComponents = [...selectedComponents].sort((a, b) => a.style.left - b.style.left);
    const totalWidth = sortedComponents.reduce((sum, c) => sum + c.style.width, 0);
    const totalSpace = sortedComponents[sortedComponents.length - 1].style.left + sortedComponents[sortedComponents.length - 1].style.width - sortedComponents[0].style.left - totalWidth;
    const spacing = totalSpace / (sortedComponents.length - 1);

    let currentLeft = sortedComponents[0].style.left;
    return components.map(c => {
      if (!selectedIds.includes(c.id)) return c;
      const index = sortedComponents.findIndex(sc => sc.id === c.id);
      if (index === 0) return c;
      currentLeft += sortedComponents[index - 1].style.width + spacing;
      return { ...c, style: { ...c.style, left: currentLeft } };
    });
  } else if (direction === 'vertical') {
    const sortedComponents = [...selectedComponents].sort((a, b) => a.style.top - b.style.top);
    const totalHeight = sortedComponents.reduce((sum, c) => sum + c.style.height, 0);
    const totalSpace = sortedComponents[sortedComponents.length - 1].style.top + sortedComponents[sortedComponents.length - 1].style.height - sortedComponents[0].style.top - totalHeight;
    const spacing = totalSpace / (sortedComponents.length - 1);

    let currentTop = sortedComponents[0].style.top;
    return components.map(c => {
      if (!selectedIds.includes(c.id)) return c;
      const index = sortedComponents.findIndex(sc => sc.id === c.id);
      if (index === 0) return c;
      currentTop += sortedComponents[index - 1].style.height + spacing;
      return { ...c, style: { ...c.style, top: currentTop } };
    });
  }

  return components;
};