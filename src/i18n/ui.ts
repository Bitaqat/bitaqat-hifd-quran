export const languages = {
  fr: "Français",
  en: "English",
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "fr";

export const ui = {
  fr: {
    "nav.methodologie": "Méthodologie",
    "nav.niveaux": "Les niveaux",
    "nav.telechargements": "Téléchargements",
    "nav.contact": "Contact",
    "nav.cta": "Télécharger le kit",
    "footer.tagline":
      "Un kit d'apprentissage libre et gratuit pour la mémorisation du Qor'an, pensé pour les élèves, les parents et les professeurs.",
    "footer.project": "Le projet",
    "footer.info": "Informations",
    "footer.mentions": "Mentions légales",
    "footer.rights": "Œuvre libre, non commercialisable.",
    "footer.follow": "Suivez le projet sur X",
    "lang.switch": "English",
  },
  en: {
    "nav.methodologie": "Methodology",
    "nav.niveaux": "Levels",
    "nav.telechargements": "Downloads",
    "nav.contact": "Contact",
    "nav.cta": "Download the kit",
    "footer.tagline":
      "A free, open learning kit for Qur'an memorization, designed for students, parents and teachers.",
    "footer.project": "The project",
    "footer.info": "Information",
    "footer.mentions": "Legal notice",
    "footer.rights": "Free work, not for commercial use.",
    "footer.follow": "Follow the project on X",
    "lang.switch": "Français",
  },
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

export function withLang(path: string, lang: Lang) {
  if (lang === defaultLang) return path;
  return `/en${path}`;
}
