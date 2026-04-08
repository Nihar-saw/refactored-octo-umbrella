export interface UserStats {
  level: number;
  xp: number;
  badges: string[];
  completedMissions: string[];
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  unlockedAt: number; // XP threshold to unlock
  isCompleted: boolean;
  type: 'scheduling' | 'page-replacement' | 'deadlock' | 'memory';
}

export interface SimulationResult {
  algorithm: string;
  metrics: {
    avgWaitingTime?: number;
    avgTurnaroundTime?: number;
    pageFaults?: number;
    hitRatio?: number;
    [key: string]: any;
  };
  xpEarned: number;
}
