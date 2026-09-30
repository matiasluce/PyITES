/**
 * PyITES · tools/build
 * Genera dist/pyites.html: una copia de un solo archivo con todo el CSS
 * y el JavaScript embebidos, para poder compartirla o abrirla con doble clic.
 *
 *   npm run build
 *
 * Es un empaquetador mínimo a propósito, sin dependencias: resuelve el
 * grafo de módulos ES, concatena en orden topológico y quita las palabras
 * clave import/export. Los módulos deben exportarse solo con nombres
 * (sin `export default` ni `export * from`). */

import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ENTRY_HTML = resolve(ROOT, 'index.html');
const DIST_DIR = resolve(ROOT, 'dist');
const OUTPUT = resolve(DIST_DIR, 'pyites.html');

/* ----------------------------------------------------------------
   Empaquetador de módulos ES
   ---------------------------------------------------------------- */

/**
 * import { a, b } from './x.js';
 * import * as ns from './x.js';
 * import './x.js';
 *
 * Grupo 1: lo que se importa (o undefined si es solo por efecto).
 * Grupo 3: el especificador.
 */
const IMPORT_RE = /^[ \t]*import\s+(?:([\s\S]*?)\sfrom\s+)?(['"])([^'"]+)\2[ \t]*;?[ \t]*$/gm;

/** export const x = ... / export function f() {} / export let s = null */
const EXPORT_DECL_RE = /^export\s+(const|let|var|function|class|async\s+function)\b/gm;

/** Los nombres que un módulo exporta con `export const|function|...`. */
const EXPORT_NAME_RE = /^export\s+(?:const|let|var|function|class|async\s+function)\s+([A-Za-z_$][\w$]*)/gm;

/** export { a, b as c }; */
const EXPORT_LIST_RE = /^[ \t]*export\s*\{([^}]*)\}[ \t]*;?[ \t]*$/gm;

/** Declaraciones de primer nivel, para detectar nombres repetidos al concatenar. */
const TOP_LEVEL_DECL_RE = /^(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/gm;

/** Quita las sentencias de importación y las palabras clave export. */
const stripModuleSyntax = code => {
  if (/^\s*export\s+default\b/m.test(code)) {
    throw new Error('`export default` no está soportado. Usa exportaciones con nombre.');
  }
  if (/^\s*export\s*\*/m.test(code)) {
    throw new Error('`export * from` no está soportado. Reexporta los nombres uno a uno.');
  }

  const stripped = code
    .replace(IMPORT_RE, '')
    .replace(EXPORT_LIST_RE, '')
    .replace(EXPORT_DECL_RE, '$1');

  // Si queda algo sin quitar, mejor fallar aquí que romper en el navegador.
  const leftover = stripped.match(/^[ \t]*(import|export)\b.*/m);
  if (leftover) {
    throw new Error(`No se pudo eliminar la sentencia: ${leftover[0].trim()}`);
  }

  return stripped.replace(/\n{3,}/g, '\n\n').trim();
};

/** Lista de nombres que un módulo publica, para reconstruir `import * as ns`. */
const collectExports = code => {
  const names = [...code.matchAll(EXPORT_NAME_RE)].map(([, name]) => name);

  for (const [, list] of code.matchAll(EXPORT_LIST_RE)) {
    for (const item of list.split(',')) {
      const match = item.trim().match(/^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/);
      if (match) names.push(match[2] || match[1]);
    }
  }

  return [...new Set(names)];
};

/**
 * Resuelve el grafo de módulos desde `entry` y devuelve los módulos
 * ya concatenados en orden de dependencias.
 *
 * Como todo el bundle comparte un único ámbito, las importaciones con nombre
 * no necesitan nada: basta con quitar la línea. Las de tipo `* as ns`
 * sí necesitan un objeto, que se genera con los nombres exportados.
 *
 * @param {string} entry  ruta absoluta del módulo de entrada
 */
const bundleModules = async entry => {
  const ordered = [];
  const visited = new Set();
  const visiting = new Set();
  const records = new Map();
  const declarations = new Map();

  const walk = async file => {
    if (visited.has(file)) return;
    if (visiting.has(file)) {
      throw new Error(`Importación circular detectada en ${relative(ROOT, file)}`);
    }
    visiting.add(file);

    const source = await readFile(file, 'utf8');
    const record = { file, body: stripModuleSyntax(source), exports: collectExports(source), namespaces: [] };
    records.set(file, record);

    // Detecta nombres de primer nivel repetidos entre módulos.
    for (const [, name] of record.body.matchAll(TOP_LEVEL_DECL_RE)) {
      if (declarations.has(name)) {
        throw new Error(
          `El nombre "${name}" está declarado en dos módulos:\n` +
          `  · ${declarations.get(name)}\n` +
          `  · ${relative(ROOT, file)}\n` +
          'Renombra uno de los dos.'
        );
      }
      declarations.set(name, relative(ROOT, file));
    }

    for (const [, clause, , specifier] of source.matchAll(IMPORT_RE)) {
      if (!specifier.startsWith('.')) {
        throw new Error(`Importación externa no soportada: "${specifier}"`);
      }

      const target = resolve(dirname(file), specifier);
      await walk(target);

      // `import * as ns from '...'` sí necesita código: se reconstruye el objeto.
      const namespace = clause?.match(/^\*\s+as\s+([A-Za-z_$][\w$]*)$/);
      if (namespace) records.get(target).namespaces.push(namespace[1]);
    }

    visiting.delete(file);
    visited.add(file);
    ordered.push(record);
  };

  await walk(entry);

  return ordered
    .map(({ file, body, exports, namespaces }) => {
      const aliases = namespaces.map(local => {
        if (declarations.has(local)) {
          throw new Error(`"${local}" colisiona con ${declarations.get(local)}`);
        }
        declarations.set(local, relative(ROOT, file));
        return `const ${local} = { ${exports.join(', ')} };`;
      });

      return [`/* ===== ${relative(ROOT, file).replace(/\\/g, '/')} ===== */`, body, ...aliases].join('\n\n');
    })
    .join('\n\n');
};

/* ----------------------------------------------------------------
   Fusión con el HTML
   ---------------------------------------------------------------- */

/** Sustituye los <link rel="stylesheet"> locales por un único <style>. */
const inlineStyles = async html => {
  const tags = [...html.matchAll(/<link\s[^>]*rel=["']stylesheet["'][^>]*>/gi)].map(match => match[0]);

  // Los estilos externos (por ejemplo Google Fonts) se dejan intactos.
  const local = tags.filter(tag => {
    const href = tag.match(/href=["']([^"']+)["']/i)?.[1] ?? '';
    return !/^(?:[a-z]+:)?\/\//i.test(href) && !href.startsWith('data:');
  });

  if (local.length === 0) throw new Error('No se encontró ninguna hoja de estilos local en index.html');

  const chunks = [];
  for (const tag of local) {
    const href = tag.match(/href=["']([^"']+)["']/i)[1];
    const css = await readFile(resolve(ROOT, href), 'utf8');
    chunks.push(`/* ===== ${href} ===== */\n${css.trim()}`);
  }

  const style = `<style>\n${chunks.join('\n\n')}\n  </style>`;

  // OJO: al reemplazar con una cadena, `$$`, `$&` o `$'` tienen significado
  // especial en el reemplazo. Se usan funciones para evitarlo.
  let out = html.replace(local[0], () => style);
  for (const tag of local.slice(1)) out = out.replace(tag, () => '');

  return out;
};

/** Sustituye el <script type="module" src="..."> por el bundle en línea. */
const inlineScripts = async html => {
  const script = html.match(/<script\s+type=["']module["'][^>]*src=["']([^"']+)["'][^>]*><\/script>/i);
  if (!script) throw new Error('No se encontró <script type="module" src="..."> en index.html');

  const js = await bundleModules(resolve(ROOT, script[1]));
  // Evita que el navegador cierre el script antes de tiempo.
  const safe = js.replace(/<\/script/gi, () => '<\\/script');

  return html.replace(script[0], () => `<script type="module">\n${safe}\n  </script>`);
};

/* ----------------------------------------------------------------
   Verificación
   ---------------------------------------------------------------- */

/**
 * Comprueba que el JavaScript final sea sintácticamente válido.
 * Se ejecuta como función normal porque el bundle ya no usa import/export.
 */
const verifyBundle = js => {
  try {
    new Function(js);
  } catch (error) {
    throw new Error(`El bundle generado tiene un error de sintaxis:\n  ${error.message}`);
  }

  const seen = new Map();
  for (const [, name] of js.matchAll(TOP_LEVEL_DECL_RE)) {
    if (seen.has(name)) {
      throw new Error(`El bundle declara "${name}" dos veces. Renombra un módulo.`);
    }
    seen.set(name, true);
  }
};

/* ----------------------------------------------------------------
   Ejecución
   ---------------------------------------------------------------- */

const kb = bytes => `${(bytes / 1024).toFixed(1)} KB`;

const html = await readFile(ENTRY_HTML, 'utf8');
const bundled = await inlineScripts(await inlineStyles(html));

// El bundle ya no debe usar import/export ni repetir nombres de primer nivel.
const bundleJs = bundled.match(/<script type="module">\n([\s\S]*?)\n  <\/script>/)?.[1];
if (!bundleJs) throw new Error('No se encontró el script embebido en el HTML generado');
verifyBundle(bundleJs);

await rm(DIST_DIR, { recursive: true, force: true });
await mkdir(DIST_DIR, { recursive: true });
await writeFile(OUTPUT, bundled, 'utf8');

console.log('');
console.log('  PyITES · build completado');
console.log(`  dist/pyites.html  ${kb(Buffer.byteLength(bundled))}  (gzip ${kb(gzipSync(bundled).length)})`);
console.log('  Ábrelo con doble clic o compártelo tal cual.');
console.log('');
