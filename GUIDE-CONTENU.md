# Guide : modifier le contenu du portfolio

Tu écris tout **en français**. L'anglais se génère tout seul.

## Où modifier quoi

| Je veux changer… | Fichier |
|---|---|
| Un projet (titre, résumé, fonctionnalités, images, liens, technos) | `src/app/donnees/projets.ts` |
| Les autres textes du site (hero, à propos, services, contact, footer…) | `src/app/i18n/content.ts` |
| Une traduction anglaise qui ne me plaît pas | `src/app/i18n/traductions.en.json` |

## Modifier le texte d'un projet

1. Ouvre `src/app/donnees/projets.ts`.
2. Cherche le projet par son `id` (ex. `id: 'labo'`).
3. Modifie le texte entre guillemets, en français :

```ts
resume: 'Mon nouveau résumé du projet.',
fonctionnalites: [
  'Première fonctionnalité.',
  'Deuxième fonctionnalité.',   // ← tu peux en ajouter ou en retirer
],
```

Attention aux apostrophes : si ton texte contient `'`, entoure-le de guillemets doubles `"…"`.

```ts
resume: "Gestion d'un laboratoire médical.",   // ✓
resume: 'Gestion d'un laboratoire médical.',   // ✗ erreur
```

## La traduction anglaise

Elle se fait **automatiquement** :

- quand tu lances `npm start` (pour travailler en local) ;
- quand tu lances `npm run build`, donc aussi à chaque déploiement sur Vercel.

Tu peux aussi la lancer à la main :

```bash
npm run traduire
```

La commande affiche chaque texte traduit. Seuls les textes **nouveaux ou modifiés** sont envoyés au traducteur ; les anciens ne bougent pas.

Pour corriger une traduction, ouvre `src/app/i18n/traductions.en.json` et change la partie de droite :

```json
"Facturation des examens.": "Billing for lab tests.",
```

Ta correction est gardée tant que le texte français ne change pas.

Pense à **commiter `traductions.en.json`** avec tes changements : c'est ce qui garde tes corrections.

Si Internet ne répond pas ou si le quota gratuit du jour est atteint, le site marche quand même : le texte non traduit s'affiche en français dans la version anglaise, jusqu'à la prochaine traduction.

## Ajouter des images dans la fenêtre de détail d'un projet

1. Crée un dossier au nom du projet dans `public/projets/`, par exemple `public/projets/labo/`.
2. Copie tes images dedans (`.jpg` ou `.webp` de préférence, 1600 px de large maximum, moins de 300 Ko chacune).
3. Dans `src/app/donnees/projets.ts`, liste-les dans `galerie`, **sans** écrire `public` :

```ts
{
  id: 'labo',
  ...
  image: '/labo2.jpg',            // image de la carte
  galerie: [
    '/projets/labo/connexion.jpg',  // s'affiche en premier
    '/projets/labo/analyses.jpg',
    '/projets/labo/mobile-accueil.jpg',
  ],
```

- La fenêtre affiche les images dans cet ordre, avec des flèches et des miniatures.
- Une capture de téléphone (en hauteur) : mets `mobile` dans le nom du fichier pour qu'elle s'affiche en entier au lieu d'être recadrée.
- Si `galerie` est vide (`[]`), la fenêtre affiche simplement l'image de la carte.

## Ajouter un nouveau projet

Copie un bloc `{ ... },` complet dans `PROJETS`, colle-le où tu veux qu'il apparaisse, puis change son `id` (unique, sans espace ni accent) et ses textes. Lance `npm start` : le projet apparaît et sa traduction est faite.
