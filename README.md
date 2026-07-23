# Bitaqat Hifd Qor'an

Site du kit de cartes de récitation pour l'apprentissage et la mémorisation du Qor'an — méthodologie pédagogique, cartes par niveau et outils de suivi, en libre téléchargement.

Construit avec [Astro](https://astro.build) et Tailwind CSS, déployé sur Cloudflare Pages.

## Commandes

| Commande            | Action                                       |
| :------------------- | :-------------------------------------------- |
| `npm install`         | Installe les dépendances                      |
| `npm run dev`          | Lance le serveur de dev sur `localhost:4321`  |
| `npm run build`        | Build de production dans `./dist/`            |
| `npm run preview`      | Prévisualise le build localement               |

## Structure

- `src/pages/` — les pages du site
- `src/components/`, `src/layouts/` — composants et gabarits partagés
- `src/data/niveaux.ts` — données des niveaux, couleurs et fichiers associés
- `public/downloads/` — cartes, outils de suivi et documents de méthodologie (PDF)

## Licences

- **Code source** (composants, gabarits, config) : [MIT](LICENSE)
- **Contenu pédagogique** (cartes, outils, méthodologie, dans `public/downloads/` et `src/assets/cartes/`) : [CC BY-NC 4.0](LICENSE-CONTENT.md) — partage et adaptation libres, non commercial, attribution requise.
