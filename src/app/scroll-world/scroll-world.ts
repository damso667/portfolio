// ============================================================
// scroll-world.ts — Décor 3D fixe + indicateur de chapitre
//
// Rôle :
//  - Afficher un canvas WebGL plein écran derrière le contenu
//  - Charger la scène Three.js à la demande (chunk séparé)
//  - Relier la scène au scroll via GSAP ScrollTrigger :
//      progression globale → avancée de la caméra
//      section active      → position du "noyau" 3D
//  - Afficher le chapitre courant
// Tout tourne hors de la zone Angular (pas de change detection
// à chaque frame).
// ============================================================

import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ScrollScene } from './scroll-scene';

gsap.registerPlugin(ScrollTrigger);

// Logo 3D de chaque section (0 = Angular, 1 = Java) et son placement (desktop / mobile)
const CHAPTERS = [
  { id: 'accueil', label: 'Accueil', logo: 0, desktop: { x: 3.4, y: 0.2, s: 1 }, mobile: { x: 0, y: 2.2, s: 0.7 } },
  { id: 'apropos', label: 'À propos', logo: 1, desktop: { x: -3.6, y: 0, s: 0.85 }, mobile: { x: 1.6, y: 2.6, s: 0.55 } },
  { id: 'projets', label: 'Projets', logo: 0, desktop: { x: 3.8, y: -0.6, s: 0.75 }, mobile: { x: -1.6, y: 2.8, s: 0.5 } },
  { id: 'services', label: 'Services', logo: 1, desktop: { x: 0, y: 2.4, s: 0.65 }, mobile: { x: 0, y: 3, s: 0.5 } },
  { id: 'contact', label: 'Contact', logo: 0, desktop: { x: -3.4, y: -0.2, s: 1.1 }, mobile: { x: 0, y: 2.6, s: 0.65 } },
];

@Component({
  selector: 'app-scroll-world',
  standalone: true,
  template: `
    <canvas #canvas class="world-canvas" aria-hidden="true"></canvas>
    <div class="world-chapter" aria-hidden="true">
      <span class="chapter-index">{{ '0' + (chapterIndex + 1) }}</span>
      <span class="chapter-sep">/ 0{{ chapters.length }}</span>
      <span class="chapter-label">{{ chapters[chapterIndex].label }}</span>
    </div>
  `,
  styleUrls: ['./scroll-world.css'],
})
export class ScrollWorld implements AfterViewInit, OnDestroy {

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private zone = inject(NgZone);
  private scene?: ScrollScene;
  private gsapContext?: gsap.Context;
  private themeObserver?: MutationObserver;
  private destroyed = false;

  readonly chapters = CHAPTERS;
  chapterIndex = 0;

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.gsapContext = gsap.context(() => {});
      this.initScene();
    });
  }

  private async initScene(): Promise<void> {
    if (!this.supportsWebGL()) return;

    const { ScrollScene } = await import('./scroll-scene');
    if (this.destroyed) return;

    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new ScrollScene(this.canvasRef.nativeElement, {
      mobile: mobileQuery.matches,
      reducedMotion,
    });
    this.scene = scene;
    scene.setTheme(this.readTheme());
    document.documentElement.classList.add('webgl-on');

    // Le thème change → on relit les variables CSS
    this.themeObserver = new MutationObserver(() => scene.setTheme(this.readTheme()));
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    this.gsapContext?.add(() => {
      // Avancée de la caméra = progression globale de la page
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          scene.state.progress = self.progress;
          if (reducedMotion) scene.renderOnce();
        },
      });

      // Changement de section → le logo se déplace et alterne Angular / Java
      CHAPTERS.forEach((chapter, index) => {
        if (!document.getElementById(chapter.id)) return;
        ScrollTrigger.create({
          trigger: `#${chapter.id}`,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => {
            if (!self.isActive) return;
            const target = mobileQuery.matches ? chapter.mobile : chapter.desktop;
            gsap.to(scene.state, {
              coreX: target.x,
              coreY: target.y,
              coreScale: target.s,
              logo: chapter.logo,
              duration: reducedMotion ? 0 : 1.6,
              ease: 'power3.inOut',
              overwrite: true,
              onUpdate: () => { if (reducedMotion) scene.renderOnce(); },
            });
            this.zone.run(() => (this.chapterIndex = index));
          },
        });
      });
    });

    // Ces déclencheurs peuvent être créés après les épinglages : on recalcule
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    window.addEventListener('resize', this.onResize);
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    scene.start();
  }

  private onResize = (): void => this.scene?.resize();

  private onPointerMove = (event: PointerEvent): void => {
    if (event.pointerType !== 'mouse') return;
    this.scene?.setPointer(event.clientX / window.innerWidth - 0.5, event.clientY / window.innerHeight - 0.5);
  };

  // Onglet masqué → on coupe la boucle de rendu
  private onVisibility = (): void => {
    if (document.hidden) this.scene?.stop();
    else this.scene?.start();
  };

  private readTheme() {
    const styles = getComputedStyle(document.documentElement);
    return {
      accent: styles.getPropertyValue('--code-accent-rgb') || '240, 240, 240',
      background: styles.getPropertyValue('--bg-primary') || '#0a0a0a',
    };
  }

  private supportsWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch {
      return false;
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.gsapContext?.revert();
    this.themeObserver?.disconnect();
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.scene?.dispose();
    document.documentElement.classList.remove('webgl-on');
  }
}
