// ============================================================
// content.ts — Les textes du site (hors projets), EN FRANÇAIS
//
// Modifie les textes ici, en français seulement. La version
// anglaise est générée automatiquement dans traductions.en.json
// par la commande `npm run traduire` (lancée aussi par
// `npm start` et `npm run build`). Voir GUIDE-CONTENU.md.
//
// Les chaînes qui contiennent <strong> sont affichées en HTML.
// Les textes des projets sont dans src/app/donnees/projets.ts.
// ============================================================

export type Lang = 'fr' | 'en';

export interface ServiceText {
  title: string;
  description: string;
}

const fr = {
  meta: {
    title: 'Noubam Adrien | Développeur full stack',
    description:
      'Portfolio de Noubam Adrien, développeur full stack à Yaoundé (Cameroun) : Angular, Spring Boot, Ionic, Laravel, PostgreSQL et MySQL.',
  },

  nav: {
    aria: 'Navigation principale',
    home: 'Accueil',
    about: 'À propos',
    projects: 'Projets',
    services: 'Services',
    contact: 'Contact',
    brandAria: "Retour à l'accueil",
    cvAria: 'Télécharger le CV de Noubam Adrien',
    toLight: 'Passer en mode clair',
    toDark: 'Passer en mode sombre',
    langSwitch: 'Switch to English',
    langCode: 'EN',
  },

  intro: {
    aria: 'Introduction du portfolio',
    prompt: 'visiteur@noubam-dev: ~/portfolio',
    skip: "Passer l'intro",
    skipKey: 'Échap',
    script: [
      { kind: 'cmd', text: 'whoami' },
      { kind: 'out', text: 'noubam_adrien : développeur full stack' },
      { kind: 'cmd', text: 'cd ~/portfolio && npm run start' },
      { kind: 'progress', text: 'Compilation des modules' },
      { kind: 'ok', text: 'angular · spring-boot · ionic · laravel · postgresql · mysql' },
      { kind: 'out', text: "Serveur prêt, ouverture de l'espace de travail…" },
      { kind: 'welcome', text: 'Bienvenue.' },
    ],
  },

  hero: {
    codeVar: 'developpeur',
    typed: ['Développeur full stack', 'Angular · Spring Boot · Ionic', 'Du modèle de données à la mise en ligne'],
    description:
      "Formé en <strong>Génie Logiciel</strong> à l'ISMAT de Yaoundé, je construis des applications web et mobiles complètes avec <strong>Angular</strong>, <strong>Spring Boot</strong>, <strong>Ionic</strong>, <strong>Laravel</strong> et <strong>Flutter</strong>. Je m'occupe de l'API, de l'interface, de la base de données et du déploiement.",
    cv: 'Télécharger le CV',
    cvAria: 'Télécharger le CV de Noubam Adrien',
    explore: 'Voir les projets',
    exploreAria: 'Aller à la section projets',
    aboutTitle: 'À propos',
    aboutText:
      "Je pars d'un besoin concret, comme pointer sa présence ou gérer un laboratoire, et j'en fais une application que les gens utilisent au quotidien.",
    aboutLink: 'En savoir plus',
    workTitle: 'Mon travail',
    workText:
      'Applications web et mobiles en Angular, Spring Boot, Ionic et Laravel, dont PresenceNCL, une application de pointage par QR code en ligne.',
    workLink: 'Voir le portfolio',
    followTitle: 'Me suivre',
    socialGithub: 'Voir mon profil GitHub',
    socialLinkedin: 'Voir mon profil LinkedIn',
    socialEmail: "M'envoyer un email",
  },

  about: {
    label: 'À propos',
    title: 'Qui suis-je ?',
    subtitle:
      "Développeur full stack : je conçois l'API, l'interface et la base de données, puis je mets l'application en ligne.",
    bio: [
      "Formé en <strong>Génie Logiciel</strong> à l'ISMAT de Yaoundé, je développe des applications web et mobiles de bout en bout. Je soigne autant l'organisation du code que ce que l'utilisateur voit à l'écran.",
      "En stage chez <strong>MCA Conseils Sarl</strong>, j'ai conçu une application de gestion de laboratoire hospitalier, de la modélisation des données jusqu'à l'authentification JWT par rôle.",
      "Plus récemment, j'ai construit <strong>PresenceNCL</strong>, une application de pointage par QR code : API Spring Boot, application mobile Ionic, base PostgreSQL et déploiement continu avec GitHub Actions.",
    ],
    journeyTitle: 'Mon parcours',
    timeline: [
      {
        period: 'Juin 2026 - Sept 2026',
        title: 'Stage Profetionnel - Développeur Backend',
        organization: 'NCL Unlimited, Yaoundé',
        description: 'Participation à la conception backend de lapplication mobile HEMLE, avec Express et PostgreSQL(Supabase) et Mise en place d\'automatisation de flux de travail avec n8n pour la gestion des données et des notifications.',
      },
      {
        period: 'Juin 2026 - Sept 2026',
        title: 'Stage Profetionnel - Développeur Backend',
        organization: 'Stevo Digital, Yaoundé',
        description: 'Participation à la conception backend d’une application web Affricaine AfriConnect, avec Express et PostgreSQL(Supabase) et Mise en place d\'automatisation de flux de travail avec n8n pour la gestion des données et des notifications.',
      },
      {
        period: '2026',
        title: 'BTS Génie Logiciel',
        organization: 'ISMAT, Yaoundé (Cameroun)',
        description: 'Développement logiciel, algorithmique, bases de données, réseaux et gestion de projet.',
      },
      {
        period: 'Juin 2025 - Sept 2025',
        title: 'Stage Academique- Développeur web',
        organization: 'MCA Conseils Sarl, Yaoundé',
        description: 'Développement d’une application de gestion de laboratoire hospitalier, avec Spring Boot, Angular et PostgreSQL.',
      },
      {
        period: '2024',
        title: 'Baccalauréat scientifique',
        organization: "Lycée d'Ekorezok",
        description: 'Série scientifique, dominante mathématiques.',
      },
    ],
    frontend: 'Frontend et mobile',
    backend: 'Backend et API',
    tools: 'Bases de données et outils',
    lookingTitle: 'Ce que je recherche',
    lookingText:
      'Un poste ou une mission de développeur full stack, dans une équipe où je livre des fonctionnalités complètes et où je continue de progresser.',
  },

  projects: {
    label: 'Portfolio',
    title: 'Mes réalisations',
    subtitle:
      'Des applications conçues et mises en ligne de bout en bout. Cliquez sur un projet pour voir le détail.',
    featured: 'Projet phare',
    demo: 'Démo',
    code: 'Code',
    seeDemo: 'Voir la démo',
    source: 'Code source',
    details: 'Voir le détail',
    noLinks: 'Démo sur demande',
    demoAria: 'Voir la démo de',
    codeAria: 'Voir le code source de',
    openAria: 'Voir le détail du projet',
    imageAlt: 'Capture du projet',
  },

  modal: {
    close: 'Fermer',
    context: 'Contexte',
    role: 'Mon rôle',
    features: 'Fonctionnalités',
    stack: 'Technologies',
    gallery: 'Captures',
    showImage: "Afficher l'image",
    prevImage: 'Image précédente',
    nextImage: 'Image suivante',
    links: 'Liens',
  },

  services: {
    label: 'Services',
    title: 'Mes services',
    subtitle: "Ce que je peux prendre en charge sur votre projet, de la première maquette jusqu'à la mise en ligne.",
    prev: 'Service précédent',
    next: 'Service suivant',
    pause: 'Mettre le défilement en pause',
    play: 'Reprendre le défilement',
    items: [
      {
        title: 'Développement web',
        description: 'Applications web en Angular ou React : sites vitrines, applications monopage et plateformes complètes.',
      },
      {
        title: 'Développement mobile',
        description: "Applications Android et iOS avec Ionic, Flutter ou React Native, à partir d'une seule base de code.",
      },
      {
        title: 'CI/CD avec GitHub Actions',
        description: "Pipelines d'intégration et de déploiement continus avec GitHub Actions et Docker : chaque push est testé puis déployé.",
      },
      {
        title: 'API REST et backend',
        description: 'API REST avec Spring Boot ou Node.js : authentification JWT, gestion des rôles, validation et documentation.',
      },
      {
        title: 'Bases de données',
        description: 'Modélisation et optimisation de bases relationnelles (MySQL, PostgreSQL) ou NoSQL (MongoDB).',
      },
      {
        title: 'UI/UX design',
        description: 'Maquettes, prototypes interactifs et design systems, pour des interfaces claires sur mobile comme sur ordinateur.',
      },
      {
        title: 'Déploiement cloud',
        description: 'Mise en ligne sur Vercel et Render, avec nom de domaine, HTTPS et suivi des performances.',
      },
      {
        title: 'Automatisation avec n8n',
        description: "Des workflows n8n qui relient vos outils entre eux : formulaires, emails, bases de données et API. Les tâches répétitives tournent seules, à heure fixe ou au déclenchement d'un webhook.",
      },
    ] as ServiceText[],
  },

  contact: {
    label: 'Contact',
    title: 'Travaillons ensemble',
    subtitle: 'Une offre de stage, une mission freelance ou un poste à pourvoir ? Écrivez-moi.',
    infoTitle: 'Parlons de votre projet',
    infoText:
      'Je suis disponible pour un stage, une mission freelance ou un poste de développeur full stack. Je réponds sous 48 h.',
    emailLabel: 'Email',
    locationLabel: 'Localisation',
    location: 'Yaoundé, Cameroun',
    name: 'Nom complet',
    namePh: 'Votre nom',
    nameErr: 'Le nom doit contenir au moins 2 caractères.',
    email: 'Adresse email',
    emailPh: 'votre.email@exemple.com',
    emailErr: 'Saisissez une adresse email valide.',
    subject: 'Sujet',
    subjectPh: 'Ex. : proposition de stage',
    subjectErr: 'Indiquez un sujet (3 caractères minimum).',
    message: 'Message',
    messagePh: 'Votre message…',
    messageErr: 'Le message doit contenir au moins 10 caractères.',
    send: 'Envoyer le message',
    sending: 'Envoi en cours…',
    sent: 'Message envoyé',
    success: 'Merci pour votre message, je vous réponds rapidement.',
    errService: "Le service d'envoi n'a pas pu se charger. Écrivez-moi directement par email.",
    errSend: "Le message n'est pas parti. Réessayez ou écrivez-moi directement par email.",
  },

  footer: {
    tagline: "Développeur full stack. Applications web et mobiles, de l'API à l'interface.",
    navTitle: 'Navigation',
    findMe: 'Me retrouver',
    rights: 'Tous droits réservés.',
    privacy: 'Politique de confidentialité',
    backTop: 'Retour en haut de la page',
  },

  /** Lignes qui défilent derrière la photo du hero (scroll-fx) */
  heroRows: [
    'Angular — Spring Boot — Ionic — Laravel — ',
    'Développeur full stack — Génie Logiciel — Yaoundé — ',
  ],
};

export type Content = typeof fr;

export const CONTENT_FR: Content = fr;
