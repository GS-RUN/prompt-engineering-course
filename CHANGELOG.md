# Changelog

All notable changes to this course are documented here. Format inspired by [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.2.5] — 2026-05-08

### Fixed — quiz options containing < / > were eaten by the HTML parser

`renderQuiz` was inserting `q.question`, each `opt` and `q.explanation`
via raw template-literal interpolation. Anything that looked like a
tag was parsed as HTML. Two examples surfaced:

- `quiz4` option A and explanation: `~/.claude/skills/<name>/SKILL.md`
  rendered with `<name>` swallowed by the parser, so the user saw
  `~/.claude/skills//SKILL.md` (a chunk vanished mid-string).
- `kc04-3` explanation: `<user_input>...</user_input>` was rendered as
  empty tags instead of the literal XML the explanation refers to.

Two other places had the bug worked around by manually entity-escaping
in the source data — `kc06-2` question and `kc12-2` option D, both
containing `&lt;1` / `&lt;10K`. After this fix the source can hold
plain `<` and the renderer escapes safely.

- Added a small `esc()` helper inside `QuizEngine.renderQuiz` and
  applied it to question, options and explanation. Click handler
  already used `textContent` so it was safe.
- Cleaned the two pre-escaped strings to plain `<`.

## [2.2.4] — 2026-05-08

### Fixed — stale quiz selections after the 2.2.3 rebalance

The 2.2.3 rebalance shifted correct-answer indices, but
`localStorage` quiz state was indexed by position (`'correct'`,
`'0'`, `'1'`, …). Returning users saw the OLD selections painted
on the NEW layout — the green checkmark moved to the new correct
position, but a previously clicked wrong index could now sit on a
totally unrelated option, producing nonsensical "wrong" highlights.

- `QUIZ_SCHEMA_VERSION = '2'` constant added at the top of
  `js/quiz.js`. On load, `QuizEngine.migrateState()` compares the
  stored schema version against the current one and, on mismatch,
  wipes every `quiz_*` key (excluding the version key itself) and
  records the new schema version. Wrapped in try/catch so private-
  mode browsers without `localStorage` no-op cleanly.
- Cost: returning users lose past quiz answers once. Acceptable —
  the alternative is incoherent UI for everyone who used the course
  before today.

## [2.2.3] — 2026-05-08

### Fixed — answer-position bias in all 92 quizzes

A reader noticed that finishing Block V's knowledge check meant marking
B five times in a row. An audit confirmed a strong bias across the full
course: of 92 multiple-choice questions, the correct answer was in
position B in 62 (67%), C in 25 (27%), and only 2 in A and 3 in D.
Several blocks had 5/5 or 4/5 of their kc questions answered by B —
enough that an attentive student stopped reading the options after
two or three quizzes.

This is a known pathology when questions are drafted with LLM
assistance: the model tends to write the correct answer second and
fill distractors around it. Left unchecked, it undermines the academic
posture the course claims.

- **`js/quiz.js`:** for every question, the correct option's position
  was reassigned via a deterministic seeded shuffle of round-robin
  slots (0,1,2,3,0,1,2,3,…). Distribution now exactly **23/23/23/23
  across the 92 questions**.
- **No content changed.** Each correct answer is still the same string;
  only its index inside `options[]` moved, and `correct:` was updated
  to match. Explanations untouched.
- **`scripts/rebalance_quiz_answers.js`:** committed the one-shot
  rewrite tool with the seed used. Running it again is a no-op once
  the file is balanced; it can be re-run safely if new questions are
  added later.

## [2.2.2] — 2026-05-08

### Added — Block V: file-based governance as an alternative posture

Reader feedback (sintmk on r/PromptEngineering) flagged that Block V
covers in-prompt scaffolding (CLAUDE.md / AGENTS.md, skills, system
messages, tool descriptions) without contrasting it against the
file-based-governance school of thought, which keeps authority outside
the prompt in versioned artifacts the agent consults.

- **New section 4.4-bis "Authority-in-files: an alternative posture"**
  inserted between §4.4 (CLAUDE.md / AGENTS.md) and §4.5 (Roles).
  Bilingual ES + EN. Introduces DMF (Drift Management Framework) and
  its four invariants (authority-in-files, halt on conflict, halt on
  missing authority, label inference). Closes with the practical
  heuristic: scaffold the prompt when your unit is one call; scaffold
  the project when the agent inhabits it; production usually does both.
- **References:** added `m-public/dmf` to Block V references in
  `js/shared/references.js`, labelled "file-based agent governance" so
  the lookup is readable without clicking through.
- **Manifest:** registered new section id `s19b` in the Block V
  sections array.

## [2.2.1] — 2026-05-08

### Changed — capstone stacks now use latest available models + hardware

User feedback: project stacks were referencing outdated specifics
(text-embedding-3-small from 2024, hardware ladder weighted toward
RTX 4090 / Mac M3 / A100). Block XIV updated:

- **New "Model + hardware version policy" card** at the top of the
  capstone intro (ES + EN). States explicitly: always use the latest
  available version of each model family; pin exact version in
  production for reproducibility; if a new GPU/Mac generation has
  shipped, that's the new target. Course authors will keep updating;
  readers should open issues if anything mentioned is no longer the
  freshest.
- **Project A (Code Review Bot):** stack note now says "use latest
  available". Python bumped to 3.12+. Fallback chain explicitly mixes
  providers (Anthropic → OpenAI → DeepSeek) to avoid single-point-
  of-failure. Observability adds Langfuse alongside Helicone.
- **Project B (RAG Knowledge Assistant):** embeddings line rewritten
  to recommend `text-embedding-4`, Cohere `embed-v4`, Voyage `voyage-3`,
  NVIDIA `NV-Embed-v2` (latest gen of each provider) instead of the
  old `text-embedding-3-small`. Note about higher-dimensional embeddings
  lifting retrieval +3-5pp. Vector DB note recommends current LTS
  (Qdrant 2.x, Milvus 2.5+, etc.). Re-ranker now mentions Cohere Rerank
  v4. Frameworks pinned to current versions (LangChain 0.3+,
  LlamaIndex 0.13+, Instructor 1.7+).
- **Project C (Local Self-Hosted Assistant):** hardware tiers
  rebuilt around 2026-current generation — RTX 5090 (32 GB GDDR7) as
  the primary "recommended" tier instead of RTX 4090; Mac M4 Pro/Max
  as the Apple primary; RTX PRO 6000 Blackwell (96 GB) as workstation
  step-up; H100/H200 (with B200/GB200 mention) as datacenter. RTX 4090
  kept as floor since it's still viable. New "Edge / on-device" tier
  (Mac mini M4 Pro, iPad Pro M5) for Gemma 3 / Phi-5 mini at &lt;10W.
  Closing note: hardware ladders stay roughly stable across
  generations — substitute model and tier names as new gen ships.
- **Project D (Multi-Agent Research Team):** orchestration libs
  pinned to current versions. Each role explicitly described as a
  TIER (fast-cheap / balance / top-frontier) with current 2026 models
  named as instances of that tier. Closing note about tier-mixing
  pattern surviving model generation changes.

### Rationale

A capstone spec that names obsolete tools loses didactic value within
6-12 months. The new approach: **name the tier, name the current
instance of that tier, instruct the reader to substitute upward**. Same
philosophy already used in 8.1-8.8 (cross-model patterns) — extended
here for consistency.

### Manifest

- Course version 2.2.0 → 2.2.1.

---

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
