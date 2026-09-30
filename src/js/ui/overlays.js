/**
 * PyITES · ui/overlays
 * Modales, avisos emergentes y confeti.
 */

import { $ } from '../core/dom.js';

/** Abre un modal. Cierra el anterior si había uno. */
export const openModal = (html, extraClass = '') => {
  closeModal();

  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.id = 'overlay';
  overlay.innerHTML = `<div class="modal ${extraClass}" role="dialog" aria-modal="true">${html}</div>`;
  overlay.addEventListener('mousedown', event => {
    if (event.target === overlay) closeModal();
  });

  $('#modal-root').appendChild(overlay);
};

/** Cierra el modal abierto, si existe. */
export const closeModal = () => {
  const overlay = $('#overlay');
  if (overlay) overlay.remove();
};

/** Muestra un aviso breve en la parte inferior. */
export const toast = message => {
  const node = document.createElement('div');
  node.className = 'toast';
  node.textContent = message;
  $('#toast-root').appendChild(node);
  setTimeout(() => node.classList.add('out'), 2200);
  setTimeout(() => node.remove(), 2700);
};

/**
 * Lanzamiento de confeti.
 * Se respeta la preferencia del sistema de reducir el movimiento.
 * @param {number} [count]
 */
export const confetti = (count = 150) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = $('#confetti');
  const ctx = canvas.getContext('2d');
  const ratio = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.display = 'block';
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const colours = ['#58cc02', '#1cb0f6', '#ffd43b', '#ff4b4b', '#ce82ff', '#ff9600'];
  const particles = Array.from({ length: count }, () => ({
    x: width / 2 + (Math.random() - 0.5) * width * 0.3,
    y: height * 0.4,
    vx: (Math.random() - 0.5) * 15,
    vy: -Math.random() * 15 - 4,
    gravity: 0.35 + Math.random() * 0.2,
    size: 6 + Math.random() * 7,
    rotation: Math.random() * 6,
    spin: (Math.random() - 0.5) * 0.4,
    colour: colours[(Math.random() * colours.length) | 0]
  }));

  let frame = 0;
  const tick = () => {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.rotation += p.spin;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.colour;
      ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
      ctx.restore();
    });

    if (++frame < 160) {
      requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, width, height);
      canvas.style.display = 'none';
    }
  };

  tick();
};
