import { ipcMain, BrowserWindow } from 'electron';
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

  // Persist pet state via electron-store
  ipcMain.on('save-pet-state', (_event, state: unknown) => {
    store.set('petState', state);
  });

  ipcMain.handle('load-pet-state', () => {
    return store.get('petState', null);
  });
}
