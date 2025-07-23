import { create } from 'zustand';
import type { GameState, GameSettings, TrainingSession, UserStats, TrainingMode } from '../types/index.js';
import { heroes } from '../data/heroes';

interface GameStore extends GameState {
  settings: GameSettings;
  stats: UserStats;
  accuracy: number;
  
  // Actions
  setMode: (mode: TrainingMode) => void;
  startGame: () => void;
  pauseGame: () => void;
  stopGame: () => void;
  addTarget: (target: any) => void;
  removeTarget: (targetId: string) => void;
  recordShot: (shot: any) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  saveSession: (session: TrainingSession) => void;
  loadStats: () => void;
  resetStats: () => void;
  addScore: (points: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
}

const defaultSettings: GameSettings = {
  hero: heroes[0],
  sensitivity: 1.0,
  crosshair: heroes[0].crosshair,
  volume: 0.5,
  showFps: true,
  showStats: true,
};

const defaultStats: UserStats = {
  totalSessions: 0,
  totalShots: 0,
  totalHits: 0,
  overallAccuracy: 0,
  avgReactionTime: 0,
  bestScore: 0,
  favoriteHero: 'soldier76',
  playtime: 0,
  sessionHistory: [],
};

export const useGameStore = create<GameStore>((set) => ({
  // Initial state
  isPlaying: false,
  isPaused: false,
  currentMode: null,
  targets: [],
  score: 0,
  shots: [],
  timeRemaining: 0,
  streak: 0,
  accuracy: 0,
  settings: defaultSettings,
  stats: defaultStats,

  // Actions
  setMode: (mode) => set({ currentMode: mode, timeRemaining: mode.duration }),
  
  startGame: () => set({ 
    isPlaying: true, 
    isPaused: false, 
    score: 0, 
    shots: [], 
    targets: [], 
    streak: 0 
  }),
  
  pauseGame: () => set((state) => ({ isPaused: !state.isPaused })),
  
  stopGame: () => set({ 
    isPlaying: false, 
    isPaused: false, 
    targets: [], 
    timeRemaining: 0 
  }),
  
  addTarget: (target) => set((state) => ({ 
    targets: [...state.targets, target] 
  })),
  
  removeTarget: (targetId) => set((state) => ({
    targets: state.targets.filter(t => t.id !== targetId)
  })),
  
  recordShot: (shot) => set((state) => {
    const newShots = [...state.shots, shot];
    let newScore = state.score;
    let newStreak = state.streak;
    
    if (shot.hit) {
      newScore += shot.headShot ? 100 : 50;
      newStreak += 1;
    } else {
      newStreak = 0;
    }
    
    return { 
      shots: newShots, 
      score: newScore, 
      streak: newStreak 
    };
  }),
  
  updateSettings: (newSettings) => set((state) => {
    const updatedSettings = { ...state.settings, ...newSettings };
    localStorage.setItem('overaim-settings', JSON.stringify(updatedSettings));
    return { settings: updatedSettings };
  }),
  
  saveSession: (session) => set((state) => {
    const newStats: UserStats = {
      ...state.stats,
      totalSessions: state.stats.totalSessions + 1,
      totalShots: state.stats.totalShots + session.shots.length,
      totalHits: state.stats.totalHits + session.shots.filter(s => s.hit).length,
      overallAccuracy: ((state.stats.totalHits + session.shots.filter(s => s.hit).length) / 
                       (state.stats.totalShots + session.shots.length)) * 100,
      avgReactionTime: (state.stats.avgReactionTime + session.avgReactionTime) / 2,
      bestScore: Math.max(state.stats.bestScore, session.score),
      playtime: state.stats.playtime + (session.endTime - session.startTime),
      sessionHistory: [...state.stats.sessionHistory, session].slice(-50), // Keep last 50 sessions
    };
    
    localStorage.setItem('overaim-stats', JSON.stringify(newStats));
    return { stats: newStats };
  }),
  
  loadStats: () => {
    try {
      const savedSettings = localStorage.getItem('overaim-settings');
      const savedStats = localStorage.getItem('overaim-stats');
      
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          set({ settings: { ...defaultSettings, ...settings } });
        } catch (error) {
          console.warn('Failed to parse saved settings:', error);
          localStorage.removeItem('overaim-settings');
        }
      }
      
      if (savedStats) {
        try {
          const stats = JSON.parse(savedStats);
          set({ stats: { ...defaultStats, ...stats } });
        } catch (error) {
          console.warn('Failed to parse saved stats:', error);
          localStorage.removeItem('overaim-stats');
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  },
  
  resetStats: () => {
    localStorage.removeItem('overaim-stats');
    set({ stats: defaultStats });
  },

  addScore: (points) => set((state) => ({ 
    score: state.score + points 
  })),

  incrementStreak: () => set((state) => ({ 
    streak: state.streak + 1 
  })),

  resetStreak: () => set({ streak: 0 }),
}));