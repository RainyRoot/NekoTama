import { app, ipcMain, BrowserWindow } from 'electron';
import Store from 'electron-store';

const store = new Store();

export function setupIpcHandlers(petWindow: BrowserWindow): void {
  // Move the window (called from renderer during drag)
  ipcMain.on('move-window', (_event, { x, y }: { x: number; y: number }) => {
    petWindow.setPosition(Math.round(x), Math.round(y));
  });

  // Get current window position
  ipcMain.handle('get-window-pos', () => {
    const [x, y] = petWindow.getPosition();
    return { x, y };
  });

  // Toggle click-through for transparent areas
  ipcMain.on(
    'set-ignore-mouse-events',
    (_event, { ignore, options }: { ignore: boolean; options?: { forward: boolean } }) => {
      petWindow.setIgnoreMouseEvents(ignore, options);
    },
  );

  // Pet state persistence
  ipcMain.on('save-pet-state', (_event, state: unknown) => {
    store.set('petState', state);
  });

  ipcMain.handle('load-pet-state', () => {
    return store.get('petState', null);
  });

  // App settings: read / write / apply live
  ipcMain.handle('get-settings', () => {
    return store.get('appSettings', null);
  });

  ipcMain.on('save-settings', (_event, settings: unknown) => {
    store.set('appSettings', settings);
  });

  ipcMain.on(
    'apply-settings',
    (_event, settings: { alwaysOnTop?: boolean; opacity?: number; autostart?: boolean }) => {
      if (typeof settings.alwaysOnTop === 'boolean') {
        petWindow.setAlwaysOnTop(settings.alwaysOnTop);
      }
      if (typeof settings.opacity === 'number') {
        petWindow.setOpacity(Math.max(0.1, Math.min(1, settings.opacity)));
      }
      if (typeof settings.autostart === 'boolean') {
        app.setLoginItemSettings({ openAtLogin: settings.autostart });
      }
    },
  );

  // App version
  ipcMain.handle('get-version', () => app.getVersion());
}
