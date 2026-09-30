/**
 * PyITES · Unidad 1 · Primeros pasos
 * Tu primer programa y tus primeras variables
 */

import { unit, lesson, lc, mc, fi, od } from '../builders.js';

export const unit01 = unit({
  title: 'Primeros pasos',
  desc: 'Tu primer programa y tus primeras variables',
  c: '#58cc02',
  cd: '#46a302',
  lessons: [
    lesson('Hola, mundo', '👋', [
      lc('Tu primer programa', 'Python se lee casi como el inglés. Para mostrar algo en pantalla usamos la función <b>print()</b>.', `print("¡Hola, mundo!")`),
      lc('Texto entre comillas', 'El texto va entre comillas <code>" "</code> o <code>\' \'</code>. A ese tipo de dato se le llama <b>string</b> (cadena de texto).', `print("Me llamo Ana")\nprint('Python es genial')`)
    ], [
      mc('¿Qué función muestra texto en la pantalla?', ['show()', 'print()', 'echo()', 'display()'], 1, 'print() muestra en pantalla lo que pongas entre paréntesis.'),
      mc('¿Qué se muestra al ejecutar este código?', ['print("Hola")', 'Hola', '"Hola"', 'Error'], 1, 'Las comillas indican que es texto, pero no se muestran en pantalla.', `print("Hola")`),
      fi('Completa el código para mostrar el mensaje.', `___("Buenos días")`, 'print', 'La función que muestra texto es print.'),
      od('Ordena las piezas para mostrar Hola.', ['print(', '"Hola"', ')'], 'Primero la función, luego el texto y al final el paréntesis que cierra.', ''),
      mc('¿Cuál línea está escrita correctamente?', [`print("Hola)`, `print("Hola")`, `Print("Hola")`, `print(Hola")`], 1, 'Python distingue mayúsculas de minúsculas y las comillas deben abrirse y cerrarse.'),
      mc('¿Qué muestra este programa?', ['HolaAdiós en una línea', 'Hola y, debajo, Adiós', 'Solo Hola', 'Error'], 1, 'Cada print() escribe en una línea nueva.', `print("Hola")\nprint("Adiós")`)
    ]),
    lesson('Comentarios y errores', '💬', [
      lc('Notas para humanos', 'Todo lo que va después de <code>#</code> es un <b>comentario</b>: Python lo ignora. Sirve para explicar tu código.', `# Esto es un comentario\nprint("Hola")  # también aquí`),
      lc('Los errores no dan miedo', 'Cuando algo está mal escrito, Python te avisa con un mensaje de error. Leerlo te dice qué corregir. Por ejemplo, un paréntesis sin cerrar produce un <b>SyntaxError</b>.', `print("Hola"\n# SyntaxError: '(' was never closed`)
    ], [
      mc('¿Qué símbolo inicia un comentario en Python?', ['//', '#', '--', '/*'], 1, 'En Python los comentarios empiezan con #.'),
      mc('¿Qué muestra este programa?', ['Hola', 'Chau', 'Hola y Chau', 'Nada'], 1, 'La primera línea es un comentario y Python la ignora.', `# print("Hola")\nprint("Chau")`),
      fi('Escribe el símbolo que falta para comentar la línea.', `___ Esto es un comentario`, '#', 'El # convierte el resto de la línea en comentario.'),
      mc('¿Qué error obtienes si olvidas cerrar un paréntesis?', ['NameError', 'SyntaxError', 'ValueError', 'Ninguno'], 1, 'Un error de escritura del código es un SyntaxError (error de sintaxis).'),
      od('Ordena: primero el comentario y luego el print.', ['# Saludo inicial', 'print("Hola")'], 'El comentario explica lo que viene a continuación.', '\n'),
      mc('¿Para qué sirven los comentarios?', ['Para que Python los ejecute', 'Para explicar el código a las personas', 'Para acelerar el programa', 'Para guardar datos'], 1, 'Los comentarios son notas para quienes leen el código.')
    ]),
    lesson('Variables', '📦', [
      lc('Cajas con nombre', 'Una <b>variable</b> guarda un valor para usarlo después. Se crea con el signo <code>=</code>.', `nombre = "Sofía"\nedad = 15\nprint(nombre)\nprint(edad)`),
      lc('Reglas de nombres', 'Los nombres pueden llevar letras, números y <code>_</code>, pero no pueden empezar con un número ni tener espacios. Además, Python distingue mayúsculas: <code>edad</code> y <code>Edad</code> son variables distintas.', `mi_puntaje = 100   # ✅ válido\n2jugador = 5       # ❌ empieza con número`)
    ], [
      mc('¿Qué hace la línea x = 5?', ['Compara x con 5', 'Guarda el 5 en la variable x', 'Muestra 5 en pantalla', 'Borra la variable x'], 1, 'El signo = asigna un valor a una variable.'),
      mc('¿Qué muestra este código?', ['a', 'b', '3', 'Error'], 2, 'b recibe una copia del valor de a, que es 3.', `a = 3\nb = a\nprint(b)`),
      mc('¿Cuál es un nombre de variable válido?', ['mi puntaje', '2jugador', 'mi_puntaje', 'mi-puntaje'], 2, 'No se permiten espacios, guiones ni empezar con un número.'),
      fi('Guarda el número 10 en la variable vidas.', `vidas ___ 10`, '=', 'El signo = guarda el valor a su derecha en la variable.'),
      od('Crea la variable y luego muéstrala.', ['color = "azul"', 'print(color)'], 'Primero se crea la variable y después se usa.', '\n'),
      mc('¿Qué muestra este código?', ['5', '8', '13', 'Error'], 1, 'La variable se sobrescribe: se queda con el último valor asignado.', `x = 5\nx = 8\nprint(x)`)
    ])
  ]
});
