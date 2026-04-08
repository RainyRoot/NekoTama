import type { PetStats } from './stats';
import type { Achievement, AchievementCounters } from './achievements';

export interface AppSettings {
  alwaysOnTop: boolean;
  opacity: number;       // 0.3–1.0
  scale: number;         // 0.5–2.0
  soundEnabled: boolean;
  autostart: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  alwaysOnTop: true,
  opacity: 1.0,
  scale: 1.0,
  soundEnabled: true,
  autostart: false,
};

// Accessed via IPC in renderer, directly in main
export interface PersistedState {
  stats: PetStats;
  level: number;
  xp: number;
  lastSeen: string; // ISO date
  achievements: Achievement[];
  counters: AchievementCounters;
}
