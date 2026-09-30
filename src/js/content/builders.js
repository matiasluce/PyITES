/**
 * PyITES · content/builders
 * Ayudas para escribir el contenido del curso de forma declarativa.
 *
 * Cada función devuelve un objeto plano, así que los archivos de unidades
 * se limitan a describir contenido sin repetir la estructura.
 */

/**
 * Ejercicio de opción múltiple.
 * @param {string} q        enunciado
 * @param {string[]} o      opciones
 * @param {number} a        índice de la opción correcta
 * @param {string} e        explicación que se muestra al responder
 * @param {string} [c]      código a mostrar encima de las opciones
 */
export const mc = (q, o, a, e, c) => ({ t: 'mc', q, o, a, e, c });

/**
 * Ejercicio de completar huecos.
 * El código usa `___` como marcador de cada hueco.
 * @param {string} q    enunciado
 * @param {string} c    código con `___`
 * @param {string|string[]} a  respuesta(s) válida(s)
 * @param {string} e    explicación
 */
export const fi = (q, c, a, e) => ({ t: 'fi', q, c, a: [].concat(a), e });

/**
 * Ejercicio de ordenar piezas para formar una respuesta.
 * @param {string} q    enunciado
 * @param {string[]} tk piezas en el orden correcto
 * @param {string} e    explicación
 * @param {string} [s]  separador al mostrar la solución (vacío = sin salto de línea)
 */
export const od = (q, tk, e, s = ' ') => ({ t: 'od', q, tk, e, s });

/**
 * Tarjeta de teoría.
 * @param {string} h     título
 * @param {string} p     párrafo (admite <b> y <code>)
 * @param {string} code  ejemplo de código
 */
export const lc = (h, p, code) => ({ h, p, code });

/**
 * Lección: una tarjeta de título/icono, su teoría y sus ejercicios.
 * @param {string} title
 * @param {string} icon
 * @param {ReturnType<lc>[]} learn   tarjetas de teoría
 * @param {Array} ex                 ejercicios
 */
export const lesson = (title, icon, learn, ex) => ({ title, icon, learn, ex });

/**
 * Unidad: agrupa lecciones bajo un color propio.
 * Acepta un objeto para que la cabecera de cada unidad se lea sin comillas.
 * @param {{title: string, desc: string, c: string, cd: string, lessons: ReturnType<lesson>[]}} definition
 */
export const unit = ({ title, desc, c, cd, lessons }) => ({ title, desc, c, cd, lessons });
