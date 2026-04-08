import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import { setupTray } from './tray';
import { setupIpcHandlers } from './ipc-handlers';
import { SystemMonitor } from './system-monitor';

let petWindow:      BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;

const VITE_DEV_URL = process.env.VITE_DEV_SERVER_URL;

function createPetWindow(): BrowserWindow {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width: 200,
    height: 200,
    x: width  - 220,
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

  win.webContents.on('did-fail-load', (_e, code, desc, url) => {
    console.error(`[NekoTama] Renderer failed to load: ${desc} (${code}) — ${url}`);
  });

  if (VITE_DEV_URL) {
    win.loadURL(`${VITE_DEV_URL}/pet/index.html`);
  } else {
    win.loadFile(path.join(__dirname, '../renderer/pet/index.html'));
  }

  return win;
}

function openSettingsWindow(): void {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 420,
    height: 580,
    title: 'NekoTama Settings',
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (VITE_DEV_URL) {
    settingsWindow.loadURL(`${VITE_DEV_URL}/settings/index.html`);
  } else {
    settingsWindow.loadFile(path.join(__dirname, '../renderer/settings/index.html'));
  }

  settingsWindow.on('closed', () => { settingsWindow = null; });
}

app.whenReady().then(() => {
  petWindow = createPetWindow();

  try { setupTray(petWindow, openSettingsWindow); } catch (e) { console.error('[NekoTama] Tray error:', e); }
  setupIpcHandlers(petWindow);

  try {
    const monitor = new SystemMonitor(petWindow);
    monitor.start();
  } catch (e) { console.error('[NekoTama] SystemMonitor error:', e); }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) petWindow = createPetWindow();
  });
});

app.on('window-all-closed', () => {
  // Keep running in tray
});
