#!/usr/bin/env node
/* ============================================================
   split_modules.js — extract every section listed in the manifest
   into its own module HTML page under modules/.

   Idempotent: regenerating overwrites the previous output.
   Run from the repo root: `node scripts/split_modules.js`
   ============================================================ */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const HTML = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const MANIFEST_SRC = fs.readFileSync(path.join(ROOT, 'js/shared/manifest.js'), 'utf8');

// Evaluate manifest in a sandbox to extract COURSE_MANIFEST.
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(MANIFEST_SRC, sandbox);
const MANIFEST = sandbox.window.COURSE_MANIFEST;

// ---------- helpers ----------

function extractSection(html, id) {
  // Match opening <section id="X" ...> up to its matching </section>.
  // The course HTML uses one section per id (no nesting), so this is safe.
  const re = new RegExp(
    `<section\\s+id=\\"${id}\\"[^>]*>([\\s\\S]*?)</section>`,
    'm'
  );
  const m = html.match(re);
  if (!m) return null;
  return m[0]; // include the section wrapper
}

function pageShell({ block, contentHtml }) {
  const titleEs = block.title.es;
  const titleEn = block.title.en;
  const objectivesEs = (block.objectives.es || []).map(o => `        <li>${o}</li>`).join('\n');
  const objectivesEn = (block.objectives.en || []).map(o => `        <li>${o}</li>`).join('\n');
  const moduleScripts = scriptsForBlock(block);

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${titleEs} — Prompt Engineering Master Course</title>
<link rel="stylesheet" href="../css/style.css?v=8">
<link rel="stylesheet" href="../css/bando-b.css?v=8">
<script>
  (function() {
    try {
      var t = localStorage.getItem('theme');
      if (t !== 'dark' && t !== 'light') t = 'dark';
      document.documentElement.setAttribute('data-theme', t);
    } catch(e) { document.documentElement.setAttribute('data-theme', 'dark'); }
  })();
</script>
</head>
<body data-page-block="${block.id}">

<div class="bg-orb bg-orb-1"></div>
<div class="bg-orb bg-orb-2"></div>
<div class="bg-orb bg-orb-3"></div>
<div class="bg-gradient"></div>
<div class="bg-grid"></div>
<div id="progress-bar"></div>

<div id="app">
<nav id="sidebar"></nav>

<main id="content">

<section class="module-front-matter" data-module-front>
  <div class="module-meta">
    <span class="module-icon">${block.icon}</span>
    <span class="module-level level-${block.level}">${block.level}</span>
    <span class="module-time">⏱️ ${block.timeMinutes} min</span>
  </div>
  <h1 class="module-title">
    <span class="lang-block" data-lang="es">${titleEs}</span>
    <span class="lang-block" data-lang="en">${titleEn}</span>
  </h1>
  <div class="module-objectives">
    <div class="lang-block" data-lang="es">
      <h3>Objetivos de aprendizaje</h3>
      <ul>
${objectivesEs}
      </ul>
    </div>
    <div class="lang-block" data-lang="en">
      <h3>Learning objectives</h3>
      <ul>
${objectivesEn}
      </ul>
    </div>
  </div>
</section>

${contentHtml}

<section class="module-references">
  <h3 data-i18n="ref-header">Referencias</h3>
  <p style="font-size:13px;color:var(--text-dim);" data-i18n="ref-intro">
    Documentación oficial y papers consultados durante este módulo. Revísalos para profundizar.
  </p>
  <ul class="references-list" data-references="${block.id}"></ul>
</section>

</main>
</div>

<script src="../js/shared/manifest.js?v=8"></script>
<script src="../js/shared/sidebar.js?v=8"></script>
<script src="../js/shared/references.js?v=8"></script>
<script src="../js/i18n.js?v=8"></script>
${moduleScripts}
<script src="../js/app.js?v=8"></script>
</body>
</html>
`;
}

function scriptsForBlock(block) {
  const tags = [];
  // Per-block extra scripts based on which interactive widgets the sections need.
  const ids = block.sections;
  const need = (sids) => sids.some(id => ids.includes(id));

  // Diagrams (block 02 has s35-s37)
  if (need(['s35', 's36', 's37'])) tags.push('<script src="../js/diagrams.js?v=8"></script>');
  // Exercises (block 02 has s30-s34)
  if (need(['s30', 's31', 's32', 's33', 's34'])) tags.push('<script src="../js/exercises.js?v=8"></script>');
  // Simulator (s33)
  if (ids.includes('s33')) tags.push('<script src="../js/simulator.js?v=8"></script>');
  // Workshop block — Bando B widgets
  if (ids.includes('proj')) tags.push('<script src="../js/project.js?v=8"></script>');
  if (ids.includes('linter')) tags.push('<script src="../js/linter.js?v=8"></script>');
  if (ids.includes('library')) tags.push('<script src="../js/library.js?v=8"></script>');
  if (ids.includes('evolution')) tags.push('<script src="../js/evolution.js?v=8"></script>');
  // Tools page
  if (ids.includes('s52') || ids.includes('s53') || ids.includes('s54')) {
    tags.push('<script src="../js/token-tools.js?v=8"></script>');
    tags.push('<script src="../js/prompt-diff.js?v=8"></script>');
  }
  // Quiz can appear on any module — include globally for simplicity
  tags.push('<script src="../js/quiz.js?v=8"></script>');
  // Glossary helper (popovers)
  tags.push('<script src="../js/glossary.js?v=8"></script>');
  return tags.join('\n');
}

// ---------- main loop ----------

let totalSections = 0;
let missing = [];

for (const block of MANIFEST.blocks) {
  if (!block.sections || block.sections.length === 0) {
    // Skip blocks without legacy sections (orientation, glossary, capstone stub)
    continue;
  }
  let body = '';
  for (const sid of block.sections) {
    const sec = extractSection(HTML, sid);
    if (!sec) {
      missing.push({ block: block.id, section: sid });
      continue;
    }
    body += sec + '\n\n';
    totalSections++;
  }
  const out = pageShell({ block, contentHtml: body });
  const outPath = path.join(ROOT, 'modules', `${block.slug}.html`);
  fs.writeFileSync(outPath, out, 'utf8');
  console.log(`Wrote ${block.slug}.html (${block.sections.length} sections, ${(out.length / 1024).toFixed(1)} KB)`);
}

console.log(`\nTotal sections placed: ${totalSections}`);
if (missing.length) {
  console.log('Missing sections:', missing);
}
