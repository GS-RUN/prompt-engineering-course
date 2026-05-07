/* ============================================================
   App v2 — multi-page architecture
   ============================================================
   Defensive instantiation of widgets: only construct an engine if its
   class is loaded on this page (each module page only pulls the JS it
   needs). Theme controller and progress bar are global; intersection
   observers operate on whatever section nodes exist on the page.
   ============================================================ */

window.ThemeController = {
  current: 'dark',
  init() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') this.current = saved;
    this.apply();
  },
  toggle() {
    this.current = this.current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', this.current);
    this.apply();
  },
  apply() {
    document.documentElement.setAttribute('data-theme', this.current);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = this.current === 'dark' ? '🌙' : '☀️';
      btn.setAttribute('title',
        this.current === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    }
  }
};

document.addEventListener('click', (e) => {
  const t = e.target.closest('#theme-toggle');
  if (t) {
    e.preventDefault();
    window.ThemeController.toggle();
  }
});

class App {
  constructor() {
    this.activeSection = null;
    this.visitedBlocks = new Set();
    this.init();
  }

  init() {
    try {
      const saved = JSON.parse(localStorage.getItem('visitedBlocks') || '[]');
      saved.forEach(b => this.visitedBlocks.add(b));
    } catch (e) {}

    // Defensive instantiation — each engine class is only present if its
    // script tag was included on this page.
    this.maybeInstantiate('ExerciseEngine');
    this.maybeInstantiate('PromptSimulator');
    this.maybeInstantiate('DiagramEngine');
    this.maybeInstantiate('QuizEngine');
    this.maybeInstantiate('TokenTools');
    this.maybeInstantiate('PromptDiff');
    this.maybeInstantiate('LinterEngine');
    this.maybeInstantiate('LibraryEngine');
    this.maybeInstantiate('EvolutionEngine');
    this.maybeInstantiate('ProjectPanel');

    if (this.quizEngine && typeof this.quizEngine.attachHandlers === 'function') {
      setTimeout(() => this.quizEngine.attachHandlers(), 100);
    }

    this.setupCopyButtons();
    this.setupProgressBar();
    this.setupSectionAnimations();
    this.markBlockVisited();
  }

  maybeInstantiate(globalName) {
    const Cls = window[globalName];
    if (typeof Cls !== 'function') return;
    try {
      const propName = globalName[0].toLowerCase() + globalName.slice(1);
      this[propName] = new Cls();
    } catch (e) {
      console.warn(`[app] Failed to instantiate ${globalName}:`, e.message);
    }
  }

  setupCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.parentElement.querySelector('code');
        if (!code) return;
        navigator.clipboard.writeText(code.textContent).then(() => {
          const original = btn.textContent;
          btn.textContent = 'Copied!';
          btn.style.background = 'var(--green)';
          setTimeout(() => {
            btn.textContent = original;
            btn.style.background = '';
          }, 1500);
        });
      });
    });
  }

  setupProgressBar() {
    const bar = document.getElementById('progress-bar');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress + '%';
    });
  }

  setupSectionAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('#content section, #main section').forEach(s => observer.observe(s));
  }

  markBlockVisited() {
    const blockId = document.body?.dataset?.pageBlock;
    if (!blockId || blockId === 'home' || blockId === 'glossary') return;
    if (!this.visitedBlocks.has(blockId)) {
      this.visitedBlocks.add(blockId);
      try {
        localStorage.setItem('visitedBlocks', JSON.stringify([...this.visitedBlocks]));
      } catch (e) {}
    }
  }
}

window.ThemeController.init();

document.addEventListener('DOMContentLoaded', () => {
  window.ThemeController.init();
  window.app = new App();
});
