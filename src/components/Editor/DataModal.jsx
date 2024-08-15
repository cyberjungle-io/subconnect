import React, { useState } from 'react';
import { FaTimes, FaDatabase, FaCode, FaGlobe, FaSave } from 'react-icons/fa';
import GraphQLQueryTab from './GraphQLQueryTab'; // Import the new component

const DataModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('GraphQL Query');

  const tabs = [
    { name: 'GraphQL Query', icon: FaCode }, // Updated tab name
    { name: 'Data', icon: FaDatabase },
    { name: 'JSON', icon: FaCode },
    { name: 'REST', icon: FaGlobe },
    { name: 'Saved', icon: FaSave },
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
                activeTab === tab.name ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              <tab.icon className="mr-2" />
              {tab.name}
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
          {activeTab === 'Data' && (
            <div>
              <select className="w-full p-2 border rounded mb-2">
                <option>Select a data source...</option>
                <option>Database 1</option>
                <option>Database 2</option>
              </select>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Column 1</th>
                    <th className="border p-2">Column 2</th>
                    <th className="border p-2">Column 3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Data 1</td>
                    <td className="border p-2">Data 2</td>
                    <td className="border p-2">Data 3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {/* Add similar dummy content for JSON, REST, and Saved tabs */}
        </div>
      </div>
    </div>
  );
};

export default DataModal;