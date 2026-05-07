/* ============================================================
   Glosario interactivo — tooltip on hover sobre términos técnicos
   © Alonso J. Núñez · GS·RUN
   ============================================================ */

const Glossary = {
  terms: {
    'LLM': 'Large Language Model. Red neuronal transformer entrenada en cantidades masivas de texto para predecir el siguiente token. GPT, Claude, Llama, DeepSeek son LLMs.',
    'token': 'Sub-unidad de texto que el modelo procesa. ~3-4 caracteres en inglés, ~2 en español. "hello" = 1 token; "increíble" ≈ 3 tokens. Los precios de API se miden en tokens.',
    'tokens': 'Sub-unidades de texto que el modelo procesa. ~3-4 caracteres en inglés. Los precios de API se miden en tokens.',
    'prompt': 'Instrucciones de entrada que se le dan al modelo. Incluye system prompt + user prompt + opcionalmente assistant prompts previos.',
    'context window': 'Tamaño máximo de input que el modelo acepta en una llamada (en tokens). Claude Opus 4.7: 200K tokens; Gemini 2.5 Pro: 1M+.',
    'temperature': 'Parámetro 0-2 que controla aleatoriedad. 0 = determinista (siempre la misma respuesta); 1 = creativo; >1 = caótico. Para extracción usa 0; para creatividad 0.7-1.',
    'top_p': 'Nucleus sampling. Filtra tokens cuya probabilidad acumulada supera P. 0.9 = considera el 90% más probable. Controla diversidad sin caos.',
    'top_k': 'Limita las opciones del modelo a los K tokens más probables en cada paso. K=40 es estándar.',
    'system prompt': 'Mensaje inicial que define el rol/comportamiento del modelo. Persiste durante toda la conversación. NO debe contener datos del usuario.',
    'few-shot': 'Técnica que da N ejemplos input→output dentro del prompt para enseñar un patrón. 2-3 ejemplos suelen ser suficientes.',
    'zero-shot': 'Pedir al modelo que haga la tarea sin ejemplos. Funciona si la tarea es estándar; falla en casos específicos.',
    'CoT': 'Chain of Thought. Pedirle al modelo que razone paso a paso antes de responder. Mejora drásticamente accuracy en tareas multi-step.',
    'Chain of Thought': 'Pedirle al modelo que razone paso a paso antes de responder. Mejora drásticamente accuracy en tareas multi-step.',
    'ReAct': 'Reasoning + Acting. Patrón donde el agente alterna pensamiento y uso de herramientas (Thought → Action → Observation). Base de todos los AI agents.',
    'RAG': 'Retrieval Augmented Generation. Antes de responder, el sistema busca documentos relevantes y los inyecta en el contexto. Combate hallucinations.',
    'embedding': 'Vector denso (típ. 768-1536 dims) que representa el "significado" de un texto. Permite búsqueda semántica (cerca en vector = cerca en concepto).',
    'embeddings': 'Vectores densos que representan significado de textos. Permiten búsqueda semántica.',
    'thinking tokens': 'Tokens de razonamiento interno del modelo, no mostrados al usuario. Claude Opus 4.7 los genera al activar "extended thinking". Mejoran accuracy en tareas complejas.',
    'hallucination': 'Cuando el modelo inventa información (hechos, citas, APIs) presentándola como real. El bug #1 de los LLMs en producción.',
    'prompt injection': 'Ataque donde input del usuario se interpreta como instrucciones del sistema ("ignore previous instructions..."). Top vulnerabilidad OWASP LLM.',
    'jailbreak': 'Variante de injection que elude filtros de seguridad del modelo. "DAN" prompts, role-play hostil, etc.',
    'fine-tuning': 'Reentrenamiento del modelo con datos propios para especializarlo. Caro y rígido vs prompt engineering. Usa solo si prompting no es suficiente.',
    'SFT': 'Supervised Fine-Tuning. Fine-tuning estándar con pares input→output ideales. Primer paso post-pretraining.',
    'RLHF': 'Reinforcement Learning from Human Feedback. Entrenamiento donde humanos rankean respuestas y el modelo aprende preferencias. Base de ChatGPT, Claude, Gemini.',
    'DPO': 'Direct Preference Optimization. Alternativa más simple a RLHF — no requiere reward model separado. Más popular en 2025+.',
    'LoRA': 'Low-Rank Adaptation. Fine-tuning ligero que solo entrena un % pequeño de pesos (<1%). 100× más barato que full fine-tuning.',
    'QLoRA': 'LoRA + cuantización 4-bit. Permite fine-tunear modelos 70B en una sola GPU consumer. Standard de fine-tuning local.',
    'quantization': 'Comprimir pesos del modelo de FP32/FP16 a INT8/INT4/INT2. Reduce VRAM 4-8× con pérdida de calidad <2%.',
    'GGUF': 'Formato de archivo de llama.cpp para modelos cuantizados. Universal, soporta múltiples niveles de quantization (Q4_K_M, Q5, Q8).',
    'GPTQ': 'Algoritmo de quantization post-training. Calidad alta a 4-bit. Standard antes de AWQ.',
    'AWQ': 'Activation-aware Weight Quantization. Más nuevo que GPTQ, mejor preservación de pesos críticos. Standard 2025.',
    'MoE': 'Mixture of Experts. Arquitectura donde solo K de N "expertos" se activan por token. Permite modelos enormes con coste computacional moderado (DeepSeek V3, Mixtral).',
    'KV cache': 'Cache de Key/Value de attention layers durante inference. Permite generar tokens uno a uno sin recomputar contexto. Crítico para velocidad.',
    'MCP': 'Model Context Protocol (Anthropic 2024). Estándar abierto para que LLMs hablen con tools/recursos externos vía JSON-RPC. Reemplaza function-calling propietario.',
    'agent': 'Sistema que usa un LLM como "cerebro" para razonar, decidir acciones, ejecutar tools y adaptar. Diferencia con "chatbot": tiene autonomía + tools.',
    'sub-agent': 'Agente lanzado por otro agente para tarea acotada (ej. búsqueda en docs). Patrón de orchestration en Claude Code.',
    'skill': 'Capacidad reutilizable definida en SKILL.md (Claude Code). Frontmatter YAML + cuerpo markdown. Carga lazy según trigger.',
    'tool use': 'Capacidad del modelo de invocar funciones externas (search, calculator, code-exec) durante la generación. Implementado vía special tokens.',
    'function calling': 'Sinónimo legacy de "tool use". OpenAI lo llamó así primero (2023). Claude/Gemini lo llaman tool use.',
    'JSON Schema': 'Estándar para definir estructura JSON. En prompting, garantiza que el output del modelo sea parseable. Soportado nativamente por Claude/GPT-4.',
    'attention': 'Mecanismo del transformer que permite a cada token "mirar" otros tokens del contexto. Coste O(n²) — por eso context window es limitado.',
    'transformer': 'Arquitectura neural (2017, "Attention is All You Need") base de TODOS los LLMs modernos. Stack de bloques attention + feed-forward.',
    'autoregressive': 'Generación token-a-token: cada nuevo token depende solo de los anteriores. Es por eso que los LLMs son lentos en outputs largos.',
    'speculative decoding': 'Optimización: usa modelo pequeño para "adivinar" K tokens, modelo grande verifica en paralelo. 2-3× speedup sin pérdida calidad.',
    'pre-training': 'Primera fase de entrenamiento: el modelo aprende lenguaje prediciendo tokens en un corpus masivo (GB-TB de texto). Base genérica.',
    'post-training': 'Fases posteriores al pre-training: SFT + RLHF/DPO. Convierten el modelo base en un asistente conversacional alineado.',
    'pass@k': 'Métrica de coding: probabilidad de que al menos 1 de K generaciones sea correcta. pass@1 = single shot; pass@10 más permisivo.',
    'MMLU': 'Massive Multitask Language Understanding. Benchmark de 57 dominios académicos. Score >90% es nivel humano-experto.',
    'HumanEval': 'Benchmark de coding Python con 164 problemas. Saturado >95% en frontier models.',
    'SWE-bench': 'Benchmark de bug fixing en repos reales de GitHub. Métrica realista para coding agents.',
    'GPQA': 'Graduate-level Physics, Chem, Bio. Preguntas "Google-proof" — requieren entender, no recordar.',
    'OpenCode': 'Coding agent open-source para DeepSeek/Claude/GPT. Lee AGENTS.md como config (similar a CLAUDE.md).',
    'CLAUDE.md': 'Archivo de configuración persistente para Claude Code en un proyecto. Define reglas, paths, comandos preferidos.',
    'AGENTS.md': 'Equivalente de CLAUDE.md para OpenCode (DeepSeek, Cursor). Mismo concepto, distinto archivo según agente.',
    'eval': 'Test automatizado de calidad de un prompt. Mide accuracy contra dataset ground-truth + métricas (latency, cost).',
    'prompt caching': 'Optimización de Anthropic/OpenAI: prefijos repetidos del prompt se cachean → 90% descuento en input tokens. Crítico para system prompts largos.',
    'context': 'El input completo que el modelo "ve" en una llamada: system prompt + user messages + assistant messages previos.',
    'frontier model': 'Modelo top del estado del arte: Claude Opus 4.7, GPT-5.5, Gemini 2.5 Pro, DeepSeek V4 Pro. ~$15-30 / 1M output tokens.',
    'open source': 'Modelo cuyos pesos son descargables (Llama, DeepSeek, Mistral, Qwen). Distinto a propietario (Claude, GPT-4, Gemini).',
    'XML structure': 'Técnica de estructurar prompts con tags XML (<instructions>, <context>, <examples>). Recomendada por Anthropic — Claude la procesa especialmente bien.',
    'role prompting': 'Asignar identidad al modelo ("Eres un editor profesional..."). Mejora calidad típicamente 10-30% en tareas profesionales.',
    'multimodal': 'Modelo que acepta más de un tipo de input (texto + imagen + audio + video). GPT-4V, Claude Opus 4.7, Gemini 2.5 son multimodales.',
    'vision': 'Capacidad de procesar imágenes como input. Subconjunto de multimodal.',
    'TruthfulQA': 'Benchmark que mide veracidad — ¿el modelo cae en mitos populares?',
    'MT-Bench': 'Benchmark conversacional multi-turno juzgado por GPT-4 (LLM-as-Judge). Mide calidad subjetiva.',
    'HellaSwag': 'Benchmark de sentido común — completar el final más lógico de un escenario.',
    'GSM8K': 'Benchmark de matemáticas escolares con problemas multi-step.',
  },

  init() {
    this.attachHover();
  },

  attachHover() {
    // Crea el tooltip flotante (singleton)
    let tip = document.getElementById('glossary-tooltip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'glossary-tooltip';
      tip.style.cssText = 'position:fixed;display:none;z-index:1000;max-width:340px;padding:14px 16px;background:var(--bg-card);border:1px solid var(--accent);border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.4);font-size:13px;line-height:1.55;color:var(--text);backdrop-filter:blur(12px);pointer-events:none;';
      document.body.appendChild(tip);
    }

    // Auto-wrap términos en el contenido principal
    const all = Object.keys(this.terms).sort((a,b) => b.length - a.length); // largos primero
    const main = document.getElementById('main');
    if (!main) return;

    // Recorre solo nodos de texto en h2/h3/h4/p/li/td (no en pre/code para no romper código)
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => {
        const p = n.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        const skip = ['PRE','CODE','SCRIPT','STYLE','TEXTAREA','INPUT','BUTTON','OPTION'];
        if (skip.includes(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (p.closest('.gloss-term')) return NodeFilter.FILTER_REJECT;
        if (!n.textContent.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const toReplace = [];
    let node;
    while ((node = walker.nextNode())) toReplace.push(node);

    for (const tn of toReplace) {
      let txt = tn.textContent;
      let frag = null;
      let lastIdx = 0;
      let matched = false;
      const reParts = all.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      const re = new RegExp(`\\b(${reParts.join('|')})\\b`, 'g');
      let m;
      const positions = [];
      while ((m = re.exec(txt)) !== null) {
        positions.push({ start: m.index, end: m.index + m[0].length, term: m[1] });
      }
      if (!positions.length) continue;
      frag = document.createDocumentFragment();
      for (const pos of positions) {
        if (pos.start > lastIdx) frag.appendChild(document.createTextNode(txt.slice(lastIdx, pos.start)));
        const span = document.createElement('span');
        span.className = 'gloss-term';
        span.dataset.term = pos.term;
        span.textContent = txt.slice(pos.start, pos.end);
        frag.appendChild(span);
        lastIdx = pos.end;
        matched = true;
      }
      if (lastIdx < txt.length) frag.appendChild(document.createTextNode(txt.slice(lastIdx)));
      if (matched && tn.parentNode) {
        tn.parentNode.replaceChild(frag, tn);
      }
    }

    // Listeners delegados
    main.addEventListener('mouseover', (e) => {
      const span = e.target.closest('.gloss-term');
      if (!span) return;
      const term = span.dataset.term;
      const def = this.terms[term];
      if (!def) return;
      tip.innerHTML = `<strong style="color:var(--accent);font-size:14px;">${term}</strong><br><span style="color:var(--text-dim);">${def}</span>`;
      tip.style.display = 'block';
    });
    main.addEventListener('mousemove', (e) => {
      if (tip.style.display === 'none') return;
      const x = Math.min(e.clientX + 14, window.innerWidth - 360);
      const y = Math.min(e.clientY + 14, window.innerHeight - 180);
      tip.style.left = x + 'px';
      tip.style.top = y + 'px';
    });
    main.addEventListener('mouseout', (e) => {
      if (e.target.closest('.gloss-term')) tip.style.display = 'none';
    });
  },
};

// Init después de que el DOM principal esté listo + tras pequeño delay
// para que otras renders dinámicas (cards, tablas) ya estén en su sitio.
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => Glossary.init(), 300);
});
window.Glossary = Glossary;
