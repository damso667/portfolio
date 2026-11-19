// ============================================================
// projets.ts — TES PROJETS (c'est ici que tu modifies tout)
//
// Un bloc { ... } = un projet. Tu écris les textes en FRANÇAIS
// seulement : la version anglaise est générée automatiquement
// (commande `npm run traduire`, lancée aussi par `npm start`
// et `npm run build`). Voir GUIDE-CONTENU.md à la racine.
//
// ── Ajouter des images dans la fenêtre de détail ──
//  1. Copie tes images dans  public/projets/<id-du-projet>/
//     (ex. public/projets/labo/connexion.jpg)
//  2. Ajoute leur chemin dans `galerie`, SANS le mot "public" :
//       galerie: ['/projets/labo/connexion.jpg', ...]
//  La première image de la galerie s'affiche en premier.
//  Captures de téléphone : mets "mobile" dans le nom du fichier
//  (ex. mobile-accueil.jpg) pour qu'elles s'affichent en entier.
// ============================================================

/** Une technologie affichée en badge */
export interface Techno {
  /** Icône : classe Font Awesome (fa-brands fa-angular) ou logo local (si si-ionic) */
  icone: string;
  nom: string;
  couleur: string;
}

/** Un lien en plus dans la fenêtre de détail */
export interface Lien {
  libelle: string;
  url: string;
  icone: string;
}

export interface Projet {
  /** Identifiant unique, sans espace ni accent (sert aussi de nom de dossier d'images) */
  id: string;

  // ── Textes (en français, traduits automatiquement) ──
  titre: string;
  /** Résumé affiché sur la carte */
  resume: string;
  /** Contexte : stage, projet perso, année… (facultatif) */
  contexte?: string;
  /** Ce que tu as fait sur le projet (facultatif) */
  role?: string;
  /** Liste des fonctionnalités affichées dans la fenêtre de détail */
  fonctionnalites: string[];

  // ── Visuels ──
  /** Image de la carte */
  image: string;
  /** Images de la fenêtre de détail (si vide : on affiche `image`) */
  galerie?: string[];

  // ── Liens (laisse '' si tu n'en as pas) ──
  demo: string;
  code: string;
  autresLiens?: Lien[];

  technos: Techno[];
  /** true = grande carte "Projet phare" */
  enAvant?: boolean;
}

// Technologies réutilisées dans plusieurs projets
const SPRING: Techno = { icone: 'si si-springboot', nom: 'Spring Boot', couleur: '#6db33f' };
const ANGULAR: Techno = { icone: 'fa-brands fa-angular', nom: 'Angular', couleur: '#dd1b16' };
const MYSQL: Techno = { icone: 'fa-solid fa-database', nom: 'MySQL', couleur: '#4479a1' };
const JWT: Techno = { icone: 'fa-solid fa-shield-halved', nom: 'JWT', couleur: '#a0a0a0' };
const PHP: Techno = { icone: 'fa-brands fa-php', nom: 'PHP', couleur: '#777bb4' };
const HTML: Techno = { icone: 'fa-brands fa-html5', nom: 'HTML5', couleur: '#e34f26' };
const CSS: Techno = { icone: 'fa-brands fa-css3-alt', nom: 'CSS3', couleur: '#1572b6' };

export const PROJETS: Projet[] = [

  // ────────────────────────────────────────────────────────────
  {
    id: 'presencencl',
    titre: 'PresenceNCL (SAAS diponible sur contact)',
    resume:
      "Application de pointage par QR code. L'employé scanne le code affiché sur une borne, le serveur enregistre son arrivée et son départ, et l'administrateur suit les présences, les retards, les congés et les rapports.",
    contexte: 'Projet de stage, 2026. En ligne, avec une évolution en cours vers un service multi-entreprise.',
    role: 'Conception et développement complets : API Spring Boot, application mobile Ionic, espace administrateur, borne et déploiement continu.',
    fonctionnalites: [
      'QR code renouvelé toutes les 45 secondes sur une borne (tablette) : une photo du code ne permet pas de pointer plus tard.',
      'Trois espaces dans une seule application : employé sur mobile, administrateur sur le web, borne sur tablette.',
      'Règles horaires du Cameroun : pause de midi, samedi sur convocation, jours fériés officiels calculés automatiquement.',
      "Congés demandés par l'employé ou accordés directement par l'administrateur.",
      'Rapports de présence exportables en PDF et en Word.',
      "Authentification JWT avec un jeton de rafraîchissement à usage unique, lié à l'appareil.",
    ],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR98xHGfliuVutoC8tye96ECwTBMQTt1vnvx8zohLoFSA&s=10',
    galerie: [
      '/presencencl/dashboard.jpg',
      '/presencencl/borne.jpg',
      '/presencencl/mobile-scan.jpg',
      '/presencencl/mobile-pointage.jpg',
      '/presencencl/mobile-accueil.jpg',
      '/presencencl/presences.jpg',
      '/presencencl/rapports.jpg',
    ],
    demo: '',
    code: 'https://github.com/damso667/PresenceNCL_Backend',
    autresLiens: [
      { libelle: 'PresenceNCL_Frontend', url: 'https://github.com/damso667/PresenceNCL_Frontend', icone: 'fa-brands fa-github' },
    ],
    technos: [
      SPRING,
      { icone: 'si si-ionic', nom: 'Ionic', couleur: '#4e8ef7' },
      ANGULAR,
      { icone: 'si si-postgresql', nom: 'PostgreSQL', couleur: '#4169e1' },
      JWT,
      { icone: 'fa-brands fa-github', nom: 'GitHub Actions', couleur: '#a0a0a0' },
    ],
    enAvant: true,
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 'labo',
    titre: 'Gestion de laboratoire hospitalier',
    resume:
      "Gestion d'un laboratoire médical : analyses, prescriptions et facturation, avec un accès par rôle pour le médecin, le technicien et la caissière.",
    contexte: 'Projet de stage chez MCA Conseils Sarl, 2025.',
    role: 'Modélisation des données, API Spring Boot, interface Angular et authentification JWT.',
    fonctionnalites: [
      'Authentification JWT avec trois rôles : médecin, technicien et caissière.',
      'Prescription des analyses et suivi de leur traitement.',
      'Rendu d\'analyse avec génération d’un PDF et envoi par email au patient.',
    ],
    image: '/labo2.jpg',
    galerie: ['/labo2.jpg','/labo/formulaire.png'],
    demo: 'https://mon-projet-frontend-9b5q.vercel.app/login',
    code: 'https://github.com/damso667/mon-projet-frontend.git',
    technos: [SPRING, ANGULAR, MYSQL, JWT],
    enAvant: true,
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 'qalf-shop',
    titre: 'QALF SHOP',
    resume:
      "Boutique en ligne avec paiement mobile money (MTN Mobile Money et Orange Money). Application installable sur téléphone (PWA), pensée pour Android et une connexion irrégulière, avec un back-office complet.",
    role: 'Conception et développement complets : interface Angular 20, API Spring Boot 4, base PostgreSQL et déploiement.',
    fonctionnalites: [
      'Catalogue, recherche, fiche article, panier, commande et compte client.',
      'Paiement mobile money MTN et Orange avec suivi du statut et historique des commandes.',
      "Paiements idempotents : un double-clic, un rechargement ou une nouvelle tentative réseau ne débite jamais deux fois.",
      'Back-office : tableau de bord, paiements et remboursements, catalogue et stock, commandes, clients, modération des avis et journal d\'audit.',
      "Nom, slogan, couleur et logo de la boutique modifiables depuis le back-office, sans redéploiement, jusqu'à l'icône de l'application installée.",
      "L'interface prévient quand le serveur gratuit se réveille au lieu de laisser croire à une panne.",
    ],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBkOWYyuFQLEclfzXak-If3s6DCX-FPcILBKJn2ddorA&s=10',
    galerie: ['/qalf-shop/image.png', '/qalf-shop/image2.png'],
    demo: 'https://qalf-shop.vercel.app',
    code: 'https://github.com/damso667/e-commerceFront',
    autresLiens: [
      { libelle: 'e-commerceBd (API)', url: 'https://github.com/damso667/e-commerceBd', icone: 'fa-brands fa-github' },
    ],
    technos: [
      ANGULAR,
      SPRING,
      { icone: 'si si-postgresql', nom: 'PostgreSQL', couleur: '#4169e1' },
      { icone: 'fa-solid fa-mobile-screen-button', nom: 'PWA', couleur: '#5a0fc8' },
      { icone: 'fa-solid fa-money-bill-wave', nom: 'Mobile Money', couleur: '#ffcc00' },
    ],
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 'banque',
    titre: 'Mini gestion bancaire',
    resume:
      'Gestion de comptes bancaires : virements entre comptes et mise à jour des comptes, avec trois rôles (administrateur, utilisateur, caissière).',
    fonctionnalites: [
      'Virements entre comptes.',
      'Création et mise à jour des comptes.',
      'Accès par rôle : administrateur, utilisateur et caissière, sécurisé par JWT.',
    ],
    image: '/bank.jpg',
    galerie: ['bank.jpg','/banque/home.png','/banque/formulaire.png'],
    demo: 'https://projet-banque-front.vercel.app/',
    // ⚠ Même dépôt que le projet laboratoire : à corriger si besoin
    code: 'https://github.com/damso667/mon-projet-frontend.git',
    technos: [SPRING, ANGULAR, MYSQL, JWT],
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 'qalf',
    titre: "QALF, simulateur d'épargne",
    resume:
      "Simulation de plans d'épargne personnalisés avec le détail du calcul des intérêts. Chaque simulation est enregistrée en base pour garder un historique.",
    fonctionnalites: [
      "Simulation d'un plan d'épargne sur mesure.",
      'Détail du calcul des intérêts.',
      'Historique des simulations enregistré dans MySQL.',
    ],
    image: '/epargne.jpg',
    galerie: [],
    demo: 'http://simulation-qalf.free.je',
    code: 'https://github.com/damso667/simulation-epargne.git',
    technos: [HTML, CSS, PHP, { icone: 'fa-brands fa-js', nom: 'JavaScript', couleur: '#f7df1e' }, MYSQL],
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 'sharemusic',
    titre: 'ShareMusic',
    resume:
      'Plateforme de partage de musique : on y découvre et on y écoute des morceaux, puis on les partage avec ses amis et la communauté.',
    fonctionnalites: [
      'Écoute de morceaux en ligne.',
      'Partage avec ses amis et la communauté.',
      'Découverte de nouveaux titres.',
    ],
    image: '/musique.jpg',
    galerie: [],
    demo: 'https://sharemusique.nfy.fyi/',
    code: 'https://github.com/damso667/shareMusique.git',
    technos: [PHP, MYSQL, HTML, CSS],
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 'commentaires',
    titre: 'API Commentaires',
    resume:
      "API REST en Java Spring Boot qui gère les commentaires d'une application : création, lecture, modification et suppression.",
    fonctionnalites: [
      'CRUD complet sur les commentaires.',
      'Architecture REST entre le front-end et la base de données.',
    ],
    image: '/api.jpg',
    galerie: [],
    demo: '',
    code: 'https://github.com/damso667/CommentaireApi.git',
    technos: [{ icone: 'fa-brands fa-java', nom: 'Java', couleur: '#f89820' }, SPRING],
  },
];

/** Les champs de texte d'un projet (ceux qu'on traduit) */
export function textesDuProjet(p: Projet): string[] {
  return [p.titre, p.resume, p.contexte, p.role, ...p.fonctionnalites].filter(
    (t): t is string => !!t,
  );
}
