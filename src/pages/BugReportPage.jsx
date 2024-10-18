import React, { useState } from 'react';
import Toolbar from '../components/Editor/Toolbar';

const BugReportPage = () => {
  const [bugReport, setBugReport] = useState({
    title: '',
    description: '',
    steps: '',
    expectedBehavior: '',
    actualBehavior: '',
    browserInfo: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBugReport((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the bug report to your backend
    console.log('Bug report submitted:', bugReport);
    // Reset the form
    setBugReport({
      title: '',
      description: '',
      steps: '',
      expectedBehavior: '',
      actualBehavior: '',
      browserInfo: '',
    });
    alert('Thank you for your bug report!');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Toolbar />
      <div className="flex-grow bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Report a Bug</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Bug Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={bugReport.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Bug Description
              </label>
              <textarea
                name="description"
                id="description"
                required
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={bugReport.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div>
              <label htmlFor="steps" className="block text-sm font-medium text-gray-700">
                Steps to Reproduce
              </label>
              <textarea
                name="steps"
                id="steps"
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={bugReport.steps}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div>
              <label htmlFor="expectedBehavior" className="block text-sm font-medium text-gray-700">
                Expected Behavior
              </label>
              <textarea
                name="expectedBehavior"
                id="expectedBehavior"
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={bugReport.expectedBehavior}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div>
              <label htmlFor="actualBehavior" className="block text-sm font-medium text-gray-700">
                Actual Behavior
              </label>
              <textarea
                name="actualBehavior"
                id="actualBehavior"
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={bugReport.actualBehavior}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div>
              <label htmlFor="browserInfo" className="block text-sm font-medium text-gray-700">
                Browser and System Information
              </label>
              <input
                type="text"
                name="browserInfo"
                id="browserInfo"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={bugReport.browserInfo}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Bug Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BugReportPage;
