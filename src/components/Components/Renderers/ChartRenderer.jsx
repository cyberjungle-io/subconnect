import React, { useState, useEffect } from "react";
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

const defaultData = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
];

const ChartRenderer = ({ component }) => {
  const { props } = component;
  const {
    chartType = 'line',
    dataKeys = ['uv', 'pv', 'amt'],
    nameKey = 'name',
    title,
    titleFontSize,
    titleColor,
    titleAlign,
    width = 500,
    height = 300,
    lineColors = ['#8884d8', '#82ca9d', '#ffc658'],
    lineWidth = 2,
    dataPointSize = 5,
    showLegend = true,
    legendPosition = 'bottom',
  } = props || {};

  const [chartData, setChartData] = useState(defaultData);

  useEffect(() => {
    if (props.data && Array.isArray(props.data) && props.data.length > 0) {
      setChartData(props.data);
    }
  }, [props.data]);

  const CommonProps = {
    data: chartData,
    margin: { top: 20, right: 30, left: 20, bottom: 5 },
    width,
    height,
  };

  const renderTitle = () => (
    <text
      x={width / 2}
      y={20}
      textAnchor="middle"
      fill={titleColor || "#000"}
      fontSize={titleFontSize || 16}
      fontWeight="bold"
    >
      {title}
    </text>
  );

  const renderLegend = () =>
    showLegend && (
      <Legend
        layout={legendPosition === 'top' || legendPosition === 'bottom' ? 'horizontal' : 'vertical'}
        verticalAlign={legendPosition === 'top' ? 'top' : legendPosition === 'bottom' ? 'bottom' : 'middle'}
        align={legendPosition === 'left' ? 'left' : legendPosition === 'right' ? 'right' : 'center'}
      />
    );

  const renderChart = () => {
    switch (chartType) {
      case "line":
        return (
          <LineChart {...CommonProps}>
            {renderTitle()}
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            {renderLegend()}
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={lineColors[index % lineColors.length]}
                strokeWidth={lineWidth}
                dot={{ r: dataPointSize }}
              />
            ))}
          </LineChart>
        );
      case "bar":
        return (
          <BarChart {...CommonProps}>
            {renderTitle()}
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            {renderLegend()}
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={lineColors[index % lineColors.length]}
                radius={[dataPointSize, dataPointSize, 0, 0]}
              />
            ))}
          </BarChart>
        );
      case "area":
        return (
          <AreaChart {...CommonProps}>
            {renderTitle()}
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            {renderLegend()}
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={lineColors[index % lineColors.length]}
                fill={lineColors[index % lineColors.length]}
                fillOpacity={0.3}
                strokeWidth={lineWidth}
              />
            ))}
          </AreaChart>
        );
      case "pie":
        return (
          <PieChart width={CommonProps.width} height={CommonProps.height}>
            {renderTitle()}
            {dataKeys.map((key, index) => (
              <Pie
                key={key}
                data={CommonProps.data}
                dataKey={key}
                nameKey={nameKey}
                cx="50%"
                cy="50%"
                outerRadius={50 + index * 20}
                fill={lineColors[index % lineColors.length]}
                label
              />
            ))}
            <Tooltip />
            {renderLegend()}
          </PieChart>
        );
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {renderChart()}
    </ResponsiveContainer>
  );
};

export default ChartRenderer;