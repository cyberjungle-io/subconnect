import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="prose prose-indigo max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <p className="mt-1 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

      <section id="introduction">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
        <p className="text-gray-600">
          At Subconnect, we take your privacy seriously. This Privacy Policy explains how we collect, 
          use, disclose, and safeguard your information when you use our platform.
        </p>
      </section>

      <section id="information-we-collect">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              <li>Email address</li>
              <li>Wallet addresses</li>
              <li>Usage data and analytics</li>
              <li>Information you provide in your profile</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Blockchain Data</h3>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              <li>Public blockchain transactions</li>
              <li>Smart contract interactions</li>
              <li>On-chain activity metrics</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="how-we-use-your-information">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="flex-shrink-0 h-6 w-6 text-indigo-600">•</span>
            <span>To provide and maintain our Service</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 h-6 w-6 text-indigo-600">•</span>
            <span>To notify you about changes to our Service</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 h-6 w-6 text-indigo-600">•</span>
            <span>To provide customer support</span>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 h-6 w-6 text-indigo-600">•</span>
            <span>To gather analysis or valuable information to improve our Service</span>
          </li>
        </ul>
      </section>

      <section id="data-protection">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Protection</h2>
        <div className="prose prose-indigo text-gray-600">
          <p>
            We implement appropriate technical and organizational security measures to protect 
            your personal information, including:
          </p>
          <ul className="mt-4 space-y-2">
            <li>End-to-end encryption for sensitive data</li>
            <li>Regular security assessments and audits</li>
            <li>Secure data storage and transmission protocols</li>
            <li>Access controls and authentication mechanisms</li>
          </ul>
        </div>
      </section>

      <section id="your-rights">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Access and Control</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Request access to your personal data</li>
              <li>Correct any inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Data Portability</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Export your personal data</li>
              <li>Transfer data to another service</li>
              <li>Receive data in a structured format</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="contact-information">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-4">
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <ul className="space-y-2 text-gray-600">
            <li>Email: privacy@subconnect.com</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy; 