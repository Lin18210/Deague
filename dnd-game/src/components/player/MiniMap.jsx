import { useMemo } from 'react';

/* ──────────────────────────────────────────
   Compass Rose SVG
   ────────────────────────────────────────── */
function CompassRose() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="animate-compass-spin" style={{ animationDuration: '90s' }}>
      {/* Outer ring */}
      <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(180,83,9,0.2)" strokeWidth="0.5" />
      {/* Cardinal points */}
      <polygon points="16,3 17.5,13 16,11 14.5,13" fill="#b45309" fillOpacity="0.6" />
      <polygon points="16,29 14.5,19 16,21 17.5,19" fill="#78350f" fillOpacity="0.4" />
      <polygon points="3,16 13,14.5 11,16 13,17.5" fill="#78350f" fillOpacity="0.4" />
      <polygon points="29,16 19,17.5 21,16 19,14.5" fill="#78350f" fillOpacity="0.4" />
      {/* Center dot */}
      <circle cx="16" cy="16" r="1.5" fill="#b45309" fillOpacity="0.5" />
      {/* Direction labels */}
      <text x="16" y="9" textAnchor="middle" fill="#b45309" fillOpacity="0.4" fontSize="3.5" fontFamily="serif">N</text>
    </svg>
  );
}

/* ──────────────────────────────────────────
   Map Node — individual location marker
   ────────────────────────────────────────── */
function MapNode({ x, y, label, isCurrent, isVisited, index }) {
  const nodeSize = isCurrent ? 8 : 6;

  return (
    <g>
      {/* Glow for current */}
      {isCurrent && (
        <circle cx={x} cy={y} r={14}
          fill="rgba(245,158,11,0.1)"
          className="animate-map-marker-pulse" />
      )}
      {/* Node circle */}
      <circle cx={x} cy={y} r={nodeSize}
        fill={isCurrent ? '#f59e0b' : isVisited ? '#78350f' : '#292524'}
        stroke={isCurrent ? '#fbbf24' : isVisited ? '#b45309' : '#44403c'}
        strokeWidth={isCurrent ? 1.5 : 0.8}
        fillOpacity={isCurrent ? 0.9 : isVisited ? 0.6 : 0.3}
      />
      {/* Inner dot */}
      {(isCurrent || isVisited) && (
        <circle cx={x} cy={y} r={2}
          fill={isCurrent ? '#fef3c7' : '#b45309'}
          fillOpacity={isCurrent ? 0.9 : 0.5}
        />
      )}
      {/* Label */}
      {(isCurrent || isVisited) && (
        <text x={x} y={y + nodeSize + 10}
          textAnchor="middle"
          fill={isCurrent ? '#fbbf24' : '#78350f'}
          fontSize="6"
          fontFamily="'Cinzel', serif"
          fillOpacity={isCurrent ? 0.9 : 0.5}>
          {label.length > 16 ? label.substring(0, 14) + '…' : label}
        </text>
      )}
      {/* Undiscovered marker */}
      {!isCurrent && !isVisited && (
        <text x={x} y={y + 3}
          textAnchor="middle"
          fill="#44403c"
          fontSize="6"
          fontFamily="serif">
          ?
        </text>
      )}
    </g>
  );
}

/* ──────────────────────────────────────────
   Path between nodes — dotted trail
   ────────────────────────────────────────── */
function MapPath({ x1, y1, x2, y2, isTraversed }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={isTraversed ? '#78350f' : '#292524'}
      strokeWidth={isTraversed ? 1 : 0.5}
      strokeDasharray={isTraversed ? '3 2' : '2 4'}
      strokeOpacity={isTraversed ? 0.5 : 0.2}
    />
  );
}

/* ══════════════════════════════════════════
   MAIN EXPORT — MiniMap
   ══════════════════════════════════════════ */
export default function MiniMap({ journal = [], currentTitle = '' }) {
  // Build location nodes from journal entries
  const locations = useMemo(() => {
    const locs = [];
    const seen = new Set();

    journal.forEach((entry) => {
      if (entry.title && !seen.has(entry.title)) {
        seen.add(entry.title);
        locs.push({ title: entry.title });
      }
    });

    // Add current if not in journal yet
    if (currentTitle && !seen.has(currentTitle)) {
      locs.push({ title: currentTitle });
    }

    return locs;
  }, [journal, currentTitle]);

  // Calculate node positions on a winding path
  const nodePositions = useMemo(() => {
    const positions = [];
    const mapW = 220;
    const mapH = 130;
    const padding = 25;
    const maxNodes = Math.max(locations.length, 5); // At least 5 slots

    for (let i = 0; i < maxNodes; i++) {
      const progress = i / (maxNodes - 1);
      // Create a winding path
      const x = padding + (mapW - padding * 2) * progress;
      const yCenter = mapH / 2;
      const wave = Math.sin(progress * Math.PI * 2) * 25;
      const y = yCenter + wave;
      positions.push({ x, y });
    }

    return positions;
  }, [locations.length]);

  const currentLocationName = currentTitle || (locations.length > 0 ? locations[locations.length - 1]?.title : 'Unknown');

  return (
    <div className="parchment-frame rounded-xl p-4 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-amber-500 uppercase tracking-widest font-bold flex items-center gap-1.5"
          style={{ fontFamily: "'Cinzel', serif", fontSize: 10 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v20M2 12h20" />
          </svg>
          Expedition Map
        </p>
        <CompassRose />
      </div>

      {/* Map Area */}
      <div className="relative rounded-lg overflow-hidden" style={{ height: 140 }}>
        {/* Parchment background */}
        <div className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, rgba(120,53,15,0.06) 0%, transparent 50%),
              linear-gradient(225deg, rgba(120,53,15,0.04) 0%, transparent 50%),
              linear-gradient(to bottom, rgba(20,17,14,0.95), rgba(28,25,23,0.98))
            `,
          }} />

        {/* Fog of war overlay */}
        <div className="absolute inset-0 animate-fog-drift pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 60% 40%, transparent 30%, rgba(12,10,9,0.4) 70%)',
            animationDuration: '20s',
          }} />

        {/* SVG Map */}
        <svg className="relative w-full h-full" viewBox="0 0 220 130" preserveAspectRatio="xMidYMid meet">
          {/* Paths between nodes */}
          {nodePositions.slice(0, -1).map((pos, i) => {
            const next = nodePositions[i + 1];
            const isTraversed = i < locations.length - 1;
            return (
              <MapPath key={`path-${i}`}
                x1={pos.x} y1={pos.y}
                x2={next.x} y2={next.y}
                isTraversed={isTraversed} />
            );
          })}

          {/* Location nodes */}
          {nodePositions.map((pos, i) => {
            const loc = locations[i];
            const isCurrent = loc && loc.title === currentLocationName;
            const isVisited = loc != null && !isCurrent;

            return (
              <MapNode key={`node-${i}`}
                x={pos.x} y={pos.y}
                label={loc?.title || '???'}
                isCurrent={isCurrent}
                isVisited={isVisited}
                index={i} />
            );
          })}

          {/* Decorative terrain marks */}
          <text x="180" y="25" fontSize="7" fill="#44403c" fillOpacity="0.15" fontFamily="serif">⛰</text>
          <text x="30" y="110" fontSize="7" fill="#44403c" fillOpacity="0.15" fontFamily="serif">🌲</text>
          <text x="130" y="120" fontSize="6" fill="#44403c" fillOpacity="0.1" fontFamily="serif">≋</text>
        </svg>

        {/* Edge vignette */}
        <div className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.2)',
          }} />
      </div>

      {/* Current Location Label */}
      <div className="mt-3 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-amber-500 animate-map-marker-pulse" />
        <p className="text-[10px] text-amber-400/70 truncate" style={{ fontFamily: "'Cinzel', serif" }}>
          {currentLocationName}
        </p>
      </div>

      {/* Progress */}
      {locations.length > 1 && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-px bg-stone-800 relative">
            <div className="absolute left-0 top-0 h-px bg-gradient-to-r from-amber-700 to-amber-500 transition-all duration-500"
              style={{ width: `${Math.min(100, (locations.length / Math.max(nodePositions.length, 1)) * 100)}%` }} />
          </div>
          <span className="text-[9px] text-stone-500 font-sans">
            {locations.length} / {nodePositions.length}
          </span>
        </div>
      )}
    </div>
  );
}
