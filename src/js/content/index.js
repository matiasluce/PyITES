/**
 * PyITES · content
 * Une las unidades del curso y expone la lista plana de lecciones.
 *
 * Para añadir una unidad nueva:
 *   1. crea el archivo en ./units/ con `export const unit09 = unit({...})`
 *   2. impórtala aquí y añádela al array UNITS (el orden es el orden de avance)
 */

import { unit01 } from './units/unit-01-primeros-pasos.js';
import { unit02 } from './units/unit-02-datos-y-operaciones.js';
import { unit03 } from './units/unit-03-toma-de-decisiones.js';
import { unit04 } from './units/unit-04-bucles.js';
import { unit05 } from './units/unit-05-colecciones.js';
import { unit06 } from './units/unit-06-funciones.js';
import { unit07 } from './units/unit-07-herramientas.js';
import { unit08 } from './units/unit-08-nivel-experto.js';

/** Todas las unidades del curso, en orden de avance. */
export const UNITS = [unit01, unit02, unit03, unit04, unit05, unit06, unit07, unit08];

/**
 * Lista plana de lecciones con su posición global `g`.
 * `id` sigue el patrón 'u{unidad}l{lección}' y es la clave usada en `state.done`,
 * así que no lo cambies en lecciones ya publicadas.
 */
export const FLAT = UNITS.flatMap((u, unitIndex) =>
  u.lessons.map((lesson, lessonIndex) => ({
    id: `u${unitIndex}l${lessonIndex}`,
    g: 0, // se rellena justo debajo, en orden
    ui: unitIndex,
    li: lessonIndex,
    unit: u,
    lesson
  }))
);

FLAT.forEach((entry, index) => {
  entry.g = index;
});

/** Número total de lecciones del curso. */
export const TOTAL_LESSONS = FLAT.length;

/** Lecciones completadas por el alumno. */
export const completedCount = done => FLAT.filter(entry => done[entry.id]).length;

/** Índice de la primera lección pendiente; TOTAL_LESSONS si el curso está completo. */
export const currentLessonIndex = done => {
  const index = FLAT.findIndex(entry => !done[entry.id]);
  return index < 0 ? FLAT.length : index;
};
