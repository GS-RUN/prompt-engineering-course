/* ============================================================
   Prompt Diff Comparator + Quality Scorer
   ============================================================ */
class PromptDiff {
  constructor() {
    this.init();
  }

  init() {
    this.setupDiff();
  }

  evaluateDetailed(prompt) {
    const criteria = {
      clarity: { score: 0, max: 25, checks: [] },
      specificity: { score: 0, max: 25, checks: [] },
      structure: { score: 0, max: 20, checks: [] },
      examples: { score: 0, max: 15, checks: [] },
      constraints: { score: 0, max: 15, checks: [] },
    };

    // Clarity
    if (prompt.length > 50) { criteria.clarity.score += 8; criteria.clarity.checks.push('Longitud adecuada'); }
    else { criteria.clarity.checks.push('Demasiado corto — añade más detalle'); }
    if (!prompt.match(/don't|do not|never|avoid|no /i)) { criteria.clarity.score += 5; criteria.clarity.checks.push('Usa instrucciones positivas'); }
    else { criteria.clarity.checks.push('Evita instrucciones negativas — di qué hacer'); }
    if (prompt.length > 200) { criteria.clarity.score += 7; criteria.clarity.checks.push('Contexto suficiente'); }
    else { criteria.clarity.checks.push('Añade más contexto'); }
    criteria.clarity.score += Math.min(5, Math.floor(prompt.length / 200));
    criteria.clarity.score = Math.min(criteria.clarity.max, criteria.clarity.score);

    // Specificity
    if (prompt.match(/step \d|primero|segundo|first|second|finally|lastly|1\.|2\./i)) {
      criteria.specificity.score += 10; criteria.specificity.checks.push('Instrucciones paso a paso');
    }
    if (prompt.match(/react|vue|angular|node|python|typescript|javascript|html|css|sql|mongodb|postgres|rest|graphql|api/i)) {
      criteria.specificity.score += 8; criteria.specificity.checks.push('Tecnología especificada');
    } else { criteria.specificity.checks.push('Falta especificar stack tecnológico'); }
    if (prompt.match(/responsive|mobile|desktop|error|validation|security|test|performance|accessibility/i)) {
      criteria.specificity.score += 7; criteria.specificity.checks.push('Requisitos no-funcionales');
    }
    criteria.specificity.score = Math.min(criteria.specificity.max, criteria.specificity.score);

    // Structure
    if (prompt.match(/<\/?\w+>/)) {
      criteria.structure.score += 12; criteria.structure.checks.push('Usa XML tags');
    }
    if (prompt.match(/^#{1,3}\s|##\s|\*\*|__/m)) {
      criteria.structure.score += 5; criteria.structure.checks.push('Usa Markdown para jerarquía');
    }
    if (prompt.match(/^[A-Z][a-z]+:/m)) {
      criteria.structure.score += 3; criteria.structure.checks.push('Campos etiquetados');
    }
    criteria.structure.score = Math.min(criteria.structure.max, criteria.structure.score);

    // Examples
    const exampleMatches = prompt.match(/example|ejemplo|ej:|e\.g\.|such as|for instance/gi);
    if (exampleMatches && exampleMatches.length >= 3) {
      criteria.examples.score += 12; criteria.examples.checks.push(`${exampleMatches.length} ejemplos detectados`);
    } else if (exampleMatches && exampleMatches.length >= 1) {
      criteria.examples.score += 7; criteria.examples.checks.push(`${exampleMatches.length} ejemplo(s) — añade más`);
    } else {
      criteria.examples.checks.push('Sin ejemplos — añade 3-5 para mejor resultado');
    }
    if (prompt.match(/<example>|```/i)) {
      criteria.examples.score += 3; criteria.examples.checks.push('Ejemplos bien delimitados');
    }

    // Constraints
    if (prompt.match(/format|output|respond|return|only|json|csv|yaml|markdown|table/i)) {
      criteria.constraints.score += 8; criteria.constraints.checks.push('Formato de salida especificado');
    } else { criteria.constraints.checks.push('Falta especificar formato de salida'); }
    if (prompt.match(/max|min|limit|at most|at least|between|range|only|exactly/i)) {
      criteria.constraints.score += 7; criteria.constraints.checks.push('Restricciones cuantitativas');
    }
    criteria.constraints.score = Math.min(criteria.constraints.max, criteria.constraints.score);

    return criteria;
  }

  totalScore(criteria) {
    let total = 0, max = 0;
    for (const k in criteria) { total += criteria[k].score; max += criteria[k].max; }
    return { total, max, pct: Math.round((total / max) * 100) };
  }

  renderReport(criteria, label) {
    const scores = this.totalScore(criteria);
    const grade = scores.pct >= 85 ? 'A' : scores.pct >= 70 ? 'B' : scores.pct >= 50 ? 'C' : scores.pct >= 30 ? 'D' : 'F';
    let html = `<div style="margin-top:12px;"><strong>${label}</strong> — Score: ${scores.total}/${scores.max} (${scores.pct}%) — Grado: <span style="font-weight:700;color:${grade==='A'?'var(--green)':grade==='B'?'var(--accent2)':grade==='C'?'var(--yellow)':'var(--red)'}">${grade}</span></div>`;

    for (const [key, val] of Object.entries(criteria)) {
      const pct = Math.round((val.score / val.max) * 100);
      const color = pct >= 80 ? 'var(--green)' : pct >= 50 ? 'var(--yellow)' : 'var(--red)';
      html += `<div style="margin:4px 0;font-size:12px;">
        <span style="color:var(--text-dim)">${key}:</span>
        <span style="display:inline-block;width:120px;height:6px;background:var(--glass);border-radius:3px;vertical-align:middle;margin:0 8px;">
          <span style="display:block;height:100%;width:${pct}%;background:${color};border-radius:3px;"></span>
        </span>
        <span style="color:${color}">${val.score}/${val.max}</span>
      </div>`;
      val.checks.forEach(c => {
        const icon = c.includes('Sin') || c.includes('Falta') || c.includes('Demasiado') || c.includes('Evita') ? '❌' : '✅';
        html += `<div style="font-size:11px;color:var(--text-muted);margin-left:16px;">${icon} ${c}</div>`;
      });
    }
    return html;
  }

  setupDiff() {
    const leftInput = document.getElementById('diff-left');
    const rightInput = document.getElementById('diff-right');
    const compareBtn = document.getElementById('diff-compare');
    const output = document.getElementById('diff-output');
    if (!leftInput || !rightInput || !compareBtn || !output) return;

    compareBtn.addEventListener('click', () => {
      const left = leftInput.value.trim();
      const right = rightInput.value.trim();
      if (!left || !right) {
        output.innerHTML = '<div class="ex-output show" style="color:var(--red)">Escribe prompts en ambos lados para comparar.</div>';
        return;
      }

      const leftCrit = this.evaluateDetailed(left);
      const rightCrit = this.evaluateDetailed(right);
      const leftScore = this.totalScore(leftCrit);
      const rightScore = this.totalScore(rightCrit);

      const winner = rightScore.pct > leftScore.pct ? 'right' : rightScore.pct < leftScore.pct ? 'left' : 'tie';

      output.classList.add('show');
      output.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
          <div>${this.renderReport(leftCrit, '📝 Prompt A')}</div>
          <div>${this.renderReport(rightCrit, '📝 Prompt B')}</div>
        </div>
        <div style="text-align:center;margin-top:16px;padding:12px;background:var(--glass);border-radius:8px;font-weight:700;font-size:14px;color:${
          winner === 'right' ? 'var(--accent2)' : winner === 'left' ? 'var(--accent)' : 'var(--yellow)'
        }">
          ${winner === 'right' ? '🏆 Prompt B es mejor (+' + (rightScore.pct - leftScore.pct) + ' puntos)' :
            winner === 'left' ? '🏆 Prompt A es mejor (+' + (leftScore.pct - rightScore.pct) + ' puntos)' :
            '🤝 Empate — ambos prompts tienen calidad similar'}
        </div>
      `;
    });
  }
}

window.PromptDiff = PromptDiff;
