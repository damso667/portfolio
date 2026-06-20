// ============================================================
// footer.component.ts — Pied de page
//
// Rôle :
//  - Afficher le copyright avec l'année dynamique
//  - Afficher des liens rapides (navigation interne)
//  - Afficher les réseaux sociaux
//  - Afficher un lien "Retour en haut"
//  - Afficher un placeholder pour la politique de confidentialité
// ============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class FooterComponent {

  // ── Année courante calculée automatiquement ──
  // Évite de devoir mettre à jour le copyright chaque année
  currentYear = new Date().getFullYear();

  // ── Liens de navigation rapide (mêmes ancres que le Header) ──
  quickLinks = [
    { label: 'Accueil',   anchor: 'accueil' },
    { label: 'À propos',  anchor: 'apropos' },
    { label: 'Projets',   anchor: 'projets' },
    { label: 'Contact',   anchor: 'contact' },
  ];

  // ── Réseaux sociaux ──
  socialLinks = [
    {
      label:     'GitHub',
      icon:      'fa-brands fa-github',
      url:       'https://github.com/damso667',      // ← Remplace par ton URL GitHub
      ariaLabel: 'Voir mon profil GitHub',
    },
    {
      label:     'LinkedIn',
      icon:      'fa-brands fa-linkedin-in',
      url:       'https://linkedin.com/in/adrien-njassine-0b75a839a', // ← Remplace par ton URL LinkedIn
      ariaLabel: 'Voir mon profil LinkedIn',
    },
    {
      label:     'Email',
      icon:      'fa-solid fa-envelope',
      url:       'mailto:njassineadrien@gmail.com',
      ariaLabel: "M'envoyer un email",
    },
  ];

  /**
   * Fait défiler la page vers une section donnée.
   * Réutilise la même logique que le HeaderComponent.
   * @param anchor - L'identifiant de la section cible
   */
  navigateTo(anchor: string): void {
    const target = document.getElementById(anchor);
    if (target) {
      const headerHeight = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  /**
   * Remonte tout en haut de la page (bouton "Retour en haut").
   */
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}