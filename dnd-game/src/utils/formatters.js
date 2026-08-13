// Display formatters
export function fmtGold(v) { return v >= 1000 ? (v/1000).toFixed(1) + 'k gp' : v + ' gp'; }
export function fmtXP(v) { return v.toLocaleString() + ' XP'; }
export function fmtStat(v, sign=true) { return sign && v > 0 ? '+' + v : String(v); }
export function fmtHP(cur, max) { return cur + ' / ' + max; }
export function fmtPercent(v) { return Math.round(v) + '%'; }
