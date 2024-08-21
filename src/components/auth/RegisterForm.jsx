// src/components/auth/RegisterForm.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../features/userSlice';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    setPasswordError('');
    try {
      await dispatch(registerUser({ username, email, password })).unwrap();
      navigate('/editor');
    } catch (err) {
      // Error is handled by the Redux slice
    }
  };

  const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className={labelClasses}>Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor="email" className={labelClasses}>Email</label>
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
        <label htmlFor="password" className={labelClasses}>Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className={labelClasses}>Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={inputClasses}
        />
      </div>
      {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        {status === 'loading' ? 'Registering...' : 'Register'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default RegisterForm;