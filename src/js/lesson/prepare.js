/**
 * PyITES · lesson/prepare
 * Prepara un ejercicio para una sesión concreta y decide si la
 * respuesta del alumno es correcta.
 */

import { shuffle } from '../core/random.js';

/** Normaliza una respuesta: sin espacios y con comillas simples. */
export const normalizeAnswer = text => text.replace(/\s+/g, '').replace(/'/g, '"');

/** Detecta si una opción parece código, para usar el estilo mono en la lista. */
export const looksLikeCode = text =>
  /[()[\]{}=_#"'<>@*]/.test(text) || /^-?\d+(\.\d+)?$/.test(text);

/** Separador invisible para comparar la secuencia de piezas colocadas. */
const PIECE_SEPARATOR = '\u0001';

/**
 * Prepara un ejercicio para esta sesión.
 * Las opciones y las piezas se barajan en cada intento, por eso
 * `prepare` se vuelve a llamar cuando el alumno se equivoca.
 *
 * @param {object} exercise  ejercicio del contenido
 * @param {number} id        índice original del ejercicio
 * @param {boolean} [retry]  marca visible de "repaso"
 */
export const prepare = (exercise, id, retry = false) => {
  const prepared = { ...exercise, id, src: exercise, retry };

  if (exercise.t === 'mc') {
    prepared.opts = shuffle(exercise.o.map((text, index) => ({ text, ok: index === exercise.a })));
  }

  if (exercise.t === 'od') {
    prepared.bank = shuffle(exercise.tk.map((text, index) => ({ text, index })));
    // Evita que las piezas salgan ya en orden por casualidad.
    if (prepared.bank.length > 1 && prepared.bank.every((piece, i) => piece.index === i)) {
      prepared.bank.reverse();
    }
  }

  if (exercise.t === 'fi') {
    prepared.parts = exercise.c.split('___');
  }

  return prepared;
};

/**
 * Comprueba la respuesta del alumno sobre el ejercicio actual.
 * @param {object} exercise  ejercicio ya preparado
 * @param {object} session   { sel, val, placed }
 * @returns {{ok: boolean, answer: string}|null} null si falta la respuesta
 */
export const evaluate = (exercise, session) => {
  if (exercise.t === 'mc') {
    if (session.sel < 0) return null;
    return {
      ok: exercise.opts[session.sel].ok,
      answer: exercise.opts.find(option => option.ok).text
    };
  }

  if (exercise.t === 'fi') {
    if (!session.val.trim()) return null;
    const given = normalizeAnswer(session.val);
    return {
      ok: exercise.a.some(candidate => normalizeAnswer(candidate) === given),
      answer: exercise.a[0]
    };
  }

  if (!session.placed.length) return null;
  const built = session.placed.map(index => exercise.tk[index]).join(PIECE_SEPARATOR);
  return { ok: built === exercise.tk.join(PIECE_SEPARATOR), answer: exercise.tk.join(exercise.s) };
};
