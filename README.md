# 🧠 Prompt Engineering Master Course

A comprehensive, interactive web-based course on LLM prompt engineering — optimized for **Claude Opus 4.7** and **DeepSeek V4 Pro**. Built as a single-page application with zero build step, zero dependencies (except a CDN polyfill), and full bilingual support (ES/EN).

🔗 **Live demo:** [gs-run.github.io/prompt-engineering-course](https://gs-run.github.io/prompt-engineering-course/)

---

## 📚 What's Inside

| Module | Topics |
|--------|--------|
| **1. Fundamentals** | LLMs, Prompt Engineering, prompt anatomy, system roles, zero-shot vs few-shot |
| **2. Essential Techniques** | Clarity, examples, role prompting, XML structure, Chain of Thought, output control |
| **3. Advanced** | Thinking/Reasoning, prompt chaining, ReAct, long documents |
| **4. Agents & Skills** | Agents, SKILL.md, sub-agents, CLAUDE.md/AGENTS.md, project roles, MCP, agent comparison |
| **5. Claude Opus 4.7** | Effort levels, adaptive thinking, tool use, frontend design, code review |
| **6. DeepSeek V4 Pro** | Claude vs DeepSeek, OpenCode, AGENTS.md config, tools & limits |
| **7. Exercises** | 5 interactive exercises with real-time scoring (0-100%) |
| **8. Diagrams** | 3 animated Canvas diagrams (prompt flow, agent architecture, skills vs sub-agents) |
| **9. Production** | Structured outputs, prompt caching, evals, prompt injection defense, costs |
| **10. Advanced Patterns** | System prompt design, multimodal, RAG, fine-tuning vs prompting, multi-turn |
| **11. Real-World Cases** | Code review pipeline, customer support, data extraction, doc generation |
| **12. LLM Ecosystem** | AI model types, online vs local, specializations, open source vs proprietary |
| **13. Training** | Pre-training, post-training (RLHF/DPO), fine-tuning (SFT/LoRA/QLoRA), tools, datasets |
| **14. Infrastructure** | Chunking + embeddings, vector DBs, frameworks, deployment, monitoring |
| **15. AI by Industry** | Healthcare, finance, legal, gaming, media, education, retail |
| **16. Benchmarks** | MMLU, HumanEval, MATH, GPQA, SWE-bench — 2026 model comparison |
| **17. Safety & Ethics** | Hallucination, bias, red teaming, Anthropic ASL, EU AI Act |
| **18. Multi-Agent** | Collaboration patterns, CrewAI/AutoGen/LangGraph, agent swarms |
| **19. AI by Role** | Developer, designer, PM, executive — prompts & workflows |
| **20. Future of AI** | What's cooking, timeline 2026-2030, AI + science + robotics |
| **21. Quantization** | FP32→INT2, GPTQ/AWQ/GGUF/BitsAndBytes, quality vs size |

### 🛠️ Interactive Tools

- **Token Counter** — real-time token estimation
- **Cost Calculator** — compare costs across 6 models with caching
- **Prompt Diff Comparator** — A/B test two prompts with 5-criteria scoring
- **Prompt Simulator** — toggle 6 techniques and see how response quality changes
- **12 Quizzes** — multiple choice with localStorage persistence
- **5 Coding Exercises** — with real-time quality scoring

---

## 🚀 Quick Start

Clone and open — no install, no build, no server needed:

```bash
git clone https://github.com/GS-RUN/prompt-engineering-course.git
cd prompt-engineering-course
open index.html   # or double-click index.html
```

To serve locally with hot reload (optional):
```bash
npx serve .
```

---

## 🏗️ Project Structure

```
prompt-engineering-course/
├── index.html          # Main entry — 92 sections, 364 divs, 230 KB
├── css/
│   └── style.css       # Glassmorphism dark theme, CSS variables, responsive
├── js/
│   ├── app.js          # Router, scroll-spy, progress bar
│   ├── i18n.js         # ES/EN translation system (auto-nav + section titles)
│   ├── exercises.js    # 4 interactive exercises with scoring engine
│   ├── simulator.js    # Prompt simulator with 6 toggleable techniques
│   ├── diagrams.js     # 3 animated Canvas diagrams
│   ├── quiz.js         # 12 quizzes with localStorage persistence
│   ├── token-tools.js  # Token counter + cost calculator
│   ├── prompt-diff.js  # A/B prompt comparator
│   └── three-bg.js     # Unused (kept for reference — replaced by CSS orbs)
└── .gitignore
```

---

## 🌐 Languages

Click **ES** / **EN** in the sidebar to switch. Translations cover:
- All navigation items (92 links)
- All section titles and subtitles
- Module category headers
- Language preference saved to `localStorage`

The i18n system is in `js/i18n.js` — add new translation keys there to extend coverage.

---

## 🎨 Design

- **Dark theme** with warm gold/orange/gray palette
- CSS-only animated background (gradient orbs, subtle grid)
- Glassmorphism cards with backdrop blur
- Responsive layout (sidebar collapses on mobile)
- Smooth scroll-spy navigation with completion checkmarks
- Animated progress bar at the top

---

## 📖 Sources

Content compiled from official documentation:
- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Anthropic Claude Code Docs](https://code.claude.com/docs/en/overview)
- [DeepSeek API Docs](https://platform.deepseek.com/api-docs/)
- [OpenCode Docs](https://opencode.ai/docs)
- [OpenAI Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- [DAIR.AI Prompt Engineering Guide](https://www.promptingguide.ai/)

---

## 📄 License

MIT — use it, modify it, share it.
