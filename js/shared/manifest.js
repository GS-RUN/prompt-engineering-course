/* ============================================================
   Course Manifest — academic block structure 2026-05-08
   ============================================================
   The single source of truth for module organisation. The sidebar,
   landing page, and split scripts all consume this manifest.

   `sections` lists section IDs belonging to that module, in display
   order. The split script extracts them from the legacy index.html.
   ============================================================ */

window.COURSE_MANIFEST = {
  version: '2.3.5',
  lastUpdated: '2026-05-08',
  blocks: [
    {
      id: '00',
      slug: '00-orientation',
      title: { es: 'Bloque 0 — Orientación', en: 'Block 0 — Orientation' },
      icon: '🧭',
      level: 'beginner',
      timeMinutes: 20,
      sections: [],     // generated content (no legacy sections)
      objectives: {
        es: [
          'Entender qué es y qué no es este curso.',
          'Conocer los prerrequisitos y cómo recorrerlo.',
          'Configurar el entorno (API + modelo local) en 15 min.'
        ],
        en: [
          'Understand what this course is and isn’t.',
          'Know the prerequisites and how to navigate it.',
          'Set up your environment (API + local model) in 15 min.'
        ]
      }
    },
    {
      id: '01',
      slug: '01-foundations',
      title: { es: 'Bloque I — Fundamentos', en: 'Block I — Foundations' },
      icon: '📖',
      level: 'beginner',
      timeMinutes: 90,
      sections: ['s1', 's55', 's56', 's57', 's58'],
      objectives: {
        es: [
          'Explicar qué es un LLM en términos de tokens y autoregresión.',
          'Distinguir LLM, VLM, embedding model, diffusion, etc.',
          'Decidir entre API cloud vs modelo local con criterios objetivos.',
          'Conocer el panorama de modelos frontier 2026 (US + China + EU).'
        ],
        en: [
          'Explain what an LLM is in terms of tokens and autoregression.',
          'Distinguish LLM, VLM, embedding model, diffusion, etc.',
          'Choose between cloud API and local model with objective criteria.',
          'Know the 2026 frontier model landscape (US + China + EU).'
        ]
      }
    },
    {
      id: '02',
      slug: '02-prompt-core',
      title: { es: 'Bloque II — Prompt Engineering Core', en: 'Block II — Prompt Engineering Core' },
      icon: '🎯',
      level: 'beginner',
      timeMinutes: 180,
      sections: ['s2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's30', 's31', 's32', 's33', 's34', 's35', 's36', 's37'],
      objectives: {
        es: [
          'Estructurar un prompt profesional con identidad, instrucciones, ejemplos, contexto e input.',
          'Aplicar role prompting, few-shot, XML, Chain of Thought y control de formato.',
          'Distinguir cuándo usar zero-shot vs few-shot vs CoT.',
          'Tunear temperature, top_p, max_tokens y demás parámetros con criterio.'
        ],
        en: [
          'Structure a professional prompt with identity, instructions, examples, context and input.',
          'Apply role prompting, few-shot, XML, Chain of Thought and output control.',
          'Decide when to use zero-shot vs few-shot vs CoT.',
          'Tune temperature, top_p, max_tokens and other parameters with judgment.'
        ]
      }
    },
    {
      id: '03',
      slug: '03-advanced-reasoning',
      title: { es: 'Bloque III — Razonamiento avanzado y Tools', en: 'Block III — Advanced Reasoning + Tools' },
      icon: '🧠',
      level: 'intermediate',
      timeMinutes: 150,
      sections: ['s12', 's13', 's14', 's15', 's22', 's23', 's24', 's25', 's44'],
      objectives: {
        es: [
          'Activar y dimensionar reasoning/thinking en cada API frontier.',
          'Diseñar prompt chains y patrones ReAct con tool use.',
          'Trabajar con documentos largos (200K-2M tokens) sin perder calidad.',
          'Construir prompts multimodales (visión, audio, vídeo).'
        ],
        en: [
          'Enable and size reasoning/thinking in every frontier API.',
          'Design prompt chains and ReAct patterns with tool use.',
          'Work with long documents (200K-2M tokens) without losing quality.',
          'Build multimodal prompts (vision, audio, video).'
        ]
      }
    },
    {
      id: '04',
      slug: '04-production',
      title: { es: 'Bloque IV — Producción', en: 'Block IV — Production Engineering' },
      icon: '🏭',
      level: 'intermediate',
      timeMinutes: 200,
      sections: ['s38', 's39', 's40', 's41', 's42', 's43', 's45', 's46', 's47'],
      objectives: {
        es: [
          'Garantizar formato de salida con structured outputs y JSON schema.',
          'Reducir 80-90% el coste con prompt caching.',
          'Construir evals automatizados antes de iterar prompts.',
          'Defender un sistema contra prompt injection y jailbreaks.',
          'Diseñar system prompts robustos y gestionar conversaciones largas.'
        ],
        en: [
          'Guarantee output format with structured outputs and JSON schema.',
          'Cut cost 80-90% with prompt caching.',
          'Build automated evals before iterating on prompts.',
          'Defend a system against prompt injection and jailbreaks.',
          'Design robust system prompts and manage long conversations.'
        ]
      }
    },
    {
      id: '05',
      slug: '05-agents',
      title: { es: 'Bloque V — Agentes y Multi-agente', en: 'Block V — Agents + Multi-agent' },
      icon: '🤖',
      level: 'intermediate',
      timeMinutes: 180,
      sections: ['s16', 's17', 's18', 's19', 's19b', 's20', 's21', 's92', 's79', 's80', 's81'],
      objectives: {
        es: [
          'Distinguir chat, workflow y agente con criterios precisos.',
          'Configurar Skills, sub-agentes y MCP en Claude Code / OpenCode / Codex.',
          'Aplicar patrones multi-agente (debate, supervisor-worker, swarms).',
          'Elegir framework adecuado: CrewAI, AutoGen, LangGraph.'
        ],
        en: [
          'Distinguish chat, workflow and agent with precise criteria.',
          'Configure Skills, sub-agents and MCP in Claude Code / OpenCode / Codex.',
          'Apply multi-agent patterns (debate, supervisor-worker, swarms).',
          'Pick the right framework: CrewAI, AutoGen, LangGraph.'
        ]
      }
    },
    {
      id: '06',
      slug: '06-infrastructure',
      title: { es: 'Bloque VI — Infraestructura y RAG', en: 'Block VI — Infrastructure + RAG deep-dive' },
      icon: '🏗️',
      level: 'intermediate',
      timeMinutes: 150,
      sections: ['s64', 's65', 's66', 's67', 's68'],
      objectives: {
        es: [
          'Diseñar pipeline RAG: chunking + embeddings + vector DB.',
          'Elegir vector DB según escala (Chroma → Pinecone → Milvus).',
          'Servir LLMs en producción (vLLM, TGI, SGLang) con monitoring.',
          'Instrumentar latencia, coste, tasa de refusal y calidad.'
        ],
        en: [
          'Design a RAG pipeline: chunking + embeddings + vector DB.',
          'Pick a vector DB by scale (Chroma → Pinecone → Milvus).',
          'Serve LLMs in production (vLLM, TGI, SGLang) with monitoring.',
          'Instrument latency, cost, refusal rate and quality.'
        ]
      }
    },
    {
      id: '07',
      slug: '07-local-quant',
      title: { es: 'Bloque VII — Modelos locales, cuantización y privacidad', en: 'Block VII — Local Models, Quantization + Privacy' },
      icon: '🔒',
      level: 'advanced',
      timeMinutes: 200,
      sections: ['s88', 's89', 's90', 's59', 's60', 's61', 's62', 's63'],
      objectives: {
        es: [
          'Cuantizar modelos a Q4_K_M / Q5_K_M / AWQ / GPTQ con criterio.',
          'Desplegar local con Ollama / llama.cpp / vLLM / MLX según hardware.',
          'Realizar fine-tuning con SFT, LoRA y QLoRA en consumer-grade GPU.',
          'Cumplir GDPR/CCPA en pipelines on-prem con datos sensibles.'
        ],
        en: [
          'Quantize models to Q4_K_M / Q5_K_M / AWQ / GPTQ with judgment.',
          'Deploy locally with Ollama / llama.cpp / vLLM / MLX per hardware.',
          'Run fine-tuning with SFT, LoRA and QLoRA on consumer GPUs.',
          'Comply with GDPR/CCPA in on-prem pipelines with sensitive data.'
        ]
      }
    },
    {
      id: '08',
      slug: '08-cross-model',
      title: { es: 'Bloque VIII — Patrones cross-model', en: 'Block VIII — Cross-Model Patterns' },
      icon: '🔀',
      level: 'advanced',
      timeMinutes: 60,
      sections: ['s26'],   // frontier comparison anchor
      objectives: {
        es: [
          'Escribir prompts portables entre Claude, GPT, Gemini, DeepSeek, Kimi, Qwen, GLM.',
          'Implementar fallback chains y routing por coste/calidad.',
          'Evaluar la misma tarea en varios modelos (cross-model eval).'
        ],
        en: [
          'Write prompts portable across Claude, GPT, Gemini, DeepSeek, Kimi, Qwen, GLM.',
          'Implement fallback chains and cost/quality routing.',
          'Evaluate the same task across multiple models (cross-model eval).'
        ]
      }
    },
    {
      id: '09',
      slug: '09-benchmarks',
      title: { es: 'Bloque IX — Benchmarks y evaluación', en: 'Block IX — Benchmarks + Evaluation' },
      icon: '📊',
      level: 'intermediate',
      timeMinutes: 90,
      sections: ['s73', 's74', 's75', 's27', 's28', 's29'],
      objectives: {
        es: [
          'Leer un leaderboard sin saturarse (MMLU/HumanEval están saturados).',
          'Construir tu eval: golden dataset, criterios, métricas.',
          'Configurar OpenCode + AGENTS.md para alto volumen.'
        ],
        en: [
          'Read a leaderboard without saturating (MMLU/HumanEval are saturated).',
          'Build your eval: golden dataset, criteria, metrics.',
          'Configure OpenCode + AGENTS.md for high volume.'
        ]
      }
    },
    {
      id: '10',
      slug: '10-safety',
      title: { es: 'Bloque X — Safety, ética y regulación', en: 'Block X — Safety, Ethics, Regulation' },
      icon: '🛡️',
      level: 'intermediate',
      timeMinutes: 90,
      sections: ['s76', 's77', 's78'],
      objectives: {
        es: [
          'Identificar tipos de hallucination y aplicar mitigaciones.',
          'Hacer red teaming básico de un sistema LLM.',
          'Cumplir requisitos del EU AI Act según nivel de riesgo.'
        ],
        en: [
          'Identify hallucination types and apply mitigations.',
          'Do basic red teaming of an LLM system.',
          'Meet EU AI Act requirements per risk tier.'
        ]
      }
    },
    {
      id: '11',
      slug: '11-industry',
      title: { es: 'Bloque XI — Aplicaciones por industria y rol', en: 'Block XI — Applied Industry + Roles' },
      icon: '🏢',
      level: 'intermediate',
      timeMinutes: 200,
      sections: ['s48', 's49', 's50', 's51', 's69', 's70', 's71', 's72', 's82', 's83', 's84'],
      objectives: {
        es: [
          'Implementar code review automatizado, soporte al cliente, extracción de datos y generación de docs.',
          'Adaptar prompts a healthcare, finanzas, legal, gaming, educación, retail.',
          'Diseñar workflows AI según el rol (dev, design, PM, exec).'
        ],
        en: [
          'Implement automated code review, customer support, data extraction and doc generation.',
          'Adapt prompts to healthcare, finance, legal, gaming, education, retail.',
          'Design AI workflows by role (dev, design, PM, exec).'
        ]
      }
    },
    {
      id: '12',
      slug: '12-future',
      title: { es: 'Bloque XII — Futuro y frontera de investigación', en: 'Block XII — Future + Research Frontier' },
      icon: '🔮',
      level: 'reading',
      timeMinutes: 60,
      sections: ['s85', 's86', 's87'],
      objectives: {
        es: [
          'Conocer las tendencias activas (infinite context, agentes multi-día, AI + ciencia).',
          'Anticipar modelos esperados 2026-2030.',
          'Leer críticamente el discurso AGI vs realidad técnica.'
        ],
        en: [
          'Know active trends (infinite context, multi-day agents, AI + science).',
          'Anticipate expected models 2026-2030.',
          'Critically read the AGI discourse vs technical reality.'
        ]
      }
    },
    {
      id: '13',
      slug: '13-workshop',
      title: { es: 'Bloque XIII — Taller práctico', en: 'Block XIII — Practical Workshop' },
      icon: '🛠️',
      level: 'all',
      timeMinutes: 180,
      sections: ['proj', 'linter', 'library', 'evolution', 'antipatterns', 'cheatsheet'],
      objectives: {
        es: [
          'Construir tu agente personalizado iterativamente a lo largo del curso.',
          'Auditar tus prompts con el linter automático.',
          'Aplicar la biblioteca de 20 prompts production-ready.',
          'Reconocer y evitar 10 anti-patrones comunes.'
        ],
        en: [
          'Build your personalised agent iteratively across the course.',
          'Audit your prompts with the automatic linter.',
          'Apply the library of 20 production-ready prompts.',
          'Recognise and avoid 10 common anti-patterns.'
        ]
      }
    },
    {
      id: '14',
      slug: '14-capstone',
      title: { es: 'Bloque XIV — Proyectos capstone', en: 'Block XIV — Capstone Projects' },
      icon: '🎓',
      level: 'capstone',
      timeMinutes: 600,
      sections: [],   // hand-written content (no legacy sections)
      objectives: {
        es: [
          'Construir 4 proyectos end-to-end con specs reales, criterios de aceptación y rúbricas.',
          'Producir artefactos portfolio: starter repo + writeup + métricas reales.',
          'Cerrar el ciclo aprendizaje → producción aplicando todo lo de los Bloques I-XIII.'
        ],
        en: [
          'Build 4 end-to-end projects with real specs, acceptance criteria and rubrics.',
          'Produce portfolio artefacts: starter repo + writeup + real metrics.',
          'Close the learning → production loop applying everything from Blocks I-XIII.'
        ]
      }
    },
    {
      id: 'tools',
      slug: 'tools',
      title: { es: 'Herramientas', en: 'Tools' },
      icon: '🧰',
      level: 'all',
      timeMinutes: 30,
      sections: ['s52', 's53', 's54'],
      objectives: {
        es: [
          'Estimar tokens y coste por modelo.',
          'Comparar dos prompts con scoring multi-criterio.'
        ],
        en: [
          'Estimate tokens and cost per model.',
          'Compare two prompts with multi-criteria scoring.'
        ]
      }
    },
    {
      id: 'glossary',
      slug: 'glossary',
      title: { es: 'Glosario', en: 'Glossary' },
      icon: '📚',
      level: 'reference',
      timeMinutes: 0,
      sections: [],
      objectives: {
        es: ['Buscar cualquier término técnico del curso.'],
        en: ['Look up any technical term used in the course.']
      }
    }
  ]
};
