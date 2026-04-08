import type { PetStats } from './stats';

// Accessed via IPC in renderer, directly in main
export interface PersistedState {
  stats: PetStats;
  level: number;
  xp: number;
  lastSeen: string; // ISO date
}
