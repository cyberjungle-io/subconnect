import React from "react";
import ComponentRenderer from "../Components/Renderers/ComponentRenderer";

const FlexContainer = ({ component, ...props }) => {
  const getContainerStyles = () => {
    return {
      display: "flex",
      flexDirection: component.props.direction || "row",
      flexWrap: component.props.wrap || "nowrap",
      alignItems: component.props.alignItems || "stretch",
      justifyContent: component.props.justifyContent || "flex-start",
      gap: component.props.gap || "0px",
      width: component.style.width || "100%",
      height: component.style.height || "auto",
      minHeight: component.style.minHeight || "auto",
      overflow: "hidden",
      boxSizing: 'border-box',
    };
  };

  const getChildStyles = (childComponent) => {
    const childStyles = { ...childComponent.style };
    childStyles.flexGrow = childComponent.props.flexGrow || 0;
    childStyles.flexShrink = childComponent.props.flexShrink || 1;
    childStyles.flexBasis = childComponent.props.flexBasis || "auto";
    childStyles.boxSizing = 'border-box';
    return childStyles;
  };

  const renderChildren = () => {
    if (!component.children || component.children.length === 0) {
      return null;
    }

    return component.children.map((child) => (
      <ComponentRenderer
        key={child.id}
        component={{ ...child, style: getChildStyles(child) }}
        {...props}
      />
    ));
  };

  return (
    <div className="flex-container" style={getContainerStyles()}>
      {renderChildren()}
    </div>
  );
};

export default FlexContainer;