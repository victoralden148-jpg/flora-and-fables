/* Synth sound effects + ambient music (WebAudio, no asset files) */
(function () {
  'use strict';
  let C, mus = null, muted = false;
  try { muted = localStorage.getItem('ff_mute') === '1'; } catch (e) { /* ignore */ }
  const ctx = () => { C = C || new (window.AudioContext || window.webkitAudioContext)(); if (C.state === 'suspended') C.resume(); return C; };
  function tone(f, t, d, type, v) {
    if (muted) return;
    try {
      const c = ctx(), o = c.createOscillator(), g = c.createGain(), s = c.currentTime + t;
      o.type = type || 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(v || .12, s); g.gain.exponentialRampToValueAtTime(.001, s + d);
      o.connect(g); g.connect(c.destination); o.start(s); o.stop(s + d);
    } catch (e) { /* audio unavailable */ }
  }
  const seq = (a, type, gap) => a.forEach((f, i) => tone(f, i * (gap || .09), .22, type));
  window.SFX = {
    tap: () => tone(700, 0, .07, 'triangle', .08),
    success: () => seq([523, 659, 784, 1047], 'triangle'),
    fail: () => seq([320, 240, 180], 'sawtooth', .12),
    water: () => seq([900, 700, 800, 600], 'sine', .06),
    harvest: () => seq([440, 554, 659], 'square', .07),
    hatch: () => seq([392, 494, 587, 784, 988, 1319], 'triangle', .1),
    evolve: () => seq([262, 330, 392, 523, 659, 784, 1047, 1319], 'sine', .11)
  };
  function music() {
    clearInterval(mus); mus = null; if (muted) return;
    const sc = [523, 587, 659, 784, 880, 1047];
    mus = setInterval(() => {
      tone(sc[Math.random() * 6 | 0], 0, 1.4, 'sine', .035);
      if (Math.random() < .4) tone(sc[Math.random() * 6 | 0] / 2, 0, 1.8, 'triangle', .03);
    }, 1000);
  }
  document.addEventListener('click', e => { if (e.target.closest('button')) SFX.tap(); if (!mus && !muted) music(); }, true);
  window.addEventListener('DOMContentLoaded', () => {
    const b = document.getElementById('btn-sound'); if (!b) return;
    b.textContent = muted ? '🔇' : '🔊';
    b.addEventListener('click', () => {
      muted = !muted; try { localStorage.setItem('ff_mute', muted ? '1' : '0'); } catch (x) { /* ignore */ }
      b.textContent = muted ? '🔇' : '🔊';
      if (muted) { clearInterval(mus); mus = null; } else { music(); SFX.success(); }
    });
  });
})();
