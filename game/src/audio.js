// Taman Senja: all sound is synthesised with WebAudio — no audio files, no
// network. Short oscillator blips: a click, a happy two-note chime for a
// find, a low buzz for a miss, and a little arpeggio for a win.
export class Sound {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return true;
  }

  tone(freq, start, dur, type = 'sine', vol = 0.12) {
    if (this.muted || !this.ensure()) return;
    const t0 = this.ctx.currentTime + start;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  click() {
    this.tone(660, 0, 0.07, 'triangle', 0.07);
  }

  found() {
    this.tone(523.25, 0, 0.12, 'sine', 0.14);
    this.tone(783.99, 0.09, 0.2, 'sine', 0.14);
  }

  wrong() {
    this.tone(160, 0, 0.18, 'sawtooth', 0.06);
  }

  hint() {
    this.tone(880, 0, 0.1, 'sine', 0.1);
    this.tone(1108.7, 0.08, 0.14, 'sine', 0.1);
  }

  win() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, i * 0.12, 0.25, 'sine', 0.14));
  }

  levelDone() {
    [523.25, 659.25, 783.99].forEach((f, i) => this.tone(f, i * 0.1, 0.18, 'triangle', 0.12));
  }
}
