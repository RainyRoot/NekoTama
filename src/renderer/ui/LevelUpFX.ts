import * as PIXI from 'pixi.js';

interface Particle {
  g: PIXI.Graphics;
  vx: number;
  vy: number;
}

const COLORS = [0xff69b4, 0xffd700, 0x87ceeb, 0x98fb98, 0xff6347, 0xdda0dd];

export class LevelUpFX {
  private app: PIXI.Application;

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  play(level: number): void {
    const container = new PIXI.Container();
    this.app.stage.addChild(container);

    const cx = this.app.screen.width / 2;
    const cy = this.app.screen.height / 2 - 10;

    // "Level N!" text
    const text = new PIXI.Text({
      text: `Lv.${level}!`,
      style: {
        fontSize: 16,
        fill: '#ff69b4',
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        align: 'center',
      },
    });
    text.anchor.set(0.5, 0.5);
    text.x = cx;
    text.y = cy;
    container.addChild(text);

    // Star particles burst outward
    const particles: Particle[] = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const g = new PIXI.Graphics();
      const color = COLORS[i % COLORS.length];
      g.circle(0, 0, 3).fill({ color });
      g.x = cx;
      g.y = cy;
      const angle = (i / count) * Math.PI * 2;
      const speed = 1.5 + Math.random() * 2;
      particles.push({ g, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed });
      container.addChild(g);
    }

    const startTime = performance.now();
    const duration  = 1600;

    const tick = () => {
      const elapsed = performance.now() - startTime;
      const t = elapsed / duration;

      if (t >= 1) {
        this.app.stage.removeChild(container);
        container.destroy({ children: true });
        return;
      }

      // Bounce scale for the text
      text.scale.set(1 + 0.25 * Math.sin(t * Math.PI * 3));
      text.alpha = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4;

      for (const p of particles) {
        p.g.x  += p.vx;
        p.g.y  += p.vy;
        p.vy   += 0.12; // gravity
        p.g.alpha = 1 - t;
        p.g.rotation += 0.2;
      }

      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}
