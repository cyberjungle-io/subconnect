// src/components/auth/LoginForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginUser, setGuestMode } from '../../features/userSlice';
import { fetchProjects, setCurrentProject } from '../../w3s/w3sSlice';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

const LoginForm = ({ onClose, initialView = 'login', onShowRegister }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { status, error } = useSelector((state) => state.user);
  const [showRegister, setShowRegister] = useState(initialView === 'register');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    setShowRegister(initialView === 'register');
  }, [initialView]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(credentials)).unwrap();
      // Fetch projects after successful login
      const resultAction = await dispatch(fetchProjects());
      if (fetchProjects.fulfilled.match(resultAction)) {
        const projects = resultAction.payload;
        if (projects.length > 0) {
          // Set the first project as the current project
          dispatch(setCurrentProject(projects[0]));
        }
      }
      onClose(); // Close the modal on successful login
      navigate('/editor'); // Redirect to the editor page
    } catch (err) {
      console.error('Failed to log in:', err);
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleGuestLogin = async () => {
    try {
      // Dispatch guest mode action
      dispatch(setGuestMode(true));
      
      // Fetch public projects after entering guest mode
      const resultAction = await dispatch(fetchProjects());
      if (fetchProjects.fulfilled.match(resultAction)) {
        const projects = resultAction.payload;
        if (projects.length > 0) {
          // Set the first public project as the current project
          dispatch(setCurrentProject(projects[0]));
        }
      }
      
      onClose(); // Close the modal
      navigate('/editor'); // Redirect to editor
    } catch (err) {
      console.error('Failed to enter guest mode:', err);
    }
  };

  const handleShowRegister = (e) => {
    e.preventDefault();
    dispatch({ type: 'user/clearError' });
    setShowRegister(true);
  };

  if (showRegister) {
    return (
      <div className="flex flex-col md:flex-row h-auto md:h-[500px]">
        {/* Guest Login Section */}
        <div className="w-full md:w-1/2 p-6 md:pr-8 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-center">
          <div className="space-y-6 px-6">
            <div className="text-center">
              <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full mb-4">
                Quick Start
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Try Subconnect Now</h3>
              <p className="text-gray-600 mb-8">Experience our platform instantly with no registration required</p>
            </div>
            
            <button
              onClick={handleGuestLogin}
              className="w-full group bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Enter as Guest</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                • Explore projects and dashboards
                <br />
                • Create sample pages
                <br />
                • No payment required
              </p>
            </div>
          </div>
        </div>

        {/* Register Form Section */}
        <RegisterForm 
          onClose={onClose} 
          onShowLogin={() => setShowRegister(false)} 
          className="w-full md:w-1/2"
        />
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-[500px]">
      {/* Guest Login Section */}
      <div className="w-full md:w-1/2 p-6 md:pr-8 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-center">
        <div className="space-y-6 px-6">
          <div className="text-center">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full mb-4">
              Quick Start
            </span>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Try Subconnect Now</h3>
            <p className="text-gray-600 mb-8">Experience our platform instantly with no registration required</p>
          </div>
          
          <button
            onClick={handleGuestLogin}
            className="w-full group bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>Enter as Guest</span>
            <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              • Explore projects and dashboards
              <br />
              • Create sample pages
              <br />
              • No payment required
            </p>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="w-full md:w-1/2 p-6 md:pl-8 flex flex-col justify-center">
        <div className="px-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h3>
            <p className="text-gray-600">Access your Subconnect account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FaEnvelope className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="Email address"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200"
                  value={credentials.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <FaLock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  required
                  placeholder="Password"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200"
                  value={credentials.password}
                  onChange={handleChange}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword 
                    ? <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    : <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  }
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-gray-600">
                  Remember me
                </label>
              </div>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgotPassword(true);
                }} 
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>{status === 'loading' ? 'Logging in...' : 'Log in'}</span>
              {status !== 'loading' && <FaArrowRight />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button href="#" onClick={handleShowRegister} className="text-indigo-600 hover:text-indigo-700 font-medium">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;