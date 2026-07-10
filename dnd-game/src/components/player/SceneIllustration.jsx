import { useMemo } from 'react';

/* ──────────────────────────────────────────
   Fire Sparks — small particles rising above the campfire
   ────────────────────────────────────────── */
function FireSparks() {
  const sparks = useMemo(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: 38 + Math.random() * 24,
      delay: Math.random() * 4,
      duration: 1.5 + Math.random() * 2.5,
      size: 1 + Math.random() * 2.5,
      color: Math.random() > 0.4 ? '#f59e0b' : '#ef4444',
    })), []);

  return sparks.map(s => (
    <div key={s.id} className="absolute rounded-full"
      style={{
        left: `${s.left}%`, bottom: '28%',
        width: s.size, height: s.size,
        background: s.color,
        boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
        opacity: 0,
        animation: `spark-rise ${s.duration}s ${s.delay}s ease-out infinite`,
      }} />
  ));
}

/* ──────────────────────────────────────────
   Arcane Rune Ring — rotating circle of glyphs
   ────────────────────────────────────────── */
function RuneRing({ size, duration, reverse, color = '#a78bfa', glyphs }) {
  const symbols = glyphs || ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᛇ','ᛈ','ᛉ','ᛊ'];
  const radius = size / 2 - 14;

  return (
    <div className={reverse ? 'animate-arcane-rotate-reverse' : 'animate-arcane-rotate'}
      style={{
        width: size, height: size,
        position: 'absolute',
        animationDuration: `${duration}s`,
      }}>
      {/* Circle border */}
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0" style={{ width: size, height: size }}>
        <circle cx={size/2} cy={size/2} r={radius}
          fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.3"
          strokeDasharray="4 6" />
      </svg>
      {/* Glyph placements */}
      {symbols.map((glyph, i) => {
        const angle = (i / symbols.length) * Math.PI * 2 - Math.PI / 2;
        const x = size / 2 + Math.cos(angle) * radius;
        const y = size / 2 + Math.sin(angle) * radius;
        return (
          <span key={i} className="absolute text-center animate-rune-pulse"
            style={{
              left: x - 6, top: y - 7,
              fontSize: 11, color,
              animationDelay: `${i * 0.2}s`,
              transform: reverse ? `rotate(${(360 / symbols.length) * i}deg)` : 'none',
            }}>
            {glyph}
          </span>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────
   Floating Crystal — for arcane scene
   ────────────────────────────────────────── */
function FloatingCrystal({ left, delay, size = 12, color = '#a78bfa' }) {
  return (
    <div className="absolute animate-crystal-float"
      style={{ left, bottom: '40%', animationDelay: `${delay}s` }}>
      <svg width={size} height={size * 1.6} viewBox="0 0 12 20">
        <polygon points="6,0 12,12 6,20 0,12" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="0.8" />
        <polygon points="6,0 12,12 6,8" fill={color} fillOpacity="0.15" />
      </svg>
    </div>
  );
}

/* ──────────────────────────────────────────
   Shadow Tendril — for battle scene
   ────────────────────────────────────────── */
function ShadowTendril({ left, height, delay }) {
  return (
    <div className="absolute bottom-0 animate-tendril-sway"
      style={{
        left,
        width: 20 + Math.random() * 15,
        height: `${height}%`,
        animationDelay: `${delay}s`,
        background: `linear-gradient(to top, rgba(127, 29, 29, 0.3), rgba(127, 29, 29, 0.05), transparent)`,
        borderRadius: '50% 50% 0 0',
        filter: 'blur(3px)',
      }} />
  );
}

/* ══════════════════════════════════════════
   HEARTH SCENE — Mountain cave with campfire
   ══════════════════════════════════════════ */
function HearthScene() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Sky gradient */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, #1a0f0a 0%, #2d1810 40%, #3d2112 70%, #1c1917 100%)' }} />

      {/* Stars */}
      {[...Array(12)].map((_, i) => (
        <div key={i} className="absolute rounded-full bg-amber-200"
          style={{
            left: `${8 + Math.random() * 84}%`,
            top: `${5 + Math.random() * 25}%`,
            width: 1 + Math.random(),
            height: 1 + Math.random(),
            opacity: 0.2 + Math.random() * 0.3,
            animation: `rune-pulse ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite`,
          }} />
      ))}

      {/* Mountain silhouettes */}
      <svg className="absolute bottom-0 w-full" viewBox="0 0 400 120" preserveAspectRatio="none" style={{ height: '55%' }}>
        {/* Far mountains */}
        <polygon points="0,120 0,70 40,40 80,55 120,30 160,50 200,25 240,45 280,35 320,55 360,20 400,50 400,120"
          fill="#1a1210" />
        {/* Mid mountains */}
        <polygon points="0,120 0,80 50,55 100,70 150,45 200,65 250,50 300,70 350,40 400,65 400,120"
          fill="#231a15" />
        {/* Cave entrance */}
        <polygon points="120,120 120,60 160,45 200,40 240,45 280,60 280,120"
          fill="#0d0a08" />
        {/* Cave arch detail */}
        <path d="M 130,75 Q 200,25 270,75" fill="none" stroke="#3d2a1e" strokeWidth="1.5" strokeOpacity="0.4" />
        {/* Ground */}
        <rect x="0" y="95" width="400" height="25" fill="#151210" />
        {/* Rocks */}
        <ellipse cx="90" cy="105" rx="20" ry="8" fill="#1f1a16" />
        <ellipse cx="310" cy="108" rx="15" ry="6" fill="#1c1714" />
      </svg>

      {/* Campfire glow */}
      <div className="absolute animate-torch-flicker"
        style={{
          left: '50%', bottom: '22%',
          transform: 'translateX(-50%)',
          width: 140, height: 80,
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.25) 0%, rgba(239,68,68,0.1) 40%, transparent 70%)',
          borderRadius: '50%',
        }} />

      {/* Campfire SVG */}
      <svg className="absolute animate-glow" style={{ left: '50%', bottom: '18%', transform: 'translateX(-50%)', width: 40, height: 50 }}
        viewBox="0 0 40 50">
        {/* Logs */}
        <line x1="8" y1="45" x2="32" y2="40" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
        <line x1="10" y1="42" x2="30" y2="46" stroke="#713f12" strokeWidth="2.5" strokeLinecap="round" />
        {/* Flames */}
        <path d="M 20,5 Q 28,15 25,25 Q 30,20 27,30 Q 35,22 30,38 L 20,42 L 10,38 Q 5,22 13,30 Q 10,20 15,25 Q 12,15 20,5"
          fill="#f59e0b" fillOpacity="0.7">
          <animate attributeName="d" dur="0.8s" repeatCount="indefinite"
            values="M 20,5 Q 28,15 25,25 Q 30,20 27,30 Q 35,22 30,38 L 20,42 L 10,38 Q 5,22 13,30 Q 10,20 15,25 Q 12,15 20,5;
                    M 20,8 Q 26,14 24,22 Q 32,18 28,32 Q 34,24 30,38 L 20,43 L 10,38 Q 6,24 12,32 Q 8,18 16,22 Q 14,14 20,8;
                    M 20,5 Q 28,15 25,25 Q 30,20 27,30 Q 35,22 30,38 L 20,42 L 10,38 Q 5,22 13,30 Q 10,20 15,25 Q 12,15 20,5" />
        </path>
        <path d="M 20,15 Q 24,22 22,30 L 20,38 L 18,30 Q 16,22 20,15"
          fill="#fbbf24" fillOpacity="0.9">
          <animate attributeName="d" dur="0.6s" repeatCount="indefinite"
            values="M 20,15 Q 24,22 22,30 L 20,38 L 18,30 Q 16,22 20,15;
                    M 20,18 Q 23,24 21,32 L 20,39 L 19,32 Q 17,24 20,18;
                    M 20,15 Q 24,22 22,30 L 20,38 L 18,30 Q 16,22 20,15" />
        </path>
      </svg>

      {/* Rune carvings on cave walls */}
      {['ᚠ','ᚦ','ᚱ','ᛉ','ᛊ'].map((rune, i) => (
        <span key={i} className="absolute animate-rune-pulse text-amber-600"
          style={{
            left: `${25 + i * 12}%`,
            bottom: `${45 + (i % 3) * 5}%`,
            fontSize: 10, opacity: 0.4,
            animationDelay: `${i * 0.5}s`,
          }}>
          {rune}
        </span>
      ))}

      {/* Fire sparks */}
      <FireSparks />

      {/* Stalactites */}
      <svg className="absolute top-0 w-full" viewBox="0 0 400 30" preserveAspectRatio="none" style={{ height: '15%' }}>
        <polygon points="60,0 65,22 55,0" fill="#1a1412" />
        <polygon points="150,0 153,18 147,0" fill="#1a1412" />
        <polygon points="230,0 235,25 225,0" fill="#1a1412" />
        <polygon points="320,0 323,15 317,0" fill="#1a1412" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════
   ARCANE SCENE — Portal / Rune chamber
   ══════════════════════════════════════════ */
function ArcaneScene() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, #0c0520 0%, #120828 40%, #1a0a35 70%, #0f0520 100%)' }} />

      {/* Energy nebula */}
      <div className="absolute animate-fog-drift" style={{
        left: '20%', top: '10%', width: '60%', height: '60%',
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, rgba(79,70,229,0.05) 50%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(20px)',
      }} />

      {/* Central portal glow */}
      <div className="absolute"
        style={{
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 100, height: 100,
          background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(99,102,241,0.1) 40%, transparent 70%)',
          borderRadius: '50%',
          animation: 'rune-pulse 3s ease-in-out infinite',
        }} />

      {/* Rune rings */}
      <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <RuneRing size={160} duration={25} reverse={false} color="#a78bfa" />
      </div>
      <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <RuneRing size={110} duration={18} reverse={true} color="#818cf8"
          glyphs={['◇','△','○','☆','◇','△','○','☆']} />
      </div>
      <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <RuneRing size={60} duration={12} reverse={false} color="#c4b5fd"
          glyphs={['✦','✧','✦','✧','✦','✧']} />
      </div>

      {/* Energy beams */}
      {[20, 50, 80].map((left, i) => (
        <div key={i} className="absolute bottom-0 animate-energy-beam"
          style={{
            left: `${left}%`, width: 1,
            background: `linear-gradient(to top, rgba(139,92,246,0.3), transparent)`,
            animationDelay: `${i * 1}s`,
          }} />
      ))}

      {/* Floating crystals */}
      <FloatingCrystal left="15%" delay={0} size={10} color="#a78bfa" />
      <FloatingCrystal left="75%" delay={1.5} size={14} color="#818cf8" />
      <FloatingCrystal left="85%" delay={3} size={8} color="#c4b5fd" />
      <FloatingCrystal left="25%" delay={2} size={11} color="#8b5cf6" />

      {/* Particle dust */}
      {[...Array(20)].map((_, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 1 + Math.random() * 2,
            height: 1 + Math.random() * 2,
            background: Math.random() > 0.5 ? '#a78bfa' : '#818cf8',
            opacity: 0.1 + Math.random() * 0.3,
            animation: `crystal-float ${4 + Math.random() * 6}s ${Math.random() * 4}s ease-in-out infinite`,
          }} />
      ))}

      {/* Ground floor line */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)' }} />
    </div>
  );
}

/* ══════════════════════════════════════════
   BATTLE SCENE — Dark dungeon arena
   ══════════════════════════════════════════ */
function BattleScene() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, #1a0505 0%, #200808 30%, #150505 60%, #0d0303 100%)' }} />

      {/* Lightning flash overlay */}
      <div className="absolute inset-0 bg-red-200 animate-lightning-flash pointer-events-none" style={{ mixBlendMode: 'overlay' }} />

      {/* Torches on sides */}
      {[8, 92].map((left, i) => (
        <div key={i} className="absolute" style={{ left: `${left}%`, top: '15%' }}>
          {/* Torch bracket */}
          <svg width="16" height="50" viewBox="0 0 16 50">
            <rect x="6" y="15" width="4" height="35" fill="#44403c" rx="1" />
            <rect x="4" y="10" width="8" height="8" fill="#57534e" rx="1" />
          </svg>
          {/* Torch flame */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 animate-torch-flicker"
            style={{
              width: 14, height: 18,
              background: 'radial-gradient(ellipse at bottom, #fbbf24 0%, #f59e0b 30%, #ef4444 60%, transparent 100%)',
              borderRadius: '50% 50% 30% 30%',
              filter: 'blur(1px)',
              animationDelay: `${i * 0.7}s`,
            }} />
          {/* Torch glow */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-torch-flicker"
            style={{
              width: 60, height: 60,
              background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
              animationDelay: `${i * 0.7}s`,
            }} />
        </div>
      ))}

      {/* Stone floor tiles */}
      <svg className="absolute bottom-0 w-full" viewBox="0 0 400 50" preserveAspectRatio="none" style={{ height: '30%' }}>
        <rect width="400" height="50" fill="#1c1210" />
        {/* Tile lines */}
        <line x1="0" y1="5" x2="400" y2="5" stroke="#2a201a" strokeWidth="0.5" />
        <line x1="0" y1="25" x2="400" y2="25" stroke="#2a201a" strokeWidth="0.5" />
        {[50, 100, 150, 200, 250, 300, 350].map(x => (
          <line key={x} x1={x} y1="0" x2={x + 15} y2="50" stroke="#2a201a" strokeWidth="0.5" />
        ))}
        {/* Cracks */}
        <path d="M 120,5 L 125,15 L 118,25 L 130,35" fill="none" stroke="#0d0808" strokeWidth="0.8" />
        <path d="M 280,0 L 275,12 L 285,22" fill="none" stroke="#0d0808" strokeWidth="0.6" />
      </svg>

      {/* Shadow tendrils */}
      <ShadowTendril left="5%" height={35} delay={0} />
      <ShadowTendril left="18%" height={25} delay={1.2} />
      <ShadowTendril left="78%" height={30} delay={0.6} />
      <ShadowTendril left="90%" height={28} delay={1.8} />

      {/* Crimson fog */}
      <div className="absolute inset-0 animate-fog-drift pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 80%, rgba(127,29,29,0.15) 0%, transparent 60%)',
          animationDuration: '15s',
        }} />

      {/* Floating damage runes */}
      {['⚔','☠','⚡','🗡'].map((rune, i) => (
        <span key={i} className="absolute animate-rune-pulse"
          style={{
            left: `${20 + i * 20}%`,
            top: `${15 + (i % 2) * 15}%`,
            fontSize: 12, opacity: 0.15,
            animationDelay: `${i * 0.8}s`,
            filter: 'grayscale(1) brightness(0.6)',
          }}>
          {rune}
        </span>
      ))}

      {/* Arena center glow */}
      <div className="absolute"
        style={{
          left: '50%', bottom: '25%',
          transform: 'translateX(-50%)',
          width: 200, height: 40,
          background: 'radial-gradient(ellipse, rgba(185,28,28,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
    </div>
  );
}

/* ══════════════════════════════════════════
   CAMP SCENE — Sheltered rest point
   ══════════════════════════════════════════ */
function CampScene() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Night sky */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, #07030f 0%, #0e0820 40%, #140c28 70%, #0d0a18 100%)' }} />

      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <div key={i} className="absolute rounded-full bg-blue-100"
          style={{
            left: `${5 + Math.random() * 90}%`,
            top: `${3 + Math.random() * 40}%`,
            width: 1 + Math.random() * 1.5,
            height: 1 + Math.random() * 1.5,
            opacity: 0.3 + Math.random() * 0.4,
            animation: `rune-pulse ${2 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`,
          }} />
      ))}

      {/* Moon */}
      <div className="absolute" style={{ right: '12%', top: '8%', width: 28, height: 28,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #e2e8f0, #94a3b8)',
        boxShadow: '0 0 20px rgba(148,163,184,0.2)',
      }} />

      {/* Distant mountain silhouette */}
      <svg className="absolute bottom-0 w-full" viewBox="0 0 400 100" preserveAspectRatio="none" style={{ height: '50%' }}>
        <polygon points="0,100 0,60 60,30 120,50 180,20 240,45 300,30 360,55 400,35 400,100"
          fill="#0a0814" />
        <polygon points="0,100 0,75 70,55 140,70 210,50 280,68 350,52 400,65 400,100"
          fill="#0d0b1a" />
        <rect x="0" y="85" width="400" height="15" fill="#0a0816" />
      </svg>

      {/* Rest camp fire (smaller, gentler) */}
      <div className="absolute animate-torch-flicker"
        style={{
          left: '50%', bottom: '22%',
          transform: 'translateX(-50%)',
          width: 80, height: 60,
          background: 'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, rgba(99,102,241,0.05) 50%, transparent 70%)',
          borderRadius: '50%',
        }} />
      <svg className="absolute animate-glow" style={{ left: '50%', bottom: '18%', transform: 'translateX(-50%)', width: 28, height: 35 }}
        viewBox="0 0 28 35">
        <line x1="6" y1="32" x2="22" y2="29" stroke="#44403c" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="8" y1="30" x2="20" y2="33" stroke="#57534e" strokeWidth="2" strokeLinecap="round" />
        <path d="M 14,5 Q 20,12 18,20 Q 22,15 20,26 L 14,30 L 8,26 Q 6,15 10,20 Q 8,12 14,5"
          fill="#3b82f6" fillOpacity="0.5">
          <animate attributeName="d" dur="1.2s" repeatCount="indefinite"
            values="M 14,5 Q 20,12 18,20 Q 22,15 20,26 L 14,30 L 8,26 Q 6,15 10,20 Q 8,12 14,5;
                    M 14,8 Q 19,13 17,19 Q 21,16 19,27 L 14,31 L 9,27 Q 7,16 11,19 Q 9,13 14,8;
                    M 14,5 Q 20,12 18,20 Q 22,15 20,26 L 14,30 L 8,26 Q 6,15 10,20 Q 8,12 14,5" />
        </path>
      </svg>

      {/* Bedroll silhouettes */}
      {[35, 58, 68].map((left, i) => (
        <div key={i} className="absolute bottom-[18%]" style={{ left: `${left}%`, width: 20, height: 6,
          background: `rgba(${i === 0 ? '59,130,246' : i === 1 ? '99,102,241' : '139,92,246'},0.15)`,
          borderRadius: 4, border: '1px solid rgba(99,102,241,0.1)',
        }} />
      ))}

      {/* Soft ambient glow */}
      <div className="absolute inset-0 animate-fog-drift pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 70%, rgba(59,130,246,0.06) 0%, transparent 60%)',
          animationDuration: '20s',
        }} />
    </div>
  );
}

/* ══════════════════════════════════════════
   VOID SCENE — Far Realm rift energy
   ══════════════════════════════════════════ */
function VoidScene() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, #010108 0%, #050314 40%, #0a0520 70%, #030210 100%)' }} />

      {/* Central void rift */}
      <div className="absolute" style={{ left: '50%', top: '45%', transform: 'translate(-50%,-50%)',
        width: 80, height: 120,
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.4) 0%, rgba(79,70,229,0.2) 40%, transparent 70%)',
        borderRadius: '50%',
        animation: 'rune-pulse 2s ease-in-out infinite',
        filter: 'blur(2px)',
      }} />

      {/* Outer void glow rings */}
      {[140, 200, 260].map((size, i) => (
        <div key={i} className="absolute" style={{
          left: '50%', top: '45%',
          transform: 'translate(-50%,-50%)',
          width: size, height: size * 1.2,
          borderRadius: '50%',
          border: `1px solid rgba(99,102,241,${0.15 - i * 0.04})`,
          animation: `rune-pulse ${3 + i}s ease-in-out ${i * 0.5}s infinite`,
        }} />
      ))}

      {/* Floating void particles */}
      {[...Array(25)].map((_, i) => (
        <div key={i} className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 1 + Math.random() * 3,
            height: 1 + Math.random() * 3,
            background: Math.random() > 0.5 ? '#6366f1' : '#4f46e5',
            opacity: 0.1 + Math.random() * 0.5,
            animation: `crystal-float ${3 + Math.random() * 6}s ${Math.random() * 5}s ease-in-out infinite`,
          }} />
      ))}

      {/* Void tendrils from edges */}
      {['-5%', '90%', '40%'].map((left, i) => (
        <div key={i} className="absolute animate-tendril-sway" style={{
          left, bottom: 0,
          width: 30 + i * 10,
          height: `${25 + i * 8}%`,
          background: `linear-gradient(to top, rgba(67,56,202,0.25), transparent)`,
          borderRadius: '50% 50% 0 0',
          filter: 'blur(4px)',
          animationDelay: `${i * 0.8}s`,
        }} />
      ))}

      {/* Eldritch symbols */}
      {['𝕳','𝕴','𝕷','𝕯','ᚠ'].map((s, i) => (
        <span key={i} className="absolute animate-rune-pulse"
          style={{
            left: `${15 + i * 17}%`,
            top: `${20 + (i % 3) * 20}%`,
            fontSize: 11,
            color: '#6366f1',
            opacity: 0.2 + (i % 2) * 0.1,
            animationDelay: `${i * 0.4}s`,
          }}>{s}</span>
      ))}

      {/* Dark floor */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '20%',
        background: 'linear-gradient(to top, #010108, transparent)',
      }} />
    </div>
  );
}

/* ══════════════════════════════════════════
   DUNGEON SCENE — Ancient stone corridors
   ══════════════════════════════════════════ */
function DungeonScene() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, #0a0806 0%, #110e0b 40%, #160f0b 70%, #0d0907 100%)' }} />

      {/* Corridor perspective lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 180" preserveAspectRatio="none">
        {/* Left wall */}
        <polygon points="0,0 100,40 100,140 0,180" fill="#120d0a" />
        {/* Right wall */}
        <polygon points="400,0 300,40 300,140 400,180" fill="#120d0a" />
        {/* Ceiling */}
        <polygon points="0,0 400,0 300,40 100,40" fill="#0e0b08" />
        {/* Floor */}
        <polygon points="0,180 400,180 300,140 100,140" fill="#181210" />
        {/* Far wall */}
        <rect x="100" y="40" width="200" height="100" fill="#1a1310" />
        {/* Stone blocks on walls */}
        {[50,80,110].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={40 + (y/180)*100} stroke="#1f1510" strokeWidth="0.5" />
        ))}
        {[50,80,110].map(y => (
          <line key={y+200} x1="400" y1={y} x2="300" y2={40 + (y/180)*100} stroke="#1f1510" strokeWidth="0.5" />
        ))}
        {/* Far door arch */}
        <path d="M 160,140 Q 200,80 240,140" fill="none" stroke="#2a1f16" strokeWidth="2" />
        <rect x="165" y="100" width="70" height="40" fill="#0a0806" />
      </svg>

      {/* Iron wall sconces (Continual Flame) */}
      {[[80, 55], [320, 55]].map(([left, top], i) => (
        <div key={i} className="absolute" style={{ left, top }}>
          <div className="animate-torch-flicker" style={{
            width: 10, height: 12,
            background: 'radial-gradient(ellipse at bottom, #fbbf24 0%, #f59e0b 40%, #d97706 80%, transparent 100%)',
            borderRadius: '50% 50% 30% 30%',
            filter: 'blur(0.5px)',
            animationDelay: `${i * 0.9}s`,
          }} />
          <div className="animate-torch-flicker" style={{
            position: 'absolute', top: -8, left: -12,
            width: 34, height: 34,
            background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            animationDelay: `${i * 0.9}s`,
          }} />
        </div>
      ))}

      {/* Distant light through arch */}
      <div className="absolute" style={{
        left: '50%', top: '55%', transform: 'translate(-50%,-50%)',
        width: 60, height: 35,
        background: 'radial-gradient(ellipse, rgba(167,139,250,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'rune-pulse 4s ease-in-out infinite',
      }} />

      {/* Rune carvings */}
      {['ᚱ','ᛉ','ᚠ'].map((r, i) => (
        <span key={i} className="absolute animate-rune-pulse"
          style={{
            left: `${20 + i * 30}%`,
            top: `${30 + (i % 2) * 20}%`,
            fontSize: 9, color: '#78716c', opacity: 0.3,
            animationDelay: `${i * 0.7}s`,
          }}>{r}</span>
      ))}

      {/* Floor dust particles */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className="absolute rounded-full bg-stone-700"
          style={{
            left: `${10 + Math.random() * 80}%`,
            bottom: `${5 + Math.random() * 10}%`,
            width: 1 + Math.random(),
            height: 1 + Math.random(),
            opacity: 0.2,
          }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN EXPORT — SceneIllustration
   ══════════════════════════════════════════ */
export default function SceneIllustration({ visualType = 'hearth' }) {
  const scenes = {
    hearth: HearthScene,
    arcane: ArcaneScene,
    battle: BattleScene,
    camp: CampScene,
    void: VoidScene,
    dungeon: DungeonScene,
  };

  const SceneComponent = scenes[visualType] || scenes.hearth;

  const sceneConfig = {
    arcane:  { color: '#a78bfa', borderColor: 'rgba(139,92,246,0.2)', bg: 'rgba(139,92,246,0.08)', label: '✦ Arcane' },
    battle:  { color: '#f87171', borderColor: 'rgba(248,113,113,0.2)', bg: 'rgba(248,113,113,0.08)', label: '⚔ Battle' },
    hearth:  { color: '#fbbf24', borderColor: 'rgba(251,191,36,0.2)', bg: 'rgba(251,191,36,0.08)', label: '🔥 Hearth' },
    camp:    { color: '#60a5fa', borderColor: 'rgba(96,165,250,0.2)', bg: 'rgba(96,165,250,0.08)', label: '⛺ Rest' },
    void:    { color: '#818cf8', borderColor: 'rgba(129,140,248,0.2)', bg: 'rgba(129,140,248,0.08)', label: '👁 Void' },
    dungeon: { color: '#a8a29e', borderColor: 'rgba(168,162,158,0.2)', bg: 'rgba(168,162,158,0.08)', label: '🗝 Dungeon' },
  };
  const cfg = sceneConfig[visualType] || sceneConfig.hearth;

  return (
    <div className="relative w-full rounded-xl overflow-hidden animate-scene-fade-in"
      style={{ height: 180 }}
      key={visualType}>
      <SceneComponent />

      {/* Bottom fade to blend into text area */}
      <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
        style={{
          background: `linear-gradient(to top, rgba(28,25,23,0.95), transparent)`,
        }} />

      {/* Top decorative border */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${cfg.borderColor.replace('0.2)', '0.5)')}, transparent)` }} />

      {/* Scene label */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
        <span className="text-[9px] font-sans tracking-widest uppercase px-2 py-0.5 rounded-full border"
          style={{ color: cfg.color, borderColor: cfg.borderColor, background: cfg.bg }}>
          {cfg.label}
        </span>
      </div>
    </div>
  );
}
