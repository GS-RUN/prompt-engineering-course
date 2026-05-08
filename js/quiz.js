/* ============================================================
   Quiz System — Multiple choice with scoring & progress
   ============================================================ */

// Bumped whenever option order or correct-index changes across the
// course. Old quiz_* localStorage entries are wiped on mismatch so
// stale answers don't paint nonsensical positions.
const QUIZ_SCHEMA_VERSION = '2';

class QuizEngine {
  constructor() {
    this.currentQuiz = 0;
    this.answers = {};
    this.quizzes = [
      {
        id: 'quiz1', section: 's5',
        question: '¿Qué parámetro controla cuánto "piensa" Claude Opus 4.7?',
        options: ['temperature', 'top_p', 'max_tokens', 'effort'],
        correct: 3,
        explanation: 'El parámetro `effort` (low→medium→high→xhigh→max) controla cuánto razonamiento interno usa Claude Opus 4.7. Reemplaza al antiguo `budget_tokens` del extended thinking.'
      },
      {
        id: 'quiz2', section: 's7',
        question: '¿Cuántos ejemplos se recomiendan para few-shot prompting efectivo?',
        options: ['1-2 ejemplos', '8-10 ejemplos', '20+ ejemplos', '3-5 ejemplos'],
        correct: 3,
        explanation: 'Anthropic recomienda 3-5 ejemplos diversos y relevantes. Más de 5 puede causar sobre-ajuste. Menos de 3 puede no establecer el patrón claramente.'
      },
      {
        id: 'quiz3', section: 's9',
        question: '¿Qué técnica es la MÁS recomendada por Anthropic para estructurar prompts complejos?',
        options: ['Markdown con headers', 'XML tags', 'JSON estructurado', 'YAML frontmatter'],
        correct: 1,
        explanation: 'XML tags es la técnica más recomendada. Claude está fine-tuned para parsear XML sin ambigüedad. Separa claramente instrucciones, contexto, ejemplos y formato.'
      },
      {
        id: 'quiz4', section: 's17',
        question: '¿Dónde se guardan las Skills personales en Claude Code?',
        options: ['~/.claude/skills/<name>/SKILL.md', '.claude/skills/', '/etc/claude/skills/', 'project/skills.md'],
        correct: 0,
        explanation: 'Las skills personales van en `~/.claude/skills/<name>/SKILL.md` y están disponibles en todos tus proyectos. Las de proyecto van en `.claude/skills/`.'
      },
      {
        id: 'quiz5', section: 's16',
        question: '¿Cuál es la diferencia principal entre un sub-agente y una skill con `context: fork`?',
        options: [
          'No hay diferencia',
          'El sub-agente usa otro modelo',
          'El sub-agente se define en .claude/agents/, la skill en .claude/skills/',
          'La skill es más rápida'
        ],
        correct: 2,
        explanation: 'Ambos ejecutan en contexto aislado, pero los sub-agentes se definen en `.claude/agents/` con su propio prompt, mientras las skills con `context: fork` usan SKILL.md como prompt del sub-agente.'
      },
      {
        id: 'quiz6', section: 's26',
        question: '¿Qué ventaja principal tiene DeepSeek V4 Pro sobre Claude Opus 4.7?',
        options: ['Coste significativamente menor', 'Mejor razonamiento', 'Más herramientas', 'Computer Use nativo'],
        correct: 0,
        explanation: 'DeepSeek V4 Pro cuesta aproximadamente 1/30 del precio de Claude Opus 4.7 (~$0.50 vs $15 por millón de tokens de input), manteniendo excelente calidad en coding.'
      },
      {
        id: 'quiz7', section: 's19',
        question: '¿Cuál es el equivalente de CLAUDE.md en OpenCode?',
        options: ['README.md', 'CONFIG.md', 'AGENTS.md', 'MEMORY.md'],
        correct: 2,
        explanation: 'AGENTS.md es el equivalente. OpenCode lo lee al inicio de cada sesión e inyecta su contenido en el system prompt. Mismo concepto que CLAUDE.md pero para el ecosistema OpenCode.'
      },
      {
        id: 'quiz8', section: 's14',
        question: '¿Qué patrón describe el ciclo Thought → Action → Observation?',
        options: ['Chain of Thought', 'Few-shot prompting', 'Tree of Thoughts', 'ReAct'],
        correct: 3,
        explanation: 'ReAct (Reasoning + Acting) alterna entre pensamiento, acción (tool call) y observación (resultado). Es el patrón base de todos los agentes AI modernos.'
      },
      {
        id: 'quiz9', section: 's39',
        question: '¿Cuánto puede ahorrar Prompt Caching en llamadas repetitivas?',
        options: ['10-20%', '85-90%', '30-50%', '70-80%'],
        correct: 1,
        explanation: 'Con Prompt Caching, las llamadas repetitivas con el mismo system prompt y documentos pueden ahorrar hasta 85-90% en costes de input tokens.'
      },
      {
        id: 'quiz10', section: 's41',
        question: '¿Cuál es la defensa más efectiva contra prompt injection?',
        options: ['Delimitadores XML + separar datos de instrucciones', 'Usar un modelo más caro', 'Añadir más ejemplos al prompt', 'Subir el effort level'],
        correct: 0,
        explanation: 'Usar delimitadores XML fuertes y separar los datos del usuario de las instrucciones del sistema es la defensa más efectiva. Complementa con moderation API y validación de inputs.'
      },
      {
        id: 'quiz11', section: 's46',
        question: 'Según Anthropic, ¿cuándo deberías considerar fine-tuning en vez de prompt engineering?',
        options: ['Solo cuando has agotado todas las técnicas de prompting', 'Siempre — fine-tuning es mejor', 'Como primer paso en cualquier proyecto', 'Nunca — fine-tuning está obsoleto'],
        correct: 0,
        explanation: 'Anthropic recomienda empezar siempre con prompt engineering. Fine-tuning solo cuando hayas agotado todas las técnicas y necesites consistencia extrema o ahorrar tokens.'
      },
      {
        id: 'quiz12', section: 's40',
        question: '¿Qué tipo de evaluación es mejor para juzgar la calidad de resúmenes generados?',
        options: ['Exact Match', 'Regex pattern', 'LLM-as-Judge', 'Siempre evaluación humana'],
        correct: 2,
        explanation: 'LLM-as-Judge (otro LLM evaluando la calidad) es práctico para tareas subjetivas como resúmenes. La evaluación humana es el gold standard pero no escala.'
      },
      {
        id: 'quiz13', section: 's56',
        question: '¿Qué herramienta permite ejecutar LLMs localmente con un solo comando?',
        options: ['LangChain', 'Ollama', 'Pinecone', 'Weaviate'],
        correct: 1,
        explanation: 'Ollama permite ejecutar modelos como Llama, Mistral o Gemma localmente con `ollama run llama4`. Ideal para desarrollo sin depender de APIs cloud.'
      },
      {
        id: 'quiz14', section: 's61',
        question: '¿Cuántos ejemplos necesitas MÍNIMO para fine-tuning efectivo con LoRA?',
        options: ['500-1000 ejemplos', '10-50 ejemplos', '100-200 ejemplos', '10000+ ejemplos'],
        correct: 0,
        explanation: 'Se recomiendan 500+ ejemplos de alta calidad para fine-tuning efectivo. Con menos de 200, el overfitting es casi inevitable. La calidad de los ejemplos importa más que la cantidad.'
      },
      {
        id: 'quiz15', section: 's64',
        question: '¿Cuál es el tamaño de chunk recomendado para QA factual en RAG?',
        options: ['64-128 tokens', '256-512 tokens', '1024-2048 tokens', '4096+ tokens'],
        correct: 1,
        explanation: '256-512 tokens es el sweet spot para QA factual. Suficientemente pequeño para precisión, suficientemente grande para contexto. Usa overlap del 10-20%.'
      },
      {
        id: 'quiz16', section: 's59',
        question: '¿Qué fase del entrenamiento convierte un "base model" en un asistente conversacional?',
        options: ['Post-training (SFT/RLHF/DPO)', 'Pre-training', 'Tokenization', 'Inference'],
        correct: 0,
        explanation: 'El post-training (SFT + RLHF/DPO) es lo que convierte un modelo que solo completa texto en un asistente que sigue instrucciones, es útil y rechaza peticiones dañinas.'
      },
      {
        id: 'quiz17', section: 's76',
        question: '¿Cuál es la mejor estrategia para reducir alucinaciones factuales?',
        options: ['RAG con fuentes verificadas + citar pasajes exactos', 'Usar un modelo más grande', 'Subir el effort level al máximo', 'Añadir "no alucines" al prompt'],
        correct: 0,
        explanation: 'RAG (Retrieval Augmented Generation) con fuentes verificadas y pedir citas textuales es la estrategia más efectiva. Pedir "no alucines" raramente funciona porque el modelo no sabe cuándo está alucinando.'
      },
      {
        id: 'quiz18', section: 's77',
        question: '¿Qué nivel del AI Safety Level de Anthropic permite deployment público sin restricciones?',
        options: ['ASL-2', 'ASL-1', 'ASL-3', 'Todos los niveles'],
        correct: 1,
        explanation: 'ASL-1 es para sistemas sin riesgo catastrófico y permite deployment público. ASL-2 requiere mitigación adicional. ASL-3 y ASL-4 restringen o prohíben el deployment.'
      },
      {
        id: 'quiz19', section: 's79',
        question: '¿Qué patrón multi-agente usa un agente que asigna tareas a workers y revisa resultados?',
        options: ['Debate', 'Pipeline Sequential', 'Consensus', 'Supervisor-Worker'],
        correct: 3,
        explanation: 'El patrón Supervisor-Worker tiene un agente "manager" que asigna tareas, revisa resultados y re-asigna si algo falla. Es ideal para tareas complejas que requieren coordinación.'
      },
      {
        id: 'quiz20', section: 's82',
        question: 'Según el curso, ¿qué porcentaje del código boilerplate pueden manejar los agentes AI en 2026?',
        options: ['10-20%', '30-40%', '95-100%', '60-80%'],
        correct: 3,
        explanation: 'Los agentes modernos (Claude Code, OpenCode) pueden manejar el 60-80% del código boilerplate, tests y refactors. El desarrollador se enfoca en arquitectura, decisiones de diseño y revisión.'
      },
      {
        id: 'quiz21', section: 's88',
        question: '¿Cuál es el "sweet spot" de cuantización para LLMs locales?',
        options: ['FP32 (sin cuantizar)', 'INT4 (4-bit)', 'INT8 (8-bit)', 'INT2 (2-bit)'],
        correct: 1,
        explanation: 'INT4 (4-bit) es el sweet spot: 97-99% de la calidad original por 4x menos memoria. Permite ejecutar modelos de 70B en una sola GPU de consumo. Q4_K_M en GGUF o GPTQ/AWQ.'
      },
      {
        id: 'quiz22', section: 's85',
        question: '¿Qué tendencia permite a los agentes AI operar durante horas o días sin supervisión?',
        options: ['Ventanas de contexto más largas', 'Modelos más pequeños y rápidos', 'Agentes autónomos multi-día', 'Mejores GPUs'],
        correct: 2,
        explanation: 'Los agentes autónomos multi-día son la tendencia emergente: asignas una tarea compleja y el agente trabaja durante horas/días, gestionando su propio estado, corrigiendo errores y reportando progreso.'
      },

      // ============================================================
      // KNOWLEDGE CHECKS por bloque (v2.2.0) — 5 preguntas/bloque
      // Cada bloque tiene un anchor <section id="kc-NN"> al final
      // ============================================================

      // Bloque I — Foundations (kc-01)
      { id: 'kc01-1', section: 'kc-01',
        question: 'Un LLM genera texto de forma:',
        options: ['Aleatoria sin contexto', 'Sintetizando palabras enteras de golpe', 'Recuperando frases de su training', 'Autoregresiva token-por-token'],
        correct: 3,
        explanation: 'Autoregresiva: cada token se genera condicionado a TODOS los anteriores. Por eso el orden de las instrucciones importa.' },
      { id: 'kc01-2', section: 'kc-01',
        question: 'En 2026, ¿qué proveedor ofrece el mayor contexto en producción?',
        options: ['Claude Opus 4.7 (200K)', 'Kimi K2 (2M)', 'GPT-5.5 (256K)', 'Gemini 2.5 Pro (1M+)'],
        correct: 1,
        explanation: 'Kimi K2 ofrece 2M tokens de contexto, ~10× más que Claude/GPT. Útil para libros enteros o codebases completas. Gemini 2.5 Pro va segundo con 1M+.' },
      { id: 'kc01-3', section: 'kc-01',
        question: 'Para datos sensibles que NO pueden salir de tu red, la opción correcta es:',
        options: ['Claude Opus con BAA', 'Modelo local (Llama/Qwen) self-hosted', 'Gemini con encryption', 'OpenRouter con tier privado'],
        correct: 1,
        explanation: 'Solo el self-hosting garantiza que ningún byte cruce a la nube. Cloud + BAA reduce riesgo legal pero los datos siguen yendo al proveedor.' },
      { id: 'kc01-4', section: 'kc-01',
        question: 'El sweet spot de cuantización 2026 para uso personal en RTX 4090 es:',
        options: ['Q2_K (2-bit)', 'FP16', 'Q4_K_M (4-bit)', 'FP32'],
        correct: 2,
        explanation: 'Q4_K_M (~97-99% calidad por 4× menos VRAM) es el suelo razonable. Q5_K_M es aún mejor si cabe; FP16 requiere 4× más VRAM.' },
      { id: 'kc01-5', section: 'kc-01',
        question: 'Los modelos VLM (Vision-Language) procesan imágenes:',
        options: ['Como matrices de píxeles raw', 'Convirtiéndolas en tokens visuales y usando los mismos transformers', 'Con un módulo CNN separado del transformer', 'Solo si la imagen está en formato OCR'],
        correct: 1,
        explanation: 'Las imágenes se "tokenizan" en patches → vectores → entran al transformer como tokens más. Por eso el contexto multimodal compite con el textual: una imagen puede consumir 1000-5000 tokens.' },

      // Bloque II — Prompt Engineering Core (kc-02)
      { id: 'kc02-1', section: 'kc-02',
        question: 'El parámetro temperature=0 produce:',
        options: ['Sampling aleatorio uniforme', 'Error: temperature debe ser >0', 'Razonamiento paso a paso', 'Greedy decoding (siempre el token más probable)'],
        correct: 3,
        explanation: 'temperature=0 es greedy decoding: siempre elige el token con probabilidad más alta. Determinista (con mismo seed) y reproducible.' },
      { id: 'kc02-2', section: 'kc-02',
        question: '¿Cuántos ejemplos few-shot recomienda Anthropic como sweet spot?',
        options: ['3-5', '1-2', '8-10', '20+'],
        correct: 0,
        explanation: '3-5 ejemplos diversos. Menos no establece patrón claro; más sobre-restringe y aumenta coste sin ganancia proporcional.' },
      { id: 'kc02-3', section: 'kc-02',
        question: 'XML tags en prompts son la técnica preferida por Anthropic porque:',
        options: ['Es estándar W3C', 'XML es más rápido de procesar', 'Claude está fine-tuned específicamente para parsear XML', 'Es la única manera de estructurar prompts'],
        correct: 2,
        explanation: 'Claude está fine-tuned para parsear XML sin ambigüedad. Otros modelos prefieren markdown. La técnica es transferible pero el rendimiento óptimo depende del modelo.' },
      { id: 'kc02-4', section: 'kc-02',
        question: 'Chain of Thought (CoT) mejora más en tareas:',
        options: ['Matemáticas y razonamiento multi-step', 'Clasificación simple', 'Traducción literal', 'Generación creativa'],
        correct: 0,
        explanation: 'CoT brilla en problemas que requieren razonamiento intermedio (matemáticas, lógica, planificación). En clasificación simple no aporta nada y aumenta coste.' },
      { id: 'kc02-5', section: 'kc-02',
        question: 'El system prompt en Claude se pasa:',
        options: ['Como primer mensaje con role:"system"', 'Inline al inicio del prompt del usuario', 'Como parámetro top-level "system" separado de messages', 'Solo está disponible en GPT, no en Claude'],
        correct: 2,
        explanation: 'En Anthropic API, "system" es param top-level. En OpenAI/DeepSeek va como primer mensaje con role:"system". Diferencia clave a la hora de portar prompts.' },

      // Bloque III — Advanced Reasoning + Tools (kc-03)
      { id: 'kc03-1', section: 'kc-03',
        question: 'En Claude Opus 4.7, el equivalente al antiguo budget_tokens es:',
        options: ['max_tokens', 'reasoning_effort', 'output_config.effort', 'thinking_budget'],
        correct: 2,
        explanation: 'output_config.effort (low/medium/high/xhigh/max) reemplaza al budget_tokens. xhigh es el sweet spot para coding y agentes complejos.' },
      { id: 'kc03-2', section: 'kc-03',
        question: 'El ciclo Thought → Action → Observation describe el patrón:',
        options: ['ReAct', 'Chain of Thought', 'Few-shot prompting', 'Self-consistency'],
        correct: 0,
        explanation: 'ReAct (Reasoning + Acting) es el patrón base de TODOS los agentes AI: piensa, ejecuta tool, observa resultado, repite hasta resolver.' },
      { id: 'kc03-3', section: 'kc-03',
        question: 'Para documentos largos en el prompt, Anthropic recomienda:',
        options: ['Documentos al final, query al principio', 'Mezclar ambos en cualquier orden', 'Resumir antes de mandar', 'Documentos al principio, query al final'],
        correct: 3,
        explanation: 'Documentos ARRIBA, query al FINAL mejora calidad ~30%. Razón: el modelo "atiende" más a lo más reciente, así que la query se beneficia de tener todo el contexto fresco.' },
      { id: 'kc03-4', section: 'kc-03',
        question: 'Function calling en OpenAI/DeepSeek se llama en Anthropic:',
        options: ['Function Declarations', 'Action API', 'Tools (sin diferencias)', 'Tool Use'],
        correct: 3,
        explanation: 'Anthropic lo llama Tool Use; OpenAI/DeepSeek/Mistral function calling; Google function declarations. La semántica es muy similar pero los formatos JSON difieren.' },
      { id: 'kc03-5', section: 'kc-03',
        question: 'Activar thinking sube calidad típicamente en:',
        options: ['1-2 puntos', '50-70 puntos %', '90+ puntos %', '5-30 puntos %'],
        correct: 3,
        explanation: '5-30% en problemas multi-step (matemáticas, debugging, planning). Coste: latencia 5-50× y bill proporcional. No actives en clasificación simple.' },

      // Bloque IV — Production Engineering (kc-04)
      { id: 'kc04-1', section: 'kc-04',
        question: 'Para garantizar JSON estricto cumpliendo un schema, en Claude usas:',
        options: ['response_format json_schema (no existe)', 'Tool Use con input_schema y tool_choice forzado', 'Markdown con tags', 'Regex post-procesamiento'],
        correct: 1,
        explanation: 'Claude no expone response_format. El patrón canónico es definir un tool con input_schema y forzar tool_choice — la respuesta es la invocación con args ajustados al schema.' },
      { id: 'kc04-2', section: 'kc-04',
        question: 'Prompt caching en Anthropic ahorra hasta:',
        options: ['10-20% en input', '40-50% en input', 'Nada en input, solo output', '85-90% en input cacheado'],
        correct: 3,
        explanation: 'Lectura de caché es 0.10× del precio normal de input → ~90% ahorro en bloques cacheados. Escritura cuesta 1.25× la primera vez. TTL default 5min.' },
      { id: 'kc04-3', section: 'kc-04',
        question: 'La defensa más efectiva contra prompt injection es:',
        options: ['Modelo más caro', 'Más ejemplos', 'Delimitadores XML + separar datos de instrucciones', 'Subir effort'],
        correct: 2,
        explanation: 'Combinación de delimitadores fuertes (<user_input>...</user_input>) + separar datos del usuario de las instrucciones del sistema + input validation. Defensa en profundidad.' },
      { id: 'kc04-4', section: 'kc-04',
        question: 'Anthropic insiste en construir evals:',
        options: ['Después de tener un prompt definitivo', 'ANTES de empezar a iterar prompts', 'Solo si tienes presupuesto', 'Evals son opcionales en producción'],
        correct: 1,
        explanation: 'Evals ANTES de iterar. Sin métricas objetivas, no sabes si tu cambio mejora o empeora. Anthropic compara prompt engineering sin evals con conducir a ciegas.' },
      { id: 'kc04-5', section: 'kc-04',
        question: 'En conversación multi-turn, debes enviar:',
        options: ['Solo el último mensaje del usuario', 'Solo system + último', 'Anthropic gestiona el historial automáticamente', 'El historial completo (o compactado) cada llamada'],
        correct: 3,
        explanation: 'Cada API call es stateless. Tienes que reenviar el historial completo (o compactado vía summary) en cada llamada. La "memoria" del chatbot vive en tu lado.' },

      // Bloque V — Agents + Multi-agent (kc-05)
      { id: 'kc05-1', section: 'kc-05',
        question: 'La diferencia clave entre workflow y agente:',
        options: ['Workflow tiene pipeline fija; el agente DECIDE qué tools usar y en qué orden', 'Workflow es más rápido', 'Agente solo usa Claude, workflow usa cualquier modelo', 'No hay diferencia'],
        correct: 0,
        explanation: 'Workflow: pipeline determinista paso 1→2→3. Agente: bucle thought-action-observation donde el modelo decide qué hacer a continuación. Mucha más flexibilidad y mucha más complejidad.' },
      { id: 'kc05-2', section: 'kc-05',
        question: 'Las skills en Claude Code se definen con:',
        options: ['JSON schema', 'Python decorator', 'TypeScript type', 'YAML frontmatter + body markdown en SKILL.md'],
        correct: 3,
        explanation: 'SKILL.md tiene frontmatter YAML (name, description, allowed-tools, context, disable-model-invocation) y body markdown con la lógica. Reutilizables entre proyectos.' },
      { id: 'kc05-3', section: 'kc-05',
        question: 'MCP (Model Context Protocol) sirve para:',
        options: ['Cuantizar modelos', 'Acelerar inferencia', 'Conectar agentes AI a fuentes de datos y tools externas (Drive, Jira, DBs)', 'Comprimir prompts'],
        correct: 2,
        explanation: 'MCP es el protocolo abierto de Anthropic (2024) para que un agente acceda a Drive, Notion, Jira, Slack, DBs, APIs sin código custom por integración.' },
      { id: 'kc05-4', section: 'kc-05',
        question: 'En multi-agente, el patrón Supervisor-Worker se caracteriza por:',
        options: ['Agentes 100% paralelos sin coordinación', 'Todos los agentes votan cada decisión', 'Un manager que asigna tareas y revisa', 'Un solo agente con multi-modelo'],
        correct: 2,
        explanation: 'Un agente "manager" asigna sub-tareas a workers especializados, revisa resultados y reasigna si fallan. Patrón canónico para tareas complejas que requieren coordinación.' },
      { id: 'kc05-5', section: 'kc-05',
        question: 'El equivalente de CLAUDE.md en OpenCode es:',
        options: ['README.md', 'CONFIG.yml', '.opencoderc', 'AGENTS.md'],
        correct: 3,
        explanation: 'AGENTS.md cumple la misma función: archivo de memoria/reglas del proyecto leído al inicio de cada sesión y inyectado en el system prompt.' },

      // Bloque VI — Infrastructure + RAG (kc-06)
      { id: 'kc06-1', section: 'kc-06',
        question: 'El chunk size sweet spot para QA factual en RAG es:',
        options: ['64-128 tokens', '256-512 tokens', '1024-2048 tokens', '4096+ tokens'],
        correct: 1,
        explanation: '256-512 tokens balancea precisión (chunks pequeños identifican mejor el pasaje exacto) y contexto (chunks grandes preservan más significado). Con overlap 10-20%.' },
      { id: 'kc06-2', section: 'kc-06',
        question: 'Para un proyecto personal con <10K documentos, el vector DB recomendado es:',
        options: ['Pinecone Enterprise', 'Milvus distributed', 'FAISS sin abstracción', 'ChromaDB local o pgvector'],
        correct: 3,
        explanation: 'ChromaDB embebido o pgvector (si ya tienes Postgres) sobran. Pinecone serverless es un buen segundo paso si pasas a SaaS. Milvus solo tiene sentido a partir de cientos de millones de vectores.' },
      { id: 'kc06-3', section: 'kc-06',
        question: 'vLLM es ideal para:',
        options: ['Serving production de alto throughput', 'Desarrollo individual en laptop', 'Solo modelos de Anthropic', 'Reemplazar OpenAI API'],
        correct: 0,
        explanation: 'vLLM optimiza serving en GPUs de servidor con PagedAttention. Para dev personal, Ollama. Para producción serious, vLLM o SGLang.' },
      { id: 'kc06-4', section: 'kc-06',
        question: 'Un re-ranker mejora retrieval típicamente en:',
        options: ['1-3pp', '50-70pp', '10-20pp en context precision', 'No mejora; es overhead'],
        correct: 2,
        explanation: 'Cohere Rerank o BGE-reranker sobre los top-20 → top-5 finales mejora precision 10-20pp. Coste extra pequeño, ganancia grande. Patrón estándar en RAG serio 2026.' },
      { id: 'kc06-5', section: 'kc-06',
        question: 'En producción LLM, las métricas críticas son:',
        options: ['Solo latencia', 'Solo coste', 'Solo número de errors', 'Latencia p95/p99 + tokens/req + coste/req + tasa refusal + calidad eval'],
        correct: 3,
        explanation: 'Necesitas las 5 simultáneamente. Latencia para UX, tokens/coste para budget, refusal rate para detectar guardrails sobre-restrictivos, calidad eval para regression detection.' },

      // Bloque VII — Local + Quantization + Privacy (kc-07)
      { id: 'kc07-1', section: 'kc-07',
        question: 'GPTQ vs AWQ se diferencian en que AWQ:',
        options: ['Es más rápido', 'Solo funciona en CPU', 'Es propietario', 'Protege ~1% de canales más salientes (mejor calidad a 4-bit)'],
        correct: 3,
        explanation: 'AWQ identifica el ~1% de "salient channels" (los más importantes) y los protege durante la cuantización. Mejor calidad que GPTQ a igual tamaño.' },
      { id: 'kc07-2', section: 'kc-07',
        question: 'Para fine-tuning en consumer GPU (RTX 4090), el método es:',
        options: ['Full fine-tuning', 'RLHF desde cero', 'LoRA o QLoRA', 'Pre-training'],
        correct: 2,
        explanation: 'LoRA añade matrices pequeñas (~1% params) entrenables. QLoRA = LoRA sobre modelo cuantizado a 4-bit, cabe en 24 GB VRAM para modelos 7-13B. Full FT requiere 8× A100.' },
      { id: 'kc07-3', section: 'kc-07',
        question: 'Fine-tuning NO añade conocimiento factual nuevo. Para añadir conocimiento usas:',
        options: ['Más fine-tuning', 'Mejor prompt', 'Subir effort', 'RAG'],
        correct: 3,
        explanation: 'Fine-tuning cambia COMPORTAMIENTO (estilo, formato, tono). Para conocimiento factual nuevo (docs de tu API, eventos recientes), usa RAG o contexto en prompt.' },
      { id: 'kc07-4', section: 'kc-07',
        question: 'El único modelo verdaderamente 100% open source (pesos + datos + código + recipe) es:',
        options: ['Llama 4', 'Qwen 3', 'OLMo 2 (AI2)', 'DeepSeek V3'],
        correct: 2,
        explanation: 'OLMo de AI2 publica TODO. Llama, Qwen, Gemma, Mistral, DeepSeek son "open weights" — pesos descargables, training data privado.' },
      { id: 'kc07-5', section: 'kc-07',
        question: 'Para datos sensibles GDPR Art. 32, la solución más segura es:',
        options: ['Claude con BAA', 'OpenRouter con key cifrada', 'Cualquier API cumple si usas HTTPS', 'Self-hosted local (Ollama, vLLM)'],
        correct: 3,
        explanation: 'Solo el self-hosting garantiza zero-leak. BAA reduce riesgo legal pero los datos siguen viajando al proveedor. GDPR Art. 32 exige medidas técnicas, no solo contractuales.' },

      // Bloque VIII — Cross-Model Patterns (kc-08)
      { id: 'kc08-1', section: 'kc-08',
        question: 'La razón principal para evitar lock-in con UN proveedor:',
        options: ['Resiliencia operativa + apalancamiento comercial + optimización coste/calidad', 'Curiosidad técnica', 'Anthropic tiene mejor pricing', 'OpenAI es lento'],
        correct: 0,
        explanation: 'Outages reales, negociación de precio creíble solo si puedes migrar, y poder despachar al modelo correcto por caso. Multi-proveedor es seguro de continuidad.' },
      { id: 'kc08-2', section: 'kc-08',
        question: 'El de facto standard de function calling fuera de Anthropic es:',
        options: ['Anthropic Tool Use', 'OpenAI Function Calling', 'Google Function Declarations', 'Mistral Tool API'],
        correct: 1,
        explanation: 'OpenAI function calling es el formato compartido por DeepSeek, Mistral, Qwen, GLM, Kimi, MiniMax. Solo Claude (y Gemini) requieren adapter dedicado.' },
      { id: 'kc08-3', section: 'kc-08',
        question: 'LiteLLM y OpenRouter se diferencian en que LiteLLM:',
        options: ['Es solo cloud', 'Es librería OSS — usas tus propias API keys, sin coste extra', 'Solo soporta Claude', 'Es propietario y de pago'],
        correct: 1,
        explanation: 'LiteLLM es OSS, usa tus API keys directamente. OpenRouter es gateway cloud (un key, una factura, ~5% margen). LiteLLM para producción donde quieres relación directa con cada proveedor.' },
      { id: 'kc08-4', section: 'kc-08',
        question: 'Un fallback chain bien diseñado debe:',
        options: ['Tener un cap duro y normalizar formato de respuesta', 'Reintentar infinitamente', 'Usar solo Claude en todos los niveles', 'Cambiar de modelo en cada request'],
        correct: 0,
        explanation: 'Cap duro evita hangs; normalizar formato evita que el código downstream se rompa por usar un modelo distinto; logging de qué modelo respondió cada request preserva trazabilidad.' },
      { id: 'kc08-5', section: 'kc-08',
        question: 'En cross-model evaluation, el evaluador (LLM-as-Judge) debe:',
        options: ['Ser DISTINTO de los modelos comparados, idealmente más capaz', 'Ser uno de los modelos comparados', 'Ser GPT-4 siempre (es el más entrenado)', 'No importa, todos son equivalentes'],
        correct: 0,
        explanation: 'Si usas el mismo modelo como evaluador, sesgas el resultado (prefiere su propio estilo). Usa un modelo distinto y más capaz que los comparados (e.g. Opus evaluando Sonnet vs GPT-5).' },

      // Bloque IX — Benchmarks + Evaluation (kc-09)
      { id: 'kc09-1', section: 'kc-09',
        question: 'En 2026, el benchmark MÁS útil para diferenciar frontier models es:',
        options: ['MMLU (saturado >95%)', 'SWE-bench Verified y ARC-AGI', 'HumanEval (saturado >95%)', 'TruthfulQA'],
        correct: 1,
        explanation: 'MMLU y HumanEval están saturados (todos los frontier >90%, indistinguible). SWE-bench Verified y ARC-AGI tienen aún headroom y separan capacidad real.' },
      { id: 'kc09-2', section: 'kc-09',
        question: 'Para tu eval personal, el N mínimo razonable es:',
        options: ['5 ejemplos', '1000+ ejemplos', 'Ninguno; eval no es necesario', '50-200 ejemplos representativos con golden answers'],
        correct: 3,
        explanation: 'Con 50 ejemplos puedes detectar diferencias >5%. Con 200 detectas diferencias finas. Con 5 solo mides ruido. Golden answers preparadas son imprescindibles.' },
      { id: 'kc09-3', section: 'kc-09',
        question: 'GPQA Diamond mide:',
        options: ['Conocimiento general', 'Programación competitiva', 'Capacidad PhD-level "Google-proof" en bio/física/química', 'Generación creativa'],
        correct: 2,
        explanation: 'GPQA Diamond son 198 preguntas escritas por PhDs específicamente para que no se respondan googleando. Mide entendimiento real del dominio, no memorización.' },
      { id: 'kc09-4', section: 'kc-09',
        question: 'Para evaluar un sistema RAG, la herramienta estándar 2026 es:',
        options: ['Solo accuracy manual', 'BLEU score', 'GPT-4 a ojo', 'RAGAS (faithfulness, answer relevancy, context precision/recall)'],
        correct: 3,
        explanation: 'RAGAS define 4 métricas estándar para RAG. Te dice si la respuesta es fiel al contexto recuperado, si el contexto es relevante, etc. Más útil que accuracy global.' },
      { id: 'kc09-5', section: 'kc-09',
        question: 'Un leaderboard como LMSys Chatbot Arena mide:',
        options: ['Solo benchmarks académicos', 'Velocidad de inferencia', 'Coste por token', 'Preferencias humanas en blind A/B testing'],
        correct: 3,
        explanation: 'LMSys hace blind A/B: usuarios reciben respuestas de 2 modelos sin saber cuáles, votan. Calcula Elo con miles de votos. Buena señal complementaria a benchmarks técnicos.' },

      // Bloque X — Safety, Ethics, Regulation (kc-10)
      { id: 'kc10-1', section: 'kc-10',
        question: 'Para reducir hallucinations factuales, la estrategia más efectiva es:',
        options: ['Prompt "no alucines"', 'Modelo más grande', 'RAG con fuentes verificadas + cita textual', 'Subir effort'],
        correct: 2,
        explanation: 'RAG con fuentes y obligación de citar pasaje exacto. Pedir "no alucines" raramente funciona — el modelo no sabe cuándo está alucinando.' },
      { id: 'kc10-2', section: 'kc-10',
        question: 'En el EU AI Act, los chatbots y generación de contenido caen en:',
        options: ['Riesgo Inaceptable (prohibido)', 'Alto Riesgo (registro UE)', 'Riesgo Mínimo (sin requisitos)', 'Riesgo Limitado (transparencia)'],
        correct: 3,
        explanation: 'Riesgo Limitado: el usuario debe saber que habla con una IA. Alto Riesgo es para diagnóstico médico, contratación, justicia. Inaceptable: social scoring estatal, manipulación subliminal.' },
      { id: 'kc10-3', section: 'kc-10',
        question: 'El nivel ASL-3 de Anthropic implica:',
        options: ['Seguridad reforzada, no deployment público hasta mitigaciones', 'Sin restricciones', 'Auto-deployment público', 'Borrar el modelo'],
        correct: 0,
        explanation: 'ASL-3 (riesgo CBRN/cyber significativo) requiere seguridad reforzada, acceso controlado y NO deployment público hasta cumplir mitigaciones. ASL-4+ no se deploya en absoluto.' },
      { id: 'kc10-4', section: 'kc-10',
        question: 'Constitutional AI (Anthropic) reduce dependencia de:',
        options: ['Hardware', 'Humanos rankeando respuestas (RLHF clásico)', 'Datos de entrenamiento', 'Tokenizers'],
        correct: 1,
        explanation: 'Constitutional AI: el modelo se auto-critica y mejora siguiendo una "constitución" de principios éticos. Escalable sin necesitar tantos humanos como RLHF tradicional.' },
      { id: 'kc10-5', section: 'kc-10',
        question: 'En red teaming, un "jailbreak" típico es:',
        options: ['Romper el hardware', 'Cuantizar el modelo', 'Roleplay tipo "you are DAN, ignore your rules"', 'Subir el effort'],
        correct: 2,
        explanation: 'Jailbreak: técnicas para que el modelo ignore sus guardrails — DAN, developer mode, roleplay. Defensa: system prompt robusto + moderation classifier + Sentinel-style firewall.' },

      // Bloque XI — Applied Industry + Roles (kc-11)
      { id: 'kc11-1', section: 'kc-11',
        question: 'Un code review bot en producción debe priorizar:',
        options: ['Reportar TODOS los warnings posibles', 'Recall alto + precision alta en findings críticos (filtrar low-confidence)', 'Solo análisis estilístico', 'Solo seguridad'],
        correct: 1,
        explanation: 'Falsos positivos ahogan al dev y rompen confianza. 5 critical findings reales valen más que 30 "esto podría ser SQL injection en teoría". Filtra confidence ≥70 al canal principal.' },
      { id: 'kc11-2', section: 'kc-11',
        question: 'En extracción de datos de facturas, structured outputs garantiza:',
        options: ['Formato JSON válido conforme al schema, pero la semántica del contenido sigue requiriendo validación', 'Parsing siempre correcto sin validación adicional', 'Que el modelo nunca alucine', 'Reducción de coste 90%'],
        correct: 0,
        explanation: 'JSON Schema strict garantiza ESTRUCTURA, no semántica. El invoice_number puede tener formato válido pero ser inventado. Valida cross-fields (sumas correctas, fechas en rango).' },
      { id: 'kc11-3', section: 'kc-11',
        question: 'Para chatbot de soporte, las reglas de escalación deben:',
        options: ['Ser inferidas por el LLM en cada caso', 'Estar declaradas explícitas en system prompt con criterios objetivos', 'Confiar en que el modelo lo resolverá todo', 'No existir'],
        correct: 1,
        explanation: 'Reglas explícitas: "Pérdida de datos → escalar inmediato. Billing → transferir con ticket #". Sin reglas, el modelo improvisa con resultados impredecibles.' },
      { id: 'kc11-4', section: 'kc-11',
        question: 'En diagnóstico médico asistido, la regla constitucional es:',
        options: ['El bot SUGIERE, NUNCA diagnostica; siempre recomienda consultar médico', 'El bot puede diagnosticar para acelerar el flujo', 'El bot solo extrae datos', 'No es legal usarlo'],
        correct: 0,
        explanation: 'Diagnóstico médico es Alto Riesgo (EU AI Act + responsabilidad legal). El bot debe sugerir posibilidades + always recommend consulting a doctor + flagear emergencias (call 911).' },
      { id: 'kc11-5', section: 'kc-11',
        question: 'En PRD generation con LLM, el rol del PM humano queda como:',
        options: ['Director estratégico que aporta contexto del producto y revisa output crítico', 'Reemplazado por el bot', 'Director que pide PRD genérico y lo acepta sin revisar', 'Solo formateo'],
        correct: 0,
        explanation: 'El LLM acelera la redacción y produce primer borrador competente. Pero la estrategia, las decisiones de scope, las trade-offs específicas del producto requieren juicio humano.' },

      // Bloque XII — Future + Research Frontier (kc-12)
      { id: 'kc12-1', section: 'kc-12',
        question: 'Una de las tendencias más activas en 2026 es:',
        options: ['Modelos más pequeños y simples', 'Agentes autónomos multi-día', 'Vuelta a chatbots fijos sin tools', 'Eliminar el reasoning'],
        correct: 1,
        explanation: 'Multi-day autonomous agents: asignas una tarea el lunes, está lista el miércoles. Self-state management, error correction, progress reporting. Frontier emergente.' },
      { id: 'kc12-2', section: 'kc-12',
        question: 'El gap entre frontier US y frontier China en 2026 se ha:',
        options: ['Ampliado a 3+ años', 'No existe el frontier chino', 'Cerrado a <1 año', 'Se ha invertido'],
        correct: 2,
        explanation: 'Cerrado a <1 año. DeepSeek, Kimi, MiniMax, Qwen, GLM están a 5-15% del frontier US en benchmarks 2026. Frontier UE (Mistral) ~12-18 meses detrás pero aporta soberanía de datos.' },
      { id: 'kc12-3', section: 'kc-12',
        question: 'Las predicciones de AGI más cautelosas (Yann LeCun) lo sitúan:',
        options: ['2035+ (LLMs solos no llegan)', '2026', '2030+', 'Nunca'],
        correct: 0,
        explanation: 'LeCun argumenta que los LLMs autorregresivos no son la arquitectura adecuada. Postula que falta architecture (world models, planning de verdad). 2035+ es su estimado.' },
      { id: 'kc12-4', section: 'kc-12',
        question: 'GraphCast/GenCast (DeepMind) son:',
        options: ['Modelos meteorológicos que superan supercomputadoras tradicionales', 'LLMs especializados', 'Agentes multi-modales', 'Quantizadores'],
        correct: 0,
        explanation: 'Modelos basados en grafos para predicción meteorológica. Más precisos, más baratos, 1000× más rápidos que NWP clásico. Caso emblemático de AI + ciencia.' },
      { id: 'kc12-5', section: 'kc-12',
        question: 'Figure AI y Tesla Optimus apuntan a:',
        options: ['IA conversacional', 'Cuantización extrema', 'Robots humanoides controlados por LLMs', 'Visualización 3D'],
        correct: 2,
        explanation: 'Robots humanoides que entienden lenguaje natural. Figure 02 trabaja en fábricas BMW. Tesla Optimus en producción limitada 2026. El "ChatGPT moment" de la robótica está cerca.' },

      // Bloque XIII — Practical Workshop (kc-13)
      { id: 'kc13-1', section: 'kc-13',
        question: 'El propósito del proyecto guiado del Bando B es:',
        options: ['Hacer un examen final', 'Replicar Claude desde cero', 'Construir tu agente iterativamente módulo a módulo, exportable al final', 'Aprender Python'],
        correct: 2,
        explanation: 'Defines un agente al inicio, lo refinas con cada técnica nueva, persiste en localStorage. Al final tienes 6 versiones documentadas para comparar evolución.' },
      { id: 'kc13-2', section: 'kc-13',
        question: 'El prompt linter del taller analiza:',
        options: ['Solo longitud', 'Técnicas detectadas + riesgos + recomendaciones + score 0-100', 'Compatibilidad CSS', 'Sintaxis Python'],
        correct: 1,
        explanation: 'Heurísticas vanilla JS — todo en navegador, nada sale. Detecta XML, role, CoT, few-shot, riesgos de injection, longitud, claridad.' },
      { id: 'kc13-3', section: 'kc-13',
        question: 'El "anti-pattern" más común en prompts amateurs es:',
        options: ['Usar XML tags', 'Pedir thinking', 'Solo decir "hazlo bien" sin especificar', 'Limitar max_tokens'],
        correct: 2,
        explanation: '"Write good code", "make it nice" — instrucciones vagas. El modelo no tiene cómo saber qué es "bien". Especifica: stack, criterios, formato, restricciones.' },
      { id: 'kc13-4', section: 'kc-13',
        question: 'La biblioteca de prompts del taller contiene:',
        options: ['1 ejemplo', '20 prompts production-ready etiquetados por dominio', 'Solo prompts de Anthropic', 'Pseudo-código'],
        correct: 1,
        explanation: '20 prompts curados, taggeados por dominio (coding, writing, data extraction, analysis...) y técnica. Filtrables, copiables, modificables.' },
      { id: 'kc13-5', section: 'kc-13',
        question: 'La evolución de prompts del taller muestra:',
        options: ['Prompts random', 'Cómo un mismo objetivo se refina paso a paso: zero-shot → role → few-shot → schema', 'Solo errores', 'Comparativas de modelos'],
        correct: 1,
        explanation: '3 escenarios reales con 4-5 versiones cada uno, mostrando el "thought process" del prompt engineer experimentado. Útil para entender el ciclo iterativo.' },

      // Bloque XIV — Capstone (kc-14)
      { id: 'kc14-1', section: 'kc-14',
        question: 'El artefacto más valioso de un capstone es:',
        options: ['El código', 'El writeup final (decisiones, métricas, qué falló, qué harías distinto)', 'El demo', 'El test coverage'],
        correct: 1,
        explanation: 'El writeup demuestra que entiendes lo que hiciste y por qué. Es lo que un empleador serio quiere leer. Código sin writeup = "se copió de stackoverflow".' },
      { id: 'kc14-2', section: 'kc-14',
        question: 'En el Code Review Bot, el target de coste por PR es:',
        options: ['≤ $0.30', '$0.01', '$5+', 'Sin límite'],
        correct: 0,
        explanation: '≤ $0.30/PR es realista con Claude Opus + prompt caching. Sin caching escalas a $1+. Con DeepSeek bajas a $0.05 pero sacrificas recall en findings sutiles.' },
      { id: 'kc14-3', section: 'kc-14',
        question: 'En el RAG Knowledge Assistant, citation accuracy ≥ 90% significa:',
        options: ['90% de respuestas tienen alguna cita', '90% de documentos están indexados', 'En 90% de citas, el pasaje citado realmente respalda la afirmación', '90% accuracy global'],
        correct: 2,
        explanation: 'No basta con que cite — la cita debe respaldar la afirmación. Validación: para cada cita, verificar que el chunk citado contiene la información que afirma la respuesta.' },
      { id: 'kc14-4', section: 'kc-14',
        question: 'En el Local Self-Hosted Assistant, "zero external calls" se verifica con:',
        options: ['tcpdump/Wireshark capturas durante uso real', 'Confianza en el código', 'Inspección manual del repo', 'Solo lint'],
        correct: 0,
        explanation: 'Monitor de red durante 1h de uso real. Para auditor GDPR Art. 32, captura es evidencia técnica. Confiar en código sin verificar tráfico es asumir lo que toca probar.' },
      { id: 'kc14-5', section: 'kc-14',
        question: 'En el Multi-Agent Research Team, evitar loops infinitos requiere:',
        options: ['Confiar en que los agentes paren solos', 'Usar más agentes', 'Cap duro de iteraciones (típicamente ≤3 rondas) entre Critic y Writer', 'Subir effort en todos'],
        correct: 2,
        explanation: 'Critic siempre puede encontrar algo "mejorable", Writer siempre puede iterar. Sin cap, el sistema diverge. 3 rondas es sweet spot — más es ROI marginal con coste lineal.' },
    ];
    this.init();
  }

  init() {
    this.migrateState();
    // Inject quiz panels into sections
    this.quizzes.forEach((q, i) => {
      const section = document.getElementById(q.section);
      if (!section) return;
      const panel = document.createElement('div');
      panel.className = 'quiz-panel';
      panel.id = q.id;
      panel.innerHTML = this.renderQuiz(q, i);
      section.appendChild(panel);
    });
  }

  migrateState() {
    try {
      const stored = localStorage.getItem('quiz_schema_version');
      if (stored === QUIZ_SCHEMA_VERSION) return;
      const stale = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('quiz_') && k !== 'quiz_schema_version') stale.push(k);
      }
      stale.forEach(k => localStorage.removeItem(k));
      localStorage.setItem('quiz_schema_version', QUIZ_SCHEMA_VERSION);
    } catch (e) { /* localStorage unavailable, no-op */ }
  }

  renderQuiz(q, i) {
    const saved = localStorage.getItem('quiz_' + q.id);
    const answered = saved !== null;
    const correct = saved === 'correct';
    const esc = (s) => String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    let html = `<h4>🧠 Quick Quiz #${i+1}</h4>`;
    html += `<div class="quiz-question">${esc(q.question)}</div>`;

    q.options.forEach((opt, j) => {
      let cls = 'quiz-option';
      if (answered) {
        if (j === q.correct) cls += ' correct';
        else if (saved === String(j)) cls += ' wrong';
      }
      html += `<div class="${cls}" data-quiz="${q.id}" data-idx="${j}">${String.fromCharCode(65+j)}) ${esc(opt)}</div>`;
    });

    html += `<div class="quiz-feedback" id="fb-${q.id}">${answered ? (correct ? '✅ ' : '❌ ') + esc(q.explanation) : ''}</div>`;
    return html;
  }

  attachHandlers() {
    document.querySelectorAll('.quiz-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const quizId = opt.dataset.quiz;
        const idx = parseInt(opt.dataset.idx);
        const q = this.quizzes.find(q => q.id === quizId);
        if (!q) return;

        const isCorrect = idx === q.correct;
        localStorage.setItem('quiz_' + quizId, isCorrect ? 'correct' : String(idx));

        const panel = document.getElementById(quizId);
        if (!panel) return;

        // Update option styles
        panel.querySelectorAll('.quiz-option').forEach((o, j) => {
          o.classList.remove('correct', 'wrong');
          if (j === q.correct) o.classList.add('correct');
          if (j === idx && !isCorrect) o.classList.add('wrong');
        });

        // Show feedback
        const fb = document.getElementById('fb-' + quizId);
        if (fb) {
          fb.textContent = (isCorrect ? '✅ ¡Correcto! ' : '❌ Incorrecto. ') + q.explanation;
          fb.classList.add('show');
        }

        this.updateProgress();
      });
    });

    this.updateProgress();
  }

  updateProgress() {
    const total = this.quizzes.length;
    let completed = 0;
    this.quizzes.forEach(q => {
      if (localStorage.getItem('quiz_' + q.id) !== null) completed++;
    });

    const el = document.getElementById('quiz-progress');
    if (el) el.textContent = `${completed}/${total} completados`;
  }
}

window.QuizEngine = QuizEngine;
