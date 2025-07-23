export interface Hero {
  id: string;
  name: string;
  role: 'tank' | 'damage' | 'support';
  weaponType: 'hitscan' | 'projectile' | 'beam';
  fireRate: number;
  damage: number;
  headShotMultiplier: number;
  crosshair: CrosshairSettings;
}

export interface CrosshairSettings {
  type: 'dot' | 'cross' | 'circle' | 'crosshairs';
  size: number;
  thickness: number;
  gap: number;
  color: string;
  opacity: number;
  outline: boolean;
  outlineThickness: number;
  outlineOpacity: number;
}

export interface TrainingMode {
  id: string;
  name: string;
  description: string;
  type: 'precision' | 'flick' | 'tracking' | 'projectile' | 'beam';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  targetCount: number;
  targetSize: number;
  targetSpeed: number;
}

export interface GameSettings {
  hero: Hero;
  sensitivity: number;
  crosshair: CrosshairSettings;
  volume: number;
  showFps: boolean;
  showStats: boolean;
}

export interface TrainingSession {
  id: string;
  mode: TrainingMode;
  hero: Hero;
  startTime: number;
  endTime: number;
  shots: Shot[];
  accuracy: number;
  avgReactionTime: number;
  headShotRate: number;
  score: number;
}

export interface Shot {
  timestamp: number;
  hit: boolean;
  headShot: boolean;
  reactionTime: number;
  distance: number;
  targetSize: number;
}

export interface Target {
  id: string;
  x: number;
  y: number;
  size: number;
  createdAt: number;
  isActive: boolean;
  isHeadShot?: boolean;
  velocityX?: number;
  velocityY?: number;
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  currentMode: TrainingMode | null;
  targets: Target[];
  score: number;
  shots: Shot[];
  timeRemaining: number;
  streak: number;
}

export interface UserStats {
  totalSessions: number;
  totalShots: number;
  totalHits: number;
  overallAccuracy: number;
  avgReactionTime: number;
  bestScore: number;
  favoriteHero: string;
  playtime: number;
  sessionHistory: TrainingSession[];
}