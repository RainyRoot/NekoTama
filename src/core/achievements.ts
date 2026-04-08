export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: string; // ISO date
}

export interface AchievementCounters {
  feedCount: number;
  petCount: number;
  cpuHighCount: number;
  daysActive: number;
  nightOwlSeen: boolean;
}

export const DEFAULT_COUNTERS: AchievementCounters = {
  feedCount: 0,
  petCount: 0,
  cpuHighCount: 0,
  daysActive: 0,
  nightOwlSeen: false,
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'fed_10',    name: 'Snack Time',    description: 'Feed your pet 10 times' },
  { id: 'fed_100',   name: 'Full Belly',    description: 'Feed your pet 100 times' },
  { id: 'pet_50',    name: 'Headpat Master', description: 'Pet your companion 50 times' },
  { id: 'day_7',     name: 'Week Buddy',    description: 'Be active for 7 days' },
  { id: 'cpu_99',    name: 'CPU Witness',   description: 'Watch your pet panic at high CPU' },
  { id: 'night_owl', name: 'Night Owl',     description: 'Stay active past midnight' },
  { id: 'level_5',   name: 'Growing Up',    description: 'Reach level 5' },
  { id: 'level_10',  name: 'Veteran',       description: 'Reach level 10' },
];

/** Returns only newly unlocked achievements (not already in `current`). */
export function checkAchievements(
  current: Achievement[],
  counters: AchievementCounters,
  level: number,
): Achievement[] {
  const unlocked = new Set(current.filter((a) => a.unlockedAt).map((a) => a.id));
  const newly: Achievement[] = [];

  const tryUnlock = (id: string) => {
    if (unlocked.has(id)) return;
    const def = ACHIEVEMENTS.find((a) => a.id === id);
    if (def) newly.push({ ...def, unlockedAt: new Date().toISOString() });
  };

  if (counters.feedCount >= 10)  tryUnlock('fed_10');
  if (counters.feedCount >= 100) tryUnlock('fed_100');
  if (counters.petCount >= 50)   tryUnlock('pet_50');
  if (counters.daysActive >= 7)  tryUnlock('day_7');
  if (counters.cpuHighCount > 0) tryUnlock('cpu_99');
  if (counters.nightOwlSeen)     tryUnlock('night_owl');
  if (level >= 5)                tryUnlock('level_5');
  if (level >= 10)               tryUnlock('level_10');

  return newly;
}
