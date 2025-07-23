import type { Hero } from '../types/index.js';

export const heroes: Hero[] = [
  {
    id: 'soldier76',
    name: 'Soldier: 76',
    role: 'damage',
    weaponType: 'hitscan',
    fireRate: 8.8,
    damage: 19,
    headShotMultiplier: 2.0,
    crosshair: {
      type: 'cross',
      size: 4,
      thickness: 1,
      gap: 2,
      color: '#00ff00',
      opacity: 1,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 0.8
    }
  },
  {
    id: 'widowmaker',
    name: 'Widowmaker',
    role: 'damage',
    weaponType: 'hitscan',
    fireRate: 1.5,
    damage: 120,
    headShotMultiplier: 2.5,
    crosshair: {
      type: 'dot',
      size: 2,
      thickness: 1,
      gap: 0,
      color: '#ff6b9d',
      opacity: 1,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 0.8
    }
  },
  {
    id: 'tracer',
    name: 'Tracer',
    role: 'damage',
    weaponType: 'hitscan',
    fireRate: 20,
    damage: 6,
    headShotMultiplier: 2.0,
    crosshair: {
      type: 'circle',
      size: 6,
      thickness: 2,
      gap: 4,
      color: '#f99e1a',
      opacity: 1,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 0.8
    }
  },
  {
    id: 'mccree',
    name: 'Cassidy',
    role: 'damage',
    weaponType: 'hitscan',
    fireRate: 2,
    damage: 70,
    headShotMultiplier: 2.0,
    crosshair: {
      type: 'cross',
      size: 5,
      thickness: 2,
      gap: 3,
      color: '#cd853f',
      opacity: 1,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 0.8
    }
  },
  {
    id: 'pharah',
    name: 'Pharah',
    role: 'damage',
    weaponType: 'projectile',
    fireRate: 1.1,
    damage: 120,
    headShotMultiplier: 1.0,
    crosshair: {
      type: 'crosshairs',
      size: 8,
      thickness: 2,
      gap: 6,
      color: '#4a90e2',
      opacity: 1,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 0.8
    }
  },
  {
    id: 'junkrat',
    name: 'Junkrat',
    role: 'damage',
    weaponType: 'projectile',
    fireRate: 1.7,
    damage: 120,
    headShotMultiplier: 1.0,
    crosshair: {
      type: 'circle',
      size: 10,
      thickness: 3,
      gap: 8,
      color: '#f5a623',
      opacity: 0.8,
      outline: true,
      outlineThickness: 2,
      outlineOpacity: 0.6
    }
  },
  {
    id: 'zarya',
    name: 'Zarya',
    role: 'tank',
    weaponType: 'beam',
    fireRate: 20,
    damage: 85,
    headShotMultiplier: 1.0,
    crosshair: {
      type: 'dot',
      size: 3,
      thickness: 1,
      gap: 0,
      color: '#ff69b4',
      opacity: 1,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 0.8
    }
  },
  {
    id: 'symmetra',
    name: 'Symmetra',
    role: 'damage',
    weaponType: 'beam',
    fireRate: 12,
    damage: 60,
    headShotMultiplier: 1.0,
    crosshair: {
      type: 'circle',
      size: 4,
      thickness: 1,
      gap: 2,
      color: '#00d4ff',
      opacity: 1,
      outline: true,
      outlineThickness: 1,
      outlineOpacity: 0.8
    }
  }
];