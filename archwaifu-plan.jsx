import { useState } from "react";

const phases = [
  {
    id: 1,
    title: "Foundation",
    subtitle: "Core Window + Sprite Engine",
    duration: "~2 Wochen",
    priority: "CRITICAL",
    color: "#ff4444",
    tasks: [
      {
        name: "Transparent Frameless Window",
        desc: "Electron BrowserWindow mit transparent:true, frame:false, alwaysOnTop:true. Click-through auf transparente Bereiche.",
        tech: "Electron + TypeScript",
        done: false,
      },
      {
        name: "Sprite Rendering Engine",
        desc: "Canvas-basiert oder CSS sprite sheets. Idle, Walk, Eat, Sleep, Talk Animationen. State machine für Übergänge.",
        tech: "HTML5 Canvas / PixiJS",
        done: false,
      },
      {
        name: "Desktop Dragging",
        desc: "Pet per Maus ziehen, edge-snapping an Bildschirmränder, Gravitation (fällt auf Taskbar/Panel).",
        tech: "Electron IPC + mouse events",
        done: false,
      },
      {
        name: "System Tray Integration",
        desc: "Tray icon mit Rechtsklick-Menü: Show/Hide, Settings, Quit. Autostart optional.",
        tech: "Electron Tray API",
        done: false,
      },
    ],
  },
  {
    id: 2,
    title: "Persönlichkeit",
    subtitle: "Stats, Bedürfnisse & Interaktionen",
    duration: "~2 Wochen",
    priority: "HIGH",
    color: "#ff8800",
    tasks: [
      {
        name: "Tamagotchi Stats System",
        desc: "Hunger, Happiness, Energy, Cleanliness — decay über Zeit. Persistenz in JSON/SQLite.",
        tech: "TypeScript + electron-store",
        done: false,
      },
      {
        name: "Feeding System",
        desc: "Items spawnen auf Desktop (Banane, Onigiri, Ramen). Pet läuft hin und isst mit Animation. Verschiedene Foods = verschiedene Stat-Boosts.",
        tech: "Sprite animation + collision",
        done: false,
      },
      {
        name: "Speech Bubbles",
        desc: "Random Bubbles: 'uwu~', 'notice me senpai', Arch-spezifisch: 'btw I use arch', 'pacman -Syu pls'. Bubble verschwindet nach 3-5s.",
        tech: "CSS popup + timer",
        done: false,
      },
      {
        name: "Mood System",
        desc: "Pet Expression ändert sich basierend auf Stats. Sad wenn hungry, energetic wenn happy, sleepy bei low energy. Beeinflusst Sprite + Bubble frequency.",
        tech: "State machine",
        done: false,
      },
    ],
  },
  {
    id: 3,
    title: "System-Awareness",
    subtitle: "OS-Integration & Reaktionen",
    duration: "~2 Wochen",
    priority: "HIGH",
    color: "#ffcc00",
    tasks: [
      {
        name: "CPU/RAM Monitoring",
        desc: "Pet reagiert auf System Load. Hohe CPU → schwitzt/panikt. Low RAM → 'es wird eng hier'. Idle → schläft ein.",
        tech: "os module / systeminformation",
        done: false,
      },
      {
        name: "Time-of-Day Awareness",
        desc: "Morgens: gähnt, streckt sich. Nachts: Schlafmütze, dunkler Hintergrund. Mitternacht: spooky mode.",
        tech: "Date API + cron-like checks",
        done: false,
      },
      {
        name: "Notification Reactions",
        desc: "Reagiert auf System-Notifications (Linux: dbus-monitor). Erschreckt sich, schaut neugierig, kommentiert.",
        tech: "dbus / PowerShell events",
        done: false,
      },
      {
        name: "Battery & Network",
        desc: "Laptop: Warnt bei low battery. Kein Internet → weint. VPN an → Hacker-Brille auf.",
        tech: "systeminformation + polling",
        done: false,
      },
    ],
  },
  {
    id: 4,
    title: "Leveling & Progression",
    subtitle: "XP, Skills & Evolution",
    duration: "~3 Wochen",
    priority: "MEDIUM",
    color: "#44cc44",
    tasks: [
      {
        name: "XP & Level System",
        desc: "XP durch Interaktion, Füttern, tägliches Login. Level 1-100. Jedes Level schaltet was frei. Level-up Animation + Partikeleffekte.",
        tech: "Game logic + persistence",
        done: false,
      },
      {
        name: "Skill Tree / Tricks",
        desc: "Pet lernt über Zeit: Dance, Sing, Flip, Hide, Cosplay wechseln. Freigeschaltet bei bestimmten Levels. User wählt welche Skills als nächstes.",
        tech: "Skill tree UI + unlock logic",
        done: false,
      },
      {
        name: "Evolution / Outfits",
        desc: "Bei Milestones: neuer Look (Casual → School → Maid → Cyberpunk → etc). Oder User-wählbar aus Garderobe.",
        tech: "Sprite sheet swapping",
        done: false,
      },
      {
        name: "Achievements",
        desc: "'Fed 100 times', 'Survived 7 days', 'Saw 99% CPU', 'Night Owl' (3AM usage). Badges in Settings-Panel.",
        tech: "Achievement tracker + UI",
        done: false,
      },
    ],
  },
  {
    id: 5,
    title: "Polish & Release",
    subtitle: "Settings, Packaging & Marketing",
    duration: "~2 Wochen",
    priority: "MEDIUM",
    color: "#4488ff",
    tasks: [
      {
        name: "Settings Panel",
        desc: "Character-Auswahl, Sprite-Pack selection, Sound on/off, Autostart, Always-on-top toggle, NSFW toggle, Opacity slider.",
        tech: "React settings UI",
        done: false,
      },
      {
        name: "Linux Packaging",
        desc: "AUR Package (PKGBUILD), AppImage, .deb. Priorität: AUR weil Arch-community. `yay -S archwaifu`.",
        tech: "electron-builder + PKGBUILD",
        done: false,
      },
      {
        name: "Windows Build",
        desc: "NSIS installer oder portable .exe. Auto-updater via electron-updater. Windows-spezifische Taskbar integration.",
        tech: "electron-builder win target",
        done: false,
      },
      {
        name: "README & Marketing",
        desc: "Killer GIF/Video Demo. Feature list. Installation guide. Screenshots. /r/unixporn post vorbereiten. Anime-style banner.",
        tech: "ffmpeg screen recording",
        done: false,
      },
    ],
  },
  {
    id: 6,
    title: "NSFW Edition",
    subtitle: "Separate Build & Distribution",
    duration: "~2 Wochen",
    priority: "LOW (Post-Launch)",
    color: "#cc44cc",
    tasks: [
      {
        name: "Content Separation",
        desc: "NSFW Sprites als separates Asset-Pack. Niemals im Main Repo. Eigenes Repo oder Download-Link. Age verification gate.",
        tech: "Asset loading system",
        done: false,
      },
      {
        name: "Additional Interactions",
        desc: "Headpat, Poke, etc. mit NSFW Reaktionen. Affection-Meter der bestimmte Szenen freischaltet.",
        tech: "Extended interaction system",
        done: false,
      },
      {
        name: "Distribution Strategy",
        desc: "Itch.io für NSFW Version (erlaubt adult content). Patreon/Ko-fi für early access. GitHub bleibt SFW only.",
        tech: "Itch.io + payment integration",
        done: false,
      },
      {
        name: "Monetarisierung",
        desc: "SFW = Free & Open Source (Stars!). NSFW = Paid sprite packs (5-15€). Premium outfits. Community sprites marketplace later.",
        tech: "Business model",
        done: false,
      },
    ],
  },
];

const techStack = {
  core: [
    { name: "Electron", role: "Desktop Window (transparent, frameless, cross-platform)", why: "Du kennst TS, cross-platform out of the box" },
    { name: "TypeScript", role: "Gesamte App-Logik", why: "Deine Stärke, type-safety für game state" },
    { name: "PixiJS", role: "Sprite Rendering & Animation", why: "WebGL-beschleunigt, perfekt für 2D sprites" },
    { name: "React", role: "Settings Panel & UI Overlays", why: "Kennst du von zeronyx" },
  ],
  system: [
    { name: "systeminformation", role: "CPU, RAM, Battery, Network stats", why: "Cross-platform node module" },
    { name: "electron-store", role: "Persistente Daten (Stats, Level, Settings)", why: "Simple JSON persistence" },
    { name: "node-cron", role: "Scheduled checks (stat decay, time events)", why: "Lightweight timer" },
  ],
  packaging: [
    { name: "electron-builder", role: "AppImage, .deb, AUR, .exe builds", why: "Standard für Electron distribution" },
    { name: "electron-updater", role: "Auto-updates", why: "Seamless update experience" },
  ],
};

const starStrategy = [
  { action: "/r/unixporn Post", impact: "★★★★★", detail: "GIF/Video von Pet auf deinem Rice. Beste single source für Stars. Timing: Wochenende morgens US-Zeit." },
  { action: "/r/linuxmasterrace", impact: "★★★★", detail: "Crosspost oder eigener Post. Meme-Faktor hoch ('I made an anime girl for my Arch desktop')." },
  { action: "Twitter/X Post", impact: "★★★", detail: "Video clip, tag #linux #archlinux #opensource. Anime-community ist da aktiv." },
  { action: "Hacker News", impact: "★★★★", detail: "Show HN post. Kann viral gehen, aber hit-or-miss. Technischen Aspekt betonen." },
  { action: "AUR Package", impact: "★★★★", detail: "`yay -S archwaifu` → niedrige Einstiegshürde → mehr User → mehr Stars." },
  { action: "Awesome-Lists PRs", impact: "★★", detail: "awesome-electron, awesome-linux-software. Langzeit-Traffic." },
];

export default function ArchWaifuPlan() {
  const [activePhase, setActivePhase] = useState(0);
  const [activeTab, setActiveTab] = useState("phases");
  const [expandedTask, setExpandedTask] = useState(null);

  const tabs = [
    { id: "phases", label: "Phasen", icon: "📋" },
    { id: "tech", label: "Tech Stack", icon: "⚡" },
    { id: "stars", label: "Star Strategy", icon: "⭐" },
    { id: "architecture", label: "Architektur", icon: "🏗️" },
  ];

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      background: "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #1a0a2e 100%)",
      color: "#e6edf3",
      minHeight: "100vh",
      padding: "24px",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🐧💜</div>
        <h1 style={{
          fontSize: 36,
          fontWeight: 800,
          background: "linear-gradient(90deg, #ff6b9d, #c084fc, #60a5fa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: 0,
          letterSpacing: -1,
        }}>
          ArchWaifu
        </h1>
        <p style={{ color: "#8b949e", fontSize: 14, margin: "8px 0 0" }}>
          Desktop Pet für Arch Linux — Anime Tamagotchi mit System-Awareness
        </p>
        <div style={{
          display: "inline-flex",
          gap: 8,
          marginTop: 12,
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          {["Electron", "TypeScript", "PixiJS", "Linux-first", "Cross-platform"].map(t => (
            <span key={t} style={{
              padding: "4px 10px",
              borderRadius: 4,
              background: "rgba(192,132,252,0.15)",
              color: "#c084fc",
              fontSize: 11,
              border: "1px solid rgba(192,132,252,0.3)",
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: 4,
        marginBottom: 24,
        background: "rgba(255,255,255,0.03)",
        borderRadius: 8,
        padding: 4,
        flexWrap: "wrap",
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              minWidth: 100,
              padding: "10px 16px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              transition: "all 0.2s",
              background: activeTab === tab.id ? "rgba(192,132,252,0.2)" : "transparent",
              color: activeTab === tab.id ? "#c084fc" : "#8b949e",
              borderBottom: activeTab === tab.id ? "2px solid #c084fc" : "2px solid transparent",
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* PHASES TAB */}
      {activeTab === "phases" && (
        <div>
          {/* Phase Timeline */}
          <div style={{
            display: "flex",
            gap: 4,
            marginBottom: 24,
            overflowX: "auto",
            padding: "4px 0",
          }}>
            {phases.map((phase, i) => (
              <button
                key={phase.id}
                onClick={() => { setActivePhase(i); setExpandedTask(null); }}
                style={{
                  flex: 1,
                  minWidth: 80,
                  padding: "12px 8px",
                  borderRadius: 8,
                  border: activePhase === i ? `2px solid ${phase.color}` : "2px solid rgba(255,255,255,0.06)",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  background: activePhase === i ? `${phase.color}15` : "rgba(255,255,255,0.02)",
                  color: activePhase === i ? phase.color : "#8b949e",
                  transition: "all 0.2s",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 4 }}>
                  {["🏗️", "💬", "🖥️", "📈", "🚀", "🔞"][i]}
                </div>
                <div>Phase {phase.id}</div>
                <div style={{ fontSize: 9, opacity: 0.7, marginTop: 2 }}>{phase.duration}</div>
              </button>
            ))}
          </div>

          {/* Active Phase Detail */}
          {(() => {
            const phase = phases[activePhase];
            return (
              <div style={{
                background: "rgba(255,255,255,0.03)",
                borderRadius: 12,
                border: `1px solid ${phase.color}30`,
                overflow: "hidden",
              }}>
                <div style={{
                  padding: "20px 24px",
                  borderBottom: `1px solid ${phase.color}20`,
                  background: `${phase.color}08`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: 22, color: phase.color }}>
                        Phase {phase.id}: {phase.title}
                      </h2>
                      <p style={{ margin: "4px 0 0", color: "#8b949e", fontSize: 13 }}>
                        {phase.subtitle}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{
                        padding: "4px 10px",
                        borderRadius: 4,
                        background: `${phase.color}20`,
                        color: phase.color,
                        fontSize: 11,
                        fontWeight: 700,
                      }}>{phase.priority}</span>
                      <span style={{
                        padding: "4px 10px",
                        borderRadius: 4,
                        background: "rgba(255,255,255,0.05)",
                        color: "#8b949e",
                        fontSize: 11,
                      }}>{phase.duration}</span>
                    </div>
                  </div>
                </div>

                <div style={{ padding: 16 }}>
                  {phase.tasks.map((task, ti) => (
                    <div
                      key={ti}
                      onClick={() => setExpandedTask(expandedTask === `${activePhase}-${ti}` ? null : `${activePhase}-${ti}`)}
                      style={{
                        padding: "14px 16px",
                        marginBottom: 8,
                        borderRadius: 8,
                        background: expandedTask === `${activePhase}-${ti}` ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            border: `2px solid ${phase.color}50`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                            flexShrink: 0,
                          }}>
                            {ti + 1}
                          </span>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{task.name}</span>
                        </div>
                        <span style={{
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: "rgba(96,165,250,0.1)",
                          color: "#60a5fa",
                          fontSize: 10,
                          fontFamily: "inherit",
                          whiteSpace: "nowrap",
                        }}>{task.tech}</span>
                      </div>
                      {expandedTask === `${activePhase}-${ti}` && (
                        <div style={{
                          marginTop: 12,
                          paddingTop: 12,
                          borderTop: "1px solid rgba(255,255,255,0.06)",
                          color: "#8b949e",
                          fontSize: 13,
                          lineHeight: 1.6,
                        }}>
                          {task.desc}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TECH STACK TAB */}
      {activeTab === "tech" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {Object.entries(techStack).map(([category, items]) => (
            <div key={category} style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}>
              <div style={{
                padding: "14px 20px",
                background: "rgba(255,255,255,0.03)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                fontWeight: 700,
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#c084fc",
              }}>
                {category === "core" ? "⚡ Core" : category === "system" ? "🖥️ System Integration" : "📦 Packaging"}
              </div>
              <div style={{ padding: 16 }}>
                {items.map((item, i) => (
                  <div key={i} style={{
                    padding: "12px 14px",
                    marginBottom: i < items.length - 1 ? 8 : 0,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#60a5fa" }}>{item.name}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#e6edf3", marginBottom: 4 }}>{item.role}</div>
                    <div style={{ fontSize: 11, color: "#8b949e", fontStyle: "italic" }}>→ {item.why}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{
            background: "rgba(255,107,157,0.08)",
            borderRadius: 12,
            border: "1px solid rgba(255,107,157,0.2)",
            padding: 20,
          }}>
            <div style={{ fontWeight: 700, color: "#ff6b9d", marginBottom: 8, fontSize: 14 }}>
              🎨 Sprites — Woher?
            </div>
            <div style={{ fontSize: 13, color: "#8b949e", lineHeight: 1.7 }}>
              <strong style={{ color: "#e6edf3" }}>Option A:</strong> itch.io — free-to-use sprite packs (z.B. "anime girl sprite sheet"). CC0/CC-BY Lizenzen checken.
              <br/>
              <strong style={{ color: "#e6edf3" }}>Option B:</strong> Fiverr/Pixiv Commission — Custom Character für ~50-150€. Einzigartiger Look = besseres Branding.
              <br/>
              <strong style={{ color: "#e6edf3" }}>Option C:</strong> AI-Generated + Cleanup — Basis mit Stable Diffusion generieren, dann manuell zu Sprite Sheets verarbeiten.
              <br/>
              <strong style={{ color: "#e6edf3" }}>Empfehlung:</strong> Start mit itch.io Free Sprites als Prototyp, Custom Commission für v1.0 Release.
            </div>
          </div>
        </div>
      )}

      {/* STAR STRATEGY TAB */}
      {activeTab === "stars" && (
        <div>
          <div style={{
            background: "rgba(255,204,0,0.08)",
            borderRadius: 12,
            border: "1px solid rgba(255,204,0,0.2)",
            padding: 20,
            marginBottom: 20,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 32 }}>⭐</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#ffcc00", marginTop: 4 }}>
              Target: 500-1000+ Stars
            </div>
            <div style={{ color: "#8b949e", fontSize: 13, marginTop: 4 }}>
              Realistisch mit guter Execution + Community-Posts
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {starStrategy.map((s, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.03)",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "16px 20px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "#e6edf3" }}>{s.action}</span>
                  <span style={{ color: "#ffcc00", fontSize: 14, letterSpacing: -1 }}>{s.impact}</span>
                </div>
                <div style={{ fontSize: 12, color: "#8b949e", lineHeight: 1.6 }}>{s.detail}</div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 20,
            background: "rgba(192,132,252,0.08)",
            borderRadius: 12,
            border: "1px solid rgba(192,132,252,0.2)",
            padding: 20,
          }}>
            <div style={{ fontWeight: 700, color: "#c084fc", marginBottom: 10, fontSize: 14 }}>
              💰 Monetarisierung
            </div>
            <div style={{ fontSize: 13, color: "#8b949e", lineHeight: 1.8 }}>
              <strong style={{ color: "#e6edf3" }}>SFW Version:</strong> Free & Open Source auf GitHub → Stars, Community, Portfolio
              <br/>
              <strong style={{ color: "#e6edf3" }}>NSFW Sprite Packs:</strong> 5-15€ auf itch.io → passives Einkommen
              <br/>
              <strong style={{ color: "#e6edf3" }}>Premium Outfits:</strong> 2-5€ pro Pack → Cosmetics sind proven revenue
              <br/>
              <strong style={{ color: "#e6edf3" }}>Patreon:</strong> Early access zu neuen Chars/Features → recurring revenue
              <br/>
              <strong style={{ color: "#e6edf3" }}>Später:</strong> Community Sprite Marketplace mit Revenue Share
            </div>
          </div>
        </div>
      )}

      {/* ARCHITECTURE TAB */}
      {activeTab === "architecture" && (
        <div>
          <div style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.06)",
            padding: 24,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            lineHeight: 1.8,
            color: "#8b949e",
            overflowX: "auto",
          }}>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{`archwaifu/
├── src/
│   ├── main/                    # Electron Main Process
│   │   ├── main.ts              # App entry, window creation
│   │   ├── tray.ts              # System tray integration
│   │   ├── system-monitor.ts    # CPU/RAM/Battery polling
│   │   └── ipc-handlers.ts      # Main ↔ Renderer IPC
│   │
│   ├── renderer/                # Electron Renderer (Pet Window)
│   │   ├── pet/
│   │   │   ├── PetCanvas.ts     # PixiJS sprite rendering
│   │   │   ├── StateMachine.ts  # idle→walk→eat→sleep transitions
│   │   │   ├── SpriteManager.ts # Load & animate sprite sheets
│   │   │   └── Physics.ts       # Gravity, edge-snap, dragging
│   │   │
│   │   ├── ui/
│   │   │   ├── SpeechBubble.tsx # Popup bubbles component
│   │   │   ├── FoodSpawner.tsx  # Desktop food items
│   │   │   └── LevelUpFX.tsx    # Particle effects
│   │   │
│   │   └── settings/            # Settings Window (React)
│   │       ├── SettingsApp.tsx
│   │       ├── CharacterSelect.tsx
│   │       └── StatsPanel.tsx
│   │
│   ├── core/                    # Shared Game Logic
│   │   ├── stats.ts             # Hunger, Happiness, Energy
│   │   ├── leveling.ts          # XP, levels, unlocks
│   │   ├── achievements.ts      # Achievement tracking
│   │   ├── personality.ts       # Mood, bubble text selection
│   │   └── persistence.ts       # Save/Load (electron-store)
│   │
│   └── assets/
│       ├── sprites/
│       │   ├── sfw/             # Default sprite sheets
│       │   └── packs/           # Additional sprite packs
│       ├── sounds/              # Optional SFX
│       └── bubbles.json         # Speech bubble text database
│
├── packages/
│   └── nsfw-pack/               # SEPARATE package, NOT in main repo
│       ├── sprites/
│       └── manifest.json
│
├── electron-builder.yml         # Build config (AppImage, deb, exe)
├── PKGBUILD                     # AUR package definition
├── package.json
└── tsconfig.json`}</pre>
          </div>

          <div style={{
            marginTop: 20,
            background: "rgba(96,165,250,0.08)",
            borderRadius: 12,
            border: "1px solid rgba(96,165,250,0.2)",
            padding: 20,
          }}>
            <div style={{ fontWeight: 700, color: "#60a5fa", marginBottom: 10, fontSize: 14 }}>
              🔑 Architektur-Entscheidungen
            </div>
            <div style={{ fontSize: 13, color: "#8b949e", lineHeight: 1.8 }}>
              <strong style={{ color: "#e6edf3" }}>Electron statt Native:</strong> Cross-platform sofort, du kennst TS, RAM-Nachteil akzeptabel für ein Pet (~80-120MB). Tauri wäre leichter (~15MB) aber Rust learning curve.
              <br/><br/>
              <strong style={{ color: "#e6edf3" }}>PixiJS statt Canvas2D:</strong> WebGL-beschleunigt, built-in Sprite Sheet support, Partikeleffekte, deutlich performanter für Animationen.
              <br/><br/>
              <strong style={{ color: "#e6edf3" }}>State Machine Pattern:</strong> Jede Animation ist ein State (Idle, Walking, Eating, Sleeping, Excited). Transitions basierend auf Stats + System Events. Saubere Trennung von Logic und Rendering.
              <br/><br/>
              <strong style={{ color: "#e6edf3" }}>NSFW als separates Package:</strong> Main Repo bleibt 100% SFW. NSFW Sprites werden als externes Asset-Pack geladen. Schützt das GitHub Repo und ermöglicht separate Monetarisierung.
              <br/><br/>
              <strong style={{ color: "#e6edf3" }}>Alternative: Tauri (Rust):</strong> Falls du nach AP2 Rust lernen willst — Tauri wäre das deutlich elegantere Framework. ~15MB statt ~120MB, native Performance. Aber höhere Einstiegshürde.
            </div>
          </div>

          <div style={{
            marginTop: 20,
            background: "rgba(68,204,68,0.08)",
            borderRadius: 12,
            border: "1px solid rgba(68,204,68,0.2)",
            padding: 20,
          }}>
            <div style={{ fontWeight: 700, color: "#44cc44", marginBottom: 10, fontSize: 14 }}>
              📅 Timeline (Post-AP2)
            </div>
            <div style={{ fontSize: 13, color: "#8b949e", lineHeight: 1.8 }}>
              <strong style={{ color: "#e6edf3" }}>August 2026:</strong> Phase 1+2 — Grundgerüst + Persönlichkeit (~4 Wochen)
              <br/>
              <strong style={{ color: "#e6edf3" }}>September 2026:</strong> Phase 3+4 — System-Awareness + Leveling (~5 Wochen)
              <br/>
              <strong style={{ color: "#e6edf3" }}>Oktober 2026:</strong> Phase 5 — Polish, AUR Package, README + erster /r/unixporn Post
              <br/>
              <strong style={{ color: "#e6edf3" }}>November+ 2026:</strong> Phase 6 — NSFW Edition, Community feedback, Iteration
              <br/><br/>
              <span style={{ color: "#44cc44" }}>→ Parallel zur Jobsuche machbar als Side Project, ~10-15h/Woche</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: 32,
        paddingTop: 16,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        textAlign: "center",
        color: "#484f58",
        fontSize: 11,
      }}>
        ArchWaifu Project Plan — RainyRoot — Post-AP2 2026
      </div>
    </div>
  );
}
