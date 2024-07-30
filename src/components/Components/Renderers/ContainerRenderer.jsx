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
      height: component.style.height || "100%",
      minHeight: component.style.minHeight || "auto",
      overflow: "hidden",
      boxSizing: 'border-box',
      padding: component.style.padding || "0px",
      margin: component.style.margin || "0px",
    };
  };

  const getChildStyles = (childComponent) => {
    const childStyles = { ...childComponent.style };

    if (component.type === "ROW") {
      if (childComponent.type === "ROW") {
        // For nested rows, set them to stack vertically
        childStyles.width = "100%";
        childStyles.flexBasis = "auto";
        childStyles.flexGrow = 0;
        childStyles.flexShrink = 0;
      } else {
        // For non-row children, keep them side by side
        childStyles.flexGrow = childComponent.style.flexGrow || 0;
        childStyles.flexShrink = childComponent.style.flexShrink || 1;
        childStyles.flexBasis = childComponent.style.width || "auto";
        childStyles.height = childComponent.style.height || "100%";
      }
    }

    childStyles.boxSizing = 'border-box';
    return childStyles;
  };

  const renderChildren = () => {
    if (!component.children || component.children.length === 0) {
      return null;
    }

    // Group children by type (ROW and non-ROW)
    const groupedChildren = component.children.reduce((acc, child) => {
      if (child.type === "ROW") {
        acc.rows.push(child);
      } else {
        acc.others.push(child);
      }
      return acc;
    }, { rows: [], others: [] });

    // Render non-ROW children in a flex container
    const otherChildren = (
      <div style={{ display: "flex", flexDirection: "row", flexGrow: 1 }}>
        {groupedChildren.others.map((child) => (
          <ComponentRenderer
            key={child.id}
            component={{ ...child, style: getChildStyles(child) }}
            {...props}
          />
        ))}
      </div>
    );

    // Render ROW children stacked vertically
    const rowChildren = groupedChildren.rows.map((child) => (
      <ComponentRenderer
        key={child.id}
        component={{ ...child, style: getChildStyles(child) }}
        {...props}
      />
    ));

    // Combine other children and row children
    return (
      <>
        {otherChildren}
        {rowChildren}
      </>
    );
  };

  return (
    <div className="container-renderer" style={getContainerStyles()}>
      {renderChildren()}
    </div>
  );
};

export default ContainerRenderer;