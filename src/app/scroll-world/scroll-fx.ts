// ============================================================
// scroll-fx.ts — Chorégraphie GSAP ScrollTrigger du contenu
//
// Principe (inspiré de gsap.com) :
//  - La photo du hero ne bouge JAMAIS : le hero est épinglé et
//    ce sont les éléments autour d'elle qui défilent de la
//    droite vers la gauche, puis de grands mots (stack) passent
//    derrière elle.
//  - Dans les autres sections, le contenu arrive depuis la
//    droite au rythme du scroll, un grand titre en contour
//    défile en fond, et les projets forment une piste
//    horizontale épinglée.
//
// Les déplacements du contenu existant passent par les
// propriétés CSS individuelles translate / scale (variables
// --fx-*), jamais par `transform` : les animations CSS déjà
// présentes (hero, tilt des cartes…) ne sont pas écrasées.
// ============================================================

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { contenuPour, Lang, LANG_CHANGE_EVENT } from '../i18n/i18n.service';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

// Mots qui traversent le hero : textes dans i18n/content.ts (heroRows),
// dans la langue posée sur <html lang> par I18nService
function heroRows(): string[] {
  const lang: Lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
  return contenuPour(lang).heroRows;
}

export function initScrollFx(): () => void {
  const root = document.documentElement;
  const reveals = Array.from(document.querySelectorAll<HTMLElement>('.animate-on-scroll'));

  // L'ancien système CSS est désactivé : GSAP prend le relais.
  // .visible est posée d'emblée (le tilt des cartes projets en dépend).
  reveals.forEach((el) => {
    el.classList.remove('animate-on-scroll');
    el.classList.add('fx', 'visible');
  });
  root.classList.add('gsap-on');

  const mm = gsap.matchMedia();

  mm.add(
    {
      desktop: '(min-width: 901px)',
      mobile: '(max-width: 900px)',
      reduce: '(prefers-reduced-motion: reduce)',
    },
    (ctx) => {
      const { desktop, reduce } = ctx.conditions as Record<string, boolean>;
      if (reduce) return;

      // Éléments ajoutés au DOM / modifications à annuler au nettoyage
      const cleanups: (() => void)[] = [];
      const hero = document.querySelector<HTMLElement>('.hero-section');
      const heroItems = new Set<HTMLElement>();

      // ── 1. HERO : photo fixe, les éléments autour défilent ──
      if (hero) {
        // Apparition initiale (après l'intro) : depuis la droite
        const intro = reveals.filter((el) => hero.contains(el));
        intro.forEach((el) => heroItems.add(el));
        gsap.fromTo(
          intro,
          { autoAlpha: 0, '--fx-x': desktop ? '120px' : '48px' },
          { autoAlpha: 1, '--fx-x': '0px', duration: 1.2, ease: 'expo.out', stagger: 0.1 },
        );

        // Grandes lignes de texte qui passent derrière la photo
        const band = document.createElement('div');
        band.className = 'hero-marquee';
        band.setAttribute('aria-hidden', 'true');
        const rows = heroRows().map((text, i) => {
          const row = document.createElement('div');
          row.className = `hero-marquee-row${i % 2 ? ' is-outline' : ''}`;
          row.textContent = text.repeat(3);
          band.appendChild(row);
          return row;
        });

        // Changement de langue : on remplace le texte des lignes
        const relabelHero = () => {
          heroRows().forEach((text, i) => {
            if (rows[i]) rows[i].textContent = text.repeat(3);
          });
          ScrollTrigger.refresh();
        };
        window.addEventListener(LANG_CHANGE_EVENT, relabelHero);
        cleanups.push(() => window.removeEventListener(LANG_CHANGE_EVENT, relabelHero));
        hero.appendChild(band);
        cleanups.push(() => band.remove());

        const left = hero.querySelector<HTMLElement>('.hero-left');
        const blocks = gsap.utils.toArray<HTMLElement>('.hero-info-block, .hero-follow-block', hero);
        [left, ...blocks].forEach((el) => el?.classList.add('fx'));

        if (desktop) {
          // Hero épinglé : on scrolle, la photo reste, le décor change
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: '+=180%',
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          tl.to(left, { '--fx-x': () => `${-window.innerWidth * 0.75}px`, autoAlpha: 0, duration: 0.45 }, 0)
            .to(blocks, {
              '--fx-x': () => `${-window.innerWidth * 1.15}px`,
              autoAlpha: 0,
              duration: 0.5,
              stagger: 0.07,
            }, 0.02);

          rows.forEach((row, i) => {
            tl.fromTo(
              row,
              { x: () => window.innerWidth * (1 + i * 0.25) },
              { x: () => -row.scrollWidth * 0.55, duration: 0.85 },
              0.15,
            );
          });
        } else {
          // Mobile : pas d'épinglage, les lignes défilent avec le hero
          rows.forEach((row, i) => {
            gsap.fromTo(
              row,
              { x: () => window.innerWidth * (0.2 + i * 0.3) },
              {
                x: () => -row.scrollWidth * 0.4,
                ease: 'none',
                scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8, invalidateOnRefresh: true },
              },
            );
          });
        }
      }

      // ── 2. Grand titre en contour qui traverse chaque section ──
      gsap.utils.toArray<HTMLElement>('main section:not(.hero-section)').forEach((section) => {
        const label = section.querySelector('.section-label')?.textContent?.trim();
        if (!label) return;

        const marquee = document.createElement('div');
        marquee.className = 'fx-marquee';
        marquee.setAttribute('aria-hidden', 'true');
        marquee.textContent = `${label} — `.repeat(6);
        section.prepend(marquee);
        cleanups.push(() => marquee.remove());

        // Le libellé de section est traduit par Angular : on le relit
        const relabel = () => {
          const next = section.querySelector('.section-label')?.textContent?.trim();
          if (next) marquee.textContent = `${next} — `.repeat(6);
          ScrollTrigger.refresh();
        };
        window.addEventListener(LANG_CHANGE_EVENT, relabel);
        cleanups.push(() => window.removeEventListener(LANG_CHANGE_EVENT, relabel));

        gsap.fromTo(
          marquee,
          { x: () => window.innerWidth * 0.4 },
          {
            x: () => -marquee.scrollWidth * 0.45,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1, invalidateOnRefresh: true },
          },
        );
      });

      // ── 3. Projets : piste horizontale épinglée ──
      const grid = document.querySelector<HTMLElement>('.projects-grid');
      if (grid?.parentElement) {
        const pinWrap = document.createElement('div');
        pinWrap.className = 'projects-pin';
        grid.parentElement.insertBefore(pinWrap, grid);
        pinWrap.appendChild(grid);
        grid.classList.add('is-track');
        cleanups.push(() => {
          // Restaure la grille d'origine
          pinWrap.parentElement?.insertBefore(grid, pinWrap);
          pinWrap.remove();
          grid.classList.remove('is-track');
        });

        const distance = () => Math.max(0, grid.scrollWidth - pinWrap.clientWidth);
        if (distance() > 0) {
          gsap.to(grid, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: pinWrap,
              // Centré verticalement, mais jamais sous le header (72px)
              start: () => `top ${Math.max(88, (window.innerHeight - pinWrap.offsetHeight) / 2)}px`,
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        }
      }

      // ── 4. Le reste du contenu arrive depuis la droite ──
      reveals
        .filter((el) => !heroItems.has(el) && !el.classList.contains('project-card'))
        .forEach((el, i) => {
          const dist = (desktop ? 180 : 64) * (1 + (i % 3) * 0.3);
          gsap.fromTo(
            el,
            { '--fx-x': `${dist}px`, autoAlpha: 0 },
            {
              '--fx-x': '0px',
              autoAlpha: 1,
              ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 62%', scrub: 0.8 },
            },
          );
        });

      // Les déclencheurs ont été créés hors de l'ordre de la page
      // (et les épinglages ajoutent de la hauteur) : on recalcule
      ScrollTrigger.sort();
      ScrollTrigger.refresh();

      // Les images / polices peuvent décaler la mise en page
      window.addEventListener('load', refresh, { once: true });
      document.fonts?.ready.then(refresh);
      return () => {
        window.removeEventListener('load', refresh);
        cleanups.forEach((fn) => fn());
      };
    },
  );

  return () => {
    mm.revert();
    root.classList.remove('gsap-on');
  };
}

function refresh(): void {
  ScrollTrigger.refresh();
}
