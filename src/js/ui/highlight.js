/**
 * PyITES · ui/highlight
 * Resaltado de sintaxis de Python sin dependencias.
 *
 * Solo cubre lo necesario para los ejemplos del curso: comentarios, cadenas,
 * números, palabras clave, funciones integradas, decoradores y `self`.
 * Los colores vienen de las variables `--s-*` de tokens.css.
 */

const KEYWORDS = [
  'def', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'not', 'and', 'or',
  'import', 'from', 'as', 'class', 'try', 'except', 'finally', 'with', 'lambda',
  'True', 'False', 'None', 'break', 'continue', 'pass', 'yield', 'is', 'raise'
].join('|');

const BUILTINS = [
  'print', 'input', 'len', 'range', 'int', 'str', 'float', 'bool', 'list', 'dict',
  'set', 'tuple', 'type', 'sum', 'min', 'max', 'sorted', 'open', 'map', 'filter',
  'super', 'enumerate', 'zip', 'round', 'abs', 'sqrt', 'randint'
].join('|');

// Orden de captura: comentario, cadena, número, keyword, builtin, decorador, self.
const PATTERN = new RegExp(
  [
    '(#.*$)',                                             // 1 comentario
    '("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\')', // 2 cadena
    '(\\b\\d+(?:\\.\\d+)?\\b)',                            // 3 número
    `(\\b(?:${KEYWORDS})\\b)`,                            // 4 keyword
    `(\\b(?:${BUILTINS})\\b)`,                            // 5 builtin
    '(@\\w+)',                                            // 6 decorador
    '(\\bself\\b)'                                         // 7 self
  ].join('|'),
  'gm'
);

/** Escapa el código y lo envuelve en <span> por tipo de token. */
export const highlight = code => {
  const safe = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return safe.replace(PATTERN, (match, comment, string, number, keyword, builtin, decorator) => {
    if (comment) return `<span class="c">${match}</span>`;
    if (string) return `<span class="s">${match}</span>`;
    if (number) return `<span class="n">${match}</span>`;
    if (keyword) return `<span class="k">${match}</span>`;
    if (builtin) return `<span class="b">${match}</span>`;
    if (decorator) return `<span class="d">${match}</span>`;
    return `<span class="n">${match}</span>`;
  });
};

/** Barra de título con los tres puntos de una ventana de editor. */
export const codeHead = () =>
  '<div class="code-head"><i></i><i></i><i></i><span>main.py</span></div>';

/** Bloque de código completo: cabecera + contenido resaltado. */
export const codeBlock = code =>
  `<div class="code-wrap">${codeHead()}<pre class="code"><code>${highlight(code)}</code></pre></div>`;
