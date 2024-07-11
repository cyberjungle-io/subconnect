import React, { useState } from 'react';
import { FaDatabase, FaLink, FaPen, FaChartLine } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { updateComponentData } from '../features/editorSlice';

const DataMenu = () => {
  const dispatch = useDispatch();
  const selectedComponent = useSelector(state => state.editor.selectedComponent);
  const [queryInput, setQueryInput] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });

  const handleAssignData = () => {
    if (selectedComponent) {
      dispatch(updateComponentData({
        id: selectedComponent.id,
        data: { query: queryInput }
      }));
    }
  };

  const handleChartDataChange = (field, value) => {
    setChartData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleApplyChartData = () => {
    if (selectedComponent && selectedComponent.type === 'CHART') {
      dispatch(updateComponentData({
        id: selectedComponent.id,
        data: { chartData }
      }));
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Assign Data</h2>
      {selectedComponent ? (
        <div className="space-y-4">
          <div>
            <p className="font-medium">Selected Component: {selectedComponent.type}</p>
          </div>
          {selectedComponent.type === 'CHART' ? (
            <div>
              <h3 className="text-md font-semibold mb-2">Chart Configuration</h3>
              <div className="space-y-2">
                <div>
                  <label htmlFor="labels" className="block text-sm font-medium text-gray-700">
                    Labels (comma-separated)
                  </label>
                  <input
                    id="labels"
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    value={chartData.labels.join(',')}
                    onChange={(e) => handleChartDataChange('labels', e.target.value.split(','))}
                  />
                </div>
                <div>
                  <label htmlFor="data" className="block text-sm font-medium text-gray-700">
                    Data (comma-separated numbers)
                  </label>
                  <input
                    id="data"
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    value={chartData.datasets[0].data.join(',')}
                    onChange={(e) => handleChartDataChange('datasets', [{ data: e.target.value.split(',').map(Number) }])}
                  />
                </div>
                <button
                  onClick={handleApplyChartData}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <FaChartLine className="inline-block mr-2" />
                  Apply Chart Data
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="query" className="block text-sm font-medium text-gray-700">
                Query
              </label>
              <textarea
                id="query"
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
              />
              <button
                onClick={handleAssignData}
                className="mt-2 w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <FaDatabase className="inline-block mr-2" />
                Assign Data
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Select a component to assign data</p>
      )}
      <div className="mt-8">
        <h3 className="text-md font-semibold mb-2">Other Actions</h3>
        <button className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mb-2">
          <FaLink className="inline-block mr-2" />
          Assign Action
        </button>
        <button className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
          <FaPen className="inline-block mr-2" />
          Edit Content
        </button>
      </div>
    </div>
  );
};

export default DataMenu;