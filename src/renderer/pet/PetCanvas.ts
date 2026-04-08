import * as PIXI from 'pixi.js';
import { StateMachine } from './StateMachine';
import { SpriteManager } from './SpriteManager';
import { Physics } from './Physics';
import { SpeechBubble } from './SpeechBubble';
import { LevelUpFX } from '../ui/LevelUpFX';
import { StatsManager } from '../../core/stats';
import { getMood } from '../../core/personality';
import { xpToLevel, xpProgressInLevel, XP_REWARDS } from '../../core/leveling';
import { checkAchievements, DEFAULT_COUNTERS } from '../../core/achievements';
import type { Achievement, AchievementCounters } from '../../core/achievements';
import type { PersistedState } from '../../core/persistence';

declare const window: Window & {
  nekotama: {
    moveWindow: (x: number, y: number) => void;
    getWindowPos: () => Promise<{ x: number; y: number }>;
    setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) => void;
    onSystemEvent: (cb: (event: { type: string; payload: unknown }) => void) => () => void;
    savePetState: (state: unknown) => void;
    loadPetState: () => Promise<unknown>;
  };
};

const DECAY_INTERVAL_MS  = 60_000;
const BUBBLE_INTERVAL_MS = 15_000;
const SAVE_INTERVAL_MS   = 30_000;

async function main(): Promise<void> {
  const app = new PIXI.Application();
  await app.init({
    width: 200,
    height: 200,
    backgroundAlpha: 0,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  document.getElementById('pet-root')!.appendChild(app.canvas);

  const stateMachine = new StateMachine();
  const spriteManager = new SpriteManager(app);
  const physics       = new Physics(app.canvas as HTMLCanvasElement);
  const bubble        = new SpeechBubble(app);
  const levelUpFX     = new LevelUpFX(app);

  // Load persisted state or start fresh
  const saved = await window.nekotama.loadPetState() as PersistedState | null;
  const stats  = new StatsManager(saved?.stats);

  // XP / level / achievement state
  let xp           = saved?.xp ?? 0;
  let level        = xpToLevel(xp);
  let achievements: Achievement[]      = saved?.achievements ?? [];
  let counters:     AchievementCounters = saved?.counters ?? { ...DEFAULT_COUNTERS };

  // Grant XP and fire level-up effect when crossing a threshold
  function grantXP(amount: number): void {
    const prev = level;
    xp   += amount;
    level = xpToLevel(xp);
    if (level > prev) levelUpFX.play(level);
  }

  // Merge newly unlocked achievements into the running list
  function runAchievementCheck(): void {
    const newly = checkAchievements(achievements, counters, level);
    for (const a of newly) {
      const idx = achievements.findIndex((x) => x.id === a.id);
      if (idx === -1) achievements.push(a);
      else achievements[idx] = a;
    }
  }

  // Daily login bonus: XP + increment day counter
  if (saved?.lastSeen) {
    const lastDate = new Date(saved.lastSeen).toDateString();
    const today    = new Date().toDateString();
    if (lastDate !== today) {
      counters.daysActive++;
      grantXP(XP_REWARDS.dailyLogin);
    }
  }

  // Sync sprite with state machine
  stateMachine.onEnter('idle',      () => spriteManager.setState('idle'));
  stateMachine.onEnter('walking',   () => spriteManager.setState('walking'));
  stateMachine.onEnter('eating',    () => spriteManager.setState('eating'));
  stateMachine.onEnter('sleeping',  () => spriteManager.setState('sleeping'));
  stateMachine.onEnter('excited',   () => spriteManager.setState('excited'));
  stateMachine.onEnter('sad',       () => spriteManager.setState('sad'));
  stateMachine.onEnter('panicking', () => spriteManager.setState('panicking'));

  // Load sprites or fall back to placeholder
  try {
    await spriteManager.load('../../src/assets/sprites/sfw/nekotama-sheet.png');
  } catch {
    console.warn('No sprite sheet found, using placeholder');
    spriteManager.createPlaceholder();
  }

  // Click-through: disabled while dragging, enabled otherwise
  physics.onDrag(
    () => window.nekotama.setIgnoreMouseEvents(false),
    () => window.nekotama.setIgnoreMouseEvents(true, { forward: true }),
  );

  // Double-click to feed
  app.canvas.addEventListener('dblclick', () => {
    stats.feed(20, 10);
    counters.feedCount++;
    grantXP(XP_REWARDS.feed);
    stateMachine.forceTransition('eating');
    bubble.show('eating');
    runAchievementCheck();
    setTimeout(() => applyMoodToState(), 3000);
  });

  // Right-click to pet
  app.canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    stats.pet(15);
    counters.petCount++;
    grantXP(XP_REWARDS.pet);
    stateMachine.forceTransition('excited');
    bubble.show('happy');
    runAchievementCheck();
    setTimeout(() => applyMoodToState(), 2000);
  });

  // System events from main process
  window.nekotama.onSystemEvent(({ type, payload }) => {
    switch (type) {
      case 'cpu-high':
        counters.cpuHighCount++;
        stateMachine.forceTransition('panicking');
        bubble.show('cpu_high');
        grantXP(XP_REWARDS.systemEvent);
        runAchievementCheck();
        break;
      case 'cpu-normal':
        applyMoodToState();
        break;
      case 'battery-low':
        stateMachine.forceTransition('sad');
        bubble.show('sad');
        break;
      case 'no-network':
        stateMachine.forceTransition('sad');
        bubble.show('sad');
        break;
      case 'ram-low':
        bubble.show('ram_low');
        break;
      case 'time-of-day': {
        const period = (payload as { period?: string })?.period;
        if (period === 'morning') {
          bubble.show('morning');
          stateMachine.forceTransition('idle');
        } else if (period === 'midnight') {
          bubble.show('midnight');
          counters.nightOwlSeen = true;
          runAchievementCheck();
        } else if (period === 'night') {
          bubble.show('night');
        }
        applyMoodToState();
        break;
      }
    }
  });

  function applyMoodToState(): void {
    const mood = getMood(stats.current);
    switch (mood) {
      case 'happy':  stateMachine.forceTransition('excited');  break;
      case 'hungry': stateMachine.forceTransition('sad');      break;
      case 'tired':  stateMachine.forceTransition('sleeping'); break;
      case 'sad':    stateMachine.forceTransition('sad');      break;
      default:       stateMachine.tick();                      break;
    }
  }

  // Stat decay every minute
  setInterval(() => {
    stats.decay();
    applyMoodToState();
  }, DECAY_INTERVAL_MS);

  // Random speech bubble every 15s
  setInterval(() => {
    const mood = getMood(stats.current);
    bubble.show(mood === 'neutral' ? 'idle' : mood);
  }, BUBBLE_INTERVAL_MS);

  // Persist full state every 30s
  setInterval(() => {
    window.nekotama.savePetState({
      stats: stats.toJSON(),
      level,
      xp,
      lastSeen: new Date().toISOString(),
      achievements,
      counters,
    } satisfies PersistedState);
  }, SAVE_INTERVAL_MS);

  // Game loop: random idle behaviour tick every 2s
  let tickFrames = 0;
  app.ticker.add(() => {
    tickFrames++;
    if (tickFrames >= 120) {
      const mood = getMood(stats.current);
      if (mood === 'neutral') stateMachine.tick();
      tickFrames = 0;
    }
  });

  applyMoodToState();
  window.nekotama.setIgnoreMouseEvents(true, { forward: true });
}

main().catch(console.error);
