/**
 * PyITES · core/storage
 * Estado global del alumno y persistencia en localStorage.
 *
 * Forma de `state`:
 *   name        string    nombre elegido por el alumno
 *   xp          number    puntos acumulados
 *   streak      number    racha de días actual
 *   best        number    mejor racha histórica
 *   lastActive  string    'YYYY-MM-DD' del último día con actividad
 *   days        string[]  últimos 60 días con actividad
 *   done        object    { 'u0l2': { plays, best } } por lección
 *   sound       boolean   sonidos activados
 *   daily       { date, xp }  progreso del día en curso
 *
 * Para migrar datos existentes, sube la versión en STORAGE_KEY y añade un
 * bloque de actualización en `loadState`.
 */

import { today, dayDiff } from './dates.js';

/** Clave de localStorage. La versión permite migrar el esquema en el futuro. */
export const STORAGE_KEY = 'pyites:v1';

/** Puntos necesarios para completar la meta diaria. */
export const DAILY_GOAL = 50;

/** Títulos desbloqueables por XP acumulado. */
export const TITLES = [
  { min: 0, name: 'Principiante', icon: '🐣' },
  { min: 200, name: 'Aprendiz', icon: '🌱' },
  { min: 600, name: 'Intermedio', icon: '🔥' },
  { min: 1100, name: 'Avanzado', icon: '⚡' },
  { min: 1700, name: 'Experto', icon: '👑' }
];

/** Estado inicial de un alumno nuevo. */
export const createDefaultState = () => ({
  name: '',
  xp: 0,
  streak: 0,
  best: 0,
  lastActive: '',
  days: [],
  done: {},
  sound: true,
  daily: { date: '', xp: 0 }
});

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return Object.assign(createDefaultState(), JSON.parse(raw));
  } catch (error) {
    /* localStorage bloqueado o JSON corrupto: empezamos de cero */
  }
  return createDefaultState();
};

/** Estado vivo de la aplicación. Los módulos que lo mutan deben llamar a saveState(). */
export const state = loadState();

/** Persiste el estado actual. Falla en silencio si no hay almacenamiento. */
export const saveState = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    /* modo privado o cuota llena: la sesión sigue funcionando en memoria */
  }
};

/** Índice del título que corresponde a una cantidad de XP. */
export const titleIndexFor = xp => TITLES.reduce((current, title, index) => (xp >= title.min ? index : current), 0);

/** Racha vigente: se pierde si el último día activo fue hace más de 1 día. */
export const currentStreak = () =>
  state.lastActive && dayDiff(state.lastActive, today()) <= 1 ? state.streak : 0;

/** XP acumulado hoy. */
export const todayXP = () => (state.daily.date === today() ? state.daily.xp : 0);

/**
 * Registra actividad del día y actualiza la racha.
 * @returns {boolean} true si hoy es el primer momento activo (nueva racha).
 */
export const markActiveToday = () => {
  const date = today();
  if (state.lastActive === date) return false;

  const gap = state.lastActive ? dayDiff(state.lastActive, date) : Infinity;
  state.streak = gap === 1 ? state.streak + 1 : 1;
  state.best = Math.max(state.best || 0, state.streak);
  state.lastActive = date;

  if (!state.days.includes(date)) state.days.push(date);
  state.days = state.days.slice(-60);
  saveState();
  return true;
};
