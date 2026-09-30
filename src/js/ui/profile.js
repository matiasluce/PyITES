/**
 * PyITES · ui/profile
 * Panel de perfil: identidad, estadísticas, progreso hacia el
 * siguiente título, meta diaria, racha semanal y ajustes.
 *
 * Se usa dos veces: en la barra lateral de la pantalla de inicio
 * y dentro de un modal.
 */

import { esc } from '../core/dom.js';
import { formatDate } from '../core/dates.js';
import { state, TITLES, DAILY_GOAL, titleIndexFor, currentStreak, todayXP } from '../core/storage.js';
import { TOTAL_LESSONS, completedCount } from '../content/index.js';
import { avatarInitial } from './topbar.js';

const WEEKDAY_INITIALS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

/** Las siete celdas de la semana actual, empezando en lunes. */
const weekHTML = () => {
  const now = new Date();
  const mondayOffset = (now.getDay() + 6) % 7;

  return WEEKDAY_INITIALS
    .map((initial, index) => {
      const date = formatDate(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset + index)
      );
      const active = state.days.includes(date) ? 'on' : '';
      const isToday = date === formatDate(now) ? 'today' : '';
      return `<div class="${active} ${isToday}">${initial}<span>🔥</span></div>`;
    })
    .join('');
};

/** Marcado del panel de perfil. */
export const profileHTML = () => {
  const index = titleIndexFor(state.xp);
  const title = TITLES[index];
  const next = TITLES[index + 1];
  const progress = next
    ? Math.round(((state.xp - title.min) / (next.min - title.min)) * 100)
    : 100;
  const earned = todayXP();

  return `<div class="prof">
    <div class="prof-top">
      <div class="avatar">${avatarInitial()}</div>
      <div>
        <div class="pname">${esc(state.name)} <button class="mini" data-act="editname" aria-label="Cambiar nombre">✏️</button></div>
        <div class="ptitle">${title.icon} ${title.name}</div>
      </div>
    </div>

    <div class="mstats">
      <div class="ms"><b>🔥 ${currentStreak()}</b><span>Racha</span></div>
      <div class="ms"><b>⭐ ${state.xp}</b><span>Puntos</span></div>
      <div class="ms"><b>✅ ${completedCount(state.done)}/${TOTAL_LESSONS}</b><span>Lecciones</span></div>
    </div>

    <div class="psec">
      <h4>Próximo título <span>${next ? `${next.icon} ${next.name} · faltan ${next.min - state.xp}` : 'Nivel máximo'}</span></h4>
      <div class="pbar"><i style="width:${progress}%"></i></div>
    </div>

    <div class="psec">
      <h4>Meta diaria <span>${Math.min(earned, DAILY_GOAL)}/${DAILY_GOAL} puntos</span></h4>
      <div class="pbar g"><i style="width:${Math.min(100, (earned / DAILY_GOAL) * 100)}%"></i></div>
    </div>

    <div class="psec">
      <h4>Esta semana <span>Mejor racha: ${state.best || 0}</span></h4>
      <div class="week">${weekHTML()}</div>
    </div>

    <div class="psec">
      <h4>Títulos</h4>
      <div class="chips">${TITLES.map((t, i) => {
        const className = ['tchip', i > index && 'lock', i === index && 'now'].filter(Boolean).join(' ');
        return `<span class="${className}">${i > index ? '🔒' : t.icon} ${t.name}</span>`;
      }).join('')}</div>
    </div>

    <div class="pact">
      <button class="btn ghost" data-act="sound">${state.sound ? '🔊 Sonido activado' : '🔇 Sonido silenciado'}</button>
      <button class="btn ghost danger" data-act="reset">Resetear progreso</button>
    </div>
  </div>`;
};
