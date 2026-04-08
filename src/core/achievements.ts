export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt?: string; // ISO date
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'fed_10',    name: 'Snack Time',   description: 'Feed your pet 10 times' },
  { id: 'fed_100',   name: 'Full Belly',   description: 'Feed your pet 100 times' },
  { id: 'day_7',     name: 'Week Buddy',   description: 'Survive 7 days' },
  { id: 'cpu_99',    name: 'CPU Witness',  description: 'Watch your pet panic at 99% CPU' },
  { id: 'night_owl', name: 'Night Owl',    description: 'Stay active past midnight' },
];
