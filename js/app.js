/* ============================================================
   Main App — Routing, Navigation, State
   ============================================================ */
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
    try {
      const saved = JSON.parse(localStorage.getItem('visitedSections') || '[]');
      saved.forEach(s => this.visitedSections.add(s));
    } catch(e) {}

    this.exerciseEngine = new ExerciseEngine();
    this.promptSimulator = new PromptSimulator();
    this.diagramEngine = new DiagramEngine();
    this.quizEngine = new QuizEngine();
    this.tokenTools = new TokenTools();
    this.promptDiff = new PromptDiff();

    this.setupNavigation();
    this.setupScrollSpy();
    this.setupCopyButtons();
    setTimeout(() => this.quizEngine.attachHandlers(), 100);
    this.setupProgressBar();
    this.markVisited();
  }

  init() {
    // Load visited from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('visitedSections') || '[]');
      saved.forEach(s => this.visitedSections.add(s));
    } catch(e) {}

    // Initialize Three.js background
    if (typeof THREE !== 'undefined') {
      this.neuralBg = new NeuralBg();
    }

    // Initialize modules
    this.exerciseEngine = new ExerciseEngine();
    this.promptSimulator = new PromptSimulator();
    this.diagramEngine = new DiagramEngine();
    this.quizEngine = new QuizEngine();

    // Setup navigation
    this.setupNavigation();

    // Setup scroll spy with IntersectionObserver
    this.setupScrollSpy();

    // Setup copy buttons
    this.setupCopyButtons();

    // Setup quiz after DOM is ready
    setTimeout(() => this.quizEngine.attachHandlers(), 100);

    // Progress bar
    this.setupProgressBar();

    // Mark current as visited
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
      } catch(e) {}

      // Update checkmark
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
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
