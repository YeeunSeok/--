import React from 'react';
import { useGameStore } from '../store/gameStore';
import { heroes } from '../data/heroes';

const HeroSelector: React.FC = () => {
  const { settings, updateSettings, isPlaying } = useGameStore();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'damage': return 'text-red-400 bg-red-500 bg-opacity-20 border-red-500';
      case 'tank': return 'text-blue-400 bg-blue-500 bg-opacity-20 border-blue-500';
      case 'support': return 'text-green-400 bg-green-500 bg-opacity-20 border-green-500';
      default: return 'text-gray-400 bg-gray-500 bg-opacity-20 border-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'damage': return '⚔️';
      case 'tank': return '🛡️';
      case 'support': return '💊';
      default: return '🎮';
    }
  };

  const getWeaponTypeIcon = (weaponType: string) => {
    switch (weaponType) {
      case 'hitscan': return '🎯';
      case 'projectile': return '🚀';
      case 'beam': return '💥';
      default: return '🔫';
    }
  };

  if (isPlaying) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* 토스 스타일 타이틀 카드 */}
      <div className="bg-gray-900 rounded-3xl p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          히어로 선택
        </h2>
        <p className="text-gray-400 text-sm">
          선택한 히어로의 특성에 맞는 조준점과 설정이 적용됩니다
        </p>
      </div>

      {/* 히어로 그리드 */}
      <div className="space-y-4">
        {heroes.map(hero => (
          <div
            key={hero.id}
            className={`
              bg-gray-900 rounded-3xl p-6 cursor-pointer transition-all duration-300
              hover:bg-gray-800 active:scale-[0.98] border-2
              ${settings.hero.id === hero.id 
                ? 'border-orange-500 ring-2 ring-orange-500/20' 
                : 'border-gray-800 hover:border-gray-700'
              }
            `}
            onClick={() => updateSettings({ 
              hero, 
              crosshair: hero.crosshair 
            })}
          >
            {/* 토스 스타일 히어로 헤더 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{getWeaponTypeIcon(hero.weaponType)}</div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    {hero.name}
                  </h3>
                  <p className="text-gray-400 text-sm capitalize">
                    {hero.weaponType}
                  </p>
                </div>
              </div>
              
              {/* 역할 뱃지 */}
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(hero.role)}`}>
                <span className="mr-1">{getRoleIcon(hero.role)}</span>
                {hero.role.toUpperCase()}
              </div>
            </div>

            {/* 토스 스타일 스탯 카드들 */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-black/50 rounded-2xl p-3 text-center">
                <div className="text-xl font-bold text-orange-500">
                  {hero.damage}
                </div>
                <div className="text-xs text-gray-400">공격력</div>
              </div>
              <div className="bg-black/50 rounded-2xl p-3 text-center">
                <div className="text-xl font-bold text-white">
                  {hero.fireRate}
                </div>
                <div className="text-xs text-gray-400">연사속도</div>
              </div>
              <div className="bg-black/50 rounded-2xl p-3 text-center">
                <div className="text-xl font-bold text-green-400">
                  {hero.headShotMultiplier}x
                </div>
                <div className="text-xs text-gray-400">헤드샷</div>
              </div>
            </div>

            {/* 선택 상태 표시 */}
            {settings.hero.id === hero.id && (
              <div className="flex items-center justify-center py-2">
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
  );
};


export default HeroSelector;