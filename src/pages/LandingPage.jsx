import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/common/Modal';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import LandingPageGraphic_2 from '../pages/Images/LandingPageGraphic_2.svg';

const LandingPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setShowRegisterForm(false);
  };

  const openRegisterModal = () => {
    setIsLoginModalOpen(true);
    setShowRegisterForm(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setShowRegisterForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-100 font-['Roboto',sans-serif]">
      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold text-indigo-900">Subconnect</div>
        </div>
        <div className="space-x-4">
          <button 
            onClick={openLoginModal} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Connect
          </button>
          <button 
            onClick={openRegisterModal}
            className="bg-white text-indigo-600 font-bold py-2 px-4 rounded border border-indigo-600 hover:bg-indigo-50 transition duration-300"
          >
            Register
          </button>
        </div>
      </header>

      {/* Hero Section - The Problem & Solution */}
      <main className="flex-grow flex items-center pt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-3/5 pr-0 md:pr-12 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full">
                    Introducing Subconnect Beta
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight text-indigo-900">
                  Transform Data <br />
                  Into <span className="text-indigo-600">Actionable Insights</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  Stop wrestling with complex data. Build beautiful Web3 pages in minutes with our no-code platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={openRegisterModal}
                  className="group bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition duration-300"
                >
                  Explore
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <button className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-indigo-600 font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition duration-300">
                  <span>Watch Demo</span>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
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

      

      {/* Features Section - Core Benefits */}
      <section id="features" className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-indigo-900 mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600">Powerful features for modern dashboard creation</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<DocumentIcon />}
              title="Visual Builder"
              description="Drag-and-drop interface for creating beautiful pages. No coding required."
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
              badge="Coming Soon"
            />
            <FeatureCard
              icon={<SocialIcon />}
              title="Social Protocols"
              description="Native integration with decentralized social protocols like Subsocial for community engagement and content sharing."
              badge="Coming Soon"
            />
            <FeatureCard
              icon={<AIIcon />}
              title="AI-Powered"
              description="Leverage AI to automatically generate queries, optimize layouts, and suggest design improvements."
              badge="Coming Soon"
            />
          </div>
        </div>
      </section>
{/* Solution Section - How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-indigo-900 mb-4">Build in Minutes, Not Weeks</h2>
            <p className="text-xl text-gray-600">A simple three-step process to create powerful Web3 pages</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="relative">
              <div className="absolute -right-6 top-8 hidden md:block">
                <svg className="w-12 h-12 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-xl shadow-sm h-full hover:shadow-md transition-shadow duration-300">
                <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-indigo-600">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Design Your Dashboard</h3>
                <p className="text-gray-600">Use our drag-and-drop builder to create beautiful visualizations instantly.</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-6 top-8 hidden md:block">
                <svg className="w-12 h-12 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-xl shadow-sm h-full hover:shadow-md transition-shadow duration-300">
                <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-indigo-600">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Connect Your Data</h3>
                <p className="text-gray-600">Choose from our pre-built integrations or connect directly to any data endpoint.</p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-xl shadow-sm h-full hover:shadow-md transition-shadow duration-300">
                <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-indigo-600">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Share & Collaborate</h3>
                <p className="text-gray-600">Invite your team, set custom permissions, and start collaborating in real-time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* After the "Build in Minutes" section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-indigo-900 mb-4">Flexibility to Create Your Own Experience</h2>
            <p className="text-xl text-gray-600 mb-8">Build custom pages that align with your unique Web3 interests and goals</p>
            
            {/* Elegant divider and subtitle */}
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px bg-indigo-200 w-12"></div>
                <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Featured Use Cases</span>
                <div className="h-px bg-indigo-200 w-12"></div>
              </div>
              <p className="text-gray-600 italic">
                Explore these popular implementations—just a glimpse of the infinite possibilities our platform enables.
              </p>
            </div>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            <div className="animate-carousel flex gap-8">
              {/* First set of cards */}
              <CarouselCard
                icon={<TeamIcon />}
                title="DAO Management"
                description="Create custom dashboards for treasury management, proposal tracking, and member engagement."
                features={['Governance metrics', 'Treasury analytics', 'Voting patterns']}
              />
              <CarouselCard
                icon={<ChartIcon />}
                title="DeFi Analytics"
                description="Monitor your DeFi portfolio with customizable views for yields, liquidity pools, and market trends."
                features={['Portfolio tracking', 'Yield optimization', 'Risk analysis']}
              />
              <CarouselCard
                icon={<DocumentIcon />}
                title="NFT Collections"
                description="Build dynamic galleries and tracking tools for NFT collections and marketplace activity."
                features={['Collection analytics', 'Price tracking', 'Rarity insights']}
              />
              <CarouselCard
                icon={<WalletIcon />}
                title="Wallet Tracking"
                description="Monitor wallet activities, transactions, and portfolio performance across multiple chains."
                features={['Multi-chain support', 'Transaction history', 'Asset overview']}
              />
              <CarouselCard
                icon={<GraphIcon />}
                title="Market Analysis"
                description="Create comprehensive market analysis dashboards with real-time data and custom metrics."
                features={['Price feeds', 'Market indicators', 'Custom alerts']}
              />
              <CarouselCard
                icon={<CommunityIcon />}
                title="Community Engagement"
                description="Build interactive spaces for community participation and social engagement tracking."
                features={['Member analytics', 'Engagement metrics', 'Social tracking']}
              />
              <CarouselCard
                icon={<ProfileIcon />}
                title="Web3 Profiles"
                description="Create dynamic profile pages that aggregate on-chain activity and social presence."
                features={['Identity verification', 'Reputation scoring', 'Cross-chain activity']}
              />
              <CarouselCard
                icon={<HomeIcon />}
                title="Smart Home Hub"
                description="Monitor and control IoT devices with blockchain-based authentication and automation."
                features={['Device management', 'Energy tracking', 'Smart contracts']}
              />
              <CarouselCard
                icon={<GovIcon />}
                title="OpenGov Analytics"
                description="Track and analyze Polkadot's governance activities with comprehensive dashboards."
                features={['Track active referenda', 'Delegation insights', 'Vote participation metrics']}
              />
              
              {/* Duplicate set for seamless loop */}
              <CarouselCard
                icon={<TeamIcon />}
                title="DAO Management"
                description="Create custom dashboards for treasury management, proposal tracking, and member engagement."
                features={['Governance metrics', 'Treasury analytics', 'Voting patterns']}
              />
              <CarouselCard
                icon={<ChartIcon />}
                title="DeFi Analytics"
                description="Monitor your DeFi portfolio with customizable views for yields, liquidity pools, and market trends."
                features={['Portfolio tracking', 'Yield optimization', 'Risk analysis']}
              />
              <CarouselCard
                icon={<DocumentIcon />}
                title="NFT Collections"
                description="Build dynamic galleries and tracking tools for NFT collections and marketplace activity."
                features={['Collection analytics', 'Price tracking', 'Rarity insights']}
              />
              <CarouselCard
                icon={<WalletIcon />}
                title="Wallet Tracking"
                description="Monitor wallet activities, transactions, and portfolio performance across multiple chains."
                features={['Multi-chain support', 'Transaction history', 'Asset overview']}
              />
              <CarouselCard
                icon={<GraphIcon />}
                title="Market Analysis"
                description="Create comprehensive market analysis dashboards with real-time data and custom metrics."
                features={['Price feeds', 'Market indicators', 'Custom alerts']}
              />
              <CarouselCard
                icon={<CommunityIcon />}
                title="Community Engagement"
                description="Build interactive spaces for community participation and social engagement tracking."
                features={['Member analytics', 'Engagement metrics', 'Social tracking']}
              />
              <CarouselCard
                icon={<ProfileIcon />}
                title="Web3 Profiles"
                description="Create dynamic profile pages that aggregate on-chain activity and social presence."
                features={['Identity verification', 'Reputation scoring', 'Cross-chain activity']}
              />
              <CarouselCard
                icon={<HomeIcon />}
                title="Smart Home Hub"
                description="Monitor and control IoT devices with blockchain-based authentication and automation."
                features={['Device management', 'Energy tracking', 'Smart contracts']}
              />
              <CarouselCard
                icon={<GovIcon />}
                title="OpenGov Analytics"
                description="Track and analyze Polkadot's governance activities with comprehensive dashboards."
                features={['Track active referenda', 'Delegation insights', 'Vote participation metrics']}
              />
            </div>
          </div>

          {/* Featured Use Cases Section */}
          <section className="py-20 bg-gradient-to-br from-indigo-50 to-blue-50 overflow-hidden mt-2">
            <div className="container mx-auto px-4">
              {/* Bottom CTA Section */}
              <div className="text-center">
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Whether you're building for DeFi, DAOs, NFTs, or pioneering an entirely new Web3 vertical, our platform adapts to your vision.
                </p>
               
              </div>
            </div>
          </section>
        </div>
      </section>

     
      {/* Call to Action - The Future */}
      <section className="py-20 bg-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Transform Your Web3 Experience?</h2>
          <p className="text-xl mb-8 text-indigo-200">Join the next generation of Web3 analytics and collaboration</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={openRegisterModal}
              className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold py-4 px-8 rounded-lg text-xl transition duration-300"
            >
              Explore for Free
            </button>
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
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
              <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-gray-600 hover:text-indigo-600">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-600 hover:text-indigo-600">
                    Terms
                  </Link>
                </li>
                <li><a href="#" className="text-gray-600 hover:text-indigo-600">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 flex justify-between items-center">
            <div className="text-gray-600">© 2024 Subconnect. All rights reserved.</div>
            <div className="flex space-x-6">
              
              <a 
                href="https://x.com/Subconnect_io" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-600 hover:text-indigo-600"
              >
                <span className="sr-only">X (Twitter)</span>
                <svg 
                  className="w-5 h-5" 
                  fill="currentColor" 
                  viewBox="0 0 24 24" 
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
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

      <Modal isOpen={isLoginModalOpen} onClose={closeLoginModal} title={showRegisterForm ? "Create Account" : "Log In"}>
        <LoginForm 
          onClose={closeLoginModal}
          initialView={showRegisterForm ? "register" : "login"}
          onShowRegister={() => setShowRegisterForm(true)}
        />
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

// Add this section before the blockchain features section

<section className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-indigo-900 mb-4">Why Choose Subconnect</h2>
      <p className="text-xl text-gray-600">Built for modern teams who need powerful data visualization</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Fast Setup</h3>
          <p className="text-gray-600">Get your first dashboard up and running in minutes, not days. No coding required.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise-Grade Security</h3>
          <p className="text-gray-600">Built with security-first architecture and end-to-end encryption for your data.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Updates</h3>
          <p className="text-gray-600">See your data update in real-time with our powerful streaming architecture.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Predictable Pricing</h3>
          <p className="text-gray-600">Simple, transparent pricing with no hidden fees or surprise charges.</p>
        </div>
      </div>
    </div>
  </div>
</section>

// Add this new component
const CarouselCard = ({ icon, title, description, features }) => (
  <div className="flex-shrink-0 w-[400px] bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <ul className="space-y-2 text-sm text-gray-600">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <span className="mr-2">•</span>
          {feature}
        </li>
      ))}
    </ul>
  </div>
);

// Add new icon components
const ProfileIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
);

const GovIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const WalletIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const GraphIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
);

const CommunityIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default LandingPage;