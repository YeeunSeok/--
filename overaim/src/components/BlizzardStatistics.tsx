import React from 'react';

interface BlizzardStatisticsProps {
  onNavigate: (state: 'menu') => void;
}

const BlizzardStatistics: React.FC<BlizzardStatisticsProps> = ({ onNavigate }) => {
  const mockStats = {
    totalSessions: 156,
    totalShots: 12340,
    accuracy: 89.5,
    bestStreak: 47,
    hoursPlayed: 23.5,
    averageReactionTime: 245
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="ow-heading text-4xl text-white mb-2">STATISTICS</h1>
            <p className="text-gray-400 text-lg">Track your performance</p>
          </div>
          <button onClick={() => onNavigate('menu')} className="ow-btn ow-btn-ghost">
            ← BACK
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="ow-glass-card p-6 text-center">
            <div className="ow-stat-value text-3xl text-orange-500">{mockStats.totalSessions}</div>
            <div className="ow-stat-label">SESSIONS</div>
          </div>
          <div className="ow-glass-card p-6 text-center">
            <div className="ow-stat-value text-3xl text-blue-400">{mockStats.totalShots.toLocaleString()}</div>
            <div className="ow-stat-label">SHOTS</div>
          </div>
          <div className="ow-glass-card p-6 text-center">
            <div className="ow-stat-value text-3xl text-green-400">{mockStats.accuracy}%</div>
            <div className="ow-stat-label">ACCURACY</div>
          </div>
          <div className="ow-glass-card p-6 text-center">
            <div className="ow-stat-value text-3xl text-purple-400">{mockStats.bestStreak}</div>
            <div className="ow-stat-label">BEST STREAK</div>
          </div>
          <div className="ow-glass-card p-6 text-center">
            <div className="ow-stat-value text-3xl text-yellow-400">{mockStats.hoursPlayed}h</div>
            <div className="ow-stat-label">PLAYED</div>
          </div>
          <div className="ow-glass-card p-6 text-center">
            <div className="ow-stat-value text-3xl text-red-400">{mockStats.averageReactionTime}ms</div>
            <div className="ow-stat-label">REACTION</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlizzardStatistics;