import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('nekotama', {
  // Window movement
  moveWindow: (x: number, y: number) => ipcRenderer.send('move-window', { x, y }),
  getWindowPos: () => ipcRenderer.invoke('get-window-pos'),

  // Click-through toggle (pass-through transparent areas)
  setIgnoreMouseEvents: (ignore: boolean, options?: { forward: boolean }) =>
    ipcRenderer.send('set-ignore-mouse-events', { ignore, options }),

  // System events from main → renderer
  onSystemEvent: (callback: (event: SystemEvent) => void) => {
    ipcRenderer.on('system-event', (_e, data: SystemEvent) => callback(data));
    return () => ipcRenderer.removeAllListeners('system-event');
  },

  // Pet state → main (for persistence)
  savePetState: (state: unknown) => ipcRenderer.send('save-pet-state', state),
  loadPetState: () => ipcRenderer.invoke('load-pet-state'),
});

export interface SystemEvent {
  type: 'cpu-high' | 'cpu-normal' | 'battery-low' | 'no-network' | 'time-of-day';
  payload?: unknown;
}
