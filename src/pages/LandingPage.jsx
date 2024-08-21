import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our Web Editor</h1>
      <p className="text-xl mb-8">Create, design, and collaborate on web projects.</p>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Log In
        </Link>
        <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;