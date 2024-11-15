import React, { useState, useEffect } from 'react';
import { FaTimes, FaDatabase, FaCode, FaGlobe, FaSave, FaTrash, FaEye } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQueries, deleteQuery } from '../../w3s/w3sSlice';
import { loadSavedQuery } from '../../features/graphQLSlice';
import GraphQLQueryTab from './GraphQLQueryTab';
import DeleteConfirmModal from '../common/DeleteConfirmModal';
import Modal from '../common/Modal';

const DataModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('GraphQL Query');

  const tabs = [
    { name: 'GraphQL Query', icon: FaCode, disabled: false },
    { name: 'Data', icon: FaDatabase, disabled: true },
    { name: 'JSON', icon: FaCode, disabled: true },
    { name: 'REST', icon: FaGlobe, disabled: true },
    { name: 'Saved', icon: FaSave, disabled: false },
  ];

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchQueries());
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[970] flex justify-center items-center" onClick={handleOverlayClick}>
      <div className="bg-white w-3/4 h-3/4 rounded-lg flex overflow-hidden shadow-xl">
        {/* Side Menu */}
        <div className="w-1/4 bg-gray-50 border-r border-gray-200 p-6">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.name
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white'
                    : tab.disabled
                    ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => !tab.disabled && setActiveTab(tab.name)}
                disabled={tab.disabled}
              >
                <tab.icon className="h-4 w-4 mr-3" />
                <span className="font-medium">{tab.name}</span>
                {tab.disabled && (
                  <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-3/4 flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{activeTab}</h2>
                <p className="text-gray-600 mt-1">Manage your data connections and queries</p>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-lg"
                onClick={onClose}
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex-grow overflow-hidden p-6">
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
  const [viewQueryModal, setViewQueryModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [queryToDelete, setQueryToDelete] = useState(null);

  React.useEffect(() => {
    dispatch(fetchQueries());
  }, [dispatch]);

  const handleLoadQuery = (query) => {
    dispatch(loadSavedQuery(query));
  };

  const handleDeleteClick = (query) => {
    setQueryToDelete(query);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (queryToDelete) {
      dispatch(deleteQuery(queryToDelete._id))
        .then(() => {
          console.log('Query deleted successfully');
          dispatch(fetchQueries());
        });
    }
    setDeleteModalOpen(false);
    setQueryToDelete(null);
  };

  const handleViewQuery = (query) => {
    setSelectedQuery(query);
    setViewQueryModal(true);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto space-y-4">
        {queries.map(query => (
          <div key={query._id} className="border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-900">{query.name}</h4>
              <button
                onClick={() => handleViewQuery(query)}
                className="text-gray-400 hover:text-indigo-600 p-2 rounded-lg transition-colors duration-200"
                title="View Query"
              >
                <FaEye className="h-4 w-4" />
              </button>
            </div>
              
            <div className="space-y-2 text-sm text-gray-600">
              <p>Result Type: <span className="text-gray-900">{query.resultType}</span></p>
              <p>Query Source: <span className="text-gray-900">{query.querySource || 'N/A'}</span></p>
              <p>Endpoint: <span className="text-gray-900">{query.endpoint}</span></p>
            </div>

            <div className="mt-4 flex space-x-3">
              <button 
                onClick={() => handleLoadQuery(query)}
                className="flex-1 group bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold py-2 px-4 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <FaCode className="h-4 w-4" />
                <span>Load Query</span>
              </button>
              <button 
                onClick={() => handleDeleteClick(query)}
                className="flex-1 bg-red-50 text-red-600 font-bold py-2 px-4 rounded-lg hover:bg-red-100 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <FaTrash className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={viewQueryModal}
        onClose={() => {
          setViewQueryModal(false);
          setSelectedQuery(null);
        }}
      >
        <div className="p-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedQuery?.name}</h3>
            
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Query String:</h4>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm text-gray-800 border border-gray-200">
                <code>{selectedQuery?.queryString}</code>
              </pre>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Result Type:</h4>
                <p className="text-gray-600">{selectedQuery?.resultType}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Query Source:</h4>
                <p className="text-gray-600">{selectedQuery?.querySource || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Endpoint:</h4>
                <p className="text-gray-600">{selectedQuery?.endpoint}</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setQueryToDelete(null);
        }}
        onDelete={handleConfirmDelete}
        title="Delete Query"
        message={`Are you sure you want to delete the query "${queryToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default DataModal;