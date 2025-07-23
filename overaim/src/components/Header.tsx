import React from 'react';
import { useGameStore } from '../store/gameStore';

const Header: React.FC = () => {
  const { score, timeRemaining, isPlaying } = useGameStore();

  return (
    <header className="bg-black/95 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* 토스 스타일 로고 */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">🎯</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              OverAim
            </h1>
          </div>
          
          {/* 게임 중 상태 - 토스 스타일 숫자 표시 */}
          {isPlaying && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-500 leading-none">
                  {score.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">점수</div>
              </div>
              <div className="w-px h-8 bg-gray-700"></div>
              <div className="text-right">
                <div className="text-xl font-bold text-white leading-none">
                  {Math.max(0, timeRemaining)}
                </div>
                <div className="text-xs text-gray-400">초</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;