/**
 * PyITES · lesson/views
 * Pinta las distintas pantallas de la lección (teoría, ejercicio,
 * feedback y resultados). El motor decide cuándo llamarlas.
 */

import { $, esc } from '../core/dom.js';
import { mascot } from '../ui/mascot.js';
import { highlight, codeHead, codeBlock } from '../ui/highlight.js';
import { looksLikeCode } from './prepare.js';

/** Actualiza la barra de progreso y los corazones de la cabecera. */
export const updateHeader = session => {
  const bar = $('#lbar');
  if (bar) bar.style.width = `${Math.round((session.solved.size / session.total) * 100)}%`;
  const hearts = $('#hearts');
  if (hearts) hearts.textContent = `❤️ ${session.hearts}`;
};

/** Habilita o deshabilita el botón "Comprobar". */
export const setCheckEnabled = enabled => {
  const button = $('#checkbtn');
  if (button) button.disabled = !enabled;
};

/** Vuelve al principio del cuerpo con scroll. */
export const scrollBodyToTop = () => {
  const body = $('#lb');
  if (body) body.scrollTop = 0;
};

/** Pinta la tarjeta de teoría actual. */
export const renderLearnStep = session => {
  const cards = session.entry.lesson.learn;
  const card = cards[session.step];
  const isLast = session.step === cards.length - 1;
  // En un repaso se puede saltar la teoría.
  const canSkip = !session.first && isLast;

  $('#li').innerHTML = `<span class="tag">💡 Aprende ${session.step + 1}/${cards.length}</span>
    <div class="teach">${mascot('sm')}<div class="speech"><h2>${card.h}</h2><p>${card.p}</p></div></div>
    ${codeBlock(card.code)}`;

  const footer = $('#lf');
  footer.className = 'l-foot';
  footer.innerHTML = `<div class="foot-in">
    ${canSkip ? '<button class="btn ghost" data-act="skipLearn">Saltar</button>' : '<span class="spacer"></span>'}
    <button class="btn green wide" data-act="learnNext">${isLast ? 'Ir a los ejercicios' : 'Continuar'}</button>
  </div>`;

  scrollBodyToTop();
};

/** Marcado del enunciado y del cuerpo según el tipo de ejercicio. */
const exerciseHTML = exercise => {
  let html = `${exercise.retry ? '<span class="tag warn">🔁 Repaso</span>' : '<span class="tag">Practica</span>'}
    <h2 class="q">${esc(exercise.q)}</h2>`;

  if (exercise.t === 'mc') {
    if (exercise.c) html += codeBlock(exercise.c);
    const options = exercise.opts
      .map((option, index) => `<button class="opt ${looksLikeCode(option.text) ? 'mono' : ''}" data-act="opt" data-i="${index}">
        <span class="key">${index + 1}</span><span class="otxt">${esc(option.text)}</span></button>`)
      .join('');
    html += `<div class="opts">${options}</div>`;
    return html;
  }

  if (exercise.t === 'fi') {
    const width = Math.max(...exercise.a.map(answer => answer.length)) + 3;
    const input = `<input id="blank" class="blank" style="width:${width}ch" autocomplete="off"
      autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Respuesta">`;
    html += `<div class="code-wrap">${codeHead()}<pre class="code"><code>${exercise.parts.map(highlight).join(input)}</code></pre></div>`;
    return html;
  }

  // od: zona de respuesta + banco de piezas
  return html + '<div class="zone" id="zone"></div><div class="bank" id="bank"></div>';
};

/** Pinta las piezas del ejercicio de ordenar y el botón Comprobar. */
export const renderOrdering = session => {
  const exercise = session.queue[0];

  $('#zone').innerHTML = session.placed.length
    ? session.placed.map(index => `<button class="chip" data-act="unplace" data-i="${index}">${esc(exercise.tk[index])}</button>`).join('')
    : '<span class="hint">Toca las piezas para armar la respuesta</span>';

  $('#bank').innerHTML = exercise.bank
    .filter(piece => !session.placed.includes(piece.index))
    .map(piece => `<button class="chip" data-act="place" data-i="${piece.index}">${esc(piece.text)}</button>`)
    .join('');

  setCheckEnabled(session.placed.length > 0);
};

/** Pinta el ejercicio actual en cola. */
export const renderExercise = session => {
  const exercise = session.queue[0];

  session.checked = false;
  session.val = '';
  session.sel = -1;
  session.placed = [];

  $('#li').innerHTML = exerciseHTML(exercise);

  const footer = $('#lf');
  footer.className = 'l-foot';
  footer.innerHTML = '<div class="foot-in"><span class="spacer"></span>' +
    '<button id="checkbtn" class="btn green wide" data-act="check" disabled>Comprobar</button></div>';

  if (exercise.t === 'od') renderOrdering(session);
  if (exercise.t === 'fi') {
    setTimeout(() => {
      const input = $('#blank');
      if (input) input.focus();
    }, 60);
  }

  updateHeader(session);
  scrollBodyToTop();
};

/** Frases de ánimo al acertar. */
const SUCCESS_MESSAGES = ['¡Excelente!', '¡Muy bien!', '¡Correcto!', '¡Genial!', '¡Así se hace!'];
/** Frases de ánimo al fallar. */
const FAIL_MESSAGES = ['Casi, ¡no te rindas!', 'Ups, esa no era', 'Sigue intentando'];

/** Pinta el pie con el resultado de comprobar y el botón Continuar. */
export const renderFeedback = (session, result) => {
  const { ok, answer, exercise } = result;
  const message = ok ? SUCCESS_MESSAGES : FAIL_MESSAGES;
  const title = message[(Math.random() * message.length) | 0];

  const footer = $('#lf');
  footer.className = `l-foot ${ok ? 'ok' : 'bad'}`;
  footer.innerHTML = `<div class="foot-in">
    <div class="fb-msg">
      <div class="fb-ico">${ok ? '✓' : '✕'}</div>
      <div>
        <div class="fb-t">${title}</div>
        ${ok ? '' : `<div class="fb-c">Respuesta correcta: <code>${esc(answer)}</code></div>`}
        ${exercise.e ? `<div class="fb-e">${esc(exercise.e)}</div>` : ''}
      </div>
    </div>
    <button class="btn ${ok ? 'green' : 'red'} wide" data-act="next">Continuar</button>
  </div>`;

  const button = footer.querySelector('.btn');
  if (button) button.focus({ preventScroll: true });
};

/** Pinta la pantalla de "te quedaste sin vidas". */
export const renderFail = () => {
  $('#li').innerHTML = `<div class="result">${mascot('lg', 'sad')}<h1>¡Te quedaste sin vidas!</h1>
    <p class="sub">No pasa nada: equivocarse es parte de aprender. Repasa la explicación y vuelve a intentarlo.</p></div>`;

  const footer = $('#lf');
  footer.className = 'l-foot';
  footer.innerHTML = '<div class="foot-in">' +
    '<button class="btn ghost" data-act="exit">Salir</button>' +
    '<button class="btn green wide" data-act="retry">Intentar de nuevo</button></div>';
};

/**
 * Pinta la pantalla de resultados de una lección completada.
 * @param {object} result  { title, gained, accuracy, streak, notes }
 */
export const renderResult = result => {
  $('#lbar').style.width = '100%';

  $('#li').innerHTML = `<div class="result">
    ${mascot('lg')}<h1>¡Lección completada!</h1><p class="sub">${esc(result.title)}</p>
    <div class="rstats">
      <div class="rs y"><b>Puntos</b><span>⭐ +${result.gained}</span></div>
      <div class="rs g"><b>Precisión</b><span>🎯 ${result.accuracy}%</span></div>
      <div class="rs o"><b>Racha</b><span>🔥 ${result.streak}</span></div>
    </div>
    <div class="notes">${result.notes.map(note => `<div class="note">${note}</div>`).join('')}</div>
  </div>`;

  const footer = $('#lf');
  footer.className = 'l-foot';
  footer.innerHTML = '<div class="foot-in"><span class="spacer"></span>' +
    '<button class="btn green wide" data-act="finish">Continuar</button></div>';

  scrollBodyToTop();
};
