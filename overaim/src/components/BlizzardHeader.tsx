import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

interface BlizzardHeaderProps {
  currentState: string;
  onNavigate: (state: 'menu' | 'heroSelect' | 'modeSelect' | 'statistics' | 'settings') => void;
}

const BlizzardHeader: React.FC<BlizzardHeaderProps> = ({ currentState, onNavigate }) => {
  const { score, timeRemaining, isPlaying, streak, accuracy } = useGameStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const navigationItems = [
    { id: 'menu', label: 'HOME', icon: '🏠' },
    { id: 'heroSelect', label: 'HEROES', icon: '🦸' },
    { id: 'modeSelect', label: 'TRAINING', icon: '🎯' },
    { id: 'statistics', label: 'STATS', icon: '📊' },
    { id: 'settings', label: 'SETTINGS', icon: '⚙️' }
  ];

  return (
    <header className="relative">
      {/* Top Status Bar */}
      <div className="bg-black/80 backdrop-blur-sm border-b border-orange-500/20">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6 text-gray-400">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>ONLINE</span>
              </span>
              <span>REGION: ASIA</span>
              <span>PING: 15ms</span>
            </div>
            <div className="flex items-center space-x-6 text-gray-400">
              <span>PLAYER: TRAINEE</span>
              <span className="font-mono">{formatTime(currentTime)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black border-b-2 border-orange-500/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">🎯</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="ow-heading text-2xl text-white">
                  OVER<span className="text-orange-500">AIM</span>
                </h1>
                <p className="text-xs text-gray-400 tracking-wider">PRECISION TRAINING SYSTEM</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as any)}
                  className={`
                    relative px-4 py-2 rounded-lg font-semibold text-sm tracking-wider transition-all duration-300
                    ${currentState === item.id
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                  
                  {currentState === item.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-orange-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </nav>

            {/* Game Stats (when playing) */}
            {isPlaying && (
              <div className="flex items-center space-x-6">
                <div className="ow-stat bg-black/50 p-3 rounded-lg border border-orange-500/30">
                  <div className="ow-stat-value text-xl text-orange-500">
                    {score.toLocaleString()}
                  </div>
                  <div className="ow-stat-label text-xs">SCORE</div>
                </div>
                
                <div className="ow-stat bg-black/50 p-3 rounded-lg border border-blue-500/30">
                  <div className="ow-stat-value text-xl text-blue-400">
                    {Math.max(0, timeRemaining)}
                  </div>
                  <div className="ow-stat-label text-xs">TIME</div>
                </div>
                
                <div className="ow-stat bg-black/50 p-3 rounded-lg border border-green-500/30">
                  <div className="ow-stat-value text-xl text-green-400">
                    {streak}
                  </div>
                  <div className="ow-stat-label text-xs">STREAK</div>
                </div>
              </div>
            )}

            {/* User Profile */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-white font-semibold text-sm">TRAINEE</p>
                <p className="text-gray-400 text-xs">RANK: BRONZE</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center border-2 border-orange-500/30">
                <span className="text-white text-lg">👤</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-1 bg-gray-800">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300 ease-linear"
              style={{ 
                width: `${Math.max(0, (timeRemaining / 30) * 100)}%` // 30초 기준
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Mobile Menu Button */}
      <div className="md:hidden absolute top-1/2 right-6 transform -translate-y-1/2">
        <button className="text-white p-2 rounded-lg hover:bg-white/10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
    </header>
  );
};

export default BlizzardHeader;