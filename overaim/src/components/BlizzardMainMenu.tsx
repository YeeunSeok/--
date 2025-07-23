import React, { useState, useEffect } from 'react';

interface BlizzardMainMenuProps {
  onNavigate: (state: 'heroSelect' | 'modeSelect' | 'statistics' | 'settings') => void;
}

const BlizzardMainMenu: React.FC<BlizzardMainMenuProps> = ({ onNavigate }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [newsIndex, setNewsIndex] = useState(0);

  const newsItems = [
    "🎯 NEW: Advanced flick shot training mode now available",
    "🏆 PATCH: Improved accuracy calculation algorithm",
    "🎮 EVENT: Weekly aim challenge is now live",
    "💪 TIP: Practice 15 minutes daily for optimal improvement",
    "🔥 UPDATE: New hero configurations added to training"
  ];

  useEffect(() => {
    const newsInterval = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % newsItems.length);
    }, 4000);

    return () => clearInterval(newsInterval);
  }, [newsItems.length]);

  const menuCards = [
    {
      id: 'training',
      title: 'START TRAINING',
      subtitle: 'Begin Your Journey',
      description: 'Jump into precision aim training with customizable scenarios',
      icon: '🎯',
      gradient: 'from-orange-600 to-red-600',
      action: () => onNavigate('modeSelect'),
      featured: true
    },
    {
      id: 'heroes',
      title: 'HERO SELECT',
      subtitle: 'Choose Your Fighter',
      description: 'Select from 32 Overwatch heroes with unique crosshairs',
      icon: '🦸',
      gradient: 'from-blue-600 to-purple-600',
      action: () => onNavigate('heroSelect')
    },
    {
      id: 'statistics',
      title: 'STATISTICS',
      subtitle: 'Track Progress',
      description: 'Analyze your performance with detailed analytics',
      icon: '📊',
      gradient: 'from-green-600 to-teal-600',
      action: () => onNavigate('statistics')
    },
    {
      id: 'settings',
      title: 'SETTINGS',
      subtitle: 'Customize Experience',
      description: 'Fine-tune your training environment and preferences',
      icon: '⚙️',
      gradient: 'from-gray-600 to-gray-800',
      action: () => onNavigate('settings')
    }
  ];

  const quickStats = [
    { label: 'Training Sessions', value: '42', icon: '🎯' },
    { label: 'Best Accuracy', value: '89%', icon: '🏆' },
    { label: 'Total Shots', value: '12.3K', icon: '💥' },
    { label: 'Training Time', value: '156h', icon: '⏱️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-blue-500/20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h1 className="ow-heading text-5xl md:text-7xl mb-6 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            WELCOME TO OVERAIM
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            The ultimate precision training platform designed by professionals, 
            <br />for those who demand perfection in their aim.
          </p>
          
          {/* News Ticker */}
          <div className="bg-black/30 backdrop-blur-sm rounded-full px-6 py-3 inline-block border border-orange-500/20">
            <p className="text-orange-400 text-sm font-medium animate-pulse">
              {newsItems[newsIndex]}
            </p>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {quickStats.map((stat, index) => (
            <div 
              key={stat.label}
              className="ow-glass-card p-4 text-center transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="ow-stat-value text-2xl text-orange-500">{stat.value}</div>
              <div className="ow-stat-label text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Menu Cards */}
        <div className="ow-hover-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {menuCards.map((card, index) => (
            <div
              key={card.id}
              className={`
                relative group cursor-pointer transform transition-all duration-300 ease-out
                ${card.featured ? 'md:col-span-2' : ''}
                ${hoveredCard === card.id ? 'scale-[1.02] z-20' : ''}
              `}
              style={{
                animationDelay: `${index * 0.2}s`,
                animation: 'slideUp 0.8s ease-out forwards'
              }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={card.action}
            >
              <div className={`
                ow-glass-card p-8 h-full relative overflow-hidden
                ${card.featured ? 'min-h-[300px]' : 'min-h-[200px]'}
              `}>
                {/* Background Gradient */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-10 
                  group-hover:opacity-20 transition-opacity duration-300
                `}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl md:text-5xl">{card.icon}</div>
                    {card.featured && (
                      <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        FEATURED
                      </div>
                    )}
                  </div>
                  
                  <h3 className="ow-heading text-2xl md:text-3xl text-white mb-2">
                    {card.title}
                  </h3>
                  
                  <p className="text-orange-400 font-semibold mb-4 text-lg">
                    {card.subtitle}
                  </p>
                  
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {card.description}
                  </p>
                  
                  {/* Action Button */}
                  <button className="ow-btn ow-btn-primary group-hover:scale-105 transition-transform duration-300">
                    <span className="mr-2">→</span>
                    ENTER
                  </button>
                </div>

                {/* Hover Effect Overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300
                `}></div>

                {/* Animated Border */}
                <div className={`
                  absolute inset-0 rounded-lg border-2 border-transparent
                  group-hover:border-orange-500/50 transition-colors duration-300
                `}></div>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Bottom Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="ow-glass-card p-6 text-center">
            <div className="text-3xl mb-4">🎮</div>
            <h4 className="text-white font-bold mb-2">32 HEROES</h4>
            <p className="text-gray-400 text-sm">Complete roster with authentic crosshairs and mechanics</p>
          </div>
          
          <div className="ow-glass-card p-6 text-center">
            <div className="text-3xl mb-4">⚡</div>
            <h4 className="text-white font-bold mb-2">REAL-TIME FEEDBACK</h4>
            <p className="text-gray-400 text-sm">Instant performance analysis and improvement suggestions</p>
          </div>
          
          <div className="ow-glass-card p-6 text-center">
            <div className="text-3xl mb-4">📈</div>
            <h4 className="text-white font-bold mb-2">ADVANCED ANALYTICS</h4>
            <p className="text-gray-400 text-sm">Professional-grade statistics and progress tracking</p>
          </div>
        </div>
      </div>

      {/* Floating Action Particles */}
      {hoveredCard && (
        <div className="fixed inset-0 pointer-events-none z-5">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-orange-400 rounded-full opacity-60 animate-bounce"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default BlizzardMainMenu;