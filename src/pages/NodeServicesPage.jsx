import React from 'react';
import Toolbar from '../components/Editor/Toolbar';

const NodeServicesPage = () => {
  const polkadotServices = [
    { 
      name: 'Polkadot', 
      description: 'Real-time indexed data from the Polkadot relay chain',
      status: 'Operational',
      statusColor: 'green'
    },
    { 
      name: 'Phala', 
      description: 'Indexed data from Phala Network parachain',
      status: 'Operational',
      statusColor: 'green'
    },
    { 
      name: 'Astar', 
      description: 'Smart contract and dApp data from Astar Network',
      status: 'Operational',
      statusColor: 'green'
    },
    { 
      name: 'Hydradx', 
      description: 'Liquidity and trading data from HydraDX protocol',
      status: 'Operational',
      statusColor: 'green'
    },
    { 
      name: 'Moonbeam', 
      description: 'Smart contract and EVM-compatible chain data',
      status: 'Operational',
      statusColor: 'green'
    },
    { 
      name: 'Subsocial', 
      description: 'Social graph and content data from Subsocial Network',
      status: 'Operational',
      statusColor: 'green'
    },
    { 
      name: 'Bifrost', 
      description: 'DeFi and liquid staking protocol data',
      status: 'Operational',
      statusColor: 'green'
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Toolbar />
      <div className="flex-grow bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Polkadot Ecosystem Services</h1>
          <p className="text-xl text-gray-600 mb-12 text-center">
            Access indexed blockchain data via GraphQL endpoints for major Polkadot ecosystem projects.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {polkadotServices.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{service.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${service.statusColor}-100 text-${service.statusColor}-800`}>
                    {service.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeServicesPage;
