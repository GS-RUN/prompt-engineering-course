/* ============================================================
   Interactive Exercises Module
   ============================================================ */
class ExerciseEngine {
  constructor() {
    this.exercises = {};
    this.init();
  }

  init() {
    this.setupEx1();
    this.setupEx2();
    this.setupEx3();
    this.setupEx4();
  }

  setupEx1() {
    // Exercise 1: Write an effective prompt
    const btn = document.getElementById('ex1-check');
    const input = document.getElementById('ex1-input');
    const output = document.getElementById('ex1-output');
    const scoreBar = document.getElementById('ex1-score-bar');
    const scoreText = document.getElementById('ex1-score-text');
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const text = input.value.trim();
      const score = this.evaluatePromptQuality(text);
      output.classList.add('show');
      scoreBar.style.width = score + '%';

      let color, label, message;
      if (score >= 80) {
        color = 'var(--green)'; label = 'Excelente';
        message = 'Tu prompt es claro, específico y estructurado. El modelo generaría exactamente lo que necesitas.';
      } else if (score >= 50) {
        color = 'var(--accent2)'; label = 'Bueno';
        message = 'Buen avance. Para mejorar: añade más especificidad sobre stack, diseño responsive y manejo de errores.';
      } else if (score >= 25) {
        color = 'var(--yellow)'; label = 'Básico';
        message = 'Necesita más detalles. Especifica: tecnología, funcionalidades concretas, restricciones y formato de salida.';
      } else {
        color = 'var(--red)'; label = 'Insuficiente';
        message = 'Demasiado vago. Un prompt efectivo debe incluir: stack, features, diseño, y restricciones.';
      }

      scoreBar.style.background = color;
      scoreText.textContent = score + '%';
      scoreText.style.color = color;
      output.innerHTML = `<strong style="color:${color}">${label} — ${score}%</strong>\n\n${message}`;
    });
  }

  setupEx2() {
    // Exercise 2: Few-shot examples
    const btn = document.getElementById('ex2-check');
    const input = document.getElementById('ex2-input');
    const output = document.getElementById('ex2-output');
    const scoreBar = document.getElementById('ex2-score-bar');
    const scoreText = document.getElementById('ex2-score-text');
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const text = input.value.trim();
      const examplePattern = /(positive|negative|neutral|mixed|positivo|negativo)/gi;
      const examples = text.match(examplePattern) || [];
      const hasStructure = text.includes('<example') || text.includes('→') || text.includes('//');
      const score = Math.min(100, (examples.length * 18) + (hasStructure ? 30 : 0) + (text.length > 100 ? 20 : 0));

      output.classList.add('show');
      scoreBar.style.width = score + '%';
      const color = score >= 70 ? 'var(--green)' : score >= 40 ? 'var(--yellow)' : 'var(--red)';
      scoreBar.style.background = color;
      scoreText.textContent = score + '%';
      scoreText.style.color = color;

      if (score >= 70) {
        output.innerHTML = `<strong style="color:var(--green)">¡Perfecto!</strong>\n\nHas incluido ${examples.length} etiquetas de ejemplo y buena estructura. El modelo tiene un patrón claro que seguir.`;
      } else if (score >= 40) {
        output.innerHTML = `<strong style="color:var(--yellow)">Aceptable</strong>\n\nAñade 1-2 ejemplos más y estructura cada uno como "review" → "sentiment".`;
      } else {
        output.innerHTML = `<strong style="color:var(--red)">Incompleto</strong>\n\nFew-shot requiere EJEMPLOS concretos. Formato: "Review: texto" → Sentiment: positivo`;
      }
    });
  }

  setupEx3() {
    // Exercise 3: Chain of Thought
    const btn = document.getElementById('ex3-check');
    const input = document.getElementById('ex3-input');
    const output = document.getElementById('ex3-output');
    const scoreBar = document.getElementById('ex3-score-bar');
    const scoreText = document.getElementById('ex3-score-text');
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const text = input.value.trim();
      const hasCoT = /step by step|paso a paso|pensemos|let'?s think|reason|razona|break down|desglos|think through|step \d|paso \d/i;
      const hasStructure = text.length > 60;
      const match = text.match(hasCoT);
      const score = match ? 70 + Math.min(30, text.length / 5) : (hasStructure ? 20 : 5);

      output.classList.add('show');
      scoreBar.style.width = score + '%';
      const color = score >= 70 ? 'var(--green)' : score >= 30 ? 'var(--yellow)' : 'var(--red)';
      scoreBar.style.background = color;
      scoreText.textContent = score + '%';
      scoreText.style.color = color;

      if (score >= 70) {
        output.innerHTML = `<strong style="color:var(--green)">¡Correcto!</strong>\n\nTu prompt instruye al modelo a razonar paso a paso. Esto mejorará la precisión en un 30-50% en problemas matemáticos y lógicos.`;
      } else {
        output.innerHTML = `<strong style="color:var(--red)">Falta CoT.</strong>\n\nDebes pedir EXPLÍCITAMENTE razonamiento: "Resuelve paso a paso", "Pensemos...", "Break down the problem".`;
      }
    });
  }

  setupEx4() {
    // Exercise 4: Role + XML combo
    const btn = document.getElementById('ex4-check');
    const input = document.getElementById('ex4-input');
    const output = document.getElementById('ex4-output');
    const scoreBar = document.getElementById('ex4-score-bar');
    const scoreText = document.getElementById('ex4-score-text');
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const text = input.value.trim();
      let score = 0;
      if (text.length > 50) score += 20;
      if (/eres|you are|act as|actúa|role/i.test(text)) score += 30;
      if (/<\/?\w+>/.test(text)) score += 30;
      if (/ejemplo|example|ej:/i.test(text)) score += 20;
      score = Math.min(100, score);

      output.classList.add('show');
      scoreBar.style.width = score + '%';
      const color = score >= 60 ? 'var(--green)' : score >= 30 ? 'var(--yellow)' : 'var(--red)';
      scoreBar.style.background = color;
      scoreText.textContent = score + '%';
      scoreText.style.color = color;

      if (score >= 60) {
        output.innerHTML = `<strong style="color:var(--green)">¡Combo perfecto!</strong>\n\nCombinas Role Prompting + XML + ejemplos. Esta es la técnica más poderosa recomendada por Anthropic para Claude Opus 4.7.`;
      } else if (score >= 30) {
        output.innerHTML = `<strong style="color:var(--yellow)">Progresando</strong>\n\nAñade XML tags para estructurar las secciones y un rol claro al inicio.`;
      } else {
        output.innerHTML = `<strong style="color:var(--red)">Básico</strong>\n\nDefine un ROL (ej: "Eres un experto en Python"), usa XML para secciones, y añade 2-3 ejemplos.`;
      }
    });
  }

  evaluatePromptQuality(text) {
    if (text.length < 20) return 5;
    let score = Math.min(30, text.length / 5);

    const keywords = {
      tech: [/react|vue|angular|node|python|javascript|typescript|html|css|sql|mongodb|rest|api/i, 15],
      features: [/login|register|dashboard|form|auth|crud|search|filter|pagination|responsive|dark mode/i, 10],
      constraints: [/error|validation|security|test|performance|accessibility|ie1|browser/i, 10],
      format: [/json|table|list|bullet|markdown|csv|yaml/i, 10],
      structure: [/<instructions>|<format>|<example>|<context>|##\s|step \d/i, 20],
      tone: [/professional|concise|detailed|creative|formal|casual|academic/i, 5],
    };

    for (const [key, [pattern, points]] of Object.entries(keywords)) {
      if (pattern.test(text)) score += points;
    }

    return Math.min(100, Math.round(score));
  }
}

window.ExerciseEngine = ExerciseEngine;
