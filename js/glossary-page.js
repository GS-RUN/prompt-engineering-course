/* ============================================================
   Glossary page renderer — consumes window.GLOSSARY_TERMS produced
   by js/shared/glossary-data.js and paints the dedicated glossary
   module page with anchor IDs (#term-<id>) for inbound deep links.
   v2.3.0 — 2026-05-08
   ============================================================ */

(function () {
  const TERMS = window.GLOSSARY_TERMS;
  const list = document.getElementById('glossary-list');
  if (!TERMS || !list) return;

  function slugForBlock(id) {
    const M = window.COURSE_MANIFEST;
    if (!M) return id;
    const b = M.blocks.find(x => x.id === id);
    return b ? b.slug + '.html' : null;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Render markdown-lite (only `code` for inline code, **bold** for emphasis)
  // because long/short defs sometimes use those.
  function md(s) {
    let out = esc(s);
    out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
    out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return out;
  }

  function termById(id) {
    return TERMS.find(t => t.id === id);
  }

  function render(filter) {
    const f = (filter || '').toLowerCase().trim();
    const filtered = TERMS.filter(t => {
      if (!f) return true;
      const blob = [t.term, t.short.es, t.short.en, t.long.es, t.long.en, ...(t.aliases || [])].join(' ').toLowerCase();
      return blob.includes(f);
    });

    // Group by first letter of canonical term
    const groups = {};
    for (const t of filtered) {
      const first = t.term[0].toUpperCase();
      groups[first] = groups[first] || [];
      groups[first].push(t);
    }

    list.innerHTML = Object.keys(groups).sort().map(letter => `
      <div class="glossary-letter">
        <h2 class="glossary-letter-head">${letter}</h2>
        ${groups[letter].map(t => {
          const blockHref = slugForBlock(t.block);
          const blockLink = blockHref
            ? `<a class="glossary-block-link" href="${blockHref}">→ Bloque ${t.block}</a>`
            : '';
          const dFn = window.GLOSSARY_DIAGRAMS && window.GLOSSARY_DIAGRAMS[t.id];
          const diagram = (typeof dFn === 'function') ? `
            <div class="glossary-diagram">
              <div class="lang-block" data-lang="es">${dFn('es')}</div>
              <div class="lang-block" data-lang="en">${dFn('en')}</div>
            </div>
          ` : '';
          const example = t.example ? `
            <div class="glossary-example">
              <div class="glossary-example-label">
                <span class="lang-block" data-lang="es">Ejemplo</span>
                <span class="lang-block" data-lang="en">Example</span>
              </div>
              <div class="lang-block" data-lang="es">${md(t.example.es)}</div>
              <div class="lang-block" data-lang="en">${md(t.example.en)}</div>
            </div>
          ` : '';
          const related = (t.related && t.related.length) ? `
            <div class="glossary-related">
              <span class="glossary-related-label">
                <span class="lang-block" data-lang="es">Ver también:</span>
                <span class="lang-block" data-lang="en">See also:</span>
              </span>
              ${t.related.map(rid => {
                const r = termById(rid);
                if (!r) return '';
                return `<a class="glossary-related-link" href="#term-${rid}">${esc(r.term)}</a>`;
              }).join('')}
            </div>
          ` : '';
          return `
            <article class="glossary-term" id="term-${t.id}">
              <header class="glossary-term-head">
                <h3>${esc(t.term)}</h3>
                ${blockLink}
              </header>
              <div class="glossary-long">
                <div class="lang-block" data-lang="es">${md(t.long.es)}</div>
                <div class="lang-block" data-lang="en">${md(t.long.en)}</div>
              </div>
              ${diagram}
              ${example}
              ${related}
            </article>
          `;
        }).join('')}
      </div>
    `).join('');

    // Smooth-scroll to anchor on first render if URL has hash
    if (window.location.hash && window.location.hash.startsWith('#term-')) {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) {
        // Defer to next frame so the freshly inserted element is laid out
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          target.classList.add('glossary-term-highlight');
          setTimeout(() => target.classList.remove('glossary-term-highlight'), 2200);
        });
      }
    }
  }

  render('');

  const search = document.getElementById('glossary-filter');
  if (search) search.addEventListener('input', () => render(search.value));

  // If user navigates via in-page anchor link AFTER first render, also pulse.
  window.addEventListener('hashchange', () => {
    if (window.location.hash.startsWith('#term-')) {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) {
        target.classList.add('glossary-term-highlight');
        setTimeout(() => target.classList.remove('glossary-term-highlight'), 2200);
      }
    }
  });
})();
