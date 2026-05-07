/* ============================================================
   Side-by-side Prompt Evolution — visualiza v1→v2→v3→v4
   © Alonso J. Núñez · GS·RUN
   ============================================================ */

const Evolution = {
  scenarios: {
    'editor': {
      title: '✍️ Editor de texto profesional',
      versions: [
        {
          step: 'v1 · Zero-shot básico',
          prompt: 'Edita este texto.',
          improvements: ['Punto de partida — funciona pero es ambiguo', 'El modelo decide TODO sin guía'],
        },
        {
          step: 'v2 · +Role + Instrucciones',
          prompt: 'Eres editor profesional con 15 años de experiencia. Edita el siguiente texto eliminando: jerga, voz pasiva innecesaria, redundancia, adjetivos vacíos. Mantén la voz del autor.',
          improvements: [
            'Role asignado → tono profesional consistente',
            'Lista explícita de qué eliminar → menos arbitrariedad',
            'Cláusula "mantén la voz" → preserva intención original',
          ],
        },
        {
          step: 'v3 · +XML + Few-shot',
          prompt: `Eres editor profesional. Edita siguiendo estas reglas:

<rules>
- Elimina: jerga, voz pasiva innecesaria, redundancia, adjetivos vacíos
- Preserva: voz del autor, datos, citas literales
</rules>

<example>
<input>El proceso fue completado de manera exitosa por el equipo</input>
<output>El equipo completó el proceso con éxito</output>
</example>

<text>
{TEXTO}
</text>`,
          improvements: [
            'Estructura XML separa reglas de input → modelo no confunde',
            'Few-shot con un ejemplo concreto → patrón claro',
            'Placeholder explícito {TEXTO} → reusable como template',
          ],
        },
        {
          step: 'v4 · +Output schema + Diff explicado',
          prompt: `Eres editor profesional. Edita siguiendo estas reglas:

<rules>
- Elimina: jerga, voz pasiva innecesaria, redundancia, adjetivos vacíos
- Preserva: voz del autor, datos, citas literales
- Si el texto YA está bien escrito, di "Sin cambios necesarios"
</rules>

<example>
<input>El proceso fue completado de manera exitosa por el equipo</input>
<output>{
  "edited": "El equipo completó el proceso con éxito",
  "changes": [
    {"type": "voz_pasiva", "original": "fue completado por el equipo", "fix": "el equipo completó"},
    {"type": "redundancia", "original": "de manera exitosa", "fix": "con éxito"}
  ]
}</output>
</example>

<text>
{TEXTO}
</text>

Devuelve SOLO el JSON, sin markdown wrapper.`,
          improvements: [
            'Output JSON parseable → integración programática',
            'Cada cambio justificado → auditable',
            'Cláusula "ya está bien" → evita edits innecesarios (anti-confabulation)',
            'Schema consistente → output validable contra esquema',
          ],
        },
      ],
    },
    'extractor': {
      title: '📊 Extractor de datos estructurado',
      versions: [
        {
          step: 'v1 · Zero-shot',
          prompt: 'Extrae el nombre, email y teléfono del siguiente texto.',
          improvements: ['Punto de partida', 'Output libre = parsing impredecible'],
        },
        {
          step: 'v2 · +Format JSON',
          prompt: `Extrae nombre, email y teléfono del texto. Responde en JSON:
{ "name": "...", "email": "...", "phone": "..." }`,
          improvements: ['Output parseable', 'Pero NO maneja datos faltantes — alucina si email no está'],
        },
        {
          step: 'v3 · +Schema + Uncertainty',
          prompt: `Extrae los siguientes campos del texto. Si un campo NO está presente, usa null. Nunca inventes.

<schema>
{
  "name": "string",
  "email": "string|null",
  "phone": "string|null"
}
</schema>

Devuelve SOLO el JSON.`,
          improvements: [
            'Schema explícito → estructura garantizada',
            'Cláusula null → anti-hallucination',
            '"Nunca inventes" → instrucción directa contra fabricación',
          ],
        },
        {
          step: 'v4 · +Few-shot + Normalización',
          prompt: `Extrae nombre, email y teléfono del texto. Si un campo NO está, usa null.

<schema>
{
  "name": "string",
  "email": "string|null (lowercased)",
  "phone": "string|null (E.164 si país inferible)"
}
</schema>

<example>
<input>Llamadme Juan, mi correo es Juan.PEREZ@gmail.com, móvil 654 12 34 56</input>
<output>{"name": "Juan", "email": "juan.perez@gmail.com", "phone": "+34654123456"}</output>
</example>

<example>
<input>Hola, soy María García de Madrid</input>
<output>{"name": "María García", "email": null, "phone": null}</output>
</example>

<text>{TEXTO}</text>

Devuelve SOLO el JSON.`,
          improvements: [
            'Few-shot con normalización → email lowercased, phone E.164',
            'Ejemplo con campo ausente → refuerza patrón null',
            '2 ejemplos diversos → cubre casos completos e incompletos',
            'Output: 0% probabilidad de hallucinar emails inventados',
          ],
        },
      ],
    },
    'tutor': {
      title: '🎓 Tutor adaptativo',
      versions: [
        {
          step: 'v1 · Zero-shot',
          prompt: 'Explícame qué es la recursión.',
          improvements: ['Explicación generic, sin saber tu nivel', 'Ni adaptativa ni interactiva'],
        },
        {
          step: 'v2 · +Role + Audiencia',
          prompt: 'Eres tutor de programación. Explica recursión a un programador junior que conoce Python pero nunca la ha usado. Usa 1 analogía cotidiana + 1 ejemplo de código.',
          improvements: [
            'Role + nivel → respuesta calibrada',
            'Estructura mínima (analogía + código) → consistencia',
          ],
        },
        {
          step: 'v3 · +CoT + Verificación',
          prompt: `Eres tutor experto. Voy a aprender RECURSIÓN.

Paso 1: Explica con UNA analogía cotidiana (sin código).
Paso 2: Espera mi entendimiento ("entendido" / "no entiendo").
Paso 3: Si entendí, da ejemplo Python con stack trace dibujado.
Paso 4: Pregunta: "¿qué pasaría si quitamos la condición base?".
Paso 5: Sin darme la respuesta, guía con preguntas.

Empieza por paso 1.`,
          improvements: [
            'Pasos numerados → secuencia controlada',
            'Pregunta de verificación → checkpoint comprensión',
            'Pregunta socrática final → activa razonamiento del alumno',
          ],
        },
        {
          step: 'v4 · +Adaptación + Feynman',
          prompt: `Eres tutor experto en CS. Aprendiendo: RECURSIÓN.

Modo Feynman: yo te explicaré después; tu trabajo es detectar gaps.

Paso 1: Una analogía cotidiana (sin código).
Paso 2: Pídeme explicarlo con MIS palabras.
Paso 3: Detecta:
   - Conceptos que mencioné correctamente ✅
   - Conceptos que omití o malinterpreté ❌
   - Confusiones implícitas (ej. "loop" cuando debería decir "auto-llamada")

Paso 4: Hazme 1-2 preguntas Socráticas que expongan los gaps.
   NO me digas la respuesta. Guía.

Paso 5: Si todo correcto, sube nivel: edge case real
   ("¿qué pasa con recursión > 1000 niveles en Python?").

Reglas:
- Tono: amable pero directo. No suaves errores.
- Si en Paso 3 detectas confusión grave, vuelve al Paso 1 con otra analogía.

Empieza por paso 1.`,
          improvements: [
            'Método Feynman → alumno explica, tutor detecta gaps',
            'Reglas explícitas (tono, escalation) → consistencia entre sesiones',
            'Loop adaptativo → vuelve atrás si hay confusión',
            'Edge case real al final → conecta teoría con problema práctico',
          ],
        },
      ],
    },
  },

  state: { scenario: 'editor', stepIdx: 0 },

  init() {
    this.render();
    this.attachHandlers();
  },

  attachHandlers() {
    document.addEventListener('change', (e) => {
      if (e.target.id === 'evo-scenario') {
        this.state.scenario = e.target.value;
        this.state.stepIdx = 0;
        this.renderContent();
      }
    });
    document.addEventListener('click', (e) => {
      const step = e.target.closest('.evo-step');
      if (step) {
        this.state.stepIdx = parseInt(step.dataset.idx);
        this.renderContent();
      }
    });
  },

  render() {
    const root = document.getElementById('evolution-root');
    if (!root) return;
    const opts = Object.entries(this.scenarios).map(([k,v]) => `<option value="${k}">${v.title}</option>`).join('');
    root.innerHTML = `
      <div style="margin-bottom:14px;">
        <label style="display:block;font-size:12px;color:var(--text-dim);margin-bottom:6px;">Escenario:</label>
        <select id="evo-scenario" style="background:var(--bg-code);color:var(--text);border:1px solid var(--glass-border);border-radius:var(--radius-sm);padding:8px 12px;font-family:var(--font);font-size:13px;">
          ${opts}
        </select>
      </div>
      <div id="evo-stepper" class="evolution-stepper"></div>
      <div id="evo-content"></div>
    `;
    this.renderContent();
  },

  renderContent() {
    const sc = this.scenarios[this.state.scenario];
    if (!sc) return;
    const stepper = document.getElementById('evo-stepper');
    const content = document.getElementById('evo-content');
    if (!stepper || !content) return;

    stepper.innerHTML = sc.versions.map((v, i) =>
      `<button class="evo-step ${i === this.state.stepIdx ? 'active' : ''}" data-idx="${i}">${v.step.split('·')[0].trim()}</button>`
    ).join('');

    const cur = sc.versions[this.state.stepIdx];
    const prev = this.state.stepIdx > 0 ? sc.versions[this.state.stepIdx - 1] : null;

    content.innerHTML = `
      <div class="evo-content">
        ${prev ? `
          <div class="evo-col">
            <h4>← ${prev.step}</h4>
            <pre>${escapeHtmlEv(prev.prompt)}</pre>
          </div>` : `
          <div class="evo-col">
            <h4>(Inicio)</h4>
            <pre style="color:var(--text-muted);font-style:italic;">El primer paso. No hay versión anterior.</pre>
          </div>`}
        <div class="evo-col">
          <h4>→ ${cur.step}</h4>
          <pre>${escapeHtmlEv(cur.prompt)}</pre>
        </div>
      </div>
      <div class="evo-improvements">
        <h5>✨ ${prev ? 'Mejoras vs versión anterior' : 'Notas de partida'}:</h5>
        <ul>${cur.improvements.map(i => `<li>${i}</li>`).join('')}</ul>
      </div>
    `;
  },
};

function escapeHtmlEv(s) {
  return String(s||'').replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

document.addEventListener('DOMContentLoaded', () => Evolution.init());
window.Evolution = Evolution;
