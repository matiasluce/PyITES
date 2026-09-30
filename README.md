# PyITES 🐍

Web app para aprender Python desde cero, nivel por nivel y al estilo de un juego.
Sin conocimientos previos, sin registro y sin conexión: todo el progreso se guarda
en el navegador.

![Unidades](https://img.shields.io/badge/unidades-8-2f80ed) ![Lecciones](https://img.shields.io/badge/lecciones-23-27ae60) ![Ejercicios](https://img.shields.io/badge/ejercicios-136-f2994a)

---

## Empezar

```bash
npm run dev
```

Abre <http://localhost:5173> y ya está. No hay `npm install`: el proyecto **no tiene
dependencias**, solo Node (18 o superior) para servir los archivos.

> **Importante:** los módulos ES necesitan servirse por HTTP. Si abres `index.html`
> con dobleclic verás un aviso explicándolo; **no** es un error de la app.

### Si se ve la página en blanco

Es casi siempre lo mismo: `index.html` se ha abierto directamente desde el disco.
El navegador bloquea los módulos ES por seguridad (CORS) y la página se queda vacía.
La app te muestra un aviso si eso ocurre, y las dos salidas son:

```bash
npm run dev      # → http://localhost:5173  (para desarrollar)
npm run build    # → dist/pyites.html, que sí abre con doble clic
```

### Versión de un solo archivo

```bash
npm run build
```

Genera `dist/pyites.html` con todo el CSS y el JavaScript embebidos. Ese archivo
**se abre con doble clic**, funciona sin servidor y se puede enviar por correo o
guardar en un pendrive tal cual.

---

## Qué incluye

- **8 unidades y 23 lecciones** ordenadas como una ruta con Units que se desbloquean
  al avanzar.
- **136 ejercicios** de cuatro tipos:

  | Tipo   | Qué practise            | Cómo se responde              |
  | ------ | ----------------------- | ----------------------------- |
  | `mc`   | Opción múltiple         | Tocas una de las opciones     |
  | `fi`   | Completar el hueco      | Escribes el texto que falta   |
  | `od`   | Ordenar las líneas      | Muestras las piezas en orden  |
  | `lc`   | Tarjeta de teoría       | Se lee y se continúa          |

- **5 vidas por lección.** Si se agotan, toca el botón de reintentar y vuelve a empezar.
- Los ejercicios fallados vuelven al final de la cola marcados como **repaso**, y acertarlos
  después suma la mitad de los puntos.
- **XP, racha diaria, títulos y objetivo diario** de 50 puntos. Se puede silenciar el sonido
  desde el perfil.
- Insignia **★** en las lecciones perfectas (sin un solo error) y **✓** en el resto.
- Se guarda el nombre, el progreso, las estadísticas y la racha en `localStorage`.

---

## Estructura del proyecto

```
CPyITES/
├─ index.html               Entrada: solo contenedores y enlaces a CSS/JS
├─ package.json             Scripts (dev, start, build). Sin dependencias
├─ src/
│  ├─ styles/               CSS separado por responsabilidad
│  │  ├─ tokens.css            Variables de color, tamaño y tipografía
│  │  ├─ base.css              Reset y elementos base
│  │  ├─ components.css        Botones, tarjetas, etiquetas
│  │  ├─ layout.css            Cabecera, sidebar y columnas
│  │  ├─ path.css              Ruta de aprendizaje
│  │  ├─ profile.css           Panel de perfil
│  │  ├─ lesson.css            Pantalla de lección
│  │  └─ overlays.css          Modales, avisos y confeti
│  └─ js/
│     ├─ main.js            Arranque
│     ├─ app.js             Acciones (data-act) y delegación de eventos
│     ├─ core/              Utilidades sin dependencias de la interfaz
│     │  ├─ dom.js            $ y $$
│     │  ├─ dates.js          Fechas en YYYY-MM-DD
│     │  ├─ random.js         Barajar y elegir al azar
│     │  ├─ storage.js        Estado, XP, rachas y persistencia
│     │  └─ sound.js          Efectos con la Web Audio API
│     ├─ content/            El curso
│     │  ├─ builders.js        mc, fi, od, lc, lesson y unit
│     │  ├─ index.js           UNITS, FLAT, TOTAL_LESSONS, progreso
│     │  └─ units/             Un archivo por unidad (unit-01 … unit-08)
│     ├─ ui/                 Pintado de pantallas
│     │  ├─ welcome.js  mascot.js  topbar.js  path.js
│     │  └─ profile.js home.js    overlays.js  highlight.js
│     └─ lesson/             Lógica de las lecciones
│        ├─ prepare.js        Normaliza, evalúa y prepara ejercicios
│        ├─ views.js          Teoría, ejercicios, feedback y resultados
│        └─ engine.js         Ciclo de vida de la lección
├─ tools/
│  ├─ serve.mjs             Servidor estático sin dependencias
│  └─ build.mjs             Empaquetador que genera dist/pyites.html
├─ dist/                    Archivo único generado (no versionado)
└─ legacy/                  El archivo único original, solo como referencia
```

---

## Cómo funciona

### El contenido es código, no HTML

Las lecciones se construyen con funciones, no con cadenas de HTML:

```js
import { unit, lesson, lc, mc, fi } from '../builders.js';

export const unit02 = unit({
  title: 'Datos y operaciones',
  desc: 'Variables, tipos y matemáticas',
  c: '#27ae60',
  cd: '#1e8449',
  lessons: [
    lesson('Tu primer programa', '💬', [
      lc('Tu primer programa', 'Python se lee casi como el inglés.', 'print("¡Hola, mundo!")')
    ], [
      mc('¿Qué función muestra texto en pantalla?', ['show()', 'print()', 'echo()'], 1,
        'print() imprime lo que pongas entre paréntesis.'),
      fi('Completa el código para mostrar un saludo.', '___("Buenos días")', 'print',
        'La función que muestra texto es print.')
    ])
  ]
});
```

`unit()` recibe **un solo objeto**; `lesson()` recibe cuatro argumentos: título, icono,
tarjetas de teoría (`lc`) y ejercicios.

Cada ejercicio tiene siempre: la pregunta (`q`), la respuesta correcta y una
explicación (`e`) que aparece al fallar. En `mc` la respuesta correcta es el **índice**
dentro del array de opciones, no el texto.

### Reglas para los módulos

El empaquetador es propio y intencionadamente pequeño. Para que `npm run build`
siga funcionando, los módulos deben cumplir estas reglas:

- **Solo exportaciones con nombre.** No se admite `export default` ni `export * from`.
- **Nombres de primer nivel únicos** entre todos los módulos, porque el bundle los
  concatena en un único ámbito. El build falla si detecta dos iguales.
- **Nada de dependencias externas:** cualquier `import` tiene que empezar por `./` o `../`.
- Se admite `import * as ns from '...'`: el build reconstruye el objeto.

El build además comprueba que el JavaScript generado no tenga errores de sintaxis,
así que un fallo se ve en la terminal y no en el navegador.

### Cómo se guarda el progreso

Todo el estado vive en un único objeto dentro de `localStorage`, bajo la clave
**`pyites:v1`**. `src/js/core/storage.js` es el único módulo que lo lee y lo escribe.
Para empezar de cero: *Perfil → Reiniciar progreso*.

---

## Personalizar

| Quiero…                                    | Dónde tocar                                        |
| ------------------------------------------ | -------------------------------------------------- |
| Añadir o cambiar lecciones                 | `src/js/content/units/unit-0X-*.js`                 |
| Cambiar textos de una unidad               | El segundo y tercer argumento de `unit()`           |
| Reordenar o quitar ejercicios              | El array que se pasa a `lesson()`                   |
| Cambiar colores, sombras o tipografía      | `src/styles/tokens.css`                             |
| Cambiar el punto de partida (50 XP/día)   | `DAILY_GOAL` en `src/js/core/storage.js`            |
| Cambiar cuántos puntos da un acierto       | `scoreAnswer()` en `src/js/lesson/engine.js`        |

Después de cualquier cambio, `npm run build` vuelve a generar `dist/pyites.html`.

---

## Scripts

| Comando           | Qué hace                                              |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Levanta el servidor en `http://localhost:5173`         |
| `npm run start`   | Alias de `dev`                                        |
| `npm run build`   | Genera `dist/pyites.html` y lo verifica               |

Puedes cambiar el puerto con `PORT=8080 npm run dev` (o `set PORT=8080` en Windows).

---

## Compatibilidad

Chrome, Edge, Firefox y Safari recientes, en escritorio y móvil. El diseño es
responsive y respeta el tema claro y oscuro del sistema.
