// ============================================================
// app.component.ts — Composant racine de l'application Angular
//
// Rôle :
//  - Initialiser l'application
//  - Gérer le thème (dark/light) via le service ThemeService
//  - Orchestrer l'affichage des composants enfants
//  - Initialiser la chorégraphie au scroll (GSAP ScrollTrigger)
//    une fois l'intro terminal terminée
// ============================================================

import { Component, OnInit, AfterViewInit, OnDestroy, NgZone, Renderer2, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import des composants enfants (standalone components Angular 17+)



import { ProjectsSection } from './projects-section/projects-section';

import { FooterComponent } from './footer/footer';
import { HeaderComponent } from './header-component/header-component';
import { HeroSectionComponent } from './hero-section/hero-section';
import { AboutSectionComponent } from './about-section/about-section';
import { ContactSectionComponent } from './contact-section/contact-section';
import { Messervices } from './messervices/messervices';
import { IntroLoader, INTRO_DONE_EVENT } from './intro-loader/intro-loader';
import { ScrollWorld } from './scroll-world/scroll-world';
import { initScrollFx } from './scroll-world/scroll-fx';
@Component({
  selector: 'app-root',         // Correspond à <app-root> dans index.html
  standalone: true,             // Composant autonome (Angular 17+, sans NgModule)
  imports: [
    CommonModule,
    IntroLoader,
    ScrollWorld,
    HeaderComponent,
    HeroSectionComponent,
    AboutSectionComponent,
    ProjectsSection,
    Messervices,
    ContactSectionComponent,
    FooterComponent,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  // ── Injection du Renderer2 pour manipuler le DOM sans accès direct ──
  // Renderer2 est préféré à document.querySelector pour la compatibilité SSR
  private renderer = inject(Renderer2);
  private zone = inject(NgZone);
  private destroyScrollFx?: () => void;

  // ── Thème actif : 'dark' par défaut (inspiré de Codex OpenAI) ──
  currentTheme: 'dark' | 'light' = 'dark';

  // ============================================================
  // LIFECYCLE — OnInit
  // Appelé après l'initialisation du composant
  // ============================================================
  ngOnInit(): void {
    this.loadSavedTheme();      // Récupère le thème sauvegardé (localStorage)
    this.applyTheme();           // Applique le thème au <html>
  }

  // ============================================================
  // LIFECYCLE — AfterViewInit
  // Appelé après le rendu initial du DOM
  // ============================================================
  ngAfterViewInit(): void {
    this.initScrollAnimations(); // Lance la chorégraphie GSAP au scroll
  }

  ngOnDestroy(): void {
    window.removeEventListener(INTRO_DONE_EVENT, this.startScrollFx);
    this.destroyScrollFx?.();
  }

  // ============================================================
  // GESTION DU THÈME
  // ============================================================

  /**
   * Bascule entre le thème sombre et le thème clair.
   * Cette méthode est appelée depuis le HeaderComponent via un EventEmitter.
   */
  toggleTheme(): void {
    // Alterne entre 'dark' et 'light'
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme();
    this.saveTheme(); // Persiste le choix de l'utilisateur
  }

  /**
   * Applique le thème en modifiant l'attribut data-theme sur <html>.
   * Nos variables CSS dans styles.css réagissent à cet attribut.
   */
  private applyTheme(): void {
    // Cible l'élément <html> pour appliquer le thème globalement
    const htmlElement = document.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-theme', this.currentTheme);
  }

  /**
   * Sauvegarde le thème choisi dans localStorage
   * pour le retrouver lors de la prochaine visite.
   */
  private saveTheme(): void {
    try {
      localStorage.setItem('portfolio-theme', this.currentTheme);
    } catch {
      // Silencieux si localStorage est indisponible (ex: mode privé strict)
    }
  }

  /**
   * Récupère le thème sauvegardé.
   * Si aucun thème n'est sauvegardé, utilise 'dark' par défaut.
   */
  private loadSavedTheme(): void {
    try {
      const saved = localStorage.getItem('portfolio-theme') as 'dark' | 'light' | null;
      if (saved === 'dark' || saved === 'light') {
        this.currentTheme = saved;
      }
    } catch {
      // Thème par défaut 'dark' conservé si localStorage inaccessible
    }
  }

  // ============================================================
  // ANIMATIONS AU SCROLL — GSAP ScrollTrigger (voir scroll-world/scroll-fx.ts)
  // ============================================================

  /**
   * Lance la chorégraphie GSAP une fois l'intro terminal terminée
   * (sinon les apparitions du hero se joueraient derrière l'intro).
   */
  private initScrollAnimations(): void {
    if (document.documentElement.classList.contains('intro-running')) {
      window.addEventListener(INTRO_DONE_EVENT, this.startScrollFx, { once: true });
    } else {
      // Délai court pour s'assurer que tous les composants enfants sont rendus
      setTimeout(this.startScrollFx, 150);
    }
  }

  // GSAP tourne hors de la zone Angular : pas de change detection à chaque frame
  private startScrollFx = (): void => {
    this.zone.runOutsideAngular(() => {
      this.destroyScrollFx = initScrollFx();
    });
  };
}
