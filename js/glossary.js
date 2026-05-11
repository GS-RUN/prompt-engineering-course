/* ============================================================
   In-text glossary auto-link wrapper.

   Consumes window.GLOSSARY_INDEX produced by glossary-data.js,
   walks the main content DOM, and wraps every matched term/alias
   in an <a> that:
     - links to ../modules/glossary.html#term-<id>
     - opens in a new tab (target="_blank")
     - shows a hover tooltip with the short definition

   Skips: <pre>, <code>, <script>, <style>, form fields, and any
   ancestor with class "no-gloss".

   v2.3.0 — 2026-05-08
   ============================================================ */

const Glossary = {
  init() {
    if (!window.GLOSSARY_INDEX) {
      console.warn('[glossary] GLOSSARY_INDEX missing; load glossary-data.js first');
      return;
    }
    this.glossaryHref = this.computeGlossaryHref();
    this.attachWrap();
    this.attachTooltip();
  },

  computeGlossaryHref() {
    // Pages under /modules/ link relatively; landing links via modules/.
    const path = window.location.pathname.replace(/\\/g, '/');
    if (path.includes('/modules/')) return 'glossary.html';
    return 'modules/glossary.html';
  },

  attachWrap() {
    const main = document.getElementById('content') || document.querySelector('main');
    if (!main) return;

    // Build a single regex that matches ANY known alias as a whole word (case-insensitive).
    // Sort longest-first so "Chain of Thought" matches before "Chain".
    const aliases = Object.keys(window.GLOSSARY_INDEX).sort((a, b) => b.length - a.length);
    const escaped = aliases.map(a => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    // Use a non-word boundary on each side that also accepts start/end.
    // \b doesn't behave well around dots/dashes, so use look-arounds with safe chars.
    const re = new RegExp('(?<![A-Za-z0-9_.-])(' + escaped.join('|') + ')(?![A-Za-z0-9_.-])', 'gi');

    // Walk only text nodes inside content blocks where wrapping is safe.
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => {
        const p = n.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        const skipTags = ['PRE', 'CODE', 'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'BUTTON', 'OPTION', 'A', 'H1'];
        if (skipTags.includes(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (p.closest('.no-gloss')) return NodeFilter.FILTER_REJECT;
        if (p.closest('.module-references')) return NodeFilter.FILTER_REJECT;
        if (p.closest('.module-front-matter .module-meta')) return NodeFilter.FILTER_REJECT;
        if (p.closest('.gloss-link')) return NodeFilter.FILTER_REJECT;
        // Quiz panels: never wrap glossary links inside quiz questions or options.
        // Reading a quiz with every keyword underlined and tooltips popping up
        // pulls attention away from the question.
        if (p.closest('.quiz-panel')) return NodeFilter.FILTER_REJECT;
        if (p.closest('.knowledge-check')) return NodeFilter.FILTER_REJECT;
        if (!n.textContent.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);

    // Per-section caps: don't link the same term more than 2 times in a row.
    // Use a counter keyed by id within the same parent <section>.
    const sectionCounters = new WeakMap();

    for (const tn of nodes) {
      const section = tn.parentElement.closest('section') || tn.parentElement;
      let counts = sectionCounters.get(section);
      if (!counts) { counts = {}; sectionCounters.set(section, counts); }

      const txt = tn.textContent;
      let lastIdx = 0;
      let matched = false;
      let frag = null;
      // Use matchAll to avoid lastIndex pitfalls
      const matches = [...txt.matchAll(re)];
      if (!matches.length) continue;

      frag = document.createDocumentFragment();
      for (const m of matches) {
        const aliasMatched = m[1];
        const entry = window.GLOSSARY_INDEX[aliasMatched.toLowerCase()];
        if (!entry) continue;
        // Cap per-section
        counts[entry.id] = (counts[entry.id] || 0) + 1;
        if (counts[entry.id] > 2) continue;

        const start = m.index;
        const end = start + aliasMatched.length;
        if (start > lastIdx) frag.appendChild(document.createTextNode(txt.slice(lastIdx, start)));
        const a = document.createElement('a');
        a.className = 'gloss-link';
        a.href = this.glossaryHref + '#term-' + entry.id;
        a.target = '_blank';
        a.rel = 'noopener';
        a.dataset.termId = entry.id;
        a.title = ''; // we use a custom tooltip
        a.textContent = txt.slice(start, end);
        frag.appendChild(a);
        lastIdx = end;
        matched = true;
      }
      if (lastIdx < txt.length) frag.appendChild(document.createTextNode(txt.slice(lastIdx)));
      if (matched && tn.parentNode) {
        tn.parentNode.replaceChild(frag, tn);
      }
    }
  },

  attachTooltip() {
    let tip = document.getElementById('glossary-tooltip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'glossary-tooltip';
      tip.setAttribute('role', 'tooltip');
      document.body.appendChild(tip);
    }

    const lang = () => document.documentElement.getAttribute('data-i18n-lang') || 'es';

    document.addEventListener('mouseover', (e) => {
      const a = e.target.closest('.gloss-link');
      if (!a) return;
      const id = a.dataset.termId;
      const entry = (window.GLOSSARY_TERMS || []).find(t => t.id === id);
      if (!entry) return;
      const short = entry.short[lang()] || entry.short.en || entry.short.es || '';
      tip.innerHTML = `<strong>${entry.term}</strong><span>${short}</span><em>${lang() === 'es' ? 'Click: abrir glosario en nueva pestaña' : 'Click: open glossary in new tab'}</em>`;
      tip.classList.add('show');
    });

    document.addEventListener('mousemove', (e) => {
      if (!tip.classList.contains('show')) return;
      const w = tip.offsetWidth || 360;
      const h = tip.offsetHeight || 120;
      const x = Math.min(e.clientX + 14, window.innerWidth - w - 12);
      const y = Math.min(e.clientY + 14, window.innerHeight - h - 12);
      tip.style.left = x + 'px';
      tip.style.top = y + 'px';
    });

    document.addEventListener('mouseout', (e) => {
      const a = e.target.closest('.gloss-link');
      if (a) tip.classList.remove('show');
    });
  }
};

// Wait until the DOM main content is settled (other widgets may inject content).
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => Glossary.init(), 320);
});
window.Glossary = Glossary;
