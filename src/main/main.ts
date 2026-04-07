import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import { setupTray } from './tray';
import { setupIpcHandlers } from './ipc-handlers';
import { SystemMonitor } from './system-monitor';

let petWindow: BrowserWindow | null = null;

function createPetWindow(): BrowserWindow {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width: 200,
    height: 200,
    x: width - 220,
    y: height - 220,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Allow click-through on transparent areas
  win.setIgnoreMouseEvents(false);

  const VITE_DEV_URL = process.env.VITE_DEV_SERVER_URL;
  if (VITE_DEV_URL) {
    win.loadURL(VITE_DEV_URL);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(__dirname, '../renderer/pet/index.html'));
  }

  return win;
}

app.whenReady().then(() => {
  petWindow = createPetWindow();

  setupTray(petWindow);
  setupIpcHandlers(petWindow);

  const systemMonitor = new SystemMonitor(petWindow);
  systemMonitor.start();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      petWindow = createPetWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Keep running in tray on all platforms
});
