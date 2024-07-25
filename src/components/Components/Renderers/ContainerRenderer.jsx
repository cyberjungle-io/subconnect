import React from "react";
import ComponentRenderer from "./ComponentRenderer";

const ContainerRenderer = ({ component, ...props }) => {
  const getRowStyles = () => {
    if (component.type !== "ROW") return {};

    return {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: component.style.alignItems || "stretch",
      justifyContent: component.style.justifyContent || "flex-start",
      gap: component.style.gap || "0px",
      minHeight: component.style.height || "300px",
      height: component.style.height || '300px',
      overflow: "hidden",
    };
  };

  const getChildStyles = (childComponent) => {
    if (component.type !== "ROW") return childComponent.style;

    return {
      ...childComponent.style,
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: "auto",
      maxWidth: "100%",
      maxHeight: "100%",
    };
  };

  return (
    <div
      className="p-2 border border-gray-300"
      style={{
        ...component.style,
        ...getRowStyles(),
        width: component.type === "ROW" ? "100%" : component.style.width,
      }}
    >
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