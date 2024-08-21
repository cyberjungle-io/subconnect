import React, { useState } from 'react';
import { FaTimes, FaDatabase, FaCode, FaGlobe, FaSave } from 'react-icons/fa';
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
        <div className="w-3/4 p-4 relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <FaTimes />
          </button>
          <h2 className="text-2xl font-bold mb-4">{activeTab}</h2>
          {activeTab === 'GraphQL Query' && <GraphQLQueryTab />}
          {activeTab === 'Saved' && <SavedQueriesTab />}
        </div>
      </div>
    </div>
  );
};

const SavedQueriesTab = () => {
  return (
    <div>
      <h3>Saved Queries</h3>
      {/* Add your saved queries content here */}
    </div>
  );
};

export default DataModal;