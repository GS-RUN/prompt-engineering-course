/* ============================================================
   Three.js 3D Background — Optimized for performance
   ============================================================ */
class NeuralBg {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.nodes = [];
    this.lines = [];
    this.particles = null;
    this.clock = new THREE.Clock();
    this.mouseX = 0;
    this.mouseY = 0;
    this.init();
  }

  init() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setClearColor(0x000000, 0);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.5, 80);
    this.camera.position.z = 28;

    this.createNodes();
    this.createLines();
    this.createParticles();

    // Single ambient point light — no overhead
    const light = new THREE.PointLight(0x6c5ce7, 0.6, 40);
    light.position.set(0, 0, 15);
    this.scene.add(light);

    window.addEventListener('resize', () => this.onResize());
    document.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    this.animate();
  }

  createNodes() {
    // Fewer nodes, pre-rendered look via instanced mesh concept but simpler
    const colors = [0x6c5ce7, 0x00cec9, 0xfd79a8, 0xa29bfe, 0x00b894];
    const geom = new THREE.SphereGeometry(0.25, 8, 8);
    const N = 25;

    for (let i = 0; i < N; i++) {
      const color = colors[i % colors.length];
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 });
      const node = new THREE.Mesh(geom, mat);
      node.position.set(
        (Math.random() - 0.5) * 36,
        (Math.random() - 0.5) * 26,
        (Math.random() - 0.5) * 22
      );
      node.userData = {
        baseX: node.position.x,
        baseY: node.position.y,
        baseZ: node.position.z,
        speed: 0.2 + Math.random() * 0.5,
        amplitude: 0.6 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
      };
      this.scene.add(node);
      this.nodes.push(node);
    }
  }

  createLines() {
    // Connect nearby nodes — static lines, no per-frame geometry rebuild
    const mat = new THREE.LineBasicMaterial({
      color: 0x6c5ce7, transparent: true, opacity: 0.06,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });

    const ids = [];
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const d = this.nodes[i].position.distanceTo(this.nodes[j].position);
        if (d < 14 && Math.random() < 0.35) {
          ids.push([i, j]);
        }
      }
    }

    // Create all lines as a single BufferGeometry for performance
    const positions = new Float32Array(ids.length * 6);
    ids.forEach(([a, b], k) => {
      positions[k * 6] = this.nodes[a].position.x;
      positions[k * 6 + 1] = this.nodes[a].position.y;
      positions[k * 6 + 2] = this.nodes[a].position.z;
      positions[k * 6 + 3] = this.nodes[b].position.x;
      positions[k * 6 + 4] = this.nodes[b].position.y;
      positions[k * 6 + 5] = this.nodes[b].position.z;
    });

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const lines = new THREE.LineSegments(geom, mat);
    lines.userData.pairs = ids;
    this.scene.add(lines);
    this.linesMesh = lines;
  }

  createParticles() {
    // Floating background particles — simple Points
    const count = 150;
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 45;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 32;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 28;

      const palette = i % 3 === 0 ? [0.42, 0.36, 0.91] : i % 3 === 1 ? [0, 0.81, 0.79] : [0.99, 0.47, 0.66];
      colors[i * 3] = palette[0];
      colors[i * 3 + 1] = palette[1];
      colors[i * 3 + 2] = palette[2];
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.08, vertexColors: true, transparent: true,
      opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false,
    });

    this.particles = new THREE.Points(geom, mat);
    this.scene.add(this.particles);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const t = this.clock.getElapsedTime();

    // Smooth node movement — simple sine wave
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      const d = n.userData;
      n.position.x = d.baseX + Math.sin(t * d.speed + d.phase) * d.amplitude;
      n.position.y = d.baseY + Math.cos(t * d.speed * 1.3 + d.phase) * d.amplitude * 0.7;
      n.position.z = d.baseZ + Math.cos(t * d.speed * 0.6 + d.phase) * d.amplitude * 0.5;
      n.material.opacity = 0.45 + Math.sin(t * 2.5 + d.phase) * 0.25;
    }

    // Update line positions efficiently — single buffer
    if (this.linesMesh) {
      const pairs = this.linesMesh.userData.pairs;
      const arr = this.linesMesh.geometry.attributes.position.array;
      for (let k = 0; k < pairs.length; k++) {
        const a = this.nodes[pairs[k][0]].position;
        const b = this.nodes[pairs[k][1]].position;
        const off = k * 6;
        arr[off] = a.x; arr[off + 1] = a.y; arr[off + 2] = a.z;
        arr[off + 3] = b.x; arr[off + 4] = b.y; arr[off + 5] = b.z;
      }
      this.linesMesh.geometry.attributes.position.needsUpdate = true;
    }

    // Slow particle rotation
    if (this.particles) {
      this.particles.rotation.y += 0.00015;
    }

    // Gentle camera follow of mouse
    this.camera.position.x += (this.mouseX * 2.5 - this.camera.position.x) * 0.015;
    this.camera.position.y += (this.mouseY * 1.5 - this.camera.position.y) * 0.015;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

window.NeuralBg = NeuralBg;
