/* ============================================================
   Glossary diagrams — hand-tuned inline SVGs, one per term that
   benefits visually. Each diagram is a (lang) => svgString function
   so the same layout can be rendered ES or EN without duplicating
   markup. Consumed by js/glossary-page.js when an entry's id matches.

   v2.3.1 — 2026-05-08
   ============================================================ */

(function () {
  const PALETTE = {
    accent: '#F5A524',
    accentSoft: 'rgba(245,165,36,0.06)',
    green: '#6EBE7F',
    greenSoft: 'rgba(110,190,127,0.08)'
  };

  // ------- RAG: indexing once, querying every time -------
  function ragDiagram(lang) {
    const L = lang === 'en' ? {
      query: 'Query',
      querySub: 'user question',
      embed: 'Embed',
      embedSub: '→ vector',
      vdb: 'Vector DB',
      vdbSub: 'semantic search',
      topk: 'Top-k chunks',
      topkSub: 'most relevant',
      llm: 'LLM + prompt',
      llmSub: 'context + question',
      ans: 'Answer + citations',
      ansSub: 'grounded',
      foot: 'The vector DB already has the documents indexed as chunks + embeddings.'
    } : {
      query: 'Consulta',
      querySub: 'pregunta del usuario',
      embed: 'Embed',
      embedSub: '→ vector',
      vdb: 'Vector DB',
      vdbSub: 'búsqueda semántica',
      topk: 'Top-k chunks',
      topkSub: 'los más relevantes',
      llm: 'LLM + prompt',
      llmSub: 'contexto + pregunta',
      ans: 'Respuesta + citas',
      ansSub: 'fundamentada',
      foot: 'El vector DB ya tiene los documentos indexados como chunks + embeddings.'
    };

    // 6 boxes 130w x 100h, gap 26, vertical centre y=100, viewBox 960x200.
    const boxes = [
      { x: 25,  label: L.query,  sub: L.querySub,  final: false },
      { x: 181, label: L.embed,  sub: L.embedSub,  final: false },
      { x: 337, label: L.vdb,    sub: L.vdbSub,    final: false },
      { x: 493, label: L.topk,   sub: L.topkSub,   final: false },
      { x: 649, label: L.llm,    sub: L.llmSub,    final: false },
      { x: 805, label: L.ans,    sub: L.ansSub,    final: true  }
    ];

    const boxesSvg = boxes.map((b) => {
      const stroke = b.final ? PALETTE.green : PALETTE.accent;
      const fill = b.final ? PALETTE.greenSoft : PALETTE.accentSoft;
      const cx = b.x + 65;
      const labelClass = b.final ? 'rd-label rd-label-final' : 'rd-label';
      return (
        '<rect x="' + b.x + '" y="50" width="130" height="100" rx="10" ' +
        'fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5"/>' +
        '<text x="' + cx + '" y="92" text-anchor="middle" class="' + labelClass + '">' + b.label + '</text>' +
        '<text x="' + cx + '" y="118" text-anchor="middle" class="rd-sub">' + b.sub + '</text>'
      );
    }).join('');

    // 5 connectors; the last one (into the green box) is green.
    const arrows = [];
    for (let i = 0; i < 5; i++) {
      const fromX = boxes[i].x + 130 + 4;
      const toX   = boxes[i + 1].x - 4;
      const isFinal = i === 4;
      const colour = isFinal ? PALETTE.green : PALETTE.accent;
      const marker = isFinal ? 'rag-arr-green' : 'rag-arr';
      arrows.push(
        '<line x1="' + fromX + '" y1="100" x2="' + toX + '" y2="100" ' +
        'stroke="' + colour + '" stroke-width="1.5" ' +
        'marker-end="url(#' + marker + ')"/>'
      );
    }

    return (
      '<svg viewBox="0 0 960 200" xmlns="http://www.w3.org/2000/svg" ' +
      'class="rag-diagram" role="img" preserveAspectRatio="xMidYMid meet">' +
        '<defs>' +
          '<marker id="rag-arr" viewBox="0 0 10 10" refX="8" refY="5" ' +
                  'markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
            '<path d="M0,0 L10,5 L0,10 Z" fill="' + PALETTE.accent + '"/>' +
          '</marker>' +
          '<marker id="rag-arr-green" viewBox="0 0 10 10" refX="8" refY="5" ' +
                  'markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
            '<path d="M0,0 L10,5 L0,10 Z" fill="' + PALETTE.green + '"/>' +
          '</marker>' +
        '</defs>' +
        boxesSvg +
        arrows.join('') +
        '<text x="480" y="183" text-anchor="middle" class="rd-foot">' + L.foot + '</text>' +
      '</svg>'
    );
  }

  window.GLOSSARY_DIAGRAMS = {
    rag: ragDiagram
    // Held for next iterations (after design sign-off):
    //   transformer, agent (ReAct loop), kv-cache, moe, finetuning-vs-rag
  };
})();
