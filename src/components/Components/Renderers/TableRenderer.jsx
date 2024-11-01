import React, { useEffect, useState, useMemo } from "react";
import { format, parseISO } from 'date-fns';
import numeral from 'numeral';

const TableRenderer = ({ component, isViewMode, globalSettings = {} }) => {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

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

  const paginatedData = useMemo(() => {
    const pageSize = component.props.pageSize || 10;
    const startIndex = (currentPage - 1) * pageSize;
    return tableData.slice(startIndex, startIndex + pageSize);
  }, [tableData, currentPage, component.props.pageSize]);

  const renderPagination = () => {
    const pageSize = component.props.pageSize || 10;
    const totalPages = Math.ceil(tableData.length / pageSize);

    return totalPages > 1 ? (
      <div className="flex justify-end items-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    ) : null;
  };

  return (
    <div 
      className="w-full h-full flex flex-col rounded overflow-hidden relative"
      style={{
        backgroundColor: component.props.backgroundColor || globalSettings.generalComponentStyle?.backgroundColor || '#ffffff',
        borderWidth: component.style?.borderWidth || '0px',
        borderStyle: component.style?.borderStyle || 'solid',
        borderColor: component.style?.borderColor || '#000000',
        borderRadius: component.style?.borderRadius || '0px',
        boxShadow: component.style?.boxShadow || 'none',
        padding: component.style?.padding || '0px',
        margin: component.style?.margin || '0px',
        width: component.style?.width || '100%',
        height: component.style?.height || '100%',
        overflow: 'auto'
      }}
    >
      <table className="min-w-full divide-y" style={{ 
        borderColor: component.props.borderColor || '#e5e7eb',
        borderWidth: component.props.showBorder !== false ? '1px' : '0'
      }}>
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
        <tbody className="divide-y" style={{ 
          borderColor: component.props.borderColor || '#e5e7eb'
        }}>
          {paginatedData.map((row, rowIndex) => (
            <tr 
              key={rowIndex}
              style={{
                backgroundColor: rowIndex % 2 === 0 
                  ? (component.props.rowBackgroundColor || '#ffffff')
                  : (component.props.alternateRowBackgroundColor || '#f9fafb'),
                color: component.props.rowTextColor || '#6b7280'
              }}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm"
                >
                  {row[column.key] ?? 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination()}
    </div>
  );
};

export default TableRenderer;
