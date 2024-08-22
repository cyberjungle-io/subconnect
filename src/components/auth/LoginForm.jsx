// src/components/auth/LoginForm.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/userSlice';
import { fetchProjects } from '../../w3s/w3sSlice'; // Added this import
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { status, error } = useSelector((state) => state.user);

  const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(credentials)).unwrap();
      // Fetch projects after successful login
      await dispatch(fetchProjects());
      onClose(); // Close the modal on successful login
      navigate('/editor'); // Redirect to the editor page
    } catch (err) {
      console.error('Failed to log in:', err);
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className={labelClasses}>Email</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className={inputClasses}
          value={credentials.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password" className={labelClasses}>Password</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          className={inputClasses}
          value={credentials.password}
          onChange={handleChange}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        {status === 'loading' ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  );
};

export default LoginForm;