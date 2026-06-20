// ============================================================
// about-section.component.ts — Section "À propos de moi"
//
// Rôle :
//  - Présenter le parcours et les objectifs de Noubam Adrien
//  - Afficher les compétences sous forme d'icônes avec tooltips
//  - Afficher les outils et technologies maîtrisés
//  - Présenter le parcours académique et professionnel
// ============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-section.html',
  styleUrls: ['./about-section.css'],
})
export class AboutSectionComponent {

  // ── Compétences frontend ──
  // icon     : classe Font Awesome ou Devicon (via CDN)
  // label    : nom affiché dans le tooltip au survol
  // color    : couleur officielle de la techno
  frontendSkills = [
    { icon: 'fa-brands fa-angular',    label: 'Angular',     color: '#dd1b16' },
    { icon: 'fa-brands fa-html5',      label: 'HTML5',       color: '#e34f26' },
    { icon: 'fa-brands fa-css3-alt',   label: 'CSS3',        color: '#1572b6' },
    { icon: 'fa-brands fa-js',         label: 'JavaScript',  color: '#f7df1e' },
    { icon: 'fa-brands fa-flutter',    label: 'Flutter',     color: '#54c5f8' },
  ];

  // ── Compétences backend ──
  backendSkills = [
    { icon: 'fa-brands fa-java',       label: 'Java',        color: '#f89820' },
    { icon: 'fa-solid fa-leaf',        label: 'Spring Boot', color: '#6db33f' },
    { icon: 'fa-brands fa-php',        label: 'PHP',         color: '#777bb4' },
    { icon: 'fa-solid fa-code',        label: 'Laravel',     color: '#ff2d20' },
    { icon: 'fa-solid fa-shield-halved', label: 'JWT Auth',  color: '#a0a0a0' },
  ];

  // ── Bases de données & outils ──
  toolSkills = [
    { icon: 'fa-solid fa-database',    label: 'MySQL',       color: '#4479a1' },
    { icon: 'fa-solid fa-circle-nodes',label: 'Oracle DB',   color: '#f80000' },
    { icon: 'fa-brands fa-git-alt',    label: 'Git',         color: '#f05032' },
    { icon: 'fa-brands fa-github',     label: 'GitHub',      color: '#a0a0a0' },
    { icon: 'fa-solid fa-server',      label: 'REST API',    color: '#6db33f' },
  ];

  // ── Parcours académique et professionnel ──
  timeline = [
    {
      period:       '2023 — En cours',
      title:        'BTS Génie Logiciel',
      organization: 'ISMAT — Yaoundé, Cameroun',
      description:  'Formation en développement logiciel, algorithmique, bases de données, réseaux et gestion de projets.',
      icon:         'fa-solid fa-graduation-cap',
      type:         'academic',  // 'academic' | 'work'
    },
    {
      period:       '2024',
      title:        'Développeur Stagiaire',
      organization: 'MCA Conseils Sarl — Yaoundé',
      description:  'Conception et développement d\'une application de gestion de laboratoire hospitalier avec Spring Boot, Angular et MySQL.',
      icon:         'fa-solid fa-briefcase',
      type:         'work',
    },
    {
      period:       '2024',
      title:        'Projet Personnel — QALF',
      organization: 'Simulation d\'épargne web',
      description:  'Application web de simulation d\'épargne avec calculs détaillés stockés en base de données MySQL.',
      icon:         'fa-solid fa-rocket',
      type:         'work',
    },
  ];

  // ── Tooltip actif (nom de la compétence survolée) ──
  activeTooltip: string | null = null;

  // Affiche le tooltip de la compétence survolée
  showTooltip(label: string): void {
    this.activeTooltip = label;
  }

  // Cache le tooltip
  hideTooltip(): void {
    this.activeTooltip = null;
  }
}