import React from 'react';
import ColorPicker from '../../common/ColorPicker';

const TableControls = ({ props, onPropsChange }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    onPropsChange({ ...props, [name]: newValue });
  };

  const renderSection = (title, content) => (
    <div className="control-section mb-8">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="control-section-content">
        {content}
      </div>
    </div>
  );

  const tableElementsContent = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Header Background Color</label>
        <ColorPicker
          color={props?.headerBackgroundColor || '#f3f4f6'}
          onChange={(color) => onPropsChange({ ...props, headerBackgroundColor: color })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Header Text Color</label>
        <ColorPicker
          color={props?.headerTextColor || '#000000'}
          onChange={(color) => onPropsChange({ ...props, headerTextColor: color })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Row Background Color</label>
        <ColorPicker
          color={props?.rowBackgroundColor || '#ffffff'}
          onChange={(color) => onPropsChange({ ...props, rowBackgroundColor: color })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Row Background Color</label>
        <ColorPicker
          color={props?.alternateRowBackgroundColor || '#f9fafb'}
          onChange={(color) => onPropsChange({ ...props, alternateRowBackgroundColor: color })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Row Text Color</label>
        <ColorPicker
          color={props?.rowTextColor || '#000000'}
          onChange={(color) => onPropsChange({ ...props, rowTextColor: color })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Border Color</label>
        <ColorPicker
          color={props?.borderColor || '#e5e7eb'}
          onChange={(color) => onPropsChange({ ...props, borderColor: color })}
        />
      </div>
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            name="showBorder"
            checked={props?.showBorder !== false}
            onChange={handleChange}
            className="mr-2"
          />
          Show Border
        </label>
      </div>
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            name="showHeader"
            checked={props?.showHeader !== false}
            onChange={handleChange}
            className="mr-2"
          />
          Show Header
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Page Size</label>
        <input
          type="number"
          name="pageSize"
          value={props?.pageSize || 10}
          onChange={handleChange}
          className="w-full p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );

  return (
    <div className="table-controls space-y-12">
      {renderSection("Table Elements", tableElementsContent)}
    </div>
  );
};

export default TableControls;