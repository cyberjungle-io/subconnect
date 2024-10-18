import React from 'react';
import Toolbar from '../components/Editor/Toolbar';

const NodeServicesPage = () => {
  const nodeServices = [
    { name: 'Ethereum', description: 'High-performance Ethereum nodes for DApp developers', price: '$99/month' },
    { name: 'Bitcoin', description: 'Reliable Bitcoin nodes for wallet services and exchanges', price: '$89/month' },
    { name: 'Polkadot', description: 'Fast and secure Polkadot nodes for parachains and DApps', price: '$79/month' },
    { name: 'Cardano', description: 'Scalable Cardano nodes for smart contract deployment', price: '$69/month' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Toolbar />
      <div className="flex-grow bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Blockchain Node Services</h1>
          <p className="text-xl text-gray-600 mb-12 text-center">
            Access high-performance blockchain nodes for your decentralized applications and services.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {nodeServices.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{service.name}</h2>
                <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-indigo-600">{service.price}</span>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                    Subscribe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeServicesPage;
