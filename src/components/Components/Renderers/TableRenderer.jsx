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
    if (component.props.data && component.props.columns) {
      const formattedData = formatData(component.props.data, component.props.columns);
      setTableData(formattedData);
    }
  }, [component.props.data, component.props.columns]);

  const tableProps = useMemo(() => ({
    data: tableData,
    columns: component.props.columns || [],
    // ... other props ...
  }), [tableData, component.props]);

  return (
    <div className="w-full overflow-x-auto">
      {/* ... table header ... */}
      <tbody className="bg-white divide-y divide-gray-200">
        {tableProps.data.slice(0, tableProps.pageSize || 10).map((row, rowIndex) => (
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
                {row[column.key] ?? 'N/A'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </div>
  );
};

export default TableRenderer;
