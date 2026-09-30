/**
 * PyITES · Unidad 4 · Bucles
 * Repite tareas sin repetir código
 */

import { unit, lesson, lc, mc, fi, od } from '../builders.js';

export const unit04 = unit({
  title: 'Bucles',
  desc: 'Repite tareas sin repetir código',
  c: '#ff9600',
  cd: '#d97f00',
  lessons: [
    lesson('for y range', '🔁', [
      lc('Repetir con for', '<code>for</code> repite un bloque para cada elemento. <code>range(n)</code> genera los números de 0 a n-1.', `for i in range(3):\n    print(i)\n# 0\n# 1\n# 2`),
      lc('range con inicio y paso', '<code>range(1, 4)</code> va de 1 a 3: el final no se incluye. Un tercer valor indica el paso.', `for n in range(1, 4):\n    print(n)   # 1 2 3\n\nfor n in range(0, 10, 5):\n    print(n)   # 0 5`)
    ], [
      mc('¿Qué números muestra este código?', ['1 2 3', '0 1 2', '0 1 2 3', 'Error'], 1, 'range(3) empieza en 0 y llega hasta 2.', `for i in range(3):\n    print(i)`),
      mc('¿Qué números muestra este código?', ['1 2 3 4', '1 2 3', '0 1 2 3', '2 3 4'], 1, 'range(1, 4) empieza en 1 y termina antes del 4.', `for n in range(1, 4):\n    print(n)`),
      mc('¿Cuántas veces se muestra "Hola"?', ['4', '5', '6', '1'], 1, 'range(5) da 5 vueltas.', `for i in range(5):\n    print("Hola")`),
      fi('Completa la palabra que falta.', `for i ___ range(3):\n    print(i)`, 'in', 'La estructura es for variable in secuencia.'),
      od('Arma el bucle.', ['for i in range(3):', '    print("Python")'], 'Recuerda los dos puntos y la indentación.', '\n'),
      mc('¿Qué muestra este código?', ['3', '6', '10', '0'], 1, 'Suma 1 + 2 + 3 = 6.', `total = 0\nfor n in range(1, 4):\n    total = total + n\nprint(total)`)
    ]),
    lesson('while, break y continue', '⏳', [
      lc('Mientras se cumpla', '<code>while</code> repite mientras la condición sea verdadera. Cuidado con los bucles infinitos: ¡asegúrate de que algo cambie en cada vuelta!', `contador = 3\nwhile contador > 0:\n    print(contador)\n    contador = contador - 1\nprint("¡Despegue!")`),
      lc('break y continue', '<code>break</code> corta el bucle por completo. <code>continue</code> salta a la siguiente vuelta.', `for i in range(10):\n    if i == 3:\n        break\n    print(i)   # 0 1 2`)
    ], [
      mc('¿Qué muestra este código?', ['3 2 1', '3 2 1 0', '0 1 2', 'Infinito'], 0, 'Cuando n llega a 0, la condición n > 0 deja de cumplirse.', `n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1`),
      mc('¿Qué valor muestra este código?', ['3', '4', '5', 'Infinito'], 1, 'x sube de a 1 hasta que deja de ser menor que 4.', `x = 1\nwhile x < 4:\n    x = x + 1\nprint(x)`),
      mc('¿Qué ocurre al ejecutar este código?', ['Muestra Hola una vez', 'Muestra Hola sin parar', 'Da error', 'No hace nada'], 1, 'True nunca deja de ser verdadero: es un bucle infinito.', `while True:\n    print("Hola")`),
      fi('Completa para cortar el bucle cuando i valga 3.', `for i in range(10):\n    if i == 3:\n        ___\n    print(i)   # 0 1 2`, 'break', 'break sale del bucle inmediatamente.'),
      mc('¿Qué números muestra este código?', ['0 1 2 3', '0 1 3', '0 1', '1 3'], 1, 'Cuando i vale 2, continue salta el print.', `for i in range(4):\n    if i == 2:\n        continue\n    print(i)`),
      mc('¿Cuál es el riesgo de un while mal escrito?', ['Que sea lento de escribir', 'Un bucle infinito', 'Un SyntaxError seguro', 'Ninguno'], 1, 'Si la condición nunca cambia a falsa, el programa no termina.')
    ])
  ]
});
