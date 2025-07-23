import React from 'react';
import { useGameStore } from '../store/gameStore';

const GameControls: React.FC = () => {
  const { 
    isPlaying, 
    isPaused, 
    currentMode, 
    startGame, 
    pauseGame, 
    stopGame 
  } = useGameStore();

  if (!currentMode) {
    return (
      <div className="text-center">
        <div className="bg-gray-900 rounded-3xl p-6 inline-block">
          <p className="text-gray-400 text-base">
            🎯 훈련 모드를 먼저 선택해주세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center gap-3">
      {!isPlaying ? (
        <button
          onClick={startGame}
          className="
            bg-orange-500 hover:bg-orange-600 active:bg-orange-700
            text-white font-bold py-4 px-8 rounded-3xl
            text-lg transition-all duration-200
            hover:scale-[1.02] active:scale-[0.98] 
            shadow-lg hover:shadow-xl
            border-2 border-orange-500 hover:border-orange-600
          "
        >
          <span className="mr-2">🎯</span>
          훈련 시작
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={pauseGame}
            className={`
              font-bold py-3 px-6 rounded-2xl text-base transition-all duration-200
              hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl
              ${isPaused 
                ? 'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white' 
                : 'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white'
              }
            `}
          >
            {isPaused ? (
              <>
                <span className="mr-2">▶️</span>
                계속
              </>
            ) : (
              <>
                <span className="mr-2">⏸️</span>
                일시정지
              </>
            )}
          </button>
          
          <button
            onClick={stopGame}
            className="
              bg-red-500 hover:bg-red-600 active:bg-red-700
              text-white font-bold py-3 px-6 rounded-2xl
              text-base transition-all duration-200
              hover:scale-[1.02] active:scale-[0.98]
              shadow-lg hover:shadow-xl
            "
          >
            <span className="mr-2">🛑</span>
            정지
          </button>
        </div>
      )}
    </div>
  );
};

export default GameControls;