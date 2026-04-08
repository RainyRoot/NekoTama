import React from 'react';

interface Pack {
  id: string;
  name: string;
  icon: string;
  status: 'active' | 'soon' | 'paid';
  label?: string;
}

const PACKS: Pack[] = [
  { id: 'default', name: 'NekoTama',   icon: '🐱', status: 'active' },
  { id: 'maid',    name: 'Maid Mode',  icon: '🎀', status: 'soon',  label: 'Coming soon' },
  { id: 'cyber',   name: 'Cyberpunk',  icon: '🤖', status: 'soon',  label: 'Coming soon' },
  { id: 'nsfw',    name: 'NSFW Pack',  icon: '🔞', status: 'paid',  label: 'itch.io' },
];

export function CharacterSelect() {
  return (
    <>
      <div className="character-card">
        <div className="character-avatar">🐱</div>
        <div className="character-name">NekoTama</div>
        <div className="character-sub">Default sprite pack · SFW</div>
      </div>

      <div className="section-title" style={{ marginTop: 20 }}>Available Packs</div>
      <div className="pack-grid">
        {PACKS.map((p) => (
          <div className="pack-card" key={p.id} style={{ opacity: p.status === 'active' ? 1 : 0.6 }}>
            <div className="pack-icon">{p.icon}</div>
            <div className="pack-name">{p.name}</div>
            <div>{p.label ?? 'Active'}</div>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 16, fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>
        Custom sprite packs can be placed in{' '}
        <code style={{ background: 'var(--surface2)', padding: '1px 4px', borderRadius: 3 }}>
          src/assets/sprites/packs/
        </code>
      </p>
    </>
  );
}
