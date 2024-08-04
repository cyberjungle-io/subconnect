// src/components/auth/LoginForm.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/userSlice';

const LoginForm = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginMessage('');
    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        setLoginMessage('Login successful!');
        setTimeout(() => {
          onClose();
        }, 1500); // Close the modal after 1.5 seconds
      } else {
        setLoginMessage('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setLoginMessage('An error occurred. Please try again.');
    }
  };

  const inputClasses = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={inputClasses}
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        {status === 'loading' ? 'Logging in...' : 'Login'}
      </button>
      {loginMessage && (
        <p className={`text-sm ${loginMessage.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
          {loginMessage}
        </p>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default LoginForm;