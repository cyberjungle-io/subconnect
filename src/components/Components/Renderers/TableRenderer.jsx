import React, { useEffect, useState, useMemo } from "react";
import { format, parseISO } from 'date-fns';
import numeral from 'numeral';

const TableRenderer = ({ component }) => {
  const [tableData, setTableData] = useState([]);

  const formatData = (data, columns) => {
    if (!data || !Array.isArray(data)) return [];
    
    const formattedData = data.map(item => {
      const formattedItem = {};
      columns.forEach(column => {
        const key = column.key.split('.').pop();
        let value = item[key];

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
    return formattedData;
  };

  useEffect(() => {
    if (!component.props.data) {
      const defaultData = [
        { id: 1, name: 'Sample Row 1', value: 100 },
        { id: 2, name: 'Sample Row 2', value: 200 },
        { id: 3, name: 'Sample Row 3', value: 300 },
      ];
      setTableData(defaultData);
    } else {
      const formattedData = formatData(component.props.data, component.props.columns || []);
      setTableData(formattedData);
    }
  }, [component.props.data, component.props.columns]);

  const columns = useMemo(() => {
    if (!component.props.columns || component.props.columns.length === 0) {
      return [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'value', header: 'Value' }
      ];
    }
    return component.props.columns.map(column => ({
      ...column,
      header: component.props.seriesNames?.[column.key] || column.key
    }));
  }, [component.props.columns, component.props.seriesNames]);

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead style={{ 
          backgroundColor: component.props.headerBackgroundColor || '#f3f4f6'
        }}>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: component.props.headerTextColor || '#6b7280' }}
              >
                {column.header || column.key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {row[column.key] ?? 'N/A'}
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
