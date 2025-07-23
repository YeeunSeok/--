import React from 'react';
import { useGameStore } from '../store/gameStore';

const Statistics: React.FC = () => {
  const { stats, isPlaying } = useGameStore();

  if (isPlaying) {
    return null;
  }

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}시간 ${minutes % 60}분`;
    } else if (minutes > 0) {
      return `${minutes}분 ${seconds % 60}초`;
    } else {
      return `${seconds}초`;
    }
  };

  const StatCard: React.FC<{ title: string; value: string | number; unit?: string; icon: string }> = 
    ({ title, value, unit = '', icon }) => (
      <div className="bg-overwatch-gray bg-opacity-30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl">{icon}</span>
          <span className="text-overwatch-light-gray text-sm">{title}</span>
        </div>
        <div className="text-2xl font-bold text-white font-overwatch">
          {value}{unit}
        </div>
      </div>
    );

  const recentSessions = stats.sessionHistory.slice(-5).reverse();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-overwatch-orange font-overwatch mb-2">
          성과 통계
        </h2>
        <p className="text-overwatch-light-gray">
          지금까지의 훈련 성과를 확인하세요
        </p>
      </div>

      {/* Overall Stats */}
      <div className="bg-overwatch-dark bg-opacity-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white font-overwatch mb-4">
          전체 통계
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="총 세션"
            value={stats.totalSessions}
            unit="회"
            icon="🎯"
          />
          <StatCard
            title="전체 정확도"
            value={stats.overallAccuracy.toFixed(1)}
            unit="%"
            icon="📊"
          />
          <StatCard
            title="최고 점수"
            value={stats.bestScore.toLocaleString()}
            icon="🏆"
          />
          <StatCard
            title="총 플레이 시간"
            value={formatTime(stats.playtime)}
            icon="⏱️"
          />
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-overwatch-gray bg-opacity-30 rounded-lg p-6">
          <h3 className="text-xl font-bold text-overwatch-blue font-overwatch mb-4">
            사격 통계
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-overwatch-light-gray">총 사격 수</span>
              <span className="text-white font-bold">{stats.totalShots.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-overwatch-light-gray">명중 수</span>
              <span className="text-green-400 font-bold">{stats.totalHits.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-overwatch-light-gray">빗나간 수</span>
              <span className="text-red-400 font-bold">
                {(stats.totalShots - stats.totalHits).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-overwatch-light-gray">평균 반응시간</span>
              <span className="text-overwatch-orange font-bold">
                {stats.avgReactionTime.toFixed(0)}ms
              </span>
            </div>
          </div>
        </div>

        <div className="bg-overwatch-gray bg-opacity-30 rounded-lg p-6">
          <h3 className="text-xl font-bold text-overwatch-blue font-overwatch mb-4">
            선호도
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-overwatch-light-gray">선호 히어로</span>
              <span className="text-overwatch-orange font-bold">{stats.favoriteHero}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-overwatch-light-gray">세션당 평균 점수</span>
              <span className="text-white font-bold">
                {stats.totalSessions > 0 
                  ? Math.round(stats.bestScore / stats.totalSessions).toLocaleString()
                  : '0'
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-overwatch-light-gray">세션당 평균 시간</span>
              <span className="text-white font-bold">
                {stats.totalSessions > 0 
                  ? formatTime(stats.playtime / stats.totalSessions)
                  : '0초'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div className="bg-overwatch-dark bg-opacity-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white font-overwatch mb-4">
            최근 세션
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-overwatch-blue border-b border-overwatch-gray">
                  <th className="text-left py-2">모드</th>
                  <th className="text-left py-2">히어로</th>
                  <th className="text-right py-2">점수</th>
                  <th className="text-right py-2">정확도</th>
                  <th className="text-right py-2">반응시간</th>
                  <th className="text-right py-2">날짜</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((session) => (
                  <tr key={session.id} className="border-b border-overwatch-gray border-opacity-30">
                    <td className="py-3 text-white">{session.mode.name}</td>
                    <td className="py-3 text-overwatch-orange">{session.hero.name}</td>
                    <td className="py-3 text-right text-white font-bold">
                      {session.score.toLocaleString()}
                    </td>
                    <td className="py-3 text-right text-green-400 font-bold">
                      {session.accuracy.toFixed(1)}%
                    </td>
                    <td className="py-3 text-right text-overwatch-light-gray">
                      {session.avgReactionTime.toFixed(0)}ms
                    </td>
                    <td className="py-3 text-right text-overwatch-light-gray">
                      {new Date(session.startTime).toLocaleDateString('ko-KR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Data Message */}
      {stats.totalSessions === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-overwatch-light-gray font-overwatch mb-2">
            아직 훈련 기록이 없습니다
          </h3>
          <p className="text-overwatch-light-gray">
            첫 번째 에임 훈련을 시작해보세요!
          </p>
        </div>
      )}

      {/* Export/Reset Controls */}
      {stats.totalSessions > 0 && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              const dataStr = JSON.stringify(stats, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `overaim-stats-${new Date().toISOString().split('T')[0]}.json`;
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="
              bg-overwatch-blue hover:bg-blue-600 
              text-white font-bold py-3 px-6 rounded-lg
              font-overwatch transition-colors
              border-2 border-overwatch-blue hover:border-blue-600
            "
          >
            📊 통계 내보내기
          </button>
          
          <button
            onClick={() => {
              if (confirm('모든 통계를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                useGameStore.getState().resetStats();
              }
            }}
            className="
              bg-red-500 hover:bg-red-600 
              text-white font-bold py-3 px-6 rounded-lg
              font-overwatch transition-colors
              border-2 border-red-500 hover:border-red-600
            "
          >
            🗑️ 통계 초기화
          </button>
        </div>
      )}
    </div>
  );
};

export default Statistics;