import type { TrainingMode } from '../types/index.js';

export const trainingModes: TrainingMode[] = [
  {
    id: 'precision-easy',
    name: '정밀 사격 - 입문',
    description: '정적 타겟으로 기본 조준 연습',
    type: 'precision',
    difficulty: 'easy',
    duration: 30,
    targetCount: 15,
    targetSize: 80,
    targetSpeed: 0
  },
  {
    id: 'precision-medium',
    name: '정밀 사격 - 숙련',
    description: '중간 크기 타겟으로 정확도 향상',
    type: 'precision',
    difficulty: 'medium',
    duration: 30,
    targetCount: 20,
    targetSize: 60,
    targetSpeed: 0
  },
  {
    id: 'precision-hard',
    name: '정밀 사격 - 고수',
    description: '작은 타겟으로 극한 정확도 도전',
    type: 'precision',
    difficulty: 'hard',
    duration: 30,
    targetCount: 25,
    targetSize: 40,
    targetSpeed: 0
  },
  {
    id: 'flick-training',
    name: '플릭샷 훈련',
    description: '빠른 조준 전환 연습',
    type: 'flick',
    difficulty: 'medium',
    duration: 30,
    targetCount: 20,
    targetSize: 55,
    targetSpeed: 0
  },
  {
    id: 'tracking-training',
    name: '트래킹 훈련',
    description: '움직이는 타겟 추적 연습',
    type: 'tracking',
    difficulty: 'medium',
    duration: 30,
    targetCount: 15,
    targetSize: 60,
    targetSpeed: 150
  },
  {
    id: 'projectile-training',
    name: '투사체 훈련',
    description: '투사체 예측 및 선행 조준',
    type: 'projectile',
    difficulty: 'medium',
    duration: 30,
    targetCount: 15,
    targetSize: 65,
    targetSpeed: 120
  },
  {
    id: 'beam-training',
    name: '빔 무기 훈련',
    description: '빔 무기 연결 유지 연습',
    type: 'beam',
    difficulty: 'medium',
    duration: 30,
    targetCount: 12,
    targetSize: 60,
    targetSpeed: 130
  }
];