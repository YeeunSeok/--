import React from 'react';

interface BlizzardSettingsProps {
  onNavigate: (state: 'menu') => void;
}

const BlizzardSettings: React.FC<BlizzardSettingsProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="ow-heading text-4xl text-white mb-2">SETTINGS</h1>
            <p className="text-gray-400 text-lg">Customize your experience</p>
          </div>
          <button onClick={() => onNavigate('menu')} className="ow-btn ow-btn-ghost">
            ← BACK
          </button>
        </div>

        {/* Settings Categories */}
        <div className="space-y-6">
          <div className="ow-glass-card p-6">
            <h3 className="ow-subheading text-xl text-white mb-4">🎮 GAME SETTINGS</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Mouse Sensitivity</span>
                <input type="range" className="w-32" min="0.1" max="2" step="0.1" defaultValue="1" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">FOV</span>
                <input type="range" className="w-32" min="60" max="120" defaultValue="90" />
              </div>
            </div>
          </div>

          <div className="ow-glass-card p-6">
            <h3 className="ow-subheading text-xl text-white mb-4">🔊 AUDIO SETTINGS</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Master Volume</span>
                <input type="range" className="w-32" min="0" max="100" defaultValue="80" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Sound Effects</span>
                <input type="checkbox" defaultChecked />
              </div>
            </div>
          </div>

          <div className="ow-glass-card p-6">
            <h3 className="ow-subheading text-xl text-white mb-4">🎯 CROSSHAIR SETTINGS</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Custom Crosshair</span>
                <input type="checkbox" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Crosshair Color</span>
                <input type="color" defaultValue="#F99E1A" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlizzardSettings;