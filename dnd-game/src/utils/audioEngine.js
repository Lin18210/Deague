/**
 * Advanced Web Audio API Sound Synthesizer & Ambient Engine
 * 
 * Provides rich sound effects for dice rolls, critical hits, magic spell casting,
 * healing chimes, item brewing, and procedural ambient background hums.
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false; // Enabled by default with auto-init on first click
    this.ambientOsc = null;
    this.ambientGain = null;
    this.isAmbientPlaying = false;
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
    if (!muted) {
      this.init();
    } else {
      this.stopAmbient();
    }
  }

  play(type) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      switch (type) {
        case 'click':
          this._tone(600, 150, 'sine', 0.08, now, 0.1);
          break;
        case 'dice':
          // Multi-tap dice rattle simulation
          for (let i = 0; i < 4; i++) {
            const tapTime = now + i * 0.05 + Math.random() * 0.02;
            const freq = 120 + Math.random() * 250;
            this._tone(freq, 60, 'triangle', 0.08, tapTime, 0.04);
          }
          break;
        case 'success':
          [440, 554.37, 659.25, 880].forEach((freq, idx) => {
            this._tone(freq, freq, 'sine', 0.07, now + idx * 0.08, 0.32);
          });
          break;
        case 'fail':
          this._tone(220, 110, 'sawtooth', 0.12, now, 0.4);
          break;
        case 'hit':
          this._tone(800, 100, 'sawtooth', 0.15, now, 0.15);
          this._noise(now, 0.1, 0.08);
          break;
        case 'magic':
          this._tone(300, 1200, 'sine', 0.07, now, 0.5, true);
          this._tone(450, 1500, 'triangle', 0.04, now + 0.05, 0.45, true);
          break;
        case 'crit':
          [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
            this._tone(freq, freq, 'sine', 0.1, now + idx * 0.06, 0.35);
          });
          this._noise(now, 0.25, 0.12);
          break;
        case 'heal':
          [330, 415.3, 494.88, 660, 825].forEach((freq, idx) => {
            this._tone(freq, freq, 'sine', 0.06, now + idx * 0.1, 0.4);
          });
          break;
        case 'potion':
        case 'brew':
          this._tone(500, 800, 'sine', 0.06, now, 0.3);
          this._tone(300, 600, 'triangle', 0.05, now + 0.1, 0.2);
          break;
        case 'door':
          this._tone(180, 90, 'triangle', 0.1, now, 0.35);
          this._noise(now + 0.1, 0.2, 0.06);
          break;
        case 'ambient_wind':
          this._tone(80, 100, 'sine', 0.03, now, 1.5, true);
          break;
        case 'level_up':
          [261.63, 329.63, 392.00, 523.25, 659.25, 783.99].forEach((freq, idx) => {
            this._tone(freq, freq, 'sine', 0.09, now + idx * 0.09, 0.5);
          });
          break;
        default:
          this._tone(440, 440, 'sine', 0.05, now, 0.1);
      }
    } catch {}
  }

  startAmbientDungeon() {
    if (this.muted || this.isAmbientPlaying) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();

      this.ambientOsc.type = 'sine';
      this.ambientOsc.frequency.setValueAtTime(55, now); // Low drone (A1)

      this.ambientGain.gain.setValueAtTime(0.01, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.03, now + 2);

      this.ambientOsc.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);
      this.ambientOsc.start(now);
      this.isAmbientPlaying = true;
    } catch {}
  }

  stopAmbient() {
    if (this.ambientOsc && this.isAmbientPlaying) {
      try {
        const now = this.ctx.currentTime;
        this.ambientGain.gain.linearRampToValueAtTime(0.001, now + 1);
        setTimeout(() => {
          this.ambientOsc.stop();
          this.ambientOsc.disconnect();
          this.isAmbientPlaying = false;
        }, 1000);
      } catch {}
    }
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
      osc.frequency.exponentialRampToValueAtTime(Math.max(10, endFreq), startTime + duration);
    } else {
      osc.frequency.linearRampToValueAtTime(endFreq, startTime + duration);
    }
    gain.gain.setValueAtTime(gainVal, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  _noise(startTime, duration, gainVal) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    whiteNoise.connect(gain);
    gain.connect(this.ctx.destination);
    whiteNoise.start(startTime);
  }
}

const audio = new AudioEngine();
export default audio;
