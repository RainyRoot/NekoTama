import * as PIXI from 'pixi.js';

type BubbleCategory =
  | 'idle' | 'happy' | 'hungry' | 'tired' | 'sad'
  | 'cpu_high' | 'eating' | 'morning' | 'night' | 'midnight' | 'ram_low';

const LINES: Record<BubbleCategory, string[]> = {
  idle:     ['uwu~', 'nyaa~', 'btw I use arch', '( ´ ▽ ` )', '*yawns*', '...'],
  happy:    ['yay! ヽ(>▽<)ノ', 'so happy~', '( ˶ˆ꒳ˆ˵ )', 'arigato~~', 'hehe :3'],
  hungry:   ['feed me pls (｡•́︿•̀｡)', 'hungry...', 'onigiri??? 🍙', 'i can smell ramen...'],
  tired:    ['sleepy... zzZ', 'need coffee...', '5 more minutes...', 'z z z'],
  sad:      ['(っ◞‸◟c)', 'no network... am alone', 'low battery...', '( ˘︹˘ )'],
  cpu_high: ['WHAT ARE YOU COMPILING', 'TOO HOT AAA', 'pacman -Syu pls stop', 'send help'],
  eating:   ['nom nom~', 'oishii!!', 'yummy :3', '*chomp*'],
  morning:  ['ohayo~', '*big yawn*', 'good morning uwu', 'morning stretch~', 'coffee pls...'],
  night:    ['oyasumi~', 'good night...', 'sleepy time...', 'z z z', 'so tired...'],
  midnight: ['its midnight o_o', 'spooky hour!', 'why are you awake...', '(✿ ◡‿◡)', 'its so quiet...'],
  ram_low:  ['memory is full...', 'too many tabs!!', 'pls close something', 'RAM go brr', 'oof out of memory'],
};

const DISPLAY_MS = 4000;
const FADE_MS    = 400;

export class SpeechBubble {
  private app: PIXI.Application;
  private container: PIXI.Container | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  show(category: BubbleCategory): void {
    const lines = LINES[category];
    const text = lines[Math.floor(Math.random() * lines.length)];
    this.render(text);
  }

  private render(text: string): void {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    if (this.container) {
      this.app.stage.removeChild(this.container);
      this.container.destroy({ children: true });
    }

    const label = new PIXI.Text({
      text,
      style: {
        fontSize: 11,
        fill: '#222222',
        fontFamily: 'sans-serif',
        wordWrap: true,
        wordWrapWidth: 150,
        align: 'center',
      },
    });

    const pad = 6;
    const bw  = label.width + pad * 2;
    const bh  = label.height + pad * 2;

    const bg = new PIXI.Graphics();
    bg.roundRect(0, 0, bw, bh, 8).fill({ color: 0xffffff, alpha: 0.92 });
    bg.roundRect(0, 0, bw, bh, 8).stroke({ color: 0xdddddd, width: 1 });

    // Tail triangle pointing down-center
    const tx = bw / 2;
    bg.moveTo(tx - 6, bh).lineTo(tx + 6, bh).lineTo(tx, bh + 8).fill({ color: 0xffffff, alpha: 0.92 });

    label.x = pad;
    label.y = pad;

    const c = new PIXI.Container();
    c.addChild(bg, label);

    c.x = (this.app.screen.width - bw) / 2;
    c.y = Math.max(2, 50 - bh - 10);
    c.alpha = 0;

    this.app.stage.addChild(c);
    this.container = c;

    this.fadeTo(c, 1, FADE_MS, () => {
      this.hideTimer = setTimeout(() => {
        this.fadeTo(c, 0, FADE_MS, () => {
          if (this.container === c) {
            this.app.stage.removeChild(c);
            c.destroy({ children: true });
            this.container = null;
          }
        });
      }, DISPLAY_MS);
    });
  }

  private fadeTo(target: PIXI.Container, toAlpha: number, durationMs: number, onDone?: () => void): void {
    const startAlpha = target.alpha;
    const startTime  = performance.now();

    const tick = () => {
      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / durationMs, 1);
      target.alpha = startAlpha + (toAlpha - startAlpha) * t;
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        target.alpha = toAlpha;
        onDone?.();
      }
    };
    requestAnimationFrame(tick);
  }
}
