import apiClient from './apiClient';

export interface Achievement {
  id: number;
  code: string;
  name: string;
  description: string;
  category?: string;
  rarity?: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'HIDDEN';
  icon?: string;
}

export interface UserAchievement {
  id: number;
  achievement: Achievement;
  earnedAt: string;
}

export interface AchievementProgress {
  achievement: Achievement;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
  earnedAt?: string;
}

export const getMyAchievements = (signal?: AbortSignal) =>
  apiClient
    .get<UserAchievement[]>('/api/achievements/my', { signal })
    .then((res) => res.data);

export const getAllAchievements = (signal?: AbortSignal) =>
  apiClient
    .get<AchievementProgress[]>('/api/achievements/all', { signal })
    .then((res) => res.data);

export const getAchievementStats = (signal?: AbortSignal) =>
  apiClient
    .get<{ total: number; earned: number; byCategory: Record<string, number> }>('/api/achievements/stats', { signal })
    .then((res) => res.data);

