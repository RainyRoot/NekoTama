import * as PIXI from 'pixi.js';
import { StateMachine } from './StateMachine';
import { SpriteManager } from './SpriteManager';
import { Physics } from './Physics';
import { SpeechBubble } from './SpeechBubble';
import { StatsManager } from '../../core/stats';
import { getMood } from '../../core/personality';
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

const DECAY_INTERVAL_MS = 60_000; // 1 minute
const BUBBLE_INTERVAL_MS = 15_000; // speech bubble every 15s
const SAVE_INTERVAL_MS = 30_000;

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
  const physics = new Physics(app.canvas as HTMLCanvasElement);
  const bubble = new SpeechBubble(app);

  // Load persisted state or start fresh
  const saved = await window.nekotama.loadPetState() as PersistedState | null;
  const stats = new StatsManager(saved?.stats);

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

  // Double-click to feed (quick interaction)
  app.canvas.addEventListener('dblclick', () => {
    stats.feed(20, 10);
    stateMachine.forceTransition('eating');
    bubble.show('eating');
    setTimeout(() => applyMoodToState(), 3000);
  });

  // Right-click to pet
  app.canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    stats.pet(15);
    stateMachine.forceTransition('excited');
    bubble.show('happy');
    setTimeout(() => applyMoodToState(), 2000);
  });

  // System events from main process
  window.nekotama.onSystemEvent(({ type }) => {
    switch (type) {
      case 'cpu-high':
        stateMachine.forceTransition('panicking');
        bubble.show('cpu_high');
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
      case 'time-of-day':
        applyMoodToState();
        break;
    }
  });

  function applyMoodToState(): void {
    const mood = getMood(stats.current);
    switch (mood) {
      case 'happy':   stateMachine.forceTransition('excited'); break;
      case 'hungry':  stateMachine.forceTransition('sad');     break;
      case 'tired':   stateMachine.forceTransition('sleeping');break;
      case 'sad':     stateMachine.forceTransition('sad');     break;
      default:        stateMachine.tick();                     break;
    }
  }

  // Stat decay every minute
  setInterval(() => {
    stats.decay();
    applyMoodToState();
  }, DECAY_INTERVAL_MS);

  // Random speech bubble
  setInterval(() => {
    const mood = getMood(stats.current);
    bubble.show(mood === 'neutral' ? 'idle' : mood);
  }, BUBBLE_INTERVAL_MS);

  // Persist state
  setInterval(() => {
    window.nekotama.savePetState({
      stats: stats.toJSON(),
      level: saved?.level ?? 1,
      xp: saved?.xp ?? 0,
      lastSeen: new Date().toISOString(),
    } satisfies PersistedState);
  }, SAVE_INTERVAL_MS);

  // Game loop: random idle behaviour tick every 2s
  let tickFrames = 0;
  app.ticker.add(() => {
    tickFrames++;
    if (tickFrames >= 120) {
      // Only tick idle/walking transitions if no strong mood is overriding
      const mood = getMood(stats.current);
      if (mood === 'neutral') stateMachine.tick();
      tickFrames = 0;
    }
  });

  // Apply initial mood
  applyMoodToState();

  window.nekotama.setIgnoreMouseEvents(true, { forward: true });
}

main().catch(console.error);
