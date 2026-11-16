// ============================================================
// project-modal.ts — Fenêtre de détail d'un projet
//
// Basée sur l'élément <dialog> natif (showModal) :
//  - le navigateur gère le piège du focus et la touche Échap
//  - le dialogue passe dans la "top layer" : aucun parent animé
//    (piste GSAP, tilt) ne peut le décaler ou le rogner
//  - à la fermeture, le focus revient sur la carte cliquée
// ============================================================

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { I18nService } from '../../i18n/i18n.service';
import type { Projet } from '../../donnees/projets';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  templateUrl: './project-modal.html',
  styleUrl: './project-modal.css',
})
export class ProjectModal implements AfterViewInit, OnDestroy {

  /** Projet déjà traduit dans la langue active (voir I18nService.projet) */
  readonly project = input.required<Projet>();
  readonly closed = output<void>();

  readonly i18n = inject(I18nService);

  @ViewChild('dialog', { static: true }) private dialog!: ElementRef<HTMLDialogElement>;

  /** Toutes les images : la galerie, ou à défaut la couverture */
  readonly images = computed(() => {
    const p = this.project();
    return p.galerie?.length ? p.galerie : [p.image].filter(Boolean);
  });

  readonly current = signal(0);
  readonly closing = signal(false);

  /** Liens : démo, dépôt principal, puis dépôts supplémentaires */
  readonly links = computed(() => {
    const p = this.project();
    const t = this.i18n.t().projects;
    const out: { label: string; url: string; icon: string }[] = [];
    if (this.valid(p.demo)) out.push({ label: t.seeDemo, url: p.demo, icon: 'fa-solid fa-arrow-up-right-from-square' });
    if (this.valid(p.code)) out.push({ label: t.source, url: p.code, icon: 'fa-brands fa-github' });
    p.autresLiens?.forEach((l) => out.push({ label: l.libelle, url: l.url, icon: l.icone }));
    return out;
  });

  private previousOverflow = '';

  ngAfterViewInit(): void {
    const html = document.documentElement;
    this.previousOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    this.dialog.nativeElement.showModal();
  }

  ngOnDestroy(): void {
    document.documentElement.style.overflow = this.previousOverflow;
    if (this.dialog.nativeElement.open) this.dialog.nativeElement.close();
  }

  // ── Fermeture animée (bouton, Échap, clic sur le fond) ──
  close(): void {
    if (this.closing()) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.closing.set(true);
    setTimeout(() => {
      this.dialog.nativeElement.close();
      this.closed.emit();
    }, reduce ? 0 : 200);
  }

  /** Échap : on remplace la fermeture brutale par la fermeture animée */
  onCancel(event: Event): void {
    event.preventDefault();
    this.close();
  }

  /** Un clic sur le fond (le <dialog> lui-même, hors du panneau) ferme */
  onBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog.nativeElement) this.close();
  }

  // ── Galerie ──
  show(index: number): void {
    const n = this.images().length;
    this.current.set((index + n) % n);
  }

  onMediaKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') this.show(this.current() + 1);
    else if (event.key === 'ArrowLeft') this.show(this.current() - 1);
    else return;
    event.preventDefault();
  }

  /** Les captures mobiles (portrait) sont affichées en entier */
  isPortrait(src: string): boolean {
    return src.toLowerCase().includes('mobile');
  }

  private valid(url: string): boolean {
    return !!url && url !== '#';
  }
}
