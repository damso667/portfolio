// ============================================================
// projects-section.component.ts — Section "Mes réalisations"
//
// Rôle :
//  - Afficher les projets principaux sous forme de cartes
//  - Chaque carte contient : nom, description, technos, liens
//  - Permettre le filtrage par catégorie (optionnel)
//  - Gérer le fallback d'image si aucune capture n'est fournie
// ============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// ── Interface décrivant la structure d'un projet ──
interface Project {
  title: string;
  description: string;
  // Liste des technos utilisées (icône Font Awesome + nom)
  technologies: { icon: string; name: string; color: string }[];
  // Chemin vers la capture d'écran (placer dans src/assets/projects/)
  image: string;
  // Lien vers la démo en ligne (laisser '#' si indisponible)
  demoUrl: string;
  // Lien vers le dépôt GitHub (laisser '#' si privé)
  githubUrl: string;
  // Indique si le projet est mis en avant (carte plus grande)
  featured: boolean;
}

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-section.html',
  styleUrl: './projects-section.css',
})
export class ProjectsSection {

  // ============================================================
  // LISTE DES PROJETS
  // Pour ajouter un projet : copie un objet et modifie ses valeurs.
  // Pour les images : place tes captures dans src/assets/projects/
  //                    et indique le nom du fichier dans "image".
  // Si aucune image n'est disponible, laisse une chaîne vide ''
  //   → un visuel de remplacement (icône + dégradé) sera affiché.
  // ============================================================
  projects: Project[] = [
    {
      title: 'Gestion de Laboratoire Hospitalier',
      description:
        'Application complète de gestion de laboratoire médical : authentification JWT par rôle (médecin, technicien, caissière), gestion des analyses, prescriptions et facturation. Développée durant mon stage chez MCA Conseils.',
      technologies: [
        { icon: 'fa-brands fa-java',     name: 'Spring Boot', color: '#6db33f' },
        { icon: 'fa-brands fa-angular',  name: 'Angular',     color: '#dd1b16' },
        { icon: 'fa-solid fa-database',  name: 'MySQL',       color: '#4479a1' },
        { icon: 'fa-solid fa-shield-halved', name: 'JWT',     color: '#a0a0a0' },
      ],
      image: '', // ← Place 'lab-app.jpg' dans assets/projects/ et indique-le ici
      demoUrl: 'https://mon-projet-frontend-9b5q.vercel.app/login',
      githubUrl: 'https://github.com/damso667/mon-projet-frontend.git',
      featured: true, // Carte mise en avant (plus grande)
    },
        {
      title: 'Mini Gestion bancaire',
      description:
        'Application complète de gestion de laboratoire médical : authentification JWT par rôle (médecin, technicien, caissière), gestion des analyses, prescriptions et facturation. Développée durant mon stage chez MCA Conseils.',
      technologies: [
        { icon: 'fa-brands fa-java',     name: 'Spring Boot', color: '#6db33f' },
        { icon: 'fa-brands fa-angular',  name: 'Angular',     color: '#dd1b16' },
        { icon: 'fa-solid fa-database',  name: 'MySQL',       color: '#4479a1' },
        { icon: 'fa-solid fa-shield-halved', name: 'JWT',     color: '#a0a0a0' },
      ],
      image: '', // ← Place 'lab-app.jpg' dans assets/projects/ et indique-le ici
      demoUrl: 'https://mon-projet-frontend-9b5q.vercel.app/login',
      githubUrl: 'https://github.com/damso667/mon-projet-frontend.git',
      featured: false, // Carte mise en avant (plus grande)
    },
    {
      title: 'QALF — Simulateur d\'Épargne',
      description:
        'Application web permettant de simuler des plans d\'épargne personnalisés avec calculs détaillés des intérêts, stockés et historisés en base de données pour un suivi précis.',
      technologies: [
        { icon: 'fa-brands fa-html5', name: 'HTML5',  color: '#e34f26' },
        { icon: 'fa-brands fa-css3-alt', name: 'CSS3', color: '#1572b6' },
        { icon: 'fa-brands fa-php',   name: 'PHP',   color: '#777bb4' },
        { icon: 'fa-brands fa-js',    name: 'JavaScript', color: '#f7df1e' },
        { icon: 'fa-solid fa-database', name: 'MySQL', color: '#4479a1' },
      ],
      image: '',
      demoUrl: 'http://simulation-qalf.free.je/?i=1',
      githubUrl: 'https://github.com/damso667/simulation-epargne.git',
      featured: false,
    },
    {
      title: 'share Music — Site de music',
      description:
        'ShareMusic est une application moderne de partage de musique qui permet aux utilisateurs de découvrir, écouter et partager leurs morceaux préférés avec leurs amis et la communauté.',
      technologies: [
        { icon: 'fa-brands fa-php',   name: 'PHP',   color: '#777bb4' },
        { icon: 'fa-solid fa-database', name: 'MySQL', color: '#4479a1' },
        { icon: 'fa-brands fa-html5', name: 'HTML5', color: '#e34f26' },
        { icon: 'fa-brands fa-css3-alt', name: 'CSS3', color: '#1572b6' },
      ],
      image: '',
      demoUrl: 'https://sharemusique.nfy.fyi/',
      githubUrl: 'https://github.com/damso667/shareMusique.git',
      featured: false,
    },
    {
      title: 'commentaire Api',
      description:
        'API Commentaires est une API REST développée avec Java Spring Boot permettant la gestion des commentaires au sein d\'une application. Elle offre des fonctionnalités de création, consultation, modification et suppression des commentaires, tout en assurant une communication sécurisée et efficace entre le front-end et la base de données.',
      technologies: [
        { icon: 'fa-brands fa-java', name: 'Java',  color: '#f89820' },
        // { icon: 'fa-solid fa-window-restore', name: 'NetBeans GUI', color: '#a0a0a0' },
        { icon: 'fa-brands fa-java',     name: 'Spring Boot', color: '#6db33f' },
      ],
      image: '',
      demoUrl: '',
      githubUrl: 'https://github.com/damso667/CommentaireApi.git',
      featured: false,
    },
  ];

  /**
   * Vérifie si un projet a une image valide.
   * Utilisé dans le template pour afficher soit l'image,
   * soit un visuel de remplacement (placeholder).
   */
  hasImage(project: Project): boolean {
    return project.image.trim().length > 0;
  }

  /**
   * Vérifie si un lien est valide (différent de '#').
   * Utilisé pour désactiver visuellement les liens non renseignés.
   */
  hasLink(url: string): boolean {
    return url !== '#' && url.trim().length > 0;
  }
}