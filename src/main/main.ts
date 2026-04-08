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

  win.setIgnoreMouseEvents(false);

  // Always open DevTools until Phase 1 is stable
  win.webContents.openDevTools({ mode: 'detach' });

  win.webContents.on('did-fail-load', (_e, code, desc, url) => {
    console.error(`[NekoTama] Renderer failed to load: ${desc} (${code}) — ${url}`);
  });

  const VITE_DEV_URL = process.env.VITE_DEV_SERVER_URL;
  if (VITE_DEV_URL) {
    win.loadURL(VITE_DEV_URL);
  } else {
    const htmlPath = path.join(__dirname, '../renderer/pet/index.html');
    console.log('[NekoTama] Loading:', htmlPath);
    win.loadFile(htmlPath);
  }

  return win;
}

app.whenReady().then(() => {
  petWindow = createPetWindow();

  try { setupTray(petWindow); } catch (e) { console.error('[NekoTama] Tray error:', e); }
  setupIpcHandlers(petWindow);

  try {
    const systemMonitor = new SystemMonitor(petWindow);
    systemMonitor.start();
  } catch (e) { console.error('[NekoTama] SystemMonitor error:', e); }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      petWindow = createPetWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Keep running in tray on all platforms
});
