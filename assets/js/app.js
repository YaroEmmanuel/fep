// ============ Faso Équipement Paalga — interactivité (Vue 3) ============
// Les pages HTML contiennent déjà tout leur contenu (référencement).
// Vue ajoute seulement : menu, diaporama, galerie filtrable, visionneuse,
// apparition au défilement, e-mail protégé et formulaire de contact (WhatsApp ou messagerie).

(function () {
  const racine = document.getElementById('app');
  if (!racine || !window.Vue) return;

  const cfg = window.FEP || {};
  const DUREE_DIAPO = 6000;        // doit correspondre à l'animation .progress (src/styles.css)

  // Lecture des éléments présents dans la page avant le montage de Vue
  const photos = [...document.querySelectorAll('[data-galerie]')].map(el => ({
    src: el.dataset.src, titre: el.dataset.titre, cat: el.dataset.cat, filtre: el.dataset.filtre
  }));
  const nbDiapos = document.querySelectorAll('[data-slide]').length;

  // Apparition des blocs au défilement
  const observateur = 'IntersectionObserver' in window
    ? new IntersectionObserver((entrees) => {
        entrees.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); observateur.unobserve(e.target); }
        });
      }, { threshold: 0.12 })
    : null;

  const app = Vue.createApp({
    data() {
      return {
        annee: new Date().getFullYear(),
        defile: false,
        menuOuvert: false,
        sousMenu: false,
        sousMenuMobile: false,
        email: Array.isArray(cfg.mail) ? cfg.mail.join('@') : '',

        // Diaporama
        diapo: 0, enPause: false, cleProgression: 0, minuteur: null, toucheX: 0,

        // Galerie
        filtre: 'tous', visionneuse: null, photos,

        // Formulaire
        form: { nom: '', tel: '', email: '', domaine: 'Hydraulique / forage', message: '' },
        erreurs: { nom: false, message: false, joindre: false, email: false },
        statut: null
      };
    },

    computed: {
      photosFiltrees() {
        return this.filtre === 'tous' ? this.photos : this.photos.filter(p => p.filtre === this.filtre);
      },
      photoActive() {
        return this.photosFiltrees[this.visionneuse] || {};
      }
    },

    watch: {
      visionneuse(v) { document.body.style.overflow = v === null ? '' : 'hidden'; },
      menuOuvert(v) { if (!v) this.sousMenuMobile = false; }
    },

    methods: {
      // ---------- En-tête ----------
      surDefilement() { this.defile = window.scrollY > 10; },
      quitterSousMenu(e) { if (!e.currentTarget.contains(e.relatedTarget)) this.sousMenu = false; },

      // ---------- Diaporama ----------
      allerA(i) { this.diapo = (i + nbDiapos) % nbDiapos; this.relancer(); },
      suivanteDiapo() { this.allerA(this.diapo + 1); },
      precedenteDiapo() { this.allerA(this.diapo - 1); },
      relancer() {
        clearInterval(this.minuteur);
        this.cleProgression++;
        if (!this.enPause && nbDiapos > 1) {
          this.minuteur = setInterval(() => {
            this.diapo = (this.diapo + 1) % nbDiapos;
            this.cleProgression++;
          }, DUREE_DIAPO);
        }
      },
      pauseDiaporama() { this.enPause = true; clearInterval(this.minuteur); },
      repriseDiaporama() { this.enPause = false; this.relancer(); },
      debutToucher(e) { this.toucheX = e.changedTouches[0].clientX; },
      finToucher(e) {
        const dx = e.changedTouches[0].clientX - this.toucheX;
        if (Math.abs(dx) > 50) (dx < 0 ? this.suivanteDiapo() : this.precedenteDiapo());
      },

      // ---------- Galerie ----------
      ouvrir(src) { this.visionneuse = this.photosFiltrees.findIndex(p => p.src === src); },
      fermer() { this.visionneuse = null; },
      suivante() { this.visionneuse = (this.visionneuse + 1) % this.photosFiltrees.length; },
      precedente() { this.visionneuse = (this.visionneuse - 1 + this.photosFiltrees.length) % this.photosFiltrees.length; },

      surTouche(e) {
        if (e.key === 'Escape') { this.fermer(); this.menuOuvert = false; this.sousMenu = false; }
        if (this.visionneuse === null) return;
        if (e.key === 'ArrowRight') this.suivante();
        if (e.key === 'ArrowLeft') this.precedente();
      },

      // ---------- Formulaire de contact ----------
      valider() {
        const f = this.form;
        this.erreurs.nom = f.nom.length < 2;
        this.erreurs.message = f.message.length < 10;
        this.erreurs.joindre = !f.tel && !f.email;
        this.erreurs.email = !!f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email);
        return !Object.values(this.erreurs).some(Boolean);
      },
      envoyer(mode) {
        this.statut = null;
        if (!this.valider()) return;

        const f = this.form;
        const texte = [
          'Bonjour Faso Équipement Paalga,', '', f.message, '',
          `Nom : ${f.nom}`,
          f.tel ? `Téléphone : ${f.tel}` : '',
          f.email ? `E-mail : ${f.email}` : '',
          `Domaine : ${f.domaine}`
        ].filter(Boolean).join('\n');

        if (mode === 'whatsapp') {
          window.open(`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(texte)}`, '_blank', 'noopener');
          this.statut = { ok: true, texte: "WhatsApp s'est ouvert avec votre message : il ne reste plus qu'à l'envoyer." };
          return;
        }

        // Pas de serveur : on ouvre la messagerie du visiteur avec le message déjà rédigé
        const sujet = `Demande de contact - ${f.domaine}`;
        window.location.href = `mailto:${this.email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(texte)}`;
        this.statut = { ok: true, texte: `Votre messagerie s'est ouverte avec le message : il ne reste plus qu'à l'envoyer. Sinon, écrivez-nous directement à ${this.email}.` };
      }
    },

    mounted() {
      window.addEventListener('scroll', this.surDefilement, { passive: true });
      window.addEventListener('keydown', this.surTouche);
      this.surDefilement();
      if (nbDiapos) this.relancer();
    },

    beforeUnmount() {
      clearInterval(this.minuteur);
      window.removeEventListener('scroll', this.surDefilement);
      window.removeEventListener('keydown', this.surTouche);
    }
  });

  app.directive('reveal', {
    mounted(el) {
      if (!observateur || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      el.classList.add('reveal');
      observateur.observe(el);
    },
    unmounted(el) { if (observateur) observateur.unobserve(el); }
  });

  app.mount(racine);
})();
