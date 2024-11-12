import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="prose prose-indigo max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      
      <section id="agreement" className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
        <p className="text-gray-600 mb-4">
          By accessing or using Subconnect's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you disagree with any part of these terms, you may not access our service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
        <p className="text-gray-600 mb-4">
          Subconnect provides a no-code platform for creating Web3 dashboards and data visualizations. We offer both free and paid subscription services with different features and capabilities.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>You must be at least 18 years old to use this service</li>
          <li>You are responsible for maintaining the security of your account credentials</li>
          <li>You are responsible for all activities that occur under your account</li>
          <li>You must notify us immediately of any unauthorized use of your account</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Intellectual Property</h2>
        <p className="text-gray-600 mb-4">
          The service and its original content, features, and functionality are owned by Subconnect and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. User Content</h2>
        <p className="text-gray-600 mb-4">
          Users retain their rights to any content they submit, post, or display on or through the service. By submitting content, you grant Subconnect a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your content.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Acceptable Use</h2>
        <p className="text-gray-600 mb-4">
          You agree to use the service in accordance with all applicable laws and regulations. You must not use the service for any unlawful purpose or in any way that could damage, disable, or impair the service or interfere with any other party's use of the service.
        </p>
      </section>
    </div>
  );
};

export default TermsOfService; 