/**
 * PyITES · core/sound
 * Efectos de sonido sintetizados con la Web Audio API.
 * No hay archivos de audio: todo se genera en el navegador,
 * así la app funciona totalmente offline.
 */

import { state } from './storage.js';

const buildSound = () => {
  let context = null;

  const ensureContext = () => {
    if (!context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      context = new AudioContext();
    }
    if (context.state === 'suspended') context.resume();
    return context;
  };

  /** Toca un tono. `to` opcional hace un barrido de frecuencia. */
  const tone = (frequency, delay, duration, type = 'sine', volume = 0.14, to) => {
    const ctx = ensureContext();
    if (!ctx) return;

    const start = ctx.currentTime + delay;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (to) oscillator.frequency.exponentialRampToValueAtTime(to, start + duration);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  };

  const arpeggio = (notes, step, duration, type, volume) =>
    notes.forEach((frequency, index) => tone(frequency, index * step, duration, type, volume));

  const effects = {
    tick: () => tone(700, 0, 0.06, 'triangle', 0.07),
    pop: () => tone(480, 0, 0.09, 'sine', 0.12, 620),
    correct: () => {
      tone(659, 0, 0.14, 'triangle', 0.16);
      tone(988, 0.1, 0.26, 'triangle', 0.16);
    },
    wrong: () => {
      tone(240, 0, 0.2, 'sawtooth', 0.08, 170);
      tone(160, 0.16, 0.3, 'sawtooth', 0.08, 110);
    },
    win: () => {
      arpeggio([523, 659, 784, 1047], 0.12, 0.32, 'triangle', 0.16);
      tone(1319, 0.5, 0.6, 'sine', 0.14);
    },
    fail: () => {
      arpeggio([392, 330, 262], 0.18, 0.34, 'triangle', 0.13);
    },
    levelup: () => {
      arpeggio([392, 523, 659, 784, 1047, 1319], 0.09, 0.3, 'square', 0.07);
      tone(1568, 0.6, 0.8, 'triangle', 0.14);
    }
  };

  return {
    /** Reproduce un efecto respetando el interruptor de sonido. */
    play(name) {
      if (!state.sound || !effects[name]) return;
      try {
        effects[name]();
      } catch (error) {
        /* el navegador puede bloquear el audio hasta la primera interacción */
      }
    }
  };
};

export const Sound = buildSound();
