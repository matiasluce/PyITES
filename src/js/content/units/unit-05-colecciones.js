/**
 * PyITES · Unidad 5 · Colecciones
 * Listas, diccionarios, tuplas y sets
 */

import { unit, lesson, lc, mc, fi, od } from '../builders.js';

export const unit05 = unit({
  title: 'Colecciones',
  desc: 'Listas, diccionarios, tuplas y sets',
  c: '#00cd9c',
  cd: '#00a87f',
  lessons: [
    lesson('Listas', '📋', [
      lc('Varios valores en uno', 'Una <b>lista</b> guarda varios elementos entre corchetes. Cada uno tiene un índice que empieza en <b>0</b>.', `frutas = ["manzana", "pera", "uva"]\nprint(frutas[0])    # manzana\nprint(frutas[-1])   # uva\nprint(len(frutas))  # 3`),
      lc('Modificar listas', '<code>.append()</code> agrega al final, <code>.remove()</code> quita un valor y <code>.pop()</code> saca el último.', `frutas.append("kiwi")\nfrutas.remove("pera")\nprint(frutas)  # ['manzana', 'uva', 'kiwi']`)
    ], [
      mc('¿Qué muestra este código?', ['10', '20', '30', 'Error'], 0, 'El primer elemento está en el índice 0.', `nums = [10, 20, 30]\nprint(nums[0])`),
      mc('¿Qué muestra este código?', ['10', '20', '30', 'Error'], 2, 'El índice -1 es el último elemento.', `nums = [10, 20, 30]\nprint(nums[-1])`),
      mc('¿Qué muestra este código?', ['3', '4', '7', 'Error'], 1, 'len() cuenta los elementos: hay 4.', `print(len([4, 5, 6, 7]))`),
      fi('Completa para agregar "azul" al final de la lista.', `colores = ["rojo"]\ncolores.___("azul")\nprint(colores)   # ['rojo', 'azul']`, 'append', '.append() agrega un elemento al final.'),
      mc('¿Qué números muestra este código?', ['1 2 3', '2 4 6', '2 4', 'Error'], 1, 'Recorre la lista y muestra cada elemento multiplicado por 2.', `l = [1, 2, 3]\nfor x in l:\n    print(x * 2)`),
      mc('¿Qué índice tiene el primer elemento de una lista?', ['1', '0', '-1', 'Depende'], 1, 'En Python los índices empiezan en 0.')
    ]),
    lesson('Diccionarios', '🗂️', [
      lc('Clave y valor', 'Un <b>diccionario</b> guarda pares <code>clave: valor</code> entre llaves. Accedes al valor con su clave.', `alumno = {"nombre": "Ana", "edad": 15}\nprint(alumno["nombre"])   # Ana\nalumno["edad"] = 16\nalumno["curso"] = "Python"`),
      lc('Recorrer un diccionario', '<code>.items()</code> te entrega la clave y el valor a la vez.', `for clave, valor in alumno.items():\n    print(clave, valor)`)
    ], [
      mc('¿Qué muestra este código?', ['1', '2', '"b"', 'Error'], 1, 'd["b"] devuelve el valor asociado a la clave "b".', `d = {"a": 1, "b": 2}\nprint(d["b"])`),
      mc('¿Qué símbolos delimitan un diccionario?', ['[ ]', '( )', '{ }', '< >'], 2, 'Los diccionarios se escriben entre llaves.'),
      mc('¿Qué muestra este código?', ['1', '2', '3', 'Error'], 1, 'Se agregó una clave nueva, así que el diccionario tiene 2 pares.', `p = {"nombre": "Leo"}\np["edad"] = 15\nprint(len(p))`),
      fi('Completa con la clave para obtener el 5.', `p = {"x": 5}\nprint(p[___])`, ['"x"', "'x'"], 'Las claves de texto se escriben entre comillas.'),
      mc('¿Para qué sirve .items()?', ['Contar elementos', 'Obtener pares clave-valor', 'Borrar todo', 'Ordenar'], 1, '.items() devuelve cada clave junto con su valor.'),
      mc('¿Puede un diccionario tener claves repetidas?', ['Sí, siempre', 'No: la última reemplaza a la anterior', 'Solo con números', 'Solo con textos'], 1, 'Cada clave es única; si se repite, se queda con el último valor.')
    ]),
    lesson('Tuplas y sets', '🧰', [
      lc('Tuplas: listas inmutables', 'Una <b>tupla</b> usa paréntesis y <b>no se puede modificar</b> después de creada.', `punto = (3, 5)\nprint(punto[0])   # 3\npunto[0] = 9      # ❌ TypeError`),
      lc('Sets: sin repetidos', 'Un <b>set</b> (conjunto) usa llaves y no guarda elementos repetidos.', `s = {1, 2, 2, 3, 3}\nprint(s)   # {1, 2, 3}`)
    ], [
      mc('¿Qué colección no se puede modificar?', ['list', 'tuple', 'dict', 'Todas se pueden'], 1, 'Las tuplas son inmutables.'),
      mc('¿Qué muestra este código?', ['2', '3', '5', 'Error'], 1, 'El set descarta repetidos: queda {1, 2, 3}.', `print(len({1, 1, 2, 2, 3}))`),
      mc('¿Qué ocurre al ejecutar este código?', ['Cambia a 10', 'Da TypeError', 'No hace nada', 'Muestra 1'], 1, 'Las tuplas no admiten asignación: da TypeError.', `t = (1, 2, 3)\nt[0] = 10`),
      mc('¿Cómo quitas los repetidos de una lista?', ['sorted(lista)', 'set(lista)', 'len(lista)', 'tuple(lista)'], 1, 'Convertirla en set elimina los duplicados.'),
      fi('Completa con el índice para obtener el 4.', `coords = (4, 7)\nprint(coords[___])`, '0', 'El primer elemento está en el índice 0.')
    ])
  ]
});
