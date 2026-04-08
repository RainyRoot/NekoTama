export const XP_PER_LEVEL = 100;

export const XP_REWARDS = {
  feed:        10,
  pet:          5,
  systemEvent:  2,
  dailyLogin:  20,
} as const;

export function xpToLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpForNextLevel(xp: number): number {
  return XP_PER_LEVEL - (xp % XP_PER_LEVEL);
}

export function xpProgressInLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}
