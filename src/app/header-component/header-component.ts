// ============================================================
// header.component.ts — Composant de navigation
//
// Rôle :
//  - Afficher la barre de navigation fixe en haut de la page
//  - Gérer le menu mobile (hamburger)
//  - Détecter la section active au scroll (highlighting des liens)
//  - Émettre l'événement de changement de thème vers AppComponent
//  - Appliquer un fond flouté quand l'utilisateur scrolle
// ============================================================

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {

  // ── Reçoit le thème actuel depuis AppComponent ──
  @Input() currentTheme: 'dark' | 'light' = 'dark';

  // ── Émet un signal vers AppComponent pour basculer le thème ──
  @Output() themeToggle = new EventEmitter<void>();

  // ── État du menu mobile (ouvert/fermé) ──
  isMobileMenuOpen = false;

  // ── Indique si l'utilisateur a scrollé (pour l'effet de fond) ──
  isScrolled = false;

  // ── Section actuellement visible ──
  activeSection = 'accueil';

  // ── Liste des liens de navigation ──
  navLinks = [
    { label: 'Accueil',  anchor: 'accueil' },
    { label: 'À propos', anchor: 'apropos' },
    { label: 'Projets',  anchor: 'projets' },
    { label: 'Contact',  anchor: 'contact' },
  ];

  private sectionObserver!: IntersectionObserver;

  ngOnInit(): void {
    this.initSectionObserver();
  }

  ngOnDestroy(): void {
    if (this.sectionObserver) {
      this.sectionObserver.disconnect();
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }

  private initSectionObserver(): void {
    setTimeout(() => {
      const sections = document.querySelectorAll('section[id]');
      this.sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.activeSection = entry.target.id;
            }
          });
        },
        { rootMargin: '-30% 0px -70% 0px' }
      );
      sections.forEach((section) => this.sectionObserver.observe(section));
    }, 300);
  }

  onThemeToggle(): void {
    this.themeToggle.emit();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  navigateTo(anchor: string): void {
    this.isMobileMenuOpen = false;
    const target = document.getElementById(anchor);
    if (target) {
      const headerHeight = 72;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  }

  isActive(anchor: string): boolean {
    return this.activeSection === anchor;
  }
}