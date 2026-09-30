/**
 * PyITES · Unidad 2 · Datos y operaciones
 * Tipos de datos, matemática y texto
 */

import { unit, lesson, lc, mc, fi, od } from '../builders.js';

export const unit02 = unit({
  title: 'Datos y operaciones',
  desc: 'Tipos de datos, matemática y texto',
  c: '#1cb0f6',
  cd: '#1899d6',
  lessons: [
    lesson('Tipos de datos', '🧩', [
      lc('Cada dato tiene un tipo', 'Los tipos básicos son <b>int</b> (enteros), <b>float</b> (decimales), <b>str</b> (texto) y <b>bool</b> (verdadero o falso).', `edad = 15          # int\naltura = 1.72      # float\nnombre = "Leo"     # str\nes_alumno = True   # bool`),
      lc('Consultar el tipo', 'Con <code>type()</code> le preguntas a Python de qué tipo es un valor.', `print(type(3.5))   # <class 'float'>`)
    ], [
      mc('¿De qué tipo es el valor 42?', ['int', 'float', 'str', 'bool'], 0, 'Es un número entero: int.'),
      mc('¿De qué tipo es el valor "42"?', ['int', 'float', 'str', 'bool'], 2, 'Está entre comillas, así que es texto (str).'),
      mc('¿De qué tipo es 3.14?', ['int', 'float', 'str', 'bool'], 1, 'Los números con punto decimal son float.'),
      mc('¿Cuál de estos valores es un booleano?', ['"True"', 'True', '1.0', '"Sí"'], 1, 'True y False (sin comillas) son los valores booleanos.'),
      fi('Completa para mostrar el tipo de la variable.', `precio = 9.99\nprint(___(precio))`, 'type', 'type() devuelve el tipo del valor.'),
      mc('¿Son del mismo tipo x e y?', ['Sí, ambos son int', 'No: x es str e y es int', 'Sí, ambos son str', 'No: x es float'], 1, '"5" con comillas es texto; 5 sin comillas es un entero.', `x = "5"\ny = 5`)
    ]),
    lesson('Operadores matemáticos', '➕', [
      lc('Calculadora', 'Python suma <code>+</code>, resta <code>-</code>, multiplica <code>*</code> y divide <code>/</code>. También tiene potencia <code>**</code>, división entera <code>//</code> y resto <code>%</code>.', `print(7 + 3)   # 10\nprint(2 ** 3)  # 8\nprint(7 // 2)  # 3\nprint(7 % 2)   # 1`),
      lc('Orden de operaciones', 'Igual que en matemática: primero los paréntesis, luego las potencias, después <code>*</code> y <code>/</code>, y al final <code>+</code> y <code>-</code>.', `print(2 + 3 * 4)    # 14\nprint((2 + 3) * 4)  # 20`)
    ], [
      mc('¿Qué muestra este código?', ['6', '14', '104', 'Error'], 0, '10 - 4 = 6.', `print(10 - 4)`),
      mc('¿Qué muestra este código?', ['8', '6', '16', '24'], 2, '2 ** 4 significa 2 elevado a la 4: 16.', `print(2 ** 4)`),
      mc('¿Qué muestra este código?', ['4.5', '4', '5', '1'], 1, '// es la división entera: descarta los decimales.', `print(9 // 2)`),
      mc('¿Qué muestra este código?', ['4', '1', '0', '2'], 1, '% devuelve el resto: 9 dividido 2 da 4 y sobra 1.', `print(9 % 2)`),
      mc('¿Qué muestra este código?', ['20', '14', '24', '9'], 1, 'Primero se multiplica (3 * 4 = 12) y luego se suma 2.', `print(2 + 3 * 4)`),
      fi('Completa con el operador que devuelve el resto.', `print(17 ___ 5)   # muestra 2`, '%', '17 dividido 5 da 3 y sobra 2.'),
      mc('¿Qué muestra este código?', ['5', '5.0', '2', 'Error'], 1, 'La división con / siempre devuelve un float.', `print(10 / 2)`)
    ]),
    lesson('Cadenas de texto', '🔤', [
      lc('Unir y repetir', 'Con <code>+</code> unes textos y con <code>*</code> los repites.', `print("Hola " + "Ana")  # Hola Ana\nprint("ja" * 3)         # jajaja`),
      lc('f-strings', 'Pon una <code>f</code> antes de las comillas y usa <code>{ }</code> para meter variables dentro del texto.', `nombre = "Ana"\nprint(f"Hola, {nombre}!")`),
      lc('Herramientas útiles', '<code>len()</code> cuenta los caracteres. <code>.upper()</code> y <code>.lower()</code> cambian a mayúsculas o minúsculas.', `palabra = "python"\nprint(len(palabra))     # 6\nprint(palabra.upper())  # PYTHON`)
    ], [
      mc('¿Qué muestra este código?', ['ja3', 'jajaja', 'ja ja ja', 'Error'], 1, 'El * repite el texto 3 veces.', `print("ja" * 3)`),
      mc('¿Qué muestra este código?', ['Py thon', 'Python', 'Py+thon', 'Error'], 1, 'El + pega los textos sin agregar espacios.', `print("Py" + "thon")`),
      mc('¿Qué muestra este código?', ['Hola, nombre', 'Hola, {nombre}', 'Hola, Leo', 'Error'], 2, 'Dentro de un f-string, {nombre} se reemplaza por el valor de la variable.', `nombre = "Leo"\nprint(f"Hola, {nombre}")`),
      fi('Completa para contar los caracteres del texto.', `texto = "hola"\nprint(___(texto))   # muestra 4`, 'len', 'len() devuelve la cantidad de elementos o caracteres.'),
      fi('Completa para pasar el texto a mayúsculas.', `print("hola".___())   # HOLA`, ['upper', 'upper()'], '.upper() convierte a mayúsculas.'),
      od('Arma el saludo con un f-string.', ['print(', 'f"Hola, {nombre}"', ')'], 'La f antes de las comillas activa las llaves { }.', '')
    ])
  ]
});
