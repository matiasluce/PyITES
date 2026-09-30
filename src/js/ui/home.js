/**
 * PyITES · ui/home
 * Pantalla principal: barra superior + ruta de aprendizaje + panel lateral.
 *
 * `refreshHome` repinta solo las zonas que cambian, para no perder
 * la posición del scroll en la ruta.
 */

import { $ } from '../core/dom.js';
import { state } from '../core/storage.js';
import { topbarHTML } from './topbar.js';
import { pathHTML } from './path.js';
import { profileHTML } from './profile.js';
import { renderWelcome } from './welcome.js';

/**
 * Repinta las zonas de la pantalla principal.
 * @param {string|null} justDone  id de la lección recién completada
 */
export const refreshHome = (justDone = null) => {
  const topbar = $('#tb');
  if (!topbar) {
    renderHome();
    return;
  }

  topbar.innerHTML = topbarHTML();
  $('#path').innerHTML = pathHTML(justDone);
  $('#side').innerHTML = profileHTML();
};

/** Construye la pantalla principal desde cero. */
export const renderHome = (first = true, justDone = null) => {
  $('#app').innerHTML = `<header class="topbar"><div class="tb-in" id="tb"></div></header>
    <div class="layout"><main class="path" id="path"></main><aside class="side card" id="side"></aside></div>`;

  refreshHome(justDone);

  setTimeout(() => {
    const node = $('.node.cur');
    if (node) node.scrollIntoView({ block: 'center', behavior: first ? 'auto' : 'smooth' });
  }, 60);
};

/** Decide qué pantalla mostrar según haya nombre o no. */
export const renderApp = () => {
  if (state.name) renderHome();
  else renderWelcome();
};

/** Centra el nodo actual tras un refresco (al terminar una lección, por ejemplo). */
export const scrollToCurrentNode = () => {
  setTimeout(() => {
    const node = $('.node.cur') || $('.node.just');
    if (node) node.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, 80);
};

/** Detecta si el modal abierto contiene el panel de perfil, para refrescarlo. */
export const profileIsOpen = () => !!$('#overlay .prof');
