import * as PIXI from 'pixi.js';
import { StateMachine } from './StateMachine';
import { SpriteManager } from './SpriteManager';
import { Physics } from './Physics';

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

  // Try to load sprites; fall back to placeholder
  try {
    await spriteManager.load('../../src/assets/sprites/sfw/nekotama-sheet.png');
  } catch {
    console.warn('Sprite sheet not found, using placeholder');
    spriteManager.createPlaceholder();
  }

  // Sync sprite with state machine
  stateMachine.onEnter('idle',      () => spriteManager.setState('idle'));
  stateMachine.onEnter('walking',   () => spriteManager.setState('walking'));
  stateMachine.onEnter('eating',    () => spriteManager.setState('eating'));
  stateMachine.onEnter('sleeping',  () => spriteManager.setState('sleeping'));
  stateMachine.onEnter('excited',   () => spriteManager.setState('excited'));
  stateMachine.onEnter('sad',       () => spriteManager.setState('sad'));
  stateMachine.onEnter('panicking', () => spriteManager.setState('panicking'));

  // Click-through on transparent pixels
  physics.onDrag(
    () => window.nekotama.setIgnoreMouseEvents(false),
    () => window.nekotama.setIgnoreMouseEvents(true, { forward: true }),
  );

  // React to system events from main process
  window.nekotama.onSystemEvent(({ type }) => {
    switch (type) {
      case 'cpu-high':    stateMachine.forceTransition('panicking'); break;
      case 'cpu-normal':  stateMachine.forceTransition('idle');      break;
      case 'battery-low': stateMachine.forceTransition('sad');       break;
      case 'no-network':  stateMachine.forceTransition('sad');       break;
      case 'time-of-day': /* handled in Phase 3 */ break;
    }
  });

  // Game loop tick every 2 seconds
  let tickInterval = 0;
  app.ticker.add(() => {
    tickInterval++;
    if (tickInterval >= 120) { // ~2s at 60fps
      stateMachine.tick();
      tickInterval = 0;
    }
  });

  // Enable click-through by default on transparent areas
  window.nekotama.setIgnoreMouseEvents(true, { forward: true });
}

main().catch(console.error);
