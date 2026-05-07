#!/usr/bin/env node
/* One-shot: insert <section id="kc-NN"> before <section class="module-references">
 * in every modules/NN-*.html that doesn't already have one. */

const fs = require('fs');
const path = require('path');

const MODULES = path.join(__dirname, '..', 'modules');
const files = fs.readdirSync(MODULES).filter(f =>
  /^\d{2}-.*\.html$/.test(f) && !f.startsWith('00-') /* skip orientation */
);

let modified = 0, skipped = 0;
for (const f of files) {
  const id = f.slice(0, 2);     // "01", "02", ..., "14"
  const fp = path.join(MODULES, f);
  let html = fs.readFileSync(fp, 'utf8');

  if (html.includes(`id="kc-${id}"`)) { skipped++; continue; }
  if (!html.includes('<section class="module-references">')) { skipped++; continue; }

  const block = `<section id="kc-${id}" class="knowledge-check">
  <h2>
    <span class="lang-block" data-lang="es">📋 Knowledge check</span>
    <span class="lang-block" data-lang="en">📋 Knowledge check</span>
  </h2>
  <p class="lang-block" data-lang="es" style="color:var(--text-dim);">Cinco preguntas para verificar tu comprensión del bloque. Cada respuesta se guarda en localStorage; puedes volver más tarde y recordar tu progreso.</p>
  <p class="lang-block" data-lang="en" style="color:var(--text-dim);">Five questions to verify your understanding of the block. Each answer is saved in localStorage; you can return later and recall your progress.</p>
</section>

`;

  html = html.replace('<section class="module-references">', block + '<section class="module-references">');
  fs.writeFileSync(fp, html, 'utf8');
  modified++;
  console.log(`Added kc-${id} to ${f}`);
}

console.log(`\nModified: ${modified}. Skipped (already had it or no references section): ${skipped}.`);
