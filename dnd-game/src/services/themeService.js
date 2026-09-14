/**
 * Atmospheric Theme Service
 * Supports multiple gothic & fantasy palettes: High Pass Onyx, Blood Moon Crimson, and Abyssal Azure.
 */

export const THEMES = [
  { id: 'onyx', name: 'High Pass Onyx', description: 'Frozen granite and ember gold', primary: '#f59e0b' },
  { id: 'blood_moon', name: 'Blood Moon', description: 'Crimson horror and scarlet dark', primary: '#ef4444' },
  { id: 'abyssal', name: 'Abyssal Void', description: 'Deep cosmic cyan and starry purple', primary: '#06b6d4' },
];

export function applyTheme(themeId) {
  document.documentElement.setAttribute('data-theme', themeId);
  try {
    localStorage.setItem('deague_theme', themeId);
  } catch {}
  return themeId;
}

export function getSavedTheme() {
  try {
    return localStorage.getItem('deague_theme') || 'onyx';
  } catch {
    return 'onyx';
  }
}
