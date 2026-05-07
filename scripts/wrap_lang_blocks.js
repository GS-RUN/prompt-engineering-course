#!/usr/bin/env node
// One-shot: wraps each <section id="sNN"> body in <div class="lang-block" data-lang="es">
// and inserts an empty <div class="lang-block" data-lang="en"></div> sibling.
// Idempotent: skips sections that already have a lang-block.

const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(HTML_PATH, 'utf8');

// Match <section id="sNN"> ... </section> blocks (only numeric s-IDs)
const sectionRe = /<section id="(s\d+)">([\s\S]*?)<\/section>/g;

let modified = 0;
let skipped = 0;

html = html.replace(sectionRe, (full, id, body) => {
  if (body.includes('class="lang-block"')) {
    skipped++;
    return full;
  }

  // Find split point: after the last of (h2, p.subtitle) at root level.
  // Strategy: locate end of <h2>...</h2> first, then optional <p class="subtitle">...</p>.
  let splitIdx = 0;
  const h2End = body.indexOf('</h2>');
  if (h2End >= 0) {
    splitIdx = h2End + '</h2>'.length;
    // Look for subtitle right after (optional whitespace)
    const after = body.slice(splitIdx);
    const subMatch = after.match(/^\s*<p class="subtitle">[\s\S]*?<\/p>/);
    if (subMatch) {
      splitIdx += subMatch[0].length;
    }
  }

  const head = body.slice(0, splitIdx);
  const rest = body.slice(splitIdx);

  // Build wrapped body
  const wrapped =
    head +
    '\n<div class="lang-block" data-lang="es">' +
    rest +
    '\n</div>\n<div class="lang-block" data-lang="en">\n<!-- TODO: English translation for ' + id + ' -->\n</div>\n';

  modified++;
  return `<section id="${id}">${wrapped}</section>`;
});

fs.writeFileSync(HTML_PATH, html, 'utf8');
console.log(`Done. Modified: ${modified} sections. Skipped (already wrapped): ${skipped}.`);
