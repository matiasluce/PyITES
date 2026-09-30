/**
 * PyITES · core/dom
 * Atajos mínimos para consultar el DOM y escapar texto.
 */

/** Selecciona el primer elemento que coincide. */
export const $ = (selector, root = document) => root.querySelector(selector);

/** Selecciona todos los elementos que coinciden como array. */
export const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escapa HTML para insertar texto de contenido dentro de una plantilla. */
export const esc = value => String(value).replace(/[&<>"']/g, char => HTML_ESCAPES[char]);
