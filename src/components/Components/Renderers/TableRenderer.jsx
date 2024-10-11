import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { executeQuery } from '../../../features/graphQLSlice';
import { format, parseISO } from 'date-fns';
import numeral from 'numeral';

const TableRenderer = ({ component }) => {
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const queryResult = useSelector(state => state.graphQL.queryResult);
  const queries = useSelector(state => state.w3s?.queries?.list ?? []);

  const formatData = (data, columns) => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => {
      const formattedItem = {};
      columns.forEach(column => {
        const value = item[column.key];
        if (column.type === 'date' && value) {
          formattedItem[column.key] = format(parseISO(value), column.format || 'yyyy-MM-dd');
        } else if (column.type === 'number' && value) {
          formattedItem[column.key] = numeral(value).format(column.format || '0,0.[00]');
        } else {
          formattedItem[column.key] = value;
        }
      });
      return formattedItem;
    });
  };

  useEffect(() => {
    const selectedQuery = queries.find(q => q._id === component.props.selectedQueryId);
    if (selectedQuery && component.props.columns?.length > 0) {
      dispatch(executeQuery({
        endpoint: selectedQuery.endpoint,
        query: selectedQuery.queryString
      }));
    }
  }, [component.props.selectedQueryId, component.props.columns, dispatch, queries]);

  useEffect(() => {
    if (queryResult && queryResult.data) {
      const dataKey = Object.keys(queryResult.data)[0];
      const rawData = queryResult.data[dataKey];
      const formattedData = formatData(rawData, component.props.columns);
      setTableData(formattedData);
    }
  }, [queryResult, component.props.columns]);

  const tableProps = useMemo(() => {
    return {
      data: tableData,
      columns: component.props.columns || [],
      title: component.props.title || '',
      titleFontSize: component.props.titleFontSize || 16,
      titleColor: component.props.titleColor || '#000000',
      titleAlign: component.props.titleAlign || 'center',
      headerBackgroundColor: component.props.headerBackgroundColor || '#f3f4f6',
      headerTextColor: component.props.headerTextColor || '#000000',
      rowBackgroundColor: component.props.rowBackgroundColor || '#ffffff',
      rowTextColor: component.props.rowTextColor || '#000000',
      alternateRowBackgroundColor: component.props.alternateRowBackgroundColor || '#f9fafb',
      borderColor: component.props.borderColor || '#e5e7eb',
      showBorder: component.props.showBorder !== false,
      showHeader: component.props.showHeader !== false,
      pageSize: component.props.pageSize || 10,
    };
  }, [component.props, tableData]);

  return (
    <div className="w-full overflow-x-auto">
      {tableProps.title && (
        <h3
          style={{
            fontSize: `${tableProps.titleFontSize}px`,
            color: tableProps.titleColor,
            textAlign: tableProps.titleAlign,
            marginBottom: '20px'
          }}
        >
          {tableProps.title}
        </h3>
      )}
      <table className="min-w-full divide-y divide-gray-200">
        {tableProps.showHeader && (
          <thead style={{ backgroundColor: tableProps.headerBackgroundColor }}>
            <tr>
              {tableProps.columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: tableProps.headerTextColor }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="bg-white divide-y divide-gray-200">
          {tableProps.data.slice(0, tableProps.pageSize).map((row, rowIndex) => (
            <tr
              key={rowIndex}
              style={{
                backgroundColor: rowIndex % 2 === 0 ? tableProps.rowBackgroundColor : tableProps.alternateRowBackgroundColor
              }}
            >
              {tableProps.columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap"
                  style={{ color: tableProps.rowTextColor }}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableRenderer;
