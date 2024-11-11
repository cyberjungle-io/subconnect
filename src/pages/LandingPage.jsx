import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/common/Modal';
import LoginForm from '../components/auth/LoginForm';
import LandingPageGraphic_2 from '../pages/Images/LandingPageGraphic_2.svg';

const LandingPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-100 font-['Roboto',sans-serif]">
      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold text-indigo-900">Subconnect</div>
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="text-gray-600 hover:text-indigo-900">Features</a>
            <a href="#solutions" className="text-gray-600 hover:text-indigo-900">Solutions</a>
            <Link to="/docs" className="text-gray-600 hover:text-indigo-900">Documentation</Link>
            <a href="#pricing" className="text-gray-600 hover:text-indigo-900">Pricing</a>
          </nav>
        </div>
        <div className="space-x-4">
          <button onClick={openLoginModal} className="bg-white text-indigo-600 font-bold py-2 px-4 rounded border border-indigo-600 hover:bg-indigo-50 transition duration-300">
            Log In
          </button>
          <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Start Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center pt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-3/5 pr-0 md:pr-12 space-y-8">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full">
                  Powerful Dashboard Builder
                </span>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight text-indigo-900">
                  Build Interactive Dashboards in Minutes
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  Create powerful data visualizations, collaborative workspaces, and Web3-ready dashboards without coding.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition duration-300">
                  Start Free Trial
                </button>
                <button className="group flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-indigo-600 font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition duration-300">
                  <span>Watch Demo</span>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="w-full md:w-2/5 mt-12 md:mt-0">
              <img src={LandingPageGraphic_2} alt="Interactive Dashboard Builder" className="w-full h-auto drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-indigo-900 mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600">Powerful features for modern dashboard creation</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<DocumentIcon />}
              title="Visual Builder"
              description="Drag-and-drop interface for creating beautiful dashboards. No coding required."
            />
            <FeatureCard
              icon={<ChartIcon />}
              title="Live Data"
              description="Connect to your data sources with built-in GraphQL integration for real-time updates."
            />
            <FeatureCard
              icon={<TeamIcon />}
              title="Collaboration"
              description="Real-time whiteboards, kanban boards, and team workspaces for seamless teamwork."
            />
            <FeatureCard
              icon={<BlockchainIcon />}
              title="Blockchain Integration"
              description="Connect with Web3 protocols, access nodes directly for custom indexing, and display on-chain data in real-time."
            />
            <FeatureCard
              icon={<SocialIcon />}
              title="Social Protocols"
              description="Native integration with decentralized social protocols like Subsocial for community engagement and content sharing."
              badge="Coming Soon"
            />
            <FeatureCard
              icon={<AIIcon />}
              title="AI-Powered Design"
              description="Leverage AI to automatically generate queries, optimize layouts, and suggest design improvements."
              badge="Coming Soon"
            />
          </div>
        </div>
      </section>

      {/* Add Blockchain Features Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-indigo-900 mb-6">Advanced Blockchain Integration</h2>
            <p className="text-xl text-gray-600">Build powerful Web3 dashboards with direct node access and custom indexing</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-indigo-600 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Indexing</h3>
              <p className="text-gray-600">Create specialized indexes for your specific blockchain data needs with direct node access.</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Historical data aggregation
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom event tracking
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-indigo-600 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Node Access</h3>
              <p className="text-gray-600">Connect directly to blockchain nodes for real-time data access and custom queries.</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time block monitoring
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom RPC endpoints
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-indigo-600 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Processing</h3>
              <p className="text-gray-600">Process and transform blockchain data for your specific use case.</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom data transformations
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Automated data pipelines
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Get Started?</h2>
          <p className="text-xl mb-12 text-indigo-200">Join thousands of teams already using Subconnect</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold py-4 px-8 rounded-lg text-xl transition duration-300">
              Start Free Trial
            </button>
            <Link to="/docs" className="border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-lg text-xl transition duration-300">
              View Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Pricing</a></li>
                <li><Link to="/docs" className="text-gray-600 hover:text-indigo-600">Documentation</Link></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Updates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Community</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Partners</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Privacy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Terms</a></li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 flex justify-between items-center">
            <div className="text-gray-600">© 2024 Subconnect. All rights reserved.</div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-indigo-600">
                <span className="sr-only">Twitter</span>
                {/* Add Twitter icon */}
              </a>
              <a href="#" className="text-gray-600 hover:text-indigo-600">
                <span className="sr-only">GitHub</span>
                {/* Add GitHub icon */}
              </a>
              <a href="#" className="text-gray-600 hover:text-indigo-600">
                <span className="sr-only">LinkedIn</span>
                {/* Add LinkedIn icon */}
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal} title="Log In">
        <LoginForm />
      </Modal>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, badge }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 relative">
    {badge && (
      <span className="absolute top-4 right-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
        {badge}
      </span>
    )}
    <div className="text-indigo-600 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Icon Components (You'll need to implement these)
const DocumentIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const TeamIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const BlockchainIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const SocialIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
  </svg>
);

const AIIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.5a1 1 0 100-2 1 1 0 000 2zM12 12.5a1 1 0 100-2 1 1 0 000 2z" />
  </svg>
);

// Optional: Add a detailed social features section
const SocialFeaturesSection = () => (
  <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full mb-4">
          Coming Soon
        </span>
        <h2 className="text-4xl font-bold text-indigo-900 mb-6">Decentralized Social Integration</h2>
        <p className="text-xl text-gray-600">Connect and engage with your community through Web3 social protocols</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-indigo-600 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Engagement</h3>
          <p className="text-gray-600">Enable direct community interaction through decentralized social feeds and discussions.</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-indigo-600 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Subsocial Integration</h3>
          <p className="text-gray-600">Seamlessly connect with Subsocial's decentralized social networking features.</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-indigo-600 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Content Distribution</h3>
          <p className="text-gray-600">Share and distribute content across decentralized social networks with built-in tools.</p>
        </div>
      </div>
    </div>
  </section>
);

// Optional: Add a detailed blockchain features section
const BlockchainFeaturesSection = () => (
  <section className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50">
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-indigo-900 mb-6">Advanced Blockchain Integration</h2>
        <p className="text-xl text-gray-600">Build powerful Web3 dashboards with direct node access and custom indexing</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-indigo-600 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Indexing</h3>
          <p className="text-gray-600">Create specialized indexes for your specific blockchain data needs with direct node access.</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Historical data aggregation
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Custom event tracking
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-indigo-600 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Node Access</h3>
          <p className="text-gray-600">Connect directly to blockchain nodes for real-time data access and custom queries.</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Real-time block monitoring
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Custom RPC endpoints
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="text-indigo-600 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Processing</h3>
          <p className="text-gray-600">Process and transform blockchain data for your specific use case.</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Custom data transformations
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Automated data pipelines
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default LandingPage;