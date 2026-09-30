/**
 * PyITES · ui/topbar
 * Barra superior con marca, racha, puntos, sonido y avatar.
 */

import { esc } from '../core/dom.js';
import { mascot } from './mascot.js';
import { state, currentStreak } from '../core/storage.js';
import { today } from '../core/dates.js';

/** Inicial del avatar, o '?' si el alumno aún no tiene nombre. */
export const avatarInitial = () => esc((state.name[0] || '?').toUpperCase());

/** Marcado de la barra superior. */
export const topbarHTML = () => {
  const streak = currentStreak();
  const activeToday = state.lastActive === today();
  const soundLabel = state.sound ? 'Silenciar sonidos' : 'Activar sonidos';

  return `<div class="brand">${mascot('xs')}<span>Py<b>ITES</b></span></div>
    <div class="stats">
      <button class="stat streak ${activeToday ? '' : 'off'}" data-act="profile" title="Racha de días"><span class="fl">🔥</span>${streak}</button>
      <button class="stat xp" data-act="profile" title="Puntos">⭐ ${state.xp}</button>
      <button class="ib" data-act="sound" aria-label="${soundLabel}">${state.sound ? '🔊' : '🔇'}</button>
      <button class="ib avatar" data-act="profile" aria-label="Mi perfil">${avatarInitial()}</button>
    </div>`;
};
