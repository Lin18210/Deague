// Tooltip helper
export function clampToViewport(el) {
  const r = el.getBoundingClientRect();
  if (r.right  > window.innerWidth  - 8) el.style.left = 'auto';
  if (r.bottom > window.innerHeight - 8) el.style.top  = 'auto';
}
export function buildTooltip(text) {
  const d = document.createElement('div');
  d.className   = 'tooltip-popup';
  d.textContent = text;
  return d;
}
