// ============================================================
// traduire.mjs — Traduit automatiquement les textes en anglais
//
// Usage :  npm run traduire
// (lancé aussi tout seul avant `npm start` et `npm run build`)
//
// 1. Lit tous les textes français :
//      src/app/i18n/content.ts     (textes du site)
//      src/app/donnees/projets.ts  (textes des projets)
// 2. Cherche ceux qui n'ont pas encore de traduction dans
//      src/app/i18n/traductions.en.json
// 3. Les traduit avec l'API gratuite MyMemory (sans compte)
// 4. Enregistre le dictionnaire et retire les traductions
//    dont le texte français n'existe plus.
//
// Tu peux corriger une traduction à la main dans le fichier
// JSON : elle ne sera plus jamais écrasée tant que le texte
// français ne change pas.
//
// La commande ne fait jamais échouer le build : si Internet
// ou l'API ne répondent pas, les textes manquants restent
// simplement en français sur la version anglaise du site.
//
// Option : MYMEMORY_EMAIL=ton@email npm run traduire
//   → quota gratuit plus grand (50 000 caractères / jour au
//     lieu de 5 000). Facultatif.
// ============================================================

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const fichierDict = join(racine, 'src/app/i18n/traductions.en.json');

const API = 'https://api.mymemory.translated.net/get';
const MAX_OCTETS = 450; // MyMemory refuse les requêtes de plus de 500 octets

main().catch((err) => {
  console.warn(`⚠ Traduction automatique ignorée : ${err.message}`);
  process.exit(0);
});

async function main() {
  const { CONTENT_FR } = await import(pathToFileURL(join(racine, 'src/app/i18n/content.ts')).href);
  const { PROJETS, textesDuProjet } = await import(pathToFileURL(join(racine, 'src/app/donnees/projets.ts')).href);

  // ── 1. Tous les textes français utilisés ──
  const textes = new Set();
  collecter(CONTENT_FR, textes);
  for (const p of PROJETS) textesDuProjet(p).forEach((t) => textes.add(t));

  // ── 2. Dictionnaire existant ──
  const dict = JSON.parse(readFileSync(fichierDict, 'utf8'));
  const manquants = [...textes].filter((t) => !(t in dict) && /[\p{L}]/u.test(t));
  const inutiles = Object.keys(dict).filter((t) => !textes.has(t));

  if (!manquants.length && !inutiles.length) {
    console.log('✓ Traductions anglaises à jour.');
    return;
  }

  // ── 3. Traduction des textes manquants ──
  let traduits = 0;
  for (const texte of manquants) {
    try {
      dict[texte] = await traduire(texte);
      traduits++;
      console.log(`  + ${apercu(texte)}\n    → ${apercu(dict[texte])}`);
    } catch (err) {
      console.warn(`⚠ Arrêt de la traduction : ${err.message}`);
      console.warn('  Les textes restants s\'afficheront en français sur la version anglaise.');
      break;
    }
  }

  // ── 4. Nettoyage + enregistrement (trié pour rester lisible) ──
  inutiles.forEach((t) => delete dict[t]);
  const trie = Object.fromEntries(
    Object.keys(dict).sort((a, b) => a.localeCompare(b, 'fr')).map((k) => [k, dict[k]]),
  );
  writeFileSync(fichierDict, JSON.stringify(trie, null, 2) + '\n', 'utf8');

  console.log(
    `✓ ${traduits} texte(s) traduit(s), ${inutiles.length} ancienne(s) traduction(s) retirée(s).` +
      (traduits ? '\n  Relis-les dans src/app/i18n/traductions.en.json si tu veux les ajuster.' : ''),
  );
}

/** Ajoute à `set` toutes les chaînes d'un objet (récursif) */
function collecter(valeur, set) {
  if (typeof valeur === 'string') set.add(valeur);
  else if (Array.isArray(valeur)) valeur.forEach((v) => collecter(v, set));
  else if (valeur && typeof valeur === 'object') Object.values(valeur).forEach((v) => collecter(v, set));
}

/** Traduit un texte (découpé en phrases s'il est long), en gardant les espaces au bord */
async function traduire(texte) {
  const debut = texte.match(/^\s*/)[0];
  const fin = texte.match(/\s*$/)[0];
  const morceaux = decouper(texte.trim());
  const resultats = [];
  for (const m of morceaux) resultats.push(await appelerApi(m));
  return debut + resultats.join(' ') + fin;
}

/** Découpe en morceaux de moins de MAX_OCTETS, aux fins de phrase */
function decouper(texte) {
  if (Buffer.byteLength(texte) <= MAX_OCTETS) return [texte];
  const phrases = texte.match(/[^.!?:;]+[.!?:;]*\s*/g) ?? [texte];
  const morceaux = [];
  let courant = '';
  for (const phrase of phrases) {
    if (courant && Buffer.byteLength(courant + phrase) > MAX_OCTETS) {
      morceaux.push(courant.trim());
      courant = '';
    }
    courant += phrase;
  }
  if (courant.trim()) morceaux.push(courant.trim());
  return morceaux;
}

async function appelerApi(texte) {
  const url = new URL(API);
  url.searchParams.set('q', texte);
  url.searchParams.set('langpair', 'fr|en');
  if (process.env.MYMEMORY_EMAIL) url.searchParams.set('de', process.env.MYMEMORY_EMAIL);

  const reponse = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!reponse.ok) throw new Error(`l'API a répondu ${reponse.status}`);
  const json = await reponse.json();
  const traduction = json?.responseData?.translatedText;

  if (json.quotaFinished || /MYMEMORY WARNING/i.test(traduction ?? '')) {
    throw new Error('quota gratuit du jour atteint (réessaie demain)');
  }
  if (json.responseStatus !== 200 || !traduction) {
    throw new Error(json.responseDetails || 'réponse vide');
  }
  return decoderEntites(traduction);
}

function decoderEntites(s) {
  return s
    .replace(/&#39;|&#039;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
}

function apercu(s) {
  return s.length > 70 ? s.slice(0, 67) + '…' : s;
}
