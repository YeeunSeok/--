import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import type { TrainingSession } from '../types/index.js';

interface SessionResultsProps {
  isVisible: boolean;
  onClose: () => void;
}

const SessionResults: React.FC<SessionResultsProps> = ({ isVisible, onClose }) => {
  const { shots, score, currentMode, settings } = useGameStore();

  if (!isVisible || !currentMode || shots.length === 0) {
    return null;
  }

  const hits = shots.filter(shot => shot.hit);
  const headshots = shots.filter(shot => shot.headShot);
  const accuracy = (hits.length / shots.length) * 100;
  const headshotRate = hits.length > 0 ? (headshots.length / hits.length) * 100 : 0;
  const avgReactionTime = hits.length > 0 
    ? hits.reduce((sum, shot) => sum + shot.reactionTime, 0) / hits.length 
    : 0;

  useEffect(() => {
    if (isVisible && currentMode && shots.length > 0) {
      const session: TrainingSession = {
        id: `session-${Date.now()}`,
        mode: currentMode,
        hero: settings.hero,
        startTime: Date.now() - (currentMode.duration * 1000),
        endTime: Date.now(),
        shots,
        accuracy,
        avgReactionTime,
        headShotRate: headshotRate,
        score,
      };

      useGameStore.getState().saveSession(session);
    }
  }, [isVisible]);

  const getAccuracyColor = (acc: number) => {
    if (acc >= 80) return 'text-green-400';
    if (acc >= 60) return 'text-yellow-400';
    if (acc >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getGrade = (acc: number) => {
    if (acc >= 90) return { grade: 'S+', color: 'text-purple-400' };
    if (acc >= 80) return { grade: 'S', color: 'text-green-400' };
    if (acc >= 70) return { grade: 'A', color: 'text-blue-400' };
    if (acc >= 60) return { grade: 'B', color: 'text-yellow-400' };
    if (acc >= 50) return { grade: 'C', color: 'text-orange-400' };
    return { grade: 'D', color: 'text-red-400' };
  };

  const gradeInfo = getGrade(accuracy);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-overwatch-dark rounded-lg p-8 max-w-2xl w-full mx-4 border-2 border-overwatch-orange">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-overwatch-orange font-overwatch mb-2">
            훈련 완료!
          </h2>
          <p className="text-overwatch-light-gray">
            {currentMode.name} - {settings.hero.name}
          </p>
        </div>

        {/* Grade Display */}
        <div className="text-center mb-8">
          <div className={`text-6xl font-bold font-overwatch mb-2 ${gradeInfo.color}`}>
            {gradeInfo.grade}
          </div>
          <div className="text-xl text-overwatch-light-gray">
            종합 등급
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-overwatch-gray bg-opacity-30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-overwatch-orange font-overwatch">
              {score.toLocaleString()}
            </div>
            <div className="text-overwatch-light-gray text-sm">점수</div>
          </div>
          
          <div className="bg-overwatch-gray bg-opacity-30 rounded-lg p-4 text-center">
            <div className={`text-2xl font-bold font-overwatch ${getAccuracyColor(accuracy)}`}>
              {accuracy.toFixed(1)}%
            </div>
            <div className="text-overwatch-light-gray text-sm">정확도</div>
          </div>
          
          <div className="bg-overwatch-gray bg-opacity-30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-overwatch-blue font-overwatch">
              {avgReactionTime.toFixed(0)}ms
            </div>
            <div className="text-overwatch-light-gray text-sm">평균 반응시간</div>
          </div>
          
          <div className="bg-overwatch-gray bg-opacity-30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 font-overwatch">
              {headshotRate.toFixed(1)}%
            </div>
            <div className="text-overwatch-light-gray text-sm">헤드샷률</div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="bg-overwatch-gray bg-opacity-20 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold text-white font-overwatch mb-3">상세 통계</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-overwatch-light-gray">총 사격 수:</span>
              <span className="text-white font-bold">{shots.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-overwatch-light-gray">명중 수:</span>
              <span className="text-green-400 font-bold">{hits.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-overwatch-light-gray">빗나간 수:</span>
              <span className="text-red-400 font-bold">{shots.length - hits.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-overwatch-light-gray">헤드샷 수:</span>
              <span className="text-yellow-400 font-bold">{headshots.length}</span>
            </div>
          </div>
        </div>

        {/* Performance Message */}
        <div className="text-center mb-6">
          <div className="bg-overwatch-blue bg-opacity-20 rounded-lg p-4">
            <h4 className="text-overwatch-blue font-bold mb-2">성과 분석</h4>
            <p className="text-overwatch-light-gray text-sm">
              {accuracy >= 80 && '훌륭한 정확도입니다! 이 실력을 유지하세요.'}
              {accuracy >= 60 && accuracy < 80 && '좋은 결과입니다. 조금 더 연습하면 더 나아질 거예요.'}
              {accuracy >= 40 && accuracy < 60 && '괜찮은 시작입니다. 꾸준한 연습이 필요해요.'}
              {accuracy < 40 && '연습이 더 필요합니다. 포기하지 말고 계속 도전하세요!'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              onClose();
              useGameStore.getState().startGame();
            }}
            className="
              bg-overwatch-orange hover:bg-orange-600 
              text-white font-bold py-3 px-6 rounded-lg
              font-overwatch transition-colors
              border-2 border-overwatch-orange hover:border-orange-600
            "
          >
            🔄 다시 훈련
          </button>
          
          <button
            onClick={onClose}
            className="
              bg-overwatch-gray hover:bg-gray-600 
              text-white font-bold py-3 px-6 rounded-lg
              font-overwatch transition-colors
              border-2 border-overwatch-gray hover:border-gray-600
            "
          >
            📊 메인으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionResults;