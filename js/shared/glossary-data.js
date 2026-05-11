/* ============================================================
   Glossary data — single source of truth for both the dedicated
   glossary page AND the in-text auto-link wrapping.

   Schema per entry:
     id        — slug used in #term-<id> anchors
     term      — canonical display name
     aliases   — extra strings (case-insensitive) that should auto-link
     block     — the block where it's first introduced (for "go to block")
     short     — { es, en } one-sentence def (used in tooltip)
     long      — { es, en } 1-3 short paragraphs (used in glossary page)
     example   — { es, en } optional concrete example
     related   — array of other term ids (rendered as "see also")
     diagram   — optional inline SVG (held for v2.3.1)

   v2.3.0 — 2026-05-08
   ============================================================ */

(function () {
  const TERMS = [
    // ============ A ============
    { id: 'agent', term: 'Agent', aliases: ['agent','agente','agentes'], block: '05',
      short: {
        es: 'Sistema que usa un LLM para razonar, decidir acciones, ejecutar herramientas y adaptarse de forma autónoma.',
        en: 'System that uses an LLM to reason, decide actions, execute tools and adapt autonomously.'
      },
      long: {
        es: 'Un agente itera el bucle thought → action → observation hasta completar la tarea. La diferencia con un chatbot es que el agente tiene autonomía sobre QUÉ herramientas usar y EN QUÉ ORDEN, no sigue un guion fijo. La diferencia con un workflow es que el modelo decide la ruta, no el código.',
        en: 'An agent iterates the thought → action → observation loop until the task is complete. The difference vs. a chatbot is autonomy over WHICH tools to use and IN WHAT ORDER, not a fixed script. The difference vs. a workflow is that the model picks the path, not the code.'
      },
      example: {
        es: 'Pides "arregla el bug de login". El agente lee el repo, identifica el archivo, escribe la fix, corre los tests, ajusta si fallan, hace commit. Tú no le dijiste cómo, sólo qué.',
        en: 'You ask "fix the login bug". The agent reads the repo, identifies the file, writes the fix, runs the tests, adjusts on failure, commits. You did not tell it how, only what.'
      },
      related: ['agentic','sub-agent','agent-runtime','tool-use','react','mcp'] },

    { id: 'agentic', term: 'Agentic', aliases: ['agentic'], block: '05',
      short: {
        es: 'Calificativo para sistemas o flujos donde un LLM decide acciones de forma autónoma, no donde el código orquesta paso a paso.',
        en: 'Adjective for systems or flows where an LLM decides actions autonomously, rather than the code orchestrating step by step.'
      },
      long: {
        es: '"Agentic" se usa para distinguir un agente verdadero — que tiene libertad de decisión — de una pipeline que sólo invoca un LLM. Un workflow es determinista; un sistema agentic es no determinista por diseño y necesita guardrails, evals continuos y trazabilidad para no descarrilarse.',
        en: '"Agentic" distinguishes a true agent — with decision freedom — from a pipeline that just calls an LLM. A workflow is deterministic; an agentic system is non-deterministic by design and needs guardrails, continuous evals and tracing to stay on the rails.'
      },
      related: ['agent','agent-runtime','governance','drift'] },

    { id: 'agent-runtime', term: 'Agent runtime', aliases: ['agent runtime','runtime de agente'], block: '05',
      short: {
        es: 'El proceso que mantiene vivo a un agente entre llamadas: contexto, herramientas, memoria, archivos y políticas.',
        en: 'The process that keeps an agent alive across calls: context, tools, memory, files and policies.'
      },
      long: {
        es: 'Claude Code, OpenCode y Codex CLI son agent runtimes. No son sólo "una API que hace múltiples llamadas": gestionan ciclo de vida (sesiones, sub-agentes), permisos por herramienta, estado en disco (CLAUDE.md, AGENTS.md, skills) y reanudación. La diferencia entre tener un agente y tener un script que llama a un LLM en bucle vive en el runtime.',
        en: 'Claude Code, OpenCode and Codex CLI are agent runtimes. They are not just "an API that makes multiple calls": they manage lifecycle (sessions, sub-agents), per-tool permissions, on-disk state (CLAUDE.md, AGENTS.md, skills) and resumption. The line between having an agent and having a script that calls an LLM in a loop lives in the runtime.'
      },
      related: ['agent','sub-agent','skill','mcp','claude-md','agents-md'] },

    { id: 'agi', term: 'AGI (Artificial General Intelligence)', aliases: ['AGI','artificial general intelligence'], block: '01',
      short: {
        es: 'IA con capacidades intelectuales generales iguales o superiores al humano en cualquier tarea.',
        en: 'AI with general intellectual capabilities equal to or beyond humans on any task.'
      },
      long: {
        es: 'En 2026 sigue siendo aspiracional. Los LLMs actuales son ANI (artificial narrow intelligence): superhumanos en algunas tareas, frágiles en otras. El término AGI tiene definición ambigua y se usa más en marketing que en evaluación técnica.',
        en: 'As of 2026 still aspirational. Current LLMs are ANI (artificial narrow intelligence): superhuman in some tasks, brittle in others. The term AGI is ambiguously defined and used more in marketing than in technical evaluation.'
      },
      related: ['llm','frontier-model','benchmark'] },

    { id: 'agents-md', term: 'AGENTS.md', aliases: ['AGENTS.md'], block: '05',
      short: {
        es: 'Archivo de memoria de proyecto leído por OpenCode (equivalente al CLAUDE.md de Claude Code).',
        en: 'Project memory file read by OpenCode (equivalent of Claude Code\'s CLAUDE.md).'
      },
      long: {
        es: 'Define reglas, convenciones y memoria persistente del agente. OpenCode lo carga al inicio de cada sesión y su contenido se inyecta en el system prompt. Mismo concepto que CLAUDE.md, distinta convención de archivo.',
        en: 'Defines rules, conventions and persistent agent memory. OpenCode loads it at the start of every session and injects its content into the system prompt. Same concept as CLAUDE.md, different file convention.'
      },
      related: ['claude-md','agent-runtime','governance'] },

    { id: 'alignment', term: 'Alignment', aliases: ['alignment','alineación','alineamiento'], block: '07',
      short: {
        es: 'Conjunto de técnicas de post-training que hacen que el modelo siga instrucciones, sea útil y rechace daños.',
        en: 'Post-training techniques that make the model follow instructions, be useful and refuse harm.'
      },
      long: {
        es: 'Convierte un base model (predice texto) en un asistente conversacional. Las técnicas principales son SFT, RLHF, DPO y Constitutional AI. Sin alignment, GPT-base-ish responde a "¿cómo arreglo este código?" continuando con más preguntas en lugar de respondiendo.',
        en: 'Turns a base model (predicts text) into a conversational assistant. Main techniques are SFT, RLHF, DPO and Constitutional AI. Without alignment, GPT-base-ish replies to "how do I fix this code?" by writing more questions instead of an answer.'
      },
      related: ['sft','rlhf','dpo','constitutional-ai','post-training','base-model'] },

    { id: 'asl', term: 'ASL (Anthropic Safety Levels)', aliases: ['ASL','AHL','Anthropic Safety Levels'], block: '10',
      short: {
        es: 'Niveles ASL-1 a ASL-4+ definidos por Anthropic según el riesgo CBRN/cyber del modelo.',
        en: 'ASL-1 to ASL-4+ levels defined by Anthropic by the model\'s CBRN/cyber risk.'
      },
      long: {
        es: 'Cada nivel implica requisitos crecientes de seguridad antes del despliegue: ASL-1 sin restricciones, ASL-2 con mitigación adicional, ASL-3+ restringe o prohíbe el deployment público. Es el equivalente Anthropic de un policy gate por capacidad.',
        en: 'Each level implies escalating security requirements before deployment: ASL-1 unrestricted, ASL-2 with additional mitigation, ASL-3+ restricts or bans public deployment. Anthropic\'s equivalent of a capability-based policy gate.'
      },
      related: ['safety','constitutional-ai','red-teaming'] },

    { id: 'artifacts', term: 'Artifacts', aliases: ['artifact','artifacts','artefacto','artefactos'], block: '05',
      short: {
        es: 'Archivos versionados que un agente lee, produce o consulta — el "estado en disco" del proyecto.',
        en: 'Versioned files an agent reads, produces or consults — the project\'s "on-disk state".'
      },
      long: {
        es: 'En la jerga de DMF y de la mayoría de runtimes, un artifact es cualquier archivo autoritativo del proyecto: CLAUDE.md, AGENTS.md, skills, ADRs, manifests JSON, READMEs. El concepto contrasta con la conversación efímera: lo que vive en archivos sobrevive entre sesiones, lo que vive sólo en el chat se pierde. La buena gobernanza pone las reglas en artifacts, no en mensajes.',
        en: 'In DMF and most runtime lingo, an artifact is any authoritative project file: CLAUDE.md, AGENTS.md, skills, ADRs, JSON manifests, READMEs. The concept contrasts with ephemeral conversation: what lives in files survives across sessions, what lives only in chat is lost. Good governance puts rules in artifacts, not messages.'
      },
      related: ['governance','authority-in-files','claude-md','agents-md','drift'] },

    { id: 'attention', term: 'Attention', aliases: ['attention','atención','atencion'], block: '01',
      short: {
        es: 'Mecanismo central del transformer: cada token calcula a qué otros tokens del contexto debe "atender".',
        en: 'Core transformer mechanism: each token computes which other context tokens it should "attend" to.'
      },
      long: {
        es: 'La atención permite al modelo enlazar palabras separadas en el contexto y construir una representación dependiente del contexto. Es lo que hace posible el contexto largo y el razonamiento. Su coste es O(n²) en la longitud, por eso aparecen variantes optimizadas (Flash Attention, GQA, MQA, MLA).',
        en: 'Attention lets the model link distant words in context and build context-dependent representations. It enables long context and reasoning. Cost is O(n²) in length, hence optimized variants (Flash Attention, GQA, MQA, MLA).'
      },
      related: ['transformer','autoregressive','context-window','kv-cache','flash-attention'] },

    { id: 'authority-in-files', term: 'Authority-in-files', aliases: ['authority-in-files','authority in files'], block: '05',
      short: {
        es: 'Principio de gobernanza: las reglas autoritativas viven en archivos versionados, no en la conversación.',
        en: 'Governance principle: authoritative rules live in versioned files, not in conversation.'
      },
      long: {
        es: 'Es el primero de los cuatro invariantes de DMF. La idea: la conversación con el agente no es vinculante; sólo lo escrito en un artifact (CLAUDE.md, AGENTS.md, ADR…) cuenta como decisión. Evita drift entre sesiones y desambigua quién manda cuando un humano y un agente discrepan.',
        en: 'First of DMF\'s four invariants. The idea: agent conversation is not binding; only what is written in an artifact (CLAUDE.md, AGENTS.md, ADR…) counts as a decision. Prevents cross-session drift and disambiguates who rules when a human and an agent disagree.'
      },
      related: ['artifacts','governance','drift','agents-md','claude-md'] },

    { id: 'autoregressive', term: 'Autoregressive', aliases: ['autoregressive','autorregresivo'], block: '01',
      short: {
        es: 'Generación token-por-token donde cada token se produce condicionado a todos los anteriores.',
        en: 'Token-by-token generation where each token is produced conditioned on all previous ones.'
      },
      long: {
        es: 'Todos los LLMs actuales son autoregressive. Por eso el orden de las instrucciones importa, por eso el output largo es lento (proporcional al número de tokens), y por eso la KV cache es crítica para latencia.',
        en: 'All current LLMs are autoregressive. That\'s why instruction order matters, why long outputs are slow (proportional to token count), and why KV cache is critical for latency.'
      },
      related: ['transformer','token','kv-cache','speculative-decoding'] },

    { id: 'awq', term: 'AWQ (Activation-aware Weight Quantization)', aliases: ['AWQ','activation-aware weight quantization'], block: '07',
      short: {
        es: 'Método de cuantización a 4 bits que protege el ~1% de canales más salientes.',
        en: '4-bit quantization method that protects the ~1% most salient channels.'
      },
      long: {
        es: 'Mejor calidad que GPTQ a igual tamaño porque calibra qué canales son sensibles a redondeo y los preserva con más precisión. Estándar 2025+ para servir LLMs en GPU consumer.',
        en: 'Better quality than GPTQ at the same size because it calibrates which channels are sensitive to rounding and preserves them at higher precision. 2025+ standard for serving LLMs on consumer GPUs.'
      },
      related: ['quantization','gptq','gguf','qlora'] },

    // ============ B ============
    { id: 'base-model', term: 'Base model', aliases: ['base model','modelo base'], block: '01',
      short: {
        es: 'Modelo recién salido del pre-training, sin alignment. Predice el siguiente token, no sigue instrucciones.',
        en: 'Model fresh from pre-training, no alignment. Predicts next token, does not follow instructions.'
      },
      long: {
        es: 'Si le dices "¿qué es Madrid?" responderá con texto plausible (quizá una entrada estilo Wikipedia, quizá una continuación rara), no con una explicación dirigida a ti. Convertir un base model en un instruct/chat model requiere post-training (SFT + RLHF/DPO).',
        en: 'Asked "what is Madrid?" it replies with plausible text (a Wikipedia-style entry, or a weird continuation), not a targeted explanation for you. Turning a base model into an instruct/chat model requires post-training (SFT + RLHF/DPO).'
      },
      related: ['pre-training','post-training','alignment','sft','rlhf'] },

    { id: 'benchmark', term: 'Benchmark', aliases: ['benchmark','benchmarks'], block: '09',
      short: {
        es: 'Conjunto estandarizado de tareas para medir capacidad de un modelo.',
        en: 'Standardized task set to measure a model\'s capability.'
      },
      long: {
        es: 'Los principales en 2026: MMLU (conocimiento académico), HumanEval (coding), GPQA (razonamiento experto), SWE-bench (agentes de código), ARC-AGI (abstracción). Casi todos los frontier saturan los clásicos, así que aparecen nuevos cada año. Un score alto es necesario pero no suficiente: la calidad real se mide con evals propios.',
        en: 'Main ones in 2026: MMLU (academic knowledge), HumanEval (coding), GPQA (expert reasoning), SWE-bench (coding agents), ARC-AGI (abstraction). Most frontiers saturate the classics, so new ones appear yearly. A high score is necessary but not sufficient: real quality is measured with your own evals.'
      },
      related: ['mmlu','humaneval','swe-bench','gpqa','eval'] },

    { id: 'bpe', term: 'BPE (Byte Pair Encoding)', aliases: ['BPE','byte pair encoding'], block: '01',
      short: {
        es: 'Algoritmo de tokenización que fusiona pares frecuentes de caracteres/bytes.',
        en: 'Tokenization algorithm that merges frequent pairs of characters/bytes.'
      },
      long: {
        es: 'La variante "byte-level BPE" la usan GPT, Claude y Llama. SentencePiece (variante alternativa) la usan Gemma y Qwen. La elección del tokenizer afecta el coste por idioma: el español rinde ~1.5 caracteres/token, el inglés ~4, lo que explica por qué pagar tokens en castellano cuesta más por mismo texto.',
        en: '"Byte-level BPE" is used by GPT, Claude and Llama. SentencePiece (alternative) is used by Gemma and Qwen. Tokenizer choice affects per-language cost: Spanish runs ~1.5 chars/token, English ~4, which explains why paying tokens in Spanish costs more for the same text.'
      },
      related: ['tokenizer','token'] },

    // ============ C ============
    { id: 'cot', term: 'Chain of Thought (CoT)', aliases: ['CoT','Chain of Thought','chain-of-thought','cadena de pensamiento'], block: '02',
      short: {
        es: 'Técnica que pide al modelo razonar paso a paso antes de dar la respuesta final.',
        en: 'Technique asking the model to reason step by step before giving the final answer.'
      },
      long: {
        es: 'Mejora drásticamente matemáticas, lógica y tareas multi-paso. En modelos modernos con thinking nativo (Claude extended thinking, o-series) suele ser redundante o contraproducente: estás pisando el razonamiento interno del modelo. CoT explícito sigue siendo útil en modelos pequeños y open-weights.',
        en: 'Dramatically improves math, logic and multi-step tasks. In modern models with native thinking (Claude extended thinking, o-series) it tends to be redundant or counterproductive: you\'re stepping on the model\'s internal reasoning. Explicit CoT remains useful on small models and open-weights.'
      },
      example: {
        es: '`Resuelve este problema paso a paso, mostrando cada cálculo, y al final escribe la respuesta entre <answer> tags.`',
        en: '`Solve this problem step by step, showing each calculation, and at the end write the answer between <answer> tags.`'
      },
      related: ['self-consistency','thinking-tokens','reasoning-effort','few-shot'] },

    { id: 'chunking', term: 'Chunking', aliases: ['chunk','chunks','chunking','trozo','trozos'], block: '06',
      short: {
        es: 'Dividir un documento largo en fragmentos para indexarlos y recuperarlos en RAG.',
        en: 'Splitting a long document into fragments for indexing and retrieval in RAG.'
      },
      long: {
        es: 'El sweet spot 2026 para QA factual son 256-512 tokens por chunk con un overlap del 10-20%. Demasiado pequeño rompe contexto, demasiado grande mete ruido. Las estrategias avanzadas usan chunks semánticos (cortes en límites naturales) o jerárquicos (chunk pequeño para precisión + chunk grande para contexto).',
        en: 'The 2026 sweet spot for factual QA is 256-512 tokens per chunk with 10-20% overlap. Too small breaks context, too large adds noise. Advanced strategies use semantic chunks (cuts on natural boundaries) or hierarchical (small chunk for precision + large chunk for context).'
      },
      related: ['rag','embedding','vector-db','overlap'] },

    { id: 'claude-md', term: 'CLAUDE.md', aliases: ['CLAUDE.md'], block: '05',
      short: {
        es: 'Archivo de memoria leído nativamente por Claude Code. Define reglas, convenciones y memoria persistente.',
        en: 'Memory file natively read by Claude Code. Defines project rules, conventions and persistent memory.'
      },
      long: {
        es: 'Vive en la raíz del proyecto o en `.claude/CLAUDE.md`. Su contenido se carga al inicio de cada sesión y guía cómo el agente trabaja en ESE proyecto: comandos preferidos, paths, restricciones, contexto del dominio. Es el primer artifact que escribir cuando empiezas a usar Claude Code en serio.',
        en: 'Lives at the project root or `.claude/CLAUDE.md`. Its contents load at the start of every session and guide how the agent works in THIS project: preferred commands, paths, restrictions, domain context. It\'s the first artifact to write when you start using Claude Code in earnest.'
      },
      related: ['agents-md','agent-runtime','artifacts','authority-in-files'] },

    { id: 'constitutional-ai', term: 'Constitutional AI', aliases: ['Constitutional AI','CAI','constitutional ai'], block: '10',
      short: {
        es: 'Método de Anthropic donde el modelo se auto-critica siguiendo una "constitución" de principios éticos.',
        en: 'Anthropic method where the model self-critiques following a "constitution" of ethical principles.'
      },
      long: {
        es: 'Sustituye parte del feedback humano por feedback del propio modelo guiado por reglas escritas. Más escalable que RLHF puro porque no necesita anotadores humanos para cada caso. La constitución de Anthropic es pública y mezcla principios universales (UN HRD) con políticas operativas.',
        en: 'Replaces part of human feedback with model-generated feedback guided by written rules. More scalable than pure RLHF because no human annotator is needed for each case. Anthropic\'s constitution is public and mixes universal principles (UN HRD) with operational policy.'
      },
      related: ['rlhf','dpo','alignment','asl','safety'] },

    { id: 'context-window', term: 'Context window', aliases: ['context window','context length','ventana de contexto','contexto'], block: '01',
      short: {
        es: 'Tokens máximos que un modelo puede procesar en una sola llamada.',
        en: 'Maximum tokens a model can process in a single call.'
      },
      long: {
        es: 'En 2026: 200K (Claude), 256K (GPT-5), 1M+ (Gemini), 2M (Kimi K2). Tener ventana grande no garantiza que el modelo USE bien todo: el "needle in a haystack" mide si encuentra info enterrada. Coste: la atención es O(n²), llenar 1M de tokens cuesta caro y tarda.',
        en: 'In 2026: 200K (Claude), 256K (GPT-5), 1M+ (Gemini), 2M (Kimi K2). Having a big window does not guarantee the model USES it well: "needle in a haystack" measures whether it finds buried info. Cost: attention is O(n²), filling 1M tokens is expensive and slow.'
      },
      related: ['attention','token','kv-cache','prompt-caching'] },

    { id: 'context-engineering', term: 'Context engineering', aliases: ['context engineering','ingeniería de contexto'], block: '02',
      short: {
        es: 'Disciplina de diseñar QUÉ va en el contexto del modelo, en qué orden y con qué estructura.',
        en: 'Discipline of designing WHAT goes into the model\'s context, in what order and with what structure.'
      },
      long: {
        es: 'Una superset del prompt engineering: incluye selección de ejemplos few-shot, recuperación RAG, ordering de mensajes, memoria, herramientas expuestas, y system prompt. En agentes y RAG, "lo que pones" suele importar más que "cómo lo pides".',
        en: 'A superset of prompt engineering: covers few-shot example selection, RAG retrieval, message ordering, memory, exposed tools and system prompt. In agents and RAG, "what you put in" often matters more than "how you ask".'
      },
      related: ['prompt-engineering','rag','system-prompt','scaffolding'] },

    // ============ D ============
    { id: 'distillation', term: 'Distillation', aliases: ['distillation','knowledge distillation','destilación'], block: '07',
      short: {
        es: 'Entrenar un modelo pequeño (student) para imitar el comportamiento de un modelo grande (teacher).',
        en: 'Training a small model (student) to imitate the behavior of a large one (teacher).'
      },
      long: {
        es: 'Permite servir un modelo barato y rápido manteniendo gran parte de la calidad. Phi-3, Gemma 3 y muchas variantes "mini" son resultado de distillation. Limitación: el student no excede al teacher, así que la calidad máxima está acotada.',
        en: 'Lets you serve a cheap, fast model while keeping much of the quality. Phi-3, Gemma 3 and many "mini" variants are distillation results. Limitation: the student cannot exceed the teacher, so max quality is capped.'
      },
      related: ['fine-tuning','sft','quantization'] },

    { id: 'dpo', term: 'DPO (Direct Preference Optimization)', aliases: ['DPO','direct preference optimization'], block: '07',
      short: {
        es: 'Alternativa a RLHF que optimiza directamente sobre pares preferido/rechazado, sin reward model separado.',
        en: 'RLHF alternative that optimizes directly on preferred/rejected pairs, no separate reward model.'
      },
      long: {
        es: 'Más simple y estable que RLHF/PPO. Usado por Llama 3/4, Mistral y muchos open-weights. La calidad es comparable y el coste de entrenamiento mucho menor, por eso ha desplazado al RLHF clásico en gran parte del open-source.',
        en: 'Simpler and more stable than RLHF/PPO. Used by Llama 3/4, Mistral and many open-weights. Quality is comparable and training cost much lower, so it has displaced classic RLHF across much of open-source.'
      },
      related: ['rlhf','sft','alignment','post-training'] },

    { id: 'drift', term: 'Drift', aliases: ['drift','deriva'], block: '05',
      short: {
        es: 'Desviación gradual del comportamiento o las decisiones de un agente respecto a las reglas originales.',
        en: 'Gradual divergence of an agent\'s behavior or decisions from the original rules.'
      },
      long: {
        es: 'Aparece de dos formas. **Drift de modelo**: el proveedor actualiza los pesos y los outputs cambian sin avisar (Claude 4.7 → 4.8). **Drift de sesión**: en un agente largo, las decisiones de la conversación contradicen las reglas escritas y el agente "olvida" o reinterpreta. La defensa: pinear versiones de modelo + governance basada en archivos (DMF).',
        en: 'Appears in two flavors. **Model drift**: the provider updates weights and outputs change without notice (Claude 4.7 → 4.8). **Session drift**: in a long agent, conversation decisions contradict the written rules and the agent "forgets" or reinterprets. Defense: pin model versions + file-based governance (DMF).'
      },
      related: ['governance','authority-in-files','agent-runtime','frontier-model'] },

    // ============ E ============
    { id: 'effort-levels', term: 'Effort levels', aliases: ['effort','effort levels','effort_level','reasoning_effort'], block: '03',
      short: {
        es: 'Parámetro que controla cuánto razona el modelo antes de responder.',
        en: 'Parameter controlling how much the model reasons before answering.'
      },
      long: {
        es: 'En Claude Opus 4.7: low / medium / high / xhigh / max. En OpenAI o-series y GPT-5: minimal / low / medium / high. Más effort → más thinking tokens → mejor calidad en problemas complejos pero más coste y latencia. Para tareas simples (clasificación, extracción) usa low; para razonamiento profundo (matemáticas, debugging difícil) usa high.',
        en: 'In Claude Opus 4.7: low / medium / high / xhigh / max. In OpenAI o-series and GPT-5: minimal / low / medium / high. More effort → more thinking tokens → better quality on hard problems but more cost and latency. For simple tasks (classification, extraction) use low; for deep reasoning (math, hard debugging) use high.'
      },
      related: ['thinking-tokens','reasoning-effort','adaptive-thinking'] },

    { id: 'embedding', term: 'Embedding', aliases: ['embedding','embeddings','vector','vectores'], block: '06',
      short: {
        es: 'Vector denso (e.g. 1024 dimensiones) que representa el significado semántico de un texto.',
        en: 'Dense vector (e.g. 1024 dimensions) representing the semantic meaning of a text.'
      },
      long: {
        es: 'Es la base de RAG y de la búsqueda semántica: textos parecidos en significado producen vectores cercanos por coseno o producto escalar. Modelos típicos en 2026: text-embedding-4 (OpenAI), Voyage 3, Cohere Embed v4, NV-Embed-v2. La dimensión típica va de 768 a 4096.',
        en: 'Foundation of RAG and semantic search: similar texts produce vectors close in cosine or dot product. Typical 2026 models: text-embedding-4 (OpenAI), Voyage 3, Cohere Embed v4, NV-Embed-v2. Typical dimension ranges from 768 to 4096.'
      },
      related: ['rag','vector-db','chunking'] },

    { id: 'eval', term: 'Eval', aliases: ['eval','evals','evaluación','evaluacion','evaluation'], block: '04',
      short: {
        es: 'Evaluación automatizada que mide objetivamente la calidad de un prompt o modelo sobre un dataset de prueba.',
        en: 'Automated evaluation that objectively measures the quality of a prompt or model on a test dataset.'
      },
      long: {
        es: 'Anthropic insiste: construye evals ANTES de iterar prompts. Sin evals, "el prompt mejoró" es opinión; con evals, es número. Tipos: exact match, regex, LLM-as-judge, métricas semánticas (BLEU/ROUGE), evaluación humana. 20-50 casos de prueba bastan para empezar.',
        en: 'Anthropic insists: build evals BEFORE iterating prompts. Without evals, "the prompt improved" is opinion; with evals, it\'s a number. Types: exact match, regex, LLM-as-judge, semantic metrics (BLEU/ROUGE), human evaluation. 20-50 test cases are enough to start.'
      },
      related: ['benchmark','grounding'] },

    // ============ F ============
    { id: 'few-shot', term: 'Few-shot', aliases: ['few-shot','few shot','pocos ejemplos'], block: '02',
      short: {
        es: 'Técnica que da al modelo 3-5 ejemplos input→output para que aprenda el patrón en contexto.',
        en: 'Technique giving the model 3-5 input→output examples so it learns the pattern in context.'
      },
      long: {
        es: 'El sweet spot según Anthropic son 3-5 ejemplos diversos y relevantes. Más de 5 puede causar sobre-ajuste (el modelo copia un ejemplo en lugar de aprender el patrón). Menos de 3 puede no establecer el patrón. Para tareas simples, zero-shot basta; para formato consistente o tareas específicas, few-shot rinde mucho mejor.',
        en: 'Anthropic\'s sweet spot is 3-5 diverse, relevant examples. More than 5 can over-fit (the model copies an example instead of learning the pattern). Fewer than 3 may not establish the pattern. For simple tasks, zero-shot is enough; for consistent format or specific tasks, few-shot pays off significantly.'
      },
      related: ['zero-shot','in-context-learning','cot','role-prompting'] },

    { id: 'fine-tuning', term: 'Fine-tuning', aliases: ['fine-tuning','fine tuning','finetune','finetuning'], block: '07',
      short: {
        es: 'Re-entrenar un modelo base sobre un dataset específico para internalizar comportamiento.',
        en: 'Re-training a base model on a specific dataset to internalize behavior.'
      },
      long: {
        es: 'Variantes: SFT, LoRA, QLoRA, DPO. NO añade conocimiento factual nuevo (eso es RAG); sí internaliza estilo, formato, tono o pequeñas reglas específicas. Anthropic recomienda fine-tunear sólo cuando hayas agotado prompt engineering — es caro, rígido y lento de iterar.',
        en: 'Variants: SFT, LoRA, QLoRA, DPO. Does NOT add new factual knowledge (that\'s RAG); it does internalize style, format, tone or small specific rules. Anthropic recommends fine-tuning only after you\'ve exhausted prompt engineering — it\'s expensive, rigid and slow to iterate.'
      },
      related: ['sft','lora','qlora','dpo','post-training','rag'] },

    { id: 'flash-attention', term: 'Flash Attention', aliases: ['flash attention','FlashAttention'], block: '06',
      short: {
        es: 'Implementación de la atención optimizada para minimizar accesos a HBM. ~2-4× speedup sin pérdida de calidad.',
        en: 'Attention implementation optimized to minimize HBM accesses. ~2-4× speedup with no quality loss.'
      },
      long: {
        es: 'Reordena los cálculos de atención para que la GPU mantenga datos en SRAM (rápida) en lugar de ir y venir de HBM (lenta). Es matemáticamente idéntico al softmax atención clásico, sólo más rápido. Versión 3 (Hopper+) es estándar en vLLM, SGLang, TGI, llama.cpp moderna.',
        en: 'Reorders attention computation so the GPU keeps data in SRAM (fast) instead of round-tripping to HBM (slow). Mathematically identical to classic softmax attention, just faster. Version 3 (Hopper+) is standard in vLLM, SGLang, TGI, modern llama.cpp.'
      },
      related: ['attention','kv-cache','quantization'] },

    { id: 'frontier-model', term: 'Frontier model', aliases: ['frontier model','frontier','modelo frontera'], block: '01',
      short: {
        es: 'Modelo top del estado del arte, con la capacidad y coste más altos de su generación.',
        en: 'Top state-of-the-art model, the highest capability and cost of its generation.'
      },
      long: {
        es: 'En 2026: Claude Opus 4.7, GPT-5.5, Gemini 2.5 Pro, DeepSeek V4 Pro, Grok 4. Tarifa típica de output ~$15-30 por millón de tokens. Si tu caso no necesita los últimos 5pp de calidad, baja a un Sonnet/Haiku/Mini equivalente y ahorra 10×.',
        en: 'In 2026: Claude Opus 4.7, GPT-5.5, Gemini 2.5 Pro, DeepSeek V4 Pro, Grok 4. Typical output rate ~$15-30 per million tokens. If your case does not need the last 5pp of quality, drop to a Sonnet/Haiku/Mini equivalent and save 10×.'
      },
      related: ['llm','benchmark','quantization','open-source-model'] },

    { id: 'function-calling', term: 'Function calling', aliases: ['function calling','function_calling','llamada a funciones'], block: '03',
      short: {
        es: 'Capacidad del modelo de invocar herramientas externas (funciones) con argumentos estructurados.',
        en: 'Model\'s ability to invoke external tools (functions) with structured arguments.'
      },
      long: {
        es: 'Llamado "tool use" en Anthropic, "function calling" en OpenAI/Google, "tools" en casi todos los demás. Funcionalmente lo mismo: el modelo emite JSON con nombre de función + argumentos validados contra schema; tu código ejecuta y devuelve el resultado para la siguiente vuelta.',
        en: 'Called "tool use" by Anthropic, "function calling" by OpenAI/Google, "tools" by almost everyone else. Functionally the same: the model emits JSON with function name + arguments validated against schema; your code runs it and returns the result for the next turn.'
      },
      related: ['tool-use','structured-outputs','json-schema','react'] },

    // ============ G ============
    { id: 'gguf', term: 'GGUF', aliases: ['GGUF','gguf'], block: '07',
      short: {
        es: 'Formato de archivo de llama.cpp que empaqueta pesos + metadata + tokenizador en un solo archivo.',
        en: 'llama.cpp file format that bundles weights + metadata + tokenizer into a single file.'
      },
      long: {
        es: 'Soporta cuantización mixta por capa (K-quants: Q2_K, Q3_K, Q4_K_M, Q5_K_M, Q6_K, Q8_0…). Standard de facto para modelos cuantizados destinados a CPU/Metal/Vulkan/CUDA. Compatible con Ollama, LM Studio, llama.cpp, koboldcpp.',
        en: 'Supports mixed per-layer quantization (K-quants: Q2_K, Q3_K, Q4_K_M, Q5_K_M, Q6_K, Q8_0…). De facto standard for quantized models targeting CPU/Metal/Vulkan/CUDA. Compatible with Ollama, LM Studio, llama.cpp, koboldcpp.'
      },
      related: ['quantization','gptq','awq'] },

    { id: 'gptq', term: 'GPTQ', aliases: ['GPTQ','gptq'], block: '07',
      short: {
        es: 'Método de cuantización a 4 u 8 bits post-training. Necesita dataset de calibración (~128 samples).',
        en: '4 or 8-bit post-training quantization method. Needs calibration dataset (~128 samples).'
      },
      long: {
        es: 'Optimizado para GPU. Más antiguo que AWQ y peor calidad a igual tamaño, pero sigue siendo común en checkpoints publicados antes de 2025. Prefiere AWQ para nuevos despliegues.',
        en: 'GPU-optimized. Older than AWQ and worse quality at the same size, but still common in checkpoints published before 2025. Prefer AWQ for new deployments.'
      },
      related: ['awq','quantization','gguf'] },

    { id: 'governance', term: 'Governance', aliases: ['governance','gobernanza'], block: '05',
      short: {
        es: 'Conjunto de reglas, roles y artifacts que rigen lo que un agente puede y no puede hacer.',
        en: 'Set of rules, roles and artifacts that govern what an agent may and may not do.'
      },
      long: {
        es: 'Mientras el prompt engineering optimiza UNA llamada, la governance optimiza la trayectoria de un agente a lo largo de semanas o meses. Cubre: autoridad (quién manda), trazabilidad (qué decisión vino de dónde), límites (qué no puede modificar), y reanudación (cómo retomar tras interrupción). DMF (Drift Management Framework) es un ejemplo de governance basada en archivos.',
        en: 'While prompt engineering optimizes ONE call, governance optimizes an agent\'s trajectory over weeks or months. Covers: authority (who rules), traceability (which decision came from where), limits (what can\'t be modified), and resumption (how to resume after interruption). DMF (Drift Management Framework) is an example of file-based governance.'
      },
      related: ['authority-in-files','artifacts','drift','agent-runtime'] },

    { id: 'gpqa', term: 'GPQA', aliases: ['GPQA'], block: '09',
      short: {
        es: 'Benchmark de preguntas de física, química y biología nivel postgrado, "Google-proof".',
        en: 'Graduate-level physics, chemistry and biology benchmark, "Google-proof".'
      },
      long: {
        es: 'Diseñado para que buscar en internet no resuelva la pregunta — fuerza al modelo a entender, no recordar. Frontier 2026 saca ~85-90%, expertos humanos del dominio ~65%. Se usa para detectar saturación de razonamiento "real".',
        en: 'Designed so that internet search does not solve the question — forces the model to understand, not recall. 2026 frontier scores ~85-90%, human domain experts ~65%. Used to detect saturation of "real" reasoning.'
      },
      related: ['benchmark','mmlu','humaneval'] },

    { id: 'greedy-decoding', term: 'Greedy decoding', aliases: ['greedy','greedy decoding','decodificación voraz'], block: '02',
      short: {
        es: 'Sampling determinista (temperature=0) que elige siempre el token más probable.',
        en: 'Deterministic sampling (temperature=0) that always picks the most likely token.'
      },
      long: {
        es: 'Reproducible pero a veces repetitivo o "robótico". Útil para extracción de datos, clasificación, casos donde quieres que dos llamadas idénticas den output idéntico. Para creatividad, conviene temperature 0.5-1.0.',
        en: 'Reproducible but sometimes repetitive or "robotic". Useful for data extraction, classification, cases where you want two identical calls to give identical output. For creativity, prefer temperature 0.5-1.0.'
      },
      related: ['temperature','top-p','sampling'] },

    { id: 'grounding', term: 'Grounding', aliases: ['grounding','citation','citación','fundamentación'], block: '04',
      short: {
        es: 'Hacer que la respuesta del modelo apoye cada afirmación en una fuente recuperable y verificable.',
        en: 'Making the model\'s answer ground each claim in a retrievable, verifiable source.'
      },
      long: {
        es: 'Es la defensa práctica número uno contra hallucinations en sistemas RAG. Implica: pedir citas explícitas en el prompt, validar que la cita realmente respalda la afirmación, exponer las fuentes al usuario. "Buena cita" no es "cualquier cita": el snippet debe contener literalmente lo afirmado.',
        en: 'The practical number-one defense against hallucinations in RAG systems. Involves: asking for explicit citations in the prompt, validating that the citation actually supports the claim, exposing sources to the user. "Good citation" is not "any citation": the snippet must literally contain what is claimed.'
      },
      related: ['rag','hallucination','eval'] },

    // ============ H ============
    { id: 'hallucination', term: 'Hallucination', aliases: ['hallucination','hallucinations','alucinación','alucinaciones','hallucinate'], block: '10',
      short: {
        es: 'Cuando el modelo genera información factualmente incorrecta con tono confiado.',
        en: 'When the model generates factually incorrect information with confident tone.'
      },
      long: {
        es: 'Tipos: factual (dato falso), atribución falsa (cita inventada), invención (API inexistente), overconfidence (aserción dudosa como cierta). Defensa #1: RAG con grounding y citas verificables. Decirle "no alucines" en el prompt rara vez funciona — el modelo no sabe cuándo está alucinando.',
        en: 'Types: factual (false fact), false attribution (invented citation), invention (nonexistent API), overconfidence (doubtful assertion stated as certain). Defense #1: RAG with grounding and verifiable citations. Telling it "do not hallucinate" in the prompt rarely works — the model does not know when it\'s hallucinating.'
      },
      related: ['rag','grounding','eval'] },

    { id: 'humaneval', term: 'HumanEval', aliases: ['HumanEval','humaneval'], block: '09',
      short: {
        es: 'Benchmark de 164 problemas de programación Python. Métrica pass@k.',
        en: 'Benchmark of 164 Python programming problems. Metric pass@k.'
      },
      long: {
        es: 'Saturado >95% en frontier 2026, así que dejó de discriminar entre top models. Para coding actual se usa SWE-bench (issues reales de GitHub) o LiveCodeBench (problemas frescos contra contaminación de training).',
        en: 'Saturated >95% in 2026 frontier, so it no longer discriminates between top models. For current coding eval use SWE-bench (real GitHub issues) or LiveCodeBench (fresh problems against training contamination).'
      },
      related: ['benchmark','swe-bench','mmlu','gpqa'] },

    // ============ I ============
    { id: 'in-context-learning', term: 'In-context learning', aliases: ['in-context learning','ICL','aprendizaje en contexto'], block: '02',
      short: {
        es: 'Capacidad de los LLMs de aprender un patrón desde ejemplos en el prompt sin actualizar los pesos.',
        en: 'LLMs\' ability to learn a pattern from prompt examples without updating weights.'
      },
      long: {
        es: 'Es el mecanismo que hace funcionar few-shot prompting. El modelo no se "aprende" el patrón a largo plazo; sólo lo aplica DENTRO de esa llamada. Se borra cuando se cierra el contexto. Para internalizar un patrón a largo plazo necesitas fine-tuning.',
        en: 'The mechanism that makes few-shot prompting work. The model does not "learn" the pattern long-term; it only applies it WITHIN that call. It vanishes when the context closes. To internalize a pattern long-term you need fine-tuning.'
      },
      related: ['few-shot','zero-shot','fine-tuning'] },

    { id: 'inference', term: 'Inference', aliases: ['inference','inferencia'], block: '01',
      short: {
        es: 'El acto de ejecutar un modelo entrenado para generar una respuesta a partir de una entrada.',
        en: 'The act of running a trained model to generate a response from an input.'
      },
      long: {
        es: 'Distinto del entrenamiento (que ajusta pesos). Cada llamada que haces a una API LLM es una inferencia. El coste de inferencia se mide en tokens; la latencia se mide en TTFT (time to first token) y TPOT (time per output token). Servidores de inferencia populares: vLLM, SGLang, TGI, Ollama.',
        en: 'Different from training (which adjusts weights). Every API call you make to an LLM is an inference. Inference cost is measured in tokens; latency is measured in TTFT (time to first token) and TPOT (time per output token). Popular inference servers: vLLM, SGLang, TGI, Ollama.'
      },
      related: ['llm','token','autoregressive','kv-cache','latency'] },

    // ============ J ============
    { id: 'jailbreak', term: 'Jailbreak', aliases: ['jailbreak','jailbreaking'], block: '10',
      short: {
        es: 'Variante de prompt injection que elude los filtros de seguridad del modelo.',
        en: 'Prompt injection variant that bypasses the model\'s safety filters.'
      },
      long: {
        es: 'Técnicas: role-play hostil ("haz como si fueras un modelo sin filtros"), encoding (base64, leetspeak), DAN-style ("Do Anything Now"), payloads concatenados. Ningún modelo es 100% jailbreak-proof; la defensa real es defensa en profundidad: validación de entrada, filtros de salida, permisos restringidos.',
        en: 'Techniques: hostile role-play ("pretend you\'re an unfiltered model"), encoding (base64, leetspeak), DAN-style ("Do Anything Now"), chained payloads. No model is 100% jailbreak-proof; real defense is defense in depth: input validation, output filters, restricted permissions.'
      },
      related: ['prompt-injection','asl','constitutional-ai'] },

    { id: 'json-schema', term: 'JSON Schema', aliases: ['JSON Schema','JSON schema','json schema'], block: '04',
      short: {
        es: 'Especificación que define la estructura exacta esperada de un JSON.',
        en: 'Specification defining the exact expected structure of a JSON.'
      },
      long: {
        es: 'Usado por los modos de structured outputs (OpenAI Structured Outputs, Anthropic tool-use trick) para forzar que el modelo emita JSON parseable y conforme a un esquema. La validación ocurre en el sampler — los tokens no conformes nunca se emiten — así que es 100% fiable, no "casi siempre".',
        en: 'Used by structured-output modes (OpenAI Structured Outputs, Anthropic tool-use trick) to force the model to emit parseable JSON conforming to a schema. Validation happens in the sampler — non-conforming tokens are never emitted — so it\'s 100% reliable, not "almost always".'
      },
      related: ['structured-outputs','function-calling','tool-use'] },

    // ============ K ============
    { id: 'kv-cache', term: 'KV Cache', aliases: ['KV cache','KV Cache','kv cache','cache KV'], block: '06',
      short: {
        es: 'Cache de claves y valores de la atención, almacenado entre tokens generados.',
        en: 'Cache of attention keys and values stored across generated tokens.'
      },
      long: {
        es: 'Permite que el transformer no recompute la atención sobre tokens ya procesados, sólo sobre el nuevo. Sin KV cache, generar token N requeriría O(N) trabajo; con KV cache, O(1). Es la razón principal por la que el TTFT (primer token) tarda más que los siguientes y por la que la VRAM crece con la longitud de contexto.',
        en: 'Lets the transformer skip recomputing attention over already-processed tokens, only over the new one. Without KV cache, generating token N would take O(N) work; with KV cache, O(1). It\'s the main reason TTFT (first token) is slower than the following ones and why VRAM grows with context length.'
      },
      related: ['attention','autoregressive','flash-attention','context-window'] },

    // ============ L ============
    { id: 'latency', term: 'Latency', aliases: ['latency','latencia','TTFT','TPOT'], block: '04',
      short: {
        es: 'Tiempo desde que envías la petición hasta que recibes la respuesta. Para LLMs se descompone en TTFT y TPOT.',
        en: 'Time from sending the request to receiving the response. For LLMs splits into TTFT and TPOT.'
      },
      long: {
        es: '**TTFT (Time To First Token)**: latencia hasta el primer token, dominada por el procesamiento del prompt. **TPOT (Time Per Output Token)**: tiempo medio entre tokens generados, dominado por la decodificación autoregressive. Streaming reduce el TTFT percibido. P50/P95/P99 son los percentiles que marcan SLA en producción.',
        en: '**TTFT (Time To First Token)**: latency up to the first token, dominated by prompt processing. **TPOT (Time Per Output Token)**: average time between generated tokens, dominated by autoregressive decoding. Streaming reduces perceived TTFT. P50/P95/P99 are the percentiles that mark SLA in production.'
      },
      related: ['streaming','kv-cache','inference','autoregressive'] },

    { id: 'llm', term: 'LLM (Large Language Model)', aliases: ['LLM','LLMs','large language model','modelo de lenguaje grande'], block: '01',
      short: {
        es: 'Modelo entrenado masivamente en texto para predecir el siguiente token.',
        en: 'Model massively trained on text to predict the next token.'
      },
      long: {
        es: 'Capaz de generar, resumir, traducir y razonar. Arquitectura universal en 2026: transformer autoregressive, entrenado en trillones de tokens, alineado vía SFT + RLHF/DPO. Familias: Claude, GPT, Gemini, DeepSeek, Llama, Qwen, Mistral, Gemma, Phi, GLM, Kimi.',
        en: 'Capable of generating, summarizing, translating and reasoning. Universal 2026 architecture: autoregressive transformer, trained on trillions of tokens, aligned via SFT + RLHF/DPO. Families: Claude, GPT, Gemini, DeepSeek, Llama, Qwen, Mistral, Gemma, Phi, GLM, Kimi.'
      },
      related: ['transformer','token','pre-training','post-training','frontier-model'] },

    { id: 'lora', term: 'LoRA (Low-Rank Adaptation)', aliases: ['LoRA','lora','low-rank adaptation'], block: '07',
      short: {
        es: 'Fine-tuning eficiente que añade matrices pequeñas (~1% params) en lugar de actualizar todos los pesos.',
        en: 'Efficient fine-tuning that adds small matrices (~1% params) instead of updating all weights.'
      },
      long: {
        es: 'Permite fine-tunear modelos grandes con una fracción del coste y la VRAM del fine-tuning completo. Los pesos LoRA pueden cargarse y descargarse en runtime, así que un mismo modelo base puede servir múltiples especializaciones. **QLoRA** = LoRA sobre modelo cuantizado a 4-bit, abre fine-tuning de 70B en una sola GPU consumer.',
        en: 'Lets you fine-tune large models at a fraction of the cost and VRAM of full fine-tuning. LoRA weights can be loaded and unloaded at runtime, so the same base model can serve multiple specializations. **QLoRA** = LoRA on a 4-bit quantized model, opens fine-tuning of 70B on a single consumer GPU.'
      },
      related: ['fine-tuning','sft','quantization','qlora'] },

    // ============ M ============
    { id: 'mcp', term: 'MCP (Model Context Protocol)', aliases: ['MCP','model context protocol'], block: '05',
      short: {
        es: 'Protocolo abierto de Anthropic (2024) para conectar agentes a fuentes de datos y herramientas externas.',
        en: 'Open Anthropic protocol (2024) to connect agents to external data sources and tools.'
      },
      long: {
        es: 'Estandariza cómo un cliente (Claude Code, OpenCode, Cursor…) descubre y llama a servidores que exponen capabilities (Drive, Jira, Slack, DBs, APIs locales). En lugar de cablear N integraciones específicas, hablas un protocolo y cualquier cliente compatible las usa. Adoptado por OpenAI, Google y la mayoría de runtimes en 2025-2026.',
        en: 'Standardizes how a client (Claude Code, OpenCode, Cursor…) discovers and calls servers that expose capabilities (Drive, Jira, Slack, DBs, local APIs). Instead of wiring N specific integrations, you speak a protocol and any compatible client uses them. Adopted by OpenAI, Google and most runtimes by 2025-2026.'
      },
      related: ['agent','agent-runtime','tool-use','sub-agent'] },

    { id: 'mmlu', term: 'MMLU', aliases: ['MMLU','mmlu'], block: '09',
      short: {
        es: 'Benchmark de 57 dominios académicos, ~16K preguntas multiple choice.',
        en: 'Benchmark across 57 academic domains, ~16K multiple choice questions.'
      },
      long: {
        es: 'Saturado >90% en frontier 2026, expertos humanos ~89.8%. Como GPT-4 ya pasó al humano experto en 2023, MMLU ha dejado de discriminar y se ha sustituido por MMLU-Pro y GPQA para evaluar el techo actual.',
        en: 'Saturated >90% in 2026 frontier, expert humans ~89.8%. Since GPT-4 surpassed the human expert in 2023, MMLU has stopped discriminating and has been replaced by MMLU-Pro and GPQA to evaluate the current ceiling.'
      },
      related: ['benchmark','humaneval','gpqa','swe-bench'] },

    { id: 'moe', term: 'MoE (Mixture of Experts)', aliases: ['MoE','mixture of experts','MoE model'], block: '01',
      short: {
        es: 'Arquitectura donde sólo se activa un subconjunto de "expertos" por token.',
        en: 'Architecture activating only a subset of "experts" per token.'
      },
      long: {
        es: 'Permite modelos con muchos parámetros totales pero pocos activos por token: DeepSeek V3 tiene 671B totales pero sólo ~37B activos por token. Resultado: capacidad de un modelo enorme con coste de inferencia de uno mediano. La elección del experto la hace un router por token entrenado junto con el modelo.',
        en: 'Allows models with many total params but few active per token: DeepSeek V3 has 671B total but only ~37B active per token. Result: capacity of a huge model at the inference cost of a medium one. Expert choice is made by a per-token router trained alongside the model.'
      },
      related: ['llm','transformer','frontier-model'] },

    { id: 'multimodal', term: 'Multimodal', aliases: ['multimodal','multimodalidad'], block: '03',
      short: {
        es: 'Modelo que procesa más de una modalidad (texto, imagen, audio, vídeo).',
        en: 'Model that processes more than one modality (text, image, audio, video).'
      },
      long: {
        es: 'Los frontier 2026 (Claude, GPT-5, Gemini 2.5, Qwen-VL, Pixtral) son nativamente multimodales: una sola red ingiere texto + imagen y a veces audio. La arquitectura típica añade un encoder de imagen que produce tokens "visuales" mezclados con los textuales. **VLM** (Vision-Language Model) es la subcategoría texto+imagen.',
        en: '2026 frontiers (Claude, GPT-5, Gemini 2.5, Qwen-VL, Pixtral) are natively multimodal: one network ingests text + image and sometimes audio. Typical architecture adds an image encoder producing "visual" tokens mixed with text ones. **VLM** (Vision-Language Model) is the text+image subcategory.'
      },
      related: ['llm','transformer','token','vlm'] },

    // ============ N (Nucleus) ============
    { id: 'top-p', term: 'Nucleus Sampling (top_p)', aliases: ['top_p','nucleus sampling','top-p'], block: '02',
      short: {
        es: 'Sampling que sólo considera los tokens cuyas probabilidades acumuladas suman p (e.g. 0.9).',
        en: 'Sampling that only considers tokens whose cumulative probabilities sum to p (e.g. 0.9).'
      },
      long: {
        es: 'Recorta la cola larga de tokens improbables sin fijar un k duro. 0.9 es el default razonable; valores bajos (0.5) endurecen el output, altos (0.99) lo abren. Se usa junto con temperature, no en su lugar — con temperature=0, top_p es irrelevante.',
        en: 'Trims the long tail of unlikely tokens without fixing a hard k. 0.9 is the reasonable default; low values (0.5) tighten output, high (0.99) open it. Used alongside temperature, not instead — with temperature=0, top_p is irrelevant.'
      },
      related: ['temperature','top-k','sampling','greedy-decoding'] },

    // ============ O ============
    { id: 'open-source-model', term: 'Open-source model', aliases: ['open source','open-source','open weights','modelo abierto'], block: '01',
      short: {
        es: 'Modelo cuyos pesos son descargables y se pueden ejecutar fuera de la API del proveedor.',
        en: 'Model whose weights are downloadable and can be run outside the provider\'s API.'
      },
      long: {
        es: 'En 2026: Llama 4, Qwen 3, DeepSeek V3, Mistral 7-large, Gemma 3, Phi-5. Distinto a "open license" — algunos (Llama) tienen licencia restrictiva por encima de cierto MAU. Distinto a "propietarios" como Claude, GPT y Gemini, sólo accesibles vía API.',
        en: 'In 2026: Llama 4, Qwen 3, DeepSeek V3, Mistral 7-large, Gemma 3, Phi-5. Different from "open license" — some (Llama) have restrictive licenses above a certain MAU. Different from "proprietary" like Claude, GPT and Gemini, only accessible via API.'
      },
      related: ['llm','frontier-model','quantization','gguf'] },

    { id: 'overlap', term: 'Overlap', aliases: ['overlap','solape','solapamiento'], block: '06',
      short: {
        es: 'Porcentaje del chunk anterior que se repite en el siguiente, para preservar contexto entre fragmentos.',
        en: 'Percentage of the previous chunk repeated in the next one, to preserve context across fragments.'
      },
      long: {
        es: '10-20% es el rango típico. Sin overlap, una pregunta cuya respuesta cae justo en el corte se pierde. Demasiado overlap (>30%) duplica almacenamiento y aumenta el ruido en la recuperación.',
        en: '10-20% is the typical range. With no overlap, a question whose answer falls right on the cut is lost. Too much overlap (>30%) duplicates storage and adds noise to retrieval.'
      },
      related: ['chunking','rag','vector-db'] },

    // ============ P ============
    { id: 'pre-training', term: 'Pre-training', aliases: ['pre-training','pretraining','pre training','preentrenamiento'], block: '01',
      short: {
        es: 'Primera fase del entrenamiento: predecir el siguiente token sobre trillones de tokens de internet.',
        en: 'First training phase: next-token prediction over trillions of internet tokens.'
      },
      long: {
        es: 'Es la fase costosa ($10M-$500M+ en cómputo para frontier). Enseña gramática, hechos del mundo, capacidad de razonamiento. El resultado es un base model que sabe completar texto pero no sigue instrucciones — para eso viene después el post-training.',
        en: 'The expensive phase ($10M-$500M+ in compute for frontier). Teaches grammar, world facts, reasoning ability. The result is a base model that can complete text but does not follow instructions — for that comes post-training afterwards.'
      },
      related: ['post-training','base-model','llm','transformer'] },

    { id: 'post-training', term: 'Post-training', aliases: ['post-training','posttraining','post training','postentrenamiento'], block: '07',
      short: {
        es: 'Segunda fase del entrenamiento (alignment): SFT + RLHF/DPO + Constitutional AI.',
        en: 'Second training phase (alignment): SFT + RLHF/DPO + Constitutional AI.'
      },
      long: {
        es: 'Lo que convierte un base model en un asistente conversacional útil. Es relativamente barato comparado con pre-training (días en lugar de meses, miles de dólares en lugar de millones), y por eso aparecen muchas variantes "instruct" del mismo base.',
        en: 'What turns a base model into a useful conversational assistant. Relatively cheap compared to pre-training (days vs. months, thousands vs. millions of dollars), which is why many "instruct" variants appear from the same base.'
      },
      related: ['pre-training','sft','rlhf','dpo','constitutional-ai','alignment'] },

    { id: 'prompt-caching', term: 'Prompt Caching', aliases: ['prompt caching','prompt cache','caché de prompt'], block: '04',
      short: {
        es: 'Marcar bloques del prompt como cacheables para abaratar llamadas repetidas con prefijo común.',
        en: 'Marking prompt blocks as cacheable to make repeated calls with a common prefix cheaper.'
      },
      long: {
        es: 'Anthropic: primera escritura cuesta 1.25× input price, lecturas posteriores 0.10×. Mínimo 1024 tokens cacheables. Soportado por Anthropic explícitamente, por Google y DeepSeek de forma automática. Si tu system prompt + ejemplos pesa >1024 tokens y se reusa, prompt caching baja la factura 80-90%.',
        en: 'Anthropic: first write costs 1.25× input price, later reads 0.10×. 1024-token minimum to be cacheable. Supported explicitly by Anthropic, automatically by Google and DeepSeek. If your system prompt + examples weighs >1024 tokens and is reused, prompt caching cuts the bill 80-90%.'
      },
      related: ['system-prompt','context-window','latency'] },

    { id: 'prompt-engineering', term: 'Prompt engineering', aliases: ['prompt engineering','ingeniería de prompts'], block: '02',
      short: {
        es: 'Disciplina de escribir prompts efectivos: estructura, ejemplos, roles, restricciones, formato.',
        en: 'Discipline of writing effective prompts: structure, examples, roles, constraints, format.'
      },
      long: {
        es: 'En 2026 ha madurado de "trucos sueltos" a una práctica con técnicas establecidas (CoT, few-shot, role prompting, XML structure, etc.) y herramientas (linters, librerías, evals). En sistemas reales se solapa con context engineering (qué va al contexto) y agent governance (reglas estables del agente).',
        en: 'By 2026 it has matured from "isolated tricks" to a practice with established techniques (CoT, few-shot, role prompting, XML structure, etc.) and tooling (linters, libraries, evals). In real systems it overlaps with context engineering (what goes in context) and agent governance (the agent\'s stable rules).'
      },
      related: ['context-engineering','few-shot','cot','role-prompting','xml-tags','scaffolding'] },

    { id: 'prompt-injection', term: 'Prompt Injection', aliases: ['prompt injection','prompt-injection','inyección de prompt'], block: '04',
      short: {
        es: 'Ataque que inyecta instrucciones maliciosas en el prompt para sobrescribir las del sistema.',
        en: 'Attack injecting malicious instructions into the prompt to override system ones.'
      },
      long: {
        es: 'Variantes: **directa** ("ignora instrucciones previas y…"), **indirecta** (la inyección viene en contenido externo: un PDF, una página web, un correo). Top vulnerabilidad de OWASP LLM. Defensa: delimitadores XML fuertes, separación estricta de datos vs instrucciones, validación de input, permisos restringidos, output filtering.',
        en: 'Variants: **direct** ("ignore previous instructions and…"), **indirect** (the injection comes via external content: a PDF, a web page, an email). Top OWASP LLM vulnerability. Defense: strong XML delimiters, strict data-vs-instructions separation, input validation, restricted permissions, output filtering.'
      },
      related: ['jailbreak','xml-tags'] },

    // ============ Q ============
    { id: 'quantization', term: 'Quantization', aliases: ['quantization','quantize','cuantización','cuantizacion'], block: '07',
      short: {
        es: 'Reducir la precisión de los pesos (FP16 → INT8/INT4/INT2) para que el modelo ocupe menos memoria.',
        en: 'Reducing weight precision (FP16 → INT8/INT4/INT2) so the model takes less memory.'
      },
      long: {
        es: 'Q4_K_M es el sweet spot 2026: ~97-99% de la calidad original a 4× menos VRAM. Permite ejecutar modelos de 70B en una RTX 4090. Métodos: GPTQ (post-training, GPU), AWQ (mejor calidad, GPU), GGUF/K-quants (mixto por capa, CPU+GPU). QLoRA combina cuantización con LoRA para fine-tuning local.',
        en: 'Q4_K_M is the 2026 sweet spot: ~97-99% of original quality at 4× less VRAM. Lets you run 70B models on an RTX 4090. Methods: GPTQ (post-training, GPU), AWQ (better quality, GPU), GGUF/K-quants (mixed per layer, CPU+GPU). QLoRA combines quantization with LoRA for local fine-tuning.'
      },
      related: ['gptq','awq','gguf','lora','qlora'] },

    { id: 'qlora', term: 'QLoRA', aliases: ['QLoRA','qlora'], block: '07',
      short: {
        es: 'LoRA aplicado sobre un modelo base cuantizado a 4-bit. Permite fine-tunear 70B en una GPU consumer.',
        en: 'LoRA applied over a 4-bit quantized base model. Lets you fine-tune 70B on a consumer GPU.'
      },
      long: {
        es: 'El base se mantiene cuantizado durante el entrenamiento; sólo los adapters LoRA se entrenan en precisión mayor. Es el estándar de fine-tuning local en 2025+ — Unsloth y Axolotl lo soportan out of the box.',
        en: 'The base stays quantized during training; only the LoRA adapters train at higher precision. The standard for local fine-tuning since 2025 — Unsloth and Axolotl support it out of the box.'
      },
      related: ['lora','quantization','fine-tuning'] },

    // ============ R ============
    { id: 'rag', term: 'RAG (Retrieval-Augmented Generation)', aliases: ['RAG','rag','retrieval augmented generation','retrieval-augmented generation'], block: '06',
      short: {
        es: 'Patrón que aumenta el LLM con documentos externos relevantes recuperados por similitud semántica.',
        en: 'Pattern that augments the LLM with relevant external documents retrieved by semantic similarity.'
      },
      long: {
        es: 'Pipeline típico: indexas tus documentos en chunks → calculas embeddings → guardas en vector DB → en runtime, embebes la query, recuperas top-k chunks, los inyectas en el prompt antes de generar. Es la forma estándar de añadir conocimiento factual fresco a un LLM sin re-entrenarlo. Combate hallucinations cuando se combina con grounding y citas verificables.',
        en: 'Typical pipeline: index your documents in chunks → compute embeddings → store in vector DB → at runtime, embed the query, retrieve top-k chunks, inject them into the prompt before generating. The standard way to add fresh factual knowledge to an LLM without retraining. Fights hallucinations when combined with grounding and verifiable citations.'
      },
      example: {
        es: 'Pregunta: "¿Qué precio tiene el plan Pro de Acme?" Sin RAG, el modelo inventa. Con RAG, el sistema busca en docs internos, encuentra "Pro: $29/mo", lo inyecta como contexto, el modelo cita.',
        en: 'Question: "What\'s the price of Acme\'s Pro plan?" Without RAG, the model makes it up. With RAG, the system searches internal docs, finds "Pro: $29/mo", injects it as context, the model cites.'
      },
      related: ['embedding','vector-db','chunking','grounding','hallucination'] },

    { id: 'react', term: 'ReAct', aliases: ['ReAct','react pattern','reasoning and acting'], block: '03',
      short: {
        es: 'Patrón Reasoning + Acting: el modelo intercala thought, action (tool call) y observation hasta resolver.',
        en: 'Reasoning + Acting pattern: the model alternates thought, action (tool call) and observation until solved.'
      },
      long: {
        es: 'Yao et al., 2022. Es la base conceptual de TODOS los agentes modernos. El modelo escribe un razonamiento corto, decide qué herramienta usar, recibe el resultado, razona de nuevo, hasta cerrar la tarea. Claude Code, OpenCode, Codex y los agentes de LangGraph siguen este bucle.',
        en: 'Yao et al., 2022. The conceptual base of EVERY modern agent. The model writes a short reasoning, decides which tool to use, receives the result, reasons again, until closing the task. Claude Code, OpenCode, Codex and LangGraph agents follow this loop.'
      },
      related: ['agent','tool-use','function-calling','cot'] },

    { id: 'reasoning-effort', term: 'Reasoning effort', aliases: ['reasoning_effort','reasoning effort'], block: '03',
      short: {
        es: 'Parámetro de OpenAI o-series y GPT-5: minimal/low/medium/high. Equivalente al `effort` de Claude.',
        en: 'OpenAI o-series and GPT-5 parameter: minimal/low/medium/high. Equivalent to Claude\'s `effort`.'
      },
      long: {
        es: 'Controla cuánto razonamiento interno hace el modelo antes de la respuesta visible. Más reasoning_effort → más thinking tokens facturados → mejor calidad en problemas complejos pero más coste y latencia.',
        en: 'Controls how much internal reasoning the model does before the visible answer. Higher reasoning_effort → more billed thinking tokens → better quality on hard problems but more cost and latency.'
      },
      related: ['effort-levels','thinking-tokens'] },

    { id: 'rlhf', term: 'RLHF (Reinforcement Learning from Human Feedback)', aliases: ['RLHF','reinforcement learning from human feedback'], block: '07',
      short: {
        es: 'Método de alignment: humanos rankean respuestas → reward model → PPO optimiza el LLM.',
        en: 'Alignment method: humans rank responses → reward model → PPO optimizes the LLM.'
      },
      long: {
        es: 'Usado en GPT-4 y los primeros Claude. Caro y propenso a "reward hacking". DPO y Constitutional AI lo han desplazado en gran medida porque son más simples y baratos a calidad similar. Aún se usa cuando hay datos humanos abundantes y presupuesto.',
        en: 'Used in GPT-4 and early Claude. Expensive and prone to "reward hacking". DPO and Constitutional AI have largely displaced it because they\'re simpler and cheaper at similar quality. Still used when human data is abundant and budget allows.'
      },
      related: ['dpo','sft','constitutional-ai','alignment','post-training'] },

    { id: 'role-prompting', term: 'Role prompting', aliases: ['role prompting','role-prompting','prompting de rol'], block: '02',
      short: {
        es: 'Asignar un rol al modelo ("Eres un revisor de código senior").',
        en: 'Assigning a role to the model ("You are a senior code reviewer").'
      },
      long: {
        es: 'Cambia drásticamente el tono, la estructura y la profundidad de la respuesta. Funciona porque el modelo recupera del entrenamiento patrones asociados a ese rol. No es magia: un rol mal definido empeora la respuesta. La mejor práctica: rol breve, especifico y con expectativas explícitas.',
        en: 'Dramatically changes tone, structure and answer depth. Works because the model recovers patterns associated with that role from training. No magic: a poorly defined role makes the answer worse. Best practice: short, specific role with explicit expectations.'
      },
      example: {
        es: '`Eres un editor de prensa especializado en ciencia. Responde en máximo 3 párrafos, evita jerga y cita la fuente original cuando exista.`',
        en: '`You are a science newspaper editor. Reply in at most 3 paragraphs, avoid jargon and cite the original source when available.`'
      },
      related: ['system-prompt','few-shot','prompt-engineering'] },

    // ============ S ============
    { id: 'sampling', term: 'Sampling', aliases: ['sampling','muestreo'], block: '02',
      short: {
        es: 'Proceso de elegir el siguiente token de entre la distribución de probabilidad que produce el modelo.',
        en: 'Process of choosing the next token from the probability distribution the model produces.'
      },
      long: {
        es: 'Los parámetros principales: temperature (aplana o agudiza la distribución), top_p (recorta cola), top_k (limita a los k más probables), seed (reproducibilidad), repetition/frequency/presence penalty (penaliza tokens vistos). Cada API expone un subconjunto distinto.',
        en: 'Main parameters: temperature (flattens or sharpens the distribution), top_p (trims tail), top_k (caps to top-k), seed (reproducibility), repetition/frequency/presence penalty (penalize seen tokens). Each API exposes a different subset.'
      },
      related: ['temperature','top-p','top-k','greedy-decoding'] },

    { id: 'scaffolding', term: 'Scaffolding', aliases: ['scaffolding','andamiaje','andamio'], block: '02',
      short: {
        es: 'Estructura visible que rodea la pregunta en el prompt: roles, ejemplos, secciones XML, frames de razonamiento.',
        en: 'Visible structure surrounding the question in the prompt: roles, examples, XML sections, reasoning frames.'
      },
      long: {
        es: 'Añadir scaffolding mejora la calidad cuando el modelo necesita guía (clasificación, extracción, formato estricto), pero la empeora cuando el modelo ya razona bien por sí solo (Claude extended thinking, o-series). El error típico es over-scaffolding: prompts gigantes con XML pesado para tareas que un párrafo simple resolvería igual o mejor.',
        en: 'Adding scaffolding improves quality when the model needs guidance (classification, extraction, strict format), but worsens it when the model already reasons well on its own (Claude extended thinking, o-series). Typical mistake: over-scaffolding — giant prompts with heavy XML for tasks a simple paragraph would solve as well or better.'
      },
      example: {
        es: 'Scaffolding mínimo: "Clasifica este email en {spam, ham}." Scaffolding pesado: rol + 5 ejemplos + sección de criterios + tags XML + CoT explícito. Para spam, mínimo basta; para extracción legal, pesado paga.',
        en: 'Minimal scaffolding: "Classify this email as {spam, ham}." Heavy scaffolding: role + 5 examples + criteria section + XML tags + explicit CoT. For spam, minimal is enough; for legal extraction, heavy pays off.'
      },
      related: ['prompt-engineering','xml-tags','few-shot','cot','context-engineering'] },

    { id: 'self-consistency', term: 'Self-Consistency', aliases: ['self-consistency','self consistency','autoconsistencia'], block: '02',
      short: {
        es: 'Variante de CoT: ejecutar el razonamiento N veces (e.g. 5) con temperature>0 y tomar la respuesta más común.',
        en: 'CoT variant: run reasoning N times (e.g. 5) with temperature>0 and take the most common answer.'
      },
      long: {
        es: 'Mejora matemáticas y problemas con única respuesta correcta. Coste: N× tokens. En modelos con thinking nativo y reasoning_effort alto, suele ser redundante porque el modelo ya hace algo equivalente internamente.',
        en: 'Improves math and problems with a unique correct answer. Cost: N× tokens. In models with native thinking and high reasoning_effort, often redundant because the model already does something equivalent internally.'
      },
      related: ['cot','thinking-tokens','sampling','temperature'] },

    { id: 'sft', term: 'SFT (Supervised Fine-Tuning)', aliases: ['SFT','supervised fine-tuning','supervised finetuning'], block: '07',
      short: {
        es: 'Fine-tuning sobre pares (input, ideal output). Primera fase del post-training.',
        en: 'Fine-tuning over (input, ideal output) pairs. First post-training phase.'
      },
      long: {
        es: 'Convierte un base model en un instruct model que sigue instrucciones. Datasets típicos: Alpaca, ShareGPT, OpenOrca, Dolly. Suele ir seguido de RLHF o DPO para alinear preferencias finas.',
        en: 'Turns a base model into an instruct model that follows instructions. Typical datasets: Alpaca, ShareGPT, OpenOrca, Dolly. Usually followed by RLHF or DPO to align fine preferences.'
      },
      related: ['rlhf','dpo','alignment','post-training','base-model'] },

    { id: 'skill', term: 'Skill (Claude Code)', aliases: ['skill','skills','SKILL.md'], block: '05',
      short: {
        es: 'Archivo SKILL.md que extiende Claude con capacidades reutilizables.',
        en: 'SKILL.md file that extends Claude with reusable capabilities.'
      },
      long: {
        es: 'Frontmatter YAML define name, description, allowed-tools, context isolation. Body markdown contiene la lógica/procedimiento. Personales en `~/.claude/skills/<name>/SKILL.md`, de proyecto en `.claude/skills/`. La description guía a Claude para decidir cuándo invocarlas.',
        en: 'YAML frontmatter defines name, description, allowed-tools, context isolation. Markdown body holds the logic/procedure. Personal in `~/.claude/skills/<name>/SKILL.md`, per-project in `.claude/skills/`. Description guides Claude on when to invoke them.'
      },
      related: ['claude-md','agent-runtime','sub-agent'] },

    { id: 'speculative-decoding', term: 'Speculative decoding', aliases: ['speculative decoding','speculative','draft model','assistant model'], block: '06',
      short: {
        es: 'Optimización: usar un modelo pequeño para "adivinar" K tokens y un modelo grande para verificarlos en paralelo.',
        en: 'Optimization: use a small model to "guess" K tokens and a large one to verify them in parallel.'
      },
      long: {
        es: '2-3× speedup sin pérdida de calidad: si el draft acierta, ahorras N pasos; si falla, vuelves al modelo grande. Implementado en vLLM, llama.cpp, TGI. Es por qué Claude/GPT recientes responden más rápido que sus equivalentes en complejidad equivalente de hace dos años.',
        en: '2-3× speedup with no quality loss: if the draft is right, you save N steps; if wrong, you fall back to the large model. Implemented in vLLM, llama.cpp, TGI. Why recent Claude/GPT respond faster than equivalent-complexity peers from two years ago.'
      },
      related: ['inference','autoregressive','latency'] },

    { id: 'streaming', term: 'Streaming', aliases: ['streaming','SSE','server-sent events'], block: '04',
      short: {
        es: 'Recibir la respuesta del modelo token a token según se genera, en lugar de esperar a que termine.',
        en: 'Receiving the model response token by token as it\'s generated, instead of waiting for completion.'
      },
      long: {
        es: 'Reduce el TTFT percibido — el usuario ve texto inmediatamente. Implementado vía SSE (Server-Sent Events) o WebSockets en la mayoría de APIs. Útil para chat UIs y demos; menos relevante para extracción/clasificación donde necesitas el output completo para parsear.',
        en: 'Reduces perceived TTFT — the user sees text immediately. Implemented via SSE (Server-Sent Events) or WebSockets in most APIs. Useful for chat UIs and demos; less relevant for extraction/classification where you need the full output to parse.'
      },
      related: ['latency','inference','autoregressive'] },

    { id: 'structured-outputs', term: 'Structured Outputs', aliases: ['structured outputs','structured output','salidas estructuradas'], block: '04',
      short: {
        es: 'Forzar al modelo a emitir output que cumpla un schema (JSON Schema, function signature).',
        en: 'Forcing the model to emit output conforming to a schema (JSON Schema, function signature).'
      },
      long: {
        es: 'Garantiza formato exacto sin necesidad de re-parsing ni reintentos. OpenAI lo expone como `response_format` con `json_schema`; Anthropic mediante el truco de tool-use con `tool_choice`. La validación ocurre en el sampler — los tokens no conformes se descartan en tiempo real.',
        en: 'Guarantees exact format with no re-parsing or retries needed. OpenAI exposes it as `response_format` with `json_schema`; Anthropic via the tool-use trick with `tool_choice`. Validation happens in the sampler — non-conforming tokens are discarded in real time.'
      },
      related: ['json-schema','function-calling','tool-use'] },

    { id: 'sub-agent', term: 'Sub-agent', aliases: ['sub-agent','subagent','sub agente','subagente'], block: '05',
      short: {
        es: 'Agente lanzado por otro agente con tools y contexto propios.',
        en: 'Agent spawned by another agent with its own tools and context.'
      },
      long: {
        es: 'Tipos comunes en Claude Code: Explore (read-only), Plan (lee + escribe doc), general-purpose (todas las tools). Permiten paralelizar trabajo, aislar contexto (un sub-agente puede explorar sin polucionar el contexto del padre) y aplicar permisos diferenciados. Patrón habitual: agente padre planifica, sub-agentes ejecutan en paralelo.',
        en: 'Common types in Claude Code: Explore (read-only), Plan (read + write doc), general-purpose (all tools). Enable parallel work, context isolation (a sub-agent can explore without polluting the parent context) and differentiated permissions. Common pattern: parent agent plans, sub-agents execute in parallel.'
      },
      related: ['agent','agent-runtime','skill','mcp'] },

    { id: 'swe-bench', term: 'SWE-bench', aliases: ['SWE-bench','swe-bench','swe bench'], block: '09',
      short: {
        es: 'Benchmark de 2294 issues reales de GitHub. Mide coding agents end-to-end.',
        en: 'Benchmark of 2294 real GitHub issues. Measures coding agents end-to-end.'
      },
      long: {
        es: 'Top 2026: Claude Opus 4.7 a ~68%, GPT-5.5 ~63%, DeepSeek V4 ~58%. Es realista porque cada caso requiere leer un repo, identificar el bug, escribir la fix y pasar los tests del proyecto — no resolver un puzzle aislado. Variantes: SWE-bench Verified (filtrado), SWE-bench Lite (subset rápido).',
        en: 'Top 2026: Claude Opus 4.7 ~68%, GPT-5.5 ~63%, DeepSeek V4 ~58%. Realistic because each case requires reading a repo, identifying the bug, writing the fix and passing the project\'s tests — not solving an isolated puzzle. Variants: SWE-bench Verified (filtered), SWE-bench Lite (fast subset).'
      },
      related: ['benchmark','humaneval','agent','eval'] },

    { id: 'system-prompt', term: 'System prompt', aliases: ['system prompt','system-prompt','prompt de sistema','system message'], block: '02',
      short: {
        es: 'Mensaje con prioridad máxima que define rol, reglas y comportamiento del modelo.',
        en: 'Top-priority message defining the model\'s role, rules and behavior.'
      },
      long: {
        es: 'En Anthropic es un parámetro top-level (`system`); en OpenAI/DeepSeek es el primer message con `role: "system"`. Persiste durante toda la conversación. Buena práctica: que NO contenga datos del usuario — sólo reglas y contexto estable. Los datos de usuario van en mensajes user.',
        en: 'In Anthropic it\'s a top-level parameter (`system`); in OpenAI/DeepSeek it\'s the first message with `role: "system"`. Persists across the entire conversation. Best practice: do NOT put user data in it — only rules and stable context. User data goes in user messages.'
      },
      related: ['role-prompting','prompt-caching','prompt-engineering'] },

    // ============ T ============
    { id: 'temperature', term: 'Temperature', aliases: ['temperature','temperatura'], block: '02',
      short: {
        es: 'Parámetro que controla la aleatoriedad del sampling.',
        en: 'Parameter controlling sampling randomness.'
      },
      long: {
        es: '0.0 = determinista (siempre el token más probable); 0.7 = balance creatividad/coherencia; 1.5+ = muy aleatorio, bordeando incoherencia. Usa 0 para extracción/clasificación reproducible; 0.5-1.0 para generación creativa. Combinable con top_p.',
        en: '0.0 = deterministic (always most-likely token); 0.7 = creativity/coherence balance; 1.5+ = very random, bordering on incoherence. Use 0 for reproducible extraction/classification; 0.5-1.0 for creative generation. Combinable with top_p.'
      },
      related: ['sampling','top-p','top-k','greedy-decoding'] },

    { id: 'thinking-tokens', term: 'Thinking tokens', aliases: ['thinking tokens','thinking','extended thinking','tokens de pensamiento'], block: '03',
      short: {
        es: 'Tokens de razonamiento internos generados antes de la respuesta visible. Se facturan.',
        en: 'Internal reasoning tokens generated before the visible answer. They are billed.'
      },
      long: {
        es: 'Activables vía `thinking={"type":"adaptive"}` en Claude o `reasoning_effort` en OpenAI o-series/GPT-5. El usuario sólo ve el output final; los thinking tokens son el "borrador" del modelo. Más thinking → mejor calidad en problemas duros pero más coste y latencia.',
        en: 'Enabled via `thinking={"type":"adaptive"}` in Claude or `reasoning_effort` in OpenAI o-series/GPT-5. The user sees only the final output; thinking tokens are the model\'s "scratchpad". More thinking → better quality on hard problems but more cost and latency.'
      },
      related: ['effort-levels','reasoning-effort','cot'] },

    { id: 'token', term: 'Token', aliases: ['token','tokens'], block: '01',
      short: {
        es: 'Unidad básica de procesamiento de un LLM.',
        en: 'Basic LLM processing unit.'
      },
      long: {
        es: 'No coincide con palabra ni con carácter. Aproximadamente 1 token ≈ 4 caracteres en inglés, 2.5 en código, 1.5 en español. Las APIs facturan por tokens (input + output). Conviene usar un tokenizer (tiktoken para OpenAI, el endpoint count-tokens de Anthropic) para estimar coste antes de enviar.',
        en: 'Does not match a word or a character. Roughly 1 token ≈ 4 chars in English, 2.5 in code, 1.5 in Spanish. APIs bill per token (input + output). Use a tokenizer (tiktoken for OpenAI, Anthropic\'s count-tokens endpoint) to estimate cost before sending.'
      },
      related: ['tokenizer','bpe','context-window'] },

    { id: 'tokenizer', term: 'Tokenizer', aliases: ['tokenizer','tokenizador'], block: '01',
      short: {
        es: 'Algoritmo que divide texto en tokens.',
        en: 'Algorithm that splits text into tokens.'
      },
      long: {
        es: 'Variantes: byte-level BPE (GPT, Claude, Llama), SentencePiece (Gemma, Qwen), tiktoken (la implementación de OpenAI). Cada modelo tiene su tokenizer entrenado con el modelo: cambiarlo después es imposible sin re-entrenar.',
        en: 'Variants: byte-level BPE (GPT, Claude, Llama), SentencePiece (Gemma, Qwen), tiktoken (OpenAI\'s implementation). Each model has its tokenizer trained with the model: changing it after is impossible without retraining.'
      },
      related: ['token','bpe'] },

    { id: 'tool-use', term: 'Tool use', aliases: ['tool use','tool-use','uso de herramientas'], block: '03',
      short: {
        es: 'Capacidad del modelo de invocar herramientas (funciones) con argumentos estructurados.',
        en: 'Model\'s ability to invoke tools (functions) with structured arguments.'
      },
      long: {
        es: 'Es como Anthropic llama a function calling. Funcionalmente idéntico: defines un tool con `input_schema`, el modelo emite una llamada con argumentos válidos, tu código ejecuta y devuelve `tool_result`. Es el mecanismo base de los agentes y de la integración con MCP.',
        en: 'What Anthropic calls function calling. Functionally identical: you define a tool with `input_schema`, the model emits a call with valid arguments, your code runs it and returns `tool_result`. The base mechanism of agents and of MCP integration.'
      },
      related: ['function-calling','structured-outputs','mcp','agent','react'] },

    { id: 'top-k', term: 'top_k', aliases: ['top_k','top-k'], block: '02',
      short: {
        es: 'Sampling que sólo considera los k tokens más probables en cada paso.',
        en: 'Sampling that only considers the top-k most likely tokens at each step.'
      },
      long: {
        es: 'Más burdo que top_p porque no se adapta a la forma de la distribución. Algunos APIs (Google, DeepSeek) lo exponen; OpenAI y Anthropic no. En la práctica, top_p suele ser preferible.',
        en: 'Cruder than top_p because it doesn\'t adapt to the distribution shape. Some APIs (Google, DeepSeek) expose it; OpenAI and Anthropic don\'t. In practice top_p is usually preferable.'
      },
      related: ['top-p','sampling','temperature'] },

    { id: 'transformer', term: 'Transformer', aliases: ['transformer','transformers'], block: '01',
      short: {
        es: 'Arquitectura de red neuronal basada en atención. Vaswani et al. 2017.',
        en: 'Attention-based neural network architecture. Vaswani et al. 2017.'
      },
      long: {
        es: 'Base de TODOS los LLMs modernos. Stack de bloques que combinan atención (cada token mira al resto del contexto) y feed-forward (transformación posicional). Variantes: encoder-only (BERT), decoder-only (GPT, Claude, Llama), encoder-decoder (T5). Los chat LLMs son decoder-only.',
        en: 'Base of EVERY modern LLM. Stack of blocks combining attention (each token looks at the rest of the context) and feed-forward (positional transformation). Variants: encoder-only (BERT), decoder-only (GPT, Claude, Llama), encoder-decoder (T5). Chat LLMs are decoder-only.'
      },
      related: ['attention','llm','autoregressive','moe'] },

    // ============ V ============
    { id: 'vector-db', term: 'Vector DB', aliases: ['vector DB','vector database','base de datos vectorial'], block: '06',
      short: {
        es: 'Base de datos optimizada para búsqueda por similitud sobre embeddings.',
        en: 'Database optimized for similarity search over embeddings.'
      },
      long: {
        es: 'Opciones 2026 por escala: Chroma o pgvector para <10K documentos; Qdrant o Pinecone serverless para 100K-10M; Milvus distribuido para 100M+. La métrica habitual es similitud coseno o producto escalar. La mayoría soportan filtrado por metadata e híbrido (vector + BM25).',
        en: '2026 options by scale: Chroma or pgvector for <10K documents; Qdrant or Pinecone serverless for 100K-10M; Milvus distributed for 100M+. Usual metric is cosine similarity or dot product. Most support metadata filtering and hybrid search (vector + BM25).'
      },
      related: ['embedding','rag','chunking'] },

    { id: 'vlm', term: 'VLM (Vision-Language Model)', aliases: ['VLM','vision-language model','vision language model'], block: '01',
      short: {
        es: 'Modelo multimodal que procesa imagen + texto.',
        en: 'Multimodal model that processes image + text.'
      },
      long: {
        es: 'Subcategoría de multimodal donde la modalidad extra es imagen. Casi todos los frontier 2026 son VLM: Claude Vision, GPT-5V, Gemini, Qwen-VL, Pixtral. La imagen se convierte en tokens visuales y entra al mismo transformer que el texto.',
        en: 'Subcategory of multimodal where the extra modality is image. Almost all 2026 frontiers are VLM: Claude Vision, GPT-5V, Gemini, Qwen-VL, Pixtral. The image is converted to visual tokens and enters the same transformer as the text.'
      },
      related: ['multimodal','llm','transformer'] },

    // ============ X ============
    { id: 'xml-tags', term: 'XML tags', aliases: ['XML tags','XML structure','XML','tags XML'], block: '02',
      short: {
        es: 'Técnica de estructuración recomendada por Anthropic para Claude: envolver instrucciones, ejemplos y contexto en tags.',
        en: 'Anthropic-recommended structuring technique for Claude: wrapping instructions, examples and context in tags.'
      },
      long: {
        es: 'Tags típicos: `<instructions>`, `<examples>`, `<documents>`, `<context>`. Claude está fine-tuned para parsear XML sin ambigüedad, así que separar bloques así mejora claridad y reduce confusión instrucciones-vs-datos. En modelos pequeños open-weights el rendimiento es marginal y a veces contraproducente — adapta al modelo.',
        en: 'Typical tags: `<instructions>`, `<examples>`, `<documents>`, `<context>`. Claude is fine-tuned to parse XML unambiguously, so separating blocks like this improves clarity and reduces instruction-vs-data confusion. On small open-weights models the gain is marginal and sometimes counterproductive — adapt to the model.'
      },
      example: {
        es: '`<instructions>Resume los documentos.</instructions>\\n<documents>...</documents>`',
        en: '`<instructions>Summarize the documents.</instructions>\\n<documents>...</documents>`'
      },
      related: ['prompt-engineering','scaffolding','structured-outputs','prompt-injection'] },

    // ============ Z ============
    { id: 'zero-shot', term: 'Zero-shot', aliases: ['zero-shot','zero shot','zero-shot prompting'], block: '02',
      short: {
        es: 'Pedirle al modelo una tarea sin dar ejemplos.',
        en: 'Asking the model for a task with no examples.'
      },
      long: {
        es: 'Funciona para tareas estándar y bien definidas (resumen, traducción, clasificación obvia). Para tareas con formato específico, dominio especializado o criterios sutiles, few-shot es más fiable. La regla práctica: empieza zero-shot; si el output no cumple, añade ejemplos.',
        en: 'Works for standard, well-defined tasks (summarization, translation, obvious classification). For tasks with specific format, specialized domain or subtle criteria, few-shot is more reliable. Rule of thumb: start zero-shot; if the output falls short, add examples.'
      },
      related: ['few-shot','in-context-learning','prompt-engineering'] }
  ];

  // Build alias index for fast lookup (lowercase → entry)
  const ALIAS_INDEX = {};
  for (const t of TERMS) {
    const allAliases = [t.term, ...(t.aliases || [])];
    for (const a of allAliases) {
      ALIAS_INDEX[a.toLowerCase()] = t;
    }
  }

  // Expose globally
  window.GLOSSARY_TERMS = TERMS;
  window.GLOSSARY_INDEX = ALIAS_INDEX;
})();
