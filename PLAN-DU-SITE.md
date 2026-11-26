# Faso Équipement Paalga — Plan du site

Slogan : **« La qualité au service du peuple »**
Valeurs : **Fidélité · Qualité · Efficacité**
Couleurs : bleu `#408FC8` · jaune `#F3B73F` · blanc `#FFFFFF` — Police : Montserrat
Technologies : HTML, Tailwind CSS, Vue.js 3, JavaScript
Adresse : Avenue de la Liberté, Larlé, Ouagadougou — Tél./WhatsApp : +226 73 38 28 88 — E-mail : fasoequipementspaalga@gmail.com
Style : angles droits, design sobre, pages légères (pas de one-page)

**État : toutes les pages sont réalisées.**

## Modifier le site

1. Modifier les textes dans `src/contenu.mjs` (ou la mise en page dans `src/build.mjs`).
2. Lancer `npm run build` : les pages HTML, le CSS, le sitemap et le robots.txt sont régénérés.
3. Ne pas modifier directement les fichiers `.html` à la racine : ils sont écrasés à chaque génération.

Première installation sur un nouvel ordinateur : `npm install` (Node.js requis).

## Organisation du code

| Fichier | Rôle |
|---|---|
| `src/contenu.mjs` | **Tous les contenus** : coordonnées, diaporama, domaines, produits, véhicules, adresse du site. |
| `src/build.mjs` | Gabarits des pages et balises de référencement ; génère les `.html`, `sitemap.xml`, `robots.txt`, `site.webmanifest`. |
| `src/styles.css` | Styles (boutons, animations, filtres) compilés par Tailwind vers `assets/css/site.css`. |
| `assets/js/app.js` | Interactivité Vue.js : menu, diaporama, galerie, visionneuse, formulaire. |
| `logo/` | Logo d'origine et ses déclinaisons (emblème détouré, version PNG transparente, icônes d'onglet). |

## Référencement (SEO)

- Pages HTML statiques complètes : tout le texte est lisible par Google sans JavaScript.
- Par page : titre et description uniques, un seul `h1`, lien canonique, balises Open Graph / Twitter (aperçu sur Facebook et WhatsApp).
- Données structurées schema.org : entreprise (`Store` avec adresse, téléphone, réseaux), site web, fil d'Ariane.
- Images : noms de fichiers descriptifs, texte alternatif, dimensions (pas de saut de mise en page), chargement différé.
- `sitemap.xml`, `robots.txt`, page `404.html`, balises sémantiques (`header`, `nav`, `main`, `article`, `address`, `footer`).

## Formulaire de contact

- Site 100 % statique (hébergé sur GitHub Pages) : aucun code serveur.
- « Envoyer via WhatsApp » ouvre WhatsApp avec le message rédigé ; « Envoyer par e-mail » ouvre la messagerie du visiteur vers fasoequipementspaalga@gmail.com.
- Adresse e-mail jamais écrite en clair dans le HTML (assemblée par JavaScript).

## Avant la mise en ligne

- [ ] Remplacer `SITE_URL` dans `src/contenu.mjs` par le vrai nom de domaine, puis `npm run build`.
- [ ] Publier sur GitHub Pages (dépôt Git, branche `main`, dossier racine).
- [ ] Déclarer le site dans Google Search Console et y soumettre `sitemap.xml`.
- [ ] Créer / mettre à jour la fiche Google Business Profile (adresse Larlé) avec le lien du site.

## Arborescence

```
Accueil                     index.html
Véhicules                   vehicules.html
Équipements                 equipements.html
 ├─ Agricoles               equipements-agricoles.html
 ├─ Solaires                equipements-solaires.html
 ├─ Miniers                 equipements-miniers.html
 └─ Hydrauliques            equipements-hydrauliques.html
À propos                    a-propos.html
Contact                     contact.html
```

Éléments communs à toutes les pages :
- **Barre du haut** : téléphone, lien Google Maps, Facebook, TikTok, WhatsApp.
- **En-tête fixe** : logo, menu (avec un sous-menu « Équipements »), bouton « Demander un devis » qui ouvre WhatsApp.
- **Bouton WhatsApp flottant** en bas à droite.
- **Pied de page** : présentation courte, liens rapides, contacts, réseaux sociaux.

---

## 1. Accueil (réalisée)

| Section | Contenu et texte proposé |
|---|---|
| **Diaporama plein écran** | 5 diapositives (une par activité) avec un léger zoom animé et un filtre bleu sur la photo. <br>1. *Hydraulique* : « L'eau, là où vous en avez besoin » <br>2. *Agricole* : « Mécanisez votre agriculture » <br>3. *Minier* : « La puissance au service de vos chantiers » <br>4. *Solaire* : « L'énergie du soleil, jour et nuit » <br>5. *Véhicules* : « FEP Auto : roulez en confiance » |
| **Bandeau des valeurs** | Fidélité : « Des relations durables avec nos clients, avant et après la vente. » Qualité : « Des équipements sélectionnés pour leur robustesse et leur fiabilité. » Efficacité : « Conseil, livraison et installation rapides. » |
| **Nos domaines** | « Un seul partenaire pour équiper vos projets ». 4 cartes : Agricoles, Solaires, Miniers, Hydrauliques. La photo passe du noir et blanc à la couleur au survol. |
| **Qui sommes-nous** | « Faso Équipement Paalga accompagne particuliers, agriculteurs, entreprises et collectivités du Burkina Faso dans le choix, la fourniture et l'installation d'équipements fiables. » |
| **Réalisation à la une** | Photo du forage jaillissant avec le texte : « Du forage à l'installation de la pompe, nous gérons tout le projet d'accès à l'eau. » |
| **FEP Auto** | « Des SUV neufs, prêts à rouler, dans notre showroom. » Mini-diaporama des véhicules. |
| **Galerie filtrable** | Boutons de filtre : Tous / Agricoles / Solaires / Miniers / Hydrauliques / Véhicules. Un clic sur une photo l'ouvre en grand. |
| **Appel à l'action** | « Un projet ? Parlons-en. Nos conseillers vous répondent sur WhatsApp. » + boutons WhatsApp et Appeler. |

## 2. Véhicules
- **Bannière** : « FEP Auto — Des véhicules neufs, choisis pour vos routes. »
- **Catalogue** : une fiche par modèle (photo, nom, points forts, bouton « Demander le prix » vers WhatsApp).
- **Nos services** : « Conseil personnalisé, essais sur rendez-vous, accompagnement pour les démarches. »
- **Showroom** : photos de la devanture et adresse.

## 3. Équipements (page générale)
- **Introduction** : « Quatre domaines, un même engagement : vous fournir du matériel robuste, adapté au terrain et suivi dans le temps. »
- 4 grands blocs qui renvoient vers les sous-pages.

### 3a. Agricoles
« Gagnez du temps et du rendement à chaque saison. »
Tracteurs, mini-tracteurs, motoculteurs, fraises rotatives, charrues, semoirs, égreneuses à maïs, remorques.

### 3b. Solaires
« Produisez votre propre énergie, sans coupure. »
Panneaux solaires, batteries lithium, onduleurs, étude et installation.

### 3c. Miniers
« Du matériel taillé pour les conditions les plus exigeantes. »
Concasseurs à mâchoires, concasseurs mobiles avec crible, broyeurs à boulets, convoyeurs, engins de carrière, groupes électrogènes.

### 3d. Hydrauliques
« L'eau, notre métier d'origine. »
Machines de forage, pompes à boues, pompes solaires, pompes immergées hybrides (AC/DC), pompes avec flotteur, surpresseurs avec réservoir, accessoires et tuyauterie.
Chaque sous-page : bannière, liste des produits en cartes, galerie filtrable, bouton « Demander un devis ».

## 4. À propos
- **Notre histoire** *(texte à fournir par l'entreprise : date de création, fondateur, étapes clés)*.
- **Notre mission** : « Rendre accessibles des équipements de qualité qui font avancer l'agriculture, l'industrie et l'accès à l'eau au Burkina Faso. »
- **Nos valeurs** : Fidélité, Qualité, Efficacité.
- **Nos réalisations** : photos de chantiers.
- **Chiffres clés** *(à fournir : années d'expérience, forages réalisés, clients…)*.

## 5. Contact
- Formulaire (nom, téléphone, domaine, message) qui envoie le message pré-rempli sur WhatsApp.
- Téléphone : 73 38 28 88 · WhatsApp · Facebook · TikTok.
- Carte Google Maps et horaires d'ouverture *(à fournir)*.

---

### Informations à fournir
- Adresse écrite (quartier, ville) et horaires d'ouverture.
- Adresse e-mail, si vous en avez une.
- Historique et chiffres clés pour la page À propos.
- Le logo en PNG avec fond transparent (meilleur rendu sur fond sombre).
