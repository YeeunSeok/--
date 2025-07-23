import React from 'react';
import { useGameStore } from '../store/gameStore';
import { trainingModes } from '../data/trainingModes';

interface BlizzardTrainingModeProps {
  onNavigate: (state: 'menu' | 'heroSelect') => void;
}

const BlizzardTrainingMode: React.FC<BlizzardTrainingModeProps> = ({ onNavigate }) => {
  const { currentMode, setMode, startGame } = useGameStore();

  const handleStartTraining = () => {
    if (currentMode) {
      console.log('Starting game with mode:', currentMode);
      try {
        startGame();
      } catch (error) {
        console.error('Error starting game:', error);
      }
    } else {
      console.warn('No training mode selected');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="ow-heading text-4xl text-white mb-2">TRAINING MODES</h1>
            <p className="text-gray-400 text-lg">Select your training scenario</p>
          </div>
          <div className="flex space-x-4">
            <button onClick={() => onNavigate('menu')} className="ow-btn ow-btn-ghost">
              ← MENU
            </button>
            <button onClick={() => onNavigate('heroSelect')} className="ow-btn ow-btn-secondary">
              HEROES
            </button>
          </div>
        </div>

        {/* Training Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {trainingModes.map((mode, index) => (
            <div
              key={mode.id}
              className={`
                ow-glass-card p-6 cursor-pointer transition-all duration-300 transform hover:scale-[1.02]
                ${currentMode?.id === mode.id ? 'border-2 border-orange-500 bg-orange-500/10' : ''}
              `}
              onClick={() => setMode(mode)}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">
                  {mode.type === 'precision' && '🎯'}
                  {mode.type === 'flick' && '⚡'}
                  {mode.type === 'tracking' && '🔄'}
                </div>
                <h3 className="ow-subheading text-xl text-white mb-2">{mode.name}</h3>
                <p className="text-gray-400 text-sm">{mode.description}</p>
              </div>
              
              {/* Mode Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="ow-stat bg-black/30 p-3 rounded-lg">
                  <div className="ow-stat-value text-orange-500">{mode.duration}s</div>
                  <div className="ow-stat-label">DURATION</div>
                </div>
                <div className="ow-stat bg-black/30 p-3 rounded-lg">
                  <div className="ow-stat-value text-blue-400">{mode.targetSize}px</div>
                  <div className="ow-stat-label">SIZE</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Start Button */}
        {currentMode && (
          <div className="text-center">
            <button
              onClick={handleStartTraining}
              className="ow-btn ow-btn-primary text-xl px-12 py-4"
            >
              🎯 START TRAINING
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlizzardTrainingMode;