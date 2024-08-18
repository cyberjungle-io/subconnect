import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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

const ChartRenderer = ({ component, globalChartStyle }) => {
  const { chartConfig } = component;
  const {
    chartType,
    selectedQueryId,
    dataKey,
    nameKey,
    title,
    titleFontSize,
    titleColor,
    width,
    height,
    lineColor,
    lineWidth,
    dataPointSize,
    showLegend,
    legendPosition,
  } = chartConfig || {};

  const [chartData, setChartData] = useState([]);
  const queries = useSelector(state => state.w3s.queries.list);

  useEffect(() => {
    if (selectedQueryId) {
      const selectedQuery = queries.find(query => query._id === selectedQueryId);
      if (selectedQuery && selectedQuery.queryResult) {
        setChartData(selectedQuery.queryResult);
      }
    }
  }, [selectedQueryId, queries]);

  const CommonProps = {
    data: chartData,
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

  const renderLegend = () =>
    showLegend && (
      <Legend
        layout={legendPosition === 'top' || legendPosition === 'bottom' ? 'horizontal' : 'vertical'}
        verticalAlign={legendPosition === 'top' ? 'top' : legendPosition === 'bottom' ? 'bottom' : 'middle'}
        align={legendPosition === 'left' ? 'left' : legendPosition === 'right' ? 'right' : 'center'}
      />
    );

  const renderChart = () => {
    if (!chartData || chartData.length === 0 || !dataKey || !nameKey) {
      return <div>No data available or fields not selected</div>;
    }

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
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={lineColor || globalChartStyle.colors[0]}
              strokeWidth={lineWidth || 2}
              dot={{ r: dataPointSize || 5 }}
            />
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
            <Bar
              dataKey={dataKey}
              fill={lineColor || globalChartStyle.colors[0]}
              radius={[dataPointSize || 0, dataPointSize || 0, 0, 0]}
            />
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
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={lineColor || globalChartStyle.colors[0]}
              fill={lineColor || globalChartStyle.colors[0]}
              fillOpacity={0.3}
              strokeWidth={lineWidth || 2}
            />
          </AreaChart>
        );
      case "pie":
        return (
          <PieChart width={CommonProps.width} height={CommonProps.height}>
            {renderTitle()}
            <Pie
              data={chartData}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              outerRadius={dataPointSize ? 50 + dataPointSize * 5 : 80}
              fill={lineColor || globalChartStyle.colors[0]}
              label
            />
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