import * as PIXI from 'pixi.js';
import type { PetState } from './StateMachine';

export interface SpriteSheet {
  texture: PIXI.Texture;
  frameWidth: number;
  frameHeight: number;
  animations: Record<PetState, { frames: number[]; speed: number }>;
}

const DEFAULT_ANIMATIONS: Record<PetState, { frames: number[]; speed: number }> = {
  idle:      { frames: [0, 1, 2, 3],       speed: 0.08 },
  walking:   { frames: [4, 5, 6, 7],       speed: 0.15 },
  eating:    { frames: [8, 9, 10, 11],      speed: 0.12 },
  sleeping:  { frames: [12, 13],            speed: 0.04 },
  excited:   { frames: [14, 15, 16, 17],   speed: 0.20 },
  sad:       { frames: [18, 19],            speed: 0.06 },
  panicking: { frames: [20, 21, 22, 23],   speed: 0.25 },
};

export class SpriteManager {
  private app: PIXI.Application;
  private sprite: PIXI.AnimatedSprite | null = null;
  private currentState: PetState = 'idle';
  private textures: Record<PetState, PIXI.Texture[]> = {} as Record<PetState, PIXI.Texture[]>;

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  async load(spriteSheetPath: string): Promise<void> {
    const sheet = await PIXI.Assets.load(spriteSheetPath) as PIXI.Spritesheet;

    if (sheet && sheet.animations) {
      // Spritesheet with named animations (preferred format)
      for (const state of Object.keys(DEFAULT_ANIMATIONS) as PetState[]) {
        const key = `nekotama_${state}`;
        this.textures[state] = sheet.animations[key] ?? sheet.animations['nekotama_idle'] ?? [];
      }
    } else {
      // Fallback: single texture sheet, slice by frame
      const baseTexture = PIXI.Assets.get(spriteSheetPath) as PIXI.Texture;
      const { frameWidth, frameHeight } = { frameWidth: 64, frameHeight: 64 };
      const cols = Math.floor(baseTexture.width / frameWidth);

      for (const [state, anim] of Object.entries(DEFAULT_ANIMATIONS) as [PetState, { frames: number[]; speed: number }][]) {
        this.textures[state] = anim.frames.map((i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          return new PIXI.Texture({
            source: baseTexture.source,
            frame: new PIXI.Rectangle(col * frameWidth, row * frameHeight, frameWidth, frameHeight),
          });
        });
      }
    }

    this.createSprite('idle');
  }

  /** Create a placeholder colored rectangle when no sprites loaded yet */
  createPlaceholder(): void {
    const g = new PIXI.Graphics();
    g.rect(60, 60, 80, 80).fill({ color: 0xff69b4, alpha: 0.8 });
    g.circle(90, 55, 35).fill({ color: 0xff9aba, alpha: 0.9 });
    // eyes
    g.circle(82, 50, 5).fill({ color: 0x333333 });
    g.circle(98, 50, 5).fill({ color: 0x333333 });
    this.app.stage.addChild(g);
  }

  private createSprite(state: PetState): void {
    const frames = this.textures[state];
    if (!frames || frames.length === 0) return;

    if (this.sprite) {
      this.app.stage.removeChild(this.sprite);
      this.sprite.destroy();
    }

    this.sprite = new PIXI.AnimatedSprite(frames);
    this.sprite.animationSpeed = DEFAULT_ANIMATIONS[state].speed;
    this.sprite.loop = true;
    this.sprite.play();
    this.sprite.x = this.app.screen.width / 2 - this.sprite.width / 2;
    this.sprite.y = this.app.screen.height / 2 - this.sprite.height / 2;
    this.app.stage.addChild(this.sprite);
    this.currentState = state;
  }

  setState(state: PetState): void {
    if (state === this.currentState) return;
    this.createSprite(state);
  }

  get container(): PIXI.AnimatedSprite | null {
    return this.sprite;
  }

  setFlipped(flipped: boolean): void {
    if (!this.sprite) return;
    this.sprite.scale.x = flipped ? -Math.abs(this.sprite.scale.x) : Math.abs(this.sprite.scale.x);
  }
}
