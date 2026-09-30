/**
 * PyITES · ui/path
 * La ruta de aprendizaje: una sección por unidad y un nodo por lección.
 */

import { esc } from '../core/dom.js';
import { UNITS, TOTAL_LESSONS, FLAT, completedCount, currentLessonIndex } from '../content/index.js';
import { state, TITLES, titleIndexFor } from '../core/storage.js';
import { mascot } from './mascot.js';

/** Desplazamiento horizontal de cada nodo, en px, para crear el camino sinuoso. */
const NODE_OFFSETS = [0, 46, 72, 46, 0, -46, -72, -46];

/** Marcado de un nodo: estado visual, insignia y botón. */
const nodeHTML = (entry, current, justDone) => {
  const isDone = !!state.done[entry.id];
  const isCurrent = entry.g === current;
  const isLocked = entry.g > current;
  const record = state.done[entry.id];

  const classes = ['node', isLocked && 'locked', isCurrent && 'cur', justDone === entry.id && 'just']
    .filter(Boolean).join(' ');

  // ★ si se completó sin un solo error; ✓ si se completó con errores.
  const badge = isDone ? `<span class="badge">${record && record.best === 100 ? '★' : '✓'}</span>` : '';
  const label = isLocked ? ' (bloqueada)' : '';
  const face = isLocked ? '🔒' : entry.lesson.icon;

  return `<button class="${classes}" data-act="lesson" data-g="${entry.g}" aria-label="Lección ${esc(entry.lesson.title)}${label}">
      ${isCurrent ? '<span class="bubble">¡Empezar!</span>' : ''}${face}${badge}
    </button>`;
};

/**
 * Marcado de la ruta de aprendizaje.
 * @param {string|null} justDone  id de la lección recién completada, para su animación
 */
export const pathHTML = (justDone = null) => {
  const current = currentLessonIndex(state.done);
  const title = TITLES[titleIndexFor(state.xp)];

  let html = `<div class="card hello only-mobile">
    <div><h2>¡Hola, ${esc(state.name)}!</h2><p>${title.icon} ${title.name} · ${completedCount(state.done)} de ${TOTAL_LESSONS} lecciones</p></div>
    ${mascot('sm')}</div>`;

  UNITS.forEach((u, unitIndex) => {
    const doneHere = u.lessons.filter((_, lessonIndex) => state.done[`u${unitIndex}l${lessonIndex}`]).length;

    html += `<section class="unit" style="--c:${u.c};--cd:${u.cd}">
      <div class="ub">
        <div><small>Unidad ${unitIndex + 1}</small><h3>${esc(u.title)}</h3><p>${esc(u.desc)}</p></div>
        <div class="cnt">${doneHere}/${u.lessons.length}</div>
      </div>`;

    u.lessons.forEach((_, lessonIndex) => {
      const entry = FLAT.find(item => item.ui === unitIndex && item.li === lessonIndex);
      const isLocked = entry.g > current;

      html += `<div class="row ${entry.g === current ? 'is-cur' : ''} ${isLocked ? 'lk' : ''}" style="--x:${NODE_OFFSETS[entry.g % NODE_OFFSETS.length]}px">
        ${nodeHTML(entry, current, justDone)}
        <div class="node-label">${esc(entry.lesson.title)}</div>
      </div>`;
    });

    html += '</section>';
  });

  if (current >= TOTAL_LESSONS) {
    html += `<div class="card finish">${mascot('')}<h3>¡Completaste PyITES!</h3>
      <p style="color:var(--muted)">Repite cualquier lección para seguir sumando puntos.</p></div>`;
  }

  return html;
};
