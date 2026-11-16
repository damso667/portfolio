// ============================================================
// about-section.component.ts — Section "À propos de moi"
//
// Rôle :
//  - Présenter le parcours et les objectifs de Noubam Adrien
//  - Afficher les compétences sous forme d'icônes avec tooltips
//  - Afficher les outils et technologies maîtrisés
//  - Présenter le parcours académique et professionnel
// ============================================================

import { Component, inject } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-section.html',
  styleUrls: ['./about-section.css'],
})
export class AboutSectionComponent {

  readonly i18n = inject(I18nService);

  // ── Compétences frontend ──
  // icon     : classe Font Awesome ou Devicon (via CDN)
  // label    : nom affiché dans le tooltip au survol
  // color    : couleur officielle de la techno
  frontendSkills = [
    { icon: 'fa-brands fa-angular',    label: 'Angular',     color: '#dd1b16' },
    { icon: 'fa-brands fa-html5',      label: 'HTML5',       color: '#e34f26' },
    { icon: 'fa-brands fa-css3-alt',   label: 'CSS3',        color: '#2965f1' },
    { icon: 'fa-brands fa-js',         label: 'JavaScript',  color: '#f7df1e' },
    // { icon: 'si si-flutter',          label: 'Flutter',     color: '#54c5f8' },
    { icon: 'fa-brands fa-react',      label: 'React',       color: '#61dafb' },
    { icon: 'si si-ionic',            label: 'Ionic',       color: '#4e8ef7' },
  ];

  // ── Compétences backend ──
  backendSkills = [
    { icon: 'fa-brands fa-java',       label: 'Java',        color: '#f89820' },
    { icon: 'si si-springboot',       label: 'Spring Boot', color: '#6db33f' },
    { icon: 'fa-brands fa-php',        label: 'PHP',         color: '#777bb4' },
    { icon: 'fa-brands fa-laravel',   label: 'Laravel',     color: '#ff2d20' },
    { icon: 'fa-solid fa-shield-halved', label: 'JWT Auth',  color: '#a0a0a0' },
  ];

  // ── Bases de données & outils ──
  toolSkills = [
    { icon: 'fa-solid fa-database',    label: 'MySQL',       color: '#4479a1' },
    // { icon: 'fa-solid fa-circle-nodes',label: 'Oracle DB',   color: '#f80000' },
    { icon: 'fa-brands fa-git-alt',    label: 'Git',         color: '#f05032' },
    { icon: 'fa-brands fa-github',     label: 'GitHub',      color: '#a0a0a0' },
    { icon: 'fa-solid fa-server',      label: 'REST API',    color: '#6db33f' },
    { icon: 'si si-postgresql',       label: 'PostgreSQL',  color: '#4169e1' },
    { icon: 'si si-n8n',              label: 'n8n',         color: '#ea4b71' },

  ];

  // ── Parcours : les textes sont dans i18n/content.ts (about.timeline),
  //    ici seulement l'icône et le type de chaque étape, dans le même ordre ──
  readonly timelineMeta = [
    { icon: 'fa-solid fa-graduation-cap', type: 'academic' },
    { icon: 'fa-solid fa-briefcase',      type: 'work' },
    { icon: 'fa-solid fa-graduation-cap', type: 'academic' },
  ];

  get timeline() {
    return this.i18n.t().about.timeline.map((item, i) => ({ ...item, ...this.timelineMeta[i] }));
  }

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