export interface PetStats {
  hunger: number;     // 0–100, decreases over time
  happiness: number;  // 0–100
  energy: number;     // 0–100, decreases while active
  cleanliness: number; // 0–100, decreases slowly
}

export const DEFAULT_STATS: PetStats = {
  hunger: 80,
  happiness: 80,
  energy: 80,
  cleanliness: 100,
};

const DECAY_RATES = {
  hunger:     -0.5,  // per minute
  happiness:  -0.3,
  energy:     -0.4,
  cleanliness: -0.1,
};

export class StatsManager {
  private stats: PetStats;

  constructor(initial?: Partial<PetStats>) {
    this.stats = { ...DEFAULT_STATS, ...initial };
  }

  get current(): Readonly<PetStats> {
    return this.stats;
  }

  /** Called every minute by cron */
  decay(): void {
    for (const key of Object.keys(DECAY_RATES) as (keyof PetStats)[]) {
      this.stats[key] = Math.max(0, Math.min(100, this.stats[key] + DECAY_RATES[key]));
    }
  }

  feed(hungerBoost: number, happinessBoost = 5): void {
    this.stats.hunger = Math.min(100, this.stats.hunger + hungerBoost);
    this.stats.happiness = Math.min(100, this.stats.happiness + happinessBoost);
  }

  sleep(energyBoost: number): void {
    this.stats.energy = Math.min(100, this.stats.energy + energyBoost);
  }

  pet(happinessBoost = 10): void {
    this.stats.happiness = Math.min(100, this.stats.happiness + happinessBoost);
  }

  toJSON(): PetStats {
    return { ...this.stats };
  }

  fromJSON(data: PetStats): void {
    this.stats = { ...data };
  }
}
