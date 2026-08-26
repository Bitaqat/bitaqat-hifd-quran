/**
 * Retour vers l'application après un lien de confirmation d'adresse.
 *
 * Deux choses que seul le navigateur peut faire, et c'est pourquoi ce fichier existe
 * plutôt qu'un bloc <script> dans la page : la CSP du site est en `script-src 'self'`,
 * elle refuse tout script en ligne.
 *
 * 1. LIRE LE VERDICT. Supabase ne redirige ici qu'après avoir tranché, et quand il a
 *    refusé il le dit dans le FRAGMENT (`#error=access_denied&error_code=otp_expired&…`).
 *    Le fragment ne quitte jamais le navigateur : le serveur ne l'a jamais vu, et une
 *    page rendue à l'avance dirait « votre adresse est confirmée » à quelqu'un dont le
 *    lien vient d'expirer. C'est pour ce cas-là que la page porte deux états.
 *
 * 2. NETTOYER L'URL. Le fragment est effacé de la barre d'adresse une fois lu — il ne
 *    porte pas de jeton, mais une URL d'erreur qui traîne dans un historique ou un
 *    partage n'apprend rien à personne d'utile.
 *
 * Le rebond vers `bitaqat://` n'est tenté QUE sur un appareil tactile. Sur un ordinateur
 * il ne produirait qu'une boîte de dialogue du système pour un schéma qu'aucune
 * application n'a enregistré — et le courriel s'ouvre souvent sur un ordinateur. Le
 * bouton, lui, reste visible partout : il n'y a jamais de rebond sans bouton.
 */
(function () {
  var section = document.querySelector('[data-app-retour]');
  if (!section) return;

  var succes = section.querySelector('[data-etat="succes"]');
  var echec = section.querySelector('[data-etat="echec"]');

  var fragment = window.location.hash.replace(/^#/, '');
  var params = new URLSearchParams(fragment);
  var erreur = params.get('error') || params.get('error_code');

  if (fragment) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  if (erreur) {
    if (succes) succes.hidden = true;
    if (echec) {
      echec.hidden = false;
      // Le titre de l'onglet a été rendu pour le cas nominal. Le laisser dire « Adresse
      // confirmée » au-dessus d'une page qui dit le contraire serait la pire des deux
      // réponses : c'est ce titre-là qui reste dans l'historique et dans un partage.
      var titre = echec.getAttribute('data-titre');
      if (titre) document.title = titre;
      // Le libellé brut de Supabase est en anglais et technique : il ne remplace pas le
      // texte de la page, il se range dessous pour qui sait quoi en faire.
      var description = params.get('error_description');
      var detail = echec.querySelector('[data-detail]');
      if (detail && description) {
        detail.textContent = description.replace(/\+/g, ' ');
        detail.hidden = false;
      }
    }
    return;
  }

  var scheme = section.getAttribute('data-scheme');
  var tactile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (scheme && tactile) {
    window.setTimeout(function () {
      window.location.href = scheme;
    }, 900);
  }
})();
