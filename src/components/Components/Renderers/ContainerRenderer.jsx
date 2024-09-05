import React from "react";
import ComponentRenderer from "./ComponentRenderer";

const ContainerRenderer = ({ component, depth, isTopLevel, globalSettings = {}, isDragModeEnabled, ...props }) => {
  const getContainerStyles = () => {
    const { style, props: componentProps } = component;

    return {
      display: "flex",
      flexDirection: componentProps.direction || "row",
      flexWrap: componentProps.wrap || "nowrap",
      alignItems: componentProps.alignItems || "stretch",
      justifyContent: componentProps.justifyContent || "flex-start",
      gap: style.gap || "0px",
      width: style.width || "100%",
      height: style.height || "auto",
      minHeight: style.minHeight || "auto",
      overflow: "hidden",
      boxSizing: 'border-box',
      padding: style.padding || "0px",
      borderRadius: style.borderRadius || '4px',
      ...style, // Add this line to include any other custom styles
    };
  };

  const renderChildren = () => {
    if (!component.children || component.children.length === 0) {
      return null;
    }

    return component.children.map((child) => (
      <ComponentRenderer
        key={child.id}
        component={child}
        depth={depth + 1}
        isDragModeEnabled={isDragModeEnabled}
        globalSettings={globalSettings}
        isFlexChild={true}
        {...props}
      />
    ));
  };

  return (
    <div className="container-renderer" style={getContainerStyles()}>
      {renderChildren()}
    </div>
  );
};

export default ContainerRenderer;