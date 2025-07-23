import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { heroes } from '../data/heroes';

interface BlizzardHeroSelectProps {
  onNavigate: (state: 'menu' | 'modeSelect') => void;
}

const BlizzardHeroSelect: React.FC<BlizzardHeroSelectProps> = ({ onNavigate }) => {
  const { settings, updateSettings } = useGameStore();
  const [selectedHero, setSelectedHero] = useState(settings.hero);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredHero, setHoveredHero] = useState<string | null>(null);

  // Filter heroes based on role and search
  const filteredHeroes = heroes.filter(hero => {
    const matchesRole = filterRole === 'all' || hero.role === filterRole;
    const matchesSearch = hero.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const roleFilters = [
    { id: 'all', name: 'ALL HEROES', icon: '🎮', count: heroes.length },
    { id: 'damage', name: 'DAMAGE', icon: '⚔️', count: heroes.filter(h => h.role === 'damage').length },
    { id: 'tank', name: 'TANK', icon: '🛡️', count: heroes.filter(h => h.role === 'tank').length },
    { id: 'support', name: 'SUPPORT', icon: '💊', count: heroes.filter(h => h.role === 'support').length }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'damage': return 'from-red-600 to-orange-600';
      case 'tank': return 'from-blue-600 to-cyan-600';
      case 'support': return 'from-green-600 to-emerald-600';
      default: return 'from-gray-600 to-gray-800';
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

  const handleHeroSelect = (hero: typeof heroes[0]) => {
    setSelectedHero(hero);
    updateSettings({ hero, crosshair: hero.crosshair });
    
    // Play selection sound effect (mock)
    console.log(`Selected ${hero.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="ow-heading text-4xl md:text-5xl text-white mb-2">
              HERO SELECT
            </h1>
            <p className="text-gray-400 text-lg">Choose your training configuration</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('menu')}
              className="ow-btn ow-btn-ghost"
            >
              ← BACK
            </button>
            <button
              onClick={() => onNavigate('modeSelect')}
              className="ow-btn ow-btn-primary"
              disabled={!selectedHero}
            >
              CONTINUE →
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search heroes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
              />
              <div className="absolute right-3 top-3 text-gray-400">
                🔍
              </div>
            </div>

            {/* Role Filters */}
            <div className="flex space-x-2">
              {roleFilters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setFilterRole(filter.id)}
                  className={`
                    px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center space-x-2
                    ${filterRole === filter.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }
                  `}
                >
                  <span>{filter.icon}</span>
                  <span>{filter.name}</span>
                  <span className="bg-black/30 px-2 py-1 rounded text-xs">{filter.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Heroes Grid */}
        <div className="ow-hover-container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 mb-8">
          {filteredHeroes.map((hero, index) => (
            <div
              key={hero.id}
              className={`
                relative group cursor-pointer transform transition-all duration-300
                ${selectedHero.id === hero.id 
                  ? 'scale-[1.02] z-20' 
                  : 'hover:scale-[1.02] hover:z-10'
                }
              `}
              style={{
                animationDelay: `${index * 0.05}s`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
              onMouseEnter={() => setHoveredHero(hero.id)}
              onMouseLeave={() => setHoveredHero(null)}
              onClick={() => handleHeroSelect(hero)}
            >
              <div className={`
                ow-glass-card h-full p-4 relative overflow-hidden
                ${selectedHero.id === hero.id 
                  ? 'border-2 border-orange-500 shadow-2xl' 
                  : 'border border-gray-700 hover:border-gray-500'
                }
              `}>
                {/* Hero Portrait Background */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${getRoleColor(hero.role)} opacity-20
                  group-hover:opacity-30 transition-opacity duration-300
                `}></div>

                {/* Hero Content */}
                <div className="relative z-10">
                  {/* Hero Icon/Avatar */}
                  <div className="mb-3 text-center">
                    <div className={`
                      w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${getRoleColor(hero.role)} 
                      flex items-center justify-center text-2xl border-2 border-white/20
                      group-hover:scale-105 transition-transform duration-300
                    `}>
                      {getWeaponTypeIcon(hero.weaponType)}
                    </div>
                  </div>

                  {/* Hero Name */}
                  <h3 className="font-bold text-white text-center mb-2 text-lg">
                    {hero.name}
                  </h3>

                  {/* Role Badge */}
                  <div className={`
                    text-xs text-center py-1 px-2 rounded-full mb-3 font-semibold
                    bg-gradient-to-r ${getRoleColor(hero.role)} text-white
                  `}>
                    {hero.role.toUpperCase()}
                  </div>

                  {/* Hero Stats Mini */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center">
                      <div className="text-orange-400 font-bold">{hero.damage}</div>
                      <div className="text-gray-400">DMG</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">{hero.fireRate}</div>
                      <div className="text-gray-400">RATE</div>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedHero.id === hero.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">
                      ✓
                    </div>
                  )}

                  {/* Hover Glow */}
                  {hoveredHero === hero.id && (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent rounded-lg pointer-events-none"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Selected Hero Details */}
        {selectedHero && (
          <div className="ow-glass-card p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Hero Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center mb-6">
                  <div className={`
                    w-20 h-20 rounded-full bg-gradient-to-br ${getRoleColor(selectedHero.role)} 
                    flex items-center justify-center text-4xl border-2 border-white/20 mr-6
                  `}>
                    {getWeaponTypeIcon(selectedHero.weaponType)}
                  </div>
                  <div>
                    <h2 className="ow-heading text-3xl text-white mb-2">
                      {selectedHero.name}
                    </h2>
                    <p className="text-orange-400 text-lg font-semibold">
                      {selectedHero.role.charAt(0).toUpperCase() + selectedHero.role.slice(1)} Hero
                    </p>
                    <p className="text-gray-400 capitalize">
                      {selectedHero.weaponType} Weapon System
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="ow-stat bg-black/30 p-4 rounded-lg">
                    <div className="ow-stat-value text-orange-500">{selectedHero.damage}</div>
                    <div className="ow-stat-label">DAMAGE</div>
                  </div>
                  <div className="ow-stat bg-black/30 p-4 rounded-lg">
                    <div className="ow-stat-value text-blue-400">{selectedHero.fireRate}</div>
                    <div className="ow-stat-label">FIRE RATE</div>
                  </div>
                  <div className="ow-stat bg-black/30 p-4 rounded-lg">
                    <div className="ow-stat-value text-green-400">{selectedHero.headShotMultiplier}x</div>
                    <div className="ow-stat-label">HEADSHOT</div>
                  </div>
                  <div className="ow-stat bg-black/30 p-4 rounded-lg">
                    <div className="ow-stat-value text-purple-400">{selectedHero.weaponType}</div>
                    <div className="ow-stat-label">TYPE</div>
                  </div>
                </div>
              </div>

              {/* Crosshair Preview */}
              <div className="text-center">
                <h3 className="text-white font-bold mb-4 text-xl">CROSSHAIR PREVIEW</h3>
                <div className="bg-black/50 rounded-lg p-8 relative h-48 flex items-center justify-center border border-gray-600">
                  <svg width="120" height="120" viewBox="0 0 120 120" className="absolute">
                    {selectedHero.crosshair.type === 'cross' && (
                      <g stroke={selectedHero.crosshair.color} strokeWidth={selectedHero.crosshair.thickness * 2} fill="none">
                        <line 
                          x1={60 - selectedHero.crosshair.size * 2 - selectedHero.crosshair.gap * 2} 
                          y1="60" 
                          x2={60 - selectedHero.crosshair.gap * 2} 
                          y2="60" 
                        />
                        <line 
                          x1={60 + selectedHero.crosshair.gap * 2} 
                          y1="60" 
                          x2={60 + selectedHero.crosshair.size * 2 + selectedHero.crosshair.gap * 2} 
                          y2="60" 
                        />
                        <line 
                          x1="60" 
                          y1={60 - selectedHero.crosshair.size * 2 - selectedHero.crosshair.gap * 2} 
                          x2="60" 
                          y2={60 - selectedHero.crosshair.gap * 2} 
                        />
                        <line 
                          x1="60" 
                          y1={60 + selectedHero.crosshair.gap * 2} 
                          x2="60" 
                          y2={60 + selectedHero.crosshair.size * 2 + selectedHero.crosshair.gap * 2} 
                        />
                      </g>
                    )}
                    {selectedHero.crosshair.type === 'dot' && (
                      <circle 
                        cx="60" 
                        cy="60" 
                        r={selectedHero.crosshair.size * 2} 
                        fill={selectedHero.crosshair.color} 
                      />
                    )}
                    {selectedHero.crosshair.type === 'circle' && (
                      <circle 
                        cx="60" 
                        cy="60" 
                        r={selectedHero.crosshair.size * 2 + selectedHero.crosshair.gap * 2} 
                        stroke={selectedHero.crosshair.color} 
                        strokeWidth={selectedHero.crosshair.thickness * 2} 
                        fill="none" 
                      />
                    )}
                  </svg>
                </div>
                
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white font-semibold">{selectedHero.crosshair.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Size:</span>
                    <span className="text-white font-semibold">{selectedHero.crosshair.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gap:</span>
                    <span className="text-white font-semibold">{selectedHero.crosshair.gap}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default BlizzardHeroSelect;