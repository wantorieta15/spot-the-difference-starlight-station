// STARLIGHT STATION — tiny WebAudio sound effects, no audio files.
// All sounds are synthesized with oscillators so the game stays offline.
let ctx = null;
let enabled = true;

export function setEnabled(on) {
  enabled = on;
}

export function isEnabled() {
  return enabled;
}

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, type, vol, when) {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + (when || 0);
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type || 'sine';
  o.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol || 0.12, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g);
  g.connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

export function sndFind() {
  tone(880, 0.16, 'sine', 0.14);
  tone(1318, 0.22, 'sine', 0.12, 0.07);
}

export function sndWrong() {
  tone(160, 0.22, 'sawtooth', 0.07);
}

export function sndHint() {
  tone(660, 0.12, 'triangle', 0.1);
  tone(990, 0.14, 'triangle', 0.09, 0.08);
}

export function sndClear() {
  [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, 'sine', 0.12, i * 0.1));
}

export function sndWin() {
  [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => tone(f, 0.3, 'sine', 0.12, i * 0.12));
}

export function sndClick() {
  tone(440, 0.06, 'square', 0.04);
}
