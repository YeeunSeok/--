import React from 'react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'heroes', name: '히어로', icon: '🦸' },
    { id: 'training', name: '훈련', icon: '🎯' },
    { id: 'statistics', name: '통계', icon: '📊' },
    { id: 'settings', name: '설정', icon: '⚙️' },
  ];

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-lg mx-auto px-4">
        {/* 토스 스타일 세그먼트 컨트롤 */}
        <div className="bg-gray-900 rounded-2xl p-1 my-4">
          <div className="grid grid-cols-4 gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative flex flex-col items-center justify-center py-3 px-2 rounded-xl
                  transition-all duration-200 font-medium text-xs
                  ${activeTab === tab.id
                    ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                  }
                `}
              >
                <span className="text-base mb-1">{tab.icon}</span>
                <span className="leading-none">{tab.name}</span>
                
                {/* 토스 스타일 선택 인디케이터 */}
                {activeTab === tab.id && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-300 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;