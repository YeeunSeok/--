import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HeroSelector from './components/HeroSelector';
import ModeSelector from './components/ModeSelector';
import GameCanvas from './components/GameCanvas';
import GameControls from './components/GameControls';
import Settings from './components/Settings';
import Statistics from './components/Statistics';
import SessionResults from './components/SessionResults';

function App() {
  const { isPlaying, loadStats, timeRemaining } = useGameStore();
  const [activeTab, setActiveTab] = useState('training');
  const [showResults, setShowResults] = useState(false);
  const [gameJustEnded, setGameJustEnded] = useState(false);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Watch for game end
  useEffect(() => {
    if (!isPlaying && gameJustEnded) {
      setShowResults(true);
      setGameJustEnded(false);
    }
  }, [isPlaying, gameJustEnded]);

  // Watch for time reaching zero
  useEffect(() => {
    const prevTimeRemaining = useGameStore.getState().timeRemaining;
    if (prevTimeRemaining > 0 && timeRemaining === 0 && isPlaying) {
      setGameJustEnded(true);
    }
  }, [timeRemaining, isPlaying]);

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      <Header />
      
      {/* Navigation - 토스 스타일 탭 */}
      {!isPlaying && (
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
      
      {/* Main Content */}
      <main className="pb-20">
        {isPlaying ? (
          <div className="p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">
              <div className="bg-gray-900 rounded-3xl p-6 mb-6 shadow-2xl">
                <GameCanvas width={1200} height={700} />
              </div>
              <GameControls />
            </div>
          </div>
        ) : (
          <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 space-y-6">
            {activeTab === 'heroes' && <HeroSelector />}
            {activeTab === 'training' && (
              <div className="space-y-6">
                <ModeSelector />
                <GameControls />
              </div>
            )}
            {activeTab === 'settings' && <Settings />}
            {activeTab === 'statistics' && <Statistics />}
          </div>
        )}
      </main>

      <SessionResults 
        isVisible={showResults} 
        onClose={() => setShowResults(false)} 
      />
    </div>
  );
}

export default App;
