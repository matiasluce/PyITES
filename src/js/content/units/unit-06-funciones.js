/**
 * PyITES · Unidad 6 · Funciones
 * Organiza y reutiliza tu código
 */

import { unit, lesson, lc, mc, fi, od } from '../builders.js';

export const unit06 = unit({
  title: 'Funciones',
  desc: 'Organiza y reutiliza tu código',
  c: '#ff6b81',
  cd: '#d9546a',
  lessons: [
    lesson('Tus primeras funciones', '⚙️', [
      lc('Reutiliza código', 'Una <b>función</b> es un bloque de código con nombre. Se define con <code>def</code> y se ejecuta cuando la llamas.', `def saludar():\n    print("¡Hola!")\n\nsaludar()\nsaludar()`),
      lc('Parámetros y return', 'Las funciones reciben datos (<b>parámetros</b>) y pueden devolver un resultado con <code>return</code>.', `def sumar(a, b):\n    return a + b\n\nresultado = sumar(2, 3)\nprint(resultado)   # 5`)
    ], [
      mc('¿Qué palabra define una función?', ['function', 'def', 'fun', 'define'], 1, 'En Python las funciones se crean con def.'),
      mc('¿Qué muestra este código?', ['4', '8', '44', 'Error'], 1, 'doble(4) devuelve 4 * 2 = 8.', `def doble(x):\n    return x * 2\n\nprint(doble(4))`),
      fi('Completa para que la función devuelva la suma.', `def sumar(a, b):\n    ___ a + b`, 'return', 'return devuelve el resultado a quien llamó la función.'),
      mc('Si defines una función pero nunca la llamas...', ['Se ejecuta sola', 'No se ejecuta', 'Da error', 'Se ejecuta dos veces'], 1, 'Definir una función no la ejecuta: hay que llamarla.'),
      od('Define la función y luego llámala.', ['def saludar():', '    print("Hola")', 'saludar()'], 'Primero def, luego el cuerpo con indentación y por último la llamada.', '\n'),
      mc('¿Qué valor muestra este código?', ['13', '25', '10', 'Error'], 0, '9 + 4 = 13.', `def cuadrado(n):\n    return n * n\n\nx = cuadrado(3) + cuadrado(2)\nprint(x)`)
    ]),
    lesson('Más sobre funciones', '🎛️', [
      lc('Valores por defecto', 'Un parámetro puede tener un valor por defecto que se usa si no envías nada.', `def saludar(nombre="amigo"):\n    print(f"Hola, {nombre}")\n\nsaludar()         # Hola, amigo\nsaludar("Ana")    # Hola, Ana`),
      lc('Alcance (scope)', 'Las variables creadas dentro de una función solo existen ahí adentro.', `def f():\n    secreto = 42\n\nf()\nprint(secreto)   # ❌ NameError`)
    ], [
      mc('¿Qué muestra este código?', ['Hola n', 'Hola mundo', 'Error', 'Hola'], 1, 'Sin argumento, n vale "mundo".', `def saludar(n="mundo"):\n    print("Hola", n)\n\nsaludar()`),
      mc('¿Qué muestra este código?', ['Hola mundo', 'Hola Ana', 'Hola n', 'Error'], 1, 'El argumento "Ana" reemplaza el valor por defecto.', `def saludar(n="mundo"):\n    print("Hola", n)\n\nsaludar("Ana")`),
      mc('¿Qué ocurre al ejecutar este código?', ['Muestra 1', 'Muestra None', 'Da NameError', 'Muestra 0'], 2, 'x solo existe dentro de la función, fuera no se conoce.', `def f():\n    x = 1\n\nf()\nprint(x)`),
      mc('¿Qué muestra este código?', ['3', 'None', '2', 'Error'], 1, 'Sin return, la función devuelve None.', `def f(x):\n    x + 1\n\nprint(f(2))`),
      fi('Completa con el operador de potencia.', `def potencia(base, exp=2):\n    return base ___ exp\n\nprint(potencia(3))   # 9`, '**', 'El operador ** eleva a una potencia.'),
      mc('¿Para qué sirve return?', ['Mostrar en pantalla', 'Devolver un valor a quien llamó la función', 'Repetir la función', 'Borrar variables'], 1, 'return entrega un resultado que puedes guardar o usar.')
    ])
  ]
});
