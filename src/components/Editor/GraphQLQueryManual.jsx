import React from 'react';
import { FaCode, FaSave, FaPlay, FaTable } from 'react-icons/fa';

const GraphQLQueryManual = ({ parsedFields, handleDataTypeChange, editableQuery, setEditableQuery, handleExecuteQuery, handleSaveQuery, queryName, setQueryName }) => {
  const dataTypes = ['String', 'Int', 'Float', 'Boolean', 'ID'];

  return (
    <div className="p-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Query Editor</h3>
        <p className="text-gray-600">Create and manage your GraphQL queries</p>
      </div>

      <div className="space-y-6">
        {/* Query Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Query Name</label>
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <FaCode className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={queryName}
              onChange={(e) => setQueryName(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200"
              placeholder="Enter query name"
            />
          </div>
        </div>

        {/* Query Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Query</label>
          <textarea
            className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200"
            value={editableQuery}
            onChange={(e) => setEditableQuery(e.target.value)}
            placeholder="Enter your GraphQL query here..."
            rows={8}
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleExecuteQuery}
            className="flex-1 group bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <FaPlay className="h-4 w-4" />
            <span>Execute Query</span>
          </button>
          <button
            onClick={handleSaveQuery}
            className="flex-1 group bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 px-6 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <FaSave className="h-4 w-4" />
            <span>Save Query</span>
          </button>
        </div>

        {/* Query Fields Table */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <FaTable className="h-4 w-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Query Fields</h3>
          </div>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Field Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Data Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {parsedFields.map((field, index) => (
                  <tr key={index} className="bg-white">
                    <td className="px-4 py-3 text-sm text-gray-900">{field.name}</td>
                    <td className="px-4 py-3">
                      <select
                        value={field.dataType}
                        onChange={(e) => handleDataTypeChange(index, e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {dataTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphQLQueryManual;