/* ============================================================
   Per-block references — official documentation, papers, RFCs
   ============================================================ */

(function () {
  const REFS = {
    '01': [
      { label: 'Anthropic — Claude Models Overview', url: 'https://docs.anthropic.com/en/docs/about-claude/models' },
      { label: 'Vaswani et al. — Attention Is All You Need (2017)', url: 'https://arxiv.org/abs/1706.03762' },
      { label: 'OpenAI — Tokenizer + tiktoken', url: 'https://github.com/openai/tiktoken' },
      { label: 'Hugging Face — Transformers crash course', url: 'https://huggingface.co/learn/nlp-course/chapter1/1' },
      { label: 'Artificial Analysis — Models Index 2026', url: 'https://artificialanalysis.ai/models' }
    ],
    '02': [
      { label: 'Anthropic — Prompt Engineering Overview', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
      { label: 'Anthropic — Use XML tags', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags' },
      { label: 'OpenAI — Prompt Engineering Guide', url: 'https://platform.openai.com/docs/guides/prompt-engineering' },
      { label: 'DAIR.AI — Prompt Engineering Guide', url: 'https://www.promptingguide.ai/' },
      { label: 'Wei et al. — Chain-of-Thought Prompting (2022)', url: 'https://arxiv.org/abs/2201.11903' },
      { label: 'Brown et al. — Language Models are Few-Shot Learners (GPT-3, 2020)', url: 'https://arxiv.org/abs/2005.14165' }
    ],
    '03': [
      { label: 'Anthropic — Extended Thinking', url: 'https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking' },
      { label: 'OpenAI — Reasoning models guide', url: 'https://platform.openai.com/docs/guides/reasoning' },
      { label: 'Yao et al. — ReAct: Synergizing Reasoning and Acting (2022)', url: 'https://arxiv.org/abs/2210.03629' },
      { label: 'Anthropic — Tool use overview', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview' },
      { label: 'OpenAI — Function calling', url: 'https://platform.openai.com/docs/guides/function-calling' },
      { label: 'Google — Gemini multimodal prompting', url: 'https://ai.google.dev/gemini-api/docs/vision' }
    ],
    '04': [
      { label: 'Anthropic — Prompt caching', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching' },
      { label: 'Anthropic — Structured outputs via tool use', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview#json-mode' },
      { label: 'OpenAI — Structured Outputs', url: 'https://platform.openai.com/docs/guides/structured-outputs' },
      { label: 'OWASP — Top 10 for LLM Applications', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/' },
      { label: 'Greshake et al. — Indirect Prompt Injection (2023)', url: 'https://arxiv.org/abs/2302.12173' },
      { label: 'Anthropic — Building evaluations', url: 'https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/develop-tests' }
    ],
    '05': [
      { label: 'Anthropic — Building effective AI agents', url: 'https://www.anthropic.com/engineering/building-effective-agents' },
      { label: 'Anthropic — Claude Code overview', url: 'https://docs.claude.com/en/docs/claude-code/overview' },
      { label: 'Anthropic — Skills documentation', url: 'https://docs.claude.com/en/docs/claude-code/skills' },
      { label: 'Anthropic — Sub agents', url: 'https://docs.claude.com/en/docs/claude-code/sub-agents' },
      { label: 'MCP — Model Context Protocol spec', url: 'https://modelcontextprotocol.io/' },
      { label: 'OpenCode docs', url: 'https://opencode.ai/docs/' },
      { label: 'CrewAI documentation', url: 'https://docs.crewai.com/' },
      { label: 'AutoGen (Microsoft) documentation', url: 'https://microsoft.github.io/autogen/' },
      { label: 'LangGraph documentation', url: 'https://langchain-ai.github.io/langgraph/' }
    ],
    '06': [
      { label: 'LangChain — RAG conceptual guide', url: 'https://python.langchain.com/docs/concepts/rag/' },
      { label: 'LlamaIndex — Building RAG', url: 'https://docs.llamaindex.ai/en/stable/understanding/' },
      { label: 'Pinecone — Vector DB primer', url: 'https://www.pinecone.io/learn/vector-database/' },
      { label: 'vLLM project', url: 'https://docs.vllm.ai/' },
      { label: 'Hugging Face — Text Generation Inference', url: 'https://huggingface.co/docs/text-generation-inference' },
      { label: 'SGLang documentation', url: 'https://docs.sglang.ai/' },
      { label: 'Karpukhin et al. — Dense Passage Retrieval (2020)', url: 'https://arxiv.org/abs/2004.04906' }
    ],
    '07': [
      { label: 'Ollama documentation', url: 'https://github.com/ollama/ollama/blob/main/docs/README.md' },
      { label: 'llama.cpp project', url: 'https://github.com/ggerganov/llama.cpp' },
      { label: 'Apple MLX framework', url: 'https://ml-explore.github.io/mlx/' },
      { label: 'Hugging Face — GGUF / Quantization', url: 'https://huggingface.co/docs/hub/gguf' },
      { label: 'Frantar et al. — GPTQ (2022)', url: 'https://arxiv.org/abs/2210.17323' },
      { label: 'Lin et al. — AWQ (2023)', url: 'https://arxiv.org/abs/2306.00978' },
      { label: 'Dettmers et al. — QLoRA (2023)', url: 'https://arxiv.org/abs/2305.14314' },
      { label: 'Unsloth — fine-tuning fast', url: 'https://docs.unsloth.ai/' },
      { label: 'EU GDPR official text', url: 'https://gdpr-info.eu/' }
    ],
    '08': [
      { label: 'Anthropic vs OpenAI vs Google — capability comparison (Artificial Analysis)', url: 'https://artificialanalysis.ai/' },
      { label: 'OpenRouter — multi-provider routing', url: 'https://openrouter.ai/docs' },
      { label: 'LiteLLM — unified LLM interface', url: 'https://docs.litellm.ai/' },
      { label: 'PortKey — AI gateway + fallbacks', url: 'https://portkey.ai/docs' }
    ],
    '09': [
      { label: 'LMSys — Chatbot Arena Leaderboard', url: 'https://lmarena.ai/' },
      { label: 'Hugging Face — Open LLM Leaderboard', url: 'https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard' },
      { label: 'SWE-bench', url: 'https://www.swebench.com/' },
      { label: 'Hendrycks et al. — Measuring Massive Multitask Language Understanding (MMLU, 2020)', url: 'https://arxiv.org/abs/2009.03300' },
      { label: 'Chen et al. — HumanEval (2021)', url: 'https://arxiv.org/abs/2107.03374' },
      { label: 'Rein et al. — GPQA (2023)', url: 'https://arxiv.org/abs/2311.12022' },
      { label: 'Chollet — ARC-AGI', url: 'https://arcprize.org/' }
    ],
    '10': [
      { label: 'Anthropic — Responsible Scaling Policy', url: 'https://www.anthropic.com/responsible-scaling-policy' },
      { label: 'OpenAI — Safety best practices', url: 'https://platform.openai.com/docs/guides/safety-best-practices' },
      { label: 'EU AI Act — official site', url: 'https://artificialintelligenceact.eu/' },
      { label: 'NIST AI Risk Management Framework', url: 'https://www.nist.gov/itl/ai-risk-management-framework' },
      { label: 'Bai et al. — Constitutional AI (2022)', url: 'https://arxiv.org/abs/2212.08073' },
      { label: 'Lin et al. — TruthfulQA (2021)', url: 'https://arxiv.org/abs/2109.07958' }
    ],
    '11': [
      { label: 'Anthropic — Customer use cases', url: 'https://www.anthropic.com/customers' },
      { label: 'Stripe — AI agents in production', url: 'https://stripe.com/blog/topics/engineering' },
      { label: 'Med-PaLM 2 paper', url: 'https://arxiv.org/abs/2305.09617' },
      { label: 'BloombergGPT paper (2023)', url: 'https://arxiv.org/abs/2303.17564' }
    ],
    '12': [
      { label: 'OpenAI — Research index', url: 'https://openai.com/research/' },
      { label: 'Anthropic — Research', url: 'https://www.anthropic.com/research' },
      { label: 'Google DeepMind — Research', url: 'https://deepmind.google/research/' },
      { label: 'arxiv-sanity — recent CS.CL papers', url: 'http://www.arxiv-sanity.com/' }
    ],
    '13': [],
    '14': [],
    'tools': [
      { label: 'tiktoken (OpenAI)', url: 'https://github.com/openai/tiktoken' },
      { label: 'Anthropic — Token counting endpoint', url: 'https://docs.anthropic.com/en/api/messages-count-tokens' }
    ]
  };

  document.querySelectorAll('[data-references]').forEach(node => {
    const blockId = node.dataset.references;
    const refs = REFS[blockId] || [];
    if (refs.length === 0) {
      node.parentElement?.style && (node.parentElement.style.display = 'none');
      return;
    }
    node.innerHTML = refs.map(r =>
      `<li><a href="${r.url}" target="_blank" rel="noopener">${r.label}</a></li>`
    ).join('\n');
  });
})();
