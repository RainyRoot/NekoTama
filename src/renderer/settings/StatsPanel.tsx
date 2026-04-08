import React from 'react';
import { ACHIEVEMENTS } from '../../core/achievements';
import { xpProgressInLevel } from '../../core/leveling';
import type { PersistedState } from '../../core/persistence';

interface Props {
  petState: PersistedState | null;
}

const STAT_DEFS = [
  { key: 'hunger'     as const, label: 'Hunger',      color: 'var(--hunger)'    },
  { key: 'happiness'  as const, label: 'Happiness',   color: 'var(--happiness)' },
  { key: 'energy'     as const, label: 'Energy',      color: 'var(--energy)'    },
  { key: 'cleanliness'as const, label: 'Cleanliness', color: 'var(--clean)'     },
];

const ACHIEVEMENT_ICONS: Record<string, string> = {
  fed_10:    '🍙',
  fed_100:   '🍱',
  pet_50:    '✋',
  day_7:     '📅',
  cpu_99:    '🔥',
  night_owl: '🦉',
  level_5:   '⭐',
  level_10:  '🌟',
};

export function StatsPanel({ petState }: Props) {
  if (!petState) {
    return <p style={{ color: 'var(--muted)', marginTop: 24, textAlign: 'center' }}>Loading stats...</p>;
  }

  const { stats, xp, level, achievements } = petState;
  const xpProgress = xpProgressInLevel(xp);
  const unlockedIds = new Set(achievements.filter((a) => a.unlockedAt).map((a) => a.id));

  return (
    <>
      {/* Stat bars */}
      {STAT_DEFS.map(({ key, label, color }) => (
        <div className="stat-row" key={key}>
          <div className="stat-label">
            <span>{label}</span>
            <span>{Math.round(stats[key])}/100</span>
          </div>
          <div className="stat-bar-bg">
            <div className="stat-bar-fill" style={{ width: `${stats[key]}%`, background: color }} />
          </div>
        </div>
      ))}

      {/* XP / Level */}
      <div className="xp-section">
        <div className="xp-header">
          <span className="xp-level">Level {level}</span>
          <span style={{ color: 'var(--muted)', fontSize: 11 }}>{xpProgress} / 100 XP</span>
        </div>
        <div className="xp-progress-bg">
          <div className="xp-progress-fill" style={{ width: `${xpProgress}%` }} />
        </div>
      </div>

      {/* Achievements */}
      <div className="section-title">Achievements</div>
      <div className="achievement-list">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = unlockedIds.has(a.id);
          return (
            <div className={`achievement-item ${unlocked ? '' : 'locked'}`} key={a.id}>
              <div className="achievement-icon">{ACHIEVEMENT_ICONS[a.id] ?? '🏆'}</div>
              <div>
                <div className="achievement-name">{a.name}</div>
                <div className="achievement-desc">{a.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
