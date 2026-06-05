class AudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = true;
  }

  init() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        return false;
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return true;
  }

  setMuted(muted) {
    this.muted = muted;
    if (!muted) this.init();
  }

  play(type) {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      if (type === 'click') {
        this._tone(600, 150, 'sine', 0.08, now, 0.1);
      } else if (type === 'dice') {
        this._tone(100 + Math.random() * 200, 50, 'triangle', 0.1, now, 0.25);
      } else if (type === 'success') {
        [440, 554.37, 659.25, 880].forEach((freq, idx) => {
          this._tone(freq, freq, 'sine', 0.07, now + idx * 0.08, 0.32);
        });
      } else if (type === 'fail') {
        this._tone(220, 110, 'sawtooth', 0.12, now, 0.4);
      } else if (type === 'hit') {
        this._tone(800, 100, 'sawtooth', 0.15, now, 0.15);
      } else if (type === 'magic') {
        this._tone(300, 1200, 'sine', 0.07, now, 0.5, true);
      } else if (type === 'crit') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          this._tone(freq, freq, 'sine', 0.1, now + idx * 0.06, 0.35);
        });
      } else if (type === 'heal') {
        [330, 415.3, 494.88, 660].forEach((freq, idx) => {
          this._tone(freq, freq, 'sine', 0.06, now + idx * 0.12, 0.4);
        });
      } else if (type === 'potion') {
        this._tone(500, 800, 'sine', 0.06, now, 0.3);
        this._tone(300, 600, 'triangle', 0.05, now + 0.1, 0.2);
      }
    } catch {}
  }

  _tone(startFreq, endFreq, waveType, gainVal, startTime, duration, rising) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.type = waveType;
    osc.frequency.setValueAtTime(startFreq, startTime);
    if (rising) {
      osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);
    } else {
      osc.frequency.linearRampToValueAtTime(endFreq, startTime + duration);
    }
    gain.gain.setValueAtTime(gainVal, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}

const audio = new AudioEngine();
export default audio;
