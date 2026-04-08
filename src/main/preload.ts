import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('nekotama', {
  // Window movement
  moveWindow: (x: number, y: number) => ipcRenderer.send('move-window', { x, y }),
  getWindowPos: () => ipcRenderer.invoke('get-window-pos'),

  // Click-through toggle
  setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) =>
    ipcRenderer.send('set-ignore-mouse-events', { ignore, options }),

  // System events: main → renderer
  onSystemEvent: (callback: (event: SystemEvent) => void) => {
    ipcRenderer.on('system-event', (_e, data: SystemEvent) => callback(data));
    return () => ipcRenderer.removeAllListeners('system-event');
  },

  // Pet state persistence
  savePetState: (state: unknown) => ipcRenderer.send('save-pet-state', state),
  loadPetState: () => ipcRenderer.invoke('load-pet-state'),

  // App settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: unknown) => ipcRenderer.send('save-settings', settings),
  applySettings: (settings: unknown) => ipcRenderer.send('apply-settings', settings),

  // Misc
  getVersion: () => ipcRenderer.invoke('get-version'),
});

export interface SystemEvent {
  type: 'cpu-high' | 'cpu-normal' | 'battery-low' | 'no-network' | 'ram-low' | 'time-of-day';
  payload?: unknown;
}
