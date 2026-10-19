// ============================================================
// scroll-scene.ts — Scène Three.js du "voyage" au scroll
//
// Chargée à la demande (import dynamique) pour ne pas alourdir
// le bundle initial. Tout est monochrome : la couleur des lignes
// et des particules vient de --code-accent-rgb, le brouillard de
// --bg-primary → la scène suit automatiquement le thème.
//
// La caméra avance dans un tunnel d'étoiles en fonction de
// state.progress (0 → 1, piloté par GSAP ScrollTrigger) et passe
// devant des logos Angular et Java en fil de fer.
// ============================================================

import {
  BufferAttribute,
  BufferGeometry,
  Color,
  EdgesGeometry,
  ExtrudeGeometry,
  Fog,
  GridHelper,
  Group,
  LineBasicMaterial,
  LineSegments,
  Path,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Shape,
  TorusGeometry,
  WebGLRenderer,
} from 'three';

// ── Logos en volume (contours extrudés, rendus en fil de fer) ──

const EXTRUDE = {
  depth: 0.22,
  bevelEnabled: true,
  bevelThickness: 0.04,
  bevelSize: 0.03,
  bevelSegments: 1,
  curveSegments: 24,
};

/** Bouclier Angular avec le "A" évidé */
function angularLogo(): EdgesGeometry {
  const shield = new Shape()
    .moveTo(0, 1.2)
    .lineTo(1.12, 0.8)
    .lineTo(0.95, -0.68)
    .lineTo(0, -1.2)
    .lineTo(-0.95, -0.68)
    .lineTo(-1.12, 0.8)
    .closePath();

  // Le "A" est un trou dans le bouclier…
  shield.holes.push(
    new Path()
      .moveTo(0, 0.9)
      .lineTo(-0.6, -0.55)
      .lineTo(-0.38, -0.55)
      .lineTo(-0.26, -0.25)
      .lineTo(0.26, -0.25)
      .lineTo(0.38, -0.55)
      .lineTo(0.6, -0.55)
      .closePath(),
  );

  // …et le triangle intérieur du "A" reste plein
  const counter = new Shape()
    .moveTo(0, 0.5)
    .lineTo(0.17, 0.06)
    .lineTo(-0.17, 0.06)
    .closePath();

  const solid = new ExtrudeGeometry([shield, counter], EXTRUDE);
  solid.center();
  const edges = new EdgesGeometry(solid, 15);
  solid.dispose();
  return edges;
}

/** Tasse Java : tasse, anse, soucoupe et deux volutes de vapeur */
function javaLogo(): EdgesGeometry {
  const cup = new Shape()
    .moveTo(-0.75, 0.15)
    .lineTo(0.75, 0.15)
    .quadraticCurveTo(0.72, -0.75, 0, -0.8)
    .quadraticCurveTo(-0.72, -0.75, -0.75, 0.15);

  const handle = new Shape();
  handle.absarc(0.72, -0.18, 0.3, -Math.PI / 2, Math.PI / 2, false);
  handle.absarc(0.72, -0.18, 0.18, Math.PI / 2, -Math.PI / 2, true);

  const saucer = new Shape();
  saucer.absellipse(0, -0.98, 1.05, 0.14, 0, Math.PI * 2, false, 0);
  saucer.holes.push(new Path().absellipse(0, -0.98, 0.88, 0.07, 0, Math.PI * 2, true, 0));

  const steam = (x: number, h: number) =>
    new Shape()
      .moveTo(x - 0.1, 0.3)
      .bezierCurveTo(x - 0.42, 0.3 + h * 0.35, x + 0.2, 0.3 + h * 0.55, x - 0.06, 0.3 + h)
      .bezierCurveTo(x + 0.32, 0.3 + h * 0.6, x - 0.22, 0.3 + h * 0.4, x + 0.08, 0.3);

  const solid = new ExtrudeGeometry([cup, handle, saucer, steam(-0.12, 0.95), steam(0.28, 0.7)], EXTRUDE);
  solid.center();
  const edges = new EdgesGeometry(solid, 15);
  solid.dispose();
  return edges;
}

export interface SceneOptions {
  mobile: boolean;
  reducedMotion: boolean;
}

export interface SceneTheme {
  accent: string; // ex : "240, 240, 240"
  background: string; // ex : "#0a0a0a"
}

// Trajet de la caméra (axe Z)
const PATH_START = 8;
const PATH_END = -150;

export class ScrollScene {
  // Valeurs pilotées de l'extérieur par GSAP
  // logo : 0 = Angular, 1 = Java (fondu par l'échelle entre les deux)
  readonly state = { progress: 0, coreX: 2.8, coreY: 0.2, coreScale: 1, logo: 0 };

  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera: PerspectiveCamera;

  private core = new Group();
  private coreAngular!: LineSegments;
  private coreJava!: LineSegments;
  private angularGeometry = angularLogo();
  private javaGeometry = javaLogo();
  private waypoints: LineSegments[] = [];
  private stars!: Points;
  private grid!: GridHelper;

  private lineMaterial = new LineBasicMaterial({ transparent: true, opacity: 0.32 });
  private lineMaterialFaint = new LineBasicMaterial({ transparent: true, opacity: 0.16 });
  private pointMaterial: PointsMaterial;
  private disposables: { dispose(): void }[] = [];

  private pointer = { x: 0, y: 0 };
  private smoothProgress = 0;
  private rafId = 0;
  private running = false;
  private startTime = performance.now();

  constructor(private canvas: HTMLCanvasElement, private opts: SceneOptions) {
    this.renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !opts.mobile,
      powerPreference: 'low-power',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.mobile ? 1.25 : 1.75));
    this.renderer.setClearColor(0x000000, 0);

    this.camera = new PerspectiveCamera(opts.mobile ? 70 : 60, 1, 0.1, 120);
    this.camera.position.set(0, 0, PATH_START);

    this.pointMaterial = new PointsMaterial({
      size: opts.mobile ? 0.09 : 0.07,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
      depthWrite: false,
    });

    this.disposables.push(
      this.lineMaterial,
      this.lineMaterialFaint,
      this.pointMaterial,
      this.angularGeometry,
      this.javaGeometry,
    );

    this.buildStars();
    this.buildCore();
    this.buildWaypoints();
    this.buildGrid();
    this.resize();
  }

  // ── Tunnel d'étoiles le long du trajet ──
  private buildStars(): void {
    const count = this.opts.mobile ? 900 : 2200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Répartition en anneau : le centre reste dégagé pour le texte
      const radius = 3 + Math.random() * 26;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = PATH_START + 12 - Math.random() * (PATH_START - PATH_END + 40);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    this.stars = new Points(geometry, this.pointMaterial);
    this.scene.add(this.stars);
    this.disposables.push(geometry);
  }

  // ── Logo qui accompagne la caméra et change de place par section ──
  private buildCore(): void {
    const ring = new EdgesGeometry(new TorusGeometry(2.3, 0.01, 3, 64));
    const ringMesh = new LineSegments(ring, this.lineMaterialFaint);
    ringMesh.rotation.x = Math.PI / 2.4;
    ringMesh.name = 'ring';

    this.coreAngular = new LineSegments(this.angularGeometry, this.lineMaterial);
    this.coreJava = new LineSegments(this.javaGeometry, this.lineMaterial);
    this.coreAngular.scale.setScalar(1.3);
    this.coreJava.scale.setScalar(0);

    this.core.add(this.coreAngular, this.coreJava, ringMesh);
    this.scene.add(this.core);
    this.disposables.push(ring);
  }

  // ── Logos posés le long du chemin, en alternance Angular / Java ──
  private buildWaypoints(): void {
    const count = 6;
    const spread = this.opts.mobile ? 4.5 : 8;

    for (let i = 0; i < count; i++) {
      const geometry = i % 2 === 0 ? this.javaGeometry : this.angularGeometry;
      const mesh = new LineSegments(geometry, this.lineMaterialFaint);
      // Le premier part à gauche : le logo central est à droite sur le hero
      const side = i % 2 === 0 ? -1 : 1;
      mesh.position.set(
        side * (spread + (i % 3)),
        (i % 3) - 1.2,
        -30 - i * ((PATH_START - PATH_END - 40) / count),
      );
      mesh.scale.setScalar(1.9);
      mesh.rotation.set(0.15 * side, i * 0.9, 0);
      this.waypoints.push(mesh);
      this.scene.add(mesh);
    }
  }

  // ── Sol en grille, très discret, pour la sensation de vitesse ──
  private buildGrid(): void {
    this.grid = new GridHelper(260, this.opts.mobile ? 50 : 90);
    const material = this.grid.material as LineBasicMaterial;
    material.vertexColors = false;
    material.transparent = true;
    material.opacity = 0.07;
    this.grid.position.set(0, -7, (PATH_START + PATH_END) / 2);
    this.scene.add(this.grid);
    this.disposables.push(this.grid.geometry, material);
  }

  // ── Couleurs depuis les variables CSS du thème ──
  setTheme(theme: SceneTheme): void {
    const color = new Color(`rgb(${theme.accent.replace(/\s+/g, '')})`);
    this.lineMaterial.color.copy(color);
    this.lineMaterialFaint.color.copy(color);
    this.pointMaterial.color.copy(color);
    (this.grid.material as LineBasicMaterial).color.copy(color);
    this.scene.fog = new Fog(new Color(theme.background.trim()), 10, 70);
    this.renderOnce();
  }

  setPointer(x: number, y: number): void {
    this.pointer.x = x;
    this.pointer.y = y;
  }

  resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderOnce();
  }

  start(): void {
    if (this.running || this.opts.reducedMotion) {
      this.renderOnce();
      return;
    }
    this.running = true;
    this.rafId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  private tick = (): void => {
    if (!this.running) return;
    this.update((performance.now() - this.startTime) / 1000);
    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(this.tick);
  };

  renderOnce(): void {
    if (this.running) return;
    this.update(0);
    this.renderer.render(this.scene, this.camera);
  }

  private update(time: number): void {
    // Lissage : la caméra "glisse" vers la position de scroll
    this.smoothProgress += (this.state.progress - this.smoothProgress) * 0.075;
    const p = this.smoothProgress;

    const cam = this.camera;
    const z = PATH_START + (PATH_END - PATH_START) * p;
    const swayX = Math.sin(p * Math.PI * 3) * 1.2 + this.pointer.x * 0.8;
    const swayY = Math.cos(p * Math.PI * 2) * 0.5 - this.pointer.y * 0.5;
    cam.position.x += (swayX - cam.position.x) * 0.05;
    cam.position.y += (swayY - cam.position.y) * 0.05;
    cam.position.z = z;
    cam.lookAt(cam.position.x * 0.4, cam.position.y * 0.4, z - 20);
    cam.rotation.z = Math.sin(p * Math.PI * 2) * 0.06;

    // Le noyau reste devant la caméra et se déplace selon la section
    this.core.position.set(
      cam.position.x + this.state.coreX,
      cam.position.y + this.state.coreY,
      z - 9,
    );
    this.core.scale.setScalar(this.state.coreScale * (1 + Math.sin(time * 1.4) * 0.025));
    // Rotation surtout autour de l'axe vertical : le logo reste lisible
    this.core.rotation.set(Math.sin(time * 0.5) * 0.2, p * 6 + time * 0.4, Math.sin(time * 0.3) * 0.08);

    // Fondu Angular ↔ Java par l'échelle
    const logo = this.state.logo;
    this.coreAngular.scale.setScalar(1.3 * (1 - logo));
    this.coreJava.scale.setScalar(1.3 * logo);
    this.coreAngular.visible = logo < 0.999;
    this.coreJava.visible = logo > 0.001;

    const ring = this.core.getObjectByName('ring');
    if (ring) ring.rotation.z = time * 0.25 + p * 4;

    // Torsion du tunnel et rotation des logos du chemin
    this.stars.rotation.z = p * 1.6 + time * 0.01;
    this.waypoints.forEach((mesh, i) => {
      mesh.rotation.y += 0.004 * (i % 2 ? 1 : -1);
    });
  }

  dispose(): void {
    this.stop();
    this.disposables.forEach((d) => d.dispose());
    this.renderer.dispose();
  }
}
