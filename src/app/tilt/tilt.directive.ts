// ============================================================
// tilt.directive.ts — Inclinaison 3D + halo lumineux au survol
//
// Usage : <article appTilt>…</article>
// Écrit les variables CSS --rx, --ry (rotation) et --mx, --my
// (position du curseur en %) sur l'élément ; le style est géré
// dans le CSS du composant. Souris uniquement (pas de tactile),
// désactivé si l'utilisateur préfère les animations réduites.
// ============================================================

import { Directive, ElementRef, NgZone, OnDestroy, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appTilt]',
  standalone: true,
})
export class TiltDirective implements OnInit, OnDestroy {

  private el = inject(ElementRef<HTMLElement>);
  private zone = inject(NgZone);
  private readonly maxTilt = 6; // degrés

  ngOnInit(): void {
    const canTilt =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canTilt) return;

    const node = this.el.nativeElement;
    this.zone.runOutsideAngular(() => {
      node.addEventListener('pointerenter', this.onEnter);
      node.addEventListener('pointermove', this.onMove);
      node.addEventListener('pointerleave', this.onLeave);
    });
  }

  ngOnDestroy(): void {
    const node = this.el.nativeElement;
    node.removeEventListener('pointerenter', this.onEnter);
    node.removeEventListener('pointermove', this.onMove);
    node.removeEventListener('pointerleave', this.onLeave);
  }

  private onEnter = () => {
    // tilt-ready reste posée : elle garde une transition fluide au retour
    this.el.nativeElement.classList.add('tilt-ready', 'tilt-active');
  };

  private onMove = (e: PointerEvent) => {
    const node = this.el.nativeElement;
    const rect = node.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;   // 0 → 1
    const py = (e.clientY - rect.top) / rect.height;   // 0 → 1

    node.style.setProperty('--ry', `${((px - 0.5) * 2 * this.maxTilt).toFixed(2)}deg`);
    node.style.setProperty('--rx', `${((0.5 - py) * 2 * this.maxTilt).toFixed(2)}deg`);
    node.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    node.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
  };

  private onLeave = () => {
    const node = this.el.nativeElement;
    node.style.setProperty('--rx', '0deg');
    node.style.setProperty('--ry', '0deg');
    node.classList.remove('tilt-active');
  };
}
