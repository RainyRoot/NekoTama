import React from 'react';
import { createRoot } from 'react-dom/client';
import { SettingsApp } from './SettingsApp';
import './settings.css';

const root = document.getElementById('settings-root')!;
createRoot(root).render(<SettingsApp />);
