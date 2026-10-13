// ============================================================
// code-field.ts — Fond animé "univers du code" (canvas)
//
// Rôle :
//  - Faire flotter des fragments de code en profondeur derrière le hero
//  - Les fragments proches de la souris s'illuminent
//  - Performance : boucle hors zone Angular, pause quand la section
//    n'est plus visible ou que l'onglet est masqué, DPR plafonné
//  - prefers-reduced-motion : une seule image statique
// ============================================================

import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';

interface Token {
  x: number;
  y: number;
  z: number;      // Profondeur 0.25 (loin) → 1 (proche)
  speed: number;
  text: string;
  glow: number;   // 0 → 1, lissé
}

const SNIPPETS = [
  '</>', '{ }', '=>', '()', '[]', '&&', '!==', '++', '::',
  'const', 'let', 'async', 'await', 'return', 'import', 'class',
  '@Component', '@RestController', 'public void', 'SELECT *', 'JOIN',
  'npm run', 'git push', 'ng serve', 'mvn', 'flutter', 'JWT',
  '200 OK', '0x1F', '1010', 'null', 'true', '<div>', 'fn()', '$_POST',
];

@Component({
  selector: 'app-code-field',
  standalone: true,
  template: `<canvas #canvas aria-hidden="true"></canvas>`,
  styles: [`
    :host { position: absolute; inset: 0; display: block; pointer-events: none; }
    canvas { width: 100%; height: 100%; display: block; }
  `],
})
export class CodeField implements AfterViewInit, OnDestroy {

  @ViewChild('canvas', { static: true }) private canvasRef!: ElementRef<HTMLCanvasElement>;

  private zone = inject(NgZone);
  private host = inject(ElementRef<HTMLElement>);

  private ctx!: CanvasRenderingContext2D;
  private tokens: Token[] = [];
  private width = 0;
  private height = 0;
  private dpr = 1;
  private raf = 0;
  private running = false;
  private inView = true;
  private mouse = { x: -9999, y: -9999 };
  private colors = { base: '160, 170, 200', glow: '124, 156, 255' };
  private frame = 0;
  private reducedMotion = false;

  private resizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;

  ngAfterViewInit(): void {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.zone.runOutsideAngular(() => {
      this.resize();
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.host.nativeElement);

      this.intersectionObserver = new IntersectionObserver(([entry]) => {
        this.inView = entry.isIntersecting;
        this.updateRunning();
      });
      this.intersectionObserver.observe(this.host.nativeElement);

      document.addEventListener('visibilitychange', this.onVisibility);
      window.addEventListener('pointermove', this.onPointer, { passive: true });

      this.updateRunning();
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibility);
    window.removeEventListener('pointermove', this.onPointer);
  }

  // ============================================================
  // GESTION DU CYCLE DE VIE DE L'ANIMATION
  // ============================================================
  private onVisibility = () => this.updateRunning();

  private onPointer = (e: PointerEvent) => {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  };

  private updateRunning(): void {
    if (this.reducedMotion) {
      this.readColors();
      this.draw(false);
      return;
    }
    const shouldRun = this.inView && !document.hidden;
    if (shouldRun && !this.running) {
      this.running = true;
      this.raf = requestAnimationFrame(this.loop);
    } else if (!shouldRun && this.running) {
      this.running = false;
      cancelAnimationFrame(this.raf);
    }
  }

  private loop = () => {
    if (!this.running) return;
    // Relit les couleurs du thème de temps en temps (changement clair/sombre)
    if (this.frame++ % 60 === 0) this.readColors();
    this.draw(true);
    this.raf = requestAnimationFrame(this.loop);
  };

  private resize(): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = this.host.nativeElement.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = rect.height;
    canvas.width = Math.round(this.width * this.dpr);
    canvas.height = Math.round(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // Densité proportionnelle à la surface, plafonnée
    const count = Math.min(70, Math.round((this.width * this.height) / 20000));
    this.tokens = Array.from({ length: count }, () => this.spawn(true));
    if (this.reducedMotion) this.draw(false);
  }

  private spawn(anywhere: boolean): Token {
    const z = 0.25 + Math.random() * 0.75;
    return {
      x: Math.random() * this.width,
      y: anywhere ? Math.random() * this.height : this.height + 20,
      z,
      speed: 0.12 + z * 0.35,
      text: SNIPPETS[(Math.random() * SNIPPETS.length) | 0],
      glow: 0,
    };
  }

  private readColors(): void {
    const style = getComputedStyle(document.documentElement);
    this.colors.base = style.getPropertyValue('--code-token-rgb').trim() || this.colors.base;
    this.colors.glow = style.getPropertyValue('--code-accent-rgb').trim() || this.colors.glow;
  }

  // ============================================================
  // DESSIN
  // ============================================================
  private draw(animate: boolean): void {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.textBaseline = 'middle';
    const radius = 170;

    for (let i = 0; i < this.tokens.length; i++) {
      const t = this.tokens[i];

      if (animate) {
        t.y -= t.speed;
        if (t.y < -20) this.tokens[i] = this.spawn(false);
      }

      // Illumination près du curseur (lissée)
      const dx = t.x - this.mouse.x;
      const dy = t.y - this.mouse.y;
      const near = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / radius);
      t.glow += (near - t.glow) * 0.12;

      // Fondu en haut et en bas de la section
      const edge = Math.min(1, t.y / 120, (this.height - t.y) / 120);
      const alpha = Math.max(0, edge) * (0.06 + t.z * 0.16 + t.glow * 0.7);
      if (alpha <= 0.005) continue;

      const size = 10 + t.z * 7;
      ctx.font = `${t.z > 0.7 ? 600 : 400} ${size}px 'JetBrains Mono', ui-monospace, monospace`;
      ctx.fillStyle = t.glow > 0.05
        ? `rgba(${this.colors.glow}, ${Math.min(1, alpha)})`
        : `rgba(${this.colors.base}, ${alpha})`;
      ctx.fillText(t.text, t.x, t.y);
    }
  }
}
