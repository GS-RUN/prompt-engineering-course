/* ============================================================
   Animated Diagrams — Canvas-based interactive visuals
   ============================================================ */
class DiagramEngine {
  constructor() {
    this.canvases = {};
    this.animFrames = {};
    this.init();
  }

  init() {
    this.setupPromptFlow();
    this.setupAgentArch();
    this.setupSkillVsAgent();
  }

  setupPromptFlow() {
    const canvas = document.getElementById('diagram-prompt-flow');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.parentElement.clientWidth;
    const H = 320;
    canvas.width = W * 2; canvas.height = H * 2;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.scale(2, 2);
    this.canvases.promptFlow = { ctx, W, H, time: 0 };
    this.animatePromptFlow();
  }

  animatePromptFlow() {
    const { ctx, W, H } = this.canvases.promptFlow || {};
    if (!ctx) return;

    this.canvases.promptFlow.time += 0.02;
    const t = this.canvases.promptFlow.time;
    ctx.clearRect(0, 0, W, H);

    const boxes = [
      { x: W/2, y: 15, w: 280, h: 34, label: 'Human Input', color: '#b4a078' },
      { x: W/2, y: 65, w: 280, h: 34, label: 'System Prompt + AGENTS.md', color: '#c48868' },
      { x: W/2, y: 115, w: 280, h: 34, label: 'Tool Definitions Injected', color: '#8a9078' },
      { x: W/2, y: 165, w: 280, h: 34, label: 'LLM Processing (Thinking)', color: '#c4a888' },
      { x: W/2 - 100, y: 225, w: 180, h: 34, label: 'Text Response', color: '#9a9488' },
      { x: W/2 + 100, y: 225, w: 180, h: 34, label: 'Tool Call → Loop', color: '#d4a853' },
      { x: W/2, y: 275, w: 280, h: 34, label: 'Output to User', color: '#b4a078' },
    ];

    boxes.forEach((box, i) => {
      const pulse = Math.sin(t * 3 + i) * 0.15 + 0.85;
      ctx.fillStyle = box.color.replace(')', `,${pulse})`).replace('rgb', 'rgba');
      if (!box.color.includes('rgb')) {
        ctx.fillStyle = box.color + '40';
      }
      ctx.strokeStyle = box.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      this.roundRect(ctx, box.x - box.w/2, box.y, box.w, box.h, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#e4e4f0';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(box.label, box.x, box.y + box.h/2 + 4);
    });

    // Animated arrows
    for (let i = 0; i < 6; i++) {
      const by = boxes[i].y + boxes[i].h;
      const nx = i === 4 ? boxes[4].x : i === 5 ? boxes[5].x : boxes[i+1].x;
      const ny = boxes[i+1].y;
      const alpha = 0.4 + Math.sin(t * 4 + i) * 0.3;
      ctx.strokeStyle = `rgba(108,92,231,${alpha})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = -t * 40;
      ctx.beginPath();
      if (i === 3) {
        ctx.moveTo(boxes[3].x, by);
        ctx.lineTo(boxes[4].x, ny);
        ctx.moveTo(boxes[3].x, by);
        ctx.lineTo(boxes[5].x, ny);
      } else {
        ctx.moveTo(boxes[i].x, by);
        ctx.lineTo(nx, ny);
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Animated particles along arrows
    for (let i = 0; i < 8; i++) {
      const prog = ((t * 60 + i * 20) % 100) / 100;
      const seg = Math.floor(prog * 6);
      const local = (prog * 6) % 1;
      if (seg < 6) {
        const by = boxes[seg].y + boxes[seg].h;
        let nx, ny;
        if (seg === 3) {
          const side = i % 2 === 0 ? 4 : 5;
          nx = boxes[side].x; ny = boxes[side].y;
        } else {
          nx = boxes[seg+1].x; ny = boxes[seg+1].y;
        }
        const px = boxes[seg].x + (nx - boxes[seg].x) * local;
        const py = by + (ny - by) * local;
        ctx.fillStyle = `rgba(0,206,201,0.8)`;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    requestAnimationFrame(() => this.animatePromptFlow());
  }

  setupAgentArch() {
    const canvas = document.getElementById('diagram-agent-arch');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.parentElement.clientWidth;
    const H = 280;
    canvas.width = W * 2; canvas.height = H * 2;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.scale(2, 2);
    this.canvases.agentArch = { ctx, W, H, time: 0 };
    this.animateAgentArch();
  }

  animateAgentArch() {
    const { ctx, W, H } = this.canvases.agentArch || {};
    if (!ctx) return;
    this.canvases.agentArch.time += 0.015;
    const t = this.canvases.agentArch.time;

    ctx.clearRect(0, 0, W, H);

    // Main agent box
    const mx = W/2; const my = H/2;
    ctx.strokeStyle = '#b4a078';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(108,92,231,0.08)';
    this.roundRect(ctx, mx - 160, my - 55, 320, 110, 10);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#e4e4f0';
    ctx.font = 'bold 13px Inter'; ctx.textAlign = 'center';
    ctx.fillText('AGENTE PRINCIPAL', mx, my - 30);
    ctx.font = '10px Inter'; ctx.fillStyle = '#8888a8';
    ctx.fillText('LLM + System Prompt + AGENTS.md', mx, my - 12);

    // Sub-agents
    const subs = [
      { x: mx - 180, y: my - 15, label: 'Explore', color: '#a09888' },
      { x: mx, y: my - 15, label: 'Plan', color: '#c4a888' },
      { x: mx + 180, y: my - 15, label: 'Execute', color: '#d4a853' },
    ];
    subs.forEach((s, i) => {
      const pulse = 0.7 + Math.sin(t * 2 + i * 2) * 0.3;
      ctx.fillStyle = s.color.replace(')', `,${pulse * 0.2})`).replace('rgb', 'rgba');
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 1;
      this.roundRect(ctx, s.x - 55, s.y + 25, 110, 30, 6);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e4e4f0';
      ctx.font = '10px Inter';
      ctx.fillText(s.label, s.x, s.y + 45);

      // Connection lines
      ctx.strokeStyle = s.color + '40';
      ctx.setLineDash([3, 3]);
      ctx.lineDashOffset = -t * 30;
      ctx.beginPath();
      ctx.moveTo(mx, my + 55);
      ctx.lineTo(s.x, s.y + 25);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Tools orbiting
    const tools = ['Read', 'Write', 'Edit', 'Bash', 'Grep', 'Glob', 'Task', 'MCP'];
    tools.forEach((tool, i) => {
      const angle = t + (i / tools.length) * Math.PI * 2;
      const r = 100;
      const tx = mx + Math.cos(angle) * r;
      const ty = my - 15 + Math.sin(angle) * r * 0.6;
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      this.roundRect(ctx, tx - 20, ty - 8, 40, 16, 4);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#888';
      ctx.font = '8px Inter';
      ctx.fillText(tool, tx, ty + 4);
    });

    requestAnimationFrame(() => this.animateAgentArch());
  }

  setupSkillVsAgent() {
    const canvas = document.getElementById('diagram-skill-vs');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.parentElement.clientWidth;
    const H = 240;
    canvas.width = W * 2; canvas.height = H * 2;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.scale(2, 2);
    this.canvases.skillVs = { ctx, W, H, time: 0 };
    this.animateSkillVs();
  }

  animateSkillVs() {
    const { ctx, W, H } = this.canvases.skillVs || {};
    if (!ctx) return;
    this.canvases.skillVs.time += 0.02;
    const t = this.canvases.skillVs.time;

    ctx.clearRect(0, 0, W, H);

    const rows = [
      { y: 50, label: 'Prompt Directo', icon: '💬', items: [{ x: W/2, w: 200, color: '#b4a078', text: 'Una vez' }] },
      { y: 110, label: 'Skill', icon: '📄', items: [
        { x: W/2-180, w: 160, color: '#c48868', text: 'Reutilizable' },
        { x: W/2, w: 160, color: '#8a9078', text: 'Archivo .md' },
        { x: W/2+180, w: 160, color: '#c4a888', text: '/comando' }
      ]},
      { y: 170, label: 'Sub-agente', icon: '🤖', items: [
        { x: W/2-180, w: 160, color: '#d4a853', text: 'Aislado' },
        { x: W/2, w: 160, color: '#a09888', text: 'Paralelo' },
        { x: W/2+180, w: 160, color: '#9a9488', text: 'Tools limitadas' }
      ]},
    ];

    rows.forEach((row, ri) => {
      ctx.fillStyle = '#8888a8';
      ctx.font = '11px Inter'; ctx.textAlign = 'left';
      ctx.fillText(row.icon + ' ' + row.label, 30, row.y + 5);

      row.items.forEach((item, ii) => {
        const pulse = 0.7 + Math.sin(t * 3 + ri + ii) * 0.3;
        ctx.fillStyle = item.color.replace(')', `,${pulse * 0.2})`).replace('rgb', 'rgba');
        ctx.strokeStyle = item.color;
        ctx.lineWidth = 1;
        this.roundRect(ctx, item.x - item.w/2, row.y - 8, item.w, 26, 6);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e4e4f0';
        ctx.font = '10px Inter'; ctx.textAlign = 'center';
        ctx.fillText(item.text, item.x, row.y + 9);
      });
    });

    requestAnimationFrame(() => this.animateSkillVs());
  }

  roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

window.DiagramEngine = DiagramEngine;
