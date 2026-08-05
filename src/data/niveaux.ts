export type ThemeVariant = "clair" | "nuit";
export type Riwaya = "hafs" | "warsh";

export type CardFile = {
  label: string;
  riwaya?: Riwaya;
  hrefByTheme: Record<ThemeVariant, string>;
  imagesByTheme: Record<ThemeVariant, { recto: string; verso: string }>;
};

export type Palier = {
  id: string;
  numero: number | null;
  label: string;
  categorie: "ouverture" | "initiation" | "debutant" | "intermediaire" | "avance" | "initie";
  couleur: { nom: string; hex: string; texteClair: boolean };
  repere: string;
  objectifAnnuel: string;
  cumul: string;
  rythme: string;
  lieu: string;
  description: string;
  fichiers: CardFile[];
};

export const categories = {
  ouverture: { label: "Ouverture", description: "Une carte de bienvenue, avant même les premiers pas." },
  initiation: { label: "Initiation", description: "Avant le niveau 1 — pour les tout premiers pas." },
  debutant: { label: "Débutant", description: "Premiers pas, lecture accompagnée en classe." },
  intermediaire: { label: "Intermédiaire", description: "Autonomie progressive, apprentissage à la maison." },
  avance: { label: "Avancé", description: "Apprentissage autonome, objectifs ambitieux." },
  initie: { label: "Initié", description: "Au-delà de Yâcîn, pour les élèves les plus avancés." },
} as const;

export function cardFile(
  id: string,
  label: string,
  lang: string,
  opts?: { riwaya?: Riwaya; slug?: string }
): CardFile {
  const slug = opts?.slug ?? id;
  return {
    label,
    riwaya: opts?.riwaya,
    hrefByTheme: {
      clair: `/downloads/cartes/${lang}/carte-${slug}-clair.pdf`,
      nuit: `/downloads/cartes/${lang}/carte-${slug}-nuit.pdf`,
    },
    imagesByTheme: {
      clair: { recto: `carte-${slug}-recto-clair.png`, verso: `carte-${slug}-verso-clair.png` },
      nuit: { recto: `carte-${slug}-recto-nuit.png`, verso: `carte-${slug}-verso-nuit.png` },
    },
  };
}

export const paliers: Palier[] = [
  {
    id: "ouverture",
    numero: 0,
    label: "Carte d'ouverture",
    categorie: "ouverture",
    couleur: { nom: "Forêt", hex: "#1A4941", texteClair: true },
    repere: "Al-Fâtihah — l'ouverture du Qor'an",
    objectifAnnuel: "Al-Fâtihah (7 versets)",
    cumul: "—",
    rythme: "En classe, verset par verset",
    lieu: "En classe",
    description:
      "Carte de bienvenue qui ouvre la collection, pensée en particulier pour l'élève non arabophone : elle fait découvrir le principe de la carte de récitation à travers Al-Fâtihah, l'ouverture du Qor'an récitée à chaque prière.",
    fichiers: [cardFile("ouverture", "Carte d'ouverture (PDF)", "fr", { slug: "00-ouverture" })],
  },
  {
    id: "debutant-1",
    numero: null,
    label: "Carte de démarrage 1",
    categorie: "initiation",
    couleur: { nom: "Ivoire", hex: "#F4EFE6", texteClair: false },
    repere: "Al-Fîl → 10 sourates courtes",
    objectifAnnuel: "10 sourates courtes",
    cumul: "—",
    rythme: "En classe, lecture collective",
    lieu: "En classe",
    description: "Première carte pour aborder les sourates les plus courtes du Coran, avant même le hizb Sabbih.",
    fichiers: [cardFile("debutant-1", "Carte de démarrage 1 (PDF)", "fr", { slug: "debutant-01" })],
  },
  {
    id: "debutant-2",
    numero: null,
    label: "Carte de démarrage 2",
    categorie: "initiation",
    couleur: { nom: "Ivoire", hex: "#F4EFE6", texteClair: false },
    repere: "Ad-Douhâ → 10 sourates suivantes",
    objectifAnnuel: "10 sourates suivantes",
    cumul: "—",
    rythme: "En classe, lecture collective",
    lieu: "En classe",
    description: "Deuxième carte de démarrage, pour poursuivre l'apprentissage collectif avant le niveau 1.",
    fichiers: [cardFile("debutant-2", "Carte de démarrage 2 (PDF)", "fr", { slug: "debutant-02" })],
  },
  {
    id: "niveau-1",
    numero: 1,
    label: "Niveau 1",
    categorie: "debutant",
    couleur: { nom: "Blanc", hex: "#FFFFFF", texteClair: false },
    repere: "Hizb n°60 — Sabbih",
    objectifAnnuel: "1 hizb (n°60)",
    cumul: "1 hizb",
    rythme: "3 à 5 lignes / semaine",
    lieu: "En classe (apprentissage collectif)",
    description:
      "Pour les élèves débutants ayant une maîtrise minimale de la lecture. Apprentissage collectif en classe, avec transition progressive vers la maison en fin d'année.",
    fichiers: [cardFile("niveau-1", "Carte niveau 1 (PDF)", "fr", { slug: "01" })],
  },
  {
    id: "niveau-2",
    numero: 2,
    label: "Niveau 2",
    categorie: "intermediaire",
    couleur: { nom: "Jaune", hex: "#F5C518", texteClair: false },
    repere: "Hizb n°59 — 'Amma",
    objectifAnnuel: "1 hizb (n°59)",
    cumul: "2 hizb",
    rythme: "3 à 5 lignes / semaine",
    lieu: "À la maison (semi-autonome)",
    description:
      "Premier niveau d'apprentissage à la maison, avec la participation active des parents. Transition vers l'autonomie complète en fin d'année.",
    fichiers: [cardFile("niveau-2", "Carte niveau 2 (PDF)", "fr", { slug: "02" })],
  },
  {
    id: "niveau-3",
    numero: 3,
    label: "Niveau 3",
    categorie: "intermediaire",
    couleur: { nom: "Orange", hex: "#F0821F", texteClair: false },
    repere: "Hizb n°58-57 — Tabâraka",
    objectifAnnuel: "2 hizb",
    cumul: "4 hizb",
    rythme: "7 à 10 lignes / semaine",
    lieu: "À la maison (autonome)",
    description: "Apprentissage exclusivement à la maison, en autonomie complète. Les parents assurent le suivi quotidien.",
    fichiers: [cardFile("niveau-3", "Carte niveau 3 (PDF)", "fr", { slug: "03" })],
  },
  {
    id: "niveau-4",
    numero: 4,
    label: "Niveau 4",
    categorie: "avance",
    couleur: { nom: "Vert", hex: "#3E9142", texteClair: true },
    repere: "Hizb n°56-53 — Adhâriyât",
    objectifAnnuel: "4 hizb",
    cumul: "8 hizb",
    rythme: "15 à 20 lignes / semaine",
    lieu: "À la maison (autonome)",
    description: "Élèves avancés avec une bonne capacité d'apprentissage autonome. Objectif mensuel d'un demi-hizb.",
    fichiers: [cardFile("niveau-4", "Carte niveau 4 (PDF)", "fr", { slug: "04" })],
  },
  {
    id: "niveau-5",
    numero: 5,
    label: "Niveau 5",
    categorie: "avance",
    couleur: { nom: "Bleu", hex: "#2F6FED", texteClair: true },
    repere: "Hizb n°52-49 — As-Shoûrâ",
    objectifAnnuel: "4 hizb",
    cumul: "12 hizb",
    rythme: "15 à 20 lignes / semaine",
    lieu: "À la maison (autonome)",
    description: "Poursuite de l'apprentissage autonome, avec un rythme soutenu et une maîtrise consolidée des hizb précédents.",
    fichiers: [cardFile("niveau-5", "Carte niveau 5 (PDF)", "fr", { slug: "05" })],
  },
  {
    id: "niveau-6",
    numero: 6,
    label: "Niveau 6",
    categorie: "avance",
    couleur: { nom: "Marron", hex: "#7B4B2A", texteClair: true },
    repere: "Hizb n°48-45 — Yâcîn",
    objectifAnnuel: "4 hizb",
    cumul: "16 hizb",
    rythme: "15 à 20 lignes / semaine",
    lieu: "À la maison (autonome)",
    description: "Dernier niveau du parcours principal : le dernier quart du Coran, de Sabbih à Yâcîn, est mémorisé et maîtrisé.",
    fichiers: [cardFile("niveau-6", "Carte niveau 6 (PDF)", "fr", { slug: "06" })],
  },
  {
    id: "niveau-7",
    numero: 7,
    label: "Niveau 7",
    categorie: "initie",
    couleur: { nom: "Gris ardoise", hex: "#4B5563", texteClair: true },
    repere: "5 hizb — au-delà de Yâcîn",
    objectifAnnuel: "5 hizb",
    cumul: "21 hizb",
    rythme: "À définir avec le professeur",
    lieu: "À la maison (autonome)",
    description: "Pour les élèves ayant achevé le parcours principal et souhaitant poursuivre au-delà de Yâcîn.",
    fichiers: [
      cardFile("niveau-7", "Carte niveau 7 (PDF)", "fr", { slug: "07", riwaya: "hafs" }),
      cardFile("niveau-7", "Carte niveau 7 (PDF)", "fr", { slug: "07-warch", riwaya: "warsh" }),
    ],
  },
  {
    id: "niveau-8",
    numero: 8,
    label: "Niveau 8",
    categorie: "initie",
    couleur: { nom: "Noir", hex: "#111827", texteClair: true },
    repere: "5 hizb — pour les élèves initiés",
    objectifAnnuel: "5 hizb",
    cumul: "26 hizb",
    rythme: "À définir avec le professeur",
    lieu: "À la maison (autonome)",
    description: "Niveau le plus avancé du parcours, pour les élèves les plus assidus.",
    fichiers: [
      cardFile("niveau-8", "Carte niveau 8 (PDF)", "fr", { slug: "08", riwaya: "hafs" }),
      cardFile("niveau-8", "Carte niveau 8 (PDF)", "fr", { slug: "08-warch", riwaya: "warsh" }),
    ],
  },
];

export type Outil = {
  label: string;
  description: string;
  hrefByTheme: Record<ThemeVariant, string>;
  imageByTheme: Record<ThemeVariant, string>;
};

export function outilFiles(slug: string, lang: string): Pick<Outil, "hrefByTheme" | "imageByTheme"> {
  return {
    hrefByTheme: {
      clair: `/downloads/outils/${lang}/${slug}-clair.pdf`,
      nuit: `/downloads/outils/${lang}/${slug}-nuit.pdf`,
    },
    imageByTheme: {
      clair: `${slug}-clair.png`,
      nuit: `${slug}-nuit.png`,
    },
  };
}

export const outils: Outil[] = [
  {
    label: "Manuel des cartes et tableaux",
    description: "Description détaillée du fonctionnement de tous les outils de suivi.",
    ...outilFiles("manuel-cartes-et-tableaux", "fr"),
  },
  {
    label: "Tableau de devoirs",
    description: "Suivi hebdomadaire des devoirs à la maison.",
    ...outilFiles("tableau-devoirs", "fr"),
  },
  {
    label: "Fiche de suivi et de comportement",
    description: "Carte de suivi de la récitation et du comportement en classe.",
    ...outilFiles("fiche-suivi-comportement", "fr"),
  },
];

export const methodologieDocs = [
  {
    label: "Méthodologie complète (PDF)",
    description: "Le document de référence détaillant l'ensemble de la méthodologie pédagogique.",
    href: "/downloads/methodologie/fr/methodologie-complete.pdf",
    image: "methodologie-complete.png",
  },
  {
    label: "Présentation de la méthodologie (PDF)",
    description: "Support de présentation à destination des responsables pédagogiques des structures d'enseignement.",
    href: "/downloads/methodologie/fr/presentation.pdf",
    image: "presentation.png",
  },
];
