// ============================================================
// intro-loader.ts — Séquence d'ouverture "terminal"
//
// Rôle :
//  - À l'ouverture du portfolio, simule le démarrage d'un
//    environnement de développement dans un terminal
//  - Se joue une seule fois par session (sessionStorage)
//  - Peut être passée (bouton, Échap, Entrée, clic)
//  - Désactivée si l'utilisateur préfère les animations réduites
//  - Pendant l'intro, la classe .intro-running sur <html> met en
//    pause les animations du hero (voir styles.css) ; elles
//    démarrent quand l'intro se termine.
// ============================================================

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

type LineKind = 'cmd' | 'out' | 'ok' | 'progress' | 'welcome';

interface TermLine {
  kind: LineKind;
  text: string;
  shown: string;     // Partie déjà "tapée"
  progress: number;  // 0 → 100 (lignes de type progress)
  done: boolean;
}

// Événement global écouté par le hero pour lancer ses effets
export const INTRO_DONE_EVENT = 'intro-done';

const SESSION_KEY = 'portfolio-intro-seen';

@Component({
  selector: 'app-intro-loader',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './intro-loader.html',
  styleUrl: './intro-loader.css',
})
export class IntroLoader implements OnInit, OnDestroy {

  visible = false;
  leaving = false;
  lines: TermLine[] = [];

  // ── Script de la séquence (modifie-le librement) ──
  private readonly script: { kind: LineKind; text: string }[] = [
    { kind: 'cmd',      text: 'whoami' },
    { kind: 'out',      text: 'noubam_adrien — développeur full stack' },
    { kind: 'cmd',      text: 'cd ~/portfolio && npm run start' },
    { kind: 'progress', text: 'Compilation des modules' },
    { kind: 'ok',       text: 'angular · spring-boot · laravel · flutter · mysql' },
    { kind: 'out',      text: 'Serveur prêt — ouverture de l\'espace de travail…' },
    { kind: 'welcome',  text: 'Bienvenue dans mon univers.' },
  ];

  private timers: ReturnType<typeof setTimeout>[] = [];
  private finished = false;

  ngOnInit(): void {
    if (this.shouldSkip()) {
      this.announceDone();
      return;
    }

    this.visible = true;
    document.documentElement.classList.add('intro-running');
    this.wait(400, () => this.runStep(0));
  }

  ngOnDestroy(): void {
    this.clearTimers();
    document.documentElement.classList.remove('intro-running');
  }

  // ── Raccourcis clavier : Échap / Entrée / Espace pour passer ──
  @HostListener('document:keydown', ['$event'])
  onKey(event: KeyboardEvent): void {
    if (!this.visible || this.leaving) return;
    if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.skip();
    }
  }

  skip(): void {
    this.finish(0);
  }

  // ============================================================
  // DÉROULEMENT DU SCRIPT
  // ============================================================
  private runStep(index: number): void {
    if (this.finished) return;
    const step = this.script[index];
    if (!step) {
      this.finish(900);
      return;
    }

    const line: TermLine = { ...step, shown: '', progress: 0, done: false };
    this.lines.push(line);
    const next = () => this.runStep(index + 1);

    switch (step.kind) {
      case 'cmd':
        this.typeText(line, 38, () => this.wait(260, next));
        break;
      case 'progress':
        line.shown = line.text;
        this.fillProgress(line, () => this.wait(150, next));
        break;
      case 'welcome':
        this.typeText(line, 45, () => this.wait(200, next));
        break;
      default:
        line.shown = line.text;
        line.done = true;
        this.wait(220, next);
    }
  }

  private typeText(line: TermLine, speed: number, then: () => void): void {
    if (line.shown.length >= line.text.length) {
      line.done = true;
      then();
      return;
    }
    line.shown = line.text.slice(0, line.shown.length + 1);
    // Léger aléa pour un rythme de frappe naturel
    this.wait(speed + Math.random() * 30, () => this.typeText(line, speed, then));
  }

  private fillProgress(line: TermLine, then: () => void): void {
    if (line.progress >= 100) {
      line.done = true;
      then();
      return;
    }
    line.progress = Math.min(100, line.progress + 6 + Math.random() * 10);
    this.wait(55, () => this.fillProgress(line, then));
  }

  // Nombre de cases pleines pour la barre ASCII
  progressBlocks(line: TermLine): string {
    const total = 24;
    const full = Math.round((line.progress / 100) * total);
    return '█'.repeat(full) + '░'.repeat(total - full);
  }

  // ============================================================
  // SORTIE DE L'INTRO
  // ============================================================
  private finish(delay: number): void {
    if (this.finished) return;
    this.finished = true;
    this.clearTimers();

    this.wait(delay, () => {
      this.leaving = true;
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* mode privé */ }

      // Le site commence à s'animer pendant que le terminal s'efface
      this.wait(250, () => this.announceDone());
      this.wait(900, () => (this.visible = false));
    });
  }

  private announceDone(): void {
    document.documentElement.classList.remove('intro-running');
    window.dispatchEvent(new CustomEvent(INTRO_DONE_EVENT));
  }

  private shouldSkip(): boolean {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      return false;
    }
  }

  private wait(ms: number, fn: () => void): void {
    this.timers.push(setTimeout(fn, ms));
  }

  private clearTimers(): void {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }
}
