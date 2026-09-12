/**
 * Retour du lien « mot de passe oublié » de l'application (§5.1).
 *
 * POURQUOI CE FICHIER N'EST PAS `app-retour.js`, alors que les deux pages se ressemblent.
 * La confirmation d'adresse s'achève sur le SERVEUR : quand la page s'affiche, tout est
 * fait, et le fragment ne sert qu'à distinguer le succès de l'échec — `app-retour.js`
 * l'efface donc dès qu'il l'a lu. Une réinitialisation, elle, n'est qu'à moitié faite :
 * le fragment porte une session ouverte (`#access_token=…&refresh_token=…&type=recovery`)
 * dont l'application a besoin pour poser le nouveau mot de passe. Il faut donc le
 * TRANSMETTRE avant de l'effacer, ce qui est l'inverse exact de l'autre fichier.
 *
 * Séparer les deux plutôt que paramétrer l'un d'eux : `app-retour.js` est en production
 * depuis le 29/08 et a été éprouvé sur un vrai courriel. Une erreur introduite en le
 * généralisant se paierait sur le chemin d'inscription, qui est le plus fréquenté des
 * deux.
 *
 * TROIS CHOSES À DIRE, ET NON DEUX.
 *
 *   1. Le lien a expiré (`#error=…`) : il n'y a rien à faire ici, et on le dit.
 *   2. Le lien est bon et l'on est sur un TÉLÉPHONE : l'application s'ouvre, avec le
 *      fragment, et le bouton reste là — il n'y a jamais de rebond sans bouton.
 *   3. Le lien est bon et l'on est sur un ORDINATEUR : `bitaqat://` n'y mène nulle part,
 *      et un bouton mort est pire que pas de bouton (leçon du 29/08). Mais surtout, ce
 *      lien vient d'être DÉPENSÉ en s'ouvrant ici — il ne servira plus sur le téléphone.
 *      Le seul conseil vrai est donc d'en redemander un depuis l'application, et la page
 *      le dit plutôt que de laisser croire que le travail est fait.
 */
(function () {
  var section = document.querySelector('[data-mot-de-passe]');
  if (!section) return;

  var succes = section.querySelector('[data-etat="succes"]');
  var echec = section.querySelector('[data-etat="echec"]');
  var surTelephone = section.querySelector('[data-si="tactile"]');
  var surOrdinateur = section.querySelector('[data-si="ordinateur"]');

  var fragment = window.location.hash.replace(/^#/, '');
  var params = new URLSearchParams(fragment);
  var erreur = params.get('error') || params.get('error_code');

  function nettoyer() {
    // Le fragment porte ici une session VIVANTE, ce que celui de la confirmation ne
    // faisait pas. Le laisser dans la barre d'adresse, c'est le laisser dans l'historique
    // et dans tout ce qui se partage depuis cette page.
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  if (erreur || !params.get('access_token')) {
    nettoyer();
    if (succes) succes.hidden = true;
    if (echec) {
      echec.hidden = false;
      // Le titre de l'onglet a été rendu pour le cas nominal ; c'est lui qui reste dans
      // l'historique, et il ne peut pas dire l'inverse de la page.
      var titre = echec.getAttribute('data-titre');
      if (titre) document.title = titre;
    }
    return;
  }

  var scheme = section.getAttribute('data-scheme');
  var tactile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  // La branche ordinateur est celle qui est rendue visible : il n'y a rien à faire pour
  // elle, et c'est aussi ce qui s'affiche si ce script ne s'exécute jamais.
  if (!scheme || !tactile) {
    nettoyer();
    return;
  }

  // On passe à la branche tactile : l'autre doit partir, sans quoi les deux titres se
  // suivraient.
  if (surOrdinateur) surOrdinateur.hidden = true;

  var vers = scheme + '#' + fragment;
  var bouton = section.querySelector('[data-vers-app]');
  if (bouton) {
    bouton.setAttribute('href', vers);
    bouton.hidden = false;
  }
  if (surTelephone) surTelephone.hidden = false;

  // Le rebond d'abord, le nettoyage ensuite : l'ordre inverse emporterait le fragment
  // qu'on est en train de transmettre. `vers` est déjà construit, mais la barre d'adresse
  // sert encore au bouton si le rebond automatique est refusé par le navigateur.
  window.setTimeout(function () {
    window.location.href = vers;
    window.setTimeout(nettoyer, 1200);
  }, 900);
})();
