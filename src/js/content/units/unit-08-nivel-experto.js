/**
 * PyITES · Unidad 8 · Nivel experto
 * Clases, funciones avanzadas y archivos
 */

import { unit, lesson, lc, mc, fi, od } from '../builders.js';

export const unit08 = unit({
  title: 'Nivel experto',
  desc: 'Clases, funciones avanzadas y archivos',
  c: '#e6a700',
  cd: '#b98600',
  lessons: [
    lesson('Clases y objetos', '🏗️', [
      lc('Plantillas de objetos', 'Una <b>clase</b> es un molde para crear objetos. <code>__init__</code> se ejecuta al crear el objeto y <code>self</code> es el propio objeto.', `class Perro:\n    def __init__(self, nombre):\n        self.nombre = nombre\n\n    def ladrar(self):\n        print(f"{self.nombre} dice guau")\n\nrex = Perro("Rex")\nrex.ladrar()`),
      lc('Herencia', 'Una clase puede heredar de otra y reutilizar su código.', `class Animal:\n    def hablar(self):\n        print("...")\n\nclass Gato(Animal):\n    def hablar(self):\n        print("Miau")\n\nGato().hablar()   # Miau`)
    ], [
      mc('¿Qué palabra define una clase?', ['class', 'def', 'object', 'new'], 0, 'Las clases se crean con class.'),
      mc('¿Qué método se ejecuta al crear un objeto?', ['__start__', '__init__', '__new_obj__', 'crear()'], 1, '__init__ es el constructor.'),
      mc('¿Qué muestra este código?', ['nombre', 'Luna', 'Perro', 'Error'], 1, 'El objeto guarda "Luna" en self.nombre.', `class Perro:\n    def __init__(self, nombre):\n        self.nombre = nombre\n\np = Perro("Luna")\nprint(p.nombre)`),
      fi('Completa el primer parámetro de los métodos.', `class Coche:\n    def __init__(___, marca):\n        self.marca = marca`, 'self', 'self representa al objeto que se está creando o usando.'),
      mc('¿Qué muestra este código?', ['A', 'B', 'Error', 'Nada'], 0, 'B hereda hola() de A (pass significa "no hacer nada más").', `class A:\n    def hola(self):\n        print("A")\n\nclass B(A):\n    pass\n\nB().hola()`),
      mc('¿Qué es la herencia?', ['Copiar y pegar código', 'Que una clase reutilice y extienda otra', 'Borrar una clase', 'Crear variables globales'], 1, 'La clase hija recibe los métodos de la clase padre.')
    ]),
    lesson('Lambda, map y filter', '🧪', [
      lc('Funciones lambda', 'Una <b>lambda</b> es una función pequeña, de una sola línea y sin nombre propio.', `doble = lambda x: x * 2\nprint(doble(5))   # 10`),
      lc('map y filter', '<code>map</code> aplica una función a cada elemento y <code>filter</code> se queda con los que cumplen una condición.', `nums = [1, 2, 3, 4]\nprint(list(map(lambda x: x * 10, nums)))         # [10, 20, 30, 40]\nprint(list(filter(lambda x: x % 2 == 0, nums)))  # [2, 4]`)
    ], [
      mc('¿Qué muestra este código?', ['4', '5', 'x + 1', 'Error'], 1, 'La lambda suma 1 al valor recibido.', `f = lambda x: x + 1\nprint(f(4))`),
      mc('¿Qué muestra este código?', ['[1, 2, 3]', '[2, 4, 6]', '[2, 3, 4]', 'Error'], 1, 'map aplica la lambda a cada elemento.', `print(list(map(lambda x: x * 2, [1, 2, 3])))`),
      mc('¿Qué muestra este código?', ['[1, 2]', '[3, 4]', '[2, 3, 4]', '[1, 2, 3, 4]'], 1, 'filter conserva los que cumplen x > 2.', `print(list(filter(lambda x: x > 2, [1, 2, 3, 4])))`),
      fi('Completa la palabra clave de la función anónima.', `cuadrado = ___ n: n * n`, 'lambda', 'Las funciones anónimas se crean con lambda.'),
      mc('¿Qué hace filter()?', ['Ordena una lista', 'Conserva los elementos que cumplen una condición', 'Suma los elementos', 'Invierte la lista'], 1, 'filter descarta lo que no cumple la condición.'),
      mc('¿Qué muestra este código?', ['[1, 2, 3]', '[3, 2, 1]', '[3, 1, 2]', 'Error'], 1, 'Se ordena por -x, es decir, de mayor a menor.', `print(sorted([3, 1, 2], key=lambda x: -x))`)
    ]),
    lesson('Archivos y with', '📁', [
      lc('Leer y escribir', '<code>open()</code> abre un archivo. Con <code>with</code> se cierra solo al terminar. Modos: <code>"r"</code> leer, <code>"w"</code> escribir (borra lo anterior) y <code>"a"</code> agregar al final.', `with open("notas.txt", "w") as f:\n    f.write("Hola archivo")\n\nwith open("notas.txt") as f:\n    print(f.read())`)
    ], [
      mc('¿Qué modo abre un archivo para escribir borrando lo anterior?', ['"r"', '"w"', '"a"', '"b"'], 1, '"w" (write) crea o reemplaza el archivo.'),
      mc('¿Qué ventaja tiene with open(...)?', ['Es más rápido', 'Cierra el archivo automáticamente', 'Encripta el archivo', 'Evita errores de sintaxis'], 1, 'with cierra el archivo solo, incluso si hay un error.'),
      fi('Completa el método para escribir en el archivo.', `with open("datos.txt", "w") as f:\n    f.___("Hola")`, 'write', '.write() escribe texto en el archivo.'),
      mc('¿Qué modo agrega texto al final sin borrar lo que había?', ['"r"', '"w"', '"a"', '"x"'], 2, '"a" (append) agrega al final.'),
      mc('¿De qué tipo es la variable texto?', ['list', 'str', 'int', 'file'], 1, '.read() devuelve el contenido como texto.', `with open("a.txt") as f:\n    texto = f.read()`)
    ]),
    lesson('Generadores y decoradores', '🎩', [
      lc('Generadores', 'Un <b>generador</b> usa <code>yield</code> para entregar valores de a uno, sin guardarlos todos en memoria.', `def contar(n):\n    for i in range(n):\n        yield i\n\nfor x in contar(3):\n    print(x)   # 0 1 2`),
      lc('Decoradores', 'Un <b>decorador</b> es una función que envuelve a otra para agregarle comportamiento. Se aplica con <code>@</code>.', `def ruidoso(f):\n    def envoltura():\n        print("Antes")\n        f()\n        print("Después")\n    return envoltura\n\n@ruidoso\ndef hola():\n    print("Hola")\n\nhola()`)
    ], [
      mc('¿Qué palabra convierte una función en generador?', ['return', 'yield', 'gen', 'next'], 1, 'yield entrega un valor y pausa la función.'),
      mc('¿Qué muestra este código?', ['[1]', '[1, 2]', '[2]', 'Error'], 1, 'El generador entrega 1 y luego 2.', `def g():\n    yield 1\n    yield 2\n\nprint(list(g()))`),
      mc('¿Qué muestra hola() con el decorador aplicado?', ['Solo Hola', 'Antes, Hola y Después', 'Antes y Después', 'Error'], 1, 'El decorador envuelve la función con mensajes antes y después.', `@ruidoso\ndef hola():\n    print("Hola")\n\nhola()`),
      mc('¿Qué símbolo aplica un decorador?', ['#', '@', '$', '&'], 1, 'Los decoradores se escriben con @ encima de la función.'),
      mc('¿Cuál es la ventaja principal de un generador?', ['Guarda todos los valores a la vez', 'Produce valores bajo demanda y ahorra memoria', 'Es más corto de escribir', 'Evita usar bucles'], 1, 'Genera cada valor cuando se necesita, sin construir la lista completa.')
    ])
  ]
});
