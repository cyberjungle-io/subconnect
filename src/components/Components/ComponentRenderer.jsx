import React from "react";
import { useDrop, useDrag } from "react-dnd";
import { componentConfig } from "./componentConfig";
import {
  LineChart,
  BarChart,
  AreaChart,
  PieChart,
  Line,
  Bar,
  Area,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ComponentRenderer = ({
  component,
  onUpdate,
  onSelect,
  isSelected,
  onAddChild,
  onMoveComponent,
  depth = 0,
}) => {
  const config = componentConfig[component.type];

  const [{ isDragging }, drag] = useDrag({
    type: "COMPONENT",
    item: { id: component.id, type: component.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "COMPONENT",
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      if (item.id) {
        onMoveComponent(item.id, component.id);
      } else {
        onAddChild(component.id, item.type);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  });

  const handleClick = (event) => {
    event.stopPropagation();
    const isMultiSelect = event.ctrlKey || event.metaKey;
    onSelect(component.id, isMultiSelect);
  };

  // Updated function to handle row-specific styles
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
      overflow: "hidden", // Prevent content from overflowing
    };
  };

  // New function to handle child component styles
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

  const renderContent = () => {
    switch (component.type) {
      case "CONTAINER":
      case "ROW":
        return (
          <div
            ref={drop}
            className={`p-2 border border-gray-300 ${
              isOver ? "bg-blue-100" : ""
            }`}
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
                  onUpdate={onUpdate}
                  onSelect={onSelect}
                  onAddChild={onAddChild}
                  onMoveComponent={onMoveComponent}
                  isSelected={isSelected}
                  depth={depth + 1}
                />
              ))}
          </div>
        );
      case "COLUMN":
        return (
          <div
            ref={drop}
            className={`p-2 border border-gray-300 ${
              isOver ? "bg-blue-100" : ""
            }`}
            style={{
              ...component.style,
              display: "flex",
              flexDirection: "column",
              minHeight: "50px",
            }}
          >
            {component.children &&
              component.children.map((child) => (
                <ComponentRenderer
                  key={child.id}
                  component={child}
                  onUpdate={onUpdate}
                  onSelect={onSelect}
                  onAddChild={onAddChild}
                  onMoveComponent={onMoveComponent}
                  isSelected={isSelected}
                  depth={depth + 1}
                />
              ))}
          </div>
        );
      case "TEXT":
        return (
          <p className="w-full h-full overflow-hidden">
            {component.content || "Text Component"}
          </p>
        );
      case "IMAGE":
        return (
          <img
            src={component.content || "https://via.placeholder.com/150"}
            alt="placeholder"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        );
      case "BUTTON":
        return (
          <button className="px-4 py-2 bg-blue-500 text-white rounded w-full h-full">
            {component.content || "Button"}
          </button>
        );
      case "CHART":
        return renderChart();
      default:
        return null;
    }
  };

  const renderChart = () => {
    const { chartType, data, dataKey, nameKey } = component.chartConfig || {};

    const CommonProps = {
      data: data || [],
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...CommonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={dataKey} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...CommonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={dataKey} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart {...CommonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={nameKey}
                fill="#8884d8"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div
      ref={drag}
      style={{
        ...component.style,
        border: isSelected ? "2px solid blue" : "1px solid #ccc",
        padding: "2px",
        width: component.type === "ROW" ? "100%" : component.style.width,
        height: component.style.height,
        overflow: "hidden", // Prevent content from overflowing
      }}
      onClick={handleClick}
      className={`relative ${isSelected ? "shadow-lg" : ""}`}
    >
      {renderContent()}
      {isSelected && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1">
          {component.type}
        </div>
      )}
    </div>
  );
};

export default ComponentRenderer;
