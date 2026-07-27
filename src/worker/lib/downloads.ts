import { paliers as paliersFr, outils as outilsFr, methodologieDocs as methodologieDocsFr } from "../../data/niveaux";
import { paliers as paliersEn, outils as outilsEn, methodologieDocs as methodologieDocsEn } from "../../data/niveaux.en";
import { paliers as paliersAr, outils as outilsAr, methodologieDocs as methodologieDocsAr } from "../../data/niveaux.ar";

const allPaliers = [...paliersFr, ...paliersEn, ...paliersAr];
const allOutils = [...outilsFr, ...outilsEn, ...outilsAr];
const allMethodologieDocs = [...methodologieDocsFr, ...methodologieDocsEn, ...methodologieDocsAr];

export const validDownloadPaths: Set<string> = new Set([
  ...allPaliers.flatMap((p) => p.fichiers.map((f) => f.href)),
  ...allOutils.map((o) => o.href),
  ...allMethodologieDocs.map((d) => d.href),
]);
