/**
 * PyITES · app
 * Punto de coordinación: registra todas las acciones de la interfaz
 * (`data-act="..."`) y el arranque de la aplicación.
 *
 * La delegación de eventos vive aquí, así que el HTML generado por
 * cualquier módulo se comporta sin necesidad de registrar listeners.
 */

import { $, esc } from './core/dom.js';
import { Sound } from './core/sound.js';
import { state, saveState, createDefaultState } from './core/storage.js';
import { FLAT, currentLessonIndex } from './content/index.js';
import { openModal, closeModal, toast } from './ui/overlays.js';
import { profileHTML } from './ui/profile.js';
import { renderApp, renderHome, refreshHome, profileIsOpen } from './ui/home.js';
import * as engine from './lesson/engine.js';

/** Botón de cerrar reutilizable para los modales de perfil. */
const CLOSE_BUTTON = '<button class="ib close" data-act="closeModal" aria-label="Cerrar">✕</button>';

/**
 * Acciones de la interfaz, indexadas por el valor de `data-act`.
 * Cada una recibe el elemento que la disparó.
 */
const actions = {
  /** Guardar el nombre y entrar al curso. */
  start(element) {
    const input = $('#nameIn');
    const name = input.value.trim();

    if (!name) {
      // Sacudida + sonido para indicar que falta el nombre.
      input.style.animation = 'none';
      void input.offsetWidth;
      input.style.animation = 'shake .4s';
      input.focus();
      Sound.play('wrong');
      return;
    }

    state.name = name.slice(0, 20);
    saveState();
    Sound.play('win');
    renderHome();
  },

  /** Abrir una lección, comprobando que esté desbloqueada. */
  lesson(element) {
    const index = Number(element.dataset.g);
    if (index > currentLessonIndex(state.done)) {
      toast('Completa la lección anterior para desbloquear esta.');
      Sound.play('wrong');
      return;
    }
    engine.startLesson(index);
  },

  /** Abrir el panel de perfil. */
  profile() {
    openModal(CLOSE_BUTTON + profileHTML());
  },

  /** Activar o silenciar los sonidos. */
  sound() {
    state.sound = !state.sound;
    saveState();
    if (state.sound) Sound.play('pop');
    refreshHome();

    // Si el perfil está abierto en un modal, hay que refrescarlo también.
    if (profileIsOpen()) {
      const modal = $('#overlay .modal');
      modal.innerHTML = CLOSE_BUTTON + profileHTML();
    }
  },

  /** Cerrar el modal abierto. */
  closeModal() {
    closeModal();
  },

  /** Pedir confirmación antes de abandonar la lección. */
  quit() {
    openModal('<h3>¿Salir de la lección?</h3><p>Perderás el avance de esta lección.</p>' +
      '<div class="btns">' +
      '<button class="btn green" data-act="closeModal">Seguir aprendiendo</button>' +
      '<button class="btn ghost danger" data-act="exit">Salir</button></div>', 'center');
  },

  /** Salir de la lección sin guardarla. */
  exit() {
    closeModal();
    engine.closeLesson();
    refreshHome();
  },

  /* --- Teoría --- */
  learnNext: () => engine.learnNext(),
  skipLearn: () => engine.skipLearn(),

  /* --- Ejercicios --- */
  opt: element => engine.selectOption(element),
  place: element => engine.placePiece(element),
  unplace: element => engine.unplacePiece(element),
  check: () => engine.check(),
  next: () => engine.next(),

  /* --- Finales --- */
  retry: () => engine.retryLesson(),
  finish: () => engine.afterLesson(engine.session && engine.session.titleUp),

  /* --- Perfil --- */
  reset() {
    openModal('<h3>¿Resetear tu progreso?</h3>' +
      '<p>Se borrarán tus puntos, tu racha, tus títulos y las lecciones completadas. ' +
      'Tu nombre se mantiene. Esta acción no se puede deshacer.</p>' +
      '<div class="btns">' +
      '<button class="btn ghost" data-act="closeModal">Cancelar</button>' +
      '<button class="btn red" data-act="resetYes">Sí, resetear</button></div>', 'center');
  },

  /** Borra el progreso conservando el nombre y la preferencia de sonido. */
  resetYes() {
    const keep = { name: state.name, sound: state.sound };
    Object.assign(state, createDefaultState(), keep);
    saveState();
    closeModal();
    Sound.play('fail');
    refreshHome();
    toast('Progreso reiniciado. ¡A empezar de nuevo!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  /** Pedir el nombre para cambiarlo. */
  editname() {
    openModal('<h3>Tu nombre</h3>' +
      `<input id="nameEdit" class="field" maxlength="20" value="${esc(state.name)}" ` +
      'autocomplete="off" aria-label="Nombre">' +
      '<div class="btns">' +
      '<button class="btn green" data-act="savename">Guardar</button>' +
      '<button class="btn ghost" data-act="closeModal">Cancelar</button></div>');

    setTimeout(() => {
      const input = $('#nameEdit');
      if (input) {
        input.focus();
        input.select();
      }
    }, 60);
  },

  /** Guardar el nuevo nombre. */
  savename() {
    const name = $('#nameEdit').value.trim();
    if (!name) return;
    state.name = name.slice(0, 20);
    saveState();
    closeModal();
    refreshHome();
    toast('Nombre actualizado');
  }
};

/**
 * Acciones que ya reproducen su propio sonido,
 * para evitar que la delegación añada un "pop" encima.
 */
const ACTIONS_WITHOUT_EXTRA_SOUND = ['check', 'opt', 'place', 'unplace', 'sound', 'start', 'resetYes'];

/* ----------------------------------------------------------------
   Eventos
   ---------------------------------------------------------------- */

const onClick = event => {
  const element = event.target.closest('[data-act]');
  if (!element) return;

  const name = element.dataset.act;
  if (!ACTIONS_WITHOUT_EXTRA_SOUND.includes(name)) Sound.play('pop');
  if (actions[name]) actions[name](element, event);
};

const onInput = event => {
  if (event.target.id === 'blank') engine.typeAnswer(event.target.value);
};

const onKeyDown = event => {
  // Cerrar modales con Escape.
  if (event.key === 'Escape') {
    if ($('#overlay')) closeModal();
    return;
  }
  if (event.repeat) return;

  // Atajos de teclado dentro de un input: Enter confirma.
  if (event.key === 'Enter') {
    if (event.target.id === 'nameIn') {
      event.preventDefault();
      actions.start(event.target);
      return;
    }
    if (event.target.id === 'nameEdit') {
      event.preventDefault();
      actions.savename();
      return;
    }
    if ($('#overlay')) return;

    // Enter actúa sobre el botón del pie de la lección.
    if (engine.session) {
      const button = document.querySelector('#lf .btn:not([disabled])');
      const onFooterButton = event.target.tagName === 'BUTTON' && event.target.closest('#lf');
      if (button && !onFooterButton) {
        event.preventDefault();
        button.click();
      }
    }
    return;
  }

  // Teclas 1-9 eligen la opción correspondiente.
  const isChoice = /^[1-9]$/.test(event.key)
    && engine.session && !engine.session.checked
    && event.target.tagName !== 'INPUT';

  if (isChoice) {
    const option = document.querySelectorAll('.opt')[Number(event.key) - 1];
    if (option) option.click();
  }
};

/* ----------------------------------------------------------------
   Arranque
   ---------------------------------------------------------------- */

/** Conecta los eventos y pinta la pantalla inicial. */
export const bootstrap = () => {
  document.addEventListener('click', onClick);
  document.addEventListener('input', onInput);
  document.addEventListener('keydown', onKeyDown);

  renderApp();
};

/** Número de lecciones del curso, útil desde la consola del navegador. */
export const courseSize = FLAT.length;
