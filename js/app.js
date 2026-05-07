/* ============================================================
   Main App — Routing, Navigation, State, Theme
   ============================================================ */

/* Theme controller — exposed on window for robust click delegation */
window.ThemeController = {
  current: 'dark',
  init() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      this.current = saved;
    }
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
  },
};

/* Click delegation — sobrevive a re-renders del button + sin depender
 * de timing de ID-existe-cuando-init-corre. */
document.addEventListener('click', (e) => {
  const t = e.target.closest('#theme-toggle');
  if (t) {
    e.preventDefault();
    window.ThemeController.toggle();
  }
});

class App {
  constructor() {
    this.exerciseEngine = null;
    this.promptSimulator = null;
    this.diagramEngine = null;
    this.quizEngine = null;
    this.tokenTools = null;
    this.promptDiff = null;
    this.activeSection = null;
    this.visitedSections = new Set();
    this.init();
  }

  init() {
    // Load visited from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('visitedSections') || '[]');
      saved.forEach(s => this.visitedSections.add(s));
    } catch (e) {}

    // Initialize modules (Three.js bg removed — replaced by CSS orbs)
    this.exerciseEngine = new ExerciseEngine();
    this.promptSimulator = new PromptSimulator();
    this.diagramEngine = new DiagramEngine();
    this.quizEngine = new QuizEngine();
    this.tokenTools = new TokenTools();
    this.promptDiff = new PromptDiff();

    // Wiring
    this.setupNavigation();
    this.setupScrollSpy();
    this.setupCopyButtons();
    setTimeout(() => this.quizEngine.attachHandlers(), 100);
    this.setupProgressBar();
    this.markVisited();
  }

  setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(link.dataset.target);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          this.markVisited(link.dataset.target);
        }
      });
    });
  }

  setupScrollSpy() {
    const sections = document.querySelectorAll('#main section[id]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
          this.updateActiveNav(entry.target.id);
          this.markVisited(entry.target.id);
        }
      });
    }, { rootMargin: '-80px 0px -60% 0px' });

    sections.forEach(s => observer.observe(s));
  }

  updateActiveNav(sectionId) {
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.dataset.target === sectionId);
    });
  }

  markVisited(sectionId) {
    if (sectionId && !this.visitedSections.has(sectionId)) {
      this.visitedSections.add(sectionId);
      try {
        localStorage.setItem('visitedSections', JSON.stringify([...this.visitedSections]));
      } catch (e) {}
      const link = document.querySelector(`.nav-link[data-target="${sectionId}"]`);
      if (link) link.classList.add('completed');
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
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      const bar = document.getElementById('progress-bar');
      if (bar) bar.style.width = progress + '%';
    });
  }
}

// Theme primero (evita flash al cargar) — el inline en <head> ya seteó
// data-theme; aquí sincronizamos el state interno del controller + el btn.
window.ThemeController.init();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.ThemeController.init();
  window.app = new App();
});

// Make visible sections animate in
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('#main section').forEach(s => {
    observer.observe(s);
  });
});
