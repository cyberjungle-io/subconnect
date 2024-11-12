// src/components/auth/RegisterForm.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../features/userSlice';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';

const RegisterForm = ({ onClose }) => {
  const [credentials, setCredentials] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (credentials.password !== credentials.confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    setPasswordError('');
    try {
      await dispatch(registerUser(credentials)).unwrap();
      onClose();
      navigate('/editor');
    } catch (err) {
      // Error is handled by the Redux slice
    }
  };

  // Add new function to check if form is valid
  const isFormValid = () => {
    const { username, email, password, confirmPassword } = credentials;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return (
      username.trim() !== '' &&
      email.trim() !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      password === confirmPassword &&
      emailRegex.test(email)
    );
  };

  return (
    <div className="w-full pl-8 flex flex-col justify-center">
      <div className="px-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Create an Account</h3>
          <p className="text-gray-600">Join Subconnect and start creating</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {['username', 'email', 'password', 'confirmPassword'].map((field) => (
            <div key={field}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {field === 'username' && <FaUser className="h-5 w-5 text-gray-400" />}
                  {field === 'email' && <FaEnvelope className="h-5 w-5 text-gray-400" />}
                  {(field === 'password' || field === 'confirmPassword') && <FaLock className="h-5 w-5 text-gray-400" />}
                </div>
                <input
                  type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
                  name={field}
                  id={field}
                  required
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200"
                  value={credentials[field]}
                  onChange={handleChange}
                />
              </div>
            </div>
          ))}

          {passwordError && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
              {passwordError}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || !isFormValid()}
            className={`w-full font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center justify-center space-x-2 ${
              isFormValid() 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>{status === 'loading' ? 'Registering...' : 'Register'}</span>
            {status !== 'loading' && <FaArrowRight />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button 
              onClick={onClose} 
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;