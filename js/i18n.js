/* ============================================================
   i18n v2 — multi-page architecture
   ============================================================
   Most translation now happens via parallel <span class="lang-block"
   data-lang="es|en">…</span> nodes that CSS toggles based on
   <html data-i18n-lang>. This file only handles:
     1. Persisting the chosen language in localStorage.
     2. Setting <html data-i18n-lang> on boot and on toggle.
     3. Highlighting the active toggle button.
     4. Translating [data-i18n] elements that don't have lang-blocks
        (small UI strings like sidebar links, footer version label).
   ============================================================ */

const I18N = {
  current: 'es',

  init() {
    // Build dict for [data-i18n] non-lang-block strings
    this.dict = this.buildDict();

    // Restore saved lang or default to ES
    const saved = localStorage.getItem('lang');
    this.current = saved === 'en' ? 'en' : 'es';
    document.documentElement.setAttribute('data-i18n-lang', this.current);

    this.applyDataI18n();
    this.bindToggleButtons();
    this.highlightToggle();
  },

  switchTo(lang) {
    this.current = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('data-i18n-lang', lang);
    this.applyDataI18n();
    this.highlightToggle();
  },

  applyDataI18n() {
    const isEn = this.current === 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (!key) return;
      // Save original text once so we can restore it.
      if (!el.dataset.origText) el.dataset.origText = el.textContent;
      if (isEn && this.dict[key]) {
        el.textContent = this.dict[key];
      } else {
        el.textContent = el.dataset.origText;
      }
    });
  },

  bindToggleButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTo(btn.dataset.lang));
    });
  },

  highlightToggle() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const on = btn.dataset.lang === this.current;
      btn.classList.toggle('active', on);
      btn.style.background = on ? 'var(--accent)' : 'var(--glass)';
      btn.style.color = on ? '#000' : 'var(--text-dim)';
    });
  },

  buildDict() {
    return {
      // Sidebar / generic UI
      'sidebar-subtitle': 'Master Course 2026',
      'sb-glossary': '📚 Glossary',
      'sb-changelog': '📝 Changelog',
      // Hero / landing
      'hero-blocks': 'blocks',
      'hero-hours': 'hours',
      'hero-level': 'Level',
      'stub-soon': 'Coming soon',
      // Footer
      'footer-version': 'Version',
      // References
      'ref-header': 'References',
      'ref-intro': 'Official documentation and papers consulted in this module. Open them to go deeper.',
      // Legacy keys (kept for backward compat with index.legacy.html)
      'footer-copy': '© 2026 Alonso J. Núñez',
      'footer-source': '📦 Source code',
      'footer-issues': '🐛 Report bug'
    };
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // The sidebar script runs synchronously before this, but if it injected
  // elements at end of <body>, they're already in the DOM when DCL fires.
  // Defer one tick so dynamic content from sidebar.js / landing.js / etc.
  // is fully attached before we bind toggles.
  setTimeout(() => I18N.init(), 0);
});

// Expose for debugging
window.I18N = I18N;
