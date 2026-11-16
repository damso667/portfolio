// ============================================================
// messervices.ts — Section "Mes services"
//
// Panneaux en accordéon : un service est ouvert en grand (image,
// texte, technologies), les autres restent en bandes étroites.
//  - Avance tout seul toutes les 6 s (barre de progression CSS)
//  - Pause au survol, au focus, hors écran, ou via le bouton pause
//  - Clic / tap sur une bande, flèches ← → du clavier, boutons
//  - Pas d'avance automatique si l'utilisateur réduit les animations
// Sur mobile les panneaux s'empilent verticalement.
// ============================================================

import { AfterViewInit, Component, ElementRef, OnDestroy, computed, inject, signal } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';

/** Ce qui ne dépend pas de la langue (les textes sont dans content.ts) */
interface ServiceMeta {
  icon: string;
  image: string;
  tags: string[];
}

@Component({
  selector: 'app-messervices',
  standalone: true,
  templateUrl: './messervices.html',
  styleUrl: './messervices.css',
})
export class Messervices implements AfterViewInit, OnDestroy {

  readonly i18n = inject(I18nService);
  private host: ElementRef<HTMLElement> = inject(ElementRef);

  /** Même ordre que services.items dans content.ts */
  private readonly meta: ServiceMeta[] = [
    { icon: 'fa-solid fa-code',                image: '/service-web1.jpg',      tags: ['Angular', 'React', 'TypeScript'] },
    { icon: 'fa-solid fa-mobile-screen-button', image: '/service-mobile1.jpg',   tags: ['Ionic', 'Flutter', 'Capacitor'] },
    { icon: 'fa-solid fa-arrows-spin',         image: '/service-cicd1.jpg',     tags: ['GitHub Actions', 'Docker'] },
    { icon: 'fa-solid fa-server',              image: '/service-api1.jpg',      tags: ['Spring Boot', 'Node.js', 'JWT'] },
    { icon: 'fa-solid fa-database',            image: '/service-database1.jpg', tags: ['PostgreSQL', 'MySQL', 'MongoDB'] },
    { icon: 'fa-solid fa-palette',             image: '/service-uiux1.jpg',     tags: ['Wireframes', 'Prototypes', 'Design system'] },
    { icon: 'fa-solid fa-cloud-arrow-up',      image: '/service-cloud1.jpg',    tags: ['Vercel', 'Render', 'Supabase'] },
    { icon: 'si si-n8n',                       image: '/service-n8n.svg',       tags: ['n8n', 'Webhooks', 'API'] },
  ];

  readonly services = computed(() =>
    this.i18n.t().services.items.map((text, i) => ({ ...text, ...this.meta[i] })),
  );

  readonly active = signal(0);

  /** Pause demandée par le bouton */
  readonly userPaused = signal(false);
  /** Pause temporaire : survol, focus clavier, section hors écran */
  readonly hovered = signal(false);
  readonly focused = signal(false);
  readonly offscreen = signal(true);

  readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  readonly running = computed(
    () => !this.reducedMotion && !this.userPaused() && !this.hovered() && !this.focused() && !this.offscreen(),
  );

  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      ([entry]) => this.offscreen.set(!entry.isIntersecting),
      { threshold: 0.35 },
    );
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  select(index: number): void {
    const n = this.meta.length;
    this.active.set((index + n) % n);
  }

  next(): void {
    this.select(this.active() + 1);
  }

  prev(): void {
    this.select(this.active() - 1);
  }

  togglePause(): void {
    this.userPaused.update((v) => !v);
  }

  /** Fin de la barre de progression du panneau ouvert → panneau suivant */
  onProgressEnd(index: number): void {
    if (index === this.active()) this.next();
  }

  onKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') this.next();
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') this.prev();
    else return;
    event.preventDefault();
    // Garde le focus sur le panneau qui vient de s'ouvrir
    const buttons = this.host.nativeElement.querySelectorAll<HTMLButtonElement>('.svc-trigger');
    buttons[this.active()]?.focus();
  }

  /** Seul le focus clavier met en pause (un clic souris ne doit pas figer l'avance) */
  onFocusIn(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    if (target.matches(':focus-visible')) this.focused.set(true);
  }

  /** Le focus qui quitte la liste (et pas seulement un bouton) relance l'avance */
  onFocusOut(event: FocusEvent): void {
    const list = event.currentTarget as HTMLElement;
    if (!list.contains(event.relatedTarget as Node)) this.focused.set(false);
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
