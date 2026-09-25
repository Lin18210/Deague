/**
 * Combat Particle & Floating Numbers VFX Engine
 * Dispatches particle bursts, spark showers, and floating combat text indicators.
 */

export function spawnCombatSparks(originX, originY, count = 12) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 2;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      decay: Math.random() * 0.04 + 0.02,
      color: Math.random() > 0.5 ? '#f59e0b' : '#ef4444',
      size: Math.random() * 3 + 1,
    });
  }
  return particles;
}
