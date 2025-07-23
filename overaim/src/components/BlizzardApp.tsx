import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import BlizzardHeader from './BlizzardHeader';
import BlizzardMainMenu from './BlizzardMainMenu';
import BlizzardHeroSelect from './BlizzardHeroSelect';
import BlizzardTrainingMode from './BlizzardTrainingMode';
import BlizzardGameCanvas from './BlizzardGameCanvas';
import BlizzardStatistics from './BlizzardStatistics';
import BlizzardSettings from './BlizzardSettings';
import BlizzardLoadingScreen from './BlizzardLoadingScreen';
import '../styles/blizzard-theme.css';

type GameState = 'menu' | 'heroSelect' | 'modeSelect' | 'game' | 'statistics' | 'settings' | 'loading';

const BlizzardApp: React.FC = () => {
  const { isPlaying, loadStats } = useGameStore();
  const [gameState, setGameState] = useState<GameState>('loading');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // 초기 로딩
    const initApp = async () => {
      await loadStats();
      setTimeout(() => {
        setGameState('menu');
      }, 2000);
    };
    
    initApp();
  }, [loadStats]);

  useEffect(() => {
    if (isPlaying && gameState !== 'game') {
      setGameState('game');
    } else if (!isPlaying && gameState === 'game') {
      setGameState('menu');
    }
  }, [isPlaying, gameState]);

  const handleStateChange = (newState: GameState) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setGameState(newState);
      setIsTransitioning(false);
    }, 300);
  };

  const renderCurrentView = () => {
    switch (gameState) {
      case 'loading':
        return <BlizzardLoadingScreen />;
      case 'menu':
        return <BlizzardMainMenu onNavigate={handleStateChange} />;
      case 'heroSelect':
        return <BlizzardHeroSelect onNavigate={handleStateChange} />;
      case 'modeSelect':
        return <BlizzardTrainingMode onNavigate={handleStateChange} />;
      case 'game':
        return <BlizzardGameCanvas onNavigate={handleStateChange} />;
      case 'statistics':
        return <BlizzardStatistics onNavigate={handleStateChange} />;
      case 'settings':
        return <BlizzardSettings onNavigate={handleStateChange} />;
      default:
        return <BlizzardMainMenu onNavigate={handleStateChange} />;
    }
  };

  if (gameState === 'loading') {
    return <BlizzardLoadingScreen />;
  }

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <div className="ow-background" />
      
      {/* Main Container */}
      <div className={`relative z-10 transition-all duration-300 ${isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
        {/* Header - 게임 중이 아닐 때만 표시 */}
        {gameState !== 'game' && (
          <BlizzardHeader 
            currentState={gameState} 
            onNavigate={handleStateChange} 
          />
        )}
        
        {/* Main Content */}
        <main className="relative">
          {renderCurrentView()}
        </main>
        
        {/* Ambient Particles */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-400 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 2}s`,
                animationDirection: Math.random() > 0.5 ? 'normal' : 'reverse'
              }}
            />
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default BlizzardApp;