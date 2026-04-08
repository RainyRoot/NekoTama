import type { PetStats } from './stats';

export type Mood = 'happy' | 'neutral' | 'hungry' | 'tired' | 'sad';

export function getMood(stats: PetStats): Mood {
  if (stats.hunger < 20) return 'hungry';
  if (stats.energy < 20) return 'tired';
  if (stats.happiness < 20) return 'sad';
  if (stats.happiness > 70 && stats.hunger > 60 && stats.energy > 60) return 'happy';
  return 'neutral';
}
