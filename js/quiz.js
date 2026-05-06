/* ============================================================
   Quiz System — Multiple choice with scoring & progress
   ============================================================ */
class QuizEngine {
  constructor() {
    this.currentQuiz = 0;
    this.answers = {};
    this.quizzes = [
      {
        id: 'quiz1', section: 's5',
        question: '¿Qué parámetro controla cuánto "piensa" Claude Opus 4.7?',
        options: ['temperature', 'effort', 'top_p', 'max_tokens'],
        correct: 1,
        explanation: 'El parámetro `effort` (low→medium→high→xhigh→max) controla cuánto razonamiento interno usa Claude Opus 4.7. Reemplaza al antiguo `budget_tokens` del extended thinking.'
      },
      {
        id: 'quiz2', section: 's7',
        question: '¿Cuántos ejemplos se recomiendan para few-shot prompting efectivo?',
        options: ['1-2 ejemplos', '3-5 ejemplos', '8-10 ejemplos', '20+ ejemplos'],
        correct: 1,
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
        options: ['.claude/skills/', '~/.claude/skills/<name>/SKILL.md', '/etc/claude/skills/', 'project/skills.md'],
        correct: 1,
        explanation: 'Las skills personales van en `~/.claude/skills/<name>/SKILL.md` y están disponibles en todos tus proyectos. Las de proyecto van en `.claude/skills/`.'
      },
      {
        id: 'quiz5', section: 's16',
        question: '¿Cuál es la diferencia principal entre un sub-agente y una skill con `context: fork`?',
        options: [
          'No hay diferencia',
          'El sub-agente se define en .claude/agents/, la skill en .claude/skills/',
          'El sub-agente usa otro modelo',
          'La skill es más rápida'
        ],
        correct: 1,
        explanation: 'Ambos ejecutan en contexto aislado, pero los sub-agentes se definen en `.claude/agents/` con su propio prompt, mientras las skills con `context: fork` usan SKILL.md como prompt del sub-agente.'
      },
      {
        id: 'quiz6', section: 's26',
        question: '¿Qué ventaja principal tiene DeepSeek V4 Pro sobre Claude Opus 4.7?',
        options: ['Mejor razonamiento', 'Más herramientas', 'Coste significativamente menor', 'Computer Use nativo'],
        correct: 2,
        explanation: 'DeepSeek V4 Pro cuesta aproximadamente 1/30 del precio de Claude Opus 4.7 (~$0.50 vs $15 por millón de tokens de input), manteniendo excelente calidad en coding.'
      },
      {
        id: 'quiz7', section: 's19',
        question: '¿Cuál es el equivalente de CLAUDE.md en OpenCode?',
        options: ['README.md', 'AGENTS.md', 'CONFIG.md', 'MEMORY.md'],
        correct: 1,
        explanation: 'AGENTS.md es el equivalente. OpenCode lo lee al inicio de cada sesión e inyecta su contenido en el system prompt. Mismo concepto que CLAUDE.md pero para el ecosistema OpenCode.'
      },
      {
        id: 'quiz8', section: 's14',
        question: '¿Qué patrón describe el ciclo Thought → Action → Observation?',
        options: ['Chain of Thought', 'Few-shot prompting', 'ReAct', 'Tree of Thoughts'],
        correct: 2,
        explanation: 'ReAct (Reasoning + Acting) alterna entre pensamiento, acción (tool call) y observación (resultado). Es el patrón base de todos los agentes AI modernos.'
      },
      {
        id: 'quiz9', section: 's39',
        question: '¿Cuánto puede ahorrar Prompt Caching en llamadas repetitivas?',
        options: ['10-20%', '30-50%', '70-80%', '85-90%'],
        correct: 3,
        explanation: 'Con Prompt Caching, las llamadas repetitivas con el mismo system prompt y documentos pueden ahorrar hasta 85-90% en costes de input tokens.'
      },
      {
        id: 'quiz10', section: 's41',
        question: '¿Cuál es la defensa más efectiva contra prompt injection?',
        options: ['Usar un modelo más caro', 'Delimitadores XML + separar datos de instrucciones', 'Añadir más ejemplos al prompt', 'Subir el effort level'],
        correct: 1,
        explanation: 'Usar delimitadores XML fuertes y separar los datos del usuario de las instrucciones del sistema es la defensa más efectiva. Complementa con moderation API y validación de inputs.'
      },
      {
        id: 'quiz11', section: 's46',
        question: 'Según Anthropic, ¿cuándo deberías considerar fine-tuning en vez de prompt engineering?',
        options: ['Siempre — fine-tuning es mejor', 'Como primer paso en cualquier proyecto', 'Solo cuando has agotado todas las técnicas de prompting', 'Nunca — fine-tuning está obsoleto'],
        correct: 2,
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
        options: ['LangChain', 'Pinecone', 'Ollama', 'Weaviate'],
        correct: 2,
        explanation: 'Ollama permite ejecutar modelos como Llama, Mistral o Gemma localmente con `ollama run llama4`. Ideal para desarrollo sin depender de APIs cloud.'
      },
      {
        id: 'quiz14', section: 's61',
        question: '¿Cuántos ejemplos necesitas MÍNIMO para fine-tuning efectivo con LoRA?',
        options: ['10-50 ejemplos', '100-200 ejemplos', '500-1000 ejemplos', '10000+ ejemplos'],
        correct: 2,
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
        options: ['Pre-training', 'Post-training (SFT/RLHF/DPO)', 'Tokenization', 'Inference'],
        correct: 1,
        explanation: 'El post-training (SFT + RLHF/DPO) es lo que convierte un modelo que solo completa texto en un asistente que sigue instrucciones, es útil y rechaza peticiones dañinas.'
      },
      {
        id: 'quiz17', section: 's76',
        question: '¿Cuál es la mejor estrategia para reducir alucinaciones factuales?',
        options: ['Usar un modelo más grande', 'RAG con fuentes verificadas + citar pasajes exactos', 'Subir el effort level al máximo', 'Añadir "no alucines" al prompt'],
        correct: 1,
        explanation: 'RAG (Retrieval Augmented Generation) con fuentes verificadas y pedir citas textuales es la estrategia más efectiva. Pedir "no alucines" raramente funciona porque el modelo no sabe cuándo está alucinando.'
      },
      {
        id: 'quiz18', section: 's77',
        question: '¿Qué nivel del AI Safety Level de Anthropic permite deployment público sin restricciones?',
        options: ['ASL-1', 'ASL-2', 'ASL-3', 'Todos los niveles'],
        correct: 0,
        explanation: 'ASL-1 es para sistemas sin riesgo catastrófico y permite deployment público. ASL-2 requiere mitigación adicional. ASL-3 y ASL-4 restringen o prohíben el deployment.'
      },
      {
        id: 'quiz19', section: 's79',
        question: '¿Qué patrón multi-agente usa un agente que asigna tareas a workers y revisa resultados?',
        options: ['Debate', 'Pipeline Sequential', 'Supervisor-Worker', 'Consensus'],
        correct: 2,
        explanation: 'El patrón Supervisor-Worker tiene un agente "manager" que asigna tareas, revisa resultados y re-asigna si algo falla. Es ideal para tareas complejas que requieren coordinación.'
      },
      {
        id: 'quiz20', section: 's82',
        question: 'Según el curso, ¿qué porcentaje del código boilerplate pueden manejar los agentes AI en 2026?',
        options: ['10-20%', '30-40%', '60-80%', '95-100%'],
        correct: 2,
        explanation: 'Los agentes modernos (Claude Code, OpenCode) pueden manejar el 60-80% del código boilerplate, tests y refactors. El desarrollador se enfoca en arquitectura, decisiones de diseño y revisión.'
      },
      {
        id: 'quiz21', section: 's88',
        question: '¿Cuál es el "sweet spot" de cuantización para LLMs locales?',
        options: ['FP32 (sin cuantizar)', 'INT8 (8-bit)', 'INT4 (4-bit)', 'INT2 (2-bit)'],
        correct: 2,
        explanation: 'INT4 (4-bit) es el sweet spot: 97-99% de la calidad original por 4x menos memoria. Permite ejecutar modelos de 70B en una sola GPU de consumo. Q4_K_M en GGUF o GPTQ/AWQ.'
      },
      {
        id: 'quiz22', section: 's85',
        question: '¿Qué tendencia permite a los agentes AI operar durante horas o días sin supervisión?',
        options: ['Ventanas de contexto más largas', 'Agentes autónomos multi-día', 'Modelos más pequeños y rápidos', 'Mejores GPUs'],
        correct: 1,
        explanation: 'Los agentes autónomos multi-día son la tendencia emergente: asignas una tarea compleja y el agente trabaja durante horas/días, gestionando su propio estado, corrigiendo errores y reportando progreso.'
      },
    ];
    this.init();
  }

  init() {
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

  renderQuiz(q, i) {
    const saved = localStorage.getItem('quiz_' + q.id);
    const answered = saved !== null;
    const correct = saved === 'correct';

    let html = `<h4>🧠 Quick Quiz #${i+1}</h4>`;
    html += `<div class="quiz-question">${q.question}</div>`;

    q.options.forEach((opt, j) => {
      let cls = 'quiz-option';
      if (answered) {
        if (j === q.correct) cls += ' correct';
        else if (saved === String(j)) cls += ' wrong';
      }
      html += `<div class="${cls}" data-quiz="${q.id}" data-idx="${j}">${String.fromCharCode(65+j)}) ${opt}</div>`;
    });

    html += `<div class="quiz-feedback" id="fb-${q.id}">${answered ? (correct ? '✅ ' : '❌ ') + q.explanation : ''}</div>`;
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
