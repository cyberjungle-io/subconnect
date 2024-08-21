import React, { useState } from 'react';
import { FaTimes, FaDatabase, FaCode, FaGlobe, FaSave, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQueries, deleteQuery } from '../../w3s/w3sSlice';
import { loadSavedQuery } from '../../features/graphQLSlice';
import GraphQLQueryTab from './GraphQLQueryTab';

const DataModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('GraphQL Query');

  const tabs = [
    { name: 'GraphQL Query', icon: FaCode, disabled: false },
    { name: 'Data', icon: FaDatabase, disabled: true },
    { name: 'JSON', icon: FaCode, disabled: true },
    { name: 'REST', icon: FaGlobe, disabled: true },
    { name: 'Saved', icon: FaSave, disabled: false },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white w-3/4 h-3/4 rounded-lg flex overflow-hidden">
        {/* Side Menu */}
        <div className="w-1/4 bg-gray-100 p-4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`flex items-center w-full p-2 mb-2 rounded ${
                activeTab === tab.name
                  ? 'bg-blue-500 text-white'
                  : tab.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'hover:bg-gray-200'
              }`}
              onClick={() => !tab.disabled && setActiveTab(tab.name)}
              disabled={tab.disabled}
            >
              <tab.icon className="mr-2" />
              {tab.name}
              {tab.disabled && <span className="ml-1 text-xs">(Coming Soon)</span>}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="w-3/4 p-4 relative flex flex-col h-full">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <FaTimes />
          </button>
          <h2 className="text-2xl font-bold mb-4">{activeTab}</h2>
          <div className="flex-grow overflow-hidden">
            {activeTab === 'GraphQL Query' && <GraphQLQueryTab />}
            {activeTab === 'Saved' && <SavedQueriesTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

const SavedQueriesTab = () => {
  const dispatch = useDispatch();
  const { list: queries, status: queriesStatus, error: queriesError } = useSelector(state => state.w3s.queries);
  const [expandedQueries, setExpandedQueries] = useState({});

  React.useEffect(() => {
    dispatch(fetchQueries());
  }, [dispatch]);

  const handleDeleteQuery = (queryId) => {
    if (window.confirm('Are you sure you want to delete this query?')) {
      dispatch(deleteQuery(queryId))
        .then(() => {
          console.log('Query deleted successfully');
          dispatch(fetchQueries());
        });
    }
  };

  const handleLoadQuery = (query) => {
    dispatch(loadSavedQuery(query));
  };

  const toggleQueryExpansion = (queryId) => {
    setExpandedQueries(prev => ({
      ...prev,
      [queryId]: !prev[queryId]
    }));
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Saved Queries</h3>
      {queriesStatus === 'loading' && <p>Loading queries...</p>}
      {queriesError && <p className="text-red-500 mb-2">Error loading queries: {queriesError.message || JSON.stringify(queriesError)}</p>}
      <div className="flex-grow overflow-y-auto">
        <ul className="space-y-4">
          {queries.map(query => (
            <li key={query._id} className="border rounded">
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold">{query.name}</h4>
                  <button
                    onClick={() => toggleQueryExpansion(query._id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {expandedQueries[query._id] ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
                <p>Result Type: {query.resultType}</p>
                <p>Query Source: {query.querySource || 'N/A'}</p>
                <p>Endpoint: {query.endpoint}</p>
                <div className="mt-2">
                  <button 
                    onClick={() => handleLoadQuery(query)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Load
                  </button>
                  <button 
                    onClick={() => handleDeleteQuery(query._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {expandedQueries[query._id] && (
                <div className="px-4 pb-4">
                  <h5 className="font-semibold mb-2">Query:</h5>
                  <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                    <code>{query.queryString}</code>
                  </pre>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DataModal;