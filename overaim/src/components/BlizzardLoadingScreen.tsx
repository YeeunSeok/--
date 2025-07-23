import React, { useState, useEffect } from 'react';

const BlizzardLoadingScreen: React.FC = () => {
  const [loadingText, setLoadingText] = useState('INITIALIZING TRAINING PROTOCOLS');
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  const loadingMessages = [
    'INITIALIZING TRAINING PROTOCOLS',
    'CALIBRATING AIM SYSTEMS',
    'LOADING HERO CONFIGURATIONS',
    'ESTABLISHING CONNECTION TO OVERWATCH NETWORK',
    'PREPARING TRAINING SCENARIOS',
    'FINALIZING SETUP'
  ];

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 3;
      });
    }, 50);

    // Loading text rotation
    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        const currentIndex = loadingMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 800);

    // Dots animation
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 400);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-black to-blue-900/20 animate-pulse" />
        
        {/* Hexagonal Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100">
          <defs>
            <pattern id="hexagon" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <polygon points="5,1 8.66,3 8.66,7 5,9 1.34,7 1.34,3" 
                       fill="none" 
                       stroke="currentColor" 
                       strokeWidth="0.1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagon)" className="text-orange-500" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl px-8">
        {/* Logo */}
        <div className="mb-12">
          <div className="relative">
            <h1 className="ow-heading text-6xl md:text-8xl mb-4 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              OVERAIM
            </h1>
            <div className="absolute inset-0 ow-heading text-6xl md:text-8xl mb-4 text-orange-500 opacity-20 blur-sm">
              OVERAIM
            </div>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 font-light tracking-wider">
            PRECISION • PERFORMANCE • PERFECTION
          </p>
        </div>

        {/* Loading Animation */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-8">
            {/* Outer Ring */}
            <div className="absolute inset-0 border-4 border-orange-500/30 rounded-full animate-spin-slow" />
            
            {/* Middle Ring */}
            <div className="absolute inset-4 border-4 border-blue-500/30 rounded-full animate-spin-reverse" />
            
            {/* Inner Core */}
            <div className="absolute inset-8 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full animate-pulse" />
            
            {/* Center Dot */}
            <div className="absolute inset-12 bg-white rounded-full animate-ping" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full max-w-md mx-auto bg-gray-800 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-300 ease-out relative"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-30 animate-pulse" />
            </div>
          </div>
          <div className="mt-2 text-orange-400 font-mono text-lg">
            {Math.floor(Math.min(progress, 100))}%
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <p className="text-white text-lg font-semibold tracking-wider mb-2">
            {loadingText}
            <span className="text-orange-500">{dots}</span>
          </p>
          <p className="text-gray-400 text-sm">
            Preparing the ultimate aim training experience
          </p>
        </div>

        {/* Bottom Tips */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-gray-500 text-sm mb-2">💡 PRO TIP</p>
          <p className="text-gray-400 text-xs max-w-md">
            Use consistent mouse sensitivity across all games for muscle memory development
          </p>
        </div>
      </div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-orange-400 rounded-full opacity-40 animate-bounce"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  );
};

export default BlizzardLoadingScreen;