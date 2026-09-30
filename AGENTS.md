# AGENTS.md

Web app educativa de Python en HTML/CSS/JS puro. **Sin dependencias, sin framework, sin
build step real, sin tests, sin git.** Node solo se usa para servir archivos y para
empaquetar a un único HTML.

Lee `README.md` para la vista general. Esto es lo que **no** se deduce del código.

## Comandos

```bash
npm run dev      # servidor en http://localhost:5173  (PORT=8080 npm run dev)
npm run build    # genera dist/pyites.html
```

No hay `npm install`: `node_modules` no existe y no debe. `package.json` es solo un
manifiesto de scripts.

## El fallo que más se repite

**`index.html` no se abre con doble clic.** Los módulos ES se bloquean por CORS con
`file://` y la página queda en blanco. Hay un aviso en `index.html` que lo explica, pero
solo aparece si se cumple *exactamente* esta condición:

```js
location.protocol === 'file:' && document.querySelector('script[type="module"][src]')
```

La segunda mitad es obligatoria: `npm run build` copia `index.html` a `dist/pyites.html`
donde el módulo va embebido (sin `src`) y ese archivo **sí** funciona con doble clic. Si
alguien "arregla" el aviso quitando la condición del `src`, rompe `dist/`.

Para probar la app, `npm run dev` + `http://localhost:5173`.
Para probar el bundle, abrir `dist/pyites.html` por `file://`.

## Reglas del empaquetador (`tools/build.mjs`)

Es un bundler propio y mínimo. Antes de tocar un módulo, lee sus comentarios; el build
falla con mensajes explícitos si algo no encaja.

- **Nombres de primer nivel únicos** entre todos los módulos. El bundle concatena en un
  único ámbito, así que dos `const state` en módulos distintos rompen el bundle. El
  build lo detecta y nombra los dos archivos, pero el fallo llega tarde si lo descubres
  en el navegador.
- **Solo exportaciones con nombre.** `export default` y `export * from` están prohibidos.
- **Todo `import` debe empezar por `./` o `../`.** No hay resolución de paquetes.
- `import * as ns from '...'` sí funciona: el build genera el objeto a mano. Si añades
  un namespace import, `collectExports()` debe detectar los nombres o `ns` quedará vacío.
- **`String.replace` con cadena de reemplazo es una trampa.** En un reemplazo, `$$` se
  convierte en `$`, `$&` es el match completo y `` $` `` / `$'` son trozos del original.
  El bundle contiene `$$` (en `core/dom.js`) y `$` seguido de texto. Por eso
  `inlineStyles` e `inlineScripts` usan **funciones** de reemplazo. Si las conviertes
  de vuelta a cadenas, `dist/pyites.html` deja de arrancar con un
  `SyntaxError: Identifier '$' has already been declared` que **no** aparece en
  `npm run dev`.
- El build ya valida sintaxis (`new Function`) y duplicados. Si pasa, el bundle es
  ejecutable; si falla, léete el error en la terminal.

## Verificar cambios

No hay framework de tests. La verificación real que se usó consistió en scripts
temporarios con Chrome DevTools Protocol sobre Edge headless. Si necesitas comprobar
algo de verdad, esa es la vía; no basta con abrir la página a ojo.

Prioridad al verificar:

1. `npm run build` (detecta lo anterior en 1 segundo).
2. `http://localhost:5173` para el código modular.
3. `dist/pyites.html` por `file://` para el bundle — **obligatorio** si tocaste
   `index.html`, `tools/build.mjs` o cualquier módulo, porque el bundle es un camino
   distinto y es donde fallaron los bugs anteriores.

Aviso: `check-content.mjs` y los scripts de humo vivían en
`%TEMP%\opencode\`, fuera del repo. Si no existen, no hay forma de volver a ejecutarlos
y habría que reescribirlos.

## Contenido del curso

Todo el curso está en `src/js/content/units/`, un archivo por unidad, y se describe con
funciones de `src/js/content/builders.js`:

```js
unit({ title, desc, c, cd, lessons })         // un objeto, no posicional
lesson(title, icon, learn[], ex[])            // 4 argumentos, NO hay xp
mc(q, o[], a, e, c?)      // `a` es el ÍNDICE de la opción correcta, no el texto
fi(q, c, a, e)            // `a` acepta string o string[]; el hueco en `c` es `___`
od(q, tk[], e, s?)        // separador al mostrar la solución; '' = sin salto de línea
lc(h, p, code)            // tarjeta de teoría; `p` admite <b> y <code>
```

Detalles que no son evidentes:

- En `mc` el orden de `o` se **baraja** en cada intento (`prepare()`), por eso `a` es un
  índice. Cambiarlo por texto rompe el ejercicio silenciosamente.
- El marcador de hueco de `fi` es exactamente `___` (tres guiones bajos) y `prepare()`
  hace `split('___')`. Cuatro guiones bajos no se detectan.
- Los IDs de lección son `u{unidad}l{lección}` y son la clave de `state.done`. **No
  reordenes lecciones ya publicadas** o el progreso guardado deja de coincidir.
- Para añadir una unidad: crea el archivo, impórtalo en `content/index.js` y añádelo a
  `UNITS` **en orden**. `FLAT` y `g` se derivan solos.

Referencias: 8 unidades, 23 lecciones, 136 ejercicios (104 `mc`, 23 `fi`, 9 `od`).
Todo el contenido procede de `legacy/pyites-original.html`, el monolito del que salió
el proyecto, así que ese archivo sirve de referencia para contrastar textos y ejercicio.

## Estado y persistencia

- Todo el estado vive en `localStorage` bajo **`pyites:v1`** (`core/storage.js`). Cambiar
  esa clave borra el progreso de todo el mundo; migrar significa subir la versión y
  tocar `loadState`.
- `state` es un objeto mutable único y vivo. Todo módulo que lo muta debe llamar a
  `saveState()`. No hay proxy ni reactivity: si te olvidas, el progreso no persiste.
- Los fallos de `localStorage` (modo privado, cuota llena) están tragados a propósito:
  la sesión sigue en memoria. No los "arregles" sin querer.

## Cosas que parecen bugs y no lo son

- **La barra de progreso mide `solved.size / total`, no el avance por la cola.** Es
  deliberado: solo avanza al acertar. En el primer ejercicio sigue a `0%` tras
  responder mal, y eso es correcto.
- Un ejercicio fallado **vuelve al final de la cola** marcado como repaso y suma la
  mitad de puntos la segunda vez. Es intencionado, no un bucle infinito.
- La teoría se puede saltar solo en los repasos (`session.first === false`), nunca la
  primera vez.
- El contador de la unidad se cuenta en `path.js` con `state.done['u{ui}l{li}']`, duplicando
  el criterio de `content/index.js`. Si tocas el formato de los IDs, toca los dos sitios.

## Debug

`app.js` expone `courseSize` y el `bootstrap`, y `engine.session` guarda la lección viva,
así que se puede inspeccionar desde la consola del navegador:

```js
courseSize                                  // 23
import('/src/js/content/index.js').FLAT[0] // lección cruda
import('/src/js/lesson/engine.js').session // sesión actual
```

Solo funciona servido por HTTP: con `file://` los imports dinámicos también fallan.
