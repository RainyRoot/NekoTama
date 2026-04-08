import React, { useEffect, useState } from 'react';
import { StatsPanel } from './StatsPanel';
import { CharacterSelect } from './CharacterSelect';
import type { PersistedState, AppSettings, DEFAULT_SETTINGS } from '../../core/persistence';

declare const window: Window & {
  nekotama: {
    loadPetState:  () => Promise<unknown>;
    getSettings:   () => Promise<unknown>;
    saveSettings:  (s: unknown) => void;
    applySettings: (s: unknown) => void;
    getVersion:    () => Promise<string>;
  };
};

const FALLBACK_SETTINGS: AppSettings = {
  alwaysOnTop:  true,
  opacity:      1.0,
  scale:        1.0,
  soundEnabled: true,
  autostart:    false,
};

type Tab = 'stats' | 'character' | 'options';

export function SettingsApp() {
  const [tab,      setTab]      = useState<Tab>('stats');
  const [petState, setPetState] = useState<PersistedState | null>(null);
  const [settings, setSettings] = useState<AppSettings>(FALLBACK_SETTINGS);
  const [version,  setVersion]  = useState('0.1.0');

  useEffect(() => {
    window.nekotama.loadPetState().then((s) => setPetState(s as PersistedState | null));
    window.nekotama.getSettings().then((s) => {
      if (s) setSettings(s as AppSettings);
    });
    window.nekotama.getVersion().then(setVersion);
  }, []);

  function update(patch: Partial<AppSettings>) {
    const next = { ...settings, ...patch };
    setSettings(next);
    window.nekotama.saveSettings(next);
    window.nekotama.applySettings(next);
  }

  return (
    <>
      {/* Header */}
      <div className="header">
        <span style={{ fontSize: 28 }}>🐱</span>
        <div>
          <div className="header-title">NekoTama</div>
          <div className="header-version">v{version}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {(['stats', 'character', 'options'] as Tab[]).map((t) => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'stats' ? 'Stats' : t === 'character' ? 'Character' : 'Options'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="content">
        {tab === 'stats' && <StatsPanel petState={petState} />}

        {tab === 'character' && <CharacterSelect />}

        {tab === 'options' && (
          <>
            <Toggle
              label="Always on Top"
              desc="Keep the pet above all other windows"
              checked={settings.alwaysOnTop}
              onChange={(v) => update({ alwaysOnTop: v })}
            />
            <Toggle
              label="Sound Effects"
              desc="Play sounds for interactions (coming soon)"
              checked={settings.soundEnabled}
              onChange={(v) => update({ soundEnabled: v })}
            />
            <Toggle
              label="Autostart"
              desc="Launch NekoTama when you log in"
              checked={settings.autostart}
              onChange={(v) => update({ autostart: v })}
            />

            <SliderRow
              label="Opacity"
              value={settings.opacity}
              min={0.3}
              max={1.0}
              step={0.05}
              format={(v) => `${Math.round(v * 100)}%`}
              onChange={(v) => update({ opacity: v })}
            />
            <SliderRow
              label="Scale"
              value={settings.scale}
              min={0.5}
              max={2.0}
              step={0.1}
              format={(v) => `${v.toFixed(1)}x`}
              onChange={(v) => update({ scale: v })}
            />
          </>
        )}
      </div>
    </>
  );
}

/* ── Small reusable widgets ──────────────────────────────── */

function Toggle({
  label, desc, checked, onChange,
}: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="option-row">
      <div>
        <div className="option-label">{label}</div>
        <div className="option-desc">{desc}</div>
      </div>
      <label className="toggle">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="toggle-track" />
      </label>
    </div>
  );
}

function SliderRow({
  label, value, min, max, step, format, onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="slider-row">
      <div className="slider-header">
        <span>{label}</span>
        <span className="slider-value">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
