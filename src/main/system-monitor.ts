import { BrowserWindow } from 'electron';
import si from 'systeminformation';
import cron from 'node-cron';

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night' | 'midnight';

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 2) return 'midnight';
  if (hour < 6) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
}

export class SystemMonitor {
  private window: BrowserWindow;
  private jobs: cron.ScheduledTask[] = [];
  private lastTimeOfDay: TimeOfDay | null = null;

  constructor(window: BrowserWindow) {
    this.window = window;
  }

  start(): void {
    // Check CPU every 10 seconds
    this.jobs.push(
      cron.schedule('*/10 * * * * *', async () => {
        const load = await si.currentLoad();
        const cpuPercent = load.currentLoad;

        if (cpuPercent > 80) {
          this.emit('cpu-high', { percent: cpuPercent });
        } else if (cpuPercent < 30) {
          this.emit('cpu-normal', { percent: cpuPercent });
        }
      }),
    );

    // Check battery every 60 seconds
    this.jobs.push(
      cron.schedule('* * * * *', async () => {
        const battery = await si.battery();
        if (battery.hasBattery && battery.percent < 20 && !battery.isCharging) {
          this.emit('battery-low', { percent: battery.percent });
        }
      }),
    );

    // Check network every 30 seconds
    this.jobs.push(
      cron.schedule('*/30 * * * * *', async () => {
        const nets = await si.networkInterfaces();
        const hasConnection = Array.isArray(nets) && nets.some((n) => n.operstate === 'up');
        if (!hasConnection) {
          this.emit('no-network', {});
        }
      }),
    );

    // Check time-of-day every minute, emit only on change
    this.jobs.push(
      cron.schedule('* * * * *', () => {
        const tod = getTimeOfDay();
        if (tod !== this.lastTimeOfDay) {
          this.lastTimeOfDay = tod;
          this.emit('time-of-day', { period: tod });
        }
      }),
    );
  }

  stop(): void {
    this.jobs.forEach((j) => j.stop());
    this.jobs = [];
  }

  private emit(type: string, payload: unknown): void {
    if (!this.window.isDestroyed()) {
      this.window.webContents.send('system-event', { type, payload });
    }
  }
}
