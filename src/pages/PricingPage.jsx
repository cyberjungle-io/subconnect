import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import './pricingpage.css';  // Add this line to import the CSS
import Toolbar from '../components/Editor/Toolbar';

const PricingTier = ({ title, monthlyPrice, yearlyPrice, features, isPopular, isYearly }) => (
  <div className={`flex flex-col p-6 w-full max-w-sm text-center text-gray-900 bg-white rounded-lg border ${isPopular ? 'border-blue-500 shadow-2xl md:-mt-8 relative z-10' : 'border-gray-100'} xl:p-8`}>
    {isPopular && (
      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-4 absolute -top-3 left-1/2 transform -translate-x-1/2">Recommended</span>
    )}
    <h3 className={`mb-4 ${isPopular ? 'text-3xl' : 'text-2xl'} font-semibold`}>{title}</h3>
    <div className="flex flex-col justify-center items-center my-8">
      <div className="flex items-baseline">
        <span className={`mr-2 ${isPopular ? 'text-6xl' : 'text-5xl'} font-extrabold`}>
          ${isYearly ? yearlyPrice : monthlyPrice}
        </span>
        <span className="text-gray-500">/{isYearly ? 'year' : 'month'}</span>
      </div>
      <span className="text-sm text-gray-500 mt-2">
        {isYearly ? `$${monthlyPrice}/month billed annually` : `$${yearlyPrice}/year billed annually`}
      </span>
    </div>
    <ul className="mb-8 space-y-4 text-left">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center space-x-3">
          <FaCheck className="flex-shrink-0 w-5 h-5 text-green-500" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <div className="mt-auto">
      <a href="#" className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${isPopular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}>
        Get started
      </a>
    </div>
  </div>
);

const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);

  const pricingTiers = [
    {
      title: 'Free',
      monthlyPrice: '0',
      yearlyPrice: '0',
      features: [
        'View any public page',
        'Interact with pages (with permissions)',
        'Build a page (without saving)',
      ],
    },
    {
      title: 'Entry',
      monthlyPrice: '5',
      yearlyPrice: '50',
      features: [
        'All Free features',
        'Save Pages',
        '1-10 page limit',
      ],
      isPopular: true,
    },
    {
      title: 'Premium',
      monthlyPrice: '15',
      yearlyPrice: '150',
      features: [
        'All Entry features',
        'Up to 50 pages',
        'AI features (query and page builder)',
        'Groups (admin or builder access)',
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Toolbar />
      <div className="flex-grow bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-end mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 w-full text-center">Pricing Plans</h2>
            <div className="flex items-center text-sm">
              <span className={`mr-2 ${isYearly ? 'text-gray-500' : 'font-semibold'}`}>Monthly</span>
              <label className="switch switch-sm">
                <input type="checkbox" checked={isYearly} onChange={() => setIsYearly(!isYearly)} />
                <span className="slider round"></span>
              </label>
              <span className={`ml-2 ${isYearly ? 'font-semibold' : 'text-gray-500'}`}>Yearly</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <PricingTier key={index} {...tier} isYearly={isYearly} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;