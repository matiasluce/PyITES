/**
 * PyITES · Unidad 7 · Herramientas
 * Errores, módulos y comprensiones
 */

import { unit, lesson, lc, mc, fi, od } from '../builders.js';

export const unit07 = unit({
  title: 'Herramientas',
  desc: 'Errores, módulos y comprensiones',
  c: '#6c7bff',
  cd: '#5562d9',
  lessons: [
    lesson('Manejo de errores', '🛡️', [
      lc('Atrapar errores', 'Con <code>try</code> pruebas código riesgoso y con <code>except</code> decides qué hacer si falla, en lugar de que el programa se rompa.', `try:\n    n = int("abc")\nexcept ValueError:\n    print("Eso no es un número")`),
      lc('Errores comunes', '<b>ValueError</b>: valor inválido. <b>ZeroDivisionError</b>: dividir por cero. <b>TypeError</b>: tipo incorrecto. <b>KeyError</b>: clave inexistente. Y <code>finally</code> se ejecuta siempre.', `try:\n    print(10 / 0)\nexcept ZeroDivisionError:\n    print("No se divide por cero")\nfinally:\n    print("Fin")`)
    ], [
      mc('¿Qué muestra este código?', ['hola', 'Error', 'Nada', 'El programa se rompe'], 1, 'int("hola") falla con ValueError y se ejecuta el except.', `try:\n    int("hola")\nexcept ValueError:\n    print("Error")`),
      mc('¿Qué error produce 10 / 0?', ['ValueError', 'ZeroDivisionError', 'TypeError', 'NameError'], 1, 'Dividir por cero levanta ZeroDivisionError.'),
      fi('Completa la palabra clave que atrapa el error.', `try:\n    x = 1 / 0\n___ ZeroDivisionError:\n    print("Uy")`, 'except', 'except define qué hacer cuando ocurre el error.'),
      mc('¿Cuándo se ejecuta el bloque finally?', ['Solo si hay error', 'Solo si no hay error', 'Siempre', 'Nunca'], 2, 'finally se ejecuta haya error o no.'),
      mc('¿Qué muestra este código?', ['1', 'None', 'No existe', 'Se rompe'], 2, 'La clave "b" no existe: KeyError y se ejecuta el except.', `d = {"a": 1}\ntry:\n    print(d["b"])\nexcept KeyError:\n    print("No existe")`),
      mc('¿Qué error produce "5" + 3?', ['ValueError', 'TypeError', 'SyntaxError', 'Ninguno, da 8'], 1, 'No se puede sumar un texto con un número: TypeError.')
    ]),
    lesson('Módulos e import', '📦', [
      lc('Código de otros', 'Python trae <b>módulos</b> listos para usar. Los traes con <code>import</code>.', `import math\nprint(math.sqrt(16))   # 4.0\nprint(math.pi)         # 3.14159...`),
      lc('random y from', '<code>random</code> genera azar. Con <code>from ... import</code> traes solo lo que necesitas.', `import random\nprint(random.randint(1, 6))   # un dado\n\nfrom math import sqrt\nprint(sqrt(25))   # 5.0`)
    ], [
      mc('¿Qué palabra trae un módulo a tu programa?', ['use', 'import', 'include', 'load'], 1, 'Los módulos se traen con import.'),
      mc('¿Qué muestra este código?', ['3', '3.0', '9', 'Error'], 1, 'sqrt devuelve un float: 3.0.', `import math\nprint(math.sqrt(9))`),
      fi('Completa la palabra que falta.', `___ random\nprint(random.randint(1, 6))`, 'import', 'Sin import, Python no conoce el módulo random.'),
      mc('¿Qué módulo usarías para obtener un número al azar?', ['math', 'random', 'time', 'os'], 1, 'random sirve para generar valores aleatorios.'),
      mc('¿Qué muestra este código?', ['2', '2.0', '4', 'Error'], 1, 'sqrt(4) devuelve 2.0.', `from math import sqrt\nprint(sqrt(4))`),
      od('Importa solo pi desde math.', ['from', 'math', 'import', 'pi'], 'La forma es from módulo import nombre.')
    ]),
    lesson('Comprensiones de listas', '✨', [
      lc('Listas en una línea', 'Una <b>list comprehension</b> crea una lista nueva a partir de otra de forma compacta.', `cuadrados = [n * n for n in range(5)]\nprint(cuadrados)   # [0, 1, 4, 9, 16]`),
      lc('Con filtro', 'Puedes agregar un <code>if</code> al final para quedarte solo con lo que cumple.', `pares = [n for n in range(10) if n % 2 == 0]\nprint(pares)   # [0, 2, 4, 6, 8]`)
    ], [
      mc('¿Qué muestra este código?', ['[0, 2, 4, 6]', '[2, 4, 6, 8]', '[0, 1, 2, 3]', '[0, 2, 4]'], 0, 'Multiplica por 2 cada número de 0 a 3.', `print([x * 2 for x in range(4)])`),
      mc('¿Qué muestra este código?', ['[3, 4, 5]', '[4, 5]', '[4, 5, 6]', '[0, 1, 2, 3]'], 1, 'Solo pasan los números mayores que 3 dentro de range(6).', `print([n for n in range(6) if n > 3])`),
      fi('Completa para obtener los cuadrados.', `nums = [___ for n in range(3)]\nprint(nums)   # [0, 1, 4]`, ['n * n', 'n*n', 'n ** 2', 'n**2'], 'Cada n se eleva al cuadrado.'),
      mc('¿Qué muestra este código?', [`['A', 'B', 'C']`, 'ABC', `['abc']`, 'Error'], 0, 'Recorre cada letra y la pasa a mayúscula.', `letras = [c.upper() for c in "abc"]\nprint(letras)`),
      mc('¿Qué ventaja tienen las comprensiones?', ['Son más cortas y legibles en casos simples', 'Siempre son más rápidas que todo', 'Evitan usar listas', 'Reemplazan a las funciones'], 0, 'Resumen en una línea un bucle que arma una lista.')
    ])
  ]
});
