import type { UserStats } from '../types';

const STORAGE_KEY = 'os_platform_user_stats';

const INITIAL_STATS: UserStats = {
  level: 1,
  xp: 0,
  badges: [],
  completedMissions: [],
};

export const getUserStats = (): UserStats => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return INITIAL_STATS;
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_STATS;
  }
};

export const saveUserStats = (stats: UserStats) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const calculateLevel = (xp: number): number => {
  // Level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

export const addXP = (amount: number): UserStats => {
  const current = getUserStats();
  const newXP = current.xp + amount;
  const newLevel = calculateLevel(newXP);
  
  const updated: UserStats = {
    ...current,
    xp: newXP,
    level: newLevel,
  };
  
  saveUserStats(updated);
  return updated;
};

export const completeMission = (missionId: string, xpReward: number): UserStats => {
  const current = getUserStats();
  if (current.completedMissions.includes(missionId)) return current;
  
  const updated: UserStats = {
    ...current,
    completedMissions: [...current.completedMissions, missionId],
    xp: current.xp + xpReward,
    level: calculateLevel(current.xp + xpReward),
  };
  
  saveUserStats(updated);
  return updated;
};

export const resetProgress = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};
