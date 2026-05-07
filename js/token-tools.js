/* ============================================================
   Token Counter + Cost Calculator
   ============================================================ */
class TokenTools {
  constructor() {
    this.prices = {
      // Anthropic
      'claude-opus-4-7':     { input: 15,    output: 75,    cache: { write: 18.75, read: 1.50 } },
      'claude-sonnet-4-6':   { input: 3,     output: 15,    cache: { write: 3.75,  read: 0.30 } },
      'claude-haiku-4-5':    { input: 0.80,  output: 4,     cache: { write: 1.00,  read: 0.08 } },
      // OpenAI
      'gpt-5-5':             { input: 3.75,  output: 15 },
      'gpt-5':               { input: 1.25,  output: 10 },
      'gpt-5-mini':          { input: 0.25,  output: 1.00 },
      // Google
      'gemini-2-5-pro':      { input: 1.25,  output: 5 },
      'gemini-2-5-flash':    { input: 0.30,  output: 2.50 },
      // xAI
      'grok-4':              { input: 3,     output: 15 },
      // China
      'deepseek-v4-pro':     { input: 0.50,  output: 2.00 },
      'deepseek-v4-flash':   { input: 0.14,  output: 0.56 },
      'deepseek-r2':         { input: 0.55,  output: 2.20 },
      'kimi-k2':             { input: 0.60,  output: 2.50 },
      'minimax-m2':          { input: 0.30,  output: 1.20 },
      'qwen3-max':           { input: 0.80,  output: 3.20 },
      'glm-5':               { input: 0.40,  output: 1.80 },
      // Otros
      'mistral-large-3':     { input: 2,     output: 6 },
      'cohere-command-r-plus': { input: 2.50, output: 10 },
    };
    this.init();
  }

  init() {
    this.setupTokenCounter();
    this.setupCostCalc();
  }

  setupTokenCounter() {
    const input = document.getElementById('tc-input');
    const output = document.getElementById('tc-output');
    if (!input || !output) return;

    const update = () => {
      const text = input.value;
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;
      // Rough token estimation: ~4 chars per token for English, ~2.5 for code
      const estTokensEn = Math.round(chars / 4);
      const estTokensCode = Math.round(chars / 2.5);
      output.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;">
          <div><div style="font-size:28px;font-weight:700;color:var(--accent)">${words}</div><div style="font-size:10px;color:var(--text-muted)">Palabras</div></div>
          <div><div style="font-size:28px;font-weight:700;color:var(--accent2)">${chars}</div><div style="font-size:10px;color:var(--text-muted)">Caracteres</div></div>
          <div><div style="font-size:28px;font-weight:700;color:var(--gray-soft)">~${estTokensEn}</div><div style="font-size:10px;color:var(--text-muted)">Tokens (est.)</div></div>
        </div>
        <div style="margin-top:12px;font-size:11px;color:var(--text-muted);">
          Estimación: ~${estTokensEn} tokens (texto) / ~${estTokensCode} tokens (código).
          1 token ≈ 4 caracteres (inglés) / 2.5 caracteres (código).
        </div>`;
    };
    input.addEventListener('input', update);
    update();
  }

  setupCostCalc() {
    const modelSel = document.getElementById('cc-model');
    const tokInput = document.getElementById('cc-tokens');
    const cacheCheck = document.getElementById('cc-cache');
    const outputEl = document.getElementById('cc-output');
    if (!modelSel || !tokInput || !outputEl) return;

    const update = () => {
      const model = modelSel.value;
      const tokens = parseInt(tokInput.value) || 0;
      const cached = cacheCheck?.checked || false;
      const price = this.prices[model];
      if (!price) { outputEl.innerHTML = ''; return; }

      const inputCost = tokens * price.input / 1000000;
      const outputCost = tokens * price.output / 1000000;

      let cacheSavings = 0;
      let cacheNote = '';
      if (cached && price.cache) {
        const normalCost = tokens * price.input / 1000000;
        const cachedCost = tokens * price.cache.read / 1000000;
        cacheSavings = normalCost - cachedCost;
        cacheNote = `<div style="margin-top:8px;color:var(--green);font-size:12px;">
          ✅ Con caché: ahorras ~$${cacheSavings.toFixed(4)} (${Math.round((1 - price.cache.read/price.input)*100)}% menos)
        </div>`;
      }

      outputEl.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center;">
          <div><div style="font-size:22px;font-weight:700;color:var(--accent)">$${inputCost.toFixed(4)}</div><div style="font-size:10px;color:var(--text-muted)">Input</div></div>
          <div><div style="font-size:22px;font-weight:700;color:var(--accent2)">$${outputCost.toFixed(4)}</div><div style="font-size:10px;color:var(--text-muted)">Output</div></div>
          <div><div style="font-size:22px;font-weight:700;color:var(--gray-soft)">$${(inputCost+outputCost).toFixed(4)}</div><div style="font-size:10px;color:var(--text-muted)">Total</div></div>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-dim);text-align:center;">
          Basado en ${tokens.toLocaleString()} tokens · Precio por 1M tokens
        </div>
        ${cacheNote}
        ${this._priceTag(model, price)}
      `;
    };

    this._priceTag = (model, price) => {
      // Compare input price vs Claude Opus 4.7 ($15/M) for context.
      const ratioVsOpus = 15 / Math.max(price.input, 0.001);
      let msg = '';
      if (price.input <= 0.30) {
        msg = `💰 Ultra-low: ${ratioVsOpus.toFixed(0)}× más barato que Claude Opus por input token`;
      } else if (price.input <= 0.80) {
        msg = `💵 Low-cost: ${ratioVsOpus.toFixed(0)}× más barato que Claude Opus por input token`;
      } else if (price.input <= 3) {
        msg = `⚖️ Medium tier: balance coste/calidad`;
      } else if (price.input <= 10) {
        msg = `💎 Frontier tier: top quality, premium price`;
      } else {
        msg = `🏆 Top frontier: razonamiento más profundo del mercado`;
      }
      return `<div style="margin-top:8px;color:var(--accent2);font-size:12px;text-align:center;">${msg}</div>`;
    };

    modelSel.addEventListener('change', update);
    tokInput.addEventListener('input', update);
    if (cacheCheck) cacheCheck.addEventListener('change', update);
    update();
  }
}

window.TokenTools = TokenTools;
