import React from "react";
import {
  LineChart, BarChart, AreaChart, PieChart,
  Line, Bar, Area, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Label
} from "recharts";
import { format } from 'date-fns';
import numeral from 'numeral';
import { extent, max } from 'd3-array'; // Add this import

const ChartRenderer = ({ component }) => {
  const { props } = component;
  const {
    chartType = 'line',
    data = [],
    dataKeys = [],
    nameKey = '',
    title,
    titleFontSize = 16,
    titleColor = '#000000',
    titleAlign = 'center',
    width = '100%',
    height = 400,
    colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'],
    lineColors = {}, // New prop for custom line colors
    lineWidth = 2,
    dataPointSize = 5,
    showLegend = true,
    legendPosition = 'bottom',
    xAxisLabel = '',
    yAxisLabel = '',
    xAxisAngle = 0,
    yAxisAngle = 0,
    xAxisDataType = 'category', // 'number', 'date'
    yAxisDataType = 'number',
    dateFormat = 'MM/dd/yyyy',
    numberFormat = '0,0.[00]', // Using Numeral.js format
    lineColor = '#8884d8', // Add this line
  } = props || {};

  const formatXAxis = (tickItem) => {
    if (xAxisDataType === 'date') {
      return format(new Date(tickItem), dateFormat);
    }
    if (xAxisDataType === 'number') {
      return numeral(tickItem).format(numberFormat);
    }
    return tickItem;
  };

  const formatYAxis = (tickItem) => {
    if (yAxisDataType === 'number') {
      return numeral(tickItem).format(numberFormat);
    }
    return tickItem;
  };

  const calculateDomain = (data, keys) => {
    const allValues = data.flatMap(item => keys.map(key => item[key]));
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const padding = (maxValue - minValue) * 0.1; // Add 10% padding
    return [minValue - padding, maxValue + padding];
  };

  const renderChart = () => {
    const CommonProps = {
      data,
      margin: { top: 20, right: 30, left: 50, bottom: 50 }, // Increased left and bottom margins
    };

    const domain = calculateDomain(data, dataKeys);

    const CommonAxisProps = {
      XAxis: {
        dataKey: nameKey,
        angle: xAxisAngle,
        tickFormatter: formatXAxis,
        height: 60, // Increased height for x-axis
        children: xAxisLabel && <Label value={xAxisLabel} offset={-10} position="insideBottom" />
      },
      YAxis: {
        angle: yAxisAngle,
        tickFormatter: formatYAxis,
        domain: domain,
        children: yAxisLabel && <Label value={yAxisLabel} angle={-90} position="insideLeft" offset={-40} />
      }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...CommonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...CommonAxisProps.XAxis} />
            <YAxis {...CommonAxisProps.YAxis} />
            <Tooltip />
            {showLegend && <Legend verticalAlign={legendPosition} />}
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={lineColors[key] || lineColor || colors[index % colors.length]}
                strokeWidth={lineWidth}
                dot={{ r: dataPointSize }}
              />
            ))}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...CommonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...CommonAxisProps.XAxis} />
            <YAxis {...CommonAxisProps.YAxis} />
            <Tooltip />
            {showLegend && <Legend verticalAlign={legendPosition} />}
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
              />
            ))}
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart {...CommonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...CommonAxisProps.XAxis} />
            <YAxis {...CommonAxisProps.YAxis} />
            <Tooltip />
            {showLegend && <Legend verticalAlign={legendPosition} />}
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                fill={colors[index % colors.length]}
                stroke={colors[index % colors.length]}
              />
            ))}
          </AreaChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKeys[0]}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            {showLegend && <Legend verticalAlign={legendPosition} />}
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ width: '100%', height: height }}>
      {title && (
        <h3
          style={{
            fontSize: `${titleFontSize}px`,
            color: titleColor,
            textAlign: titleAlign,
            marginBottom: '20px'
          }}
        >
          {title}
        </h3>
      )}
      <ResponsiveContainer width={width} height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartRenderer;