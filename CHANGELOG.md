# Changelog

All notable changes to this course are documented here. Format inspired by [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.2.0] — 2026-05-08

### Added — closing the deferred items from v2.0/v2.1

This release closes everything in the "deferred" list short of an
in-course AI tutor (which intentionally stays out — it would require
API key handling, billing, and infra beyond a static site's scope).

#### Project C and D rubrics

Block XIV's Projects C (Local Self-Hosted Assistant) and D (Multi-Agent
Research Team) had specs and known traps but no rubrics. Added:

- Project C: deliverables list (7 items including Docker compose,
  COMPLIANCE.md mapping GDPR Art. 32, network monitor evidence) +
  scoring rubric (8 criteria, 100 pts total).
- Project D: suggested stack (5-agent topology with tier-mixing per
  agent), deliverables (6 items), scoring rubric (8 criteria, 100 pts).

Both projects are now portfolio-actionable end-to-end.

#### Block I — Foundations math/conceptual deep-dive

New section 1.0 "How does an LLM really work?" (~600 LOC ES+EN) added
BEFORE the existing 1.1. Covers tokenization with examples, embeddings,
the transformer block (self-attention + FFN with intuitions, no
equations), the three training phases (pre-training / SFT / RLHF-DPO-CAI)
with cost ranges, sampling, thinking/reasoning tokens (mechanism +
cost), and "what an LLM is NOT" (six common misconceptions). Designed
as the layer of mechanical intuition that prompt engineering decisions
need to rest on.

#### Knowledge checks per block

Added 70 multiple-choice questions (5 per block × 14 blocks: kc-01
through kc-14) to js/quiz.js. Each question has 4 options, the correct
answer, and an explanation that adds didactic value beyond a binary
right/wrong. Coverage:

- kc-01 Foundations: tokens, context windows, local vs cloud, quant
  sweet spot, VLM mechanics.
- kc-02 Prompt Core: temperature semantics, few-shot count, XML
  rationale, CoT use cases, system prompt placement.
- kc-03 Advanced Reasoning: effort levels, ReAct pattern, doc ordering,
  tool-use naming, thinking quality lift.
- kc-04 Production: structured outputs in Claude, caching savings,
  injection defense, eval-first principle, multi-turn statelessness.
- kc-05 Agents: workflow vs agent, SKILL.md format, MCP scope,
  supervisor-worker, AGENTS.md.
- kc-06 Infrastructure: chunk size, vector DB choice, vLLM positioning,
  re-ranker gain, production metrics.
- kc-07 Local + Quant: GPTQ vs AWQ, LoRA/QLoRA, fine-tuning vs RAG,
  truly-OSS models, GDPR compliance.
- kc-08 Cross-Model: lock-in cost, OpenAI function calling as standard,
  LiteLLM vs OpenRouter, fallback design, LLM-as-Judge bias.
- kc-09 Benchmarks: saturation reading, eval N, GPQA Google-proof,
  RAGAS, LMSys Arena meaning.
- kc-10 Safety: hallucination mitigation, EU AI Act tiers, ASL-3,
  Constitutional AI, jailbreak patterns.
- kc-11 Industry: code review thresholds, structured outputs vs
  semantics, escalation rules, medical diagnosis constitution, PM role.
- kc-12 Future: multi-day agents, US-China gap, LeCun thesis,
  GraphCast/GenCast, robotics + LLMs.
- kc-13 Workshop: project iteration, linter scope, anti-patterns,
  prompt library, prompt evolution.
- kc-14 Capstone: writeup primacy, cost target, citation accuracy,
  zero-leak verification, iteration cap.

The existing 22 ad-hoc quizzes scattered through sections remain;
knowledge checks are end-of-block summative, the inline ones formative.

#### Anchors automated

`scripts/add_knowledge_checks.js` (one-shot, idempotent) inserted
`<section id="kc-NN" class="knowledge-check">` into all 14 module pages
right before `<section class="module-references">`. Re-runnable safely.

### Changed

- `js/quiz.js`: cache buster bumped to v=9 across every page that loads
  it (14 modules + 14-capstone newly added).
- `modules/14-capstone.html`: now loads quiz.js so kc-14 renders.
- `js/shared/manifest.js`: course version 2.1.0 → 2.2.0.

### Intentionally NOT done (with rationale)

- **AI tutor of the course.** Would require API key handling, cost
  monitoring, abuse protection, and an inference proxy. Out of scope
  for a static-site course; the existing token counter + cost calculator
  already let a learner reason about cost, and any frontier API console
  serves as ad-hoc tutor.
- **Vídeos.** High effort, high signal but separate medium. The course
  remains text + interactive. Future contributors welcome to record.
- **Auto-grading of capstone code.** Project rubrics are designed for
  self-evaluation against objective metrics; auto-grading would lock in
  one solution shape and limit pedagogical value.

The deferred list is now closed. Future work (e.g. translating remaining
inline code comments in ES blocks, expanding industry case studies,
adding more Chinese-frontier-specific examples) belongs to ongoing
maintenance, not "missing".

---

## [2.1.0] — 2026-05-08

### Added — Block VIII fully written

The cross-model patterns block was a single-section placeholder (only the
frontier-models comparison from s26). It now contains seven full sections:

- **8.1 Why agnostic?** — five-reason rationale for vendor-agnostic design,
  cost-of-lock-in table.
- **8.2 Frontier Models 2026** (existing s26, renumbered).
- **8.3 Rosetta stones** — cross-API translations for every major
  technique: thinking/reasoning_effort across Claude/OpenAI/Gemini/
  DeepSeek/Qwen/Kimi/Llama; tool use formats; structured outputs;
  prompt caching granularity and TTLs.
- **8.4 Adapter layers** — comparison of OpenRouter, LiteLLM, PortKey,
  LangChain LLMs, Vercel AI SDK, HF Inference. Runnable LiteLLM example.
- **8.5 Fallback chains** — anatomy, five common patterns
  (same-tier / down-tier / local-emergency / quality / cost-cap),
  five known mistakes.
- **8.6 Cost/quality routing** — rule-based router (with code), LLM
  classifier router (with prompt), the metrics needed to iterate.
- **8.7 Cross-model evaluation** — five rules of methodology, runnable
  ~80-LOC eval template, common LLM-as-Judge bias trap.
- **8.8 Pitfalls** — nine typical cross-model gotchas with symptom + fix
  (tokenizer drift, tag conventions, defaults, stop sequences,
  multimodal gap, system position, streaming format, refusal divergence,
  silent versioning).

### Added — Block XIV fully written

The capstone block was a "coming soon" stub. It now contains:

- **Intro** — how to work on a capstone (4 components, recommended time,
  why the writeup is the most valuable artefact).
- **Project A — End-to-end Code Review Bot** — full spec with seven
  acceptance criteria (recall ≥ 80% on critical, precision ≥ 85%, mean
  cost ≤ $0.30/PR, p95 latency ≤ 90s), suggested stack, deliverables,
  five known traps, scoring rubric (100 pts).
- **Project B — RAG Knowledge Assistant** — full spec (200+ docs ingest,
  citation accuracy ≥ 90%, p95 ≤ 5s, cost ≤ $0.05/answer), stack
  (embeddings/vector DB/generation choices), deliverables, five known
  traps, scoring rubric.
- **Project C — Local Self-Hosted Assistant** — spec, target hardware
  tiers, four known traps. Full rubric and reference solution Q3 2026.
- **Project D — Multi-Agent Research Team** — spec with 5-agent topology
  (Researcher / Analyst / Critic / Writer / Supervisor), four known
  traps. Full rubric and reference solution Q3 2026.

### Changed

- `js/shared/manifest.js`: Block XIV no longer flagged as `stub`.
  Objectives rewritten to reflect actual content available.

### Acknowledged remaining gaps

These items from the v2.0 deferred list are still open:
- Capstone Projects C and D — full rubrics + reference solutions.
- Knowledge-check quizzes deeper than current.
- AI tutor of the course (Claude API integration).
- Foundations math deep-dive in Block I.

---

## [2.0.0] — 2026-05-08

### Major restructure

The course has been split into multiple pages organised by 14 academic blocks. Each block has its own page with learning objectives, prerequisites, time estimate and bibliographic references.

### Added

- **Block 0 — Orientation**: new module covering what the course is, prerequisites, navigation modes, and environment setup (cloud API + local model + coding agent).
- **Block VIII — Cross-Model Patterns**: new dedicated module for vendor-agnostic patterns, fallback chains, and cost/quality routing.
- **Block XIV — Capstone Projects**: stub for 4 end-to-end projects (code review bot, RAG knowledge assistant, local self-hosted assistant, multi-agent research team). Content arrives Q3 2026.
- **Glossary** (`modules/glossary.html`): centralised reference of every technical term used in the course, bilingual (ES/EN), with links back to the introducing block. Live filter included.
- **Per-module front-matter**: every block page now opens with icon, level (beginner/intermediate/advanced/capstone/reference), time estimate, and learning objectives.
- **Per-module references**: each block now has a "References" section at the bottom listing official documentation, papers and RFCs.
- **Course manifest** (`js/shared/manifest.js`): single source of truth for block structure, used by sidebar and landing.
- **Shared sidebar** (`js/shared/sidebar.js`): generated dynamically from the manifest on every page.

### Changed

- **Architecture**: `index.html` is now a landing page (~10 KB) with hero, course philosophy, and block grid. Each module lives in `modules/NN-slug.html` (7-50 KB each) instead of a single 330 KB SPA.
- **Sidebar**: reorganised by 14 academic blocks with difficulty levels visible.
- **Footer**: now displays version + date + bibliographic sources for the entire course.
- **Cache busters**: bumped to v=8 across CSS/JS.

### Deprecated

- `index.legacy.html` retained as a backup of the v1 monolithic page; will be removed in 2.1.

### Migration notes

- Old anchors (`index.html#sN`) no longer resolve. Update bookmarks to the new module pages (e.g. `modules/02-prompt-core.html#s10`).
- Custom forks should regenerate `modules/` via `node scripts/split_modules.js` after editing `js/shared/manifest.js`.

---

## [1.3.0] — 2026-05-08

### Added

- **Frontier Models 2026 broaden** (`s1`, `s26`, `s56`, `s58`, `s74`, `s85`, `s53`):
  - Section 1.1 now lists 10 frontier proprietary models (Claude, GPT-5.5, Gemini 2.5 Pro, DeepSeek V4 Pro, Kimi K2, MiniMax M2, Qwen3-Max, GLM-5, Grok 4, Mistral Large 3) plus 8 open-weights families (Llama 4, Qwen 3, Gemma 3, Mistral, DeepSeek V3, Phi-4, Yi, Command R+).
  - Section 6.1 rebuilt as "Frontier Models 2026 — Full Comparison" with 15-row matrix and use-case-to-model mapping.
  - Section 12.2 adds 8-row "recommended local models by hardware" table (CPU 8 GB → 4× A100).
  - Section 12.4 expands OSS list to 11 families with exact licenses; adds Chinese frontier proprietary tier.
  - Section 16.2 grows benchmark comparison from 7 to 19 rows + ARC-AGI column.
  - Section 20.1 expands expected-models table from 6 to 15 entries.
  - Cost calculator dropdown grows from 6 to 18 models grouped by region.
- **Key Configuration Parameters expansion** (`s1`): turned 4-row table into 12 dedicated cards covering temperature (with 5 use-case bands), top_p, top_k, max_tokens, stop_sequences, frequency/presence penalty, seed, thinking/reasoning_effort (cross-API table), response_format, tools/tool_choice, cache_control, system.

### Changed

- Page title: "...Claude Opus 4.7 + DeepSeek V4 Pro" → "...2026 LLM Ecosystem".
- Module 6 renamed: "DeepSeek V4 Pro" → "Frontier Models 2026".
- Footer: cites Anthropic + OpenAI + Google + DeepSeek + Moonshot + Alibaba + Zhipu + MiniMax + Mistral + Meta + OpenCode + DAIR.AI.

### Fixed

- i18n module title cache snapshot moved to init time so EN→ES restore doesn't capture English values overwriting Spanish originals.
- Spanish lang-blocks: real-case system prompts (s48–s51), patterns (s43), thinking guidance (s23), structured outputs (s38), caching (s39), RAG prompt (s45), multi-turn (s47) translated from English to Spanish.

---

## [1.2.0] — 2026-05-07

### Added

- **Bilingual content infrastructure**: each section body wrapped in parallel `<div class="lang-block" data-lang="es|en">` blocks. CSS toggles visibility based on `html[data-i18n-lang]`. Untranslated sections fall back to ES.
- **Module 1 fully translated** (s1–s5) end-to-end.

### Fixed

- Sidebar bug: switching ES → EN → ES no longer leaves stale English text stacked with Spanish.

---

## [1.1.0] — 2026-05-06

### Added

- Bando B (Practical Workshop): My Project, Prompt Linter, Library, Evolution, Anti-patterns, Cheatsheet.

---

## [1.0.0] — 2026-05-05

Initial public release.
