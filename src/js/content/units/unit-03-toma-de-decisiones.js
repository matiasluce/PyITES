/**
 * PyITES · Unidad 3 · Toma de decisiones
 * Entrada de datos, if y lógica
 */

import { unit, lesson, lc, mc, fi, od } from '../builders.js';

export const unit03 = unit({
  title: 'Toma de decisiones',
  desc: 'Entrada de datos, if y lógica',
  c: '#ce82ff',
  cd: '#a568cc',
  lessons: [
    lesson('Entrada del usuario', '⌨️', [
      lc('input()', '<code>input()</code> le pide un dato al usuario. ¡Siempre devuelve texto (str)!', `nombre = input("¿Cómo te llamas? ")\nprint("Hola", nombre)`),
      lc('Convertir tipos', 'Para hacer cuentas con lo que escribe el usuario, primero conviértelo con <code>int()</code> o <code>float()</code>.', `edad = int(input("Edad: "))\nprint(edad + 1)`)
    ], [
      mc('¿Qué tipo de dato devuelve input()?', ['int', 'float', 'str', 'bool'], 2, 'input() siempre entrega texto, aunque el usuario escriba un número.'),
      mc('¿Qué función convierte un texto a número entero?', ['str()', 'int()', 'num()', 'type()'], 1, 'int() convierte a entero.'),
      mc('Si el usuario escribe 4, ¿qué muestra este código?', ['8', '44', 'x + x', 'Error'], 1, 'x es el texto "4", y sumar textos los une: "44".', `x = input()\nprint(x + x)`),
      fi('Completa para convertir la entrada en un entero.', `n = ___(input("Número: "))\nprint(n * 2)`, 'int', 'int() transforma el texto en un número entero.'),
      od('Guarda la edad como número.', ['edad', '=', 'int(input("Edad: "))'], 'Se combina input() dentro de int().'),
      mc('¿Qué muestra este código?', ['34', '7', '3 + 4', 'Error'], 1, 'Se convierten a enteros y luego se suman: 3 + 4 = 7.', `a = int("3")\nb = int("4")\nprint(a + b)`)
    ]),
    lesson('Condicionales if', '🔀', [
      lc('Tomar decisiones', '<code>if</code> ejecuta un bloque solo si la condición es verdadera. No olvides los <code>:</code> ni la indentación (los espacios al inicio).', `edad = 18\nif edad >= 18:\n    print("Eres mayor")\nelse:\n    print("Eres menor")`),
      lc('elif y comparadores', 'Comparadores: <code>==</code> igual, <code>!=</code> distinto, <code>&lt;</code> menor, <code>&gt;</code> mayor, <code>&lt;=</code> y <code>&gt;=</code>. Usa <code>elif</code> para más casos.', `nota = 7\nif nota >= 9:\n    print("Excelente")\nelif nota >= 6:\n    print("Aprobado")\nelse:\n    print("A recuperar")`)
    ], [
      mc('¿Qué operador comprueba si dos valores son iguales?', ['=', '==', '!=', '==='], 1, '= asigna y == compara.'),
      mc('¿Qué muestra este código?', ['A', 'B', 'A y B', 'Nada'], 0, '5 es mayor que 3, así que se ejecuta el bloque del if.', `x = 5\nif x > 3:\n    print("A")\nelse:\n    print("B")`),
      mc('¿Qué muestra este código?', ['Excelente', 'Aprobado', 'A recuperar', 'Error'], 1, '7 no llega a 9, pero sí es mayor o igual a 6.', `nota = 7\nif nota >= 9:\n    print("Excelente")\nelif nota >= 6:\n    print("Aprobado")\nelse:\n    print("A recuperar")`),
      fi('Completa el símbolo que falta al final del if.', `x = 5\nif x > 3___\n    print("Mayor")`, ':', 'Los bloques if terminan la primera línea con dos puntos.'),
      mc('¿Qué error tiene este código?', ['Falta el : al final del if', 'Falta un punto y coma', 'Faltan llaves { }', 'Ninguno'], 0, 'Toda línea if necesita : al final.', `if edad >= 18\n    print("Mayor")`),
      od('Arma el condicional.', ['if x == 10:', '    print("Diez")'], 'La línea de dentro va con indentación.', '\n'),
      mc('¿Cuál expresa "x es distinto de 3"?', ['x <> 3', 'x != 3', 'x =! 3', 'x not= 3'], 1, 'En Python "distinto" se escribe !=.')
    ]),
    lesson('Operadores lógicos', '🧠', [
      lc('and, or, not', '<code>and</code> exige que ambas condiciones sean verdaderas, <code>or</code> que al menos una lo sea y <code>not</code> invierte el resultado.', `edad = 20\ntiene_dni = True\nif edad >= 18 and tiene_dni:\n    print("Puede entrar")`),
      lc('Tabla rápida', 'Estos resultados conviene tenerlos en la cabeza:<br><code>True and False</code> → False<br><code>True or False</code> → True<br><code>not True</code> → False', `print(True and False)  # False\nprint(True or False)   # True\nprint(not True)        # False`)
    ], [
      mc('¿Qué muestra este código?', ['True', 'False', 'None', 'Error'], 1, 'and necesita que ambos sean True.', `print(True and False)`),
      mc('¿Qué muestra este código?', ['True', 'False', 'None', 'Error'], 0, 'or solo necesita que uno sea True.', `print(True or False)`),
      mc('¿Qué muestra este código?', ['True', 'False', 'None', 'Error'], 0, 'not invierte False en True.', `print(not False)`),
      mc('¿Qué muestra este código?', ['True', 'False', '5', 'Error'], 0, '5 es mayor que 3 y menor que 10: ambas son verdaderas.', `x = 5\nprint(x > 3 and x < 10)`),
      fi('Completa para que el mensaje aparezca si la edad está entre 12 y 18.', `edad = 15\nif edad > 12 ___ edad < 18:\n    print("Adolescente")`, 'and', 'Ambas condiciones deben cumplirse: usamos and.'),
      mc('¿Qué muestra este código?', ['True', 'False', '2', 'Error'], 0, 'La primera condición es falsa, pero la segunda es verdadera y or alcanza con una.', `x = 2\nprint(x < 0 or x == 2)`)
    ])
  ]
});
