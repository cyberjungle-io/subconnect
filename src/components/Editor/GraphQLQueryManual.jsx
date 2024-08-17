import React from 'react';

const GraphQLQueryManual = ({ parsedFields, handleDataTypeChange, editableQuery, setEditableQuery, handleExecuteQuery, handleSaveQuery }) => {
  const dataTypes = ['String', 'Int', 'Float', 'Boolean', 'ID'];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Query Editor</h3>
      <textarea
        className="w-full h-64 p-2 border rounded mb-2"
        value={editableQuery}
        onChange={(e) => setEditableQuery(e.target.value)}
        placeholder="Enter your GraphQL query here..."
      />
      <div className="mb-4">
        <button
          onClick={handleExecuteQuery}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Execute Query
        </button>
        <button
          onClick={handleSaveQuery}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Save Query
        </button>
      </div>
      <h3 className="text-lg font-semibold mb-2">Query Fields</h3>
      <div className="border rounded p-2 overflow-y-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Field Name</th>
              <th className="border border-gray-300 px-4 py-2">Data Type</th>
            </tr>
          </thead>
          <tbody>
            {parsedFields.map((field, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">{field.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={field.dataType}
                    onChange={(e) => handleDataTypeChange(index, e.target.value)}
                    className="w-full p-1 border rounded"
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
  );
};

export default GraphQLQueryManual;