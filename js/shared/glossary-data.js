/* ============================================================
   Glossary data — terms grouped alphabetically. Each term has a
   precise definition in ES and EN and a pointer to the block where
   it is first introduced.
   ============================================================ */

(function () {
  const TERMS = [
    // A
    { term: 'Agent', block: '05', es: 'Sistema que usa un LLM para razonar, decidir acciones, ejecutar tools y adaptarse de forma autónoma. Iteración thought→action→observation hasta completar la tarea.', en: 'System that uses an LLM to reason, decide actions, execute tools and adapt autonomously. Iterates thought→action→observation until task complete.' },
    { term: 'AGI (Artificial General Intelligence)', block: '01', es: 'IA con capacidades intelectuales generales iguales o superiores al humano en cualquier tarea. En 2026 sigue siendo aspiracional; los LLMs actuales son ANI (narrow).', en: 'AI with general intellectual capabilities equal to or beyond humans on any task. As of 2026 still aspirational; current LLMs are ANI (narrow).' },
    { term: 'Adaptive Thinking', block: '03', es: 'Modo de Claude Opus 4.7+ donde el modelo decide dinámicamente cuántos tokens de razonamiento gastar según la complejidad y el effort configurado.', en: 'Claude Opus 4.7+ mode where the model dynamically decides how many reasoning tokens to spend based on complexity and configured effort.' },
    { term: 'AGENTS.md', block: '05', es: 'Archivo de memoria de proyecto leído por OpenCode (equivalente a CLAUDE.md de Claude Code). Define reglas, convenciones y memoria persistente del agente.', en: 'Project memory file read by OpenCode (equivalent to Claude Code\'s CLAUDE.md). Defines rules, conventions and persistent agent memory.' },
    { term: 'AHL (Anthropic Safety Levels)', block: '10', es: 'Niveles ASL-1 a ASL-4+ definidos por Anthropic según riesgo CBRN/cyber. Cada nivel implica requisitos crecientes de seguridad antes del deployment.', en: 'ASL-1 to ASL-4+ levels defined by Anthropic by CBRN/cyber risk. Each level implies escalating security requirements before deployment.' },
    { term: 'Attention', block: '01', es: 'Mecanismo central del transformer: cada token calcula a qué otros tokens del contexto debe "atender" para producir su representación. Permite contexto largo y razonamiento.', en: 'Core transformer mechanism: each token computes which other context tokens it should "attend" to in producing its representation. Enables long context and reasoning.' },
    { term: 'Autoregressive', block: '01', es: 'Generación token-por-token donde cada token se produce condicionado a todos los anteriores. Todos los LLMs actuales son autoregressive.', en: 'Token-by-token generation where each token is produced conditioned on all previous ones. All current LLMs are autoregressive.' },
    { term: 'AWQ (Activation-aware Weight Quantization)', block: '07', es: 'Método de cuantización a 4 bits que protege el ~1% de canales más salientes. Mejor calidad que GPTQ a igual tamaño.', en: '4-bit quantization method that protects the ~1% most salient channels. Better quality than GPTQ at the same size.' },

    // B
    { term: 'Benchmark', block: '09', es: 'Conjunto estandarizado de tareas para medir capacidad de un modelo. MMLU, HumanEval, GPQA, SWE-bench, ARC-AGI son los principales en 2026.', en: 'Standardized task set to measure a model\'s capability. MMLU, HumanEval, GPQA, SWE-bench, ARC-AGI are the main ones in 2026.' },
    { term: 'BPE (Byte Pair Encoding)', block: '01', es: 'Algoritmo de tokenización que fusiona pares frecuentes de caracteres/bytes. Variante "byte-level BPE" usa GPT, Claude, Llama; "SentencePiece" usa Gemma, Qwen.', en: 'Tokenization algorithm that merges frequent pairs of characters/bytes. "Byte-level BPE" used by GPT, Claude, Llama; "SentencePiece" used by Gemma, Qwen.' },

    // C
    { term: 'Chain of Thought (CoT)', block: '02', es: 'Técnica que pide al modelo razonar paso a paso antes de dar la respuesta final. Mejora drásticamente matemáticas y lógica.', en: 'Technique asking the model to reason step by step before giving the final answer. Dramatically improves math and logic.' },
    { term: 'CLAUDE.md', block: '05', es: 'Archivo de memoria leído nativamente por Claude Code. Define reglas del proyecto, convenciones, y memoria persistente del agente.', en: 'Memory file natively read by Claude Code. Defines project rules, conventions, and persistent agent memory.' },
    { term: 'Constitutional AI', block: '10', es: 'Método de Anthropic donde el modelo se auto-critica y mejora siguiendo una "constitución" de principios éticos, escalable sin tantos humanos como RLHF.', en: 'Anthropic method where the model self-critiques and improves following a "constitution" of ethical principles, scalable without as many humans as RLHF.' },
    { term: 'Context Window', block: '01', es: 'Tokens máximos que un modelo puede procesar en una sola llamada. 200K (Claude), 256K (GPT-5), 1M+ (Gemini), 2M (Kimi K2) en 2026.', en: 'Maximum tokens a model can process in a single call. 200K (Claude), 256K (GPT-5), 1M+ (Gemini), 2M (Kimi K2) in 2026.' },

    // D
    { term: 'DPO (Direct Preference Optimization)', block: '07', es: 'Alternativa a RLHF que optimiza directamente sobre pares preferido/rechazado, sin reward model separado. Más simple y estable. Usado por Llama 3/4, Mistral.', en: 'RLHF alternative that optimizes directly on preferred/rejected pairs, no separate reward model. Simpler and more stable. Used by Llama 3/4, Mistral.' },

    // E
    { term: 'Effort Levels', block: '03', es: 'Parámetro de Claude Opus 4.7 (low/medium/high/xhigh/max) que controla cuánto razona el modelo antes de responder. Equivalente a OpenAI reasoning_effort.', en: 'Claude Opus 4.7 parameter (low/medium/high/xhigh/max) controlling how much the model reasons before answering. Equivalent to OpenAI reasoning_effort.' },
    { term: 'Embedding', block: '06', es: 'Vector denso (e.g. 1024 dimensiones) que representa el significado semántico de un texto. Base de RAG y búsqueda semántica.', en: 'Dense vector (e.g. 1024 dimensions) representing the semantic meaning of a text. Foundation of RAG and semantic search.' },
    { term: 'Eval', block: '04', es: 'Evaluación automatizada que mide objetivamente la calidad de un prompt o modelo sobre un dataset de prueba. Anthropic insiste en construir evals ANTES de iterar.', en: 'Automated evaluation that objectively measures the quality of a prompt or model on a test dataset. Anthropic insists on building evals BEFORE iterating.' },

    // F
    { term: 'Few-shot', block: '02', es: 'Técnica que da al modelo 3-5 ejemplos input→output para que aprenda el patrón en contexto. Sweet spot según Anthropic.', en: 'Technique giving the model 3-5 input→output examples so it learns the pattern in context. Anthropic sweet spot.' },
    { term: 'Fine-tuning', block: '07', es: 'Re-entrenar un modelo base sobre un dataset específico para internalizar comportamiento. Variantes: SFT, LoRA, QLoRA, DPO. NO añade conocimiento factual nuevo (eso es RAG).', en: 'Re-training a base model on a specific dataset to internalize behavior. Variants: SFT, LoRA, QLoRA, DPO. Does NOT add new factual knowledge (that\'s RAG).' },
    { term: 'Function Calling', block: '03', es: 'Capacidad del modelo de invocar herramientas externas (funciones) con argumentos estructurados. Llamado "Tool Use" en Anthropic.', en: 'Model\'s ability to invoke external tools (functions) with structured arguments. Called "Tool Use" by Anthropic.' },

    // G
    { term: 'GGUF', block: '07', es: 'Formato de archivo de llama.cpp que empaqueta pesos + metadata + tokenizador en un solo archivo. Soporta cuantización mixta por capa (K-quants).', en: 'llama.cpp file format that bundles weights + metadata + tokenizer into a single file. Supports mixed per-layer quantization (K-quants).' },
    { term: 'GPTQ', block: '07', es: 'Método de cuantización a 4 u 8 bits post-training. Necesita dataset de calibración (~128 samples). Optimizado para GPU.', en: '4 or 8-bit post-training quantization method. Needs calibration dataset (~128 samples). GPU-optimized.' },
    { term: 'Greedy decoding', block: '02', es: 'Sampling determinista (temperature=0) que elige siempre el token más probable. Reproducible pero a veces repetitivo.', en: 'Deterministic sampling (temperature=0) that always picks the most likely token. Reproducible but sometimes repetitive.' },

    // H
    { term: 'Hallucination', block: '10', es: 'Cuando el modelo genera información factualmente incorrecta con tono confiado. Tipos: factual, atribución falsa, invención, overconfidence.', en: 'When the model generates factually incorrect information with confident tone. Types: factual, false attribution, invention, overconfidence.' },
    { term: 'HumanEval', block: '09', es: 'Benchmark de 164 problemas de programación Python. Métrica pass@k. Saturado &gt;95% en frontier models 2026.', en: 'Benchmark of 164 Python programming problems. Metric pass@k. Saturated &gt;95% in 2026 frontier models.' },

    // I
    { term: 'In-context learning', block: '02', es: 'Capacidad de los LLMs de aprender un patrón desde ejemplos en el prompt sin actualizar los pesos. Base del few-shot.', en: 'LLMs\' ability to learn a pattern from prompt examples without updating weights. Foundation of few-shot.' },

    // J
    { term: 'JSON Schema', block: '04', es: 'Especificación que define la estructura exacta esperada de un JSON. Usado por structured outputs para forzar formato.', en: 'Specification defining the exact expected structure of a JSON. Used by structured outputs to enforce format.' },

    // K
    { term: 'KV Cache', block: '06', es: 'Cache de claves y valores de la atención, almacenado entre tokens generados. Permite que un transformer no recompute la atención sobre tokens previos. Crítico para latencia.', en: 'Cache of attention keys and values stored across generated tokens. Lets a transformer skip recomputing attention on prior tokens. Critical for latency.' },

    // L
    { term: 'LLM (Large Language Model)', block: '01', es: 'Modelo entrenado masivamente en texto para predecir el siguiente token. Capaz de generar, resumir, traducir, razonar. Claude, GPT, Gemini, DeepSeek, Llama, etc.', en: 'Model trained massively on text to predict the next token. Capable of generating, summarizing, translating, reasoning. Claude, GPT, Gemini, DeepSeek, Llama, etc.' },
    { term: 'LoRA (Low-Rank Adaptation)', block: '07', es: 'Fine-tuning eficiente que añade matrices pequeñas (~1% params) en lugar de actualizar todos los pesos. QLoRA = LoRA sobre modelo cuantizado a 4-bit.', en: 'Efficient fine-tuning that adds small matrices (~1% params) instead of updating all weights. QLoRA = LoRA on a 4-bit quantized model.' },

    // M
    { term: 'MCP (Model Context Protocol)', block: '05', es: 'Protocolo abierto de Anthropic (2024) para conectar agentes a fuentes de datos y herramientas externas (Drive, Jira, Slack, DBs, APIs).', en: 'Anthropic open protocol (2024) to connect agents to external data sources and tools (Drive, Jira, Slack, DBs, APIs).' },
    { term: 'MMLU', block: '09', es: 'Benchmark de 57 dominios académicos, ~16K preguntas multiple choice. Saturado &gt;90% en frontier 2026, expert humans ~89.8%.', en: 'Benchmark across 57 academic domains, ~16K multiple choice questions. Saturated &gt;90% in 2026 frontier, expert humans ~89.8%.' },
    { term: 'MoE (Mixture of Experts)', block: '01', es: 'Arquitectura donde solo se activa un subconjunto de "expertos" por token. Permite modelos con muchos params totales pero pocos activos por token. DeepSeek V3, Llama 4 son MoE.', en: 'Architecture activating only a subset of "experts" per token. Allows models with many total params but few active per token. DeepSeek V3, Llama 4 are MoE.' },
    { term: 'Multimodal', block: '03', es: 'Modelo que procesa más de una modalidad (texto, imagen, audio, vídeo). VLM = vision-language model. Frontier 2026 son multimodales nativos.', en: 'Model that processes more than one modality (text, image, audio, video). VLM = vision-language model. 2026 frontier models are natively multimodal.' },

    // N
    { term: 'Nucleus Sampling (top_p)', block: '02', es: 'Sampling que solo considera los tokens cuyas probabilidades acumuladas suman p (e.g. 0.9). Recorta la cola larga.', en: 'Sampling that only considers tokens whose cumulative probabilities sum to p (e.g. 0.9). Trims the long tail.' },

    // P
    { term: 'Pre-training', block: '01', es: 'Primera fase del entrenamiento: predice el siguiente token sobre trillones de tokens de internet. Costoso ($10M-$500M+), enseña gramática, hechos, razonamiento.', en: 'First training phase: next-token prediction over trillions of internet tokens. Expensive ($10M-$500M+), teaches grammar, facts, reasoning.' },
    { term: 'Prompt Caching', block: '04', es: 'Marcar bloques del prompt como cacheables. Primera llamada paga 1.25× input price; siguientes pagan 0.10×. Anthropic, Google, DeepSeek lo soportan.', en: 'Marking prompt blocks as cacheable. First call pays 1.25× input price; subsequent calls pay 0.10×. Anthropic, Google, DeepSeek support it.' },
    { term: 'Prompt Injection', block: '04', es: 'Ataque que inyecta instrucciones maliciosas en el prompt para sobrescribir las del sistema. Directa ("ignora instrucciones") o indirecta (vía contenido externo).', en: 'Attack injecting malicious instructions into the prompt to override system ones. Direct ("ignore instructions") or indirect (via external content).' },
    { term: 'Post-training', block: '07', es: 'Segunda fase del entrenamiento (alignment): SFT, RLHF, DPO, Constitutional AI. Lo que convierte un base model en asistente útil.', en: 'Second training phase (alignment): SFT, RLHF, DPO, Constitutional AI. What turns a base model into a useful assistant.' },

    // Q
    { term: 'Quantization', block: '07', es: 'Reducir la precisión de los pesos (FP16 → INT8/INT4/INT2) para que el modelo ocupe menos memoria. Q4_K_M es el sweet spot 2026.', en: 'Reducing weight precision (FP16 → INT8/INT4/INT2) so the model takes less memory. Q4_K_M is the 2026 sweet spot.' },

    // R
    { term: 'RAG (Retrieval Augmented Generation)', block: '06', es: 'Patrón que aumenta el LLM con documentos externos relevantes recuperados por similitud semántica antes de responder.', en: 'Pattern that augments the LLM with relevant external documents retrieved by semantic similarity before answering.' },
    { term: 'ReAct', block: '03', es: 'Patrón Reasoning + Acting: el modelo intercala thought (razonamiento), action (tool call), observation (resultado) hasta resolver. Yao et al. 2022.', en: 'Reasoning + Acting pattern: the model alternates thought (reasoning), action (tool call), observation (result) until solved. Yao et al. 2022.' },
    { term: 'Reasoning effort', block: '03', es: 'Parámetro de OpenAI o-series y GPT-5: minimal/low/medium/high. Controla cuánto razonamiento interno antes de la respuesta visible.', en: 'OpenAI o-series and GPT-5 parameter: minimal/low/medium/high. Controls how much internal reasoning before the visible answer.' },
    { term: 'RLHF (Reinforcement Learning from Human Feedback)', block: '07', es: 'Método de alignment: humanos rankean respuestas → reward model → PPO optimiza el LLM. Usado en GPT-4, primeros Claude.', en: 'Alignment method: humans rank responses → reward model → PPO optimizes the LLM. Used in GPT-4, early Claude.' },
    { term: 'Role Prompting', block: '02', es: 'Asignar un rol al modelo ("Eres un revisor de código senior"). Cambia drásticamente tono, estructura y profundidad de la respuesta.', en: 'Assigning a role to the model ("You are a senior code reviewer"). Dramatically changes tone, structure, and answer depth.' },

    // S
    { term: 'Self-Consistency', block: '02', es: 'Variante de CoT: ejecutar el razonamiento N veces (e.g. 5) con temperature&gt;0 y tomar la respuesta más común. Mejora matemáticas.', en: 'CoT variant: run reasoning N times (e.g. 5) with temperature&gt;0 and take the most common answer. Improves math.' },
    { term: 'SFT (Supervised Fine-Tuning)', block: '07', es: 'Fine-tuning sobre pares (input, ideal output). Primera fase del post-training. Datasets típicos: Alpaca, ShareGPT, OpenOrca.', en: 'Fine-tuning over (input, ideal output) pairs. First post-training phase. Typical datasets: Alpaca, ShareGPT, OpenOrca.' },
    { term: 'Skill (Claude Code)', block: '05', es: 'Archivo SKILL.md que extiende Claude con capacidades reutilizables. Frontmatter YAML define name, description, allowed-tools, context isolation.', en: 'SKILL.md file extending Claude with reusable capabilities. YAML frontmatter defines name, description, allowed-tools, context isolation.' },
    { term: 'Structured Outputs', block: '04', es: 'Forzar al modelo a emitir output que cumpla un schema (JSON Schema, function signature). Garantiza formato exacto.', en: 'Forcing the model to emit output conforming to a schema (JSON Schema, function signature). Guarantees exact format.' },
    { term: 'Sub-agent', block: '05', es: 'Agente lanzado por otro agente con tools y contexto propios. Tipos en Claude Code: Explore (read-only), Plan (read+write doc), general-purpose (todas las tools).', en: 'Agent spawned by another agent with its own tools and context. Types in Claude Code: Explore (read-only), Plan (read+write doc), general-purpose (all tools).' },
    { term: 'SWE-bench', block: '09', es: 'Benchmark de 2294 issues reales de GitHub. Mide coding agents end-to-end. Top 2026: Claude Opus 4.7 a 68.3%.', en: 'Benchmark of 2294 real GitHub issues. Measures end-to-end coding agents. Top 2026: Claude Opus 4.7 at 68.3%.' },
    { term: 'System Prompt', block: '02', es: 'Mensaje con prioridad máxima que define rol, reglas y comportamiento del modelo. En Anthropic es param top-level; en OpenAI/DeepSeek va como primer message con role:"system".', en: 'Top-priority message defining the model\'s role, rules and behavior. Top-level param in Anthropic; first message with role:"system" in OpenAI/DeepSeek.' },

    // T
    { term: 'Temperature', block: '02', es: 'Parámetro que controla la aleatoriedad del sampling. 0.0 = determinista, 0.7 = balance, 1.5+ = muy aleatorio.', en: 'Parameter controlling sampling randomness. 0.0 = deterministic, 0.7 = balanced, 1.5+ = very random.' },
    { term: 'Thinking tokens', block: '03', es: 'Tokens de razonamiento internos generados antes de la respuesta visible. Se facturan. Activables vía thinking={"type":"adaptive"} en Claude o reasoning_effort en OpenAI.', en: 'Internal reasoning tokens generated before the visible answer. Billed. Enabled via thinking={"type":"adaptive"} in Claude or reasoning_effort in OpenAI.' },
    { term: 'Token', block: '01', es: 'Unidad básica de procesamiento de un LLM. Aproximadamente 1 token ≈ 4 caracteres en inglés, 2.5 caracteres en código, 1.5 caracteres en español.', en: 'Basic LLM processing unit. Roughly 1 token ≈ 4 chars in English, 2.5 in code, 1.5 in Spanish.' },
    { term: 'Tokenizer', block: '01', es: 'Algoritmo que divide texto en tokens. BPE byte-level (GPT, Claude, Llama), SentencePiece (Gemma, Qwen), tiktoken (OpenAI).', en: 'Algorithm splitting text into tokens. Byte-level BPE (GPT, Claude, Llama), SentencePiece (Gemma, Qwen), tiktoken (OpenAI).' },
    { term: 'Tool Use', block: '03', es: 'Capacidad del modelo de invocar tools (funciones) con argumentos estructurados. Equivalente a function calling de OpenAI/Google.', en: 'Model\'s ability to invoke tools (functions) with structured arguments. Equivalent to OpenAI/Google function calling.' },
    { term: 'top_k', block: '02', es: 'Sampling que solo considera los k tokens más probables en cada paso. Más burdo que top_p. Algunos APIs (Google, DeepSeek) lo exponen.', en: 'Sampling that only considers the top-k most likely tokens at each step. Cruder than top_p. Some APIs (Google, DeepSeek) expose it.' },
    { term: 'Transformer', block: '01', es: 'Arquitectura de red neuronal basada en atención. Vaswani et al. 2017. Base de TODOS los LLMs modernos.', en: 'Attention-based neural network architecture. Vaswani et al. 2017. Foundation of EVERY modern LLM.' },

    // V
    { term: 'Vector DB', block: '06', es: 'Base de datos optimizada para búsqueda por similitud sobre embeddings. Pinecone, Weaviate, Qdrant, Chroma, pgvector, Milvus, FAISS.', en: 'Database optimized for similarity search over embeddings. Pinecone, Weaviate, Qdrant, Chroma, pgvector, Milvus, FAISS.' },
    { term: 'VLM (Vision-Language Model)', block: '01', es: 'Modelo multimodal que procesa imagen + texto. Claude Vision, GPT-5V, Gemini, Qwen-VL, Pixtral.', en: 'Multimodal model processing image + text. Claude Vision, GPT-5V, Gemini, Qwen-VL, Pixtral.' },

    // X
    { term: 'XML tags', block: '02', es: 'Técnica de estructuración recomendada por Anthropic para Claude: envolver instrucciones, ejemplos y contexto en tags como <instructions>, <examples>, <documents>.', en: 'Anthropic-recommended structuring technique for Claude: wrapping instructions, examples and context in tags like <instructions>, <examples>, <documents>.' },

    // Z
    { term: 'Zero-shot', block: '02', es: 'Pedirle al modelo una tarea sin dar ejemplos. Funciona para tareas simples; few-shot es más fiable para complejas.', en: 'Asking the model for a task with no examples. Works for simple tasks; few-shot is more reliable for complex ones.' }
  ];

  const list = document.getElementById('glossary-list');
  if (!list) return;

  function render(filter) {
    const f = (filter || '').toLowerCase().trim();
    const filtered = TERMS.filter(t =>
      !f ||
      t.term.toLowerCase().includes(f) ||
      t.es.toLowerCase().includes(f) ||
      t.en.toLowerCase().includes(f)
    );

    // Group by first letter
    const groups = {};
    for (const t of filtered) {
      const first = t.term[0].toUpperCase();
      groups[first] = groups[first] || [];
      groups[first].push(t);
    }

    list.innerHTML = Object.keys(groups).sort().map(letter => `
      <div class="glossary-letter">
        <h2 class="glossary-letter-head">${letter}</h2>
        ${groups[letter].map(t => `
          <div class="glossary-term">
            <h4>${t.term} <a class="glossary-block-link" href="${t.block}-${slugForBlock(t.block)}.html">→ Bloque ${t.block}</a></h4>
            <div class="lang-block" data-lang="es">${t.es}</div>
            <div class="lang-block" data-lang="en">${t.en}</div>
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  function slugForBlock(id) {
    const M = window.COURSE_MANIFEST;
    if (!M) return id;
    const b = M.blocks.find(x => x.id === id);
    return b ? b.slug.split('-').slice(1).join('-') : id;
  }

  render('');
  const search = document.getElementById('glossary-filter');
  if (search) search.addEventListener('input', () => render(search.value));
})();
