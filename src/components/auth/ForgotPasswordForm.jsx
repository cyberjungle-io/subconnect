import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaEnvelope } from 'react-icons/fa';
import { requestPasswordReset } from '../../features/userSlice';

const ForgotPasswordForm = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await dispatch(requestPasswordReset(email)).unwrap();
      setStatus('succeeded');
      setMessage('If an account exists with this email, you will receive password reset instructions.');
    } catch (error) {
      setStatus('failed');
      setMessage(error.message || 'Failed to send reset email');
    }
  };

  return (
    <div className="w-full max-w-md p-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h3>
        <p className="text-gray-600">Enter your email to receive reset instructions</p>
      </div>

      {status === 'succeeded' ? (
        <div className="text-center">
          <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-4">
            {message}
          </div>
          <button
            onClick={onBack}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Return to login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          {status === 'failed' && (
            <div className="bg-red-50 text-red-800 p-4 rounded-lg">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Back to login
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm; 