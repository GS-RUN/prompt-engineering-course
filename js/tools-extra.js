/* ============================================================
   Extra tools — SKILL.md Builder + Agent Goal Composer
   v2.3.15 — 2026-05-08
   ============================================================ */

(function () {
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderResult(outId, title, text) {
    const out = $(outId);
    if (!out) return;
    const preId = outId + '-pre';
    out.innerHTML =
      '<div class="generated-result">' +
        '<div class="generated-head">' +
          '<span class="generated-title">' + esc(title) + '</span>' +
          '<button class="btn-copy" data-copy="' + preId + '">📋 Copiar</button>' +
        '</div>' +
        '<pre id="' + preId + '">' + esc(text) + '</pre>' +
      '</div>';
    out.classList.add('show');
  }

  // ----- SKILL.md Builder ----------------------------------------------
  function initSkillBuilder() {
    const btn = $('skb-generate');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const name    = ($('skb-name').value || 'unnamed').trim();
      const desc    = $('skb-desc').value.trim();
      const tools   = $('skb-tools').value.trim();
      const context = $('skb-context').value;
      const disable = $('skb-disable').checked;
      const body    = $('skb-body').value;

      const lines = ['---', 'name: ' + name];
      if (desc)    lines.push('description: ' + desc);
      if (disable) lines.push('disable-model-invocation: true');
      if (tools)   lines.push('allowed-tools: ' + tools);
      if (context && context !== 'default') lines.push('context: ' + context);
      lines.push('---', '', body);
      renderResult('skb-output', 'SKILL.md', lines.join('\n'));
    });
  }

  // ----- Agent Goal Composer -------------------------------------------
  function initAgentComposer() {
    const btn = $('agc-generate');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const role        = $('agc-role').value.trim();
      const goal        = $('agc-goal').value.trim();
      const constraints = $('agc-constraints').value.trim();
      const success     = $('agc-success').value.trim();
      const format      = $('agc-format').value.trim();

      const parts = [];
      if (role)        parts.push('<role>\nYou are ' + role + '.\n</role>');
      if (goal)        parts.push('<task>\n' + goal + '\n</task>');
      if (constraints) parts.push('<constraints>\n' + constraints + '\n</constraints>');
      if (success)     parts.push('<success-criteria>\n' + success + '\n</success-criteria>');
      if (format)      parts.push('<output-format>\n' + format + '\n</output-format>');
      renderResult('agc-output', 'Prompt del agente', parts.join('\n\n'));
    });
  }

  // ----- Prompt Linter -------------------------------------------------
  function lintPrompt(prompt) {
    const checks = [];
    const len = prompt.length;
    const trimmed = prompt.trim();

    // 1. Length
    if (len < 60) {
      checks.push({ status: 'warn', label: 'Longitud', msg: 'Muy corto (' + len + ' chars). Considera más contexto sobre rol, formato y restricciones.' });
    } else if (len > 4000) {
      checks.push({ status: 'warn', label: 'Longitud', msg: 'Muy largo (' + len + ' chars). Si lo reutilizas, activa prompt caching para abaratar 80-90%.' });
    } else {
      checks.push({ status: 'ok', label: 'Longitud', msg: len + ' chars — tamaño razonable.' });
    }

    // 2. Role / persona
    const hasRole = /\byou are\b|\bact as\b|\byour role\b|\beres un\b|\bactúa como\b|\btu rol\b/i.test(prompt);
    checks.push({
      status: hasRole ? 'ok' : 'warn',
      label: 'Rol',
      msg: hasRole ? 'Define un rol/persona.' : 'No detecto un rol. Empieza con "You are a..." / "Eres un..." — cambia tono y profundidad.'
    });

    // 3. Examples / few-shot
    const hasExamples = /<example|<examples|example:|ejemplo:|<input>|<output>|input:.*output:/is.test(prompt);
    checks.push({
      status: hasExamples ? 'ok' : 'warn',
      label: 'Ejemplos',
      msg: hasExamples ? 'Incluye ejemplos few-shot.' : 'Sin ejemplos. Para formato específico o dominio, 3-5 ejemplos rinden mucho mejor.'
    });

    // 4. Output format
    const hasFormat = /\bjson\b|\bmarkdown\b|\bformat:|\boutput (in|as|format)\b|\brespuesta en\b|\bformato\b|\bxml\b|\byaml\b/i.test(prompt);
    checks.push({
      status: hasFormat ? 'ok' : 'warn',
      label: 'Formato',
      msg: hasFormat ? 'Especifica el formato de salida.' : 'No detecto formato. Indica si quieres JSON, lista, markdown… o el modelo improvisa.'
    });

    // 5. XML structure
    const hasXml = /<[a-z][a-z_-]*>/i.test(prompt);
    checks.push({
      status: hasXml ? 'ok' : 'info',
      label: 'Estructura XML',
      msg: hasXml ? 'Usa tags XML — Claude las parsea bien.' : 'Sin tags XML. Para Claude, considera <instructions>, <context>, <examples>.'
    });

    // 6. CoT / reasoning trigger
    const hasCoT = /step by step|paso a paso|let'?s think|piensa|reasoning|razonamiento/i.test(prompt);
    checks.push({
      status: hasCoT ? 'ok' : 'info',
      label: 'CoT',
      msg: hasCoT ? 'Activa Chain of Thought.' : 'Sin CoT explícito. Útil en modelos sin thinking nativo para tareas multi-paso.'
    });

    // 7. User data smell — looks like the user pasted raw user data into the system prompt
    const userSmell = /\$\{[^}]+\}|\{\{[^}]+\}\}|the user (said|wrote|asked)|el usuario (dijo|escribió|preguntó)/i.test(prompt);
    if (userSmell) {
      checks.push({
        status: 'warn',
        label: 'Datos del usuario',
        msg: 'El prompt parece contener datos del usuario o placeholders sin sanear. Mantén user-data en mensajes user, no en system.'
      });
    } else {
      checks.push({ status: 'ok', label: 'Datos del usuario', msg: 'No detecto user-data mezclado.' });
    }

    return checks;
  }

  function initLinter() {
    const btn = $('lint-run');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const prompt = ($('lint-input').value || '').trim();
      const out = $('lint-output');
      if (!out) return;
      if (!prompt) {
        out.innerHTML = '<div class="lint-empty">Pega un system prompt arriba para lintarlo.</div>';
        out.classList.add('show');
        return;
      }
      const checks = lintPrompt(prompt);
      const okCount = checks.filter(c => c.status === 'ok').length;
      const warnCount = checks.filter(c => c.status === 'warn').length;
      const infoCount = checks.filter(c => c.status === 'info').length;
      const score = Math.round((okCount / checks.length) * 100);
      const scoreColor = score >= 80 ? '#6EBE7F' : score >= 50 ? '#F5A524' : '#E05F5F';
      const html = [];
      html.push('<div class="lint-summary"><span class="lint-score" style="color:' + scoreColor + ';">' + score + '%</span> · ' +
                '<span style="color:#6EBE7F;">✓ ' + okCount + '</span>  ' +
                '<span style="color:#F5A524;">⚠ ' + warnCount + '</span>  ' +
                '<span style="color:#9A958E;">ℹ ' + infoCount + '</span></div>');
      html.push('<ul class="lint-list">');
      for (const c of checks) {
        const icon = c.status === 'ok' ? '✓' : c.status === 'warn' ? '⚠' : 'ℹ';
        const colorClass = 'lint-' + c.status;
        html.push('<li class="' + colorClass + '"><span class="lint-icon">' + icon + '</span>' +
                  '<span class="lint-label">' + esc(c.label) + '</span>' +
                  '<span class="lint-msg">' + esc(c.msg) + '</span></li>');
      }
      html.push('</ul>');
      out.innerHTML = html.join('');
      out.classList.add('show');
    });
  }

  // ----- Shared copy-to-clipboard handler ------------------------------
  function initCopyHandler() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-copy');
      if (!btn) return;
      const target = document.getElementById(btn.dataset.copy);
      if (!target) return;
      const text = target.textContent;
      const restore = () => { btn.textContent = btn.dataset.original || '📋 Copiar'; };
      if (!btn.dataset.original) btn.dataset.original = btn.textContent;
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = '✓ Copiado';
        setTimeout(restore, 1500);
      }).catch(() => {
        btn.textContent = '✗ Error';
        setTimeout(restore, 1500);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initSkillBuilder();
    initAgentComposer();
    initLinter();
    initCopyHandler();
  });
})();
