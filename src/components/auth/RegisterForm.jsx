// src/components/auth/RegisterForm.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../features/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterForm = ({ onClose, onShowLogin, className = '' }) => {
  const [credentials, setCredentials] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
  });
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
      await dispatch(registerUser({ ...credentials, subscribeNewsletter })).unwrap();
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
      emailRegex.test(email) &&
      acceptedTerms
    );
  };

  return (
    <div className={`pl-8 flex flex-col justify-center ${className}`}>
      <div className="px-6">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">Create an Account</h3>
          <p className="text-gray-600">Join Subconnect and start creating</p>
          <p className="text-sm text-gray-500 mt-1">Get started for free, upgrade anytime</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {['username', 'email', 'password', 'confirmPassword'].map((field) => (
            <div key={field}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  {field === 'username' && <FaUser className="h-4 w-4 text-gray-400" />}
                  {field === 'email' && <FaEnvelope className="h-4 w-4 text-gray-400" />}
                  {(field === 'password' || field === 'confirmPassword') && <FaLock className="h-4 w-4 text-gray-400" />}
                </div>
                <input
                  type={
                    (field === 'password' || field === 'confirmPassword') 
                      ? (showPasswords[field] ? 'text' : 'password')
                      : field === 'email' 
                      ? 'email' 
                      : 'text'
                  }
                  name={field}
                  id={field}
                  required
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200 text-sm"
                  value={credentials[field]}
                  onChange={handleChange}
                />
                {(field === 'password' || field === 'confirmPassword') && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                    onClick={() => setShowPasswords(prev => ({
                      ...prev,
                      [field]: !prev[field]
                    }))}
                  >
                    {showPasswords[field] 
                      ? <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      : <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    }
                  </button>
                )}
              </div>
            </div>
          ))}

          {passwordError && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-2 text-xs">
              {passwordError}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-2 text-xs">
              {error}
            </div>
          )}

          <div className="flex items-start mb-2">
            <div className="flex items-center h-4">
              <input
                id="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-3 h-3 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-indigo-300"
              />
            </div>
            <label htmlFor="terms" className="ml-2 text-xs text-gray-600">
              I agree to the{' '}
              <Link
                to="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Terms of Service
              </Link>
            </label>
          </div>

          <div className="flex items-start mb-3">
            <div className="flex items-center h-4">
              <input
                id="newsletter"
                type="checkbox"
                checked={subscribeNewsletter}
                onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                className="w-3 h-3 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-indigo-300"
              />
            </div>
            <label htmlFor="newsletter" className="ml-2 text-xs text-gray-600">
              Subscribe to our newsletter for updates and tips
            </label>
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || !isFormValid()}
            className={`w-full font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm ${
              isFormValid() 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>{status === 'loading' ? 'Registering...' : 'Register'}</span>
            {status !== 'loading' && <FaArrowRight />}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-600">
            Already have an account?{' '}
            <button 
              onClick={onShowLogin}
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