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
    initCopyHandler();
  });
})();
