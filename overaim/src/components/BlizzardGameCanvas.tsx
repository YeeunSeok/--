import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

interface BlizzardGameCanvasProps {
  onNavigate: (state: 'menu') => void;
}

interface Target {
  id: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: { x: number; y: number };
  health: number;
  maxHealth: number;
  type: 'normal' | 'critical' | 'bonus';
  createdAt: number;
  isHit: boolean;
}

interface HitEffect {
  id: string;
  x: number;
  y: number;
  damage: number;
  type: 'hit' | 'critical' | 'miss';
  timestamp: number;
}

const BlizzardGameCanvas: React.FC<BlizzardGameCanvasProps> = ({ onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastShotTime = useRef(0);
  
  const { 
    isPlaying, 
    isPaused, 
    currentMode, 
    settings, 
    score, 
    streak, 
    timeRemaining,
    addScore,
    incrementStreak,
    resetStreak,
    stopGame,
    pauseGame
  } = useGameStore();

  const [targets, setTargets] = useState<Target[]>([]);
  const [hitEffects, setHitEffects] = useState<HitEffect[]>([]);
  const [shotsFired, setShotsFired] = useState(0);
  const [shotsHit, setShotsHit] = useState(0);
  const [combo, setCombo] = useState(0);
  const [reactionTime, setReactionTime] = useState<number[]>([]);

  // Canvas dimensions
  const CANVAS_WIDTH = 1400;
  const CANVAS_HEIGHT = 800;

  // Game parameters based on mode
  const getGameParams = useCallback(() => {
    if (!currentMode) return { targetCount: 1, targetSize: 50, targetSpeed: 0 };
    
    return {
      targetCount: Math.min(currentMode.targetCount || 1, 8),
      targetSize: currentMode.targetSize || 50,
      targetSpeed: currentMode.targetSpeed || 0
    };
  }, [currentMode]);

  // Generate new target
  const generateTarget = useCallback(() => {
    try {
      const params = getGameParams();
      const targetTypes = ['normal', 'normal', 'normal', 'critical', 'bonus'] as const;
      const type = targetTypes[Math.floor(Math.random() * targetTypes.length)];
      
      let size = params.targetSize;
      let health = 1;
      
      if (type === 'critical') {
        size *= 0.7; // Smaller
        health = 1;
      } else if (type === 'bonus') {
        size *= 1.3; // Larger
        health = 2;
      }

      // Ensure minimum size
      size = Math.max(size, 10);

      return {
        id: Math.random().toString(36),
        x: Math.max(size, Math.min(CANVAS_WIDTH - size, size + Math.random() * (CANVAS_WIDTH - size * 2))),
        y: Math.max(size, Math.min(CANVAS_HEIGHT - size, size + Math.random() * (CANVAS_HEIGHT - size * 2))),
        size,
        speed: Math.max(0, params.targetSpeed + Math.random() * 2),
        direction: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2
        },
        health,
        maxHealth: health,
        type,
        createdAt: Date.now(),
        isHit: false
      };
    } catch (error) {
      console.error('Error generating target:', error);
      // Return a safe default target
      return {
        id: Math.random().toString(36),
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        size: 50,
        speed: 0,
        direction: { x: 0, y: 0 },
        health: 1,
        maxHealth: 1,
        type: 'normal' as const,
        createdAt: Date.now(),
        isHit: false
      };
    }
  }, [getGameParams]);

  // Initialize targets
  useEffect(() => {
    if (!isPlaying || !currentMode) {
      setTargets([]);
      return;
    }
    
    try {
      const params = getGameParams();
      const initialTargets = Array.from({ length: params.targetCount }, generateTarget);
      setTargets(initialTargets);
    } catch (error) {
      console.error('Error initializing targets:', error);
      setTargets([]);
    }
  }, [isPlaying, currentMode, generateTarget, getGameParams]);

  // Mouse tracking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) * (CANVAS_WIDTH / rect.width),
        y: (e.clientY - rect.top) * (CANVAS_HEIGHT / rect.height)
      };
    };

    const handleClick = (e: MouseEvent) => {
      if (!isPlaying || isPaused) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const currentTime = Date.now();
      setShotsFired(prev => prev + 1);
      lastShotTime.current = currentTime;

      const rect = canvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left) * (CANVAS_WIDTH / rect.width);
      const clickY = (e.clientY - rect.top) * (CANVAS_HEIGHT / rect.height);

      // Validate click coordinates
      if (clickX < 0 || clickX > CANVAS_WIDTH || clickY < 0 || clickY > CANVAS_HEIGHT) {
        return;
      }

      // Check for hits
      let hit = false;
      setTargets(prevTargets => {
        return prevTargets.map(target => {
          const distance = Math.sqrt(
            Math.pow(clickX - target.x, 2) + Math.pow(clickY - target.y, 2)
          );

          if (distance <= target.size / 2 && !target.isHit) {
            hit = true;
            const damage = target.type === 'critical' ? 200 : target.type === 'bonus' ? 150 : 100;
            const reactionMs = currentTime - target.createdAt;
            
            // Add hit effect
            setHitEffects(prev => [...prev, {
              id: Math.random().toString(36),
              x: clickX,
              y: clickY,
              damage,
              type: target.type === 'critical' ? 'critical' : 'hit',
              timestamp: currentTime
            }]);

            // Update game stats
            addScore(damage + (streak * 10)); // Bonus for streak
            incrementStreak();
            setShotsHit(prev => prev + 1);
            setCombo(prev => prev + 1);
            setReactionTime(prev => [...prev.slice(-9), reactionMs]);

            return { ...target, isHit: true };
          }
          return target;
        });
      });

      if (!hit) {
        resetStreak();
        setCombo(0);
        // Add miss effect
        setHitEffects(prev => [...prev, {
          id: Math.random().toString(36),
          x: clickX,
          y: clickY,
          damage: 0,
          type: 'miss',
          timestamp: currentTime
        }]);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [isPlaying, isPaused, addScore, incrementStreak, resetStreak, streak]);

  // Render function
  const renderGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Background gradient
      const gradient = ctx.createRadialGradient(
        CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0,
        CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH / 2
      );
      gradient.addColorStop(0, '#1a1a1a');
      gradient.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Grid pattern
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      for (let x = 0; x < CANVAS_WIDTH; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Render targets
      targets.forEach(target => {
        if (target.isHit) return;

        const currentTime = Date.now();
        const age = currentTime - target.createdAt;
        const pulseIntensity = Math.sin(age * 0.008) * 0.3 + 0.7;

        // Target glow
        const glowGradient = ctx.createRadialGradient(
          target.x, target.y, 0,
          target.x, target.y, target.size
        );
        
        if (target.type === 'critical') {
          glowGradient.addColorStop(0, `rgba(255, 69, 58, ${0.8 * pulseIntensity})`);
          glowGradient.addColorStop(1, 'rgba(255, 69, 58, 0)');
        } else if (target.type === 'bonus') {
          glowGradient.addColorStop(0, `rgba(50, 215, 75, ${0.8 * pulseIntensity})`);
          glowGradient.addColorStop(1, 'rgba(50, 215, 75, 0)');
        } else {
          glowGradient.addColorStop(0, `rgba(249, 158, 26, ${0.8 * pulseIntensity})`);
          glowGradient.addColorStop(1, 'rgba(249, 158, 26, 0)');
        }

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.size, 0, Math.PI * 2);
        ctx.fill();

        // Target ring
        ctx.strokeStyle = target.type === 'critical' ? '#FF453A' : 
                          target.type === 'bonus' ? '#32D74B' : '#F99E1A';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.size / 2, 0, Math.PI * 2);
        ctx.stroke();

        // Inner circle
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.size / 4, 0, Math.PI * 2);
        ctx.stroke();

        // Center dot
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(target.x, target.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render hit effects
      hitEffects.forEach(effect => {
        const age = Date.now() - effect.timestamp;
        const progress = age / 1000;
        const alpha = Math.max(0, 1 - progress);

        ctx.globalAlpha = alpha;
        ctx.font = 'bold 24px Orbitron';
        ctx.textAlign = 'center';

        if (effect.type === 'critical') {
          ctx.fillStyle = '#FF453A';
          ctx.fillText(`CRITICAL +${effect.damage}`, effect.x, effect.y - age * 0.05);
        } else if (effect.type === 'hit') {
          ctx.fillStyle = '#32D74B';
          ctx.fillText(`+${effect.damage}`, effect.x, effect.y - age * 0.05);
        } else {
          ctx.fillStyle = '#666';
          ctx.fillText('MISS', effect.x, effect.y - age * 0.05);
        }
      });
      ctx.globalAlpha = 1;

      // Render crosshair
      if (settings.hero?.crosshair) {
        const crosshair = settings.hero.crosshair;
        const mouseX = mouseRef.current.x;
        const mouseY = mouseRef.current.y;

        ctx.strokeStyle = crosshair.color;
        ctx.lineWidth = crosshair.thickness;
        ctx.lineCap = 'round';

        if (crosshair.type === 'cross') {
          // Horizontal line
          ctx.beginPath();
          ctx.moveTo(mouseX - crosshair.size - crosshair.gap, mouseY);
          ctx.lineTo(mouseX - crosshair.gap, mouseY);
          ctx.moveTo(mouseX + crosshair.gap, mouseY);
          ctx.lineTo(mouseX + crosshair.size + crosshair.gap, mouseY);
          ctx.stroke();

          // Vertical line
          ctx.beginPath();
          ctx.moveTo(mouseX, mouseY - crosshair.size - crosshair.gap);
          ctx.lineTo(mouseX, mouseY - crosshair.gap);
          ctx.moveTo(mouseX, mouseY + crosshair.gap);
          ctx.lineTo(mouseX, mouseY + crosshair.size + crosshair.gap);
          ctx.stroke();
        } else if (crosshair.type === 'dot') {
          ctx.fillStyle = crosshair.color;
          ctx.beginPath();
          ctx.arc(mouseX, mouseY, crosshair.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (crosshair.type === 'circle') {
          ctx.beginPath();
          ctx.arc(mouseX, mouseY, crosshair.size + crosshair.gap, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    } catch (error) {
      console.error('Render error:', error);
    }
  }, [targets, hitEffects, settings.hero?.crosshair]);

  // Game loop with integrated rendering
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const gameLoop = () => {
      setTargets(prevTargets => {
        const currentTime = Date.now();
        let updatedTargets = prevTargets.map(target => {
          if (target.isHit) return target;

          // Move target if it has speed
          if (target.speed > 0) {
            let newX = target.x + target.direction.x * target.speed;
            let newY = target.y + target.direction.y * target.speed;

            // Bounce off walls
            if (newX <= target.size / 2 || newX >= CANVAS_WIDTH - target.size / 2) {
              target.direction.x *= -1;
              newX = Math.max(target.size / 2, Math.min(CANVAS_WIDTH - target.size / 2, newX));
            }
            if (newY <= target.size / 2 || newY >= CANVAS_HEIGHT - target.size / 2) {
              target.direction.y *= -1;
              newY = Math.max(target.size / 2, Math.min(CANVAS_HEIGHT - target.size / 2, newY));
            }

            return { ...target, x: newX, y: newY };
          }

          return target;
        });

        // Remove old hit targets and generate new ones
        updatedTargets = updatedTargets.filter(target => {
          if (target.isHit && currentTime - target.createdAt > 500) {
            return false;
          }
          return true;
        });

        // Maintain target count
        const params = getGameParams();
        while (updatedTargets.length < params.targetCount) {
          updatedTargets.push(generateTarget());
        }

        return updatedTargets;
      });

      // Clean up old hit effects
      setHitEffects(prev => 
        prev.filter(effect => Date.now() - effect.timestamp < 1000)
      );

      // Render the game
      renderGame();

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isPaused, generateTarget, getGameParams, renderGame]);

  // Initial render when component mounts
  useEffect(() => {
    renderGame();
  }, [renderGame]);

  // Render when game state changes
  useEffect(() => {
    if (!isPlaying || isPaused) {
      renderGame();
    }
  }, [isPlaying, isPaused, renderGame]);

  const currentAccuracy = shotsFired > 0 ? Math.round((shotsHit / shotsFired) * 100) : 0;
  const avgReactionTime = reactionTime.length > 0 ? 
    Math.round(reactionTime.reduce((a, b) => a + b, 0) / reactionTime.length) : 0;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Game HUD */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black p-4 border-b border-orange-500/30">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => pauseGame()}
              className="ow-btn ow-btn-secondary text-sm"
            >
              {isPaused ? '▶️ RESUME' : '⏸️ PAUSE'}
            </button>
            <button
              onClick={() => {
                stopGame();
                onNavigate('menu');
              }}
              className="ow-btn ow-btn-ghost text-sm"
            >
              🏠 MENU
            </button>
          </div>

          <div className="flex items-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{score.toLocaleString()}</div>
              <div className="text-xs text-gray-400">SCORE</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{Math.max(0, timeRemaining)}</div>
              <div className="text-xs text-gray-400">TIME</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{streak}</div>
              <div className="text-xs text-gray-400">STREAK</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{currentAccuracy}%</div>
              <div className="text-xs text-gray-400">ACCURACY</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{avgReactionTime}ms</div>
              <div className="text-xs text-gray-400">REACTION</div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-2 border-orange-500/30 rounded-lg shadow-2xl cursor-none"
            style={{
              maxWidth: '100%',
              height: 'auto',
              background: 'radial-gradient(circle, #1a1a1a 0%, #0a0a0a 100%)'
            }}
          />
          
          {/* Combo display */}
          {combo > 5 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center">
              <div className="text-4xl font-bold text-orange-500 animate-pulse">
                {combo}x COMBO!
              </div>
              <div className="text-lg text-orange-300">ON FIRE!</div>
            </div>
          )}

          {/* Pause overlay */}
          {isPaused && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-4">⏸️</div>
                <div className="text-2xl font-bold text-white mb-2">PAUSED</div>
                <div className="text-gray-400">Click resume to continue</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlizzardGameCanvas;