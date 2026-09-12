/**
 * Game Settings & Accessibility Service
 * Persists audio volume, text animation speed, screen shake, and theme preferences.
 */

const STORAGE_KEY = 'deague_game_settings';

export const DEFAULT_SETTINGS = {
  masterVolume: 80,
  sfxVolume: 85,
  musicVolume: 70,
  textSpeed: 'normal', // 'fast' | 'normal' | 'cinematic'
  screenShake: true,
  reducedMotion: false,
  highContrastText: false,
};

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
  return settings;
}
