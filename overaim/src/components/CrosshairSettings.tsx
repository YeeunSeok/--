import React from 'react';
import { useGameStore } from '../store/gameStore';
import type { CrosshairSettings as CrosshairType } from '../types/index.js';

const CrosshairSettings: React.FC = () => {
  const { settings, updateSettings } = useGameStore();

  const updateCrosshair = (updates: Partial<CrosshairType>) => {
    const newCrosshair = { ...settings.crosshair, ...updates };
    updateSettings({ crosshair: newCrosshair });
  };

  const CrosshairPreview: React.FC = () => {
    const { crosshair } = settings;
    
    return (
      <div className="w-32 h-32 bg-gray-800 rounded-lg flex items-center justify-center relative">
        <svg width="80" height="80" className="absolute">
          {crosshair.type === 'cross' && (
            <g
              stroke={crosshair.color}
              strokeWidth={crosshair.thickness}
              opacity={crosshair.opacity}
            >
              {/* Horizontal lines */}
              <line
                x1={40 - crosshair.size - crosshair.gap}
                y1={40}
                x2={40 - crosshair.gap}
                y2={40}
              />
              <line
                x1={40 + crosshair.gap}
                y1={40}
                x2={40 + crosshair.size + crosshair.gap}
                y2={40}
              />
              {/* Vertical lines */}
              <line
                x1={40}
                y1={40 - crosshair.size - crosshair.gap}
                x2={40}
                y2={40 - crosshair.gap}
              />
              <line
                x1={40}
                y1={40 + crosshair.gap}
                x2={40}
                y2={40 + crosshair.size + crosshair.gap}
              />
            </g>
          )}
          
          {crosshair.type === 'dot' && (
            <circle
              cx={40}
              cy={40}
              r={crosshair.size}
              fill={crosshair.color}
              opacity={crosshair.opacity}
            />
          )}
          
          {crosshair.type === 'circle' && (
            <circle
              cx={40}
              cy={40}
              r={crosshair.size + crosshair.gap}
              fill="none"
              stroke={crosshair.color}
              strokeWidth={crosshair.thickness}
              opacity={crosshair.opacity}
            />
          )}
          
          {crosshair.type === 'crosshairs' && (
            <g
              stroke={crosshair.color}
              strokeWidth={crosshair.thickness}
              opacity={crosshair.opacity}
            >
              <line x1={10} y1={40} x2={70} y2={40} />
              <line x1={40} y1={10} x2={40} y2={70} />
            </g>
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-overwatch-gray bg-opacity-50 rounded-lg p-6">
      <h3 className="text-xl font-bold text-overwatch-orange font-overwatch mb-4">
        크로스헤어 설정
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Panel */}
        <div className="space-y-4">
          {/* Crosshair Type */}
          <div>
            <label className="block text-overwatch-blue font-bold mb-2">
              크로스헤어 타입
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['cross', 'dot', 'circle', 'crosshairs'].map(type => (
                <button
                  key={type}
                  onClick={() => updateCrosshair({ type: type as any })}
                  className={`
                    p-2 rounded border font-overwatch text-sm
                    ${settings.crosshair.type === type
                      ? 'bg-overwatch-orange border-overwatch-orange text-white'
                      : 'bg-overwatch-dark border-overwatch-gray text-overwatch-light-gray hover:border-overwatch-orange'
                    }
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="block text-overwatch-blue font-bold mb-2">
              크기: {settings.crosshair.size}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={settings.crosshair.size}
              onChange={(e) => updateCrosshair({ size: parseInt(e.target.value) })}
              className="w-full h-2 bg-overwatch-dark rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Thickness */}
          <div>
            <label className="block text-overwatch-blue font-bold mb-2">
              두께: {settings.crosshair.thickness}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={settings.crosshair.thickness}
              onChange={(e) => updateCrosshair({ thickness: parseInt(e.target.value) })}
              className="w-full h-2 bg-overwatch-dark rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Gap */}
          <div>
            <label className="block text-overwatch-blue font-bold mb-2">
              간격: {settings.crosshair.gap}
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={settings.crosshair.gap}
              onChange={(e) => updateCrosshair({ gap: parseInt(e.target.value) })}
              className="w-full h-2 bg-overwatch-dark rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-overwatch-blue font-bold mb-2">
              색상
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['#00ff00', '#ff0000', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#f99e1a'].map(color => (
                <button
                  key={color}
                  onClick={() => updateCrosshair({ color })}
                  className={`
                    w-12 h-8 rounded border-2 transition-all
                    ${settings.crosshair.color === color
                      ? 'border-white scale-110'
                      : 'border-overwatch-gray hover:border-overwatch-orange'
                    }
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Opacity */}
          <div>
            <label className="block text-overwatch-blue font-bold mb-2">
              투명도: {Math.round(settings.crosshair.opacity * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={settings.crosshair.opacity}
              onChange={(e) => updateCrosshair({ opacity: parseFloat(e.target.value) })}
              className="w-full h-2 bg-overwatch-dark rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex flex-col items-center">
          <h4 className="text-lg font-bold text-white font-overwatch mb-4">
            미리보기
          </h4>
          <CrosshairPreview />
          <p className="text-overwatch-light-gray text-sm mt-4 text-center">
            선택한 히어로의 기본 크로스헤어를 기반으로 커스터마이징하세요
          </p>
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => updateSettings({ crosshair: settings.hero.crosshair })}
          className="
            bg-overwatch-blue hover:bg-blue-600 
            text-white font-bold py-2 px-6 rounded-lg
            font-overwatch transition-colors
            border-2 border-overwatch-blue hover:border-blue-600
          "
        >
          기본값으로 재설정
        </button>
      </div>
    </div>
  );
};

export default CrosshairSettings;