// ============================================================
// i18n.service.ts — Langue du portfolio (français / anglais)
//
// Les textes sont écrits en français (content.ts, projets.ts).
// En anglais, chaque texte est remplacé par sa traduction trouvée
// dans traductions.en.json (clé = texte français exact).
// Un texte pas encore traduit reste en français : lance
// `npm run traduire` (ou simplement `npm start`) pour compléter.
//
// La langue choisie est mémorisée (localStorage). Sans choix
// enregistré, on suit la langue du navigateur (français par défaut).
// ============================================================

import { Injectable, Injector, afterNextRender, computed, inject, signal } from '@angular/core';
import { CONTENT_FR, Content } from './content';
import TRADUCTIONS_EN from './traductions.en.json';
import type { Projet } from '../donnees/projets';

export type Lang = 'fr' | 'en';

const STORAGE_KEY = 'portfolio-lang';
const DICT_EN = TRADUCTIONS_EN as Record<string, string>;

/** Événement global émis après un changement de langue (lu par scroll-fx) */
export const LANG_CHANGE_EVENT = 'portfolio-lang-change';

/** Traduit un texte français en anglais (ou le renvoie tel quel) */
export function traduireEn(texte: string): string {
  return DICT_EN[texte] ?? texte;
}

/** Copie d'un objet où chaque texte est passé dans `fn` */
function mapTextes<T>(valeur: T, fn: (s: string) => string): T {
  if (typeof valeur === 'string') return fn(valeur) as T;
  if (Array.isArray(valeur)) return valeur.map((v) => mapTextes(v, fn)) as T;
  if (valeur && typeof valeur === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(valeur)) out[k] = mapTextes(v, fn);
    return out as T;
  }
  return valeur;
}

/** Textes du site pour une langue */
export function contenuPour(lang: Lang): Content {
  return lang === 'fr' ? CONTENT_FR : mapTextes(CONTENT_FR, traduireEn);
}

const CONTENU_EN = contenuPour('en');

@Injectable({ providedIn: 'root' })
export class I18nService {
  private injector = inject(Injector);

  readonly lang = signal<Lang>(this.initialLang());

  /** Textes de la langue active : `i18n.t().hero.cv` */
  readonly t = computed<Content>(() => (this.lang() === 'fr' ? CONTENT_FR : CONTENU_EN));

  constructor() {
    this.applyToDocument();
  }

  /** Traduit un texte écrit en français selon la langue active */
  tr(texte: string): string {
    return this.lang() === 'fr' ? texte : traduireEn(texte);
  }

  /** Un projet avec ses textes dans la langue active */
  projet(p: Projet): Projet {
    if (this.lang() === 'fr') return p;
    return {
      ...p,
      titre: traduireEn(p.titre),
      resume: traduireEn(p.resume),
      contexte: p.contexte && traduireEn(p.contexte),
      role: p.role && traduireEn(p.role),
      fonctionnalites: p.fonctionnalites.map(traduireEn),
    };
  }

  toggle(): void {
    this.set(this.lang() === 'fr' ? 'en' : 'fr');
  }

  set(lang: Lang): void {
    if (lang === this.lang()) return;
    this.lang.set(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* mode privé : la langue ne sera pas mémorisée */
    }
    this.applyToDocument();
    // On prévient le reste (scroll-fx) une fois le DOM traduit par Angular
    afterNextRender(
      () => window.dispatchEvent(new CustomEvent(LANG_CHANGE_EVENT, { detail: lang })),
      { injector: this.injector },
    );
  }

  private applyToDocument(): void {
    const t = this.t();
    document.documentElement.lang = this.lang();
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description);
  }

  private initialLang(): Lang {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'fr' || saved === 'en') return saved;
    } catch {
      /* localStorage indisponible */
    }
    return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'fr';
  }
}
