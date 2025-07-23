import React from 'react';
import { useGameStore } from '../store/gameStore';
import { trainingModes } from '../data/trainingModes';

const ModeSelector: React.FC = () => {
  const { currentMode, setMode, isPlaying } = useGameStore();


  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500 bg-opacity-20 border-green-500';
      case 'medium': return 'bg-yellow-500 bg-opacity-20 border-yellow-500';
      case 'hard': return 'bg-red-500 bg-opacity-20 border-red-500';
      default: return 'bg-gray-500 bg-opacity-20 border-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'precision': return '🎯';
      case 'flick': return '⚡';
      case 'tracking': return '🔄';
      case 'projectile': return '🚀';
      case 'beam': return '💥';
      default: return '🎮';
    }
  };

  const groupedModes = trainingModes.reduce((acc, mode) => {
    if (!acc[mode.type]) {
      acc[mode.type] = [];
    }
    acc[mode.type].push(mode);
    return acc;
  }, {} as Record<string, typeof trainingModes>);

  if (isPlaying) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 토스 스타일 타이틀 카드 */}
      <div className="bg-gray-900 rounded-3xl p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          훈련 모드 선택
        </h2>
        <p className="text-gray-400 text-sm">
          오버워치 히어로에 맞는 에임 훈련을 시작하세요
        </p>
      </div>

      {/* 토스 스타일 모드 카드들 */}
      <div className="space-y-4">
        {Object.entries(groupedModes).map(([type, modes]) => (
          <div key={type} className="bg-gray-900 rounded-3xl p-6">
            {/* 카테고리 헤더 */}
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center mr-3">
                <span className="text-white text-lg">{getTypeIcon(type)}</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {type === 'precision' && '정밀 사격'}
                {type === 'flick' && '플릭샷'}
                {type === 'tracking' && '트래킹'}
                {type === 'projectile' && '투사체'}
                {type === 'beam' && '빔 무기'}
              </h3>
            </div>
            
            {/* 모드 리스트 */}
            <div className="space-y-3">
              {modes.map(mode => (
                <div
                  key={mode.id}
                  className={`
                    bg-black/30 rounded-2xl p-4 cursor-pointer transition-all duration-300
                    hover:bg-black/50 active:scale-[0.98] border-2
                    ${currentMode?.id === mode.id 
                      ? 'border-orange-500 ring-2 ring-orange-500/20' 
                      : 'border-gray-800 hover:border-gray-700'
                    }
                  `}
                  onClick={() => setMode(mode)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-white text-base">
                        {mode.name}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {mode.description}
                      </p>
                    </div>
                    
                    {/* 난이도 뱃지 */}
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyBg(mode.difficulty)}`}>
                      {mode.difficulty.toUpperCase()}
                    </div>
                  </div>
                  
                  {/* 토스 스타일 스탯 */}
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div className="bg-black/50 rounded-xl p-2 text-center">
                      <div className="text-orange-500 font-bold">{mode.duration}</div>
                      <div className="text-gray-400">초</div>
                    </div>
                    <div className="bg-black/50 rounded-xl p-2 text-center">
                      <div className="text-white font-bold">{mode.targetCount}</div>
                      <div className="text-gray-400">타겟</div>
                    </div>
                    <div className="bg-black/50 rounded-xl p-2 text-center">
                      <div className="text-white font-bold">{mode.targetSize}</div>
                      <div className="text-gray-400">크기</div>
                    </div>
                    <div className="bg-black/50 rounded-xl p-2 text-center">
                      <div className="text-white font-bold">{mode.targetSpeed || '정적'}</div>
                      <div className="text-gray-400">속도</div>
                    </div>
                  </div>

                  {/* 선택 상태 표시 */}
                  {currentMode?.id === mode.id && (
                    <div className="flex items-center justify-center mt-3">
                      <div className="flex items-center gap-2 px-4 py-2 bg-orange-500 rounded-full">
                        <span className="text-white text-sm">✓</span>
                        <span className="text-white text-sm font-medium">선택됨</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModeSelector;