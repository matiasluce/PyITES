/**
 * PyITES · lesson/engine
 * Ciclo de vida de una lección: abrir, avanzar, comprobar, terminar.
 *
 * El estado de la sesión vive aquí (`session`) y se reinicia al empezar
 * o reintentar una lección.
 */

import { $, esc } from '../core/dom.js';
import { Sound } from '../core/sound.js';
import {
  state, saveState, TITLES, DAILY_GOAL,
  titleIndexFor, currentStreak, todayXP, markActiveToday
} from '../core/storage.js';
import { today } from '../core/dates.js';
import { FLAT } from '../content/index.js';
import { openModal, confetti } from '../ui/overlays.js';
import { mascot } from '../ui/mascot.js';
import { refreshHome, scrollToCurrentNode } from '../ui/home.js';
import { prepare, evaluate } from './prepare.js';
import * as views from './views.js';

/** Vidas por lección. */
const MAX_HEARTS = 5;

/** Sesión de lección en curso, o null si no hay ninguna. */
export let session = null;

/** Devuelve la sesión activa o lanza si no la hay. */
const requireSession = () => {
  if (!session) throw new Error('No hay ninguna lección en curso');
  return session;
};

/** Lección recién completada, para animar su nodo en la ruta. */
let justDone = null;

/* ----------------------------------------------------------------
   Apertura y cierre
   ---------------------------------------------------------------- */

/**
 * Abre la lección del índice global `index` de la lista plana.
 * @param {number} index
 */
export const startLesson = index => {
  const entry = FLAT[index];
  const exercises = entry.lesson.ex;

  session = {
    index,
    entry,
    first: !state.done[entry.id],
    phase: 'learn',
    step: 0,
    queue: exercises.map((exercise, id) => prepare(exercise, id)),
    total: exercises.length,
    solved: new Set(),
    missed: new Set(),
    hearts: MAX_HEARTS,
    mistakes: 0,
    xp: 0,
    newDay: false,
    checked: false,
    exercise: exercises[0],
    val: '',
    sel: -1,
    placed: []
  };

  document.documentElement.classList.add('noscroll');

  const root = $('#lesson');
  root.classList.remove('hidden');
  root.innerHTML = `<div class="l-head">
      <button class="x" data-act="quit" aria-label="Salir de la lección">✕</button>
      <div class="bar"><i id="lbar"></i></div><div class="hearts" id="hearts"></div>
    </div>
    <div class="l-body" id="lb"><div class="l-inner" id="li"></div></div>
    <div class="l-foot" id="lf"></div>`;

  views.updateHeader(session);
  views.renderLearnStep(session);
};

/** Cierra la lección en curso sin guardar resultados. */
export const closeLesson = () => {
  const root = $('#lesson');
  root.classList.add('hidden');
  root.innerHTML = '';
  document.documentElement.classList.remove('noscroll');
  session = null;
};

/* ----------------------------------------------------------------
   Avance
   ---------------------------------------------------------------- */

/** Avanza en la teoría, y salta a los ejercicios al terminarla. */
export const learnNext = () => {
  const current = requireSession();
  if (current.step < current.entry.lesson.learn.length - 1) {
    current.step += 1;
    views.renderLearnStep(current);
  } else {
    current.phase = 'ex';
    views.renderExercise(current);
  }
};

/** Salta la teoría y pasa directamente a los ejercicios. */
export const skipLearn = () => {
  const current = requireSession();
  current.phase = 'ex';
  views.renderExercise(current);
};

/** Selecciona una opción de respuesta múltiple. */
export const selectOption = element => {
  const current = session;
  if (!current || current.checked) return;
  Sound.play('tick');
  current.sel = Number(element.dataset.i);
  document.querySelectorAll('.opt').forEach(button => button.classList.toggle('sel', button === element));
  views.setCheckEnabled(true);
};

/** Coloca una pieza en la zona de respuesta. */
export const placePiece = element => {
  const current = session;
  if (!current || current.checked) return;
  Sound.play('tick');
  current.placed.push(Number(element.dataset.i));
  views.renderOrdering(current);
};

/** Devuelve una pieza al banco. */
export const unplacePiece = element => {
  const current = session;
  if (!current || current.checked) return;
  Sound.play('tick');
  const index = Number(element.dataset.i);
  current.placed = current.placed.filter(piece => piece !== index);
  views.renderOrdering(current);
};

/** Registra lo que el alumno escribe en un hueco. */
export const typeAnswer = value => {
  const current = session;
  if (!current || current.checked) return;
  current.val = value;
  views.setCheckEnabled(value.trim().length > 0);
};

/* ----------------------------------------------------------------
   Comprobar
   ---------------------------------------------------------------- */

/** Marca visualmente el acierto o el fallo de cada tipo de ejercicio. */
const paintAnswer = (exercise, ok) => {
  if (exercise.t === 'mc') {
    document.querySelectorAll('.opt').forEach((button, index) => {
      button.disabled = true;
      button.classList.remove('sel');
      if (exercise.opts[index].ok) button.classList.add('ok');
      else if (index === session.sel) button.classList.add('no');
    });
  }

  if (exercise.t === 'fi') {
    const input = $('#blank');
    input.readOnly = true;
    input.blur();
    input.classList.add(ok ? 'ok' : 'no');
  }

  if (exercise.t === 'od') {
    $('#zone').classList.add(ok ? 'ok' : 'no');
    document.querySelectorAll('.chip').forEach(piece => {
      piece.disabled = true;
    });
  }
};

/** Aplica la consecuencia de acertar o fallar. */
const scoreAnswer = (exercise, ok) => {
  const current = session;

  if (ok) {
    if (!current.solved.has(exercise.id)) {
      current.solved.add(exercise.id);
      // Un acierto tras fallo vale la mitad.
      current.xp += current.missed.has(exercise.id) ? 5 : 10;
    }
    if (markActiveToday()) current.newDay = true;
    Sound.play('correct');
    return;
  }

  current.mistakes += 1;
  current.missed.add(exercise.id);
  current.hearts -= 1;
  // El ejercicio vuelve al final de la cola marcado como repaso.
  current.queue.push(prepare(exercise.src, exercise.id, true));
  Sound.play('wrong');

  const hearts = $('#hearts');
  hearts.classList.remove('hit');
  void hearts.offsetWidth; // fuerza el reflow para reiniciar la animación
  hearts.classList.add('hit');
};

/** Comprueba la respuesta del ejercicio en cola. */
export const check = () => {
  const current = session;
  if (!current || current.checked) return;

  const exercise = current.queue[0];
  const outcome = evaluate(exercise, current);
  if (!outcome) return; // todavía no hay respuesta

  current.checked = true;
  current.exercise = exercise;
  paintAnswer(exercise, outcome.ok);

  current.queue.shift();
  scoreAnswer(exercise, outcome.ok);
  views.updateHeader(current);

  views.renderFeedback(current, { ok: outcome.ok, answer: outcome.answer, exercise });
};

/** Pasa al siguiente ejercicio, o termina la lección. */
export const next = () => {
  const current = session;
  if (!current || !current.checked) return;
  if (current.hearts <= 0) return showFail();
  if (!current.queue.length) return completeLesson();
  views.renderExercise(current);
};

/* ----------------------------------------------------------------
   Finales
   ---------------------------------------------------------------- */

/** Se agotaron las vidas. */
const showFail = () => {
  Sound.play('fail');
  views.renderFail();
};

/**
 * Recompensa final de la lección.
 * - Primera vez: XP completo + bonus de 20 (y 10 más si fue perfecta).
 * - Repaso: la mitad de los puntos.
 */
const rewardFor = (points, first, perfect) => {
  let gained = points + (first ? 20 + (perfect ? 10 : 0) : 0);
  if (!first) gained = Math.round(gained / 2);
  return gained;
};

/** Mensajes de logro de la pantalla de resultados. */
const buildNotes = (current, gained, perfect) => {
  const notes = [];
  const { entry } = current;

  if (current.newDay) {
    notes.push(`🔥 ¡Racha de ${state.streak} ${state.streak === 1 ? 'día' : 'días'}!`);
  }
  if (todayXP() >= DAILY_GOAL && todayXP() - gained < DAILY_GOAL) {
    notes.push('🎯 ¡Meta diaria cumplida!');
  }

  const unitComplete = current.first
    && entry.unit.lessons.every((_, lessonIndex) => state.done[`u${entry.ui}l${lessonIndex}`]);
  if (unitComplete) notes.push(`🏅 ¡Completaste la unidad "${esc(entry.unit.title)}"!`);

  const courseComplete = current.first && FLAT.every(item => state.done[item.id]);
  if (courseComplete) notes.push('🏆 ¡Terminaste todo el curso!');

  if (!current.first) notes.push('🔁 Práctica: los puntos de un repaso valen la mitad.');
  if (perfect) notes.push('✨ ¡Lección perfecta, sin errores!');

  return notes;
};

/** Suma la recompensa, guarda el progreso y muestra los resultados. */
const completeLesson = () => {
  const current = requireSession();
  const previousTitle = titleIndexFor(state.xp);
  const perfect = current.mistakes === 0;

  const gained = rewardFor(current.xp, current.first, perfect);
  const accuracy = Math.round((current.total / (current.total + current.mistakes)) * 100);

  state.xp += gained;
  state.daily = { date: today(), xp: todayXP() + gained };

  const record = state.done[current.entry.id] || { plays: 0, best: 0 };
  record.plays += 1;
  record.best = Math.max(record.best, accuracy);
  state.done[current.entry.id] = record;

  saveState();

  current.titleUp = titleIndexFor(state.xp) > previousTitle;
  justDone = current.entry.id;

  views.renderResult({
    title: current.entry.lesson.title,
    gained,
    accuracy,
    streak: currentStreak(),
    notes: buildNotes(current, gained, perfect)
  });

  Sound.play('win');
  confetti(perfect ? 220 : 140);
};

/** Cierra la lección, refresca la ruta y celebra un título nuevo si toca. */
export const afterLesson = titleUp => {
  closeLesson();
  refreshHome(justDone);
  scrollToCurrentNode();

  if (titleUp) {
    setTimeout(() => {
      const title = TITLES[titleIndexFor(state.xp)];
      Sound.play('levelup');
      confetti(200);
      openModal(
        `${mascot('')}<div class="bigtitle">${title.icon}</div><h3>¡Nuevo título!</h3>
         <p>Ahora eres <b>${esc(title.name)}</b>. ¡Sigue así, ${esc(state.name)}!</p>
         <div class="btns"><button class="btn green" data-act="closeModal">¡Genial!</button></div>`,
        'center'
      );
    }, 350);
  }

  setTimeout(() => {
    justDone = null;
  }, 1500);
};

/** Reinicia la lección actual. */
export const retryLesson = () => {
  const index = requireSession().index;
  closeLesson();
  startLesson(index);
};
