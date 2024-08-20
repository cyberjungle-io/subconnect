import React from "react";
import {
  LineChart, BarChart, AreaChart, PieChart,
  Line, Bar, Area, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Label
} from "recharts";
import { format } from 'date-fns';
import numeral from 'numeral';

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

  const renderChart = () => {
    const CommonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    const CommonAxisProps = {
      XAxis: {
        dataKey: nameKey,
        angle: xAxisAngle,
        tickFormatter: formatXAxis,
        children: xAxisLabel && <Label value={xAxisLabel} offset={-5} position="insideBottom" />
      },
      YAxis: {
        angle: yAxisAngle,
        tickFormatter: formatYAxis,
        children: yAxisLabel && <Label value={yAxisLabel} angle={-90} position="insideLeft" />
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
                stroke={lineColors[key] || colors[index % colors.length]}
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