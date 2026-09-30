/**
 * PyITES · core/random
 */

/** Devuelve una copia del array en orden aleatorio (Fisher-Yates). */
export const shuffle = items => {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/** Devuelve un elemento al azar de un array. */
export const pick = items => items[(Math.random() * items.length) | 0];
