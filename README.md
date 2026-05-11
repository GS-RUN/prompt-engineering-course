# 🧠 Prompt Engineering Master Course — 2026 LLM Ecosystem

A comprehensive, open academic course on LLM prompt engineering covering the **full 2026 model ecosystem** — frontier proprietary (Claude, GPT, Gemini, Grok), Chinese frontier (DeepSeek, Kimi, MiniMax, Qwen, GLM), open-weights (Llama, Qwen, Gemma, Mistral, DeepSeek, Phi), and local deployment (Ollama, llama.cpp, MLX, vLLM).

Vendor-agnostic by default. Cross-API translation tables for every technique. Bilingual ES + EN. Versioned content with changelog. Comparable in scope to Anthropic Academy, Google ML Crash Course, DeepLearning.AI Generative AI courses — without vendor lock-in.

🔗 **Live demo:** [gs-run.github.io/prompt-engineering-course](https://gs-run.github.io/prompt-engineering-course/)

📋 **Current version:** 2.3.16 (see [CHANGELOG](CHANGELOG.md))

---

## 📚 Course structure

The course is organised into **14 academic blocks** + an orientation block + workshop + capstone. Each block is a standalone HTML page (~7-67 KB) loaded on demand, opening with **front-matter** (icon, level, time estimate, learning objectives) and closing with **bibliographic references** + a **5-question knowledge check**.

| #     | Block                                  | Level         | Time     |
|-------|----------------------------------------|---------------|----------|
| **0** | Orientation (setup, prerequisites)     | beginner      | 20 min   |
| **I** | Foundations (LLM mechanics, ecosystem) | beginner      | 90 min   |
| **II**| Prompt Engineering Core                | beginner      | 180 min  |
| **III**| Advanced Reasoning + Tools            | intermediate  | 150 min  |
| **IV**| Production Engineering                 | intermediate  | 200 min  |
| **V** | Agents + Multi-agent                   | intermediate  | 180 min  |
| **VI**| Infrastructure + RAG deep-dive         | intermediate  | 150 min  |
| **VII**| Local Models + Quantization + Privacy | advanced      | 200 min  |
| **VIII**| Cross-Model Patterns                 | advanced      | 60 min   |
| **IX**| Benchmarks + Evaluation                | intermediate  | 90 min   |
| **X** | Safety, Ethics, Regulation             | intermediate  | 90 min   |
| **XI**| Applied Industry + Roles               | intermediate  | 200 min  |
| **XII**| Future + Research Frontier            | reading       | 60 min   |
| **XIII**| Practical Workshop (Bando B)         | all           | 180 min  |
| **XIV**| Capstone Projects (4 end-to-end)      | capstone      | ~10h × 4 |

**Total study time:** ~30 hours across 4-6 weeks at 2-3 hour sessions.

### 🛠️ Interactive tools

- **Token Counter** — real-time token estimation.
- **Cost Calculator** — 18 frontier + OSS models grouped by region (US / China / EU), with caching scenarios.
- **Prompt Diff Comparator** — A/B two prompts with 5-criteria scoring.
- **🪄 SKILL.md Builder** — fill in name, description, allowed-tools, context and body; copy the generated SKILL.md ready to drop into `~/.claude/skills/<name>/`.
- **🎯 Agent Goal Composer** — compose a structured agent prompt with role, goal, constraints, success criteria and output format (Anthropic-style XML tags).
- **🩺 Prompt Linter** — paste a system prompt and get 7 checks + score (length, role, examples, format, XML structure, CoT, user-data leak) based on Anthropic's prompt-engineering guide.
- **Prompt Simulator** — toggle 6 techniques and see simulated response quality.
- **5 Coding Exercises** with real-time scoring.
- **92 quizzes total** — 22 inline formative + 70 end-of-block knowledge checks, distributed 23/23/23/23 across A/B/C/D (rebalanced in 2.2.3).
- **Glossary** — 89 technical terms ES + EN with rich schema (short tooltip + long-form definition + examples + related-term chips). 73 entries carry a hand-tuned inline SVG diagram (RAG flow, attention weights, agent loop, MoE routing, transformer stack, KV cache, LoRA decomp, fine-tuning vs RAG, sampling distributions, training timeline, prompt injection flow, frontier scatter, MCP topology, and 60+ more). In-text auto-link wraps every detected term in a clickable link that opens the glossary in a new tab.

---

## 🚀 Quick start

```bash
git clone https://github.com/GS-RUN/prompt-engineering-course.git
cd prompt-engineering-course
npx serve .
# open http://localhost:3000
```

Or just open `index.html` directly in a browser — no build step, no dependencies.

---

## 🏗️ Project structure

```
prompt-engineering-course/
├── index.html                  # Landing (35 KB) — hero + 17 block cards + course philosophy
├── modules/
│   ├── 00-orientation.html     # Setup, prerequisites, environment
│   ├── 01-foundations.html     # LLM mechanics + 2026 ecosystem
│   ├── 02-prompt-core.html     # Anatomy, roles, clarity, examples, XML, CoT, output
│   ├── 03-advanced-reasoning.html   # Thinking, tool use, multimodal
│   ├── 04-production.html      # Structured outputs, caching, evals, security, costs
│   ├── 05-agents.html          # Skills, sub-agents, MCP, multi-agent patterns
│   ├── 06-infrastructure.html  # Chunking, vector DBs, deployment, monitoring
│   ├── 07-local-quant.html     # GPTQ/AWQ/GGUF, fine-tuning, privacy
│   ├── 08-cross-model.html     # Vendor-agnostic patterns, fallback, routing
│   ├── 09-benchmarks.html      # MMLU/HumanEval/SWE-bench/ARC-AGI + eval design
│   ├── 10-safety.html          # Hallucination, red teaming, EU AI Act
│   ├── 11-industry.html        # Code review, support, extraction, by sector + role
│   ├── 12-future.html          # Research frontiers, expected models, AI + science
│   ├── 13-workshop.html        # Bando B: project, linter, library, evolution
│   ├── 14-capstone.html        # 4 end-to-end project specs with rubrics
│   ├── glossary.html           # 89 terms ES + EN, rich schema, anchored, in-text auto-linking
│   └── tools.html              # 6 tools: tokens, cost, prompt diff, SKILL.md, agent goal, linter
├── css/
│   ├── style.css               # Carbón + Ámbar palette, dark + light themes
│   └── bando-b.css             # Workshop-specific styling
├── js/
│   ├── shared/
│   │   ├── manifest.js         # Single source of truth (block list, objectives, sections)
│   │   ├── sidebar.js          # Generates sidebar dynamically per page
│   │   ├── landing.js          # Renders block grid on home page
│   │   ├── references.js       # Per-block bibliography
│   │   └── glossary-data.js    # 89 term definitions with rich schema (short + long + examples + related)
│   ├── app.js                  # Theme controller, defensive widget instantiation
│   ├── i18n.js                 # ES + EN toggle (CSS-driven via lang-blocks)
│   ├── quiz.js                 # 92 multiple-choice quizzes with schema-versioned localStorage migration
│   ├── exercises.js            # 5 interactive scoring exercises
│   ├── simulator.js            # Technique-toggle prompt simulator
│   ├── diagrams.js             # Animated Canvas diagrams (legacy block visuals)
│   ├── glossary-diagrams.js    # 73 hand-tuned inline-SVG diagrams for the glossary (RAG flow, attention, MoE, KV cache, etc.)
│   ├── glossary.js             # In-text auto-link wrapping → links to glossary.html in a new tab + hover tooltip
│   ├── glossary-page.js        # Renderer for the dedicated glossary page (anchored entries, smooth scroll, search)
│   ├── token-tools.js          # Token counter + cost calculator
│   ├── prompt-diff.js          # A/B prompt comparator
│   ├── tools-extra.js          # SKILL.md Builder + Agent Goal Composer + Prompt Linter
│   ├── linter.js               # Prompt linter (Bando B workshop, separate from the v2.3.16 Prompt Linter tool)
│   ├── library.js              # Prompt library (Bando B)
│   ├── evolution.js            # Prompt evolution tracker (Bando B)
│   └── project.js              # User project panel (Bando B)
├── scripts/
│   ├── split_modules.js              # One-shot: extract sections from index.legacy.html into modules/
│   ├── add_knowledge_checks.js       # One-shot: insert kc-NN anchors into all module pages
│   ├── wrap_lang_blocks.js           # One-shot: wrap section bodies in lang-block divs
│   └── rebalance_quiz_answers.js     # One-shot: rebalance correct-answer positions across all quizzes (used in v2.2.3)
├── CHANGELOG.md
├── README.md
└── index.legacy.html                 # v1 monolithic backup (will be removed in a future major)
```

### Architectural highlights

- **Multi-page split:** initial landing 35 KB; each block 7-67 KB. Browser caches CSS/JS across pages.
- **Single source of truth:** `js/shared/manifest.js` declares the block structure. The sidebar, landing, and split scripts all consume it.
- **Bilingual via CSS:** every section body is wrapped in `<div class="lang-block" data-lang="es|en">`. The `<html>` element's `data-i18n-lang` attribute drives visibility. No JS replacement of textContent.
- **Defensive JS instantiation:** widget engines are only constructed if their class is loaded on the current page (each module imports only the JS it needs).
- **Versioned content:** every claim is dated 2026-01 to 2026-05. The "model + hardware version policy" in Block XIV instructs readers to substitute upward (e.g. Opus 4.7 → Opus 5+ when shipped).

---

## 🌐 Languages

Click **ES** / **EN** in the sidebar to switch. Coverage:

- Every section body has parallel ES + EN content. Sections without an EN translation fall back to ES with a banner.
- Sidebar, landing cards, glossary, knowledge checks, references — all bilingual.
- Language preference saved to `localStorage` and applied via `<html data-i18n-lang="es|en">`.
- Convention: prompt examples appear in the active language. The course flags honestly that production prompts often run 5-15% better in English on small open-weights models.

---

## 🎨 Design

- **Carbón + Ámbar** palette (warm dark default, light theme available).
- CSS-only animated background (gradient orbs, subtle grid).
- Glassmorphism cards with backdrop blur.
- Responsive: sidebar collapses to a horizontal bar on mobile.
- Difficulty badges (beginner / intermediate / advanced / capstone / reference / reading).
- Animated progress bar at the top.

---

## 📖 Sources

The course is researched and compiled from official documentation. Each block also has its own per-block bibliography in `js/shared/references.js` with direct links to papers, RFCs and official docs.

**Primary sources** (provider documentation):

- [Anthropic — Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Anthropic — Claude Code Docs](https://code.claude.com/docs/en/overview)
- [OpenAI — Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- [Google — Gemini Prompt Best Practices](https://ai.google.dev/gemini-api/docs/prompting-strategies)
- [DeepSeek — API Docs](https://platform.deepseek.com/api-docs/)
- [Moonshot — Kimi Open Platform](https://platform.moonshot.ai/)
- [Alibaba — Qwen / DashScope Docs](https://help.aliyun.com/zh/dashscope/)
- [Zhipu — BigModel / GLM Docs](https://open.bigmodel.cn/dev/api)
- [Mistral — La Plateforme Docs](https://docs.mistral.ai/)
- [Meta — Llama Cookbook](https://github.com/meta-llama/llama-cookbook)
- [Microsoft — Phi Cookbook](https://github.com/microsoft/PhiCookbook)
- [Cohere — Documentation](https://docs.cohere.com/)
- [OpenCode Docs](https://opencode.ai/docs)
- [DAIR.AI — Prompt Engineering Guide](https://www.promptingguide.ai/)

**Foundational papers** (linked in per-block references):

- Vaswani et al. — *Attention Is All You Need* (2017)
- Brown et al. — *Language Models are Few-Shot Learners* (GPT-3, 2020)
- Wei et al. — *Chain-of-Thought Prompting* (2022)
- Yao et al. — *ReAct: Synergizing Reasoning and Acting* (2022)
- Bai et al. — *Constitutional AI* (Anthropic, 2022)
- Frantar et al. — *GPTQ* (2022); Lin et al. — *AWQ* (2023); Dettmers et al. — *QLoRA* (2023)
- Hendrycks et al. — *MMLU* (2020); Chen et al. — *HumanEval* (2021); Rein et al. — *GPQA* (2023)
- Greshake et al. — *Indirect Prompt Injection* (2023)

---

## 🤝 Contributing

Pull requests welcome. The course is versioned (semver-ish): patch for fixes/typos, minor for new content, major for architectural changes.

**Architecture contracts:**

- Block structure → edit `js/shared/manifest.js`. Re-run `node scripts/split_modules.js` if changing legacy section ranges.
- Knowledge checks → add to `js/quiz.js` with `section: "kc-NN"`.
- Glossary terms → add to `js/shared/glossary-data.js`.
- Per-block references → edit `js/shared/references.js`.
- New module page → use the same shell as existing pages (`<head>` includes, `<body data-page-block="NN">`, `<nav id="sidebar">` populated by `sidebar.js`, `<main id="content">`, references section, knowledge-check anchor).

**When to bump version:**

- 2.2.1 → 2.2.2: typos, refactors, link fixes.
- 2.2.x → 2.3.0: new section, new module, content rewrite.
- 2.x.y → 3.0.0: architectural change (manifest schema, breaking URL changes).

Always update `CHANGELOG.md` with the change. Version lives in `js/shared/manifest.js` and is shown in the sidebar foot + landing footer.

---

## 📄 License

MIT — use it, modify it, share it.

---

© 2026 **Alonso J. Núñez** · [GS·RUN](https://github.com/GS-RUN) · [Source code](https://github.com/GS-RUN/prompt-engineering-course)
