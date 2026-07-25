import { paliers, outils, methodologieDocs } from "../../data/niveaux";

export const validDownloadPaths: Set<string> = new Set([
  ...paliers.flatMap((p) => p.fichiers.map((f) => f.href)),
  ...outils.map((o) => o.href),
  ...methodologieDocs.map((d) => d.href),
]);
