/**
 * Les romans de la série « Le Sceau des Étoiles », publiés sur Amazon au
 * profit du projet. Les liens sont construits à partir des ASIN : un seul
 * endroit à mettre à jour quand une édition est publiée.
 *
 * `null` = édition pas encore en ligne (la page affiche « bientôt disponible »).
 */

export type Edition = {
  /** ASIN Amazon, ou null tant que l'édition n'est pas en ligne. */
  ebook: string | null;
  paperback: string | null;
  /** Site de vente principal de cette édition. */
  store: "amazon.fr" | "amazon.com";
};

export const editions = {
  puits: {
    fr: { ebook: "B0HKG3Q651", paperback: "B0HKG3S5KM", store: "amazon.fr" },
    en: { ebook: "B0HCB533MB", paperback: "B0HKGLVWWM", store: "amazon.com" },
  },
  sceau: {
    fr: { ebook: "B0HCM9PMTX", paperback: "B0HCM9C3S8", store: "amazon.fr" },
    en: { ebook: "B0HCR971GG", paperback: "B0HCP1F1ZR", store: "amazon.com" },
  },
} satisfies Record<string, Record<"fr" | "en", Edition>>;

export function amazonUrl(edition: Edition, format: "ebook" | "paperback"): string | null {
  const asin = edition[format];
  return asin ? `https://www.${edition.store}/dp/${asin}` : null;
}
