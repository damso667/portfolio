// ============================================================
// projects-section.ts — Section "Mes réalisations"
//
// Les projets (textes, images, liens) se modifient dans
// src/app/donnees/projets.ts — pas ici.
//
// Rôle :
//  - Afficher les projets sous forme de cartes
//  - Ouvrir une fenêtre de détail (ProjectModal) au clic sur une carte
// ============================================================

import { Component, computed, inject, signal } from '@angular/core';
import { TiltDirective } from '../tilt/tilt.directive';
import { I18nService } from '../i18n/i18n.service';
import { PROJETS, Projet } from '../donnees/projets';
import { ProjectModal } from './project-modal/project-modal';

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [TiltDirective, ProjectModal],
  templateUrl: './projects-section.html',
  styleUrl: './projects-section.css',
})
export class ProjectsSection {

  readonly i18n = inject(I18nService);

  /** Projets avec leurs textes dans la langue active */
  readonly projets = computed(() => PROJETS.map((p) => this.i18n.projet(p)));

  /** Identifiant du projet ouvert dans la fenêtre de détail (null = fermée) */
  private readonly selectedId = signal<string | null>(null);

  readonly selected = computed(() => this.projets().find((p) => p.id === this.selectedId()) ?? null);

  open(projet: Projet): void {
    this.selectedId.set(projet.id);
  }

  close(): void {
    this.selectedId.set(null);
  }

  hasLink(url: string | undefined): boolean {
    return !!url && url !== '#' && url.trim().length > 0;
  }
}
