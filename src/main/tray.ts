import { Tray, Menu, BrowserWindow, app, nativeImage } from 'electron';
import * as path from 'path';

let tray: Tray | null = null;

export function setupTray(petWindow: BrowserWindow): void {
  const iconPath = path.join(__dirname, '../../src/assets/tray-icon.png');
  // Fall back to empty image if icon not yet created
  const icon = nativeImage.createFromPath(iconPath).isEmpty()
    ? nativeImage.createEmpty()
    : nativeImage.createFromPath(iconPath);

  tray = new Tray(icon);
  tray.setToolTip('NekoTama');

  const buildMenu = () =>
    Menu.buildFromTemplate([
      {
        label: petWindow.isVisible() ? 'Hide Pet' : 'Show Pet',
        click: () => {
          if (petWindow.isVisible()) {
            petWindow.hide();
          } else {
            petWindow.show();
          }
          tray!.setContextMenu(buildMenu());
        },
      },
      { type: 'separator' },
      {
        label: 'Settings',
        click: () => {
          // TODO Phase 5: open settings window
        },
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => app.quit(),
      },
    ]);

  tray.setContextMenu(buildMenu());

  tray.on('click', () => {
    petWindow.isVisible() ? petWindow.hide() : petWindow.show();
    tray!.setContextMenu(buildMenu());
  });
}
