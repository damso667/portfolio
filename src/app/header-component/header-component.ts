// ============================================================
// header-component.ts — HUD de navigation
//
// Rôle :
//  - Afficher trois îlots flottants au-dessus du décor 3D :
//      marque (gauche) · dock des sections (centre) · actions (droite)
//  - Sur mobile, le dock des sections descend en bas de l'écran,
//    à portée du pouce : la section visible s'élargit pour afficher
//    son libellé, les autres restent en icône. Plus de hamburger.
//  - Détecter la section visible (IntersectionObserver) et y faire
//    glisser le marqueur du dock (desktop).
//  - Émettre le changement de thème vers AppComponent.
// ============================================================

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
} from '@angular/core';
import { I18nService } from '../i18n/i18n.service';
import { Content } from '../i18n/content';

/** Un onglet du dock */
interface NavLink {
  /** Clé du libellé dans les textes traduits (content.ts → nav) */
  key: keyof Content['nav'];
  anchor: string;
  /** Classes Font Awesome — affichées seulement dans le dock bas mobile */
  icon: string;
}

/** Géométrie d'un onglet dans le dock, mesurée une seule fois */
interface TabMetric {
  x: number;
  w: number;
}

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {

  // ── Thème courant, reçu depuis AppComponent ──
  @Input() currentTheme: 'dark' | 'light' = 'dark';

  // ── Langue (FR / EN) ──
  readonly i18n = inject(I18nService);

  // ── Demande de bascule du thème vers AppComponent ──
  @Output() themeToggle = new EventEmitter<void>();

  // ── Sections du portfolio ──
  readonly navLinks: NavLink[] = [
    { key: 'home',     anchor: 'accueil',  icon: 'fa-solid fa-house' },
    { key: 'about',    anchor: 'apropos',  icon: 'fa-solid fa-user' },
    { key: 'projects', anchor: 'projets',  icon: 'fa-solid fa-layer-group' },
    { key: 'services', anchor: 'services', icon: 'fa-solid fa-cube' },
    { key: 'contact',  anchor: 'contact',  icon: 'fa-solid fa-paper-plane' },
  ];

  // ── Section actuellement visible ──
  activeSection = 'accueil';

  // ── Le HUD se resserre dès que la page défile ──
  isScrolled = false;

  // ── Position et largeur du marqueur glissant (desktop) ──
  markerX = 0;
  markerW = 0;

  // ── Le premier placement du marqueur ne doit pas s'animer ──
  markerReady = false;

  // La piste et ses onglets, pour mesurer leur géométrie
  @ViewChild('rail') private rail?: ElementRef<HTMLElement>;
  @ViewChildren('tab') private tabs!: QueryList<ElementRef<HTMLElement>>;

  // L'état actif ne change ni la graisse ni la taille des onglets :
  // leur géométrie ne bouge donc qu'avec la largeur de la piste.
  private metrics: TabMetric[] = [];

  private sectionObserver?: IntersectionObserver;
  private railObserver?: ResizeObserver;
  private measureFrame = 0;

  // ============================================================
  // CYCLE DE VIE
  // ============================================================
  ngOnInit(): void {
    this.observeSections();
  }

  ngAfterViewInit(): void {
    // La largeur des onglets dépend de la police : tant qu'Inter n'a
    // pas remplacé la police de secours, toute mesure est périmée.
    // On observe donc la piste au lieu de mesurer une seule fois.
    const rail = this.rail?.nativeElement;
    if (rail) {
      this.railObserver = new ResizeObserver(() => this.scheduleMeasure());
      this.railObserver.observe(rail);
    } else {
      this.scheduleMeasure();
    }
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.measureFrame);
    this.sectionObserver?.disconnect();
    this.railObserver?.disconnect();
  }

  // ============================================================
  // ÉTAT AU SCROLL
  // ============================================================
  @HostListener('window:scroll')
  onScroll(): void {
    const scrolled = window.scrollY > 24;
    if (scrolled !== this.isScrolled) this.isScrolled = scrolled;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.scheduleMeasure();
  }

  // ============================================================
  // MARQUEUR GLISSANT
  // ============================================================
  private scheduleMeasure(): void {
    cancelAnimationFrame(this.measureFrame);
    this.measureFrame = requestAnimationFrame(() => {
      this.measure();
      // Une frame de plus avant d'autoriser la transition
      requestAnimationFrame(() => (this.markerReady = true));
    });
  }

  private measure(): void {
    if (!this.tabs) return;
    // offsetLeft est relatif au dock, qui est le parent positionné :
    // le marqueur partage donc le même repère.
    this.metrics = this.tabs.map(({ nativeElement }) => ({
      x: nativeElement.offsetLeft,
      w: nativeElement.offsetWidth,
    }));
    this.placeMarker();
  }

  private placeMarker(): void {
    const metric = this.metrics[this.activeIndex];
    if (!metric) return;
    this.markerX = metric.x;
    this.markerW = metric.w;
  }

  get activeIndex(): number {
    const index = this.navLinks.findIndex((link) => link.anchor === this.activeSection);
    return index < 0 ? 0 : index;
  }

  // ============================================================
  // SECTION VISIBLE
  // ============================================================
  private observeSections(): void {
    // Les sections sont montées par AppComponent : on laisse un tour
    setTimeout(() => {
      const sections = document.querySelectorAll<HTMLElement>('section[id]');
      if (!sections.length) return;

      this.sectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            this.activeSection = entry.target.id;
            this.placeMarker();
          }
        },
        // Bande de détection étroite, au tiers haut de l'écran
        { rootMargin: '-30% 0px -65% 0px' },
      );

      sections.forEach((section) => this.sectionObserver!.observe(section));
    }, 300);
  }

  // ============================================================
  // ACTIONS
  // ============================================================
  navigateTo(anchor: string): void {
    const target = document.getElementById(anchor);
    if (!target) return;

    // Desktop : le HUD est en haut, on dégage sa hauteur.
    // Mobile : le dock est en bas, il ne masque pas le haut de section.
    const offset = this.isCompact ? 28 : 96;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
      top,
      behavior: this.prefersReducedMotion ? 'auto' : 'smooth',
    });
  }

  onThemeToggle(): void {
    this.themeToggle.emit();
  }

  isActive(anchor: string): boolean {
    return this.activeSection === anchor;
  }

  get themeLabel(): string {
    const nav = this.i18n.t().nav;
    return this.currentTheme === 'dark' ? nav.toLight : nav.toDark;
  }

  onLangToggle(): void {
    this.i18n.toggle();
    // Les libellés changent de largeur : on remesure le dock
    setTimeout(() => this.scheduleMeasure());
  }

  private get isCompact(): boolean {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  private get prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
