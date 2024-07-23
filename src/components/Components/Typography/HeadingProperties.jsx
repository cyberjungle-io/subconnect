import React from 'react';

const HeadingProperties = ({ props, onPropChange }) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">Heading Level</label>
        <select
          name="level"
          value={props.level || 'h1'}
          onChange={onPropChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((level) => (
            <option key={level} value={level}>{level.toUpperCase()}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Color</label>
        <input
          type="color"
          name="color"
          value={props.color || '#000000'}
          onChange={onPropChange}
          className="mt-1 block w-full"
        />
      </div>
      <div className="flex items-center mt-2">
        <input
          type="checkbox"
          id="bold"
          name="bold"
          checked={props.bold || false}
          onChange={onPropChange}
          className="mr-2"
        />
        <label htmlFor="bold" className="text-sm font-medium text-gray-700">Bold</label>
      </div>
      <div className="flex items-center mt-2">
        <input
          type="checkbox"
          id="italic"
          name="italic"
          checked={props.italic || false}
          onChange={onPropChange}
          className="mr-2"
        />
        <label htmlFor="italic" className="text-sm font-medium text-gray-700">Italic</label>
      </div>
    </>
  );
};

export default HeadingProperties;