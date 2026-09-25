// ============================================================
// messervices.component.ts — Section "Mes Services"
//
// Rôle :
//  - Afficher 8 cartes de services dans un carrousel infini
//  - Auto-défilement rapide avec pause au survol
//  - Images de fond floutées avec overlay thème-aware
//  - Animation fluide basée sur transform (GPU-accelerated)
// ============================================================

import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// ── Interface décrivant un service proposé ──
interface Service {
  title: string;
  description: string;
  icon: string;        // Classe Font Awesome
  image: string;       // Chemin vers l'image de fond
}

@Component({
  selector: 'app-messervices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messervices.html',
  styleUrl: './messervices.css',
})
export class Messervices implements OnInit, AfterViewInit, OnDestroy {

  // ── Référence au conteneur du carrousel ──
  @ViewChild('carouselTrack') carouselTrack!: ElementRef<HTMLDivElement>;

  // ── Liste des 8 services proposés ──
  services: Service[] = [
    {
      title: 'Développement Web',
      description: 'Création d\'applications web modernes et performantes avec Angular, React ou Vue.js. Sites vitrines, SPA et plateformes complètes.',
      icon: 'fa-solid fa-code',
      image: '/service-web.jpg',
    },
    {
      title: 'Développement Mobile',
      description: 'Applications mobiles cross-platform avec React Native ou Flutter. Interfaces fluides et expérience native sur iOS et Android.',
      icon: 'fa-solid fa-mobile-screen-button',
      image: '/service-mobile.jpg',
    },
    {
      title: 'CI/CD avec github actions',
      description: 'Mise en place de pipelines d\'intégration et de déploiement continu avec GitHub Actions, Docker et automatisation des workflows.',
      icon: 'fa-solid fa-arrows-spin',
      image: '/service-cicd.jpg',
    },
    {
      title: 'API REST & Backend',
      description: 'Conception et développement d\'APIs robustes avec Spring Boot ou Node.js. Architecture RESTful, authentification JWT et documentation.',
      icon: 'fa-solid fa-server',
      image: '/service-api.jpg',
    },
    {
      title: 'Base de Données',
      description: 'Modélisation, optimisation et administration de bases de données relationnelles (MySQL, PostgreSQL) et NoSQL (MongoDB).',
      icon: 'fa-solid fa-database',
      image: '/service-database.jpg',
    },
    {
      title: 'UI/UX Design',
      description: 'Conception d\'interfaces utilisateur intuitives et esthétiques. Wireframes, prototypes interactifs et design systems cohérents.',
      icon: 'fa-solid fa-palette',
      image: '/service-uiux.jpg',
    },
    {
      title: 'Minimaliste Déploiement Cloud',
      description: 'Déploiement et hébergement sur Vercel. Configuration de domaines, SSL et optimisation des performances.',
      icon: 'fa-solid fa-cloud-arrow-up',
      image: '/service-cloud.jpg',
    },
  ];

  // ── Carrousel dupliqué pour l'effet infini ──
  // On duplique les services pour créer l'illusion de boucle infinie
  carouselServices: Service[] = [];

  // ── État du carrousel ──
  private animationId: number | null = null;
  private scrollPosition = 0;
  private readonly SCROLL_SPEED = 0.8; // Pixels par frame (~48px/s à 60fps)
  private isPaused = false;
  private cardWidth = 0;
  private totalOriginalWidth = 0;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    // Triple les services pour un défilement infini fluide
    this.carouselServices = [
      ...this.services,
      ...this.services,
      ...this.services,
    ];
  }

  ngAfterViewInit(): void {
    // Calculer les dimensions après le rendu
    setTimeout(() => {
      this.calculateDimensions();
      this.startAutoScroll();
    }, 200);
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  /**
   * Calcule la largeur totale d'un set de cartes
   * pour savoir quand réinitialiser la position du scroll.
   */
  private calculateDimensions(): void {
    const track = this.carouselTrack?.nativeElement;
    if (!track) return;

    const cards = track.querySelectorAll('.service-card');
    if (cards.length === 0) return;

    const firstCard = cards[0] as HTMLElement;
    const style = getComputedStyle(track);
    const gap = parseInt(style.gap) || 20;

    this.cardWidth = firstCard.offsetWidth + gap;
    this.totalOriginalWidth = this.cardWidth * this.services.length;
  }

  /**
   * Démarre le défilement automatique du carrousel.
   * Utilise requestAnimationFrame pour une animation fluide GPU-accelerated.
   */
  private startAutoScroll(): void {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        if (!this.isPaused) {
          this.scrollPosition += this.SCROLL_SPEED;

          // Réinitialiser la position quand on a parcouru un set complet
          if (this.scrollPosition >= this.totalOriginalWidth) {
            this.scrollPosition -= this.totalOriginalWidth;
          }

          const track = this.carouselTrack?.nativeElement;
          if (track) {
            track.style.transform = `translateX(-${this.scrollPosition}px)`;
          }
        }
        this.animationId = requestAnimationFrame(animate);
      };
      this.animationId = requestAnimationFrame(animate);
    });
  }

  /**
   * Arrête le défilement automatique.
   */
  private stopAutoScroll(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Pause le carrousel au survol de la souris.
   */
  onMouseEnter(): void {
    this.isPaused = true;
  }

  /**
   * Reprend le carrousel quand la souris quitte la zone.
   */
  onMouseLeave(): void {
    this.isPaused = false;
  }

  /**
   * Vérifie si un service a une image de fond.
   */
  hasImage(service: Service): boolean {
    return service.image.trim().length > 0;
  }
}
