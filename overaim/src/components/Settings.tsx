import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import HeroSelector from './HeroSelector';
import CrosshairSettings from './CrosshairSettings';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hero' | 'crosshair' | 'game'>('hero');
  const { settings, updateSettings, isPlaying } = useGameStore();

  if (isPlaying) {
    return null;
  }

  const tabs = [
    { id: 'hero', name: '히어로', icon: '🎮' },
    { id: 'crosshair', name: '크로스헤어', icon: '🎯' },
    { id: 'game', name: '게임', icon: '⚙️' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-overwatch-dark bg-opacity-50 p-1 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-overwatch transition-all
              ${activeTab === tab.id
                ? 'bg-overwatch-orange text-white'
                : 'text-overwatch-light-gray hover:text-white hover:bg-overwatch-gray hover:bg-opacity-30'
              }
            `}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="font-bold">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'hero' && <HeroSelector />}
        {activeTab === 'crosshair' && <CrosshairSettings />}
        {activeTab === 'game' && (
          <div className="bg-overwatch-gray bg-opacity-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-overwatch-orange font-overwatch mb-4">
              게임 설정
            </h3>
            
            <div className="space-y-6">
              {/* Sensitivity */}
              <div>
                <label className="block text-overwatch-blue font-bold mb-2">
                  마우스 감도: {settings.sensitivity.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="5.0"
                  step="0.1"
                  value={settings.sensitivity}
                  onChange={(e) => updateSettings({ sensitivity: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-overwatch-dark rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-overwatch-light-gray mt-1">
                  <span>0.1 (매우 낮음)</span>
                  <span>5.0 (매우 높음)</span>
                </div>
              </div>

              {/* Volume */}
              <div>
                <label className="block text-overwatch-blue font-bold mb-2">
                  음량: {Math.round(settings.volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.volume}
                  onChange={(e) => updateSettings({ volume: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-overwatch-dark rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Display Options */}
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-white font-overwatch">
                  화면 표시 옵션
                </h4>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showFps}
                    onChange={(e) => updateSettings({ showFps: e.target.checked })}
                    className="w-5 h-5 text-overwatch-orange rounded focus:ring-overwatch-orange focus:ring-2"
                  />
                  <span className="text-white font-overwatch">FPS 표시</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showStats}
                    onChange={(e) => updateSettings({ showStats: e.target.checked })}
                    className="w-5 h-5 text-overwatch-orange rounded focus:ring-overwatch-orange focus:ring-2"
                  />
                  <span className="text-white font-overwatch">실시간 통계 표시</span>
                </label>
              </div>

              {/* Tips */}
              <div className="bg-overwatch-dark bg-opacity-60 rounded-lg p-4">
                <h5 className="text-overwatch-orange font-bold mb-2">💡 팁</h5>
                <ul className="text-overwatch-light-gray text-sm space-y-1">
                  <li>• 마우스 감도는 오버워치 인게임 설정과 맞춰보세요</li>
                  <li>• 각 히어로마다 다른 크로스헤어를 사용해보세요</li>
                  <li>• 연습 전 워밍업으로 쉬운 난이도부터 시작하세요</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;