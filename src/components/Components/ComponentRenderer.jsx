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
        case 'HEADING':
        const { props = {} } = component; // Add a default empty object
        const HeadingTag = props.level || 'h1';
        return (
          <HeadingTag
            style={{
              color: props.color || '#000000',
              fontWeight: props.bold ? 'bold' : 'normal',
              fontStyle: props.italic ? 'italic' : 'normal',
            }}
          >
            {component.content || 'Heading'}
          </HeadingTag>
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
    const { chartType, data, dataKey, nameKey, title, 
      titleFontSize, 
      titleColor, 
      width, 
      height, 
      lineColor, 
      lineWidth, 
      dataPointSize, 
      showLegend, 
      legendPosition  } = component.chartConfig || {};

    const CommonProps = {
      data: data || [],
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
      width: width || 500,
      height: height || 300,
    };


    const renderTitle = () => (
      <text
        x={CommonProps.width / 2}
        y={20}
        textAnchor="middle"
        fill={titleColor || "#000"}
        fontSize={titleFontSize || 16}
        fontWeight="bold"
      >
        {title}
      </text>
    );

    const renderLegend = () => (
      showLegend && (
        <Legend
          layout={legendPosition === 'top' || legendPosition === 'bottom' ? 'horizontal' : 'vertical'}
          verticalAlign={legendPosition === 'top' ? 'top' : legendPosition === 'bottom' ? 'bottom' : 'middle'}
          align={legendPosition === 'left' ? 'left' : legendPosition === 'right' ? 'right' : 'center'}
        />
      )
    );

    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart {...CommonProps}>
              {renderTitle()}
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} />
              <YAxis />
              <Tooltip />
              {renderLegend()}
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={lineColor || "#8884d8"}
                strokeWidth={lineWidth || 2}
                dot={{ r: dataPointSize || 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
        case "bar":
          return (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart {...CommonProps}>
                {renderTitle()}
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={nameKey} />
                <YAxis />
                <Tooltip />
                {renderLegend()}
                <Bar
                  dataKey={dataKey}
                  fill={lineColor || "#8884d8"}
                  radius={[dataPointSize || 0, dataPointSize || 0, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          );
        case "area":
          return (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart {...CommonProps}>
                {renderTitle()}
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={nameKey} />
                <YAxis />
                <Tooltip />
                {renderLegend()}
                <Area
                  type="monotone"
                  dataKey={dataKey}
                  stroke={lineColor || "#8884d8"}
                  fill={lineColor || "#8884d8"}
                  fillOpacity={0.3}
                  strokeWidth={lineWidth || 2}
                />
              </AreaChart>
            </ResponsiveContainer>
          );
        case "pie":
          return (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {renderTitle()}
                <Pie
                  data={data}
                  dataKey={dataKey}
                  nameKey={nameKey}
                  cx="50%"
                  cy="50%"
                  outerRadius={dataPointSize ? 50 + dataPointSize * 5 : 80}
                  fill={lineColor || "#8884d8"}
                  label
                />
                <Tooltip />
                {renderLegend()}
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
