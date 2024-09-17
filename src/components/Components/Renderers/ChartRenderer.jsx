import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { executeQuery } from '../../../features/graphQLSlice'; // Make sure to import this
import {
  LineChart, BarChart, AreaChart, PieChart,
  Line, Bar, Area, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Label
} from "recharts";
import { format, parseISO } from 'date-fns';
import numeral from 'numeral';

const ChartRenderer = ({ component }) => {
  const dispatch = useDispatch();
  const [chartData, setChartData] = useState([]);
  const [key, setKey] = useState(0); // Add this line
  const queryResult = useSelector(state => state.graphQL.queryResult);
  const queries = useSelector(state => state.w3s?.queries?.list ?? []);

  const formatData = (data, dataKeys, nameKey) => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => {
      const formattedItem = {};
      
      // Check if updatedTime exists and is a valid date string
      if (item.updatedTime && !isNaN(Date.parse(item.updatedTime))) {
        formattedItem[nameKey] = format(parseISO(item.updatedTime), 'yyyy-MM-dd');
      } else {
        // Use a fallback value or skip this item
        formattedItem[nameKey] = 'N/A';
        console.warn('Invalid or missing updatedTime:', item.updatedTime);
      }
  
      dataKeys.forEach(key => {
        const [objectKey, valueKey] = key.split('.');
        if (item[objectKey] && item[objectKey][valueKey]) {
          formattedItem[key] = parseFloat(item[objectKey][valueKey]) || 0;
        } else if (item[valueKey]) {
          formattedItem[key] = parseFloat(item[valueKey]) || 0;
        } else {
          formattedItem[key] = 0;
        }
      });
  
      return formattedItem;
    }).sort((a, b) => {
      if (a[nameKey] === 'N/A' || b[nameKey] === 'N/A') return 0;
      return new Date(a[nameKey]) - new Date(b[nameKey]);
    });
  };

  useEffect(() => {
    const selectedQuery = queries.find(q => q._id === component.props.selectedQueryId);
    if (selectedQuery && component.props.dataKeys?.length > 0 && component.props.nameKey) {
      dispatch(executeQuery({
        endpoint: selectedQuery.endpoint,
        query: selectedQuery.queryString
      }));
    }
  }, [component.props.selectedQueryId, component.props.dataKeys, component.props.nameKey, dispatch, queries]);

  useEffect(() => {
    if (queryResult && queryResult.data) {
      const dataKey = Object.keys(queryResult.data)[0];
      const rawData = queryResult.data[dataKey];
      const formattedData = formatData(rawData, component.props.dataKeys, component.props.nameKey);
      setChartData(formattedData);
    }
  }, [queryResult, component.props.dataKeys, component.props.nameKey]);

  // Update chartProps to use chartData instead of component.props.data
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
      height: component.props.height || '100%',
      colors: component.props.colors || ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'],
      lineColors: component.props.lineColors || {},
      lineWidth: component.props.lineWidth || 2,
      dataPointSize: component.props.dataPointSize || 5,
      showLegend: component.props.showLegend !== false,
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
      showXAxis: component.props.showXAxis !== false,
      showYAxis: component.props.showYAxis !== false,
      showGrid: component.props.showGrid !== false, // Add this line
      seriesNames: component.props.seriesNames || {},
      tooltipBackgroundColor: component.props.tooltipBackgroundColor || '#ffffff',
      tooltipBorderColor: component.props.tooltipBorderColor || '#cccccc',
      tooltipTextColor: component.props.tooltipTextColor || '#000000',
      tooltipValueFormat: component.props.tooltipValueFormat || '0,0.[00]',
    };
  }, [component.props, chartData]);

  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [chartProps.chartType]);

  const formatXAxis = (tickItem) => {
    if (chartProps.xAxisDataType === 'date') {
      return format(parseISO(tickItem), chartProps.dateFormat || 'MM/dd/yyyy');
    }
    if (chartProps.xAxisDataType === 'number') {
      return numeral(tickItem).format(chartProps.numberFormat || '0,0.[00]');
    }
    return tickItem;
  };

  const formatYAxis = (tickItem) => {
    if (chartProps.yAxisDataType === 'number') {
      return numeral(tickItem).format(chartProps.numberFormat || '0,0.[00]');
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    const tooltipStyle = {
      backgroundColor: chartProps.tooltipBackgroundColor,
      border: `1px solid ${chartProps.tooltipBorderColor}`,
      padding: '10px',
      borderRadius: '4px',
    };

    const labelStyle = {
      marginBottom: '5px',
      fontWeight: 'bold',
      color: chartProps.tooltipTextColor,
    };

    const valueStyle = {
      color: chartProps.tooltipTextColor,
    };

    return (
      <div style={tooltipStyle}>
        <p style={labelStyle}>{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={valueStyle}>
            {`${entry.name}: ${numeral(entry.value).format(chartProps.tooltipValueFormat)}`}
          </p>
        ))}
      </div>
    );
  };

  const renderChart = () => {
    const margin = {
      top: 20,
      right: chartProps.showYAxis ? 30 : 10,
      bottom: chartProps.showXAxis ? 50 : 10,
      left: chartProps.showYAxis ? 50 : 10
    };

    const CommonProps = {
      data: chartProps.data,
      margin: margin,
    };

    const domain = calculateDomain(chartProps.data, chartProps.dataKeys);

    const CommonAxisProps = {
      XAxis: chartProps.showXAxis ? {
        dataKey: chartProps.nameKey,
        angle: chartProps.xAxisAngle,
        tickFormatter: formatXAxis,
        height: 60,
        children: chartProps.xAxisLabel && <Label value={chartProps.xAxisLabel} offset={-10} position="insideBottom" />
      } : { height: 0, tick: false, axisLine: false },
      YAxis: chartProps.showYAxis ? {
        angle: chartProps.yAxisAngle,
        tickFormatter: formatYAxis,
        domain: domain,
        children: chartProps.yAxisLabel && <Label value={chartProps.yAxisLabel} angle={-90} position="insideLeft" offset={-40} />
      } : { width: 0, tick: false, axisLine: false }
    };

    const CommonTooltipProps = {
      content: <CustomTooltip />,
    };

    switch (chartProps.chartType) {
      case 'line':
        return (
          <LineChart {...CommonProps}>
            {chartProps.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis {...CommonAxisProps.XAxis} />
            <YAxis {...CommonAxisProps.YAxis} domain={domain} />
            <Tooltip {...CommonTooltipProps} />
            {chartProps.showLegend && <Legend verticalAlign={chartProps.legendPosition} />}
            {chartProps.dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={chartProps.seriesNames[key] || key}
                stroke={chartProps.lineColors[key] || chartProps.colors[index % chartProps.colors.length]}
                strokeWidth={chartProps.lineWidth}
                dot={chartProps.showDataPoints ? { r: chartProps.dataPointSize } : false}
              />
            ))}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...CommonProps}>
            {chartProps.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis {...CommonAxisProps.XAxis} />
            <YAxis {...CommonAxisProps.YAxis} domain={domain} />
            <Tooltip {...CommonTooltipProps} />
            {chartProps.showLegend && <Legend verticalAlign={chartProps.legendPosition} />}
            {chartProps.dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                name={chartProps.seriesNames[key] || key}
                fill={chartProps.lineColors[key] || chartProps.colors[index % chartProps.colors.length]}
              />
            ))}
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart {...CommonProps}>
            {chartProps.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis {...CommonAxisProps.XAxis} />
            <YAxis {...CommonAxisProps.YAxis} domain={domain} />
            <Tooltip {...CommonTooltipProps} />
            {chartProps.showLegend && <Legend verticalAlign={chartProps.legendPosition} />}
            {chartProps.dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                name={chartProps.seriesNames[key] || key}
                fill={chartProps.lineColors[key] || chartProps.colors[index % chartProps.colors.length]}
                stroke={chartProps.lineColors[key] || chartProps.colors[index % chartProps.colors.length]}
              />
            ))}
          </AreaChart>
        );
      case 'pie':
        // For pie charts, we'll use the first data key and its series name
        const pieDataKey = chartProps.dataKeys[0];
        return (
          <PieChart>
            <Pie
              data={chartProps.data}
              dataKey={pieDataKey}
              nameKey={chartProps.nameKey}
              name={chartProps.seriesNames[pieDataKey] || pieDataKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {chartProps.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartProps.colors[index % chartProps.colors.length]} />
              ))}
            </Pie>
            <Tooltip {...CommonTooltipProps} />
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
      <ResponsiveContainer width="100%" height={chartProps.height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartRenderer;