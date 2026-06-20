// ============================================================
// main.ts — Point d'entrée de l'application Angular 20
//
// Ce fichier démarre l'application en mode standalone.
// Il est appelé automatiquement par Angular CLI au build.
// ============================================================

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent }         from './app/app';
import { appConfig }            from './app/app.config';

// ── Démarrage de l'application ──
// bootstrapApplication remplace platformBrowserDynamic().bootstrapModule()
// qui était utilisé avec les NgModules dans les anciennes versions d'Angular.
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => {
    // Affiche les erreurs de démarrage dans la console
    console.error('Erreur au démarrage de l\'application :', err);
  });