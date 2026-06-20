// ============================================================
// hero-section.component.ts — Section principale de présentation
//
// Rôle :
//  - Afficher le nom, slogan, et description de Noubam Adrien
//  - Proposer un emplacement pour la photo de profil
//  - Fournir les boutons CTA (CV + Projets)
//  - Animer le texte à l'apparition (effet typewriter sur le slogan)
//  - Afficher les liens vers les réseaux sociaux
// ============================================================

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.html',
  styleUrls: ['./hero-section.css'],
})
export class HeroSectionComponent implements OnInit, OnDestroy {

  // ── Textes qui défilent en boucle (effet typewriter) ──
  // Modifie ce tableau pour changer les spécialités affichées
  typedTexts = [
    'Développeur Full Stack',
    'Passionné par Angular & Spring Boot',
    "Créateur d'expériences numériques",
  ];

  // ── Texte actuellement affiché ──
  displayedText = '';

  private currentTextIndex = 0;
  private currentCharIndex = 0;
  private isTyping = true;
  private typingInterval: any;

  // ── Liens réseaux sociaux ──
  socialLinks = [
    {
      label:     'GitHub',
      icon:      'fa-brands fa-github',
      url:       'https://github.com/damso667',
      ariaLabel: 'Voir mon profil GitHub',
    },
    {
      label:     'LinkedIn',
      icon:      'fa-brands fa-linkedin-in',
      url:       'https://linkedin.com/in/adrien-njassine-0b75a839a',
      ariaLabel: 'Voir mon profil LinkedIn',
    },
    {
      label:     'Email',
      icon:      'fa-solid fa-envelope',
      url:       'mailto:njassineadrien@gmail.com',
      ariaLabel: "M'envoyer un email",
    },
  ];

  // ── Statistiques rapides ──
  stats = [
    { value: '2+',  label: "Ans d'expérience" },
    { value: '5+',  label: 'Projets réalisés'  },
    { value: 'BTS', label: 'Génie Logiciel'    },
  ];

  ngOnInit(): void {
    setTimeout(() => this.startTypewriter(), 600);
  }

  ngOnDestroy(): void {
    if (this.typingInterval) clearInterval(this.typingInterval);
  }

  // ── Effet typewriter : écriture + effacement en boucle ──
  private startTypewriter(): void {
    this.typingInterval = setInterval(() => {
      const currentText = this.typedTexts[this.currentTextIndex];

      if (this.isTyping) {
        if (this.currentCharIndex < currentText.length) {
          this.displayedText = currentText.slice(0, ++this.currentCharIndex);
        } else {
          // Texte complet → pause 1.8s puis efface
          this.isTyping = false;
          clearInterval(this.typingInterval);
          setTimeout(() => this.startTypewriter(), 1800);
        }
      } else {
        if (this.currentCharIndex > 0) {
          this.displayedText = currentText.slice(0, --this.currentCharIndex);
        } else {
          // Texte effacé → passe au suivant
          this.isTyping = true;
          this.currentTextIndex = (this.currentTextIndex + 1) % this.typedTexts.length;
        }
      }
    }, 60);
  }

  // ── Scroll vers la section Projets ──
  scrollToProjects(): void {
    const target = document.getElementById('projets');
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}