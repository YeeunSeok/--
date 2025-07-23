import React, { useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Target, Shot } from '../types/index.js';

interface GameCanvasProps {
  width: number;
  height: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastTargetSpawn = useRef<number>(0);
  const gameStartTime = useRef<number>(0);
  const mousePos = useRef<{ x: number; y: number }>({ x: width / 2, y: height / 2 });

  const {
    isPlaying,
    isPaused,
    currentMode,
    targets,
    settings,
    timeRemaining,
    score,
    streak,
    addTarget,
    removeTarget,
    recordShot,
    stopGame,
  } = useGameStore();

  const createTarget = useCallback(() => {
    if (!currentMode || !isPlaying || isPaused) return;

    const now = Date.now();
    if (now - lastTargetSpawn.current < 1000) return; // Minimum 1 second between spawns

    const margin = 50;
    const target: Target = {
      id: `target-${now}`,
      x: margin + Math.random() * (width - 2 * margin - currentMode.targetSize),
      y: margin + Math.random() * (height - 2 * margin - currentMode.targetSize),
      size: currentMode.targetSize,
      createdAt: now,
      isActive: true,
      isHeadShot: Math.random() < 0.3, // 30% chance for headshot zone
    };

    addTarget(target);
    lastTargetSpawn.current = now;

    // Auto-remove target after some time (except for moving modes)
    if (currentMode.type === 'precision' || currentMode.type === 'flick') {
      setTimeout(() => {
        removeTarget(target.id);
      }, 2000);
    } else {
      // For moving targets, remove after longer duration
      setTimeout(() => {
        removeTarget(target.id);
      }, 5000);
    }
  }, [currentMode, isPlaying, isPaused, width, height, addTarget, removeTarget]);

  const drawCrosshair = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const { crosshair } = settings;
    ctx.strokeStyle = crosshair.color;
    ctx.globalAlpha = crosshair.opacity;
    ctx.lineWidth = crosshair.thickness;

    switch (crosshair.type) {
      case 'cross':
        ctx.beginPath();
        ctx.moveTo(x - crosshair.size - crosshair.gap, y);
        ctx.lineTo(x - crosshair.gap, y);
        ctx.moveTo(x + crosshair.gap, y);
        ctx.lineTo(x + crosshair.size + crosshair.gap, y);
        ctx.moveTo(x, y - crosshair.size - crosshair.gap);
        ctx.lineTo(x, y - crosshair.gap);
        ctx.moveTo(x, y + crosshair.gap);
        ctx.lineTo(x, y + crosshair.size + crosshair.gap);
        ctx.stroke();
        break;
      case 'dot':
        ctx.beginPath();
        ctx.arc(x, y, crosshair.size, 0, 2 * Math.PI);
        ctx.fill();
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(x, y, crosshair.size + crosshair.gap, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      case 'crosshairs':
        // Full crosshairs that span more area
        ctx.beginPath();
        ctx.moveTo(x - crosshair.size * 2, y);
        ctx.lineTo(x + crosshair.size * 2, y);
        ctx.moveTo(x, y - crosshair.size * 2);
        ctx.lineTo(x, y + crosshair.size * 2);
        ctx.stroke();
        break;
    }
    ctx.globalAlpha = 1;
  };

  const drawTarget = (ctx: CanvasRenderingContext2D, target: Target) => {
    const { x, y, size } = target;
    const radius = size / 2;

    // Different target styles based on mode
    if (currentMode?.type === 'projectile') {
      // Projectile targets - more visible with trail effect
      ctx.fillStyle = '#ff6600';
      ctx.beginPath();
      ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Inner target
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x + radius, y + radius, radius * 0.5, 0, 2 * Math.PI);
      ctx.fill();
    } else if (currentMode?.type === 'beam') {
      // Beam targets - glowing effect
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#00ffff';
      ctx.beginPath();
      ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Inner core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x + radius, y + radius, radius * 0.3, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      // Standard targets for precision, flick, and tracking
      ctx.fillStyle = '#ff4444';
      ctx.beginPath();
      ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
      ctx.fill();

      // Inner ring
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x + radius, y + radius, radius * 0.6, 0, 2 * Math.PI);
      ctx.fill();

      // Center dot
      ctx.fillStyle = '#ff4444';
      ctx.beginPath();
      ctx.arc(x + radius, y + radius, radius * 0.2, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Headshot indicator for all modes
    if (target.isHeadShot) {
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x + radius, y + radius, radius + 5, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  const updateTargets = useCallback(() => {
    if (!currentMode || !isPlaying || isPaused) return;

    const now = Date.now();
    targets.forEach(target => {
      if ((currentMode.type === 'tracking' || currentMode.type === 'projectile' || currentMode.type === 'beam') && target.isActive) {
        const elapsed = (now - target.createdAt) / 1000;
        const speed = currentMode.targetSpeed / 100; // Normalize speed
        
        if (currentMode.type === 'tracking' || currentMode.type === 'beam') {
          // Circular movement for tracking and beam modes
          const angle = elapsed * speed;
          const centerX = width / 2;
          const centerY = height / 2;
          const radius = Math.min(width, height) * 0.3;
          
          target.x = centerX + Math.cos(angle) * radius - target.size / 2;
          target.y = centerY + Math.sin(angle) * radius - target.size / 2;
        } else if (currentMode.type === 'projectile') {
          // Linear movement for projectile mode
          if (!target.velocityX) {
            // Initialize velocity on first update
            const angle = Math.random() * 2 * Math.PI;
            target.velocityX = Math.cos(angle) * speed * 50;
            target.velocityY = Math.sin(angle) * speed * 50;
          }
          
          target.x += target.velocityX || 0;
          target.y += (target.velocityY || 0);
          
          // Bounce off walls
          if (target.x <= 0 || target.x >= width - target.size) {
            target.velocityX = -(target.velocityX || 0);
          }
          if (target.y <= 0 || target.y >= height - target.size) {
            target.velocityY = -(target.velocityY || 0);
          }
          
          // Keep in bounds
          target.x = Math.max(0, Math.min(width - target.size, target.x));
          target.y = Math.max(0, Math.min(height - target.size, target.y));
        }
      }
    });
  }, [currentMode, isPlaying, isPaused, targets, width, height]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying || isPaused) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Keep crosshair within canvas bounds
    mousePos.current = {
      x: Math.max(0, Math.min(width, x)),
      y: Math.max(0, Math.min(height, y))
    };
  }, [isPlaying, isPaused, width, height]);

  const handleMouseLeave = useCallback(() => {
    // Keep crosshair at last known position when mouse leaves canvas
  }, []);

  const handleMouseEnter = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying || isPaused) return;
    handleMouseMove(event);
  }, [isPlaying, isPaused, handleMouseMove]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying || isPaused || !currentMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Update mouse position for crosshair
    mousePos.current = { x: clickX, y: clickY };

    const now = Date.now();
    let hit = false;
    let headShot = false;
    let hitTarget: Target | null = null;

    // Check if click hit any target
    for (const target of targets) {
      const targetCenterX = target.x + target.size / 2;
      const targetCenterY = target.y + target.size / 2;
      const distance = Math.sqrt(
        Math.pow(clickX - targetCenterX, 2) + Math.pow(clickY - targetCenterY, 2)
      );

      if (distance <= target.size / 2) {
        hit = true;
        hitTarget = target;
        headShot = target.isHeadShot || false;
        break;
      }
    }

    // Record the shot
    const shot: Shot = {
      timestamp: now,
      hit,
      headShot,
      reactionTime: hit && hitTarget ? now - hitTarget.createdAt : 0,
      distance: hit && hitTarget ? Math.sqrt(
        Math.pow(clickX - (hitTarget.x + hitTarget.size / 2), 2) + 
        Math.pow(clickY - (hitTarget.y + hitTarget.size / 2), 2)
      ) : 0,
      targetSize: hitTarget?.size || currentMode.targetSize,
    };

    recordShot(shot);

    // Remove hit target
    if (hit && hitTarget) {
      removeTarget(hitTarget.id);
    }
  }, [isPlaying, isPaused, currentMode, targets, recordShot, removeTarget]);

  const gameLoop = useCallback(() => {
    if (!canvasRef.current || !isPlaying) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    // Update game state
    updateTargets();

    // Create new targets
    createTarget();

    // Draw targets
    targets.forEach(target => {
      if (target.isActive) {
        drawTarget(ctx, target);
      }
    });

    // Draw crosshair at mouse position
    drawCrosshair(ctx, mousePos.current.x, mousePos.current.y);

    // Continue game loop
    if (isPlaying && !isPaused) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  }, [isPlaying, isPaused, width, height, targets, updateTargets, createTarget]);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      gameStartTime.current = Date.now();
      // Reset mouse position to center when game starts
      mousePos.current = { x: width / 2, y: height / 2 };
      animationRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isPaused, gameLoop, width, height]);

  // Timer countdown
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const timer = setInterval(() => {
      useGameStore.setState(state => {
        const newTimeRemaining = state.timeRemaining - 1;
        if (newTimeRemaining <= 0) {
          setTimeout(() => stopGame(), 100);
          return { timeRemaining: 0 };
        }
        return { timeRemaining: newTimeRemaining };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isPaused, stopGame]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="border border-overwatch-gray bg-gray-900"
        style={{ cursor: 'none' }}
      />
      
      {/* Game UI Overlay */}
      {isPlaying && (
        <div className="absolute top-4 left-4 text-white font-overwatch">
          <div className="bg-black bg-opacity-50 p-3 rounded">
            <div className="text-overwatch-orange font-bold text-xl">
              점수: {score}
            </div>
            <div className="text-overwatch-blue">
              시간: {Math.max(0, timeRemaining)}초
            </div>
            <div className="text-green-400">
              연속: {streak}
            </div>
            {settings.showStats && (
              <div className="text-overwatch-light-gray text-sm mt-2">
                <div>모드: {currentMode?.name}</div>
                <div>히어로: {settings.hero.name}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {isPaused && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="text-white text-2xl font-overwatch">일시정지</div>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;