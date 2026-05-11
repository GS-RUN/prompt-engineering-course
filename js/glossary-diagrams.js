/* ============================================================
   Glossary diagrams — hand-tuned inline SVGs, one per term that
   benefits visually. Each diagram is a (lang) => svgString function
   so the same layout renders ES or EN without duplicating markup.
   Consumed by js/glossary-page.js when an entry's id matches.

   v2.3.2 — 2026-05-08
   ============================================================ */

(function () {
  const P = {
    accent: '#F5A524',
    accentSoft: 'rgba(245,165,36,0.06)',
    accentBright: 'rgba(245,165,36,0.18)',
    green: '#6EBE7F',
    greenSoft: 'rgba(110,190,127,0.08)',
    red: '#E05F5F',
    redSoft: 'rgba(224,95,95,0.08)',
    dim: '#6B665E',
    dimFill: 'rgba(255,255,255,0.03)',
    text: '#E8E6E3',
    textDim: '#9A958E'
  };

  // -------- Generic builders ---------------------------------------------
  function defs(prefix) {
    return '<defs>' +
      '<marker id="' + prefix + '-arr" viewBox="0 0 10 10" refX="8" refY="5"' +
      ' markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
      '<path d="M0,0 L10,5 L0,10 Z" fill="' + P.accent + '"/></marker>' +
      '<marker id="' + prefix + '-arr-green" viewBox="0 0 10 10" refX="8" refY="5"' +
      ' markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
      '<path d="M0,0 L10,5 L0,10 Z" fill="' + P.green + '"/></marker>' +
      '<marker id="' + prefix + '-arr-dim" viewBox="0 0 10 10" refX="8" refY="5"' +
      ' markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
      '<path d="M0,0 L10,5 L0,10 Z" fill="' + P.dim + '"/></marker>' +
      '</defs>';
  }

  function svgOpen(cls, vb) {
    return '<svg viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg"' +
      ' class="' + cls + '" role="img" preserveAspectRatio="xMidYMid meet">';
  }

  // box(x, y, w, h, label, sub, opts) — opts: { variant: 'final'|'dim'|'red', glow }
  function box(x, y, w, h, label, sub, opts) {
    opts = opts || {};
    const v = opts.variant;
    const stroke = v === 'final' ? P.green : v === 'dim' ? P.dim : v === 'red' ? P.red : P.accent;
    const fill   = v === 'final' ? P.greenSoft : v === 'dim' ? P.dimFill : v === 'red' ? P.redSoft : (opts.glow ? P.accentBright : P.accentSoft);
    const cx = x + w / 2;
    const cy = y + h / 2;
    const lblClass = v === 'final' ? 'rd-label rd-label-final' :
                     v === 'dim'   ? 'rd-label rd-label-dim'   :
                     v === 'red'   ? 'rd-label rd-label-red'   : 'rd-label';
    let labels = '';
    if (sub) {
      labels += '<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" class="' + lblClass + '">' + label + '</text>';
      labels += '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" class="rd-sub">' + sub + '</text>';
    } else {
      labels += '<text x="' + cx + '" y="' + (cy + 5) + '" text-anchor="middle" class="' + lblClass + '">' + label + '</text>';
    }
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
      '" rx="10" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5"/>' + labels;
  }

  function line(x1, y1, x2, y2, prefix, opts) {
    opts = opts || {};
    const c = opts.color || P.accent;
    const m = c === P.green ? prefix + '-arr-green' : c === P.dim ? prefix + '-arr-dim' : prefix + '-arr';
    const sw = opts.width || 1.5;
    const sd = opts.dash ? ' stroke-dasharray="' + opts.dash + '"' : '';
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +
      '" stroke="' + c + '" stroke-width="' + sw + '" marker-end="url(#' + m + ')"' + sd + '/>';
  }

  function curve(d, color, width, opts) {
    opts = opts || {};
    const op = opts.opacity != null ? ' stroke-opacity="' + opts.opacity + '"' : '';
    const sd = opts.dash ? ' stroke-dasharray="' + opts.dash + '"' : '';
    const marker = opts.marker ? ' marker-end="url(#' + opts.marker + ')"' : '';
    return '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="' + width + '"' + op + sd + marker + '/>';
  }

  function foot(text, x, y) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="middle" class="rd-foot">' + text + '</text>';
  }

  // ====================================================================
  // 1. RAG flow — already shipped in v2.3.1
  // ====================================================================
  function ragDiagram(lang) {
    const L = lang === 'en' ? {
      query: 'Query', querySub: 'user question',
      embed: 'Embed', embedSub: '→ vector',
      vdb: 'Vector DB', vdbSub: 'semantic search',
      topk: 'Top-k chunks', topkSub: 'most relevant',
      llm: 'LLM + prompt', llmSub: 'context + question',
      ans: 'Answer + citations', ansSub: 'grounded',
      foot: 'The vector DB already has the documents indexed as chunks + embeddings.'
    } : {
      query: 'Consulta', querySub: 'pregunta del usuario',
      embed: 'Embed', embedSub: '→ vector',
      vdb: 'Vector DB', vdbSub: 'búsqueda semántica',
      topk: 'Top-k chunks', topkSub: 'los más relevantes',
      llm: 'LLM + prompt', llmSub: 'contexto + pregunta',
      ans: 'Respuesta + citas', ansSub: 'fundamentada',
      foot: 'El vector DB ya tiene los documentos indexados como chunks + embeddings.'
    };
    const boxes = [
      { x: 25,  l: L.query, s: L.querySub },
      { x: 181, l: L.embed, s: L.embedSub },
      { x: 337, l: L.vdb,   s: L.vdbSub },
      { x: 493, l: L.topk,  s: L.topkSub },
      { x: 649, l: L.llm,   s: L.llmSub },
      { x: 805, l: L.ans,   s: L.ansSub, final: true }
    ];
    let out = boxes.map(b => box(b.x, 50, 130, 100, b.l, b.s, { variant: b.final ? 'final' : null })).join('');
    for (let i = 0; i < 5; i++) {
      const fromX = boxes[i].x + 134;
      const toX = boxes[i + 1].x - 4;
      out += line(fromX, 100, toX, 100, 'rag', { color: i === 4 ? P.green : P.accent });
    }
    out += foot(L.foot, 480, 183);
    return svgOpen('rag-diagram', '0 0 960 200') + defs('rag') + out + '</svg>';
  }

  // ====================================================================
  // 2. Attention — last token attending to all previous with weighted lines
  // ====================================================================
  function attentionDiagram(lang) {
    const L = lang === 'en' ? {
      title: 'One attention head', target: 'target',
      foot: 'Line thickness ∝ attention weight. "mat" attends most to "cat" (0.40).'
    } : {
      title: 'Una cabeza de atención', target: 'objetivo',
      foot: 'Grosor ∝ peso de atención. "mat" atiende más a "cat" (0.40).'
    };
    const tokens = ['The','cat','sat','on','the','mat'];
    const weights = [0.05, 0.40, 0.20, 0.10, 0.05, 0.20]; // last is self-attention
    // 6 token boxes at top, y=44, h=44, w=110, gap 22.
    // total width = 6*110 + 5*22 = 660+110 = 770. centre at x=480 (viewBox 960). offset = 95.
    const W = 110, GAP = 22, Y = 44, H = 44;
    const startX = 95;
    let out = '';
    // Token boxes
    for (let i = 0; i < tokens.length; i++) {
      const x = startX + i * (W + GAP);
      const isTarget = i === tokens.length - 1;
      out += box(x, Y, W, H, tokens[i], null, isTarget ? { glow: true } : null);
      if (isTarget) {
        out += '<text x="' + (x + W/2) + '" y="' + (Y - 8) + '" text-anchor="middle" class="rd-sub" fill="' + P.accent + '">' + L.target + '</text>';
      }
    }
    // Curved attention lines from the last token's BOTTOM up over to each previous token's BOTTOM,
    // dipping down to a y=180 belt then up.
    const lastIdx = tokens.length - 1;
    const lastX = startX + lastIdx * (W + GAP) + W / 2;
    const lastY = Y + H; // bottom of last token = 88
    const beltY = 195;
    for (let i = 0; i < tokens.length; i++) {
      if (i === lastIdx) continue; // skip self
      const tx = startX + i * (W + GAP) + W / 2;
      const ty = Y + H;
      const w = weights[i];
      const sw = 1.2 + w * 5; // 0.05->1.45, 0.40->3.2 (less jarring)
      const op = 0.35 + w * 1.4;
      // Curved cubic from (lastX, lastY) down to belt then up to (tx, ty)
      const d = 'M ' + lastX + ' ' + lastY +
                ' C ' + lastX + ' ' + beltY + ', ' + tx + ' ' + beltY + ', ' + tx + ' ' + ty;
      out += curve(d, P.accent, sw, { opacity: Math.min(op, 1) });
      // weight label slightly above belt
      out += '<text x="' + ((lastX + tx) / 2) + '" y="' + (beltY - 4) + '" text-anchor="middle" class="rd-sub" fill="' + P.textDim + '">' + w.toFixed(2) + '</text>';
    }
    // Self loop indicator (dashed small loop at last token)
    out += '<text x="' + lastX + '" y="' + (beltY - 4) + '" text-anchor="middle" class="rd-sub" fill="' + P.textDim + '">' + weights[lastIdx].toFixed(2) + '</text>';
    out += foot(L.foot, 480, 240);
    return svgOpen('attn-diagram', '0 0 960 260') + defs('attn') + out + '</svg>';
  }

  // ====================================================================
  // 3. Agent loop (ReAct) — Thought → Action → Observation cycle
  // ====================================================================
  function agentDiagram(lang) {
    const L = lang === 'en' ? {
      thought: 'Thought', thoughtSub: '"What should I do?"',
      action: 'Action', actionSub: 'tool call',
      obs: 'Observation', obsSub: 'tool result',
      done: 'Done', doneSub: 'task complete',
      foot: 'The agent loops until the task is solved or a stop condition fires.'
    } : {
      thought: 'Pensamiento', thoughtSub: '"¿qué debo hacer?"',
      action: 'Acción', actionSub: 'llamada a tool',
      obs: 'Observación', obsSub: 'resultado del tool',
      done: 'Hecho', doneSub: 'tarea completa',
      foot: 'El agente itera hasta resolver la tarea o disparar una condición de parada.'
    };
    // Triangle layout. viewBox 600x340.
    // Thought top: (240, 30, 120, 70). Bottom edge y=100, right edge x=360.
    // Action bottom-right: (420, 200, 120, 70). Top edge y=200, left edge x=420.
    // Observation bottom-left: (60, 200, 120, 70). Top edge y=200, right edge x=180.
    // Done top-right: (440, 30, 120, 70). Left edge x=440.
    let out = '';
    out += box(240, 30, 120, 70, L.thought, L.thoughtSub);
    out += box(420, 200, 120, 70, L.action, L.actionSub);
    out += box(60, 200, 120, 70, L.obs, L.obsSub);
    out += box(440, 30, 120, 70, L.done, L.doneSub, { variant: 'final' });

    // Cycle arrows clockwise — marker-end auto-orients the arrowhead at the path's end.
    // Thought (right side) → Action (top side)
    out += curve('M 360 80 C 430 95, 472 135, 478 196', P.accent, 1.5, { marker: 'agent-arr' });
    // Action (bottom) → Observation (bottom): curve under the triangle
    out += curve('M 420 250 C 360 320, 240 320, 184 250', P.accent, 1.5, { marker: 'agent-arr' });
    // Observation (top) → Thought (left side)
    out += curve('M 120 198 C 110 130, 180 95, 238 78', P.accent, 1.5, { marker: 'agent-arr' });
    // Thought → Done: short straight green arrow on top
    out += line(363, 60, 437, 60, 'agent', { color: P.green });

    // Loop label in the middle of the triangle
    out += '<text x="300" y="160" text-anchor="middle" class="rd-sub" fill="' + P.textDim + '" font-style="italic">loop</text>';
    out += foot(L.foot, 300, 320);
    return svgOpen('agent-diagram', '0 0 600 340') + defs('agent') + out + '</svg>';
  }

  // ====================================================================
  // 4. KV cache — cached prefix + new token
  // ====================================================================
  function kvCacheDiagram(lang) {
    const L = lang === 'en' ? {
      cached: 'cached (K, V already computed)',
      newTok: 'new token',
      newSub: 'compute K, V once',
      foot: 'Without KV cache: O(N) work per token. With KV cache: O(1).'
    } : {
      cached: 'en caché (K, V ya calculados)',
      newTok: 'token nuevo',
      newSub: 'calcular K, V una sola vez',
      foot: 'Sin KV cache: O(N) por token. Con KV cache: O(1).'
    };
    // 7 cached + 1 new = 8 boxes. w=100, gap 12. Total 8*100 + 7*12 = 884. start x ~ 38.
    const W = 100, GAP = 12, Y = 80, H = 60;
    const start = 38;
    let out = '';
    // Bracket label over cached
    out += '<text x="' + (start + 3.5*(W+GAP) - GAP/2) + '" y="50" text-anchor="middle" class="rd-sub" fill="' + P.dim + '">' + L.cached + '</text>';
    // Cached tokens 1..7
    for (let i = 0; i < 7; i++) {
      const x = start + i * (W + GAP);
      out += box(x, Y, W, H, 't' + (i + 1), null, { variant: 'dim' });
    }
    // New token (8th, glowing amber)
    const x8 = start + 7 * (W + GAP);
    out += box(x8, Y, W, H, 't' + 8, L.newTok, { glow: true });
    // Label over new
    out += '<text x="' + (x8 + W/2) + '" y="50" text-anchor="middle" class="rd-sub" fill="' + P.accent + '">' + L.newSub + '</text>';
    // Bracket above cached
    const bracketX1 = start - 4;
    const bracketX2 = start + 6 * (W + GAP) + W + 4;
    out += '<line x1="' + bracketX1 + '" y1="58" x2="' + bracketX2 + '" y2="58" stroke="' + P.dim + '" stroke-width="1"/>';
    out += '<line x1="' + bracketX1 + '" y1="58" x2="' + bracketX1 + '" y2="68" stroke="' + P.dim + '" stroke-width="1"/>';
    out += '<line x1="' + bracketX2 + '" y1="58" x2="' + bracketX2 + '" y2="68" stroke="' + P.dim + '" stroke-width="1"/>';
    // Bracket above new
    const nb1 = x8 - 4, nb2 = x8 + W + 4;
    out += '<line x1="' + nb1 + '" y1="58" x2="' + nb2 + '" y2="58" stroke="' + P.accent + '" stroke-width="1.2"/>';
    out += '<line x1="' + nb1 + '" y1="58" x2="' + nb1 + '" y2="68" stroke="' + P.accent + '" stroke-width="1.2"/>';
    out += '<line x1="' + nb2 + '" y1="58" x2="' + nb2 + '" y2="68" stroke="' + P.accent + '" stroke-width="1.2"/>';
    out += foot(L.foot, 480, 195);
    return svgOpen('kvcache-diagram', '0 0 960 215') + defs('kvc') + out + '</svg>';
  }

  // ====================================================================
  // 5. MoE — router selects 2 of 8 experts per token
  // ====================================================================
  function moeDiagram(lang) {
    const L = lang === 'en' ? {
      input: 'Input token', router: 'Router', expert: 'Expert',
      foot: 'Only 2 of 8 experts are activated per token. Output = weighted sum of the 2.'
    } : {
      input: 'Token de entrada', router: 'Router', expert: 'Experto',
      foot: 'Sólo 2 de 8 expertos se activan por token. Salida = suma ponderada de los 2.'
    };
    let out = '';
    // Layout rethought: 2x4 grid forced any "Router → bottom-right expert" arrow
    // through other expert boxes. Switched to a SINGLE vertical column of 8
    // experts on the right, with a vertical "bus" between Router and the column.
    // Selected experts get a clean horizontal arrow off the bus; non-selected
    // get a short tick mark, signalling "router could route here but didn't".

    // Input + Router on the left, vertically centred against the expert column.
    out += box(20, 175, 110, 50, L.input, null);
    out += line(132, 200, 158, 200, 'moe');                  // input -> router
    out += box(160, 175, 110, 50, L.router, null, { glow: true });
    // Connector router -> bus (dim, just a hand-off line)
    out += '<line x1="272" y1="200" x2="308" y2="200" stroke="' + P.dim + '" stroke-width="1.5"/>';

    // 8 expert boxes in a vertical column.
    const eX = 340, eW = 220, eH = 32, eGap = 6;
    const totalH = 8 * eH + 7 * eGap;     // 298
    const startY = 41;                     // centred in viewBox height 380
    const selected = new Set([0, 5]);      // experts 1 and 6 are routed
    const centers = [];
    for (let i = 0; i < 8; i++) {
      const y = startY + i * (eH + eGap);
      const cy = y + eH / 2;
      centers.push(cy);
      out += box(eX, y, eW, eH, L.expert + ' ' + (i + 1), null,
                 { variant: selected.has(i) ? null : 'dim' });
    }

    // Vertical bus at x=310, spanning the topmost to bottommost expert centre.
    const busX = 310;
    out += '<line x1="' + busX + '" y1="' + centers[0] + '" x2="' + busX +
           '" y2="' + centers[centers.length - 1] +
           '" stroke="' + P.dim + '" stroke-width="1.5"/>';

    // Tick marks on the bus for non-selected experts (potential routes, not taken).
    for (let i = 0; i < 8; i++) {
      if (selected.has(i)) continue;
      out += '<line x1="' + busX + '" y1="' + centers[i] +
             '" x2="' + (busX + 10) + '" y2="' + centers[i] +
             '" stroke="' + P.dim + '" stroke-width="1"/>';
    }

    // Bright arrows for the selected experts.
    for (const idx of selected) {
      out += '<line x1="' + busX + '" y1="' + centers[idx] +
             '" x2="' + (eX - 4) + '" y2="' + centers[idx] +
             '" stroke="' + P.accent + '" stroke-width="2" marker-end="url(#moe-arr)"/>';
    }

    out += foot(L.foot, 380, 366);
    return svgOpen('moe-diagram', '0 0 760 380') + defs('moe') + out + '</svg>';
  }

  // ====================================================================
  // 6. LoRA — full fine-tuning vs A·B decomposition
  // ====================================================================
  function loraDiagram(lang) {
    const L = lang === 'en' ? {
      full: 'Full fine-tuning', fullW: 'W (1B params, all updated)',
      lora: 'LoRA',
      W: 'W (frozen)', a: 'A (rank r)', b: 'B (rank r)',
      add: '+', mul: '×',
      foot: 'LoRA trains only A and B (~1% of params). At inference: W + A·B (same shape as W).'
    } : {
      full: 'Fine-tuning completo', fullW: 'W (1B params, todos actualizados)',
      lora: 'LoRA',
      W: 'W (congelada)', a: 'A (rango r)', b: 'B (rango r)',
      add: '+', mul: '×',
      foot: 'LoRA sólo entrena A y B (~1% de los params). En inferencia: W + A·B (misma forma que W).'
    };
    let out = '';
    const cx = 360; // viewBox horizontal centre

    // ----- Top row: Full fine-tuning -----
    // Section label, left-aligned at the section's x-start
    out += '<text x="295" y="36" text-anchor="start" class="rd-label">' + L.full + '</text>';
    // Single W box, centred
    out += box(305, 46, 110, 86, 'W', null);
    // Sub-label below the box
    out += '<text x="' + (305 + 55) + '" y="155" text-anchor="middle" class="rd-sub">' + L.fullW + '</text>';

    // Divider between rows
    out += '<line x1="40" y1="186" x2="680" y2="186" stroke="' + P.dim + '" stroke-width="1" stroke-dasharray="3 4"/>';

    // ----- Bottom row: LoRA -----
    // Equation: W(frozen) + A × B  (centred horizontally on cx)
    // Widths: W=110, +sign=20, A=30, ×sign=20, B=110 → total inner width = 290
    // Plus gaps of 8 between elements: 110 + 8 + 20 + 8 + 30 + 8 + 20 + 8 + 110 = 322
    // So start x = cx - 161 = 199
    const eqStart = 199;
    const yEq = 220;        // top of W box
    const wH = 90;
    const eqMidY = yEq + wH / 2;   // 265

    // Section label
    out += '<text x="' + eqStart + '" y="210" text-anchor="start" class="rd-label">' + L.lora + '</text>';

    // W (frozen) box
    let xCursor = eqStart;
    out += box(xCursor, yEq, 110, wH, 'W', null, { variant: 'dim' });
    out += '<text x="' + (xCursor + 55) + '" y="' + (yEq + wH + 22) + '" text-anchor="middle" class="rd-sub">' + L.W + '</text>';
    xCursor += 110 + 8;

    // + sign
    out += '<text x="' + (xCursor + 10) + '" y="' + (eqMidY + 8) + '" text-anchor="middle" font-size="22" fill="' + P.accent + '">' + L.add + '</text>';
    xCursor += 20 + 8;

    // A (tall thin)
    out += box(xCursor, yEq, 30, wH, 'A', null);
    out += '<text x="' + (xCursor + 15) + '" y="' + (yEq + wH + 22) + '" text-anchor="middle" class="rd-sub">' + L.a + '</text>';
    xCursor += 30 + 8;

    // × sign
    out += '<text x="' + (xCursor + 10) + '" y="' + (eqMidY + 8) + '" text-anchor="middle" font-size="22" fill="' + P.accent + '">' + L.mul + '</text>';
    xCursor += 20 + 8;

    // B (wide flat) — vertically centered against the others (y so its mid = eqMidY)
    const bH = 30;
    const bY = eqMidY - bH / 2;
    out += box(xCursor, bY, 110, bH, 'B', null);
    out += '<text x="' + (xCursor + 55) + '" y="' + (yEq + wH + 22) + '" text-anchor="middle" class="rd-sub">' + L.b + '</text>';

    out += foot(L.foot, cx, 376);
    return svgOpen('lora-diagram', '0 0 720 390') + defs('lora') + out + '</svg>';
  }

  // ====================================================================
  // 7. Transformer — vertical block stack
  // ====================================================================
  function transformerDiagram(lang) {
    const L = lang === 'en' ? {
      input: 'Input tokens',
      embed: 'Embedding + position',
      attn: 'Attention',
      ffn: 'Feed-forward',
      block: 'N × Block',
      norm: 'Final layer norm',
      logits: 'Output logits',
      foot: 'Modern LLMs are decoder-only stacks of N blocks (Claude/GPT/Llama: N ≈ 32–80).'
    } : {
      input: 'Tokens de entrada',
      embed: 'Embedding + posición',
      attn: 'Atención',
      ffn: 'Feed-forward',
      block: 'N × bloque',
      norm: 'Normalización final',
      logits: 'Logits de salida',
      foot: 'Los LLMs modernos son stacks decoder-only de N bloques (Claude/GPT/Llama: N ≈ 32–80).'
    };
    // viewBox 480×500. Vertical stack from bottom to top.
    let out = '';
    // Input tokens (bottom)
    out += box(140, 430, 200, 40, L.input, null);
    out += line(240, 425, 240, 405, 'tx');
    // Embedding + position
    out += box(140, 360, 200, 40, L.embed, null);
    out += line(240, 355, 240, 335, 'tx');
    // Block N × { Attention, FFN }
    out += '<rect x="100" y="180" width="280" height="150" rx="12" fill="' + P.accentSoft + '" stroke="' + P.accent + '" stroke-width="1.5" stroke-dasharray="6 4"/>';
    out += '<text x="240" y="200" text-anchor="middle" class="rd-label" fill="' + P.accent + '">' + L.block + '</text>';
    out += box(140, 215, 200, 40, L.attn, null);
    out += line(240, 257, 240, 268, 'tx');
    out += box(140, 275, 200, 40, L.ffn, null);
    // Arrow up out of block group
    out += line(240, 175, 240, 155, 'tx');
    // Final norm
    out += box(140, 110, 200, 40, L.norm, null);
    out += line(240, 105, 240, 85, 'tx');
    // Output logits
    out += box(140, 40, 200, 40, L.logits, null, { variant: 'final' });
    out += foot(L.foot, 240, 488);
    return svgOpen('transformer-diagram', '0 0 480 500') + defs('tx') + out + '</svg>';
  }

  // ====================================================================
  // 8. Chunking — document split into overlapping chunks
  // ====================================================================
  function chunkingDiagram(lang) {
    const L = lang === 'en' ? {
      doc: 'Document — ~10K tokens',
      chunk: 'chunk',
      foot: 'Each chunk 256–512 tokens, with 10–20% overlap so cross-cut answers survive.'
    } : {
      doc: 'Documento — ~10K tokens',
      chunk: 'chunk',
      foot: 'Cada chunk de 256–512 tokens, con 10–20% de overlap para no perder respuestas en el corte.'
    };
    let out = '';
    // Document: full-width long bar
    out += '<rect x="20" y="20" width="920" height="40" rx="8" fill="' + P.accentSoft + '" stroke="' + P.accent + '" stroke-width="1.5"/>';
    out += '<text x="480" y="46" text-anchor="middle" class="rd-label">' + L.doc + '</text>';
    // 5 chunks below, each ~190 wide, with ~25 overlap visualized as the chunk stretching INTO the next.
    // Use chunks at y=110, h=50, w=200 each, x positions to overlap by 30.
    // 5 chunks: starts at 20, 195, 370, 545, 720
    const chunkPositions = [20, 195, 370, 545, 720];
    const CW = 200, CH = 50;
    for (let i = 0; i < chunkPositions.length; i++) {
      const x = chunkPositions[i];
      // Connector from doc bar above
      const docX = 20 + (i + 0.5) * (920 / 5);
      out += '<line x1="' + docX + '" y1="60" x2="' + (x + CW/2) + '" y2="110" stroke="' + P.dim + '" stroke-width="1" stroke-dasharray="3 4"/>';
      // Chunk box
      out += box(x, 110, CW, CH, L.chunk + ' ' + (i + 1), '256-512 tok', null);
      // Overlap region (between this and next): if not last
      if (i < chunkPositions.length - 1) {
        const nextX = chunkPositions[i + 1];
        const overlapStart = nextX;
        const overlapEnd = x + CW;
        if (overlapEnd > overlapStart) {
          out += '<rect x="' + overlapStart + '" y="110" width="' + (overlapEnd - overlapStart) +
            '" height="' + CH + '" fill="' + P.accentBright + '" stroke="none" rx="0"/>';
        }
      }
    }
    // Mini legend for overlap
    out += '<rect x="395" y="190" width="20" height="14" fill="' + P.accentBright + '" stroke="' + P.accent + '" stroke-width="1"/>';
    out += '<text x="423" y="201" class="rd-sub" fill="' + P.textDim + '">' + (lang === 'en' ? 'overlap' : 'solape') + '</text>';
    out += foot(L.foot, 480, 228);
    return svgOpen('chunking-diagram', '0 0 960 245') + defs('chk') + out + '</svg>';
  }

  // ====================================================================
  // 9. Autoregressive — token-by-token generation timeline
  // ====================================================================
  function autoregressiveDiagram(lang) {
    const L = lang === 'en' ? {
      prefix: 'context so far',
      newTok: 'next token',
      foot: 'Each new token is conditioned on ALL previous ones, so order matters.'
    } : {
      prefix: 'contexto hasta ahora',
      newTok: 'token siguiente',
      foot: 'Cada token nuevo se condiciona a TODOS los anteriores, por eso el orden importa.'
    };
    // 7 token slots. First 5 generated, 6th highlighted (just generated), 7th empty (next).
    // viewBox 960x230
    const tokens = ['The', 'cat', 'sat', 'on', 'the', 'mat', '?'];
    const W = 110, GAP = 14, Y = 60, H = 60;
    const total = tokens.length * W + (tokens.length - 1) * GAP; // 7*110 + 6*14 = 770+84 = 854
    const startX = (960 - total) / 2; // 53
    let out = '';
    for (let i = 0; i < tokens.length; i++) {
      const x = startX + i * (W + GAP);
      let opts = null;
      if (i === tokens.length - 1) {
        // Empty next slot, dashed
        out += '<rect x="' + x + '" y="' + Y + '" width="' + W + '" height="' + H +
          '" rx="10" fill="none" stroke="' + P.dim + '" stroke-width="1.5" stroke-dasharray="6 4"/>';
        out += '<text x="' + (x + W/2) + '" y="' + (Y + H/2 + 6) + '" text-anchor="middle" class="rd-sub" fill="' + P.dim + '">' + tokens[i] + '</text>';
      } else if (i === tokens.length - 2) {
        // Just generated — glow
        out += box(x, Y, W, H, tokens[i], null, { glow: true });
      } else {
        // Already generated context
        out += box(x, Y, W, H, tokens[i], null, { variant: 'dim' });
      }
    }
    // Bracket: prefix label over first 6 tokens
    const bX1 = startX - 4;
    const bX2 = startX + 6 * (W + GAP) - GAP + 4 - W - GAP; // end after token 5 (index 4)
    // Simpler: bracket spans tokens 0..5 (the cached + just-generated set)
    const prefixEndX = startX + 5 * (W + GAP) + W + 4; // after token 6
    out += '<line x1="' + (startX - 4) + '" y1="44" x2="' + prefixEndX + '" y2="44" stroke="' + P.dim + '" stroke-width="1"/>';
    out += '<line x1="' + (startX - 4) + '" y1="44" x2="' + (startX - 4) + '" y2="54" stroke="' + P.dim + '" stroke-width="1"/>';
    out += '<line x1="' + prefixEndX + '" y1="44" x2="' + prefixEndX + '" y2="54" stroke="' + P.dim + '" stroke-width="1"/>';
    out += '<text x="' + ((startX - 4 + prefixEndX) / 2) + '" y="36" text-anchor="middle" class="rd-sub" fill="' + P.dim + '">' + L.prefix + '</text>';
    // Arrow from prefix end to next slot (curved or straight)
    const arrowFromX = startX + 5 * (W + GAP) + W + 6;
    const arrowToX = startX + 6 * (W + GAP) - 6;
    const arrowY = Y + H + 16;
    // small arrow underneath pointing to the empty slot
    out += line(startX + 5 * (W + GAP) + W/2, Y + H + 8, startX + 6 * (W + GAP) + W/2, Y + H + 8, 'auto');
    out += '<text x="' + (startX + 6 * (W + GAP) + W/2) + '" y="' + (Y + H + 32) + '" text-anchor="middle" class="rd-sub" fill="' + P.dim + '">' + L.newTok + '</text>';
    out += foot(L.foot, 480, 215);
    return svgOpen('autoreg-diagram', '0 0 960 230') + defs('auto') + out + '</svg>';
  }

  // ====================================================================
  // 10. CoT — without vs with chain-of-thought (side by side)
  // ====================================================================
  function cotDiagram(lang) {
    const L = lang === 'en' ? {
      no: 'Without CoT', yes: 'With CoT',
      q: 'Question', a: 'Answer',
      step1: 'Step 1', step2: 'Step 2', step3: 'Step 3',
      bad: 'Often wrong on multi-step problems', good: 'Verifiable, often correct',
      foot: 'Modern reasoning models (Claude extended thinking, o-series) do CoT internally.'
    } : {
      no: 'Sin CoT', yes: 'Con CoT',
      q: 'Pregunta', a: 'Respuesta',
      step1: 'Paso 1', step2: 'Paso 2', step3: 'Paso 3',
      bad: 'Frecuentemente erróneo en problemas multi-paso', good: 'Verificable, suele acertar',
      foot: 'Los modelos modernos (Claude extended thinking, o-series) hacen CoT internamente.'
    };
    // viewBox 720×360. Two columns.
    let out = '';
    // Headers
    out += '<text x="170" y="32" text-anchor="middle" class="rd-label" fill="' + P.text + '">' + L.no + '</text>';
    out += '<text x="550" y="32" text-anchor="middle" class="rd-label" fill="' + P.text + '">' + L.yes + '</text>';
    // Divider
    out += '<line x1="360" y1="50" x2="360" y2="320" stroke="' + P.dim + '" stroke-width="1" stroke-dasharray="3 4"/>';
    // Left column (without CoT): Q → A (red)
    out += box(80, 56, 180, 50, L.q, null);
    out += line(170, 110, 170, 200, 'cot');
    out += box(80, 204, 180, 50, L.a, null, { variant: 'red' });
    out += '<text x="170" y="280" text-anchor="middle" class="rd-sub" fill="' + P.red + '">' + L.bad + '</text>';
    // Right column (with CoT): Q → step1 → step2 → step3 → A (green)
    out += box(460, 56, 180, 36, L.q, null);
    out += line(550, 96, 550, 110, 'cot');
    out += box(460, 114, 180, 28, L.step1, null);
    out += line(550, 146, 550, 154, 'cot');
    out += box(460, 156, 180, 28, L.step2, null);
    out += line(550, 188, 550, 196, 'cot');
    out += box(460, 198, 180, 28, L.step3, null);
    out += line(550, 230, 550, 244, 'cot', { color: P.green });
    out += box(460, 248, 180, 36, L.a, null, { variant: 'final' });
    out += '<text x="550" y="306" text-anchor="middle" class="rd-sub" fill="' + P.green + '">' + L.good + '</text>';
    out += foot(L.foot, 360, 348);
    return svgOpen('cot-diagram', '0 0 720 360') + defs('cot') + out + '</svg>';
  }

  // ----- Public registry -------------------------------------------------
  window.GLOSSARY_DIAGRAMS = {
    rag: ragDiagram,
    attention: attentionDiagram,
    agent: agentDiagram,
    react: agentDiagram,           // ReAct uses the same loop visualisation
    'kv-cache': kvCacheDiagram,
    moe: moeDiagram,
    lora: loraDiagram,
    transformer: transformerDiagram,
    chunking: chunkingDiagram,
    autoregressive: autoregressiveDiagram,
    cot: cotDiagram
  };
})();
