import React, { useState } from 'react';

const PropertyTabs = ({ tabs, children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="flex justify-center items-center border-b">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === index
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {React.Children.toArray(children)[activeTab]}
      </div>
    </div>
  );
};

export default PropertyTabs;