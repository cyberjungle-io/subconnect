import React from "react";
import ComponentRenderer from "./ComponentRenderer";

const ContainerRenderer = ({ component, ...props }) => {
  const getContainerStyles = () => {
    return {
      display: "flex",
      flexDirection: component.type === "ROW" ? "row" : "column",
      flexWrap: "nowrap",
      alignItems: component.style.alignItems || "stretch",
      justifyContent: component.style.justifyContent || "flex-start",
      gap: component.style.gap || "0px",
      width: "100%",
      height: component.style.height || "100%", // Changed from "auto" to "100%"
      minHeight: component.style.minHeight || "auto",
      overflow: "hidden",
      boxSizing: 'border-box', // Add this to include padding and border in the element's total width and height
    };
  };

  const getChildStyles = (childComponent) => {
    const childStyles = { ...childComponent.style };

    if (component.type === "ROW") {
      childStyles.flexGrow = childComponent.style.flexGrow || 0;
      childStyles.flexShrink = childComponent.style.flexShrink || 1;
      childStyles.flexBasis = childComponent.style.width || "auto";
      
      if (childComponent.type !== "ROW") {
        // For non-row children, set height to 100% if not specified
        childStyles.height = childComponent.style.height || "100%";
      }
    }

    childStyles.boxSizing = 'border-box'; // Add this to include padding and border in the element's total width and height
    return childStyles;
  };

  return (
    <div className="container-renderer" style={getContainerStyles()}>
      {component.children &&
        component.children.map((child) => (
          <ComponentRenderer
            key={child.id}
            component={{ ...child, style: getChildStyles(child) }}
            {...props}
          />
        ))}
    </div>
  );
};

export default ContainerRenderer;