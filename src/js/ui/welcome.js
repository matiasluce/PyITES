/**
 * PyITES · ui/welcome
 * Primera pantalla: pide el nombre y arranca el curso.
 */

import { $, esc } from '../core/dom.js';
import { mascot } from './mascot.js';

/** Fragmentos de Python que flotan de fondo. */
const FLOATING_TOKENS = ['print()', 'def', 'if', 'for', '[ ]', '{ }', '#', '==', 'lambda', 'import', 'True', '->'];

/** Pinta la pantalla de bienvenida. */
export const renderWelcome = () => {
  const floats = FLOATING_TOKENS
    .map((token, index) => {
      const left = (index * 83 + 7) % 92;
      const top = (index * 47 + 9) % 88;
      const delay = -index * 0.9;
      const size = 16 + (index % 4) * 4;
      return `<span class="float" style="left:${left}%;top:${top}%;animation-delay:${delay}s;font-size:${size}px">${esc(token)}</span>`;
    })
    .join('');

  $('#app').innerHTML = `<div class="welcome">${floats}
    <div class="wbox">
      ${mascot('lg')}
      <h1>Py<b>ITES</b></h1>
      <p class="lead">Aprende Python paso a paso, sin saber nada de programación.</p>
      <input id="nameIn" class="field" maxlength="20" placeholder="¿Cómo te llamas?" autocomplete="off" autocapitalize="words" aria-label="Tu nombre">
      <button class="btn green" data-act="start">Empezar</button>
      <p class="wnote">Tu progreso se guarda en este navegador.</p>
    </div></div>`;

  setTimeout(() => {
    const input = $('#nameIn');
    if (input) input.focus();
  }, 80);
};
