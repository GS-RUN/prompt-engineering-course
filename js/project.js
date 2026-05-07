/* ============================================================
   Mi Proyecto — Agente que el alumno construye a lo largo del curso
   © Alonso J. Núñez · GS·RUN
   ============================================================ */

const Project = {
  KEY: 'myProject',

  // 6 etapas alineadas con los módulos del curso
  stages: [
    { id: 'v1', module: 'M1',  label: 'v1 · Zero-shot básico',   tip: 'Escribe la primera versión del prompt para tu agente. Solo instrucción directa.' },
    { id: 'v2', module: 'M2',  label: 'v2 · +Role + XML + Few-shot', tip: 'Añade un role profesional ("Eres un..."), estructura XML y 2-3 ejemplos few-shot.' },
    { id: 'v3', module: 'M3',  label: 'v3 · +Chain of Thought',  tip: 'Añade pasos de razonamiento explícitos antes de la respuesta. Para tareas complejas.' },
    { id: 'v4', module: 'M4',  label: 'v4 · Empaquetado como Skill', tip: 'Convierte tu prompt a formato SKILL.md con frontmatter (name, description, tools).' },
    { id: 'v5', module: 'M9',  label: 'v5 · Producción',         tip: 'Añade output JSON Schema, defensa anti-injection, cláusula de incertidumbre.' },
    { id: 'v6', module: 'M10', label: 'v6 · Patrón avanzado',    tip: 'Multi-turn, RAG awareness, self-critique. La versión final.' },
  ],

  data: null,

  init() {
    this.load();
    this.renderPanel();
    this.attachHandlers();
  },

  load() {
    try {
      this.data = JSON.parse(localStorage.getItem(this.KEY) || '{}');
    } catch (e) {
      this.data = {};
    }
    if (!this.data.name)   this.data.name = '';
    if (!this.data.domain) this.data.domain = '';
    if (!this.data.versions) this.data.versions = {};
  },

  save() {
    try { localStorage.setItem(this.KEY, JSON.stringify(this.data)); } catch (e) {}
  },

  renderPanel() {
    // Renderiza el panel donde haya un <div id="project-panel"></div>
    const root = document.getElementById('project-panel');
    if (!root) return;
    const v = this.data.versions || {};
    const completed = Object.keys(v).filter(k => (v[k]||'').trim().length > 30).length;
    const total = this.stages.length;

    root.innerHTML = `
      <div class="proj-meta">
        <input type="text" id="proj-name" placeholder="Nombre de tu agente (ej. CodeReview-Bot)"
               value="${escapeHtml(this.data.name)}" maxlength="60">
        <input type="text" id="proj-domain" placeholder="Dominio (ej. revisión de código Python)"
               value="${escapeHtml(this.data.domain)}" maxlength="80">
        <div class="proj-progress">
          <div class="proj-progress-bar"><div class="proj-progress-fill" style="width:${(completed/total)*100}%"></div></div>
          <span class="proj-progress-label">${completed}/${total} versiones</span>
        </div>
      </div>
      <div class="proj-stages">
        ${this.stages.map(s => this.renderStage(s)).join('')}
      </div>
      <div class="proj-actions">
        <button class="btn btn-secondary proj-btn-export" data-i18n="proj-export">📥 Exportar JSON</button>
        <button class="btn btn-secondary proj-btn-diff" data-i18n="proj-diff">🔀 Comparar v1 vs última</button>
        <button class="btn btn-secondary proj-btn-reset" data-i18n="proj-reset">🗑️ Reset</button>
      </div>
      <div id="proj-diff-out" class="proj-diff-out" style="display:none;"></div>
    `;
  },

  renderStage(s) {
    const val = this.data.versions[s.id] || '';
    const done = val.trim().length > 30;
    return `
      <div class="proj-stage ${done ? 'done' : ''}">
        <div class="proj-stage-head">
          <span class="proj-stage-tag">${s.module}</span>
          <span class="proj-stage-label">${s.label}</span>
          ${done ? '<span class="proj-stage-check">✅</span>' : ''}
        </div>
        <div class="proj-stage-tip">${s.tip}</div>
        <textarea class="proj-stage-input" data-stage="${s.id}"
          placeholder="Pega aquí tu prompt para esta versión..."
          rows="4">${escapeHtml(val)}</textarea>
      </div>
    `;
  },

  attachHandlers() {
    document.addEventListener('input', (e) => {
      if (e.target.id === 'proj-name') {
        this.data.name = e.target.value;
        this.save();
      } else if (e.target.id === 'proj-domain') {
        this.data.domain = e.target.value;
        this.save();
      } else if (e.target.classList.contains('proj-stage-input')) {
        const id = e.target.dataset.stage;
        this.data.versions[id] = e.target.value;
        this.save();
        this.updateProgress();
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('proj-btn-export')) this.export();
      else if (e.target.classList.contains('proj-btn-diff')) this.showDiff();
      else if (e.target.classList.contains('proj-btn-reset')) this.reset();
    });
  },

  updateProgress() {
    const v = this.data.versions || {};
    const completed = Object.keys(v).filter(k => (v[k]||'').trim().length > 30).length;
    const total = this.stages.length;
    const fill = document.querySelector('.proj-progress-fill');
    const label = document.querySelector('.proj-progress-label');
    if (fill) fill.style.width = (completed/total*100) + '%';
    if (label) label.textContent = `${completed}/${total} versiones`;
    // Stage check marks
    document.querySelectorAll('.proj-stage').forEach(stage => {
      const ta = stage.querySelector('.proj-stage-input');
      if (!ta) return;
      const done = (ta.value || '').trim().length > 30;
      stage.classList.toggle('done', done);
      let chk = stage.querySelector('.proj-stage-check');
      if (done && !chk) {
        const head = stage.querySelector('.proj-stage-head');
        if (head) {
          chk = document.createElement('span');
          chk.className = 'proj-stage-check'; chk.textContent = '✅';
          head.appendChild(chk);
        }
      } else if (!done && chk) chk.remove();
    });
  },

  export() {
    const blob = new Blob([JSON.stringify(this.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (this.data.name || 'mi-agente').replace(/[^a-z0-9-]/gi, '_').toLowerCase() + '.json';
    a.click();
    URL.revokeObjectURL(url);
  },

  showDiff() {
    const v1 = this.data.versions['v1'] || '';
    const versions = ['v6', 'v5', 'v4', 'v3', 'v2'];
    let last = '', lastId = '';
    for (const id of versions) {
      if ((this.data.versions[id] || '').trim().length > 30) {
        last = this.data.versions[id]; lastId = id; break;
      }
    }
    const out = document.getElementById('proj-diff-out');
    if (!out) return;
    if (!v1.trim() || !last.trim()) {
      out.innerHTML = '<div class="proj-diff-empty">Necesitas al menos v1 y una versión posterior con contenido para comparar.</div>';
      out.style.display = 'block';
      return;
    }
    const v1Lines = v1.split('\n').length;
    const lastLines = last.split('\n').length;
    const v1Chars = v1.length;
    const lastChars = last.length;
    out.innerHTML = `
      <div class="proj-diff-header">
        <span class="proj-diff-tag tag-v1">v1 → ${lastId}</span>
        <span class="proj-diff-stat">${v1Chars}→${lastChars} chars · ${v1Lines}→${lastLines} líneas</span>
      </div>
      <div class="proj-diff-grid">
        <div class="proj-diff-col">
          <h4>v1 · Zero-shot básico</h4>
          <pre>${escapeHtml(v1)}</pre>
        </div>
        <div class="proj-diff-col">
          <h4>${lastId} · Versión más avanzada</h4>
          <pre>${escapeHtml(last)}</pre>
        </div>
      </div>
    `;
    out.style.display = 'block';
  },

  reset() {
    if (!confirm('¿Borrar todas las versiones de tu proyecto? Esta acción no se puede deshacer.')) return;
    this.data = { name: '', domain: '', versions: {} };
    this.save();
    this.renderPanel();
  },
};

function escapeHtml(s) {
  return String(s||'').replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

document.addEventListener('DOMContentLoaded', () => Project.init());
window.Project = Project;
