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

import { Component, OnInit, AfterViewInit, OnDestroy, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeField } from '../code-field/code-field';
import { INTRO_DONE_EVENT } from '../intro-loader/intro-loader';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, CodeField],
  templateUrl: './hero-section.html',
  styleUrls: ['./hero-section.css'],
})
export class HeroSectionComponent implements OnInit, AfterViewInit, OnDestroy {

  // ── Référence à l'élément hôte (pour la parallaxe) ──
  private host = inject(ElementRef<HTMLElement>);

  // true uniquement sur les appareils avec souris (pas de parallaxe tactile)
  private finePointer = false;

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

  // ── Nom affiché avec effet de "décryptage" ──
  readonly fullName = 'Noubam Adrien';
  scrambledName = this.fullName;
  private scrambleTimer: any;

  ngOnInit(): void {
    // Si l'intro terminal est en cours, on attend sa fin pour animer le hero
    if (document.documentElement.classList.contains('intro-running')) {
      window.addEventListener(INTRO_DONE_EVENT, this.onIntroDone, { once: true });
    } else {
      this.onIntroDone();
    }
  }

  private onIntroDone = (): void => {
    setTimeout(() => this.scrambleName(), 350);
    setTimeout(() => this.startTypewriter(), 600);
  };

  // ── Les lettres défilent en caractères "code" puis se fixent de gauche à droite ──
  private scrambleName(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const glyphs = '<>/{}[]=+*_#01$;';
    const target = this.fullName;
    let frame = 0;
    const totalFrames = 28;

    this.scrambleTimer = setInterval(() => {
      const revealed = Math.floor((frame / totalFrames) * target.length);
      this.scrambledName = target
        .split('')
        .map((char, i) =>
          i < revealed || char === ' ' ? char : glyphs[(Math.random() * glyphs.length) | 0])
        .join('');

      if (++frame > totalFrames) {
        clearInterval(this.scrambleTimer);
        this.scrambledName = target;
      }
    }, 38);
  }

  ngAfterViewInit(): void {
    // La parallaxe n'est activée que si l'appareil possède un pointeur précis
    // (souris / trackpad) — sur mobile/tactile elle reste désactivée.
    this.finePointer = window.matchMedia('(pointer: fine)').matches;
  }

  // ============================================================
  // PARALLAXE SOURIS — l'arrière-plan suit doucement le curseur
  // Les variables --px / --py sont lues par .hero-bg dans le CSS.
  // ============================================================
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.finePointer) return;

    const el = this.host.nativeElement;
    const rect = el.getBoundingClientRect();

    // Position relative du curseur dans la section (-0.5 → 0.5)
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;

    // Amplitude volontairement faible pour un effet subtil
    el.style.setProperty('--px', `${(relX * -32).toFixed(1)}px`);
    el.style.setProperty('--py', `${(relY * -22).toFixed(1)}px`);
  }

  ngOnDestroy(): void {
    if (this.typingInterval) clearInterval(this.typingInterval);
    clearInterval(this.scrambleTimer);
    window.removeEventListener(INTRO_DONE_EVENT, this.onIntroDone);
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

  // ── Scroll vers la section À propos ──
  scrollToAbout(): void {
    const target = document.getElementById('apropos');
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}