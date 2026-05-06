/* ============================================================
   i18n — English / Spanish translation system
   ============================================================ */
const I18N = {
  current: 'es',
  translations: {
    en: {
      // === NAVIGATION MODULE TITLES ===
      'nav-mod1': 'Module 1 — Fundamentals',
      'nav-mod2': 'Module 2 — Essential Techniques',
      'nav-mod3': 'Module 3 — Advanced',
      'nav-mod4': 'Module 4 — Agents & Skills',
      'nav-mod5': 'Module 5 — Claude Opus 4.7',
      'nav-mod6': 'Module 6 — DeepSeek V4 Pro',
      'nav-mod7': 'Module 7 — Exercises',
      'nav-mod8': 'Module 8 — Diagrams',
      'nav-mod9': 'Module 9 — Production',
      'nav-mod10': 'Module 10 — Advanced Patterns',
      'nav-mod11': 'Module 11 — Real-World Cases',
      'nav-mod12': 'Module 12 — LLM Ecosystem',
      'nav-mod13': 'Module 13 — Training',
      'nav-mod14': 'Module 14 — Infrastructure',
      'nav-mod15': 'Module 15 — AI by Industry',
      'nav-mod16': 'Module 16 — Benchmarks',
      'nav-mod17': 'Module 17 — Safety & Ethics',
      'nav-mod18': 'Module 18 — Multi-Agent',
      'nav-mod19': 'Module 19 — AI by Role',
      'nav-mod20': 'Module 20 — Future of AI',
      'nav-mod21': 'Module 21 — Quantization',
      'nav-tools': '🛠️ Tools',

      // === SIDEBAR ===
      'sidebar-subtitle': 'Master Course 2026',
      'lang-es': 'ES',
      'lang-en': 'EN',
      'lang-label': 'Language:',

      // === NAV ITEMS ===
      'nav-1.1': '1.1 What is an LLM?',
      'nav-1.2': '1.2 Prompt Engineering',
      'nav-1.3': '1.3 Anatomy of a Prompt',
      'nav-1.4': '1.4 System Roles',
      'nav-1.5': '1.5 Zero-shot vs Few-shot',
      'nav-2.1': '2.1 Clarity & Precision',
      'nav-2.2': '2.2 Using Examples (Few-shot)',
      'nav-2.3': '2.3 Role Prompting',
      'nav-2.4': '2.4 XML Structure',
      'nav-2.5': '2.5 Chain of Thought',
      'nav-2.6': '2.6 Output Format Control',
      'nav-3.1': '3.1 Thinking / Reasoning',
      'nav-3.2': '3.2 Prompt Chaining',
      'nav-3.3': '3.3 ReAct & Tool Use',
      'nav-3.4': '3.4 Long Documents',
      'nav-4.1': '4.1 What is an Agent?',
      'nav-4.2': '4.2 Skills (Claude Code)',
      'nav-4.3': '4.3 Sub-agents',
      'nav-4.4': '4.4 CLAUDE.md / AGENTS.md',
      'nav-4.5': '4.5 Roles in Projects',
      'nav-4.6': '4.6 MCP (Protocol)',
      'nav-4.7': '4.7 Agent Comparison',
      'nav-5.1': '5.1 Effort Levels',
      'nav-5.2': '5.2 Adaptive Thinking',
      'nav-5.3': '5.3 Tool Use & Sub-agents',
      'nav-5.4': '5.4 Frontend & Code Review',
      'nav-6.1': '6.1 DeepSeek vs Claude',
      'nav-6.2': '6.2 OpenCode — The Agent',
      'nav-6.3': '6.3 AGENTS.md Config',
      'nav-6.4': '6.4 Tools & Limits',
      'nav-7.1': '7.1 Effective Prompts',
      'nav-7.2': '7.2 Zero → Few-shot',
      'nav-7.3': '7.3 Chain of Thought',
      'nav-7.4': '7.4 Interactive Simulator',
      'nav-7.5': '7.5 Combo: Role + XML',
      'nav-8.1': '8.1 Prompt Flow',
      'nav-8.2': '8.2 Agent Architecture',
      'nav-8.3': '8.3 Skills vs Sub-agents',
      'nav-9.1': '9.1 Structured Outputs',
      'nav-9.2': '9.2 Prompt Caching',
      'nav-9.3': '9.3 Evals & Testing',
      'nav-9.4': '9.4 Security: Injection',
      'nav-9.5': '9.5 Costs & Latency',
      'nav-10.1': '10.1 System Prompt Patterns',
      'nav-10.2': '10.2 Multimodal Prompting',
      'nav-10.3': '10.3 RAG Integration',
      'nav-10.4': '10.4 Fine-tuning vs Prompting',
      'nav-10.5': '10.5 Multi-turn & State',
      'nav-11.1': '11.1 Code Review Pipeline',
      'nav-11.2': '11.2 Customer Support',
      'nav-11.3': '11.3 Data Extraction',
      'nav-11.4': '11.4 Documentation Generator',
      'nav-12.1': '12.1 AI Model Types',
      'nav-12.2': '12.2 Online vs Local LLMs',
      'nav-12.3': '12.3 Specializations',
      'nav-12.4': '12.4 Open Source vs API',
      'nav-13.1': '13.1 How LLMs Are Trained',
      'nav-13.2': '13.2 Post-Training (RLHF/DPO)',
      'nav-13.3': '13.3 Fine-tuning (SFT/LoRA)',
      'nav-13.4': '13.4 Tools & Frameworks',
      'nav-13.5': '13.5 Popular Datasets',
      'nav-14.1': '14.1 RAG: Chunking + Embeddings',
      'nav-14.2': '14.2 Vector Databases',
      'nav-14.3': '14.3 Frameworks (LangChain, etc.)',
      'nav-14.4': '14.4 Deployment & Serving',
      'nav-14.5': '14.5 Monitoring & Observability',
      'nav-15.1': '15.1 Healthcare & Biotech',
      'nav-15.2': '15.2 Finance & Banking',
      'nav-15.3': '15.3 Legal & Compliance',
      'nav-15.4': '15.4 Gaming, Media, Retail',
      'nav-16.1': '16.1 Key Benchmarks',
      'nav-16.2': '16.2 2026 Model Comparison',
      'nav-16.3': '16.3 How to Evaluate Models',
      'nav-17.1': '17.1 Hallucination & Bias',
      'nav-17.2': '17.2 Red Teaming & Safety',
      'nav-17.3': '17.3 Regulation (EU AI Act)',
      'nav-18.1': '18.1 Multi-Agent Patterns',
      'nav-18.2': '18.2 CrewAI & AutoGen',
      'nav-18.3': '18.3 Agent Swarms',
      'nav-19.1': '19.1 For Developers',
      'nav-19.2': '19.2 For Designers',
      'nav-19.3': '19.3 For PMs & Executives',
      'nav-20.1': '20.1 What\'s Cooking',
      'nav-20.2': '20.2 Timeline 2026-2030',
      'nav-20.3': '20.3 AI + Science & Robotics',
      'nav-21.1': '21.1 What is Quantization',
      'nav-21.2': '21.2 GPTQ, AWQ, GGUF, BitsAndBytes',
      'nav-21.3': '21.3 Quality vs Size',
      'nav-tc': 'Token Counter',
      'nav-cc': 'Cost Calculator',
      'nav-diff': 'Prompt Diff Comparator',

      // === SECTION TITLES ===
      's1-title': '1.1 What is an LLM?',
      's1-sub': 'Large Language Models — The brain behind generative AI',
      's2-title': '1.2 What is Prompt Engineering?',
      's2-sub': 'The discipline of designing instructions that get consistent, high-quality results from an LLM',
      's3-title': '1.3 Anatomy of a Prompt',
      's3-sub': 'The 5 sections that make up a professional prompt',
      's4-title': '1.4 System Roles',
      's4-sub': 'The chain of command: system → user → assistant',
      's5-title': '1.5 Zero-shot vs Few-shot',
      's6-title': '2.1 Clarity & Precision',
      's6-sub': 'The most important principle. Claude Opus 4.7 is especially LITERAL.',
      's7-title': '2.2 Using Examples (Few-shot Prompting)',
      's8-title': '2.3 Role Prompting',
      's9-title': '2.4 XML Structure',
      's9-sub': 'The MOST recommended technique by Anthropic for complex prompts',
      's10-title': '2.5 Chain of Thought (CoT)',
      's11-title': '2.6 Output Format Control',
      's12-title': '3.1 Thinking / Reasoning',
      's12-sub': 'Internal reasoning tokens that improve quality without showing to the user',
      's13-title': '3.2 Prompt Chaining',
      's14-title': '3.3 ReAct & Tool Use',
      's14-sub': 'Reasoning + Acting — the foundational pattern for all AI agents',
      's15-title': '3.4 Long Documents (20K+ tokens)',
      's16-title': '4.1 What is an AI Agent?',
      's16-sub': 'A system that uses an LLM to reason, decide actions, execute tools, and adapt — autonomously',
      's17-title': '4.2 Skills in Claude Code',
      's17-sub': 'SKILL.md files that extend Claude with reusable capabilities',
      's18-title': '4.3 Sub-agents',
      's19-title': '4.4 CLAUDE.md / AGENTS.md',
      's20-title': '4.5 Roles in Projects with Agents',
      's21-title': '4.6 MCP (Model Context Protocol)',
      's92-title': '4.7 Coding Agent Comparison (2026)',
      's92-sub': 'The AI coding agent ecosystem — which one to choose based on your stack and needs',
      's22-title': '5.1 Effort Levels (Claude Opus 4.7)',
      's23-title': '5.2 Adaptive Thinking',
      's24-title': '5.3 Tool Use & Sub-agents in Opus 4.7',
      's25-title': '5.4 Frontend Design & Code Review',
      's26-title': '6.1 DeepSeek V4 Pro vs Claude Opus 4.7',
      's27-title': '6.2 OpenCode — The Agent for DeepSeek',
      's27-sub': 'The open-source agent (150K+ ⭐) you\'re using right now',
      's28-title': '6.3 AGENTS.md Configuration for DeepSeek',
      's29-title': '6.4 DeepSeek Tools & Limits via OpenCode',
      's30-title': '7.1 Exercise: Create an Effective Prompt',
      's30-sub': 'Transform a vague prompt into a professional one',
      's31-title': '7.2 Exercise: Zero-shot → Few-shot',
      's32-title': '7.3 Exercise: Chain of Thought',
      's33-title': '7.4 Interactive Prompt Simulator',
      's33-sub': 'Experiment with how responses change when activating different techniques',
      's34-title': '7.5 Exercise: Combine Role + XML + Examples',
      's35-title': '8.1 Complete Prompt Flow',
      's36-title': '8.2 Code Agent Architecture',
      's37-title': '8.3 Skills vs Sub-agents vs Prompts',
      's38-title': '9.1 Structured Outputs (JSON Schema)',
      's38-sub': 'Guarantee exact format in responses — critical for production',
      's39-title': '9.2 Prompt Caching',
      's39-sub': 'Reduce costs up to 90% by reusing context between calls',
      's40-title': '9.3 Evals & Prompt Testing',
      's40-sub': 'Objectively measure your prompt quality — don\'t trust your gut',
      's41-title': '9.4 Security: Prompt Injection',
      's41-sub': 'The #1 security issue in LLM applications',
      's42-title': '9.5 Costs & Latency',
      's43-title': '10.1 System Prompt Design Patterns',
      's43-sub': 'Proven patterns for robust system prompts',
      's44-title': '10.2 Multimodal Prompting',
      's44-sub': 'Images, audio, video — LLMs are no longer text-only',
      's45-title': '10.3 RAG (Retrieval Augmented Generation)',
      's45-sub': 'Augment LLM knowledge with real-time external data',
      's46-title': '10.4 Fine-tuning vs Prompt Engineering',
      's47-title': '10.5 Multi-turn Conversations & State',
      's48-title': '11.1 Case Study: Code Review Pipeline',
      's49-title': '11.2 Case Study: Customer Support',
      's50-title': '11.3 Case Study: Data Extraction',
      's51-title': '11.4 Case Study: Documentation Generator',
      's55-title': '12.1 Types of AI and Models',
      's55-sub': 'Not all AI is the same — understand the categories and which model to use for each task',
      's56-title': '12.2 Online (API) vs Local LLMs',
      's56-sub': 'The most important architectural decision: cloud or local?',
      's57-title': '12.3 Model Specializations',
      's57-sub': 'Not all LLMs are generalists — models trained for specific domains',
      's58-title': '12.4 Open Source vs Proprietary',
      's59-title': '13.1 How LLMs Are Trained',
      's59-sub': 'From raw internet text to conversational assistant — the 3 phases of training',
      's60-title': '13.2 Post-Training: RLHF, DPO & Constitutional AI',
      's61-title': '13.3 Fine-tuning: SFT, LoRA & QLoRA',
      's62-title': '13.4 Fine-tuning Tools',
      's63-title': '13.5 Popular Datasets for Fine-tuning',
      's64-title': '14.1 RAG: Chunking + Embeddings',
      's64-sub': 'The heart of RAG: how to split documents and convert text to vectors',
      's65-title': '14.2 Vector Databases',
      's65-sub': 'Where embeddings are stored and searched — the RAG engine',
      's66-title': '14.3 LLM Frameworks',
      's67-title': '14.4 LLM Deployment & Serving',
      's68-title': '14.5 Monitoring & Observability',
      's69-title': '15.1 AI in Healthcare & Biotech',
      's70-title': '15.2 AI in Finance & Banking',
      's71-title': '15.3 AI in Legal & Compliance',
      's72-title': '15.4 AI in Gaming, Media, Education & Retail',
      's73-title': '16.1 Key Benchmarks for LLMs',
      's73-sub': 'How model quality is objectively measured',
      's74-title': '16.2 Model Comparison (2026 Data)',
      's75-title': '16.3 How to Evaluate a Model for Your Use Case',
      's76-title': '17.1 Hallucination, Bias & Mitigation',
      's77-title': '17.2 Red Teaming & AI Safety',
      's78-title': '17.3 AI Regulation (EU AI Act & More)',
      's79-title': '18.1 Multi-Agent Collaboration Patterns',
      's80-title': '18.2 CrewAI, AutoGen & LangGraph',
      's81-title': '18.3 Agent Swarms & Emergent Systems',
      's82-title': '19.1 AI for Developers',
      's83-title': '19.2 AI for Designers',
      's84-title': '19.3 AI for PMs & Executives',
      's85-title': '20.1 What\'s Cooking (2026)',
      's85-sub': 'What AI labs are building right now — not hype, published papers',
      's86-title': '20.2 Timeline: Today to 2030',
      's87-title': '20.3 AI + Science & Robotics',
      's88-title': '21.1 What is Model Quantization?',
      's88-sub': 'Compressing models so they fit on your GPU (or your phone)',
      's89-title': '21.2 Quantization Methods',
      's90-title': '21.3 Quality vs Size — The Definitive Table',

      // === COMMON TERMS ===
      'footer': 'Prompt Engineering Master Course — 2026\nResearched & compiled from official Anthropic, DeepSeek, OpenAI, OpenCode & DAIR.AI docs\nCreated for Claude Opus 4.7 and DeepSeek V4 Pro',

      // === SECTION BODY - Spanish to English mappings for common phrases ===
      's1-card-title': '🔬 How does it really work?',
      's1-card-body': 'An LLM receives a sequence of <strong>tokens</strong> (sub-words) and predicts the most likely next token. It generates text <strong>autoregressively</strong>, token by token. It doesn\'t "think" like a human — it\'s an extremely sophisticated statistical simulator trained on massive amounts of text.',
      's1-card-body2': 'By 2026, models have evolved to incorporate <strong>internal reasoning</strong> (thinking tokens), tool use, and vision.',

      'models-title': 'Major Models (2026)',
      'params-title': 'Key Configuration Parameters',
      'params-desc': 'What it does',
      'params-range': 'Range',

      // === EXERCISE PANELS ===
      'ex-original': 'Original Prompt',
      'ex-improved': 'Your improved version:',
      'ex-evaluate': 'Evaluate Prompt',
      'ex-placeholder1': 'Write your improved prompt here. Include: technology, features, design, constraints...',
      'ex-placeholder2': 'Write your prompt with at least 3 classification examples...',
      'ex-placeholder3': 'Add step-by-step reasoning instructions...',
      'ex-placeholder4': '1. Define a ROLE (you are an expert in...)\n2. Structure with XML (<instructions>, <context>, <format>)\n3. Add 2-3 EXAMPLES of vulnerabilities found',

      // === SIMULATOR ===
      'sim-role': 'Assistant Role',
      'sim-role-none': 'No role defined',
      'sim-role-senior': 'Senior Developer',
      'sim-role-teacher': 'Math Teacher',
      'sim-role-sre': 'Site Reliability Engineer',
      'sim-role-lawyer': 'Specialized Lawyer',
      'sim-query': 'Your Question',
      'sim-tech-active': 'Active Techniques',
      'sim-run': 'Simulate Response',
      'sim-quality': 'Quality',
      'sim-speed': 'Speed',
      'sim-cost': 'Cost',
      'sim-accuracy': 'Accuracy',
      'sim-fallback-query': 'How do I implement rate limiting in a REST API?',

      // === TOOLS ===
      'tc-title': 'Token Counter',
      'tc-sub': 'Estimate tokens from your prompt in real time',
      'tc-placeholder': 'Paste your prompt here to count words, characters and estimate tokens...',
      'cc-title': 'Cost Calculator',
      'cc-sub': 'Calculate API call costs by model',
      'diff-title': 'Prompt Diff Comparator',
      'diff-sub': 'Compare two prompt versions and see which is better',
      'diff-left': 'Prompt A',
      'diff-right': 'Prompt B',

      // === QUIZ ===
      'quiz-title': 'Quick Quiz',
    },
  },

  init() {
    const lang = localStorage.getItem('lang') || 'es';
    this.current = lang;
    this.applyLanguage(lang);
    this.setupToggle();
  },

  applyLanguage(lang) {
    this.current = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;

    // === 1) NAV MODULE TITLES (by position) ===
    const modKeys = ['nav-mod1','nav-mod2','nav-mod3','nav-mod4','nav-mod5','nav-mod6',
      'nav-mod7','nav-mod8','nav-mod9','nav-mod10','nav-mod11','nav-mod12','nav-mod13',
      'nav-mod14','nav-mod15','nav-mod16','nav-mod17','nav-mod18','nav-mod19','nav-mod20',
      'nav-mod21','nav-tools'];
    document.querySelectorAll('.nav-module-title').forEach((el, i) => {
      const key = modKeys[i];
      if (!key) return;
      if (!el.dataset.originalText) el.dataset.originalText = el.textContent;
      el.textContent = lang === 'en' && this.translations.en?.[key]
        ? this.translations.en[key] : el.dataset.originalText;
    });

    // === 2) NAV LINKS (by data-target → section number) ===
    const map = this.getSectionMap();
    document.querySelectorAll('.nav-link').forEach(el => {
      const target = el.dataset.target;
      if (!target) return;
      const num = parseInt(target.replace('s',''));
      const textKey = map[num];
      if (!textKey) return;

      // Store original Spanish HTML on first pass
      if (!el.dataset.originalHtml) el.dataset.originalHtml = el.innerHTML;

      if (lang === 'en' && this.translations.en?.[textKey]) {
        const icon = el.querySelector('.nav-icon');
        const check = el.querySelector('.nav-check');
        const iconHtml = icon ? icon.outerHTML : '';
        const checkHtml = check ? check.outerHTML : '';
        el.innerHTML = iconHtml + ' ' + this.translations.en[textKey] + checkHtml;
      } else {
        el.innerHTML = el.dataset.originalHtml;
      }
    });

    // === 3) SECTION TITLES (h2) & SUBTITLES (.subtitle) ===
    document.querySelectorAll('section[id]').forEach(sec => {
      const tkey = sec.id + '-title';
      const stkey = sec.id + '-sub';
      const h2 = sec.querySelector('h2');
      const sub = sec.querySelector('.subtitle');

      if (h2) {
        if (!h2.dataset.originalText) h2.dataset.originalText = h2.textContent;
        h2.textContent = lang === 'en' && this.translations.en?.[tkey]
          ? this.translations.en[tkey] : h2.dataset.originalText;
      }
      if (sub) {
        if (!sub.dataset.originalText) sub.dataset.originalText = sub.textContent;
        sub.textContent = lang === 'en' && this.translations.en?.[stkey]
          ? this.translations.en[stkey] : sub.dataset.originalText;
      }
    });

    // === 4) DATA-I18N ELEMENTS ===
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (!el.dataset.originalI18n) el.dataset.originalI18n = el.textContent;
      const text = lang === 'en' ? this.translations.en?.[key] : el.dataset.originalI18n;
      if (text !== undefined) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // === 5) LANG TOGGLE BUTTONS ===
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('active', active);
      btn.style.background = active ? 'var(--accent)' : 'var(--glass)';
      btn.style.color = active ? '#000' : 'var(--text-dim)';
    });
  },

  // Map section number → nav translation key
  getSectionMap() {
    return {
      1:'nav-1.1',2:'nav-1.2',3:'nav-1.3',4:'nav-1.4',5:'nav-1.5',
      6:'nav-2.1',7:'nav-2.2',8:'nav-2.3',9:'nav-2.4',10:'nav-2.5',11:'nav-2.6',
      12:'nav-3.1',13:'nav-3.2',14:'nav-3.3',15:'nav-3.4',
      16:'nav-4.1',17:'nav-4.2',18:'nav-4.3',19:'nav-4.4',20:'nav-4.5',21:'nav-4.6',92:'nav-4.7',
      22:'nav-5.1',23:'nav-5.2',24:'nav-5.3',25:'nav-5.4',
      26:'nav-6.1',27:'nav-6.2',28:'nav-6.3',29:'nav-6.4',
      30:'nav-7.1',31:'nav-7.2',32:'nav-7.3',33:'nav-7.4',34:'nav-7.5',
      35:'nav-8.1',36:'nav-8.2',37:'nav-8.3',
      38:'nav-9.1',39:'nav-9.2',40:'nav-9.3',41:'nav-9.4',42:'nav-9.5',
      43:'nav-10.1',44:'nav-10.2',45:'nav-10.3',46:'nav-10.4',47:'nav-10.5',
      48:'nav-11.1',49:'nav-11.2',50:'nav-11.3',51:'nav-11.4',
      55:'nav-12.1',56:'nav-12.2',57:'nav-12.3',58:'nav-12.4',
      59:'nav-13.1',60:'nav-13.2',61:'nav-13.3',62:'nav-13.4',63:'nav-13.5',
      64:'nav-14.1',65:'nav-14.2',66:'nav-14.3',67:'nav-14.4',68:'nav-14.5',
      69:'nav-15.1',70:'nav-15.2',71:'nav-15.3',72:'nav-15.4',
      73:'nav-16.1',74:'nav-16.2',75:'nav-16.3',
      76:'nav-17.1',77:'nav-17.2',78:'nav-17.3',
      79:'nav-18.1',80:'nav-18.2',81:'nav-18.3',
      82:'nav-19.1',83:'nav-19.2',84:'nav-19.3',
      85:'nav-20.1',86:'nav-20.2',87:'nav-20.3',
      88:'nav-21.1',89:'nav-21.2',90:'nav-21.3',
      52:'nav-tc',53:'nav-cc',54:'nav-diff',
    };
  },

  t(key) {
    return this.translations[this.current]?.[key] || key;
  },

  setupToggle() {
    // The toggle buttons are in the HTML
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.applyLanguage(btn.dataset.lang);
      });
    });
  }
};

// Auto-init
document.addEventListener('DOMContentLoaded', () => I18N.init());
