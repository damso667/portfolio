// ============================================================
// app.component.ts — Composant racine de l'application Angular
//
// Rôle :
//  - Initialiser l'application
//  - Gérer le thème (dark/light) via le service ThemeService
//  - Orchestrer l'affichage des composants enfants
//  - Initialiser l'animation au scroll (IntersectionObserver)
// ============================================================

import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import des composants enfants (standalone components Angular 17+)



import { ProjectsSection } from './projects-section/projects-section';

import { FooterComponent } from './footer/footer';
import { HeaderComponent } from './header-component/header-component';
import { HeroSectionComponent } from './hero-section/hero-section';
import { AboutSectionComponent } from './about-section/about-section';
import { ContactSectionComponent } from './contact-section/contact-section';

@Component({
  selector: 'app-root',         // Correspond à <app-root> dans index.html
  standalone: true,             // Composant autonome (Angular 17+, sans NgModule)
  imports: [
    CommonModule,
    HeaderComponent,
    HeroSectionComponent,
    AboutSectionComponent,
    ProjectsSection,
    ContactSectionComponent,
    FooterComponent,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent implements OnInit {

  // ── Injection du Renderer2 pour manipuler le DOM sans accès direct ──
  // Renderer2 est préféré à document.querySelector pour la compatibilité SSR
  private renderer = inject(Renderer2);

  // ── Thème actif : 'dark' par défaut (inspiré de Codex OpenAI) ──
  currentTheme: 'dark' | 'light' = 'dark';

  // ============================================================
  // LIFECYCLE — OnInit
  // Appelé après l'initialisation du composant
  // ============================================================
  ngOnInit(): void {
    this.loadSavedTheme();      // Récupère le thème sauvegardé (localStorage)
    this.applyTheme();           // Applique le thème au <html>
    this.initScrollAnimations(); // Lance l'observateur d'animations
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
  // ANIMATIONS AU SCROLL — IntersectionObserver
  // ============================================================

  /**
   * Initialise l'IntersectionObserver pour déclencher les animations
   * de fade-in-up sur les éléments portant la classe .animate-on-scroll.
   *
   * L'observateur ajoute la classe .visible dès qu'un élément entre
   * dans le viewport, ce qui déclenche la transition CSS définie
   * dans styles.css.
   */
  private initScrollAnimations(): void {
    // Délai court pour s'assurer que le DOM est rendu
    setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // L'élément est visible → on ajoute .visible pour déclencher l'animation
              entry.target.classList.add('visible');
              // On arrête d'observer cet élément (l'animation ne se rejoue qu'une fois)
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,    // Déclenche quand 10% de l'élément est visible
          rootMargin: '0px 0px -40px 0px', // Légère marge pour un déclenchement anticipé
        }
      );

      // Sélectionne tous les éléments à animer
      const animatedElements = document.querySelectorAll('.animate-on-scroll');
      animatedElements.forEach((el) => observer.observe(el));

    }, 100);
  }
}