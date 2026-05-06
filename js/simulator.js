/* ============================================================
   Prompt Simulator — Visual quality scoring
   ============================================================ */
class PromptSimulator {
  constructor() {
    this.toggles = {};
    this.init();
  }

  init() {
    const runBtn = document.getElementById('sim-run');
    if (!runBtn) return;

    // Toggle handlers
    document.querySelectorAll('.sim-toggle').forEach(t => {
      const key = t.dataset.key;
      this.toggles[key] = false;
      t.addEventListener('click', () => {
        this.toggles[key] = !this.toggles[key];
        t.classList.toggle('on', this.toggles[key]);
      });
    });

    runBtn.addEventListener('click', () => this.run());
  }

  getActiveTechniques() {
    const techs = [];
    if (this.toggles['role']) techs.push('Role Prompting');
    if (this.toggles['cot']) techs.push('Chain of Thought');
    if (this.toggles['xml']) techs.push('XML Structure');
    if (this.toggles['fewshot']) techs.push('Few-shot Examples');
    if (this.toggles['thinking']) techs.push('Thinking Mode');
    if (this.toggles['parallel']) techs.push('Parallel Tool Calls');
    return techs;
  }

  calculateScores(techs) {
    const base = 25;
    const weights = {
      'Role Prompting': 12,
      'Chain of Thought': 18,
      'XML Structure': 14,
      'Few-shot Examples': 20,
      'Thinking Mode': 16,
      'Parallel Tool Calls': 8
    };
    let quality = base;
    let speed = 95;
    let cost = 5;
    let accuracy = base;

    techs.forEach(t => {
      quality += weights[t] || 0;
      accuracy += (weights[t] || 0) * 0.8;
      if (t === 'Chain of Thought' || t === 'Thinking Mode') {
        speed -= 20;
        cost += 15;
      }
      if (t === 'Parallel Tool Calls') speed += 10;
      if (t === 'Few-shot Examples') cost += 10;
    });

    return {
      quality: Math.min(98, quality),
      speed: Math.max(15, Math.min(100, speed)),
      cost: Math.min(100, cost),
      accuracy: Math.min(96, accuracy)
    };
  }

  generateResponse(techs) {
    const query = document.getElementById('sim-query')?.value || 'Sample task';
    const hasRole = techs.includes('Role Prompting');
    const hasCoT = techs.includes('Chain of Thought');
    const hasXml = techs.includes('XML Structure');
    const hasFew = techs.includes('Few-shot Examples');
    const hasThink = techs.includes('Thinking Mode');
    const hasPar = techs.includes('Parallel Tool Calls');

    let response = '';

    if (hasRole) response += '🤖 As a Senior Software Engineer specializing in distributed systems...\n\n';

    if (hasCoT || hasThink) {
      response += '🧠 Thinking process:\n';
      response += '  1. Analyzing the requirements...\n';
      response += '  2. Identifying key components and dependencies...\n';
      response += '  3. Evaluating architecture trade-offs...\n';
      response += '  4. Reviewing edge cases and failure modes...\n';
      if (hasPar) {
        response += '  5. [Parallel] Reading relevant files + checking docs + scanning codebase...\n';
      }
      response += '\n';
    }

    if (hasXml) {
      response += '<response>\n';
      response += '  <analysis>\n';
      response += '    The task requires a well-structured approach...\n';
      response += '  </analysis>\n';
      response += '  <implementation>\n';
      response += '    // Code with proper error handling, types, and tests\n';
      response += '  </implementation>\n';
    } else {
      response += 'Here is the implementation:\n\n';
      response += '```typescript\n';
      response += '// Complete production implementation with:\n';
      response += '// - TypeScript strict mode\n';
      response += '// - Error handling\n';
      response += '// - Zod validation\n';
      response += '// - Jest unit tests\n';
      response += '```\n';
    }

    if (hasFew) {
      response += '\n📋 Reference examples:\n';
      response += '  Example 1: [pattern demonstrated]\n';
      response += '  Example 2: [edge case handled]\n';
    }

    if (hasXml) {
      response += '  <testing>\n';
      response += '    // Integration tests included\n';
      response += '  </testing>\n';
      response += '</response>';
    }

    return response;
  }

  run() {
    const techs = this.getActiveTechniques();
    const scores = this.calculateScores(techs);
    const response = this.generateResponse(techs);

    // Update stats
    const el = (id) => document.getElementById(id);
    const animate = (el, val) => {
      if (!el) return;
      let cur = 0;
      const step = () => {
        cur += 2;
        if (cur > val) cur = val;
        el.textContent = cur + '%';
        if (cur < val) requestAnimationFrame(step);
      };
      step();
    };

    animate(el('sim-quality'), scores.quality);
    animate(el('sim-speed'), scores.speed);
    animate(el('sim-cost'), scores.cost);
    animate(el('sim-accuracy'), scores.accuracy);

    // Update output
    const output = document.getElementById('sim-output');
    if (!output) return;
    output.classList.add('show');

    let qualityLabel = '';
    if (scores.quality >= 80) qualityLabel = 'EXPERT';
    else if (scores.quality >= 55) qualityLabel = 'ADVANCED';
    else if (scores.quality >= 35) qualityLabel = 'INTERMEDIATE';
    else qualityLabel = 'BASIC';

    const qc = scores.quality >= 80 ? 'var(--green)' : scores.quality >= 55 ? 'var(--accent)' : scores.quality >= 35 ? 'var(--yellow)' : 'var(--red)';

    output.innerHTML = `<div class="sim-quality" style="background:${qc};color:#000">${qualityLabel}</div>\n${response}`;

    // Highlight techniques used
    const techList = document.getElementById('sim-techs');
    if (techList) {
      techList.textContent = techs.length > 0 ? 'Técnicas: ' + techs.join(' + ') : 'Sin técnicas avanzadas';
    }
  }
}

window.PromptSimulator = PromptSimulator;
