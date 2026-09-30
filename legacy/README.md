# legacy

`pyites-original.html` es el archivo único del que salió este proyecto: 1.051 líneas
con todo el CSS, el JavaScript y las 23 lecciones dentro. Se conserva solo como
referencia histórica.

**No lo abras esperando que funcione igual:** es la versión anterior a la división en
módulos y no recibe mantenimiento.

| | Antes | Ahora |
| --- | --- | --- |
| Entrada | `pyites.html` (87 KB) | `index.html` + `src/` |
| Estilos | `<style>` en la cabecera | 8 hojas en `src/styles/` |
| Lógica | un `<script>` giant | 20 módulos ES en `src/js/` |
| Para compartir | copiar el archivo a mano | `npm run build` |

La versión vigente está en la raíz del proyecto y la versión de un solo archivo se
genera en `dist/pyites.html`.
