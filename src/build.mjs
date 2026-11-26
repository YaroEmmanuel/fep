// ============ Faso Équipement Paalga — génération des pages HTML ============
// Produit des pages HTML statiques complètes (lisibles par les moteurs de recherche),
// le sitemap.xml, le robots.txt et le manifeste. Lancer :  npm run build
//
// Vue.js (assets/js/app.js) ne sert ensuite qu'à l'interactivité :
// menu, diaporama, galerie, visionneuse, formulaire.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { SITE_URL, ENTREPRISE as E, whatsapp, DIAPORAMA, DOMAINES, VEHICULES } from './contenu.mjs';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const AUJOURDHUI = new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------- outils
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (chemin = '') => `${SITE_URL}/${chemin === 'index.html' ? '' : chemin}`;
const minus = (s) => s.toLowerCase();

// Dimensions réelles des images (attributs width/height : évite les sauts de mise en page)
const cacheDims = {};
function dims(chemin) {
  if (cacheDims[chemin]) return cacheDims[chemin];
  const b = readFileSync(join(RACINE, chemin));
  let d;
  if (b[0] === 0x89 && b[1] === 0x50) {
    d = { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  } else {
    let i = 2;
    while (i < b.length) {
      const marqueur = b[i + 1];
      const taille = b.readUInt16BE(i + 2);
      if (marqueur >= 0xC0 && marqueur <= 0xCF && ![0xC4, 0xC8, 0xCC].includes(marqueur)) {
        d = { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
        break;
      }
      i += 2 + taille;
    }
  }
  if (!d) throw new Error(`Dimensions introuvables : ${chemin}`);
  return (cacheDims[chemin] = d);
}

function img(src, alt, classe = '', { prioritaire = false, immediat = false, attrs = '' } = {}) {
  const { w, h } = dims(src);
  const chargement = prioritaire ? 'loading="eager" fetchpriority="high"' : immediat ? 'loading="eager"' : 'loading="lazy"';
  return `<img src="${src}" alt="${esc(alt)}" width="${w}" height="${h}" ${chargement} decoding="async" class="${classe}"${attrs ? ' ' + attrs : ''}>`;
}

const ICONE = {
  facebook: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z"/></svg>',
  tiktok: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z"/></svg>',
  whatsapp: (c = 'w-4 h-4') => `<svg class="${c}" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1a17 17 0 0 1-1.7-.6 13.4 13.4 0 0 1-5.1-4.5c-.4-.5-1.2-1.6-1.2-3s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l1 2.3c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.2.5.1.7-.1l1-1.2c.2-.3.4-.3.7-.2l2.2 1c.3.2.5.2.6.4.1.1.1.8-.2 1.5z"/></svg>`,
  chevron: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="square" d="m6 9 6 6 6-6"/></svg>',
  gauche: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="square" d="m15 18-6-6 6-6"/></svg>',
  droite: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="square" d="m9 18 6-6-6-6"/></svg>',
  fermer: '<svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="square" d="M6 6l12 12M18 6 6 18"/></svg>'
};

const adresseCourte = `${E.rue}, ${E.quartier}, ${E.ville}`;
const LOGO = 'logo/logo-fep-embleme-192.png';

// ---------------------------------------------------------------- données structurées (schema.org)
const jsonldEntreprise = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  '@id': `${SITE_URL}/#entreprise`,
  name: E.nom,
  alternateName: E.sigle,
  slogan: E.slogan,
  description: E.description,
  url: `${SITE_URL}/`,
  logo: abs('logo/logo-faso-equipement-paalga.png'),
  image: DIAPORAMA.map(s => abs(s.image)),
  telephone: '+226 ' + E.tel,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${E.rue}, ${E.quartier}`,
    addressLocality: E.ville,
    addressCountry: E.codePays
  },
  hasMap: E.maps,
  areaServed: { '@type': 'Country', name: E.pays },
  sameAs: [E.facebook, E.tiktok],
  makesOffer: DOMAINES.map(d => ({ '@type': 'Offer', itemOffered: { '@type': 'Product', name: `Équipements ${minus(d.nom)}`, url: abs(d.page) } }))
};

const jsonldSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#site`,
  name: E.nom,
  url: `${SITE_URL}/`,
  inLanguage: 'fr',
  publisher: { '@id': `${SITE_URL}/#entreprise` }
};

const jsonldAriane = (ariane) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ nom: 'Accueil', lien: 'index.html' }, ...ariane].map((a, i) => ({
    '@type': 'ListItem', position: i + 1, name: a.nom, ...(a.lien ? { item: abs(a.lien) } : {})
  }))
});

// ---------------------------------------------------------------- gabarit général
function page({ fichier, titre, description, actif, image, contenu, jsonld = [], indexer = true, preload, scripts = '' }) {
  const url = abs(fichier);
  const imgOg = image ? abs(image) : abs('logo/logo-faso-equipement-paalga.png');
  const config = {
    mail: [E.emailUtilisateur, E.emailDomaine],
    whatsapp: E.whatsappNumero
  };
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(titre)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="${indexer ? 'index, follow, max-image-preview:large' : 'noindex, follow'}">
  ${indexer ? `<link rel="canonical" href="${url}">` : ''}
  <meta name="theme-color" content="#0E2A40">
  <meta name="geo.region" content="BF">
  <meta name="geo.placename" content="${E.ville}">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:site_name" content="${esc(E.nom)}">
  <meta property="og:title" content="${esc(titre)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${imgOg}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(titre)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${imgOg}">

  <link rel="icon" type="image/png" sizes="32x32" href="logo/favicon-32.png">
  <link rel="apple-touch-icon" href="logo/apple-touch-icon.png">
  <link rel="manifest" href="site.webmanifest">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap">
  ${preload ? `<link rel="preload" as="image" href="${preload}" fetchpriority="high">` : ''}
  <link rel="stylesheet" href="assets/css/site.css">
${jsonld.map(j => `  <script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
  <script>window.FEP = ${JSON.stringify(config)};</script>
</head>
<body class="font-sans text-slate-700 bg-white antialiased">
<a href="#contenu" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-jaune focus:text-bleu-nuit focus:px-4 focus:py-2 font-bold">Aller au contenu</a>
<div id="app">
${entete(actif)}
<main id="contenu">
${contenu}
</main>
${piedDePage()}
<a href="${whatsapp()}" target="_blank" rel="noopener" aria-label="Discuter avec nous sur WhatsApp"
   class="fixed bottom-5 right-5 z-40 w-14 h-14 p-3.5 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1EBE5A] hover:scale-105 transition">${ICONE.whatsapp('w-full h-full')}</a>
</div>
<script src="https://unpkg.com/vue@3.4.38/dist/vue.global.prod.js" defer></script>
<script src="assets/js/app.js" defer></script>
${scripts}
</body>
</html>
`;
}

// ---------------------------------------------------------------- en-tête
function entete(actif) {
  const surligne = (id) => actif === id || (id === 'equipements' && actif.startsWith('eq-'));
  const courant = (id) => (actif === id ? ' aria-current="page"' : '');
  const lien = (id, href, nom) =>
    `<li class="flex"><a href="${href}" class="nav-link${surligne(id) ? ' nav-active' : ''}"${courant(id)}>${nom}</a></li>`;
  const lienMobile = (id, href, nom) =>
    `<li><a href="${href}" class="block py-3${surligne(id) ? ' text-bleu' : ''}"${courant(id)}>${nom}</a></li>`;

  return `
<div class="bg-bleu-nuit text-white/80 text-xs">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between gap-4">
    <div class="flex items-center gap-6 min-w-0">
      <a href="tel:${E.telIntl}" class="hover:text-jaune transition shrink-0">Tél. +226 ${E.tel}</a>
      <a href="${E.maps}" target="_blank" rel="noopener" class="hidden md:inline truncate hover:text-jaune transition">${adresseCourte}</a>
    </div>
    <div class="flex items-center gap-4">
      <a href="${E.facebook}" target="_blank" rel="noopener" aria-label="Facebook de Faso Équipement Paalga" class="hover:text-jaune transition">${ICONE.facebook}</a>
      <a href="${E.tiktok}" target="_blank" rel="noopener" aria-label="TikTok de Faso Équipement Paalga" class="hover:text-jaune transition">${ICONE.tiktok}</a>
      <a href="${whatsapp()}" target="_blank" rel="noopener" aria-label="WhatsApp de Faso Équipement Paalga" class="hover:text-jaune transition">${ICONE.whatsapp()}</a>
    </div>
  </div>
</div>

<header class="sticky top-0 z-40 bg-white border-b border-slate-200 transition-shadow" :class="{ 'shadow-md': defile }">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
    <a href="index.html" class="flex items-center gap-2 sm:gap-3 shrink-0" aria-label="${esc(E.nom)}, retour à l'accueil">
      ${img(LOGO, '', 'h-10 w-auto sm:h-12', { prioritaire: true })}
      <span class="leading-tight">
        <span class="block font-extrabold text-bleu-fonce tracking-tight text-sm sm:text-base">FASO ÉQUIPEMENT</span>
        <span class="block font-extrabold text-jaune-fonce text-xs sm:text-sm tracking-[0.3em]">PAALGA</span>
      </span>
    </a>

    <nav aria-label="Menu principal" class="hidden lg:block h-full">
      <ul class="flex items-stretch h-full font-semibold text-sm text-bleu-nuit uppercase tracking-wide">
        ${lien('accueil', 'index.html', 'Accueil')}
        ${lien('vehicules', 'vehicules.html', 'Véhicules')}
        <li class="relative flex" @mouseenter="sousMenu = true" @mouseleave="sousMenu = false" @focusin="sousMenu = true" @focusout="quitterSousMenu">
          <a href="equipements.html" class="nav-link gap-1${surligne('equipements') ? ' nav-active' : ''}"${courant('equipements')} aria-haspopup="true" :aria-expanded="sousMenu">Équipements ${ICONE.chevron}</a>
          <ul v-show="sousMenu" v-cloak class="absolute left-0 top-full w-60 bg-white border-t-4 border-jaune shadow-lg normal-case tracking-normal">
            ${DOMAINES.map(d => `<li><a href="${d.page}" class="block px-5 py-3 border-b border-slate-100 transition ${actif === 'eq-' + d.id ? 'bg-bleu text-white' : 'hover:bg-bleu hover:text-white'}"${courant('eq-' + d.id)}>Équipements ${minus(d.nom)}</a></li>`).join('\n            ')}
          </ul>
        </li>
        ${lien('a-propos', 'a-propos.html', 'À propos')}
        ${lien('contact', 'contact.html', 'Contact')}
      </ul>
    </nav>

    <div class="flex items-center gap-3">
      <a href="${whatsapp('Bonjour Faso Équipement Paalga, je souhaite un devis.')}" target="_blank" rel="noopener" class="hidden sm:inline-flex btn btn-jaune">Demander un devis</a>
      <button type="button" class="lg:hidden p-2 -mr-2 text-bleu-nuit" @click="menuOuvert = !menuOuvert" :aria-expanded="menuOuvert" aria-controls="menu-mobile" aria-label="Ouvrir le menu">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
          <path v-if="!menuOuvert" stroke-linecap="square" d="M4 7h16M4 12h16M4 17h16"/>
          <path v-else v-cloak stroke-linecap="square" d="M6 6l12 12M18 6 6 18"/>
        </svg>
      </button>
    </div>
  </div>

  <nav id="menu-mobile" aria-label="Menu mobile" v-show="menuOuvert" v-cloak class="lg:hidden border-t border-slate-200 bg-white font-semibold text-bleu-nuit max-h-[calc(100vh-4rem)] overflow-y-auto">
    <ul class="px-4 sm:px-6 py-2 divide-y divide-slate-100">
      ${lienMobile('accueil', 'index.html', 'Accueil')}
      ${lienMobile('vehicules', 'vehicules.html', 'Véhicules')}
      <li>
        <button type="button" class="w-full py-3 flex items-center justify-between${surligne('equipements') ? ' text-bleu' : ''}" @click="sousMenuMobile = !sousMenuMobile" :aria-expanded="sousMenuMobile" aria-controls="sous-menu-mobile">
          Équipements <span class="text-xl leading-none" aria-hidden="true"><span v-if="!sousMenuMobile">+</span><span v-else v-cloak>−</span></span>
        </button>
        <ul id="sous-menu-mobile" v-show="sousMenuMobile" v-cloak class="pb-2 pl-4 border-l-4 border-jaune">
          <li><a href="equipements.html" class="block py-2 font-medium">Tous les équipements</a></li>
          ${DOMAINES.map(d => `<li><a href="${d.page}" class="block py-2 font-medium${actif === 'eq-' + d.id ? ' text-bleu' : ''}">${d.nom}</a></li>`).join('\n          ')}
        </ul>
      </li>
      ${lienMobile('a-propos', 'a-propos.html', 'À propos')}
      ${lienMobile('contact', 'contact.html', 'Contact')}
      <li class="py-3"><a href="${whatsapp('Bonjour Faso Équipement Paalga, je souhaite un devis.')}" target="_blank" rel="noopener" class="btn btn-jaune w-full justify-center">Demander un devis</a></li>
    </ul>
  </nav>
</header>`;
}

// ---------------------------------------------------------------- e-mail protégé
// Affiché par Vue à partir de deux morceaux : jamais écrit en clair dans le HTML.
const emailProtege = (classe = '') =>
  `<a v-if="email" v-cloak :href="'mailto:' + email" class="${classe}" v-text="email"></a><noscript>${E.emailUtilisateur} [arobase] ${E.emailDomaine}</noscript>`;

// ---------------------------------------------------------------- pied de page
function piedDePage() {
  return `
<footer class="bg-bleu-nuit text-white/70 pt-16 pb-8">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
    <div>
      <div class="flex items-center gap-3">
        ${img(LOGO, '', 'h-12 w-auto')}
        <p class="font-extrabold text-white leading-tight">FASO ÉQUIPEMENT<br><span class="text-jaune tracking-[0.3em] text-sm">PAALGA</span></p>
      </div>
      <p class="mt-5 text-sm leading-relaxed">${esc(E.description)} ${E.slogan}.</p>
    </div>
    <nav aria-label="Équipements">
      <h2 class="titre-footer">Équipements</h2>
      <ul class="space-y-2 text-sm">
        ${DOMAINES.map(d => `<li><a href="${d.page}" class="hover:text-jaune transition">Équipements ${minus(d.nom)}</a></li>`).join('\n        ')}
      </ul>
    </nav>
    <nav aria-label="Entreprise">
      <h2 class="titre-footer">Entreprise</h2>
      <ul class="space-y-2 text-sm">
        <li><a href="vehicules.html" class="hover:text-jaune transition">Véhicules FEP Auto</a></li>
        <li><a href="a-propos.html" class="hover:text-jaune transition">À propos</a></li>
        <li><a href="contact.html" class="hover:text-jaune transition">Contact et devis</a></li>
      </ul>
    </nav>
    <div>
      <h2 class="titre-footer">Nous trouver</h2>
      <address class="not-italic text-sm leading-relaxed space-y-2">
        <p><a href="${E.maps}" target="_blank" rel="noopener" class="hover:text-jaune transition">${E.rue}, ${E.quartier}<br>${E.ville}, ${E.pays}</a></p>
        <p><a href="tel:${E.telIntl}" class="hover:text-jaune transition">Tél. +226 ${E.tel}</a></p>
        <p>${emailProtege('hover:text-jaune transition break-all')}</p>
      </address>
      <div class="mt-5 flex gap-2">
        <a href="${E.facebook}" target="_blank" rel="noopener" aria-label="Facebook" class="social">${ICONE.facebook}</a>
        <a href="${E.tiktok}" target="_blank" rel="noopener" aria-label="TikTok" class="social">${ICONE.tiktok}</a>
        <a href="${whatsapp()}" target="_blank" rel="noopener" aria-label="WhatsApp" class="social">${ICONE.whatsapp()}</a>
      </div>
    </div>
  </div>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pt-6 border-t border-white/10 text-xs text-white/50 flex flex-col sm:flex-row justify-between gap-2">
    <p>© ${new Date().getFullYear()} ${E.nom}. Tous droits réservés.</p>
    <p>${E.valeurs.join(' · ')}</p>
  </div>
</footer>`;
}

// ---------------------------------------------------------------- blocs réutilisables
function banniere({ titre, texte, image, alt = '', ariane }) {
  const chemin = [{ nom: 'Accueil', lien: 'index.html' }, ...ariane];
  return `
<section class="relative h-[300px] sm:h-[420px] overflow-hidden bg-bleu-nuit" aria-labelledby="titre-page">
  ${img(image, alt, 'absolute inset-0 w-full h-full object-cover kenburns', { prioritaire: true })}
  <div class="absolute inset-0 bg-gradient-to-r from-bleu-nuit/90 via-bleu-nuit/60 to-bleu-nuit/30"></div>
  <div class="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-end pb-10 sm:pb-16">
    <nav aria-label="Fil d'Ariane" class="slide-in">
      <ol class="flex flex-wrap items-center text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-white/60">
        ${chemin.map((a, i) => `<li class="flex items-center">${i ? '<span class="mx-2 text-jaune" aria-hidden="true">/</span>' : ''}${a.lien ? `<a href="${a.lien}" class="hover:text-jaune">${a.nom}</a>` : `<span class="text-white" aria-current="page">${a.nom}</span>`}</li>`).join('')}
      </ol>
    </nav>
    <div class="mt-4 border-l-4 border-jaune pl-5 sm:pl-6 max-w-3xl slide-in">
      <h1 id="titre-page" class="text-3xl sm:text-5xl font-extrabold uppercase text-white leading-[1.05]">${titre}</h1>
      ${texte ? `<p class="mt-3 sm:mt-4 text-white/85 sm:text-lg">${texte}</p>` : ''}
    </div>
  </div>
</section>`;
}

function intro({ id, surtitre, titre, paragraphes, points = [] }) {
  return `
<section class="py-16 sm:py-24" aria-labelledby="${id}">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-8 lg:gap-16" v-reveal>
    <div class="lg:col-span-5">
      <p class="eyebrow">${surtitre}</p>
      <h2 id="${id}" class="titre-section">${titre}</h2>
    </div>
    <div class="lg:col-span-7">
      <div class="text-slate-600 text-base sm:text-lg leading-relaxed space-y-4">${paragraphes.map(p => `<p>${p}</p>`).join('')}</div>
      ${points.length ? `<ul class="mt-8 grid sm:grid-cols-2 border-t border-slate-200">
        ${points.map(p => `<li class="flex items-center gap-3 py-4 border-b border-slate-200 font-semibold text-bleu-nuit"><span class="w-2 h-2 bg-jaune shrink-0" aria-hidden="true"></span>${p}</li>`).join('\n        ')}
      </ul>` : ''}
    </div>
  </div>
</section>`;
}

function carteProduit({ nom, image, alt, texte, credit }, bouton = 'Demander un devis') {
  return `
<article class="group flex flex-col bg-white border border-slate-200 hover:border-bleu transition" v-reveal>
  <div class="relative aspect-[4/3] overflow-hidden bg-slate-100">
    ${img(image, alt || nom, 'w-full h-full object-cover transition duration-700 group-hover:scale-105')}${credit ? `
    <a href="${credit.lien}" target="_blank" rel="noopener" class="absolute right-0 top-0 z-10 bg-black/60 px-2 py-1 text-[10px] leading-none text-white/90 hover:text-jaune">${esc(credit.texte)}</a>` : ''}
    <span class="absolute left-0 bottom-0 h-1 w-12 bg-jaune transition-all duration-500 group-hover:w-full" aria-hidden="true"></span>
  </div>
  <div class="flex-1 flex flex-col p-5 sm:p-6">
    <h3 class="text-lg font-extrabold text-bleu-nuit uppercase">${nom}</h3>
    <p class="mt-3 text-sm text-slate-600 leading-relaxed flex-1">${texte}</p>
    <a href="${whatsapp(`Bonjour Faso Équipement Paalga, je souhaite un devis pour : ${nom}.`)}" target="_blank" rel="noopener" class="lien-fleche mt-6">${bouton}<span class="sr-only"> : ${nom}</span></a>
  </div>
</article>`;
}

function bandeauContact({ titre = 'Un projet ? Parlons-en.', texte = "Devis, conseil technique ou disponibilité d'un produit : nous vous répondons rapidement.", message } = {}) {
  return `
<section class="bg-jaune" aria-labelledby="titre-contact-rapide">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
    <div>
      <h2 id="titre-contact-rapide" class="text-2xl sm:text-3xl font-extrabold text-bleu-nuit uppercase">${titre}</h2>
      <p class="mt-2 text-bleu-nuit/80 font-medium">${texte}</p>
    </div>
    <div class="flex flex-wrap gap-3">
      <a href="${whatsapp(message)}" target="_blank" rel="noopener" class="btn btn-nuit">WhatsApp</a>
      <a href="tel:${E.telIntl}" class="btn btn-contour-nuit">+226 ${E.tel}</a>
    </div>
  </div>
</section>`;
}

function tuilesDomaines(domaines, { hauteur = 'h-72 sm:h-96 lg:h-[26rem]', titreNiveau = 'h3', resume = true } = {}) {
  return domaines.map(d => `
  <a href="${d.page}" class="group relative ${hauteur} overflow-hidden block">
    ${img(d.image, d.alt, 'absolute inset-0 w-full h-full object-cover filtre-domaine')}
    <div class="absolute inset-0 bg-gradient-to-t from-bleu-nuit/95 via-bleu-nuit/30 to-transparent"></div>
    <div class="absolute inset-0 bg-bleu/0 group-hover:bg-bleu/25 transition duration-500"></div>
    <div class="absolute inset-x-0 bottom-0 p-6 sm:p-7 text-white">
      <${titreNiveau} class="text-xl sm:text-2xl font-extrabold uppercase">Équipements ${minus(d.nom)}</${titreNiveau}>
      ${resume ? `<p class="mt-2 text-sm text-white/80 sm:min-h-[2.5rem]">${d.resume}</p>` : ''}
      <span class="mt-4 sm:mt-5 block h-[3px] w-10 bg-jaune transition-all duration-500 group-hover:w-full" aria-hidden="true"></span>
    </div>
  </a>`).join('');
}

function galerie(items, filtres = []) {
  const nomCat = (id) => (filtres.find(f => f.id === id) || {}).nom || '';
  const compte = (id) => (id === 'tous' ? items.length : items.filter(g => g.cat === id).length);
  return `
<div>
  ${filtres.length ? `<div class="flex flex-wrap gap-px bg-slate-200 border border-slate-200 w-fit max-w-full" role="group" aria-label="Filtrer la galerie">
    ${[{ id: 'tous', nom: 'Tous' }, ...filtres].map(f => `<button type="button" @click="filtre = '${f.id}'" :aria-pressed="filtre === '${f.id}'"
      class="px-3 sm:px-5 py-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition grow sm:grow-0"
      :class="filtre === '${f.id}' ? 'bg-bleu text-white' : 'bg-white text-bleu-nuit hover:bg-slate-50'">${f.nom} <span class="opacity-60">(${compte(f.id)})</span></button>`).join('\n    ')}
  </div>` : ''}
  <ul class="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
    ${items.map(g => `<li v-show="filtre === 'tous' || filtre === '${g.cat}'" data-galerie data-src="${g.image}" data-titre="${esc(g.titre)}" data-cat="${esc(nomCat(g.cat))}" data-filtre="${g.cat}">
      <button type="button" @click="ouvrir('${g.image}')" class="group relative block w-full aspect-square overflow-hidden bg-slate-200 text-left" aria-label="Agrandir la photo : ${esc(g.titre)}">
        ${img(g.image, g.titre, 'w-full h-full object-cover transition duration-500 group-hover:scale-110')}
        <span class="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 bg-gradient-to-t from-bleu-nuit/90 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition">
          ${nomCat(g.cat) ? `<span class="text-jaune text-[10px] font-bold uppercase tracking-widest">${nomCat(g.cat)}</span>` : ''}
          <span class="text-white font-semibold text-xs sm:text-sm">${g.titre}</span>
        </span>
      </button>
    </li>`).join('\n    ')}
  </ul>

  <div v-if="visionneuse !== null" v-cloak class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" @click.self="fermer" role="dialog" aria-modal="true" aria-label="Visionneuse de photos">
    <button type="button" @click="fermer" class="absolute top-3 right-3 text-white/80 hover:text-jaune p-2" aria-label="Fermer">${ICONE.fermer}</button>
    <button type="button" @click="precedente" class="slide-arrow absolute left-2 sm:left-4 top-1/2 -translate-y-1/2" aria-label="Photo précédente">${ICONE.gauche}</button>
    <figure class="max-w-5xl w-full">
      <img :src="photoActive.src" :alt="photoActive.titre" class="max-h-[75vh] w-auto mx-auto">
      <figcaption class="mt-4 text-center text-white">
        <span class="text-jaune text-xs font-bold uppercase tracking-widest" v-text="photoActive.cat"></span>
        <span class="block font-semibold" v-text="photoActive.titre"></span>
        <span class="block mt-1 text-xs text-white/50" v-text="(visionneuse + 1) + ' / ' + photosFiltrees.length"></span>
      </figcaption>
    </figure>
    <button type="button" @click="suivante" class="slide-arrow absolute right-2 sm:right-4 top-1/2 -translate-y-1/2" aria-label="Photo suivante">${ICONE.droite}</button>
  </div>
</div>`;
}

const enTeteSection = ({ id, surtitre, titre, aside = '' }) => `
  <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4" v-reveal>
    <div>
      <p class="eyebrow">${surtitre}</p>
      <h2 id="${id}" class="titre-section">${titre}</h2>
    </div>
    ${aside}
  </div>`;

// ================================================================ PAGES
const pages = [];

// ---------------------------------------------------------------- Accueil
pages.push({
  fichier: 'index.html',
  titre: 'Faso Équipement Paalga | Équipements et forages à Ouagadougou',
  description: "Équipements agricoles, solaires, miniers et hydrauliques, forages d'eau et SUV neufs à Ouagadougou (Larlé). Conseil, installation et devis rapide.",
  actif: 'accueil',
  image: DIAPORAMA[0].image,
  preload: DIAPORAMA[0].image,
  jsonld: [jsonldEntreprise, jsonldSite],
  contenu: `
<section class="relative h-[calc(100svh-6.25rem)] min-h-[480px] max-h-[860px] overflow-hidden bg-bleu-nuit"
         @mouseenter="pauseDiaporama" @mouseleave="repriseDiaporama"
         @touchstart.passive="debutToucher" @touchend.passive="finToucher"
         aria-roledescription="carrousel" aria-label="Nos activités">
  ${DIAPORAMA.map((s, i) => `
  <div data-slide class="absolute inset-0 transition-opacity duration-1000" :class="diapo === ${i} ? 'opacity-100 z-10' : 'opacity-0 z-0'" :aria-hidden="diapo !== ${i}"${i ? ' v-cloak' : ''}
       role="group" aria-roledescription="diapositive" aria-label="${i + 1} sur ${DIAPORAMA.length} : ${esc(s.court)}">
    ${img(s.image, s.alt, 'absolute inset-0 w-full h-full object-cover', { prioritaire: i === 0, immediat: true, attrs: `:class="{ kenburns: diapo === ${i} }"` })}
    <div class="absolute inset-0 bg-gradient-to-r from-bleu-nuit/85 via-bleu-nuit/50 to-transparent"></div>
    <div class="absolute inset-0 bg-bleu-nuit/35 md:hidden"></div>
    <div class="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center pb-14">
      <div class="max-w-2xl text-white border-l-4 border-jaune pl-5 sm:pl-8" :class="{ 'slide-in': diapo === ${i} }">
        <p class="text-jaune text-[11px] sm:text-sm font-bold uppercase tracking-[0.25em]">${s.tag}</p>
        <h2 class="mt-3 sm:mt-4 text-[2rem] leading-[1.05] sm:text-5xl lg:text-6xl font-extrabold uppercase">${s.titre}</h2>
        <p class="mt-4 sm:mt-5 text-base sm:text-lg text-white/85 max-w-xl">${s.texte}</p>
        <a href="${s.lien}" class="btn btn-jaune mt-7 sm:mt-8">${s.bouton}</a>
      </div>
    </div>
  </div>`).join('')}

  <div class="absolute bottom-0 inset-x-0 z-20 border-t border-white/15 bg-bleu-nuit/40 backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 flex items-stretch">
      ${DIAPORAMA.map((s, i) => `<button type="button" @click="allerA(${i})" :aria-current="diapo === ${i}" aria-label="Diapositive ${i + 1} : ${esc(s.court)}"
        class="relative flex-1 text-left py-4 pr-2 sm:pr-3 text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition"
        :class="diapo === ${i} ? 'text-white' : 'text-white/50 hover:text-white/80'">
        <span class="absolute top-0 left-0 right-2 sm:right-3 h-[3px] bg-white/20"><span v-if="diapo === ${i}" class="block h-full bg-jaune progress" :class="{ paused: enPause }" :key="'p' + cleProgression"></span></span>
        <span class="hidden sm:inline">${s.court}</span><span class="sm:hidden">0${i + 1}</span>
      </button>`).join('\n      ')}
      <div class="hidden md:flex items-center gap-px ml-4">
        <button type="button" @click="precedenteDiapo" aria-label="Diapositive précédente" class="slide-arrow">${ICONE.gauche}</button>
        <button type="button" @click="suivanteDiapo" aria-label="Diapositive suivante" class="slide-arrow">${ICONE.droite}</button>
      </div>
    </div>
  </div>
</section>

<section class="pt-16 sm:pt-24" aria-labelledby="titre-accueil">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6" v-reveal>
    <div class="max-w-3xl">
      <p class="eyebrow">Un seul partenaire pour vos projets</p>
      <h1 id="titre-accueil" class="titre-section">Équipements agricoles, solaires, miniers et hydrauliques à Ouagadougou</h1>
    </div>
    <a href="equipements.html" class="lien-fleche shrink-0">Tous les équipements</a>
  </div>
  <div class="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-4">${tuilesDomaines(DOMAINES, { titreNiveau: 'h2' })}
  </div>
</section>

<section class="grid lg:grid-cols-2" aria-labelledby="titre-qui">
  <div class="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[560px]">
    ${img('images/hydrauliques/realisation-forage-eau-jaillissante.jpeg', "Forage d'eau jaillissante réalisé par les équipes de Faso Équipement Paalga", 'absolute inset-0 w-full h-full object-cover')}
  </div>
  <div class="bg-bleu-nuit text-white px-6 sm:px-12 lg:px-16 py-14 sm:py-16 lg:py-24 flex flex-col justify-center" v-reveal>
    <p class="eyebrow !text-jaune">Qui sommes-nous</p>
    <h2 id="titre-qui" class="text-3xl sm:text-4xl font-extrabold leading-tight">${E.slogan}</h2>
    <p class="mt-6 text-white/80 leading-relaxed max-w-xl">Installée à Larlé, à Ouagadougou, ${E.nom} accompagne particuliers, agriculteurs, entreprises et collectivités du Burkina Faso dans le choix, la fourniture et l'installation d'équipements fiables, du forage d'eau au matériel minier.</p>
    <ul class="mt-10 grid grid-cols-3 border-t border-white/15">
      ${E.valeurs.map(v => `<li class="pt-5 pr-2 text-jaune font-extrabold uppercase text-xs sm:text-base tracking-wide">${v}</li>`).join('\n      ')}
    </ul>
    <a href="a-propos.html" class="lien-fleche !text-white mt-10">En savoir plus sur nous</a>
  </div>
</section>
${bandeauContact()}`
});

// ---------------------------------------------------------------- Équipements (vue d'ensemble)
const galerieEquipements = [
  // Les photos de banques d'images (banque: true) ne sont pas « notre matériel » : hors galerie
  ...DOMAINES.flatMap(d => d.produits.filter(p => !p.banque).map(p => ({ cat: d.id, image: p.image, titre: p.nom }))),
  { cat: 'hydrauliques', image: 'images/hydrauliques/realisation-forage-eau-jaillissante.jpeg', titre: 'Forage réalisé' },
  { cat: 'miniers', image: 'images/miniers/engins-carriere-camion-pelle-chargeuse-concasseur.jpeg', titre: 'Engins de carrière' }
].filter((g, i, t) => t.findIndex(x => x.image === g.image) === i);

pages.push({
  fichier: 'equipements.html',
  titre: 'Nos équipements à Ouagadougou | Faso Équipement Paalga',
  description: "Matériel agricole, solaire, minier et hydraulique : fourniture, installation et service après-vente à Ouagadougou et dans tout le Burkina Faso.",
  actif: 'equipements',
  image: 'images/hydrauliques/foreuse-gamme-pompes-immergees.jpeg',
  jsonld: [jsonldAriane([{ nom: 'Équipements' }])],
  contenu: `
${banniere({ titre: 'Nos équipements', texte: 'Quatre domaines, un même engagement : du matériel robuste, adapté au terrain et suivi dans le temps.', image: 'images/hydrauliques/foreuse-gamme-pompes-immergees.jpeg', alt: 'Gamme de pompes devant un camion de forage', ariane: [{ nom: 'Équipements' }] })}
${intro({
    id: 'titre-intro', surtitre: 'Ce que nous proposons', titre: 'Du champ à la carrière, du forage au toit solaire',
    paragraphes: [
      `${E.nom} sélectionne, fournit et installe des équipements pour quatre grands secteurs d'activité. Pour chaque projet, nous prenons le temps de comprendre votre besoin avant de vous proposer le matériel adapté.`,
      "Après la vente, nos équipes restent à vos côtés : mise en service, conseils d'utilisation, pièces de rechange et dépannage."
    ]
  })}
<section aria-label="Nos quatre domaines">
  ${DOMAINES.map((d, i) => `
  <article class="grid lg:grid-cols-2 border-t border-slate-200" aria-labelledby="titre-${d.id}">
    <a href="${d.page}" class="group relative min-h-[260px] sm:min-h-[340px] lg:min-h-[460px] overflow-hidden block${i % 2 ? ' lg:order-2' : ''}" tabindex="-1" aria-hidden="true">
      ${img(d.image, '', 'absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105')}
      <span class="absolute top-0 left-0 bg-jaune text-bleu-nuit font-extrabold text-sm px-5 py-3">0${i + 1}</span>
    </a>
    <div class="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 sm:py-14 ${i % 2 ? 'bg-slate-50' : 'bg-white'}" v-reveal>
      <p class="eyebrow">Équipements</p>
      <h2 id="titre-${d.id}" class="text-3xl sm:text-4xl font-extrabold uppercase text-bleu-nuit">${d.nom}</h2>
      <p class="mt-4 text-lg font-semibold text-bleu-fonce">${d.accroche}</p>
      <ul class="mt-6 space-y-2">
        ${d.produits.slice(0, 4).map(p => `<li class="flex items-center gap-3 text-slate-600"><span class="w-2 h-2 bg-jaune shrink-0" aria-hidden="true"></span>${p.nom}</li>`).join('\n        ')}
      </ul>
      <a href="${d.page}" class="lien-fleche mt-8">Voir les équipements ${minus(d.nom)}</a>
    </div>
  </article>`).join('')}
</section>
<section class="bg-slate-50 py-16 sm:py-24 border-t border-slate-200" aria-labelledby="titre-galerie">
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    ${enTeteSection({ id: 'titre-galerie', surtitre: 'Galerie', titre: 'Notre matériel en images' })}
    <div class="mt-8 sm:mt-10">${galerie(galerieEquipements, DOMAINES.map(d => ({ id: d.id, nom: d.nom })))}</div>
  </div>
</section>
${bandeauContact()}`
});

// ---------------------------------------------------------------- 4 pages domaines
for (const d of DOMAINES) {
  const ariane = [{ nom: 'Équipements', lien: 'equipements.html' }, { nom: d.nom }];
  const singulier = minus(d.nom).replace(/s$/, '');
  pages.push({
    fichier: d.page,
    titre: d.seoTitre,
    description: d.seoDescription,
    actif: 'eq-' + d.id,
    image: d.banniere,
    jsonld: [jsonldAriane(ariane)],
    contenu: `
${banniere({ titre: `Équipements ${minus(d.nom)}`, texte: d.accroche, image: d.banniere, alt: d.alt, ariane })}
${intro({ id: 'titre-intro', surtitre: `Équipements ${minus(d.nom)}`, titre: d.accroche, paragraphes: [d.intro], points: d.points })}
<section class="bg-slate-50 py-16 sm:py-24" aria-labelledby="titre-produits">
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    ${enTeteSection({ id: 'titre-produits', surtitre: 'Notre gamme', titre: `Nos équipements ${minus(d.nom)}`, aside: '<p class="text-slate-600 max-w-md">Prix et disponibilités sur demande : cliquez sur « Demander un devis » pour nous écrire directement sur WhatsApp.</p>' })}
    <div class="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">${d.produits.map(p => carteProduit(p)).join('')}
    </div>
  </div>
</section>
<section class="pt-16 sm:pt-24" aria-labelledby="titre-autres">
  <div class="max-w-7xl mx-auto px-4 sm:px-6" v-reveal>
    <p class="eyebrow">Voir aussi</p>
    <h2 id="titre-autres" class="titre-section">Nos autres domaines</h2>
  </div>
  <div class="mt-10 grid md:grid-cols-3">${tuilesDomaines(DOMAINES.filter(x => x.id !== d.id), { hauteur: 'h-56 sm:h-64', resume: false })}
  </div>
</section>
${bandeauContact({ titre: `Besoin d'un équipement ${singulier} ?`, message: `Bonjour Faso Équipement Paalga, je souhaite des informations sur vos équipements ${minus(d.nom)}.` })}`
  });
}

// ---------------------------------------------------------------- Véhicules
const servicesAuto = [
  { titre: 'Véhicules neufs', texte: 'Des SUV neufs, modernes et bien équipés, prêts à être livrés.' },
  { titre: 'Conseil', texte: 'Nous vous orientons vers le modèle adapté à votre usage et à votre budget.' },
  { titre: 'Essai', texte: 'Prenez le volant avant de décider, sur simple rendez-vous.' },
  { titre: 'Livraison', texte: "Nous vous accompagnons jusqu'à la remise des clés." }
];
pages.push({
  fichier: 'vehicules.html',
  titre: 'SUV neufs Jetour et Changan à Ouagadougou | FEP Auto',
  description: "FEP Auto, le showroom automobile de Faso Équipement Paalga à Larlé, Ouagadougou : SUV neufs Jetour (T2, Dashing), Changan et autres modèles. Essai sur rendez-vous.",
  actif: 'vehicules',
  image: 'images/auto/fep-auto-showroom-suv-2.jpeg',
  jsonld: [jsonldAriane([{ nom: 'Véhicules' }])],
  contenu: `
${banniere({ titre: 'FEP Auto', texte: 'Des véhicules neufs, choisis pour vos routes.', image: 'images/auto/fep-auto-showroom-suv-2.jpeg', alt: 'SUV neufs devant le showroom FEP Auto à Ouagadougou', ariane: [{ nom: 'Véhicules' }] })}
${intro({
    id: 'titre-intro', surtitre: 'Véhicules neufs', titre: "Le confort d'un SUV moderne, la solidité pour nos routes",
    paragraphes: [
      `FEP Auto est le pôle automobile de ${E.nom}. Notre showroom de Larlé, à Ouagadougou, présente une sélection de SUV neufs, spacieux et bien équipés, qui conviennent aussi bien aux trajets en ville qu'aux routes de l'intérieur du pays.`,
      "Nos conseillers vous aident à choisir le modèle adapté à votre usage et à votre budget, et vous accompagnent jusqu'à la remise des clés."
    ]
  })}
<section class="bg-slate-50 py-16 sm:py-24" aria-labelledby="titre-modeles">
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    ${enTeteSection({ id: 'titre-modeles', surtitre: 'Nos modèles', titre: 'Disponibles en showroom', aside: '<p class="text-slate-600 max-w-md">Les modèles et les couleurs disponibles évoluent régulièrement. Demandez-nous la liste à jour et les prix.</p>' })}
    <div class="mt-10 sm:mt-12 grid sm:grid-cols-2 gap-5 sm:gap-6">${VEHICULES.map(v => carteProduit(v, 'Demander le prix')).join('')}
    </div>
  </div>
</section>
<section class="py-16 sm:py-24" aria-labelledby="titre-services">
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div v-reveal><p class="eyebrow">Avec FEP Auto</p><h2 id="titre-services" class="titre-section">Un achat simple et accompagné</h2></div>
    <ol class="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-4 border-t-4 border-bleu">
      ${servicesAuto.map((s, i) => `<li class="pt-7 pb-6 pr-6 border-b lg:border-b-0 border-slate-200" v-reveal>
        <span class="text-jaune-fonce font-extrabold text-3xl" aria-hidden="true">0${i + 1}</span>
        <h3 class="mt-3 text-lg font-extrabold uppercase text-bleu-nuit">${s.titre}</h3>
        <p class="mt-2 text-sm text-slate-600 leading-relaxed">${s.texte}</p>
      </li>`).join('\n      ')}
    </ol>
  </div>
</section>
<section class="grid lg:grid-cols-2" aria-labelledby="titre-showroom">
  <div class="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[480px]">
    ${img('images/auto/fep-auto-jetour-interieur.jpeg', 'Intérieur du showroom FEP Auto', 'absolute inset-0 w-full h-full object-cover')}
  </div>
  <div class="bg-bleu-nuit text-white px-6 sm:px-12 lg:px-16 py-14 sm:py-16 flex flex-col justify-center" v-reveal>
    <p class="eyebrow !text-jaune">Notre showroom</p>
    <h2 id="titre-showroom" class="text-3xl sm:text-4xl font-extrabold leading-tight">Venez découvrir nos véhicules</h2>
    <p class="mt-6 text-white/80 leading-relaxed">Voir le véhicule, s'installer au volant, poser vos questions : rien ne remplace une visite. Nous vous accueillons à Larlé, sur l'avenue de la Liberté.</p>
    <address class="not-italic mt-6 font-semibold">${E.rue}, ${E.quartier}<br>${E.ville}, ${E.pays}</address>
    <div class="mt-8 flex flex-wrap gap-3">
      <a href="${E.maps}" target="_blank" rel="noopener" class="btn btn-jaune">Itinéraire</a>
      <a href="${whatsapp('Bonjour FEP Auto, je souhaite réserver un essai.')}" target="_blank" rel="noopener" class="btn btn-contour-blanc">Réserver un essai</a>
    </div>
  </div>
</section>
<section class="py-16 sm:py-24" aria-labelledby="titre-galerie">
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    ${enTeteSection({ id: 'titre-galerie', surtitre: 'Galerie', titre: 'FEP Auto en images' })}
    <div class="mt-8 sm:mt-10">${galerie([
      { cat: 'vehicules', image: 'images/auto/fep-auto-showroom-suv-1.jpeg', titre: 'SUV neufs devant le showroom' },
      { cat: 'vehicules', image: 'images/auto/fep-auto-jetour-t2.jpeg', titre: 'Jetour T2' },
      { cat: 'vehicules', image: 'images/auto/fep-auto-jetour-dashing.jpeg', titre: 'Jetour Dashing' },
      { cat: 'vehicules', image: 'images/auto/fep-auto-changan-suv.jpeg', titre: 'Changan' },
      { cat: 'vehicules', image: 'images/auto/fep-auto-jetour-interieur.jpeg', titre: 'Dans le showroom' }
    ])}</div>
  </div>
</section>
${bandeauContact({ titre: 'Intéressé par un véhicule ?', texte: 'Prix, disponibilité, essai : écrivez-nous ou appelez-nous.', message: 'Bonjour FEP Auto, je souhaite des informations sur vos véhicules.' })}`
});

// ---------------------------------------------------------------- À propos
const valeursDetail = [
  { titre: 'Fidélité', texte: "Nous construisons des relations durables. Un client satisfait revient et nous recommande : c'est notre meilleure publicité." },
  { titre: 'Qualité', texte: "Nous sélectionnons des équipements robustes, adaptés au climat et aux conditions d'utilisation du Burkina Faso." },
  { titre: 'Efficacité', texte: 'Conseil rapide, livraison, installation et dépannage : nous vous faisons gagner du temps à chaque étape.' }
];
const activites = [
  { nom: 'Hydraulique', texte: 'Forages, pompes et surpresseurs.', lien: 'equipements-hydrauliques.html' },
  { nom: 'Agricole', texte: 'Tracteurs, motoculteurs, semoirs.', lien: 'equipements-agricoles.html' },
  { nom: 'Solaire', texte: 'Installations et pompes solaires.', lien: 'equipements-solaires.html' },
  { nom: 'Minier', texte: 'Concasseurs, broyeurs, engins.', lien: 'equipements-miniers.html' },
  { nom: 'Automobile', texte: 'SUV neufs FEP Auto.', lien: 'vehicules.html' }
];
pages.push({
  fichier: 'a-propos.html',
  titre: 'À propos | Faso Équipement Paalga, Ouagadougou',
  description: "Faso Équipement Paalga, entreprise burkinabè installée à Larlé, Ouagadougou : notre mission, nos valeurs (fidélité, qualité, efficacité) et nos activités.",
  actif: 'a-propos',
  image: 'images/auto/devanture-boutique-pompes-accessoires.jpeg',
  jsonld: [jsonldEntreprise, jsonldAriane([{ nom: 'À propos' }])],
  contenu: `
${banniere({ titre: 'À propos', texte: `${E.slogan}.`, image: 'images/auto/devanture-boutique-pompes-accessoires.jpeg', alt: 'Devanture de la boutique FEP Pompes et Accessoires', ariane: [{ nom: 'À propos' }] })}
${intro({
    id: 'titre-intro', surtitre: 'Qui sommes-nous', titre: 'Une entreprise burkinabè au service de ceux qui construisent',
    paragraphes: [
      `${E.nom} est une entreprise installée à Larlé, sur l'avenue de la Liberté, à Ouagadougou. Spécialisée à l'origine dans les pompes et les accessoires hydrauliques, elle a élargi son offre pour accompagner tous ceux qui font avancer le pays : agriculteurs, entreprises minières, collectivités, artisans et particuliers.`,
      '« Paalga » signifie « nouveau » en mooré. Ce nom résume notre ambition : rendre accessibles des équipements modernes et fiables, et apporter des solutions nouvelles aux besoins du quotidien, de l\'accès à l\'eau à l\'énergie.'
    ]
  })}
<section class="grid md:grid-cols-2" aria-label="Mission et engagement">
  <div class="bg-bleu text-white px-6 sm:px-12 lg:px-16 py-14 sm:py-16" v-reveal>
    <h2 class="text-xs font-bold uppercase tracking-[0.25em] text-white/75">Notre mission</h2>
    <p class="mt-5 text-xl sm:text-3xl font-extrabold leading-snug">Fournir des équipements de qualité qui font avancer l'agriculture, l'industrie et l'accès à l'eau au Burkina Faso.</p>
  </div>
  <div class="bg-bleu-nuit text-white px-6 sm:px-12 lg:px-16 py-14 sm:py-16" v-reveal>
    <h2 class="text-xs font-bold uppercase tracking-[0.25em] text-jaune">Notre engagement</h2>
    <p class="mt-5 text-xl sm:text-3xl font-extrabold leading-snug">Conseiller avec honnêteté, livrer du matériel fiable et rester présents après la vente.</p>
  </div>
</section>
<section class="py-16 sm:py-24" aria-labelledby="titre-valeurs">
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div v-reveal><p class="eyebrow">Nos valeurs</p><h2 id="titre-valeurs" class="titre-section">${E.valeurs.join(' · ')}</h2></div>
    <ul class="mt-10 sm:mt-12 grid md:grid-cols-3 border-t-4 border-bleu">
      ${valeursDetail.map((v, i) => `<li class="py-7 md:py-8 md:px-8 md:first:pl-0 border-b md:border-b-0 md:border-r md:last:border-r-0 border-slate-200" v-reveal>
        <span class="text-jaune-fonce font-extrabold text-3xl" aria-hidden="true">0${i + 1}</span>
        <h3 class="mt-3 text-xl font-extrabold uppercase text-bleu-nuit">${v.titre}</h3>
        <p class="mt-3 text-slate-600 leading-relaxed">${v.texte}</p>
      </li>`).join('\n      ')}
    </ul>
  </div>
</section>
<section class="bg-slate-50 py-16 sm:py-24" aria-labelledby="titre-activites">
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div v-reveal><p class="eyebrow">Nos activités</p><h2 id="titre-activites" class="titre-section">Cinq métiers, un seul interlocuteur</h2></div>
    <ul class="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-slate-200 border border-slate-200">
      ${activites.map(a => `<li class="flex"><a href="${a.lien}" class="group w-full bg-white p-6 flex flex-col hover:bg-bleu transition">
        <h3 class="font-extrabold uppercase text-bleu-nuit group-hover:text-white transition">${a.nom}</h3>
        <p class="mt-2 text-sm text-slate-600 group-hover:text-white/85 transition flex-1">${a.texte}</p>
        <span class="mt-5 block h-[3px] w-8 bg-jaune transition-all duration-500 group-hover:w-full" aria-hidden="true"></span>
      </a></li>`).join('\n      ')}
    </ul>
  </div>
</section>
<section class="py-16 sm:py-24" aria-labelledby="titre-espaces">
  <div class="max-w-7xl mx-auto px-4 sm:px-6">
    <div v-reveal><p class="eyebrow">Nous rendre visite</p><h2 id="titre-espaces" class="titre-section">Nos espaces</h2></div>
    <div class="mt-10 sm:mt-12 grid md:grid-cols-2 gap-6">
      ${[
        { nom: 'FEP Pompes & Accessoires', texte: 'Pompes, pièces et accessoires hydrauliques.', image: 'images/auto/devanture-boutique-pompes-accessoires.jpeg', alt: 'Boutique FEP Pompes et Accessoires' },
        { nom: 'FEP Auto', texte: 'Showroom de véhicules neufs.', image: 'images/auto/fep-auto-jetour-t2.jpeg', alt: 'Showroom FEP Auto avec un SUV Jetour T2' }
      ].map(e => `<figure class="group" v-reveal>
        <div class="aspect-[4/3] overflow-hidden bg-slate-100">${img(e.image, e.alt, 'w-full h-full object-cover transition duration-700 group-hover:scale-105')}</div>
        <figcaption class="mt-4 border-l-4 border-jaune pl-4">
          <span class="block font-extrabold uppercase text-bleu-nuit">${e.nom}</span>
          <span class="block text-sm text-slate-600">${e.texte}</span>
        </figcaption>
      </figure>`).join('\n      ')}
    </div>
  </div>
</section>
${bandeauContact()}`
});

// ---------------------------------------------------------------- Contact
const carteGoogle = 'https://www.google.com/maps?q=' + encodeURIComponent(`${E.rue}, ${E.quartier}, ${E.ville}, ${E.pays}`) + '&output=embed';
pages.push({
  fichier: 'contact.html',
  titre: 'Contact et devis | Faso Équipement Paalga, Ouagadougou',
  description: `Contactez ${E.nom} : ${E.rue}, ${E.quartier}, ${E.ville}. Tél. et WhatsApp +226 ${E.tel}. Demande de devis en ligne.`,
  actif: 'contact',
  image: 'images/hydrauliques/surpresseurs-reservoirs.jpeg',
  jsonld: [jsonldEntreprise, jsonldAriane([{ nom: 'Contact' }])],
  contenu: `
${banniere({ titre: 'Contact', texte: 'Une question, un devis ? Nous vous répondons rapidement.', image: 'images/hydrauliques/surpresseurs-reservoirs.jpeg', alt: 'Surpresseurs Faso Équipement Paalga', ariane: [{ nom: 'Contact' }] })}
<section class="py-16 sm:py-24" aria-label="Coordonnées et formulaire">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12 lg:gap-16">
    <div class="lg:col-span-5" v-reveal>
      <p class="eyebrow">Nos coordonnées</p>
      <h2 class="titre-section">Parlons de votre projet</h2>
      <p class="mt-5 text-slate-600 leading-relaxed">Passez nous voir, appelez-nous ou écrivez-nous : nous vous orientons vers la bonne solution.</p>
      <address class="not-italic">
        <dl class="mt-10 border-t border-slate-200">
          <div class="py-5 border-b border-slate-200 grid grid-cols-[7rem_1fr] sm:grid-cols-3 gap-4">
            <dt class="etiquette !mb-0 pt-0.5">Adresse</dt>
            <dd class="sm:col-span-2 text-bleu-nuit font-semibold"><a href="${E.maps}" target="_blank" rel="noopener" class="hover:text-bleu">${E.rue}, ${E.quartier}<br>${E.ville}, ${E.pays}</a></dd>
          </div>
          <div class="py-5 border-b border-slate-200 grid grid-cols-[7rem_1fr] sm:grid-cols-3 gap-4">
            <dt class="etiquette !mb-0 pt-0.5">Téléphone</dt>
            <dd class="sm:col-span-2 text-bleu-nuit font-semibold"><a href="tel:${E.telIntl}" class="hover:text-bleu">+226 ${E.tel}</a></dd>
          </div>
          <div class="py-5 border-b border-slate-200 grid grid-cols-[7rem_1fr] sm:grid-cols-3 gap-4">
            <dt class="etiquette !mb-0 pt-0.5">WhatsApp</dt>
            <dd class="sm:col-span-2 text-bleu-nuit font-semibold"><a href="${whatsapp()}" target="_blank" rel="noopener" class="hover:text-bleu">+226 ${E.tel}</a></dd>
          </div>
          <div class="py-5 border-b border-slate-200 grid grid-cols-[7rem_1fr] sm:grid-cols-3 gap-4">
            <dt class="etiquette !mb-0 pt-0.5">E-mail</dt>
            <dd class="sm:col-span-2 text-bleu-nuit font-semibold">${emailProtege('hover:text-bleu break-all')}</dd>
          </div>
          <div class="py-5 border-b border-slate-200 grid grid-cols-[7rem_1fr] sm:grid-cols-3 gap-4">
            <dt class="etiquette !mb-0 pt-0.5">Réseaux</dt>
            <dd class="sm:col-span-2 text-bleu-nuit font-semibold flex flex-wrap gap-x-5 gap-y-1">
              <a href="${E.facebook}" target="_blank" rel="noopener" class="hover:text-bleu">Facebook</a>
              <a href="${E.tiktok}" target="_blank" rel="noopener" class="hover:text-bleu">TikTok</a>
            </dd>
          </div>
        </dl>
      </address>
      <a href="${E.maps}" target="_blank" rel="noopener" class="btn btn-jaune mt-10">Itinéraire Google Maps</a>
    </div>

    <div class="lg:col-span-7" v-reveal>
      <form @submit.prevent="envoyer('email')" class="bg-slate-50 border-t-4 border-bleu p-5 sm:p-10" novalidate aria-labelledby="titre-formulaire">
        <h2 id="titre-formulaire" class="text-xl sm:text-2xl font-extrabold uppercase text-bleu-nuit">Envoyer un message</h2>
        <p class="mt-2 text-sm text-slate-600">Les champs marqués d'un astérisque (*) sont obligatoires. Indiquez au moins un téléphone ou un e-mail pour que nous puissions vous répondre.</p>

        <div class="mt-8 grid sm:grid-cols-2 gap-5">
          <div class="sm:col-span-2">
            <label for="nom" class="etiquette">Nom complet *</label>
            <input id="nom" name="nom" v-model.trim="form.nom" type="text" autocomplete="name" maxlength="100" required class="champ" :class="{ 'champ-erreur': erreurs.nom }" :aria-invalid="erreurs.nom" aria-describedby="erreur-nom">
            <p id="erreur-nom" v-if="erreurs.nom" v-cloak class="mt-1 text-xs text-red-700">Merci d'indiquer votre nom.</p>
          </div>
          <div>
            <label for="tel" class="etiquette">Téléphone</label>
            <input id="tel" name="tel" v-model.trim="form.tel" type="tel" autocomplete="tel" maxlength="30" class="champ" :class="{ 'champ-erreur': erreurs.joindre }">
          </div>
          <div>
            <label for="email" class="etiquette">E-mail</label>
            <input id="email" name="email" v-model.trim="form.email" type="email" autocomplete="email" maxlength="150" class="champ" :class="{ 'champ-erreur': erreurs.joindre || erreurs.email }" :aria-invalid="erreurs.email">
          </div>
          <p v-if="erreurs.joindre" v-cloak class="sm:col-span-2 -mt-3 text-xs text-red-700">Indiquez un téléphone ou un e-mail.</p>
          <p v-if="erreurs.email" v-cloak class="sm:col-span-2 -mt-3 text-xs text-red-700">L'adresse e-mail ne semble pas valide.</p>
          <div class="sm:col-span-2">
            <label for="domaine" class="etiquette">Domaine</label>
            <select id="domaine" name="domaine" v-model="form.domaine" class="champ">
              ${['Hydraulique / forage', 'Agricole', 'Solaire', 'Minier', 'Véhicules', 'Autre demande'].map(o => `<option>${o}</option>`).join('')}
            </select>
          </div>
          <div class="sm:col-span-2">
            <label for="message" class="etiquette">Votre message *</label>
            <textarea id="message" name="message" v-model.trim="form.message" rows="6" maxlength="5000" required class="champ resize-y" :class="{ 'champ-erreur': erreurs.message }" :aria-invalid="erreurs.message" aria-describedby="erreur-message"
                      placeholder="Décrivez votre besoin : produit, quantité, lieu d'installation…"></textarea>
            <p id="erreur-message" v-if="erreurs.message" v-cloak class="mt-1 text-xs text-red-700">Merci d'écrire votre message (10 caractères minimum).</p>
          </div>
        </div>

        <div class="mt-6 flex flex-col sm:flex-row gap-3">
          <button type="submit" class="btn btn-nuit justify-center">Envoyer par e-mail</button>
          <button type="button" @click="envoyer('whatsapp')" class="btn btn-whatsapp justify-center">${ICONE.whatsapp()} Envoyer via WhatsApp</button>
        </div>
        <p v-if="statut" v-cloak role="status" class="mt-6 p-4 text-sm font-semibold border-l-4" :class="statut.ok ? 'bg-green-50 border-green-600 text-green-800' : 'bg-red-50 border-red-600 text-red-800'" v-text="statut.texte"></p>
      </form>
    </div>
  </div>
</section>
<section class="border-t border-slate-200" aria-label="Carte de localisation">
  <iframe src="${esc(carteGoogle)}" title="Carte : ${esc(E.nom)}, ${esc(adresseCourte)}" class="w-full h-[320px] sm:h-[420px] block carte" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
</section>`
});

// ---------------------------------------------------------------- 404
pages.push({
  fichier: '404.html',
  titre: 'Page introuvable | Faso Équipement Paalga',
  description: "Cette page n'existe pas ou a été déplacée.",
  actif: '',
  indexer: false,
  contenu: `
<section class="py-24 sm:py-32">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 text-center">
    <p class="text-jaune-fonce font-extrabold text-6xl sm:text-8xl">404</p>
    <h1 class="mt-4 titre-section">Page introuvable</h1>
    <p class="mt-4 text-slate-600">La page que vous cherchez n'existe pas ou a été déplacée.</p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <a href="index.html" class="btn btn-jaune">Retour à l'accueil</a>
      <a href="equipements.html" class="btn btn-contour-nuit">Nos équipements</a>
    </div>
  </div>
</section>`
});

// ================================================================ ÉCRITURE
for (const p of pages) {
  writeFileSync(join(RACINE, p.fichier), page(p));
  console.log('✓', p.fichier);
}

const urls = pages.filter(p => p.indexer !== false);
writeFileSync(join(RACINE, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(p => `  <url>
    <loc>${abs(p.fichier)}</loc>
    <lastmod>${AUJOURDHUI}</lastmod>
    <priority>${p.fichier === 'index.html' ? '1.0' : p.fichier.startsWith('equipements') ? '0.9' : '0.7'}</priority>${p.image ? `
    <image:image><image:loc>${abs(p.image)}</image:loc></image:image>` : ''}
  </url>`).join('\n')}
</urlset>
`);
console.log('✓ sitemap.xml');

writeFileSync(join(RACINE, 'robots.txt'), `User-agent: *
Allow: /
Disallow: /src/

Sitemap: ${SITE_URL}/sitemap.xml
`);
console.log('✓ robots.txt');

writeFileSync(join(RACINE, 'site.webmanifest'), JSON.stringify({
  name: E.nom,
  short_name: E.sigle,
  description: E.description,
  lang: 'fr',
  start_url: './',
  display: 'browser',
  background_color: '#FFFFFF',
  theme_color: '#0E2A40',
  icons: [
    { src: 'logo/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    { src: 'logo/icone-512.png', sizes: '512x512', type: 'image/png' }
  ]
}, null, 2));
console.log('✓ site.webmanifest');
