import type { BrowserWindow } from 'electron';

declare const window: Window & {
  nekotama: {
    moveWindow: (x: number, y: number) => void;
    getWindowPos: () => Promise<{ x: number; y: number }>;
    setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) => void;
  };
  screen: { width: number; height: number };
};

const WIN_SIZE = 200; // px — matches BrowserWindow size

export class Physics {
  private isDragging = false;
  private dragOffsetX = 0;
  private dragOffsetY = 0;
  private onDragStart?: () => void;
  private onDragEnd?: () => void;

  constructor(canvas: HTMLCanvasElement) {
    canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
  }

  onDrag(onStart: () => void, onEnd: () => void): void {
    this.onDragStart = onStart;
    this.onDragEnd = onEnd;
  }

  private handleMouseDown(e: MouseEvent): void {
    // Only drag on left click
    if (e.button !== 0) return;
    this.isDragging = true;
    this.dragOffsetX = e.clientX;
    this.dragOffsetY = e.clientY;
    this.onDragStart?.();
  }

  private handleMouseMove(e: MouseEvent): void {
    if (!this.isDragging) return;

    const deltaX = e.screenX - this.dragOffsetX - WIN_SIZE / 2;
    const deltaY = e.screenY - this.dragOffsetY - WIN_SIZE / 2;

    const clamped = this.clampToScreen(e.screenX - this.dragOffsetX, e.screenY - this.dragOffsetY);
    window.nekotama.moveWindow(clamped.x, clamped.y);
  }

  private handleMouseUp(): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.snapToEdge();
    this.onDragEnd?.();
  }

  private clampToScreen(x: number, y: number): { x: number; y: number } {
    const maxX = window.screen.width - WIN_SIZE;
    const maxY = window.screen.height - WIN_SIZE;
    return {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY)),
    };
  }

  private async snapToEdge(): Promise<void> {
    const pos = await window.nekotama.getWindowPos();
    const screenW = window.screen.width;
    const screenH = window.screen.height;

    const centerX = pos.x + WIN_SIZE / 2;
    const centerY = pos.y + WIN_SIZE / 2;

    // Snap to nearest horizontal edge if within 100px
    let targetX = pos.x;
    let targetY = pos.y;

    if (centerX < 100) targetX = 0;
    else if (centerX > screenW - 100) targetX = screenW - WIN_SIZE;

    // Snap to bottom (taskbar) always — gravity
    if (pos.y + WIN_SIZE > screenH - 80) {
      targetY = screenH - WIN_SIZE - 40; // sit just above taskbar
    }

    if (targetX !== pos.x || targetY !== pos.y) {
      this.animateMove(pos.x, pos.y, targetX, targetY);
    }
  }

  private animateMove(fromX: number, fromY: number, toX: number, toY: number): void {
    const steps = 12;
    let step = 0;
    const dx = (toX - fromX) / steps;
    const dy = (toY - fromY) / steps;

    const tick = () => {
      step++;
      window.nekotama.moveWindow(Math.round(fromX + dx * step), Math.round(fromY + dy * step));
      if (step < steps) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}
