import React from 'react';
import Toolbar from '../components/Editor/Toolbar';

const TutorialsPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Toolbar />
      <div className="flex-1 p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Tutorials</h1>
          <div className="bg-white rounded-lg shadow p-6">
            {/* Add your tutorials content here */}
            <p className="text-gray-600">Tutorial content coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialsPage;
