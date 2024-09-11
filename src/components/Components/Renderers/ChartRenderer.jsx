import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from 'react-redux';
import {
  LineChart, BarChart, AreaChart, PieChart,
  Line, Bar, Area, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Label
} from "recharts";
import { format, parseISO } from 'date-fns';
import numeral from 'numeral';

const ChartRenderer = ({ component }) => {
  const [key, setKey] = useState(0);
  const [chartData, setChartData] = useState([]);
  const queryResult = useSelector(state => state.graphQL.queryResult);

  const formatData = (data, dataKeys, nameKey) => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(item => {
      const formattedItem = { 
        [nameKey]: format(parseISO(item.updatedTime), 'yyyy-MM-dd'),
        'accountSnapshots.delegationValue': parseFloat(item.delegationValue) || 0,
        'accountSnapshots.cumulativeStakePoolOwnerRewards': parseFloat(item.cumulativeStakePoolOwnerRewards) || 0
      };
      return formattedItem;
    }).sort((a, b) => new Date(a[nameKey]) - new Date(b[nameKey]));
  };

  useEffect(() => {
    console.log('Raw queryResult:', queryResult);
    console.log('Component props:', component.props);

    if (queryResult && queryResult.data) {
      const dataKey = Object.keys(queryResult.data)[0];
      console.log('Data key:', dataKey);
      const rawData = queryResult.data[dataKey];
      console.log('Raw data:', rawData);
      const formattedData = formatData(rawData, component.props.dataKeys, component.props.nameKey);
      setChartData(formattedData);
      console.log('Updated Formatted Chart Data:', formattedData);
    }
  }, [queryResult, component.props.dataKeys, component.props.nameKey]);

  // Use useMemo to memoize the chart props
  const chartProps = useMemo(() => {
    return {
      chartType: component.props.chartType || 'line',
      data: chartData,
      dataKeys: Array.isArray(component.props.dataKeys) ? component.props.dataKeys : [],
      nameKey: component.props.nameKey || '',
      title: component.props.title || '',
      titleFontSize: component.props.titleFontSize || 16,
      titleColor: component.props.titleColor || '#000000',
      titleAlign: component.props.titleAlign || 'center',
      width: component.props.width || '100%',
      height: component.props.height || 400,
      colors: component.props.colors || ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'],
      lineColors: component.props.lineColors || {},
      lineWidth: component.props.lineWidth || 2,
      dataPointSize: component.props.dataPointSize || 5,
      showLegend: component.props.showLegend || true,
      legendPosition: component.props.legendPosition || 'bottom',
      xAxisLabel: component.props.xAxisLabel || '',
      yAxisLabel: component.props.yAxisLabel || '',
      xAxisAngle: component.props.xAxisAngle || 0,
      yAxisAngle: component.props.yAxisAngle || 0,
      xAxisDataType: component.props.xAxisDataType || 'category',
      yAxisDataType: component.props.yAxisDataType || 'number',
      dateFormat: component.props.dateFormat || 'MM/dd/yyyy',
      numberFormat: component.props.numberFormat || '0,0.[00]',
      showDataPoints: component.props.showDataPoints !== false, // Add this line
    };
  }, [component.props, chartData]);

  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [chartProps.chartType]);

  const formatXAxis = (tickItem) => {
    if (chartProps.xAxisDataType === 'date') {
      return format(parseISO(tickItem), chartProps.dateFormat);
    }
    if (chartProps.xAxisDataType === 'number') {
      return numeral(tickItem).format(chartProps.numberFormat);
    }
    return tickItem;
  };

  const formatYAxis = (tickItem) => {
    if (chartProps.yAxisDataType === 'number') {
      return numeral(tickItem).format(chartProps.numberFormat);
    }
    return tickItem;
  };

  const calculateDomain = (data, keys) => {
    const allValues = data.flatMap(item => keys.map(key => item[key]));
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const padding = (maxValue - minValue) * 0.1;
    return [minValue - padding, maxValue + padding];
  };

  const renderChart = () => {
    const CommonProps = {
      data: chartProps.data,
      margin: { top: 20, right: 30, left: 50, bottom: 50 },
    };

    const domain = calculateDomain(chartProps.data, chartProps.dataKeys);

    const CommonAxisProps = {
      XAxis: {
        dataKey: chartProps.nameKey,
        angle: chartProps.xAxisAngle,
        tickFormatter: formatXAxis,
        height: 60,
        children: chartProps.xAxisLabel && <Label value={chartProps.xAxisLabel} offset={-10} position="insideBottom" />
      },
      YAxis: {
        angle: chartProps.yAxisAngle,
        tickFormatter: formatYAxis,
        domain: domain,
        children: chartProps.yAxisLabel && <Label value={chartProps.yAxisLabel} angle={-90} position="insideLeft" offset={-40} />
      }
    };

    switch (chartProps.chartType) {
      case 'line':
        return (
          <LineChart {...CommonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis {...CommonAxisProps.XAxis} />
            <YAxis {...CommonAxisProps.YAxis} />
            <Tooltip />
            {chartProps.showLegend && <Legend verticalAlign={chartProps.legendPosition} />}
            {chartProps.dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={chartProps.lineColors[key] || chartProps.colors[index % chartProps.colors.length]}
                strokeWidth={chartProps.lineWidth}
                dot={chartProps.showDataPoints ? { r: chartProps.dataPointSize } : false} // Modify this line
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
            {chartProps.showLegend && <Legend verticalAlign={chartProps.legendPosition} />}
            {chartProps.dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={chartProps.colors[index % chartProps.colors.length]}
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
            {chartProps.showLegend && <Legend verticalAlign={chartProps.legendPosition} />}
            {chartProps.dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                fill={chartProps.colors[index % chartProps.colors.length]}
                stroke={chartProps.colors[index % chartProps.colors.length]}
              />
            ))}
          </AreaChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartProps.data}
              dataKey={chartProps.dataKeys[0]}
              nameKey={chartProps.nameKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {chartProps.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartProps.colors[index % chartProps.colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            {chartProps.showLegend && <Legend verticalAlign={chartProps.legendPosition} />}
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ width: '100%', height: chartProps.height }} key={key}>
      {chartProps.title && (
        <h3
          style={{
            fontSize: `${chartProps.titleFontSize}px`,
            color: chartProps.titleColor,
            textAlign: chartProps.titleAlign,
            marginBottom: '20px'
          }}
        >
          {chartProps.title}
        </h3>
      )}
      <ResponsiveContainer width={chartProps.width} height={chartProps.height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartRenderer;