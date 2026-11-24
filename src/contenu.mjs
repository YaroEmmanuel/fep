// ============ Faso Équipement Paalga — contenus du site ============
// Tous les textes, produits, photos et coordonnées se modifient ici,
// puis lancer :  npm run build

// Adresse définitive du site (sert au référencement : liens canoniques, sitemap, partage sur les réseaux).
// ⚠️ À remplacer par le vrai nom de domaine avant la mise en ligne.
export const SITE_URL = 'https://www.fasoequipementpaalga.com';

export const ENTREPRISE = {
  // L'e-mail est découpé en deux parties : il n'apparaît jamais en clair dans le code des pages
  // (protection contre les robots qui collectent les adresses pour envoyer du spam).
  emailUtilisateur: 'fasoequipementspaalga',
  emailDomaine: 'gmail.com',
  nom: 'Faso Équipement Paalga',
  sigle: 'FEP',
  slogan: 'La qualité au service du peuple',
  valeurs: ['Fidélité', 'Qualité', 'Efficacité'],
  tel: '73 38 28 88',
  telIntl: '+22673382888',
  whatsappNumero: '22673382888',
  rue: 'Avenue de la Liberté',
  quartier: 'Larlé',
  ville: 'Ouagadougou',
  pays: 'Burkina Faso',
  codePays: 'BF',
  facebook: 'https://www.facebook.com/share/1AaGTFZWxt/',
  tiktok: 'https://www.tiktok.com/@faso_equipements_paalga',
  maps: 'https://maps.app.goo.gl/5Kmp8EzT9U921tFc8',
  description: "Équipements agricoles, solaires, miniers et hydrauliques, forages d'eau et véhicules neufs à Ouagadougou, Burkina Faso."
};

export const whatsapp = (message = 'Bonjour Faso Équipement Paalga, je souhaite des informations.') =>
  `https://wa.me/${ENTREPRISE.whatsappNumero}?text=${encodeURIComponent(message)}`;

// ---------- Diaporama de l'accueil ----------
export const DIAPORAMA = [
  {
    court: 'Hydraulique', tag: 'Hydraulique & forages',
    titre: "L'eau, là où vous en avez besoin",
    texte: "Forages, pompes immergées et surpresseurs pour les ménages, les exploitations et les industries.",
    bouton: 'Solutions hydrauliques', lien: 'equipements-hydrauliques.html',
    image: 'images/hydrauliques/camions-foreuses-forage-eau.jpeg', alt: "Camions foreuses pour forage d'eau à Ouagadougou"
  },
  {
    court: 'Agricole', tag: 'Équipements agricoles',
    titre: 'Mécanisez votre agriculture',
    texte: "Tracteurs, motoculteurs, semoirs et égreneuses pour gagner du temps à chaque saison.",
    bouton: 'Matériel agricole', lien: 'equipements-agricoles.html',
    image: 'images/agricoles/tracteur-semoir-champ.jpeg', alt: 'Tracteur avec semoir en ligne dans un champ'
  },
  {
    court: 'Minier', tag: 'Équipements miniers',
    titre: 'La puissance au service de vos chantiers',
    texte: "Concasseurs, broyeurs et engins de carrière pensés pour les conditions les plus exigeantes.",
    bouton: 'Matériel minier', lien: 'equipements-miniers.html',
    image: 'images/miniers/engins-carriere-camion-pelle-chargeuse-concasseur.jpeg', alt: 'Camion-benne, pelle, chargeuse et concasseur sur une carrière'
  },
  {
    court: 'Solaire', tag: 'Énergie solaire',
    titre: "L'énergie du soleil, jour et nuit",
    texte: "Panneaux, batteries, onduleurs et pompes solaires pour une électricité sans coupure.",
    bouton: 'Solutions solaires', lien: 'equipements-solaires.html',
    image: 'images/solaires/installation-panneaux-solaires-batteries.jpeg', alt: 'Installation de panneaux solaires avec batteries de stockage'
  },
  {
    court: 'Véhicules', tag: 'FEP Auto',
    titre: 'Roulez en confiance',
    texte: "Des SUV neufs, modernes et confortables, disponibles dans notre showroom.",
    bouton: 'Voir les véhicules', lien: 'vehicules.html',
    image: 'images/auto/fep-auto-showroom-suv-2.jpeg', alt: 'SUV neufs Jetour devant le showroom FEP Auto'
  }
];

// ---------- Domaines d'équipements ----------
export const DOMAINES = [
  {
    id: 'agricoles',
    nom: 'Agricoles',
    page: 'equipements-agricoles.html',
    seoTitre: 'Matériel agricole à Ouagadougou | Faso Équipement Paalga',
    seoDescription: "Tracteurs, motoculteurs, semoirs, égreneuses à maïs et remorques à Ouagadougou. Conseil, pièces de rechange et devis rapide sur WhatsApp.",
    accroche: 'Gagnez du temps et du rendement à chaque saison',
    resume: 'Tracteurs, motoculteurs, semoirs, égreneuses.',
    banniere: 'images/agricoles/tracteur-semoir-champ.jpeg',
    image: 'images/agricoles/tracteur-motoculteurs-remorque-champ.jpeg',
    alt: 'Tracteur, motoculteurs et remorque agricole dans un champ',
    intro: "Préparer le sol, semer, transporter, transformer : nous fournissons à Ouagadougou le matériel qui allège le travail des producteurs, des coopératives et des grandes exploitations du Burkina Faso. Du motoculteur pour une parcelle familiale au tracteur pour plusieurs dizaines d'hectares, nous vous aidons à choisir l'équipement adapté à votre surface et à votre culture.",
    points: ['Matériel adapté aux sols du Sahel', 'Pièces de rechange disponibles', 'Démonstration et prise en main', 'Conseil selon votre surface'],
    produits: [
      { nom: 'Tracteurs et mini-tracteurs', image: 'images/agricoles/tracteurs-rouges-mini-tracteur-orange.jpeg', alt: 'Deux tracteurs rouges et un mini-tracteur orange', texte: "Du mini-tracteur polyvalent au tracteur de forte puissance avec cabine, pour le labour, le transport et les travaux lourds." },
      { nom: 'Motoculteurs', image: 'images/agricoles/motoculteurs-vert-orange-fraises-rotatives.jpeg', alt: 'Motoculteurs diesel vert et orange avec fraises rotatives', texte: "Motoculteurs diesel livrés avec fraises rotatives, idéals pour le travail du sol sur les petites et moyennes parcelles." },
      { nom: 'Motoculteur à chenilles', image: 'images/agricoles/motoculteur-chenilles-charrue-rouge.jpeg', alt: 'Motoculteur rouge à chenilles équipé d\'une charrue', texte: "Équipé d'une charrue, il garde une excellente adhérence sur les terrains lourds, humides ou en pente." },
      { nom: 'Semoirs', image: 'images/agricoles/tracteur-semoir-champ.jpeg', alt: 'Semoir en ligne attelé à un tracteur', texte: "Semoirs en ligne attelés pour un semis régulier, rapide et économe en semences." },
      { nom: 'Égreneuses à maïs', image: 'images/agricoles/egreneuse-mais-moteur-essence.jpeg', alt: 'Égreneuse à maïs orange avec moteur essence', texte: "Égreneuses motorisées pour séparer rapidement les grains de maïs après la récolte." },
      { nom: 'Remorques et accessoires', image: 'images/agricoles/tracteur-motoculteurs-remorque-champ.jpeg', alt: 'Remorque agricole, pulvériseur à disques et motoculteurs', texte: "Remorques agricoles, pulvériseurs à disques et accessoires pour compléter votre équipement." }
    ]
  },
  {
    id: 'solaires',
    nom: 'Solaires',
    page: 'equipements-solaires.html',
    seoTitre: 'Équipements solaires à Ouagadougou | Faso Équipement Paalga',
    seoDescription: "Installations solaires avec batteries, pompes solaires immergées et groupes électrogènes à Ouagadougou. Étude, fourniture et installation.",
    accroche: 'Produisez votre propre énergie, sans coupure',
    resume: 'Panneaux, batteries, onduleurs, pompes solaires.',
    banniere: 'images/solaires/installation-panneaux-solaires-batteries.jpeg',
    image: 'images/solaires/installation-panneaux-solaires-batteries.jpeg',
    alt: 'Panneaux solaires et batteries de stockage sous abri',
    intro: "Le soleil est la ressource la plus abondante du Burkina Faso. Nous concevons et installons des systèmes solaires complets, avec stockage, pour alimenter votre maison, votre commerce, votre exploitation ou votre forage, et réduire durablement vos factures et vos coupures.",
    points: ['Étude de vos besoins en énergie', 'Installation par nos techniciens', 'Batteries de stockage longue durée', 'Pompage solaire sans carburant'],
    produits: [
      { nom: 'Installations solaires avec stockage', image: 'images/solaires/installation-panneaux-solaires-batteries.jpeg', alt: 'Installation solaire avec onduleur et quatre batteries', texte: "Panneaux, onduleur et batteries dimensionnés selon votre consommation, pour une électricité disponible jour et nuit." },
      { nom: 'Pompes solaires immergées', image: 'images/solaires/pompes-solaires-immergees-hybrides.jpeg', alt: 'Trois pompes solaires immergées hybrides AC/DC en inox', texte: "Pompes hybrides AC/DC à moteur sans balais : elles fonctionnent sur panneaux solaires comme sur le réseau électrique." },
      { nom: 'Groupes électrogènes', image: 'images/auto/groupe-electrogene-diesel.jpeg', alt: 'Groupe électrogène diesel bleu', texte: "Groupes diesel en complément de votre installation solaire, pour une alimentation de secours toujours prête." }
    ]
  },
  {
    id: 'miniers',
    nom: 'Miniers',
    page: 'equipements-miniers.html',
    seoTitre: 'Équipements miniers et concasseurs | Faso Équipement Paalga',
    seoDescription: "Concasseurs à mâchoires, concasseurs mobiles, broyeurs à boulets et engins de carrière pour l'exploitation minière au Burkina Faso.",
    accroche: 'Du matériel taillé pour les conditions les plus exigeantes',
    resume: 'Concasseurs, broyeurs, cribles, engins de carrière.',
    banniere: 'images/miniers/engins-carriere-camion-pelle-chargeuse-concasseur.jpeg',
    image: 'images/miniers/concasseur-a-machoires-convoyeur.jpeg',
    alt: 'Concasseur à mâchoires sur roues avec tapis convoyeur',
    intro: "Exploitation minière, carrière ou production de granulats : nous fournissons des équipements robustes pour extraire, concasser, broyer et trier. Du concasseur mobile pour les petites exploitations aux broyeurs industriels, nous vous accompagnons dans le choix et la mise en service partout au Burkina Faso.",
    points: ['Matériel robuste et éprouvé', 'Solutions mobiles ou fixes', 'Mise en service sur site', "Pièces d'usure disponibles"],
    produits: [
      { nom: 'Concasseurs à mâchoires', image: 'images/miniers/concasseur-a-machoires-convoyeur.jpeg', alt: 'Concasseur à mâchoires avec moteur diesel et convoyeur', texte: "Concasseurs sur roues avec moteur diesel et tapis convoyeur, pour réduire roches et minerais directement sur le site." },
      { nom: 'Concasseurs mobiles avec crible', image: 'images/miniers/concasseur-mobile-crible.jpeg', alt: 'Concasseur mobile avec crible vibrant', texte: "Une seule machine pour concasser et trier les matériaux, facile à déplacer d'un chantier à l'autre." },
      { nom: 'Broyeurs à boulets', image: 'images/miniers/broyeur-a-boulets.jpeg', alt: 'Broyeur à boulets industriel bleu et rouge', texte: "Broyeurs industriels pour réduire le minerai en poudre fine avant le traitement." },
      { nom: 'Engins de carrière', image: 'images/miniers/engins-carriere-pelle-bulldozer-foreuse.jpeg', alt: 'Pelle hydraulique, bulldozer, foreuse et tombereau sur une mine', texte: "Pelles hydrauliques, bulldozers, chargeuses, foreuses et camions-bennes pour l'extraction et le transport." }
    ]
  },
  {
    id: 'hydrauliques',
    nom: 'Hydrauliques',
    page: 'equipements-hydrauliques.html',
    seoTitre: "Forages et pompes à eau à Ouagadougou | Faso Équipement Paalga",
    seoDescription: "Forages d'eau, pompes immergées, pompes de relevage et surpresseurs à Ouagadougou. Fourniture, installation et dépannage.",
    accroche: "L'eau, notre métier d'origine",
    resume: 'Forages, pompes immergées, surpresseurs.',
    banniere: 'images/hydrauliques/camions-foreuses-forage-eau.jpeg',
    image: 'images/hydrauliques/pompes-immergees-grande-capacite.jpeg',
    alt: 'Pompes immergées grande capacité orange et vertes',
    intro: "Le pompage et l'accès à l'eau sont au cœur de notre activité. Nous réalisons vos forages et fournissons toute la gamme de pompes : immergées pour les forages profonds, de relevage pour vider une fosse, surpresseurs pour garder une bonne pression au robinet. Ménages, villages, exploitations agricoles ou industries : nous trouvons la solution adaptée à votre débit et à votre profondeur.",
    points: ['Forage clé en main', 'Pompes pour toutes profondeurs', 'Accessoires et tuyauterie', 'Installation et dépannage'],
    produits: [
      { nom: "Forages d'eau", image: 'images/hydrauliques/camions-foreuses-forage-eau.jpeg', alt: "Trois camions foreuses pour forage d'eau", texte: "Nos camions foreuses réalisent votre forage : étude du terrain, forage, équipement du puits et mise en service." },
      { nom: 'Pompes immergées grande capacité', image: 'images/hydrauliques/pompes-immergees-grande-capacite.jpeg', alt: 'Pompes immergées de grande capacité', texte: "Pour l'irrigation, l'adduction d'eau villageoise et les besoins industriels à fort débit." },
      { nom: 'Pompes de relevage', image: 'images/hydrauliques/pompes-vide-cave-jaunes.jpeg', alt: 'Quatre pompes de relevage submersibles jaunes', texte: "Pompes submersibles robustes pour évacuer les eaux de fosses, de chantiers ou de puits." },
      { nom: 'Pompes avec flotteur', image: 'images/hydrauliques/pompes-vide-cave-flotteur.jpeg', alt: 'Pompes submersibles avec interrupteur à flotteur', texte: "Démarrage et arrêt automatiques grâce à l'interrupteur à flotteur : la pompe ne tourne jamais à sec." },
      { nom: 'Surpresseurs', image: 'images/hydrauliques/surpresseurs-reservoirs.jpeg', alt: 'Surpresseurs avec réservoirs sous pression', texte: "Pompe et réservoir sous pression pour une pression d'eau constante dans la maison ou le bâtiment." },
      { nom: 'Gamme complète et accessoires', image: 'images/hydrauliques/foreuse-gamme-pompes-immergees.jpeg', alt: 'Gamme de pompes immergées devant un camion de forage', texte: "Pompes de forage inox, pompes de surface, tuyaux, câbles et coffrets de commande." }
    ]
  }
];

// ---------- Véhicules ----------
export const VEHICULES = [
  { nom: 'Jetour T8', image: 'images/auto/fep-auto-jetour-t8.jpeg', alt: 'SUV Jetour T8 devant le showroom FEP Auto', texte: "Un grand SUV au style baroudeur, spacieux et confortable, à l'aise en ville comme sur les pistes." },
  { nom: 'Jetour Dashing', image: 'images/auto/fep-auto-jetour-dashing.jpeg', alt: 'SUV Jetour Dashing bleu clair', texte: "Un SUV au design sportif et moderne, bien équipé en technologies et en aides à la conduite." },
  { nom: 'Gamme Jetour', image: 'images/auto/fep-auto-jetour-interieur.jpeg', alt: 'Véhicule Jetour blanc dans le showroom', texte: "D'autres modèles Jetour sont à découvrir dans notre showroom. Demandez la liste des véhicules disponibles." },
  { nom: 'SUV disponibles en showroom', image: 'images/auto/fep-auto-showroom-suv-1.jpeg', alt: 'Quatre SUV neufs alignés devant le showroom', texte: "Plusieurs SUV neufs de différentes marques et couleurs, prêts à être livrés." }
];
