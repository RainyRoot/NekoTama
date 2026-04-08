# NekoTama 🐱

> An anime desktop pet for Linux — Tamagotchi meets system monitor.

NekoTama sits on your desktop, reacts to your system (CPU spikes, battery, network drops, time of day), levels up as you interact with it, and keeps you company while you code.

---

## Features

- **Transparent, frameless window** — floats above everything, stays out of your way
- **Draggable** — pick it up and drop it anywhere; snaps to edges
- **Mood system** — hunger, happiness, energy, cleanliness all decay over time
- **Interactions** — double-click to feed, right-click to pet
- **System awareness** — reacts to high CPU, low RAM, no network, battery warnings, and time of day
- **Speech bubbles** — random lines based on current mood and system state
- **XP & leveling** — gain XP through interactions and daily logins; level-up particle burst
- **Achievements** — Snack Time, Night Owl, CPU Witness, and more
- **Settings window** — stats, character select, opacity/scale controls, autostart
- **System tray** — hide/show, open settings, quit
- **Persistent state** — stats, level, XP, and achievements survive restarts

---

## Installation

### Arch Linux (AUR)

```bash
yay -S nekotama
```

Or manually:

```bash
git clone https://aur.archlinux.org/nekotama.git
cd nekotama
makepkg -si
```

### AppImage / .deb

Download the latest release from [GitHub Releases](https://github.com/rainyroot/NekoTama/releases).

```bash
# AppImage
chmod +x NekoTama-*.AppImage
./NekoTama-*.AppImage

# .deb
sudo dpkg -i nekotama_*.deb
```

---

## Development

**Requirements:** Node.js 20+, npm

```bash
git clone https://github.com/rainyroot/NekoTama
cd NekoTama
npm install
npm run dev
```

This starts Vite (renderer hot reload) and Electron concurrently.

### Build

```bash
npm run build       # compile main + bundle renderer
npm run dist        # package as AppImage + .deb
```

### Project structure

```
src/
├── main/           # Electron main process
│   ├── main.ts         # window creation + app lifecycle
│   ├── preload.ts      # contextBridge API
│   ├── ipc-handlers.ts
│   ├── tray.ts
│   └── system-monitor.ts
├── renderer/
│   ├── pet/        # PixiJS pet canvas
│   │   ├── PetCanvas.ts
│   │   ├── StateMachine.ts
│   │   ├── SpriteManager.ts
│   │   ├── Physics.ts
│   │   └── SpeechBubble.ts
│   ├── ui/
│   │   └── LevelUpFX.ts
│   └── settings/   # React settings window
│       ├── SettingsApp.tsx
│       ├── StatsPanel.tsx
│       └── CharacterSelect.tsx
└── core/           # shared game logic
    ├── stats.ts
    ├── personality.ts
    ├── leveling.ts
    ├── achievements.ts
    └── persistence.ts
```

---

## Adding sprite packs

Place a spritesheet PNG in `src/assets/sprites/packs/your-pack-name.png`.
The expected format is a grid of 64×64 frames in this order:

| Row | Animation | Frames |
|-----|-----------|--------|
| 0   | idle      | 0–3    |
| 1   | walking   | 4–7    |
| 2   | eating    | 8–11   |
| 3   | sleeping  | 12–13  |
| 4   | excited   | 14–17  |
| 5   | sad       | 18–19  |
| 6   | panicking | 20–23  |

Alternatively, provide a PixiJS JSON spritesheet with animation keys prefixed `nekotama_`
(e.g. `nekotama_idle`, `nekotama_walking`).

---

## NSFW packs

NSFW sprite packs are distributed separately on [itch.io](https://itch.io) and are never
part of this repository.

---

## Tech stack

| Layer         | Technology        |
|---------------|-------------------|
| Window        | Electron          |
| Rendering     | PixiJS v8 (WebGL) |
| Settings UI   | React 18          |
| Game logic    | TypeScript        |
| Persistence   | electron-store    |
| System info   | systeminformation |
| Scheduling    | node-cron         |
| Bundler       | Vite              |
| Packaging     | electron-builder  |

---

## License

MIT
